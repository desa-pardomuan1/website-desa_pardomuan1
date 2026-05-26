import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Store,
  UtensilsCrossed,
  Coffee,
  Palette,
  Shirt,
  Sprout,
  Wrench,
  ExternalLink,
  User,
  Phone,
} from "lucide-react";
import { useState } from "react";

const kategoriIcons: Record<string, typeof Store> = {
  makanan: UtensilsCrossed,
  minuman: Coffee,
  kerajinan: Palette,
  fashion: Shirt,
  pertanian: Sprout,
  jasa: Wrench,
  lainnya: Store,
};

const kategoriLabels: Record<string, string> = {
  makanan: "Makanan",
  minuman: "Minuman",
  kerajinan: "Kerajinan",
  fashion: "Fashion",
  pertanian: "Pertanian",
  jasa: "Jasa",
  lainnya: "Lainnya",
};

export default function UmkmPage() {
  const { data: umkmList } = trpc.desa.umkm.list.useQuery();
  const [activeTab, setActiveTab] = useState("semua");

  const filtered =
    activeTab === "semua"
      ? umkmList
      : umkmList?.filter((u) => u.kategori === activeTab);

  return (
    <Layout>
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">UMKM & Pariwisata</h1>
          <p className="text-emerald-100 mt-2">
            Temukan produk unggulan dan usaha lokal desa
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
            {Object.entries(kategoriLabels).map(([key, label]) => {
              const Icon = kategoriIcons[key];
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

        {/* UMKM Grid */}
        {filtered && filtered.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((item) => {
              const Icon = kategoriIcons[item.kategori] || Store;
              return (
                <Card
                  key={item.id}
                  className="border-0 shadow-sm hover:shadow-lg transition-all overflow-hidden"
                >
                  <div className="h-52 overflow-hidden">
                    <img
                      src={
                        item.fotoUrl ||
                        "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600"
                      }
                      alt={item.namaProduk}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <CardContent className="p-5">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] px-2 py-0.5 bg-emerald-100 text-emerald-700 rounded-full font-medium capitalize flex items-center gap-1">
                        <Icon className="w-3 h-3" />
                        {kategoriLabels[item.kategori] || item.kategori}
                      </span>
                    </div>
                    <h3 className="font-semibold text-lg text-gray-900">
                      {item.namaProduk}
                    </h3>
                    {item.namaUsaha && (
                      <p className="text-sm text-emerald-600 font-medium">
                        {item.namaUsaha}
                      </p>
                    )}
                    {item.deskripsi && (
                      <p className="text-sm text-gray-600 mt-2 line-clamp-2">
                        {item.deskripsi}
                      </p>
                    )}
                    <div className="mt-4 pt-3 border-t border-gray-100 space-y-2">
                      {item.pemilik && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <User className="w-3.5 h-3.5" />
                          <span>Pemilik: {item.pemilik}</span>
                        </div>
                      )}
                      {item.kontak && (
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Phone className="w-3.5 h-3.5" />
                          <span>{item.kontak}</span>
                        </div>
                      )}
                    </div>
                    {item.link && (
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full"
                        asChild
                      >
                        <a
                          href={item.link}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Lihat Produk
                        </a>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <Store className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Data UMKM belum tersedia dalam kategori ini
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}
