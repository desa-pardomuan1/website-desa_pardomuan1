import { trpc } from "@/providers/trpc";
import AdminLayout from "@/components/AdminLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Trash2, Reply } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

const statusColors: Record<string, string> = {
  baru: "bg-blue-100 text-blue-700",
  diproses: "bg-yellow-100 text-yellow-700",
  selesai: "bg-emerald-100 text-emerald-700",
  ditolak: "bg-red-100 text-red-700",
};

export default function AdminPengaduan() {
  const utils = trpc.useUtils();
  const { data: pengaduanList, isLoading } = trpc.desa.pengaduan.list.useQuery();
  const [responId, setResponId] = useState<number | null>(null);
  const [respon, setRespon] = useState("");
  const [status, setStatus] = useState("diproses");

  const updateStatus = trpc.desa.pengaduan.updateStatus.useMutation({
    onSuccess: () => {
      utils.desa.pengaduan.list.invalidate();
      utils.desa.dashboard.stats.invalidate();
      setResponId(null);
      setRespon("");
      toast.success("Status berhasil diperbarui!");
    },
    onError: () => toast.error("Gagal memperbarui"),
  });

  const deleteMutation = trpc.desa.pengaduan.delete.useMutation({
    onSuccess: () => { utils.desa.pengaduan.list.invalidate(); utils.desa.dashboard.stats.invalidate(); toast.success("Berhasil dihapus!"); },
    onError: () => toast.error("Gagal menghapus"),
  });

  const handleRespon = (id: number) => {
    updateStatus.mutate({ id, status: status as any, respon: respon || undefined });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Kelola Pengaduan</h1>
          <p className="text-gray-500 text-sm mt-1">Tanggapi pengaduan dari masyarakat</p>
        </div>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow><TableHead>Nama</TableHead><TableHead>Kontak</TableHead><TableHead>Pesan</TableHead><TableHead>Status</TableHead><TableHead className="w-[150px]">Aksi</TableHead></TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow><TableCell colSpan={5} className="text-center py-8">Memuat...</TableCell></TableRow>
                  ) : pengaduanList && pengaduanList.length > 0 ? (
                    pengaduanList.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.nama}</TableCell>
                        <TableCell>
                          <div className="text-sm">{item.kontak}</div>
                          {item.email && <div className="text-xs text-gray-400">{item.email}</div>}
                        </TableCell>
                        <TableCell>
                          <div className="max-w-xs text-sm">{item.pesan}</div>
                          {item.respon && (
                            <div className="mt-2 p-2 bg-emerald-50 rounded text-xs text-emerald-700">
                              <strong>Respon:</strong> {item.respon}
                            </div>
                          )}
                          {responId === item.id && (
                            <div className="mt-2 space-y-2">
                              <Select value={status} onValueChange={setStatus}>
                                <SelectTrigger className="text-xs"><SelectValue /></SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="diproses">Diproses</SelectItem>
                                  <SelectItem value="selesai">Selesai</SelectItem>
                                  <SelectItem value="ditolak">Ditolak</SelectItem>
                                </SelectContent>
                              </Select>
                              <Textarea value={respon} onChange={(e) => setRespon(e.target.value)} placeholder="Tulis respon..." rows={2} className="text-xs" />
                              <div className="flex gap-2">
                                <Button size="sm" className="text-xs bg-emerald-700" onClick={() => handleRespon(item.id)} disabled={updateStatus.isPending}>
                                  {updateStatus.isPending ? "..." : "Kirim"}
                                </Button>
                                <Button size="sm" variant="ghost" className="text-xs" onClick={() => setResponId(null)}>Batal</Button>
                              </div>
                            </div>
                          )}
                        </TableCell>
                        <TableCell><Badge variant="secondary" className={statusColors[item.status] || ""}>{item.status}</Badge></TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {responId !== item.id && (
                              <Button variant="ghost" size="sm" onClick={() => { setResponId(item.id); setRespon(item.respon || ""); setStatus(item.status === "baru" ? "diproses" : item.status); }}>
                                <Reply className="w-3.5 h-3.5" />
                              </Button>
                            )}
                            <Button variant="ghost" size="sm" className="text-red-600" onClick={() => { if (confirm("Yakin?")) deleteMutation.mutate({ id: item.id }); }}>
                              <Trash2 className="w-3.5 h-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow><TableCell colSpan={5} className="text-center py-8"><MessageSquare className="w-8 h-8 text-gray-300 mx-auto mb-2" /><p className="text-gray-500">Tidak ada pengaduan</p></TableCell></TableRow>
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
