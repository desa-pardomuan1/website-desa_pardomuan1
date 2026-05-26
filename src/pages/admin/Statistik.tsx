import { useState } from "react";
import { trpc } from "@/providers/trpc";
import AdminLayout from "@/components/AdminLayout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, BarChart3 } from "lucide-react";
import { toast } from "sonner";

export default function AdminStatistik() {
  const utils = trpc.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({
    tahun: new Date().getFullYear(),
    totalPenduduk: 0,
    totalKK: 0,
    totalLakiLaki: 0,
    totalPerempuan: 0,
    luasWilayah: "",
    jumlahDusun: 0,
    jumlahRT: 0,
    jumlahRW: 0,
    dataPendidikan: "",
    dataAngkatanKerja: "",
    dataUsia: "",
  });

  const { data: statistikList, isLoading } = trpc.desa.statistik.list.useQuery();

  const create = trpc.desa.statistik.create.useMutation({
    onSuccess: () => {
      utils.desa.statistik.list.invalidate();
      utils.desa.statistik.getLatest.invalidate();
      setDialogOpen(false);
      resetForm();
      toast.success("Data statistik berhasil ditambahkan!");
    },
    onError: () => toast.error("Gagal menambahkan data"),
  });

  const update = trpc.desa.statistik.update.useMutation({
    onSuccess: () => {
      utils.desa.statistik.list.invalidate();
      utils.desa.statistik.getLatest.invalidate();
      setDialogOpen(false);
      resetForm();
      toast.success("Data statistik berhasil diperbarui!");
    },
    onError: () => toast.error("Gagal memperbarui data"),
  });

  const deleteMutation = trpc.desa.statistik.delete.useMutation({
    onSuccess: () => {
      utils.desa.statistik.list.invalidate();
      utils.desa.statistik.getLatest.invalidate();
      toast.success("Data statistik berhasil dihapus!");
    },
    onError: () => toast.error("Gagal menghapus data"),
  });

  const resetForm = () => {
    setForm({
      tahun: new Date().getFullYear(),
      totalPenduduk: 0,
      totalKK: 0,
      totalLakiLaki: 0,
      totalPerempuan: 0,
      luasWilayah: "",
      jumlahDusun: 0,
      jumlahRT: 0,
      jumlahRW: 0,
      dataPendidikan: "",
      dataAngkatanKerja: "",
      dataUsia: "",
    });
    setEditingId(null);
  };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({
      tahun: item.tahun,
      totalPenduduk: item.totalPenduduk || 0,
      totalKK: item.totalKK || 0,
      totalLakiLaki: item.totalLakiLaki || 0,
      totalPerempuan: item.totalPerempuan || 0,
      luasWilayah: item.luasWilayah || "",
      jumlahDusun: item.jumlahDusun || 0,
      jumlahRT: item.jumlahRT || 0,
      jumlahRW: item.jumlahRW || 0,
      dataPendidikan: item.dataPendidikan
        ? JSON.stringify(item.dataPendidikan, null, 2)
        : "",
      dataAngkatanKerja: item.dataAngkatanKerja
        ? JSON.stringify(item.dataAngkatanKerja, null, 2)
        : "",
      dataUsia: item.dataUsia
        ? JSON.stringify(item.dataUsia, null, 2)
        : "",
    });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data: any = {
      tahun: form.tahun,
      totalPenduduk: form.totalPenduduk,
      totalKK: form.totalKK,
      totalLakiLaki: form.totalLakiLaki,
      totalPerempuan: form.totalPerempuan,
      luasWilayah: form.luasWilayah,
      jumlahDusun: form.jumlahDusun,
      jumlahRT: form.jumlahRT,
      jumlahRW: form.jumlahRW,
    };
    if (form.dataPendidikan) {
      try {
        data.dataPendidikan = JSON.parse(form.dataPendidikan);
      } catch {
        toast.error("Format JSON data pendidikan tidak valid");
        return;
      }
    }
    if (form.dataAngkatanKerja) {
      try {
        data.dataAngkatanKerja = JSON.parse(form.dataAngkatanKerja);
      } catch {
        toast.error("Format JSON data angkatan kerja tidak valid");
        return;
      }
    }
    if (form.dataUsia) {
      try {
        data.dataUsia = JSON.parse(form.dataUsia);
      } catch {
        toast.error("Format JSON data usia tidak valid");
        return;
      }
    }
    if (editingId) {
      update.mutate({ id: editingId, ...data });
    } else {
      create.mutate(data);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              Kelola Statistik
            </h1>
            <p className="text-gray-500 text-sm mt-1">
              Data kependudukan dan demografi desa
            </p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                className="bg-emerald-700 hover:bg-emerald-800"
                onClick={() => {
                  resetForm();
                  setDialogOpen(true);
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Tambah Data
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>
                  {editingId ? "Edit Statistik" : "Tambah Statistik"}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Tahun</Label>
                    <Input
                      type="number"
                      value={form.tahun}
                      onChange={(e) =>
                        setForm({ ...form, tahun: parseInt(e.target.value) })
                      }
                      required
                    />
                  </div>
                  <div>
                    <Label>Total Penduduk</Label>
                    <Input
                      type="number"
                      value={form.totalPenduduk}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          totalPenduduk: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Total KK</Label>
                    <Input
                      type="number"
                      value={form.totalKK}
                      onChange={(e) =>
                        setForm({ ...form, totalKK: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Laki-laki</Label>
                    <Input
                      type="number"
                      value={form.totalLakiLaki}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          totalLakiLaki: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Perempuan</Label>
                    <Input
                      type="number"
                      value={form.totalPerempuan}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          totalPerempuan: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Luas Wilayah (Ha)</Label>
                    <Input
                      value={form.luasWilayah}
                      onChange={(e) =>
                        setForm({ ...form, luasWilayah: e.target.value })
                      }
                    />
                  </div>
                  <div>
                    <Label>Jumlah Dusun</Label>
                    <Input
                      type="number"
                      value={form.jumlahDusun}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          jumlahDusun: parseInt(e.target.value),
                        })
                      }
                    />
                  </div>
                  <div>
                    <Label>Jumlah RT</Label>
                    <Input
                      type="number"
                      value={form.jumlahRT}
                      onChange={(e) =>
                        setForm({ ...form, jumlahRT: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Jumlah RW</Label>
                    <Input
                      type="number"
                      value={form.jumlahRW}
                      onChange={(e) =>
                        setForm({ ...form, jumlahRW: parseInt(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Data Pendidikan (JSON)</Label>
                  <Textarea
                    value={form.dataPendidikan}
                    onChange={(e) =>
                      setForm({ ...form, dataPendidikan: e.target.value })
                    }
                    rows={4}
                    placeholder='{"tidakSekolah": 0, "sd": 0, "smp": 0, "sma": 0, "diploma": 0, "sarjana": 0}'
                  />
                </div>
                <div>
                  <Label>Data Angkatan Kerja (JSON)</Label>
                  <Textarea
                    value={form.dataAngkatanKerja}
                    onChange={(e) =>
                      setForm({ ...form, dataAngkatanKerja: e.target.value })
                    }
                    rows={3}
                    placeholder='{"bekerja": 0, "pengangguran": 0, "tidakBekerja": 0}'
                  />
                </div>
                <div>
                  <Label>Data Usia (JSON)</Label>
                  <Textarea
                    value={form.dataUsia}
                    onChange={(e) =>
                      setForm({ ...form, dataUsia: e.target.value })
                    }
                    rows={6}
                    placeholder='{"range0_4": 0, "range5_9": 0, ...}'
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-emerald-700 hover:bg-emerald-800"
                  disabled={create.isPending || update.isPending}
                >
                  {create.isPending || update.isPending
                    ? "Menyimpan..."
                    : editingId
                      ? "Perbarui"
                      : "Simpan"}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tahun</TableHead>
                    <TableHead>Penduduk</TableHead>
                    <TableHead>KK</TableHead>
                    <TableHead>L/P</TableHead>
                    <TableHead>Wilayah</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        Memuat...
                      </TableCell>
                    </TableRow>
                  ) : statistikList && statistikList.length > 0 ? (
                    statistikList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">
                          {item.tahun}
                        </TableCell>
                        <TableCell>
                          {item.totalPenduduk?.toLocaleString("id-ID")}
                        </TableCell>
                        <TableCell>{item.totalKK}</TableCell>
                        <TableCell>
                          {item.totalLakiLaki}/{item.totalPerempuan}
                        </TableCell>
                        <TableCell>{item.luasWilayah} Ha</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="text-red-600"
                              onClick={() => {
                                if (confirm("Yakin ingin menghapus?")) {
                                  deleteMutation.mutate({ id: item.id });
                                }
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <BarChart3 className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                        <p className="text-gray-500">Tidak ada data</p>
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
