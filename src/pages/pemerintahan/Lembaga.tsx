import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Users, User, UsersRound } from "lucide-react";

const jenisLabels: Record<string, { label: string; color: string }> = {
  pkk: { label: "PKK", color: "bg-pink-500" },
  karang_taruna: { label: "Karang Taruna", color: "bg-blue-500" },
  lpmd: { label: "LPMD", color: "bg-purple-500" },
  lainnya: { label: "Lembaga", color: "bg-gray-500" },
};

export default function LembagaPage() {
  const { data: lembagaList } = trpc.desa.lembaga.list.useQuery();

  const lembagaSosial =
    lembagaList?.filter(
      (l) =>
        l.jenis === "pkk" ||
        l.jenis === "karang_taruna" ||
        l.jenis === "lpmd" ||
        l.jenis === "lainnya"
    ) || [];

  return (
    <Layout>
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Lembaga Kemasyarakatan</h1>
          <p className="text-emerald-100 mt-2">
            Organisasi kemasyarakatan yang aktif di desa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {lembagaSosial.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {lembagaSosial.map((lembaga) => {
              const jenisInfo = jenisLabels[lembaga.jenis] || jenisLabels.lainnya;
              return (
                <Card
                  key={lembaga.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {lembaga.fotoUrl && (
                    <div className="h-44 overflow-hidden">
                      <img
                        src={lembaga.fotoUrl}
                        alt={lembaga.nama}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-3">
                      <span
                        className={`${jenisInfo.color} text-white text-[10px] px-2 py-0.5 rounded-full font-medium`}
                      >
                        {jenisInfo.label}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900 mb-2">
                      {lembaga.nama}
                    </h3>
                    {lembaga.deskripsi && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">
                        {lembaga.deskripsi}
                      </p>
                    )}
                    <div className="space-y-2 pt-3 border-t border-gray-100">
                      {lembaga.ketua && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <User className="w-4 h-4 text-emerald-600" />
                          <span>Ketua: {lembaga.ketua}</span>
                        </div>
                      )}
                      {lembaga.anggota && (
                        <div className="flex items-center gap-2 text-sm text-gray-700">
                          <Users className="w-4 h-4 text-emerald-600" />
                          <span>{lembaga.anggota} Anggota</span>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <UsersRound className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Data lembaga kemasyarakatan belum tersedia.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
