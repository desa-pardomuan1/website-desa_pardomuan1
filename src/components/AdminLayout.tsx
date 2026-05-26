import type { ReactNode } from "react";
import { Link, useLocation } from "react-router";

import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Settings,
  BarChart3,
  Newspaper,
  ClipboardList,
  FileText,
  Users,
  Image,
  Sprout,
  Store,
  MessageSquare,
  DollarSign,
  LogOut,
  Menu,
  X,
  ChevronRight,
  Home,
} from "lucide-react";
import { useState, useEffect } from "react";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
  { label: "Profil Desa", path: "/admin/profil", icon: Settings },
  { label: "Statistik", path: "/admin/statistik", icon: BarChart3 },
  { label: "Berita", path: "/admin/berita", icon: Newspaper },
  { label: "Panduan", path: "/admin/panduan", icon: ClipboardList },
  { label: "Dokumen", path: "/admin/dokumen", icon: FileText },
  { label: "Lembaga", path: "/admin/lembaga", icon: Users },
  { label: "Galeri", path: "/admin/galeri", icon: Image },
  { label: "Komoditas", path: "/admin/komoditas", icon: Sprout },
  { label: "UMKM", path: "/admin/umkm", icon: Store },
  { label: "APBDes", path: "/admin/apbdes", icon: DollarSign },
  { label: "Pengaduan", path: "/admin/pengaduan", icon: MessageSquare },
];

interface AdminLayoutProps {
  children: ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user, isAuthenticated, isLoading, logout } = useAuth({
    redirectOnUnauthenticated: true,
    redirectPath: "/login",
  });
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  // Wait for auth check
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-700" />
      </div>
    );
  }

  // Check admin role
  if (isAuthenticated && user?.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Akses Ditolak
          </h1>
          <p className="text-gray-500 mb-4">
            Anda tidak memiliki izin untuk mengakses halaman ini.
          </p>
          <Link to="/">
            <Button variant="outline">Kembali ke Beranda</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-200 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Sidebar Header */}
        <div className="h-14 flex items-center justify-between px-4 border-b border-gray-200">
          <Link to="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-700 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="h-4 w-4 text-white" />
            </div>
            <span className="font-semibold text-sm">Admin Panel</span>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Menu Items */}
        <nav className="flex-1 overflow-y-auto py-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-2.5 text-sm transition-colors ${
                  isActive
                    ? "bg-emerald-50 text-emerald-700 font-medium border-r-2 border-emerald-700"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-gray-200 p-3 space-y-2">
          <Link
            to="/"
            className="flex items-center gap-3 px-4 py-2 text-sm text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <Home className="h-4 w-4" />
            Lihat Website
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 min-w-0">
        {/* Top Bar */}
        <header className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-4 sticky top-0 z-30">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Breadcrumb */}
          <div className="hidden sm:flex items-center text-sm text-gray-500">
            <Link to="/admin" className="hover:text-emerald-700">
              Admin
            </Link>
            {location.pathname !== "/admin" && (
              <>
                <ChevronRight className="h-3 w-3 mx-1" />
                <span className="text-gray-900">
                  {menuItems.find((m) => m.path === location.pathname)
                    ?.label || ""}
                </span>
              </>
            )}
          </div>

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 bg-emerald-100 rounded-full flex items-center justify-center">
              <Users className="h-4 w-4 text-emerald-700" />
            </div>
            <span className="text-sm font-medium hidden sm:inline">
              {user?.name || "Admin"}
            </span>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  );
}
