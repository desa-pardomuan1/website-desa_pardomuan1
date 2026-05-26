import { useState } from "react";
import { trpc } from "@/providers/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Pencil, Trash2, Store } from "lucide-react";
import { toast } from "sonner";

const kategoriOptions = [
  { value: "makanan", label: "Makanan" },
  { value: "minuman", label: "Minuman" },
  { value: "kerajinan", label: "Kerajinan" },
  { value: "fashion", label: "Fashion" },
  { value: "pertanian", label: "Pertanian" },
  { value: "jasa", label: "Jasa" },
  { value: "lainnya", label: "Lainnya" },
];

export default function AdminUmkm() {
  const utils = trpc.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ namaProduk: "", namaUsaha: "", deskripsi: "", fotoUrl: "", link: "", kategori: "lainnya" as "makanan" | "minuman" | "kerajinan" | "fashion" | "pertanian" | "jasa" | "lainnya", pemilik: "", kontak: "" });

  const { data: umkmList, isLoading } = trpc.desa.umkm.list.useQuery();

  const create = trpc.desa.umkm.create.useMutation({
    onSuccess: () => { utils.desa.umkm.list.invalidate(); setDialogOpen(false); resetForm(); toast.success("Berhasil ditambahkan!"); },
    onError: () => toast.error("Gagal menambahkan"),
  });
  const update = trpc.desa.umkm.update.useMutation({
    onSuccess: () => { utils.desa.umkm.list.invalidate(); setDialogOpen(false); resetForm(); toast.success("Berhasil diperbarui!"); },
    onError: () => toast.error("Gagal memperbarui"),
  });
  const deleteMutation = trpc.desa.umkm.delete.useMutation({
    onSuccess: () => { utils.desa.umkm.list.invalidate(); toast.success("Berhasil dihapus!"); },
    onError: () => toast.error("Gagal menghapus"),
  });

  const resetForm = () => { setForm({ namaProduk: "", namaUsaha: "", deskripsi: "", fotoUrl: "", link: "", kategori: "lainnya" as "makanan" | "minuman" | "kerajinan" | "fashion" | "pertanian" | "jasa" | "lainnya", pemilik: "", kontak: "" }); setEditingId(null); };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ namaProduk: item.namaProduk, namaUsaha: item.namaUsaha || "", deskripsi: item.deskripsi || "", fotoUrl: item.fotoUrl || "", link: item.link || "", kategori: item.kategori as any, pemilik: item.pemilik || "", kontak: item.kontak || "" });
    setDialogOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) update.mutate({ id: editingId, ...form });
    else create.mutate(form);
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div><h1 className="text-2xl font-bold text-gray-900">Kelola UMKM</h1><p className="text-gray-500 text-sm mt-1">Usaha mikro, kecil, menengah</p></div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => { resetForm(); setDialogOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Tambah</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingId ? "Edit" : "Tambah"} UMKM</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Nama Produk</Label><Input value={form.namaProduk} onChange={(e) => setForm({ ...form, namaProduk: e.target.value })} required /></div>
                  <div><Label>Nama Usaha</Label><Input value={form.namaUsaha} onChange={(e) => setForm({ ...form, namaUsaha: e.target.value })} /></div>
                </div>
                <div>
                  <Label>Kategori</Label>
                  <Select value={form.kategori} onValueChange={(v) => setForm({ ...form, kategori: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{kategoriOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Pemilik</Label><Input value={form.pemilik} onChange={(e) => setForm({ ...form, pemilik: e.target.value })} /></div>
                  <div><Label>Kontak</Label><Input value={form.kontak} onChange={(e) => setForm({ ...form, kontak: e.target.value })} /></div>
                </div>
                <div><Label>Foto URL</Label><Input value={form.fotoUrl} onChange={(e) => setForm({ ...form, fotoUrl: e.target.value })} placeholder="https://..." /></div>
                <div><Label>Link Produk</Label><Input value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="https://..." /></div>
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
                  <TableRow><TableHead>Produk</TableHead><TableHead>Usaha</TableHead><TableHead>Kategori</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8">Memuat...</TableCell></TableRow>
                  ) : umkmList && umkmList.length > 0 ? (
                    umkmList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.namaProduk}</TableCell>
                        <TableCell>{item.namaUsaha || "-"}</TableCell>
                        <TableCell className="capitalize">{item.kategori}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { if (confirm("Yakin?")) deleteMutation.mutate({ id: item.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="text-center py-8"><Store className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">Tidak ada data</p></TableCell></TableRow>
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
