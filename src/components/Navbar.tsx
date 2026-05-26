import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import { trpc } from "@/providers/trpc";
import {
  Menu,
  X,
  Home,
  Building2,
  Users,
  ClipboardList,
  FileBarChart,
  Sprout,
  Newspaper,
  Phone,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";

const menuItems = [
  { label: "Beranda", path: "/", icon: Home },
  {
    label: "Profil Desa",
    icon: Building2,
    children: [
      { label: "Sejarah & Visi Misi", path: "/profil/sejarah" },
      { label: "Kondisi Geografis", path: "/profil/geografis" },
      { label: "Demografi Penduduk", path: "/profil/demografi" },
    ],
  },
  {
    label: "Pemerintahan",
    icon: Users,
    children: [
      { label: "Struktur Organisasi", path: "/pemerintahan/struktur" },
      { label: "BPD", path: "/pemerintahan/bpd" },
      { label: "Lembaga Kemasyarakatan", path: "/pemerintahan/lembaga" },
    ],
  },
  {
    label: "Layanan Publik",
    icon: ClipboardList,
    children: [
      { label: "Panduan Layanan", path: "/layanan/panduan" },
      { label: "Unduh Dokumen", path: "/layanan/dokumen" },
      { label: "Layanan Mandiri", path: "/layanan/mandiri" },
    ],
  },
  {
    label: "Transparansi",
    icon: FileBarChart,
    children: [
      { label: "APBDes", path: "/transparansi/apbdes" },
      { label: "Galeri Infografis", path: "/transparansi/galeri" },
    ],
  },
  {
    label: "Potensi Desa",
    icon: Sprout,
    children: [
      { label: "Pertanian & Peternakan", path: "/potensi/komoditas" },
      { label: "UMKM & Pariwisata", path: "/potensi/umkm" },
    ],
  },
  { label: "Berita", path: "/berita", icon: Newspaper },
  { label: "Kontak", path: "/kontak", icon: Phone },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { data: profil } = trpc.desa.profil.list.useQuery();

  const namaDesa = profil?.nama_desa || "Desa Cantik";
  const logoUrl = profil?.logo_url || "";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white shadow-sm"
      }`}
    >
      {/* Top Bar */}
      <div className="bg-emerald-700 text-white text-xs py-1.5">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>{namaDesa}</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline">
              {profil?.kabupaten
                ? `${profil.kecamatan}, ${profil.kabupaten}`
                : "Kecamatan, Kabupaten"}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link
              to="/admin"
              className="flex items-center gap-1 hover:text-emerald-200 transition-colors"
            >
              <Shield className="w-3 h-3" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            {logoUrl ? (
              <img src={logoUrl} alt="Logo" className="h-10 w-10 rounded" />
            ) : (
              <div className="h-10 w-10 bg-emerald-700 rounded-lg flex items-center justify-center">
                <Home className="h-5 w-5 text-white" />
              </div>
            )}
            <div className="hidden sm:block">
              <h1 className="font-bold text-emerald-800 text-sm leading-tight">
                {namaDesa}
              </h1>
              <p className="text-[10px] text-emerald-600">
                Website Resmi Pemerintah Desa
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:block">
            <NavigationMenu>
              <NavigationMenuList className="gap-0">
                {menuItems.map((item) =>
                  item.children ? (
                    <NavigationMenuItem key={item.label}>
                      <NavigationMenuTrigger
                        className={`text-xs font-medium ${
                          item.children.some((c) => isActive(c.path))
                            ? "text-emerald-700 bg-emerald-50"
                            : "text-gray-700"
                        }`}
                      >
                        <item.icon className="w-3.5 h-3.5 mr-1" />
                        {item.label}
                      </NavigationMenuTrigger>
                      <NavigationMenuContent>
                        <ul className="w-56 p-2">
                          {item.children.map((child) => (
                            <li key={child.path}>
                              <Link
                                to={child.path}
                                className={`block px-3 py-2 rounded-md text-sm hover:bg-emerald-50 hover:text-emerald-700 transition-colors ${
                                  isActive(child.path)
                                    ? "bg-emerald-50 text-emerald-700 font-medium"
                                    : "text-gray-700"
                                }`}
                              >
                                {child.label}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </NavigationMenuContent>
                    </NavigationMenuItem>
                  ) : (
                    <NavigationMenuItem key={item.path}>
                      <Link
                        to={item.path!}
                        className={`${navigationMenuTriggerStyle()} text-xs font-medium ${
                          isActive(item.path!)
                            ? "text-emerald-700 bg-emerald-50"
                            : "text-gray-700"
                        }`}
                      >
                        <item.icon className="w-3.5 h-3.5 mr-1" />
                        {item.label}
                      </Link>
                    </NavigationMenuItem>
                  )
                )}
              </NavigationMenuList>
            </NavigationMenu>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t shadow-lg max-h-[80vh] overflow-y-auto">
          <div className="px-4 py-3 space-y-1">
            {menuItems.map((item) =>
              item.children ? (
                <div key={item.label} className="space-y-1">
                  <div className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-gray-700">
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </div>
                  {item.children.map((child) => (
                    <Link
                      key={child.path}
                      to={child.path}
                      className={`block pl-10 pr-3 py-2 rounded-md text-sm ${
                        isActive(child.path)
                          ? "bg-emerald-50 text-emerald-700 font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              ) : (
                <Link
                  key={item.path}
                  to={item.path!}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                    isActive(item.path!)
                      ? "bg-emerald-50 text-emerald-700"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.label}
                </Link>
              )
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
