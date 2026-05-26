import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ImageIcon, Calendar } from "lucide-react";
import { useState } from "react";

const kategoriLabels: Record<string, string> = {
  kegiatan: "Kegiatan",
  infraastruktur: "Infrastruktur",
  pariwisata: "Pariwisata",
  umkm: "UMKM",
  pertanian: "Pertanian",
  infografis: "Infografis",
  lainnya: "Lainnya",
};

export default function GaleriPage() {
  const { data: galeriList } = trpc.desa.galeri.list.useQuery();
  const [selectedKategori, setSelectedKategori] = useState("semua");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const filtered =
    selectedKategori === "semua"
      ? galeriList
      : galeriList?.filter((g) => g.kategori === selectedKategori);

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Galeri & Infografis</h1>
          <p className="text-emerald-100 mt-2">
            Dokumentasi kegiatan dan publikasi desa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Filter Tabs */}
        <Tabs
          value={selectedKategori}
          onValueChange={setSelectedKategori}
          className="w-full"
        >
          <TabsList className="flex flex-wrap h-auto gap-1 bg-transparent">
            <TabsTrigger
              value="semua"
              className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
            >
              Semua
            </TabsTrigger>
            {Object.entries(kategoriLabels).map(([key, label]) => (
              <TabsTrigger
                key={key}
                value={key}
                className="data-[state=active]:bg-emerald-700 data-[state=active]:text-white"
              >
                {label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {/* Gallery Grid */}
        {filtered && filtered.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtered.map((item) => (
              <Card
                key={item.id}
                className="border-0 shadow-sm hover:shadow-lg transition-all cursor-pointer overflow-hidden group"
                onClick={() => setSelectedItem(item)}
              >
                <div className="aspect-square overflow-hidden">
                  <img
                    src={item.gambarUrl}
                    alt={item.judul}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
                <CardContent className="p-3">
                  <Badge
                    variant="secondary"
                    className="text-[10px] mb-1"
                  >
                    {kategoriLabels[item.kategori] || item.kategori}
                  </Badge>
                  <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                    {item.judul}
                  </h3>
                  {item.tanggal && (
                    <p className="text-[10px] text-gray-400 flex items-center gap-1 mt-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.tanggal)}
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Tidak ada foto dalam kategori ini
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Lightbox Dialog */}
      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden">
          <DialogTitle className="sr-only">
            {selectedItem?.judul || "Preview"}
          </DialogTitle>
          {selectedItem && (
            <div>
              <img
                src={selectedItem.gambarUrl}
                alt={selectedItem.judul}
                className="w-full max-h-[70vh] object-contain bg-black"
              />
              <div className="p-4">
                <Badge variant="secondary" className="mb-2">
                  {kategoriLabels[selectedItem.kategori] || selectedItem.kategori}
                </Badge>
                <h3 className="font-semibold text-lg">{selectedItem.judul}</h3>
                {selectedItem.deskripsi && (
                  <p className="text-sm text-gray-500 mt-1">
                    {selectedItem.deskripsi}
                  </p>
                )}
                {selectedItem.tanggal && (
                  <p className="text-xs text-gray-400 flex items-center gap-1 mt-2">
                    <Calendar className="w-3 h-3" />
                    {formatDate(selectedItem.tanggal)}
                  </p>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Layout>
  );
}
