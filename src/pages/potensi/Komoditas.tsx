import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sprout, Fish, Beef, TreePine } from "lucide-react";
import { useState } from "react";

const jenisIcons: Record<string, typeof Sprout> = {
  pertanian: Sprout,
  peternakan: Beef,
  perikanan: Fish,
  perkebunan: TreePine,
};

const jenisLabels: Record<string, string> = {
  pertanian: "Pertanian",
  peternakan: "Peternakan",
  perikanan: "Perikanan",
  perkebunan: "Perkebunan",
};

export default function KomoditasPage() {
  const { data: komoditasList } = trpc.desa.komoditas.list.useQuery();
  const [activeTab, setActiveTab] = useState("semua");

  const filtered =
    activeTab === "semua"
      ? komoditasList
      : komoditasList?.filter((k) => k.jenis === activeTab);

  return (
    <Layout>
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Pertanian & Peternakan</h1>
          <p className="text-emerald-100 mt-2">
            Komoditas unggulan dan potensi pertanian desa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Filter Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent">
            <TabsTrigger
              value="semua"
              className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
            >
              Semua
            </TabsTrigger>
            {Object.entries(jenisLabels).map(([key, label]) => {
              const Icon = jenisIcons[key];
              return (
                <TabsTrigger
                  key={key}
                  value={key}
                  className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
                >
                  <Icon className="w-3 h-3 mr-1" />
                  {label}
                </TabsTrigger>
              );
            })}
          </TabsList>
        </Tabs>

        {/* Komoditas Grid */}
        {filtered && filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const Icon = jenisIcons[item.jenis] || Sprout;
              return (
                <Card
                  key={item.id}
                  className="border-0 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                >
                  {item.fotoUrl && (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={item.fotoUrl}
                        alt={item.nama}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="h-8 w-8 bg-emerald-100 rounded-lg flex items-center justify-center">
                        <Icon className="h-4 w-4 text-emerald-700" />
                      </div>
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium capitalize">
                        {jenisLabels[item.jenis] || item.jenis}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.nama}
                    </h3>
                    {item.deskripsi && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {item.deskripsi}
                      </p>
                    )}
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                      {item.luasLahan && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Luas Lahan</span>
                          <span className="font-medium text-gray-900">
                            {item.luasLahan} Ha
                          </span>
                        </div>
                      )}
                      {item.hasilProduksi && (
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-500">Produksi</span>
                          <span className="font-medium text-gray-900">
                            {item.hasilProduksi} {item.satuan}
                          </span>
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
              <Sprout className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Data komoditas belum tersedia dalam kategori ini
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
