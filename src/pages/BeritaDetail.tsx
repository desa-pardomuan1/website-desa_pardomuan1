import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  ArrowLeft,
  Share2,
} from "lucide-react";
import { Link, useParams } from "react-router";

export default function BeritaDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data: berita, isLoading } = trpc.desa.berita.getBySlug.useQuery(
    { slug: slug || "" },
    { enabled: !!slug }
  );

  const formatDate = (date: Date | string | null) => {
    if (!date) return "";
    return new Date(date).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <div className="animate-pulse space-y-4">
            <div className="h-64 bg-gray-200 rounded-xl" />
            <div className="h-8 bg-gray-200 rounded w-3/4 mx-auto" />
            <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!berita) {
    return (
      <Layout>
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Berita tidak ditemukan
          </h1>
          <p className="text-gray-500 mb-4">
            Berita yang Anda cari tidak tersedia.
          </p>
          <Link to="/berita">
            <Button variant="outline">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Kembali ke Berita
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back Button */}
        <Link to="/berita">
          <Button variant="ghost" size="sm" className="mb-4">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>

        {/* Hero Image */}
        {berita.gambarSampul && (
          <div className="rounded-xl overflow-hidden mb-6">
            <img
              src={berita.gambarSampul}
              alt={berita.judul}
              className="w-full h-64 md:h-96 object-cover"
            />
          </div>
        )}

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <Badge
            variant="secondary"
            className={`text-xs ${
              berita.kategori === "pengumuman"
                ? "bg-orange-100 text-orange-700"
                : berita.kategori === "berita"
                  ? "bg-blue-100 text-blue-700"
                  : "bg-emerald-100 text-emerald-700"
            }`}
          >
            {berita.kategori === "kabar_desa"
              ? "Kabar Desa"
              : berita.kategori === "pengumuman"
                ? "Pengumuman"
                : "Berita"}
          </Badge>
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <Calendar className="w-4 h-4" />
            {formatDate(berita.tanggalPublish)}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-6">
          {berita.judul}
        </h1>

        {/* Content */}
        <Card className="border-0 shadow-sm mb-8">
          <CardContent className="p-6">
            <div className="prose prose-emerald max-w-none">
              {berita.isi.split("\n").map((paragraph, i) => (
                <p key={i} className="text-gray-700 leading-relaxed mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Share */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <span className="text-sm text-gray-500">Bagikan artikel ini:</span>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                if (navigator.share) {
                  navigator.share({
                    title: berita.judul,
                    url: window.location.href,
                  });
                }
              }}
            >
              <Share2 className="w-4 h-4 mr-1" />
              Bagikan
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}
