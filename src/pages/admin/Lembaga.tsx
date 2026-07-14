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
import { Plus, Pencil, Trash2, Users } from "lucide-react";
import { toast } from "sonner";
import { parseGoogleDriveUrl } from "@/lib/utils";

const jenisOptions = [
  { value: "pemerintahan", label: "Pemerintahan" },
  { value: "bpd", label: "BPD" },
  { value: "pkk", label: "PKK" },
  { value: "karang_taruna", label: "Karang Taruna" },
  { value: "lpmd", label: "LPMD" },
  { value: "lainnya", label: "Lainnya" },
];

export default function AdminLembaga() {
  const utils = trpc.useUtils();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState({ nama: "", jenis: "lainnya" as "pemerintahan" | "bpd" | "pkk" | "karang_taruna" | "lpmd" | "lainnya", deskripsi: "", fotoUrl: "", ketua: "", anggota: 0, urutan: 0 });

  const { data: lembagaList, isLoading } = trpc.desa.lembaga.list.useQuery();

  const create = trpc.desa.lembaga.create.useMutation({
    onSuccess: () => { utils.desa.lembaga.list.invalidate(); setDialogOpen(false); resetForm(); toast.success("Berhasil ditambahkan!"); },
    onError: () => toast.error("Gagal menambahkan"),
  });
  const update = trpc.desa.lembaga.update.useMutation({
    onSuccess: () => { utils.desa.lembaga.list.invalidate(); setDialogOpen(false); resetForm(); toast.success("Berhasil diperbarui!"); },
    onError: () => toast.error("Gagal memperbarui"),
  });
  const deleteMutation = trpc.desa.lembaga.delete.useMutation({
    onSuccess: () => { utils.desa.lembaga.list.invalidate(); toast.success("Berhasil dihapus!"); },
    onError: () => toast.error("Gagal menghapus"),
  });

  const resetForm = () => { setForm({ nama: "", jenis: "lainnya" as "pemerintahan" | "bpd" | "pkk" | "karang_taruna" | "lpmd" | "lainnya", deskripsi: "", fotoUrl: "", ketua: "", anggota: 0, urutan: 0 }); setEditingId(null); };

  const handleEdit = (item: any) => {
    setEditingId(item.id);
    setForm({ nama: item.nama, jenis: item.jenis as any, deskripsi: item.deskripsi || "", fotoUrl: item.fotoUrl || "", ketua: item.ketua || "", anggota: item.anggota || 0, urutan: item.urutan || 0 });
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
          <div><h1 className="text-2xl font-bold text-gray-900">Kelola Lembaga</h1><p className="text-gray-500 text-sm mt-1">Lembaga kemasyarakatan</p></div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-700 hover:bg-emerald-800" onClick={() => { resetForm(); setDialogOpen(true); }}><Plus className="w-4 h-4 mr-2" /> Tambah</Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
              <DialogHeader><DialogTitle>{editingId ? "Edit" : "Tambah"} Lembaga</DialogTitle></DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><Label>Nama</Label><Input value={form.nama} onChange={(e) => setForm({ ...form, nama: e.target.value })} required /></div>
                <div>
                  <Label>Jenis</Label>
                  <Select value={form.jenis} onValueChange={(v) => setForm({ ...form, jenis: v as any })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>{jenisOptions.map((o) => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}</SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><Label>Ketua</Label><Input value={form.ketua} onChange={(e) => setForm({ ...form, ketua: e.target.value })} /></div>
                  <div><Label>Jumlah Anggota</Label><Input type="number" value={form.anggota} onChange={(e) => setForm({ ...form, anggota: parseInt(e.target.value) || 0 })} /></div>
                </div>
                <div><Label>Foto URL</Label><Input value={form.fotoUrl} onChange={(e) => setForm({ ...form, fotoUrl: parseGoogleDriveUrl(e.target.value) })} placeholder="https://..." /></div>
                <div><Label>Urutan</Label><Input type="number" value={form.urutan} onChange={(e) => setForm({ ...form, urutan: parseInt(e.target.value) || 0 })} /></div>
                <div><Label>Deskripsi</Label><Textarea value={form.deskripsi} onChange={(e) => setForm({ ...form, deskripsi: e.target.value })} rows={4} /></div>
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
                  <TableRow><TableHead>Nama</TableHead><TableHead>Jenis</TableHead><TableHead>Ketua</TableHead><TableHead className="w-[100px]">Aksi</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={4} className="text-center py-8">Memuat...</TableCell></TableRow>
                  ) : lembagaList && lembagaList.length > 0 ? (
                    lembagaList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium max-w-xs truncate">{item.nama}</TableCell>
                        <TableCell className="capitalize">{item.jenis}</TableCell>
                        <TableCell>{item.ketua || "-"}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { if (confirm("Yakin?")) deleteMutation.mutate({ id: item.id }); }}><Trash2 className="w-3.5 h-3.5" /></Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={4} className="text-center py-8"><Users className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">Tidak ada data</p></TableCell></TableRow>
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
