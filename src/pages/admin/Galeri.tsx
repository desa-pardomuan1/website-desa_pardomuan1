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
import { Plus, Pencil, Trash2, Image } from "lucide-react";
import { toast } from "sonner";
import { parseGoogleDriveUrl } from "@/lib/utils";

const kategoriOptions = [
  { value: "kegiatan", label: "Kegiatan" },
  { value: "infraastruktur", label: "Infrastruktur" },
  { value: "pariwisata", label: "Pariwisata" },
  { value: "umkm", label: "UMKM" },
  { value: "pertanian", label: "Pertanian" },
  { value: "infografis", label: "Infografis" },
  { value: "lainnya", label: "Lainnya" },
];

export default function AdminGaleri() {
  const utils = trpc.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ judul: "", gambarUrl: "", kategori: "kegiatan" as "kegiatan" | "infraastruktur" | "pariwisata" | "umkm" | "pertanian" | "infografis" | "lainnya", tanggal: "", deskripsi: "" });

  const { data: galeriList, isLoading } = trpc.desa.galeri.list.useQuery();

  const create = trpc.desa.galeri.create.useMutation({
    onSuccess: () => { utils.desa.galeri.list.invalidate(); setDialogOpen(false); resetForm(); toast.success("Berhasil ditambahkan!"); },
    onError: () => toast.error("Gagal menambahkan"),
  });
  const update = trpc.desa.galeri.update.useMutation({
    onSuccess: () => { utils.desa.galeri.list.invalidate(); setDialogOpen(false); resetForm(); toast.success("Berhasil diperbarui!"); },
    onError: () => toast.error("Gagal memperbarui"),
  });
  const deleteMutation = trpc.desa.galeri.delete.useMutation({
    onSuccess: () => { utils.desa.galeri.list.invalidate(); toast.success("Berhasil dihapus!"); },
    onError: () => toast.error("Gagal menghapus"),
  });

  const resetForm = () => { setForm({ judul: "", gambarUrl: "", kategori: "kegiatan" as "kegiatan" | "infraastruktur" | "pariwisata" | "umkm" | "pertanian" | "infografis" | "lainnya", tanggal: "", deskripsi: "" }); setEditingId(null); };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ judul: item.judul, gambarUrl: item.gambarUrl, kategori: item.kategori as any, tanggal: item.tanggal ? new Date(item.tanggal).toISOString().split("T")[0] : "", deskripsi: item.deskripsi || "" });
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
          <div><h1 className="text-2xl font-bold text-gray-900">Kelola Galeri</h1><p className="text-gray-500 text-sm mt-1">Foto dan infografis desa</p></div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => { resetForm(); setDialogOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Tambah</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg">
              <DialogHeader><DialogTitle>{editingId ? "Edit" : "Tambah"} Foto</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Judul</Label><Input value={form.judul} onChange={(e) => setForm({ ...form, judul: e.target.value })} required /></div>
                <div><Label>Gambar URL</Label><Input value={form.gambarUrl} onChange={(e) => setForm({ ...form, gambarUrl: parseGoogleDriveUrl(e.target.value) })} placeholder="https://..." required /></div>
                <div>
                  <Label>Kategori</Label>
                  <Select value={form.kategori} onValueChange={(v) => setForm({ ...form, kategori: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{kategoriOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div><Label>Tanggal</Label><Input type="date" value={form.tanggal} onChange={(e) => setForm({ ...form, tanggal: e.target.value })} /></div>
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
                  <TableRow><TableHead>Preview</TableHead><TableHead>Judul</TableHead><TableHead>Kategori</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8">Memuat...</TableCell></TableRow>
                  ) : galeriList && galeriList.length > 0 ? (
                    galeriList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell><img src={item.gambarUrl} alt={item.judul} className="h-12 w-12 object-cover rounded" /></TableCell>
                        <TableCell className="font-medium max-w-xs truncate">{item.judul}</TableCell>
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
                    <TableRow><TableCell colSpan={4} className="text-center py-8"><Image className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">Tidak ada data</p></TableCell></TableRow>
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
