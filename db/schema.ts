import {
  mysqlTable,
  mysqlEnum,
  serial,
  varchar,
  text,
  timestamp,
  int,
  json,
  decimal,
} from "drizzle-orm/mysql-core";

// ============================================================
// Users table (for admin authentication - managed by auth system)
// ============================================================
export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),
  unionId: varchar("unionId", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 320 }),
  avatar: text("avatar"),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
  lastSignInAt: timestamp("lastSignInAt").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================================
// 1. profil_desa - Key-value store for village settings
// ============================================================
export const profilDesa = mysqlTable("profil_desa", {
  id: serial("id").primaryKey(),
  kunci: varchar("kunci", { length: 100 }).notNull().unique(),
  nilai: text("nilai"),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type ProfilDesa = typeof profilDesa.$inferSelect;
export type InsertProfilDesa = typeof profilDesa.$inferInsert;

// ============================================================
// 2. statistik_desa - Village statistics & demographics
// ============================================================
export const statistikDesa = mysqlTable("statistik_desa", {
  id: serial("id").primaryKey(),
  tahun: int("tahun").notNull(),
  totalPenduduk: int("total_penduduk").default(0),
  totalKK: int("total_kk").default(0),
  totalLakiLaki: int("total_laki_laki").default(0),
  totalPerempuan: int("total_perempuan").default(0),
  luasWilayah: decimal("luas_wilayah", { precision: 10, scale: 2 }).default("0"),
  jumlahDusun: int("jumlah_dusun").default(0),
  jumlahRT: int("jumlah_rt").default(0),
  jumlahRW: int("jumlah_rw").default(0),
  // Demografi detail sebagai JSON
  dataPendidikan: json("data_pendidikan").$type<{
    tidakSekolah: number;
    sd: number;
    smp: number;
    sma: number;
    diploma: number;
    sarjana: number;
  }>(),
  dataAngkatanKerja: json("data_angkatan_kerja").$type<{
    bekerja: number;
    pengangguran: number;
    tidakBekerja: number;
  }>(),
  dataUsia: json("data_usia").$type<{
    range0_4: number;
    range5_9: number;
    range10_14: number;
    range15_19: number;
    range20_24: number;
    range25_29: number;
    range30_34: number;
    range35_39: number;
    range40_44: number;
    range45_49: number;
    range50_54: number;
    range55_59: number;
    range60_64: number;
    range65_plus: number;
  }>(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type StatistikDesa = typeof statistikDesa.$inferSelect;
export type InsertStatistikDesa = typeof statistikDesa.$inferInsert;

// ============================================================
// 3. berita - News & announcements
// ============================================================
export const berita = mysqlTable("berita", {
  id: serial("id").primaryKey(),
  judul: varchar("judul", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  isi: text("isi").notNull(),
  gambarSampul: text("gambar_sampul"),
  kategori: mysqlEnum("kategori", ["kabar_desa", "pengumuman", "berita"])
    .default("kabar_desa")
    .notNull(),
  status: mysqlEnum("status", ["draft", "published", "archived"])
    .default("draft")
    .notNull(),
  tanggalPublish: timestamp("tanggal_publish").defaultNow(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Berita = typeof berita.$inferSelect;
export type InsertBerita = typeof berita.$inferInsert;

// ============================================================
// 4. panduan - Service guides
// ============================================================
export const panduan = mysqlTable("panduan", {
  id: serial("id").primaryKey(),
  judul: varchar("judul", { length: 255 }).notNull(),
  konten: text("konten").notNull(),
  filePdf: text("file_pdf"),
  kategori: varchar("kategori", { length: 100 }),
  urutan: int("urutan").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Panduan = typeof panduan.$inferSelect;
export type InsertPanduan = typeof panduan.$inferInsert;

// ============================================================
// 5. dokumen - Downloadable documents
// ============================================================
export const dokumen = mysqlTable("dokumen", {
  id: serial("id").primaryKey(),
  judul: varchar("judul", { length: 255 }).notNull(),
  fileUrl: text("file_url").notNull(),
  deskripsi: text("deskripsi"),
  kategori: varchar("kategori", { length: 100 }),
  urutan: int("urutan").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Dokumen = typeof dokumen.$inferSelect;
export type InsertDokumen = typeof dokumen.$inferInsert;

// ============================================================
// 6. lembaga - Community institutions
// ============================================================
export const lembaga = mysqlTable("lembaga", {
  id: serial("id").primaryKey(),
  nama: varchar("nama", { length: 255 }).notNull(),
  jenis: mysqlEnum("jenis", [
    "pemerintahan",
    "bpd",
    "pkk",
    "karang_taruna",
    "lpmd",
    "lainnya",
  ])
    .default("lainnya")
    .notNull(),
  deskripsi: text("deskripsi"),
  fotoUrl: text("foto_url"),
  ketua: varchar("ketua", { length: 255 }),
  anggota: int("anggota").default(0),
  urutan: int("urutan").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Lembaga = typeof lembaga.$inferSelect;
export type InsertLembaga = typeof lembaga.$inferInsert;

// ============================================================
// 7. galeri - Photo gallery
// ============================================================
export const galeri = mysqlTable("galeri", {
  id: serial("id").primaryKey(),
  judul: varchar("judul", { length: 255 }).notNull(),
  gambarUrl: text("gambar_url").notNull(),
  kategori: mysqlEnum("kategori", [
    "kegiatan",
    "infraastruktur",
    "pariwisata",
    "umkm",
    "pertanian",
    "infografis",
    "lainnya",
  ])
    .default("lainnya")
    .notNull(),
  tanggal: timestamp("tanggal").defaultNow(),
  deskripsi: text("deskripsi"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Galeri = typeof galeri.$inferSelect;
export type InsertGaleri = typeof galeri.$inferInsert;

// ============================================================
// 8. komoditas - Agricultural commodities
// ============================================================
export const komoditas = mysqlTable("komoditas", {
  id: serial("id").primaryKey(),
  nama: varchar("nama", { length: 255 }).notNull(),
  jenis: mysqlEnum("jenis", ["pertanian", "peternakan", "perikanan", "perkebunan"])
    .default("pertanian")
    .notNull(),
  deskripsi: text("deskripsi"),
  luasLahan: decimal("luas_lahan", { precision: 10, scale: 2 }),
  hasilProduksi: decimal("hasil_produksi", { precision: 12, scale: 2 }),
  satuan: varchar("satuan", { length: 50 }).default("kg"),
  fotoUrl: text("foto_url"),
  urutan: int("urutan").default(0),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Komoditas = typeof komoditas.$inferSelect;
export type InsertKomoditas = typeof komoditas.$inferInsert;

// ============================================================
// 9. umkm - Local businesses
// ============================================================
export const umkm = mysqlTable("umkm", {
  id: serial("id").primaryKey(),
  namaProduk: varchar("nama_produk", { length: 255 }).notNull(),
  namaUsaha: varchar("nama_usaha", { length: 255 }),
  deskripsi: text("deskripsi"),
  fotoUrl: text("foto_url"),
  link: text("link"),
  kategori: mysqlEnum("kategori", [
    "makanan",
    "minuman",
    "kerajinan",
    "fashion",
    "pertanian",
    "jasa",
    "lainnya",
  ])
    .default("lainnya")
    .notNull(),
  pemilik: varchar("pemilik", { length: 255 }),
  kontak: varchar("kontak", { length: 50 }),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Umkm = typeof umkm.$inferSelect;
export type InsertUmkm = typeof umkm.$inferInsert;

// ============================================================
// 10. pengaduan - Complaints & contact messages
// ============================================================
export const pengaduan = mysqlTable("pengaduan", {
  id: serial("id").primaryKey(),
  nama: varchar("nama", { length: 255 }).notNull(),
  kontak: varchar("kontak", { length: 100 }).notNull(),
  email: varchar("email", { length: 255 }),
  pesan: text("pesan").notNull(),
  status: mysqlEnum("status", ["baru", "diproses", "selesai", "ditolak"])
    .default("baru")
    .notNull(),
  respon: text("respon"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Pengaduan = typeof pengaduan.$inferSelect;
export type InsertPengaduan = typeof pengaduan.$inferInsert;

// ============================================================
// 11. apbdes - Village budget transparency
// ============================================================
export const apbdes = mysqlTable("apbdes", {
  id: serial("id").primaryKey(),
  tahun: int("tahun").notNull(),
  pendapatanTotal: decimal("pendapatan_total", { precision: 15, scale: 2 }).default("0"),
  belanjaTotal: decimal("belanja_total", { precision: 15, scale: 2 }).default("0"),
  pembiayaanTotal: decimal("pembiayaan_total", { precision: 15, scale: 2 }).default("0"),
  // Detail sebagai JSON
  rincianPendapatan: json("rincian_pendapatan").$type<
    { sumber: string; jumlah: number }[]
  >(),
  rincianBelanja: json("rincian_belanja").$type<
    { bidang: string; jumlah: number }[]
  >(),
  dokumenUrl: text("dokumen_url"),
  gambarInfografis: text("gambar_infografis"),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt")
    .defaultNow()
    .notNull()
    .$onUpdate(() => new Date()),
});

export type Apbdes = typeof apbdes.$inferSelect;
export type InsertApbdes = typeof apbdes.$inferInsert;
