import { useState } from "react";
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
import { Plus, Pencil, Trash2, ClipboardList } from "lucide-react";
import { toast } from "sonner";

export default function AdminPanduan() {
  const utils = trpc.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ judul: "", konten: "", filePdf: "", kategori: "", urutan: 0 });

  const { data: panduanList, isLoading } = trpc.desa.panduan.list.useQuery();

  const create = trpc.desa.panduan.create.useMutation({
    onSuccess: () => { utils.desa.panduan.list.invalidate(); setDialogOpen(false); resetForm(); toast.success("Berhasil ditambahkan!"); },
    onError: () => toast.error("Gagal menambahkan"),
  });
  const update = trpc.desa.panduan.update.useMutation({
    onSuccess: () => { utils.desa.panduan.list.invalidate(); setDialogOpen(false); resetForm(); toast.success("Berhasil diperbarui!"); },
    onError: () => toast.error("Gagal memperbarui"),
  });
  const deleteMutation = trpc.desa.panduan.delete.useMutation({
    onSuccess: () => { utils.desa.panduan.list.invalidate(); toast.success("Berhasil dihapus!"); },
    onError: () => toast.error("Gagal menghapus"),
  });

  const resetForm = () => { setForm({ judul: "", konten: "", filePdf: "", kategori: "", urutan: 0 }); setEditingId(null); };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ judul: item.judul, konten: item.konten, filePdf: item.filePdf || "", kategori: item.kategori || "", urutan: item.urutan || 0 });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = { ...form, urutan: form.urutan || 0 };
    if (editingId) update.mutate({ id: editingId, ...data });
    else create.mutate(data);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Kelola Panduan</h1>
            <p className="text-gray-500 text-sm mt-1">Prosedur layanan publik</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => { resetForm(); setDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" /> Tambah
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingId ? "Edit" : "Tambah"} Panduan</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label>Judul</Label>
                  <Input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Kategori</Label>
                    <Input value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} placeholder="Contoh: Dokumen Kependudukan" />
                  </div>
                  <div>
                    <Label>Urutan</Label>
                    <Input type="number" value={form.urutan} onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })} />
                  </div>
                </div>
                <div>
                  <Label>File PDF URL</Label>
                  <Input value={form.filePdf} onChange={(e) => setForm({ ...form, filePdf: e.target.value })} placeholder="https://..." />
                </div>
                <div>
                  <Label>Konten</Label>
                  <Textarea value={form.konten} onChange={(e) => setForm({ ...form, konten: e.target.value })} rows={10} required />
                </div>
                <Button type="submit" className="w-full bg-emerald-700 hover:bg-emerald-800" disabled={create.isPending || update.isPending}>
                  {create.isPending || update.isPending ? "Menyimpan..." : editingId ? "Perbarui" : "Simpan"}
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
                    <TableHead>Judul</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Urutan</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8">Memuat...</TableCell></TableRow>
                  ) : panduanList && panduanList.length > 0 ? (
                    panduanList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium max-w-xs truncate">{item.judul}</TableCell>
                        <TableCell>{item.kategori || "-"}</TableCell>
                        <TableCell>{item.urutan}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { if (confirm("Yakin ingin menghapus?")) deleteMutation.mutate({ id: item.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="text-center py-8"><ClipboardList className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">Tidak ada data</p></TableCell></TableRow>
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
