import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageSquare,
  Facebook,
  Instagram,
  Youtube,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function KontakPage() {
  const { data: profil } = trpc.desa.profil.list.useQuery();
  const createPengaduan = trpc.desa.pengaduan.create.useMutation({
    onSuccess: () => {
      toast.success("Pesan berhasil dikirim! Terima kasih atas masukannya.");
      setForm({ nama: "", kontak: "", email: "", pesan: "" });
    },
    onError: () => {
      toast.error("Gagal mengirim pesan. Silakan coba lagi.");
    },
  });

  const [form, setForm] = useState({
    nama: "",
    kontak: "",
    email: "",
    pesan: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.nama || !form.kontak || !form.pesan) {
      toast.error("Mohon lengkapi semua field yang wajib diisi");
      return;
    }
    createPengaduan.mutate(form);
  };

  const namaDesa = profil?.nama_desa || "Desa";
  const kecamatan = profil?.kecamatan || "";
  const kabupaten = profil?.kabupaten || "";
  const kontakWa = profil?.kontak_wa || "";
  const kontakEmail = profil?.kontak_email || "";
  const kontakTelepon = profil?.kontak_telepon || "";
  const googleMapsEmbed = profil?.google_maps_embed || "";
  const medsos = profil?.medsos
    ? JSON.parse(profil.medsos)
    : { facebook: "", instagram: "", youtube: "" };

  return (
    <Layout>
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Kontak & Pengaduan</h1>
          <p className="text-emerald-100 mt-2">
            Hubungi kami atau sampaikan pengaduan Anda
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-emerald-700" />
                  Informasi Kontak
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">Alamat</p>
                    <p className="text-sm text-gray-600">
                      Kantor {namaDesa}
                      {kecamatan && `, ${kecamatan}`}
                      {kabupaten && `, ${kabupaten}`}
                    </p>
                  </div>
                </div>

                {kontakTelepon && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        Telepon
                      </p>
                      <p className="text-sm text-gray-600">{kontakTelepon}</p>
                    </div>
                  </div>
                )}

                {kontakWa && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Phone className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        WhatsApp
                      </p>
                      <a
                        href={`https://wa.me/${kontakWa.replace(/[^0-9]/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-emerald-600 hover:underline"
                      >
                        {kontakWa}
                      </a>
                    </div>
                  </div>
                )}

                {kontakEmail && (
                  <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                    <Mail className="w-5 h-5 text-emerald-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-sm text-gray-900">
                        Email
                      </p>
                      <a
                        href={`mailto:${kontakEmail}`}
                        className="text-sm text-emerald-600 hover:underline"
                      >
                        {kontakEmail}
                      </a>
                    </div>
                  </div>
                )}

                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                  <Clock className="w-5 h-5 text-emerald-600 mt-0.5" />
                  <div>
                    <p className="font-medium text-sm text-gray-900">
                      Jam Operasional
                    </p>
                    <p className="text-sm text-gray-600">
                      Senin - Jumat: 08.00 - 16.00 WIB
                    </p>
                    <p className="text-sm text-gray-600">
                      Sabtu: 08.00 - 12.00 WIB
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Media */}
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5 text-emerald-700" />
                  Media Sosial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {medsos.facebook && (
                    <a
                      href={`https://facebook.com/${medsos.facebook}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                    >
                      <Facebook className="w-4 h-4" />
                      Facebook
                    </a>
                  )}
                  {medsos.instagram && (
                    <a
                      href={`https://instagram.com/${medsos.instagram.replace("@", "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-pink-50 text-pink-700 rounded-lg hover:bg-pink-100 transition-colors text-sm"
                    >
                      <Instagram className="w-4 h-4" />
                      Instagram
                    </a>
                  )}
                  {medsos.youtube && (
                    <a
                      href={`https://youtube.com/${medsos.youtube}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors text-sm"
                    >
                      <Youtube className="w-4 h-4" />
                      YouTube
                    </a>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Map */}
            {googleMapsEmbed && (
              <Card className="border-0 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-emerald-700" />
                    Peta Lokasi
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <iframe
                      src={googleMapsEmbed}
                      width="100%"
                      height="250"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`Peta ${namaDesa}`}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Contact Form */}
          <div>
            <Card className="border-0 shadow-sm sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Send className="w-5 h-5 text-emerald-700" />
                  Formulir Pengaduan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="nama">
                      Nama Lengkap <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nama"
                      value={form.nama}
                      onChange={(e) =>
                        setForm({ ...form, nama: e.target.value })
                      }
                      placeholder="Masukkan nama Anda"
                    />
                  </div>
                  <div>
                    <Label htmlFor="kontak">
                      No. HP/WhatsApp <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="kontak"
                      value={form.kontak}
                      onChange={(e) =>
                        setForm({ ...form, kontak: e.target.value })
                      }
                      placeholder="Contoh: 08123456789"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email (opsional)</Label>
                    <Input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) =>
                        setForm({ ...form, email: e.target.value })
                      }
                      placeholder="email@example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pesan">
                      Pesan/Pengaduan <span className="text-red-500">*</span>
                    </Label>
                    <Textarea
                      id="pesan"
                      rows={5}
                      value={form.pesan}
                      onChange={(e) =>
                        setForm({ ...form, pesan: e.target.value })
                      }
                      placeholder="Tulis pesan atau pengaduan Anda di sini..."
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full bg-emerald-700 hover:bg-emerald-800"
                    disabled={createPengaduan.isPending}
                  >
                    {createPengaduan.isPending ? (
                      "Mengirim..."
                    ) : (
                      <>
                        <Send className="w-4 h-4 mr-2" />
                        Kirim Pesan
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Layout>
  );
}
