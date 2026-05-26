import { trpc } from "@/providers/trpc";
import AdminLayout from "@/components/AdminLayout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Save, Settings, MapPin, Phone, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export default function AdminProfil() {
  const utils = trpc.useUtils();
  const { data: profil, isLoading } = trpc.desa.profil.list.useQuery();

  const setProfil = trpc.desa.profil.setMany.useMutation({
    onSuccess: () => {
      utils.desa.profil.list.invalidate();
      toast.success("Profil desa berhasil diperbarui!");
    },
    onError: () => toast.error("Gagal menyimpan perubahan"),
  });

  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (profil) {
      setForm({
        nama_desa: profil.nama_desa || "",
        kecamatan: profil.kecamatan || "",
        kabupaten: profil.kabupaten || "",
        provinsi: profil.provinsi || "",
        kode_pos: profil.kode_pos || "",
        visi: profil.visi || "",
        misi: profil.misi || "[]",
        sejarah: profil.sejarah || "",
        geografis: profil.geografis || "{}",
        kontak_wa: profil.kontak_wa || "",
        kontak_email: profil.kontak_email || "",
        kontak_telepon: profil.kontak_telepon || "",
        medsos: profil.medsos || "{}",
        google_maps_embed: profil.google_maps_embed || "",
        footer_teks: profil.footer_teks || "",
        footer_logo_url: profil.footer_logo_url || "",
        layanan_mandiri_url: profil.layanan_mandiri_url || "",
        logo_url: profil.logo_url || "",
      });
    }
  }, [profil]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setProfil.mutate(form);
  };

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4" />
          <div className="h-64 bg-gray-200 rounded" />
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Kelola Profil Desa
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Atur informasi umum tentang desa
            </p>
          </div>
          <Button
            onClick={handleSubmit}
            disabled={setProfil.isPending}
            className="bg-emerald-700 hover:bg-emerald-800"
          >
            <Save className="w-4 h-4 mr-2" />
            {setProfil.isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>

        <form onSubmit={handleSubmit}>
          <Tabs defaultValue="umum" className="space-y-6">
            <TabsList>
              <TabsTrigger value="umum">
                <Settings className="w-3 h-3 mr-1" />
                Umum
              </TabsTrigger>
              <TabsTrigger value="kontak">
                <Phone className="w-3 h-3 mr-1" />
                Kontak
              </TabsTrigger>
              <TabsTrigger value="media">
                <Share2 className="w-3 h-3 mr-1" />
                Media
              </TabsTrigger>
              <TabsTrigger value="lokasi">
                <MapPin className="w-3 h-3 mr-1" />
                Lokasi
              </TabsTrigger>
            </TabsList>

            <TabsContent value="umum">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nama Desa</Label>
                      <Input
                        value={form.nama_desa || ""}
                        onChange={(e) =>
                          setForm({ ...form, nama_desa: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Kecamatan</Label>
                      <Input
                        value={form.kecamatan || ""}
                        onChange={(e) =>
                          setForm({ ...form, kecamatan: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Kabupaten</Label>
                      <Input
                        value={form.kabupaten || ""}
                        onChange={(e) =>
                          setForm({ ...form, kabupaten: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Provinsi</Label>
                      <Input
                        value={form.provinsi || ""}
                        onChange={(e) =>
                          setForm({ ...form, provinsi: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Kode Pos</Label>
                      <Input
                        value={form.kode_pos || ""}
                        onChange={(e) =>
                          setForm({ ...form, kode_pos: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <Label>Logo URL</Label>
                      <Input
                        value={form.logo_url || ""}
                        onChange={(e) =>
                          setForm({ ...form, logo_url: e.target.value })
                        }
                        placeholder="https://example.com/logo.png"
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Visi</Label>
                    <Textarea
                      value={form.visi || ""}
                      onChange={(e) =>
                        setForm({ ...form, visi: e.target.value })
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>Misi (format JSON array)</Label>
                    <Textarea
                      value={form.misi || "[]"}
                      onChange={(e) =>
                        setForm({ ...form, misi: e.target.value })
                      }
                      rows={5}
                      placeholder='["Misi 1", "Misi 2"]'
                    />
                  </div>
                  <div>
                    <Label>Sejarah Desa</Label>
                    <Textarea
                      value={form.sejarah || ""}
                      onChange={(e) =>
                        setForm({ ...form, sejarah: e.target.value })
                      }
                      rows={8}
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="kontak">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>WhatsApp</Label>
                      <Input
                        value={form.kontak_wa || ""}
                        onChange={(e) =>
                          setForm({ ...form, kontak_wa: e.target.value })
                        }
                        placeholder="628123456789"
                      />
                    </div>
                    <div>
                      <Label>Telepon</Label>
                      <Input
                        value={form.kontak_telepon || ""}
                        onChange={(e) =>
                          setForm({ ...form, kontak_telepon: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <Label>Email</Label>
                    <Input
                      type="email"
                      value={form.kontak_email || ""}
                      onChange={(e) =>
                        setForm({ ...form, kontak_email: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="media">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>Media Sosial (JSON)</Label>
                    <Textarea
                      value={form.medsos || "{}"}
                      onChange={(e) =>
                        setForm({ ...form, medsos: e.target.value })
                      }
                      rows={5}
                      placeholder='{"facebook": "", "instagram": "", "youtube": ""}'
                    />
                  </div>
                  <div>
                    <Label>Footer Teks BPS</Label>
                    <Textarea
                      value={form.footer_teks || ""}
                      onChange={(e) =>
                        setForm({ ...form, footer_teks: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                  <div>
                    <Label>Footer Logo URL</Label>
                    <Input
                      value={form.footer_logo_url || ""}
                      onChange={(e) =>
                        setForm({ ...form, footer_logo_url: e.target.value })
                      }
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="lokasi">
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-4">
                  <div>
                    <Label>Data Geografis (JSON)</Label>
                    <Textarea
                      value={form.geografis || "{}"}
                      onChange={(e) =>
                        setForm({ ...form, geografis: e.target.value })
                      }
                      rows={10}
                      placeholder='{"luas": "", "batas_utara": "", "batas_selatan": "", "batas_barat": "", "batas_timur": "", "ketinggian": "", "iklim": ""}'
                    />
                  </div>
                  <div>
                    <Label>Google Maps Embed URL</Label>
                    <Textarea
                      value={form.google_maps_embed || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          google_maps_embed: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                  <div>
                    <Label>URL Layanan Mandiri</Label>
                    <Input
                      value={form.layanan_mandiri_url || ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          layanan_mandiri_url: e.target.value,
                        })
                      }
                      placeholder="https://"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </div>
    </AdminLayout>
  );
}
