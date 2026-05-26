import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MapPin,
  Mountain,
  Thermometer,
  Compass,
  Navigation,
  Ruler,
} from "lucide-react";

export default function GeografisPage() {
  const { data: profil } = trpc.desa.profil.list.useQuery();
  const { data: statistik } = trpc.desa.statistik.getLatest.useQuery();

  const geografisRaw = profil?.geografis || "{}";
  let geografis: Record<string, string> = {};
  try {
    geografis = JSON.parse(geografisRaw);
  } catch {
    geografis = {};
  }

  const namaDesa = profil?.nama_desa || "Desa";
  const kecamatan = profil?.kecamatan || "Kecamatan";
  const kabupaten = profil?.kabupaten || "Kabupaten";
  const googleMapsEmbed = profil?.google_maps_embed || "";

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Kondisi Geografis</h1>
          <p className="text-emerald-100 mt-2">
            Informasi geografis dan karakteristik wilayah {namaDesa}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Statistik Geografis */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="h-12 w-12 bg-emerald-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Ruler className="h-6 w-6 text-emerald-700" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {statistik?.luasWilayah || "0"}
              </p>
              <p className="text-xs text-gray-500">Hektar Luas Wilayah</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="h-12 w-12 bg-blue-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <MapPin className="h-6 w-6 text-blue-700" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {statistik?.jumlahDusun || "0"}
              </p>
              <p className="text-xs text-gray-500">Jumlah Dusun</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="h-12 w-12 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Navigation className="h-6 w-6 text-orange-700" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {statistik?.jumlahRT || "0"}
              </p>
              <p className="text-xs text-gray-500">Jumlah RT</p>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5 text-center">
              <div className="h-12 w-12 bg-purple-100 rounded-xl flex items-center justify-center mx-auto mb-3">
                <Compass className="h-6 w-6 text-purple-700" />
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {statistik?.jumlahRW || "0"}
              </p>
              <p className="text-xs text-gray-500">Jumlah RW</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Detail Geografis */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                Detail Wilayah
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Compass className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Batas Wilayah
                    </p>
                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>
                        <span className="font-medium">Utara:</span>{" "}
                        {geografis.batas_utara || "-"}
                      </p>
                      <p>
                        <span className="font-medium">Selatan:</span>{" "}
                        {geografis.batas_selatan || "-"}
                      </p>
                      <p>
                        <span className="font-medium">Barat:</span>{" "}
                        {geografis.batas_barat || "-"}
                      </p>
                      <p>
                        <span className="font-medium">Timur:</span>{" "}
                        {geografis.batas_timur || "-"}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Mountain className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Ketinggian
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {geografis.ketinggian || "-"}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Thermometer className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">Iklim</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {geografis.iklim || "-"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Google Maps */}
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-emerald-700" />
                Peta Lokasi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {googleMapsEmbed ? (
                <div className="rounded-lg overflow-hidden border border-gray-200">
                  <iframe
                    src={googleMapsEmbed}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Peta ${namaDesa}`}
                    className="rounded-lg"
                  />
                </div>
              ) : (
                <div className="h-72 bg-gray-100 rounded-lg flex items-center justify-center">
                  <div className="text-center text-gray-400">
                    <MapPin className="w-10 h-10 mx-auto mb-2" />
                    <p className="text-sm">Peta lokasi belum tersedia</p>
                    <p className="text-xs mt-1">
                      {namaDesa}, {kecamatan}, {kabupaten}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
