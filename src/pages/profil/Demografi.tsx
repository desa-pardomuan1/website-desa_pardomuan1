import { trpc } from "@/providers/trpc";
import Layout from "@/components/Layout";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  UserCircle,
  GraduationCap,
  Briefcase,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const PIE_COLORS = ["#059669", "#0891b2", "#d97706", "#dc2626", "#7c3aed"];

export default function DemografiPage() {
  const { data: statistik } = trpc.desa.statistik.getLatest.useQuery();

  const dataPendidikan = statistik?.dataPendidikan;
  const dataAngkatanKerja = statistik?.dataAngkatanKerja;
  const dataUsia = statistik?.dataUsia;

  // Prepare population pyramid data
  const pyramidData = dataUsia
    ? [
        { usia: "0-4", laki: dataUsia.range0_4 / 2, perempuan: dataUsia.range0_4 / 2 },
        { usia: "5-9", laki: dataUsia.range5_9 / 2, perempuan: dataUsia.range5_9 / 2 },
        { usia: "10-14", laki: dataUsia.range10_14 / 2, perempuan: dataUsia.range10_14 / 2 },
        { usia: "15-19", laki: dataUsia.range15_19 / 2, perempuan: dataUsia.range15_19 / 2 },
        { usia: "20-24", laki: dataUsia.range20_24 / 2, perempuan: dataUsia.range20_24 / 2 },
        { usia: "25-29", laki: dataUsia.range25_29 / 2, perempuan: dataUsia.range25_29 / 2 },
        { usia: "30-34", laki: dataUsia.range30_34 / 2, perempuan: dataUsia.range30_34 / 2 },
        { usia: "35-39", laki: dataUsia.range35_39 / 2, perempuan: dataUsia.range35_39 / 2 },
        { usia: "40-44", laki: dataUsia.range40_44 / 2, perempuan: dataUsia.range40_44 / 2 },
        { usia: "45-49", laki: dataUsia.range45_49 / 2, perempuan: dataUsia.range45_49 / 2 },
        { usia: "50-54", laki: dataUsia.range50_54 / 2, perempuan: dataUsia.range50_54 / 2 },
        { usia: "55-59", laki: dataUsia.range55_59 / 2, perempuan: dataUsia.range55_59 / 2 },
        { usia: "60-64", laki: dataUsia.range60_64 / 2, perempuan: dataUsia.range60_64 / 2 },
        { usia: "65+", laki: dataUsia.range65_plus / 2, perempuan: dataUsia.range65_plus / 2 },
      ]
    : [];

  const pendidikanChart = dataPendidikan
    ? [
        { name: "Tidak Sekolah", value: dataPendidikan.tidakSekolah },
        { name: "SD", value: dataPendidikan.sd },
        { name: "SMP", value: dataPendidikan.smp },
        { name: "SMA", value: dataPendidikan.sma },
        { name: "Diploma", value: dataPendidikan.diploma },
        { name: "Sarjana", value: dataPendidikan.sarjana },
      ]
    : [];

  const angkatanKerjaChart = dataAngkatanKerja
    ? [
        { name: "Bekerja", value: dataAngkatanKerja.bekerja },
        { name: "Pengangguran", value: dataAngkatanKerja.pengangguran },
        { name: "Tidak Bekerja", value: dataAngkatanKerja.tidakBekerja },
      ]
    : [];

  const usiaDistribution = dataUsia
    ? [
        { name: "Anak (0-14)", value: dataUsia.range0_4 + dataUsia.range5_9 + dataUsia.range10_14 },
        { name: "Remaja (15-24)", value: dataUsia.range15_19 + dataUsia.range20_24 },
        { name: "Dewasa (25-54)", value: dataUsia.range25_29 + dataUsia.range30_34 + dataUsia.range35_39 + dataUsia.range40_44 + dataUsia.range45_49 + dataUsia.range50_54 },
        { name: "Lansia (55+)", value: dataUsia.range55_59 + dataUsia.range60_64 + dataUsia.range65_plus },
      ]
    : [];

  return (
    <Layout>
      {/* Header */}
      <div className="bg-gradient-to-br from-emerald-700 to-teal-700 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Demografi Penduduk</h1>
          <p className="text-emerald-100 mt-2">
            Statistik kependudukan dan infografis desa
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-10 space-y-8">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Users className="h-5 w-5 text-emerald-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistik?.totalPenduduk?.toLocaleString("id-ID") || "0"}
                  </p>
                  <p className="text-xs text-gray-500">Total Penduduk</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <UserCircle className="h-5 w-5 text-blue-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistik?.totalLakiLaki?.toLocaleString("id-ID") || "0"}
                  </p>
                  <p className="text-xs text-gray-500">Laki-laki</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-pink-100 rounded-lg flex items-center justify-center">
                  <UserCircle className="h-5 w-5 text-pink-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistik?.totalPerempuan?.toLocaleString("id-ID") || "0"}
                  </p>
                  <p className="text-xs text-gray-500">Perempuan</p>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card className="border-0 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Building2Icon className="h-5 w-5 text-orange-700" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {statistik?.totalKK?.toLocaleString("id-ID") || "0"}
                  </p>
                  <p className="text-xs text-gray-500">Kepala Keluarga</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Population Pyramid */}
        {pyramidData.length > 0 && (
          <Card className="border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-emerald-700" />
                Piramida Penduduk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={400}>
                <BarChart
                  data={pyramidData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="usia" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="laki" name="Laki-laki" fill="#0891b2" />
                  <Bar dataKey="perempuan" name="Perempuan" fill="#db2777" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Education & Work Charts */}
        <div className="grid md:grid-cols-3 gap-6">
          {/* Education Chart */}
          {pendidikanChart.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <GraduationCap className="w-4 h-4 text-emerald-700" />
                  Tingkat Pendidikan
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={pendidikanChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pendidikanChart.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend fontSize={12} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Age Distribution */}
          {usiaDistribution.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Users className="w-4 h-4 text-emerald-700" />
                  Distribusi Usia
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={usiaDistribution}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      dataKey="value"
                      label
                    >
                      {usiaDistribution.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend fontSize={12} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}

          {/* Workforce Chart */}
          {angkatanKerjaChart.length > 0 && (
            <Card className="border-0 shadow-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-sm">
                  <Briefcase className="w-4 h-4 text-emerald-700" />
                  Angkatan Kerja
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={angkatanKerjaChart}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                    >
                      {angkatanKerjaChart.map((_, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={PIE_COLORS[index % PIE_COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend fontSize={12} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>

        {/* No Data State */}
        {!statistik && (
          <Card className="border-0 shadow-sm">
            <CardContent className="p-12 text-center">
              <BarChart3 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500">
                Data demografi belum tersedia. Silakan hubungi admin untuk
                melengkapi informasi.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </Layout>
  );
}

function Building2Icon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18Z" />
      <path d="M6 12H4a2 2 0 0 0-2 2v6h20v-6a2 2 0 0 0-2-2h-2" />
      <path d="M6 8h12" />
      <path d="M6 16h12" />
      <path d="M9 4v4" />
      <path d="M15 4v4" />
      <path d="M9 12v4" />
      <path d="M15 12v4" />
    </svg>
  );
}
