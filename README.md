# Template Website Desa Cantik (Multi-Desa)

Template website desa yang dapat digunakan oleh banyak desa. Setiap desa dapat meng-clone repository ini, membuat proyek database sendiri, dan mengelola konten melalui admin panel.

## Fitur Utama

### Halaman Publik
- **Beranda** - Hero section, statistik desa, berita terbaru, galeri, UMKM
- **Profil Desa** - Sejarah & Visi Misi, Kondisi Geografis (dengan peta), Demografi Penduduk (dengan infografis piramida penduduk, tingkat pendidikan, angkatan kerja)
- **Pemerintahan** - Struktur Organisasi Pemdes, BPD, Lembaga Kemasyarakatan (PKK, Karang Taruna, LPMD)
- **Layanan Publik** - Panduan Layanan, Unduh Dokumen, Layanan Mandiri (tautan eksternal)
- **Transparansi** - APBDes dengan infografis dan grafik, Galeri Infografis/Publikasi
- **Potensi Desa** - Pertanian & Peternakan, UMKM & Pariwisata
- **Publikasi & Berita** - Kabar Desa, Pengumuman
- **Kontak & Pengaduan** - Formulir pengaduan langsung ke database

### Admin Panel
- Dashboard dengan ringkasan statistik
- CRUD lengkap untuk semua tabel (Profil, Statistik, Berita, Panduan, Dokumen, Lembaga, Galeri, Komoditas, UMKM, APBDes, Pengaduan)
- Proteksi rute admin berdasarkan role
- Teks footer BPS dapat dikonfigurasi

### Teknologi
- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS + shadcn/ui
- **Backend**: Hono + tRPC 11 + Drizzle ORM + MySQL
- **Auth**: OAuth 2.0 dengan role-based access control
- **Database**: MySQL (kompatibel dengan PlanetScale)

## Struktur Menu

```
Beranda
Profil Desa
  - Sejarah & Visi Misi
  - Kondisi Geografis
  - Demografi Penduduk
Pemerintahan
  - Struktur Organisasi Pemdes
  - BPD
  - Lembaga Kemasyarakatan
Layanan Publik
  - Panduan Layanan
  - Unduh Dokumen
  - Layanan Mandiri
Transparansi & Pusat Data
  - Transparansi APBDes
  - Galeri Infografis
Potensi Desa
  - Pertanian & Peternakan
  - UMKM & Pariwisata
Publikasi & Berita
  - Kabar Desa
  - Pengumuman
Kontak & Pengaduan
```

## Struktur Folder

```
├── api/                    # Backend tRPC + Hono
│   ├── desa-router.ts      # Router utama untuk semua tabel desa
│   ├── auth-router.ts      # Router autentikasi
│   ├── middleware.ts       # Middleware (public, authed, admin queries)
│   └── ...
├── db/
│   ├── schema.ts           # Definisi semua tabel database
│   ├── relations.ts        # Relasi antar tabel
│   └── seed.ts             # Script seed data
├── src/
│   ├── pages/              # Halaman publik
│   │   ├── Home.tsx
│   │   ├── profil/         # Sejarah, Geografis, Demografi
│   │   ├── pemerintahan/   # Struktur, BPD, Lembaga
│   │   ├── layanan/        # Panduan, Dokumen, Mandiri
│   │   ├── transparansi/   # APBDes, Galeri
│   │   ├── potensi/        # Komoditas, UMKM
│   │   ├── Berita.tsx
│   │   ├── BeritaDetail.tsx
│   │   └── Kontak.tsx
│   ├── pages/admin/        # Halaman admin panel
│   │   ├── Dashboard.tsx
│   │   ├── Profil.tsx
│   │   ├── Statistik.tsx
│   │   ├── Berita.tsx
│   │   ├── Panduan.tsx
│   │   ├── Dokumen.tsx
│   │   ├── Lembaga.tsx
│   │   ├── Galeri.tsx
│   │   ├── Komoditas.tsx
│   │   ├── Umkm.tsx
│   │   ├── Apbdes.tsx
│   │   └── Pengaduan.tsx
│   ├── components/
│   │   ├── Layout.tsx      # Layout publik
│   │   ├── AdminLayout.tsx # Layout admin panel
│   │   ├── Navbar.tsx      # Navigasi publik
│   │   └── Footer.tsx      # Footer dengan teks BPS
│   ├── hooks/
│   │   └── useAuth.ts      # Hook autentikasi
│   └── providers/
│       └── trpc.tsx        # Provider tRPC
├── contracts/
│   └── constants.ts        # Konstanta aplikasi
└── drizzle.config.ts       # Konfigurasi Drizzle ORM
```

## Database Schema

### Tabel-tabel:
- `users` - Admin/users (dikelola oleh auth system)
- `profil_desa` - Key-value store untuk semua setting desa
- `statistik_desa` - Data kependudukan dan demografi
- `berita` - Berita, pengumuman, kabar desa
- `panduan` - Panduan layanan publik
- `dokumen` - Dokumen unduhan
- `lembaga` - Lembaga kemasyarakatan
- `galeri` - Galeri foto dan infografis
- `komoditas` - Komoditas pertanian/peternakan
- `umkm` - Usaha mikro, kecil, menengah
- `pengaduan` - Pengaduan masyarakat
- `apbdes` - Anggaran Pendapatan dan Belanja Desa

## Environment Variables

Buat file `.env` di root project:

```env
DATABASE_URL=mysql://username:password@host:port/database
# Auth credentials (otomatis di-generate oleh init script)
```

## Scripts

| Script | Deskripsi |
|--------|-----------|
| `npm run dev` | Development server |
| `npm run build` | Build production |
| `npm run start` | Production server |
| `npm run check` | Type-check TypeScript |
| `npm run db:push` | Push schema ke database |
| `npm run db:generate` | Generate migration SQL |
| `npm run db:migrate` | Jalankan migration |
| `npx tsx db/seed.ts` | Seed data contoh |

## License

MIT License - Template untuk Pemerintah Desa Indonesia
