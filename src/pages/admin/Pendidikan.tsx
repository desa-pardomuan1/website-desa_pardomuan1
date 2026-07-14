import { useState } from "react";
import { trpc } from "@/providers/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, BookOpen } from "lucide-react";
import { toast } from "sonner";
import { parseGoogleDriveUrl } from "@/lib/utils";

const jenjangOptions = [
  { value: "paud", label: "PAUD" },
  { value: "tk", label: "TK" },
  { value: "sd", label: "SD" },
  { value: "smp", label: "SMP" },
  { value: "sma", label: "SMA" },
  { value: "smk", label: "SMK" },
  { value: "d1", label: "Diploma I" },
  { value: "d2", label: "Diploma II" },
  { value: "d3", label: "Diploma III" },
  { value: "d4", label: "Diploma IV" },
  { value: "s1", label: "Sarjana (S1)" },
  { value: "s2", label: "Magister (S2)" },
  { value: "s3", label: "Doktor (S3)" },
];

const akreditasiOptions = [
  { value: "A", label: "A" },
  { value: "B", label: "B" },
  { value: "C", label: "C" },
  { value: "Belum", label: "Belum Terakreditasi" },
];

export default function AdminPendidikan() {
  const utils = trpc.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    namaSarana: "",
    jenjang: "sd" as any,
    alamat: "",
    latitude: "",
    longitude: "",
    kepala: "",
    kontakNomor: "",
    kontakEmail: "",
    deskripsi: "",
    fotoUrl: "",
    jumlahGuru: "",
    jumlahSiswa: "",
    tahunBerdiri: "",
    statusAkreditasi: "",
    urutan: 0,
  });

  const { data: pendidikanList, isLoading } =
    trpc.desa.pendidikan.list.useQuery();

  const create = trpc.desa.pendidikan.create.useMutation({
    onSuccess: () => {
      utils.desa.pendidikan.list.invalidate();
      setDialogOpen(false);
      resetForm();
      toast.success("Sarana Pendidikan berhasil ditambahkan!");
    },
    onError: () => toast.error("Gagal menambahkan sarana pendidikan"),
  });

  const update = trpc.desa.pendidikan.update.useMutation({
    onSuccess: () => {
      utils.desa.pendidikan.list.invalidate();
      setDialogOpen(false);
      resetForm();
      toast.success("Sarana Pendidikan berhasil diperbarui!");
    },
    onError: () => toast.error("Gagal memperbarui sarana pendidikan"),
  });

  const deleteMutation = trpc.desa.pendidikan.delete.useMutation({
    onSuccess: () => {
      utils.desa.pendidikan.list.invalidate();
      toast.success("Sarana Pendidikan berhasil dihapus!");
    },
    onError: () => toast.error("Gagal menghapus sarana pendidikan"),
  });

  const resetForm = () => {
    setForm({
      namaSarana: "",
      jenjang: "sd" as any,
      alamat: "",
      latitude: "",
      longitude: "",
      kepala: "",
      kontakNomor: "",
      kontakEmail: "",
      deskripsi: "",
      fotoUrl: "",
      jumlahGuru: "",
      jumlahSiswa: "",
      tahunBerdiri: "",
      statusAkreditasi: "",
      urutan: 0,
    });
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      namaSarana: item.namaSarana || "",
      jenjang: item.jenjang,
      alamat: item.alamat || "",
      latitude: item.latitude || "",
      longitude: item.longitude || "",
      kepala: item.kepala || "",
      kontakNomor: item.kontakNomor || "",
      kontakEmail: item.kontakEmail || "",
      deskripsi: item.deskripsi || "",
      fotoUrl: item.fotoUrl || "",
      jumlahGuru: item.jumlahGuru || "",
      jumlahSiswa: item.jumlahSiswa || "",
      tahunBerdiri: item.tahunBerdiri || "",
      statusAkreditasi: item.statusAkreditasi || "",
      urutan: item.urutan || 0,
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.namaSarana || !form.alamat) {
      toast.error("Nama dan alamat harus diisi");
      return;
    }
    
    // Convert string fields to numbers (sesuaikan dengan schema zod di backend)
    const submitData = {
      ...form,
      latitude: form.latitude ? parseFloat(form.latitude) : undefined,
      longitude: form.longitude ? parseFloat(form.longitude) : undefined,
      jumlahGuru: form.jumlahGuru ? parseInt(form.jumlahGuru, 10) : undefined,
      jumlahSiswa: form.jumlahSiswa ? parseInt(form.jumlahSiswa, 10) : undefined,
      tahunBerdiri: form.tahunBerdiri ? parseInt(form.tahunBerdiri, 10) : undefined,
      urutan: Number(form.urutan ?? 0),
    };
    
    if (editingId) update.mutate({ id: editingId, ...submitData });
    else create.mutate(submitData);
  };

  const getJenjangLabel = (jenjang: string) => {
    return jenjangOptions.find((j) => j.value === jenjang)?.label || jenjang;
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Kelola Pendidikan
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Mengelola daftar sarana pendidikan dari PAUD hingga Perguruan
              Tinggi
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800"
                onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" /> Tambah Sarana Pendidikan
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl">
                  {editingId ? "Edit" : "Tambah"} Sarana Pendidikan
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Bagian Informasi Dasar */}
                <div className="space-y-4 border-b pb-4">
                  <h3 className="font-semibold text-gray-700">Informasi Dasar</h3>
                  <div>
                    <Label className="text-gray-700">Nama Sarana *</Label>
                    <Input
                      value={form.namaSarana}
                      onChange={(e) =>
                        setForm({ ...form, namaSarana: e.target.value })
                      }
                      placeholder="Contoh: SMA Negeri 1 Desa..."
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Jenjang Pendidikan *</Label>
                    <Select
                      value={form.jenjang}
                      onValueChange={(value) =>
                        setForm({ ...form, jenjang: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {jenjangOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-gray-700">Alamat *</Label>
                    <Input
                      value={form.alamat}
                      onChange={(e) =>
                        setForm({ ...form, alamat: e.target.value })
                      }
                      placeholder="Contoh: Jl. Pendidikan No. 123"
                      required
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700">Latitude</Label>
                      <Input
                        value={form.latitude}
                        onChange={(e) =>
                          setForm({ ...form, latitude: e.target.value })
                        }
                        placeholder="-6.1234"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Longitude</Label>
                      <Input
                        value={form.longitude}
                        onChange={(e) =>
                          setForm({ ...form, longitude: e.target.value })
                        }
                        placeholder="107.5678"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian Pimpinan & Kontak */}
                <div className="space-y-4 border-b pb-4">
                  <h3 className="font-semibold text-gray-700">
                    Pimpinan & Kontak
                  </h3>
                  <div>
                    <Label className="text-gray-700">Nama Kepala/Pimpinan</Label>
                    <Input
                      value={form.kepala}
                      onChange={(e) =>
                        setForm({ ...form, kepala: e.target.value })
                      }
                      placeholder="Contoh: Ibu Siti Nurhaliza, S.Pd"
                      className="mt-1"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-gray-700">Nomor Telepon</Label>
                      <Input
                        value={form.kontakNomor}
                        onChange={(e) =>
                          setForm({ ...form, kontakNomor: e.target.value })
                        }
                        placeholder="+6281234567890"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Email</Label>
                      <Input
                        value={form.kontakEmail}
                        onChange={(e) =>
                          setForm({ ...form, kontakEmail: e.target.value })
                        }
                        placeholder="info@sekolah.sch.id"
                        type="email"
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Bagian Data Sekolah */}
                <div className="space-y-4 border-b pb-4">
                  <h3 className="font-semibold text-gray-700">Data Sekolah</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label className="text-gray-700">Jumlah Guru</Label>
                      <Input
                        type="number"
                        value={form.jumlahGuru}
                        onChange={(e) =>
                          setForm({ ...form, jumlahGuru: e.target.value })
                        }
                        placeholder="30"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Jumlah Siswa</Label>
                      <Input
                        type="number"
                        value={form.jumlahSiswa}
                        onChange={(e) =>
                          setForm({ ...form, jumlahSiswa: e.target.value })
                        }
                        placeholder="500"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-gray-700">Tahun Berdiri</Label>
                      <Input
                        type="number"
                        value={form.tahunBerdiri}
                        onChange={(e) =>
                          setForm({ ...form, tahunBerdiri: e.target.value })
                        }
                        placeholder="2010"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div>
                    <Label className="text-gray-700">Status Akreditasi</Label>
                    <Select
                      value={form.statusAkreditasi}
                      onValueChange={(value) =>
                        setForm({ ...form, statusAkreditasi: value })
                      }
                    >
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Pilih Status Akreditasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {akreditasiOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Bagian Deskripsi & Foto */}
                <div className="space-y-4">
                  <div>
                    <Label className="text-gray-700">Foto URL</Label>
                    <Input
                      value={form.fotoUrl}
                      onChange={(e) =>
                        setForm({ ...form, fotoUrl: parseGoogleDriveUrl(e.target.value) })
                      }
                      placeholder="https://..."
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Deskripsi</Label>
                    <Textarea
                      value={form.deskripsi}
                      onChange={(e) =>
                        setForm({ ...form, deskripsi: e.target.value })
                      }
                      placeholder="Deskripsi sarana pendidikan..."
                      rows={4}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label className="text-gray-700">Urutan</Label>
                    <Input
                      type="number"
                      value={form.urutan}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          urutan: parseInt(e.target.value) || 0,
                        })
                      }
                      className="mt-1"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-blue-700 to-cyan-700 hover:from-blue-800 hover:to-cyan-800"
                  disabled={create.isPending || update.isPending}
                >
                  {create.isPending || update.isPending
                    ? "Menyimpan..."
                    : editingId
                    ? "Perbarui Sarana"
                    : "Simpan Sarana"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Table */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8">
                <p className="text-gray-500">Loading...</p>
              </div>
            ) : pendidikanList && pendidikanList.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50">
                      <TableHead className="font-semibold">Nama</TableHead>
                      <TableHead className="font-semibold">Jenjang</TableHead>
                      <TableHead className="font-semibold">Kepala</TableHead>
                      <TableHead className="font-semibold">Siswa/Guru</TableHead>
                      <TableHead className="font-semibold">Akreditasi</TableHead>
                      <TableHead className="font-semibold text-center">
                        Aksi
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendidikanList.map((item) => (
                      <TableRow key={item.id} className="hover:bg-gray-50">
                        <TableCell className="font-medium">
                          {item.namaSarana}
                        </TableCell>
                        <TableCell className="text-sm">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            {getJenjangLabel(item.jenjang)}
                          </span>
                        </TableCell>
                        <TableCell className="text-sm text-gray-600">
                          {item.kepala || "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.jumlahSiswa && item.jumlahGuru
                            ? `${item.jumlahSiswa} siswa / ${item.jumlahGuru} guru`
                            : "-"}
                        </TableCell>
                        <TableCell className="text-sm">
                          {item.statusAkreditasi ? (
                            <span
                              className={`px-2 py-1 rounded text-xs font-semibold ${
                                item.statusAkreditasi === "A"
                                  ? "bg-green-100 text-green-800"
                                  : item.statusAkreditasi === "B"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : item.statusAkreditasi === "C"
                                  ? "bg-orange-100 text-orange-800"
                                  : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.statusAkreditasi}
                            </span>
                          ) : (
                            "-"
                          )}
                        </TableCell>
                        <TableCell className="text-center space-x-2">
                          <Button
                            size="sm"
                            onClick={() => handleEdit(item)}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Pencil className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => deleteMutation.mutate({ id: item.id })}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-4">
                  Belum ada data sarana pendidikan
                </p>
                <Button
                  className="bg-blue-700 hover:bg-blue-800"
                  onClick={() => {
                    resetForm();
                    setDialogOpen(true);
                  }}
                >
                  <Plus className="w-4 h-4 mr-2" /> Tambah Sarana Pendidikan
                  Pertama
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
