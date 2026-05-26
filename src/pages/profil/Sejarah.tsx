import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Target, Eye, BookOpen, CheckCircle } from "lucide-react";

export default function SejarahPage() {
  const { data: profil } = trpc.desa.profil.list.useQuery();

  const visi = profil?.visi || "";
  const misiRaw = profil?.misi || "[]";
  const sejarah = profil?.sejarah || "";

  let misi: string[] = [];
  try {
    misi = JSON.parse(misiRaw);
  } catch {
    misi = misiRaw ? [misiRaw] : [];
  }

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Sejarah & Visi Misi</h1>
          <p className="text-emerald-100 mt-2">
            Mengenal lebih dekat sejarah dan arah pembangunan desa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Sejarah */}
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl">
              <BookOpen className="w-5 h-5 text-emerald-700" />
              Sejarah Desa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-emerald max-w-none">
              {sejarah ? (
                sejarah.split("\n").map((paragraph, i) => (
                  <p key={i} className="text-gray-700 leading-relaxed mb-4">
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-gray-500 italic">
                  Data sejarah desa belum tersedia. Silakan hubungi admin untuk
                  melengkapi informasi.
                </p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Visi & Misi Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Visi */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-emerald-50 to-teal-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Eye className="w-5 h-5 text-emerald-700" />
                Visi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {visi ? (
                <p className="text-gray-700 leading-relaxed font-medium">
                  {visi}
                </p>
              ) : (
                <p className="text-gray-500 italic">
                  Data visi belum tersedia.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Misi */}
          <Card className="border-0 shadow-sm bg-gradient-to-br from-blue-50 to-indigo-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Target className="w-5 h-5 text-blue-700" />
                Misi
              </CardTitle>
            </CardHeader>
            <CardContent>
              {misi.length > 0 ? (
                <ul className="space-y-3">
                  {misi.map((item, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <CheckCircle className="w-4 h-4 text-blue-600 mt-1 shrink-0" />
                      <span className="text-gray-700 text-sm leading-relaxed">
                        {item}
                      </span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-500 italic">
                  Data misi belum tersedia.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}
