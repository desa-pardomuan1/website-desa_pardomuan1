import { useState } from "react";
import { trpc } from "@/providers/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, FileText } from "lucide-react";
import { toast } from "sonner";

export default function AdminDokumen() {
  const utils = trpc.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ judul: "", fileUrl: "", deskripsi: "", kategori: "", urutan: 0 });

  const { data: dokumenList, isLoading } = trpc.desa.dokumen.list.useQuery();

  const create = trpc.desa.dokumen.create.useMutation({
    onSuccess: () => { utils.desa.dokumen.list.invalidate(); setDialogOpen(false); resetForm(); toast.success("Berhasil ditambahkan!"); },
    onError: () => toast.error("Gagal menambahkan"),
  });
  const update = trpc.desa.dokumen.update.useMutation({
    onSuccess: () => { utils.desa.dokumen.list.invalidate(); setDialogOpen(false); resetForm(); toast.success("Berhasil diperbarui!"); },
    onError: () => toast.error("Gagal memperbarui"),
  });
  const deleteMutation = trpc.desa.dokumen.delete.useMutation({
    onSuccess: () => { utils.desa.dokumen.list.invalidate(); toast.success("Berhasil dihapus!"); },
    onError: () => toast.error("Gagal menghapus"),
  });

  const resetForm = () => { setForm({ judul: "", fileUrl: "", deskripsi: "", kategori: "", urutan: 0 }); setEditingId(null); };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ judul: item.judul, fileUrl: item.fileUrl, deskripsi: item.deskripsi || "", kategori: item.kategori || "", urutan: item.urutan || 0 });
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
            <h1 className="text-2xl font-bold text-gray-900">Kelola Dokumen</h1>
            <p className="text-gray-500 text-sm mt-1">Dokumen unduhan publik</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => { resetForm(); setDialogOpen(true); }}>
                <Plus className="w-4 h-4 mr-2" /> Tambah
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{editingId ? "Edit" : "Tambah"} Dokumen</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Judul</Label><Input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required /></div>
                <div><Label>File URL</Label><Input value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://..." required /></div>
                <div><Label>Kategori</Label><Input value={form.kategori} onChange={(e) => setForm({ ...form, kategori: e.target.value })} /></div>
                <div><Label>Urutan</Label><Input type="number" value={form.urutan} onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })} /></div>
                <div><Label>Deskripsi</Label><Textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={3} /></div>
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
                  <TableRow><TableHead>Judul</TableHead><TableHead>Kategori</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={3} className="text-center py-8">Memuat...</TableCell></TableRow>
                  ) : dokumenList && dokumenList.length > 0 ? (
                    dokumenList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium max-w-xs truncate">{item.judul}</TableCell>
                        <TableCell>{item.kategori || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { if (confirm("Yakin?")) deleteMutation.mutate({ id: item.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={3} className="text-center py-8"><FileText className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">Tidak ada data</p></TableCell></TableRow>
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
