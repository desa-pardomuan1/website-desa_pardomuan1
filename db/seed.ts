import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const connection = await mysql.createConnection({
  uri: process.env.DATABASE_URL,
});

const db = drizzle(connection, { schema, mode: "planetscale" });

console.log("🌱 Seeding database...\n");

// 1. Seed profil_desa
console.log("Seeding profil_desa...");
const profilData = [
  { kunci: "nama_desa", nilai: "Desa Sianjur Mula-Mula" },
  { kunci: "kecamatan", nilai: "Sianjur Mula-Mula" },
  { kunci: "kabupaten", nilai: "Samosir" },
  { kunci: "provinsi", nilai: "Sumatera Utara" },
  { kunci: "kode_pos", nilai: "22396" },
  {
    kunci: "visi",
    nilai:
      "Terwujudnya Desa Sianjur Mula-Mula yang Maju, Mandiri, dan Sejahtera Berbasis Potensi Lokal",
  },
  {
    kunci: "misi",
    nilai: JSON.stringify([
      "Meningkatkan kualitas sumber daya manusia yang berdaya saing",
      "Mengembangkan potensi ekonomi lokal berbasis pertanian dan pariwisata",
      "Meningkatkan kualitas pelayanan publik yang transparan dan akuntabel",
      "Memperkuat infrastruktur dasar untuk mendukung kegiatan masyarakat",
      "Melestarikan nilai-nilai budaya dan sosial kemasyarakatan",
    ]),
  },
  {
    kunci: "sejarah",
    nilai:
      "Desa Sianjur Mula-Mula merupakan salah satu desa tertua di Kabupaten Samosir yang memiliki sejarah panjang dalam peradaban Batak. Nama 'Sianjur Mula-Mula' berasal dari legenda masyarakat setempat yang menyebutkan bahwa desa ini merupakan tempat pertama kali nenek moyang suku Batak menetap di wilayah Danau Toba. Dengan kekayaan budaya dan sejarah yang dimilikinya, Desa Sianjur Mula-Mula menjadi destinasi wisata budaya yang menarik bagi wisatawan lokal maupun mancanegara. Desa ini dikenal dengan tradisi Sigale-gale dan berbagai warisan budaya Batak yang masih dilestarikan hingga saat ini.",
  },
  {
    kunci: "geografis",
    nilai: JSON.stringify({
      luas: "1.250,50",
      batas_utara: "Desa Parbalohan",
      batas_selatan: "Desa Bonan Dolok",
      batas_barat: "Danau Toba",
      batas_timur: "Desa Harian Boho",
      ketinggian: "1.200 meter di atas permukaan laut",
      iklim: "Tropis basah dengan curah hujan tinggi",
      jumlah_dusun: "5",
      jumlah_rt: "18",
      jumlah_rw: "6",
    }),
  },
  { kunci: "kontak_wa", nilai: "+6281234567890" },
  { kunci: "kontak_email", nilai: "desa.sianjur@email.com" },
  { kunci: "kontak_telepon", nilai: "(0626) 123456" },
  {
    kunci: "medsos",
    nilai: JSON.stringify({
      facebook: "Desa Sianjur Mula-Mula",
      instagram: "@desa.sianjur",
      youtube: "Desa Sianjur Mula-Mula",
    }),
  },
  {
    kunci: "google_maps_embed",
    nilai:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3985.123456789!2d98.7167!3d2.6833!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMsKwNDEnMDAuMCJOIDk4wrA0MycwMC4wIkU!5e0!3m2!1sen!2sid!4v1600000000000!5m2!1sen!2sid",
  },
  {
    kunci: "footer_teks",
    nilai:
      "Hasil Pembinaan Desa Cantik (Desa Cinta Statistik) BPS Kabupaten Samosir",
  },
  { kunci: "footer_logo_url", nilai: "" },
  { kunci: "layanan_mandiri_url", nilai: "https://google.com" },
];

for (const item of profilData) {
  await db.insert(schema.profilDesa).values(item).onDuplicateKeyUpdate({
    set: { nilai: item.nilai },
  });
}

// 2. Seed statistik_desa
console.log("Seeding statistik_desa...");
await db.insert(schema.statistikDesa).values({
  tahun: 2024,
  totalPenduduk: 2847,
  totalKK: 712,
  totalLakiLaki: 1420,
  totalPerempuan: 1427,
  luasWilayah: "1250.50",
  jumlahDusun: 5,
  jumlahRT: 18,
  jumlahRW: 6,
  dataPendidikan: {
    tidakSekolah: 89,
    sd: 756,
    smp: 624,
    sma: 891,
    diploma: 312,
    sarjana: 175,
  },
  dataAngkatanKerja: {
    bekerja: 1420,
    pengangguran: 87,
    tidakBekerja: 1340,
  },
  dataUsia: {
    range0_4: 198,
    range5_9: 245,
    range10_14: 267,
    range15_19: 289,
    range20_24: 312,
    range25_29: 278,
    range30_34: 234,
    range35_39: 198,
    range40_44: 187,
    range45_49: 165,
    range50_54: 142,
    range55_59: 98,
    range60_64: 76,
    range65_plus: 158,
  },
});

// 3. Seed berita
console.log("Seeding berita...");
const beritaData = [
  {
    judul: "Desa Sianjur Mula-Mula Raih Penghargaan Desa Cantik 2024",
    slug: "desa-sianjur-mula-mula-raih-penghargaan-desa-cantik-2024",
    isi: "Desa Sianjur Mula-Mula berhasil meraih penghargaan Desa Cantik (Desa Cinta Statistik) tahun 2024 tingkat Kabupaten Samosir. Penghargaan ini diberikan atas komitmen desa dalam pembangunan berbasis data yang akurat dan transparan. Kepala Desa Sianjur Mula-Mula, Bapak Mangaratua Simanjuntak, menerima penghargaan ini langsung dari Kepala BPS Kabupaten Samosir dalam acara yang berlangsung meriah di Aula Kantor Bupati Samosir.",
    gambarSampul:
      "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800",
    kategori: "berita" as const,
    status: "published" as const,
    tanggalPublish: new Date("2024-11-15"),
  },
  {
    judul: "Jadwal Vaksinasi Massal Bulan Desember 2024",
    slug: "jadwal-vaksinasi-massal-desember-2024",
    isi: "Dinas Kesehatan Kabupaten Samosir bekerjasama dengan Puskesmas Sianjur Mula-Mula akan mengadakan vaksinasi massal pada tanggal 10-12 Desember 2024. Vaksinasi akan dilaksanakan di Balai Desa Sianjur Mula-Mula mulai pukul 08.00 WIB. Warga diharapkan membawa KTP dan kartu vaksin sebelumnya.",
    gambarSampul:
      "https://images.unsplash.com/photo-1584634731339-252c581abfc5?w=800",
    kategori: "pengumuman" as const,
    status: "published" as const,
    tanggalPublish: new Date("2024-12-01"),
  },
  {
    judul: "Pelatihan UMKM Digital untuk Masyarakat Desa",
    slug: "pelatihan-umkm-digital-masyarakat-desa",
    isi: "Pemerintah Desa Sianjur Mula-Mula mengadakan pelatihan UMKM Digital bagi pelaku usaha mikro, kecil, dan menengah di desa kita. Pelatihan ini bertujuan untuk meningkatkan kemampuan pengusaha lokal dalam memasarkan produk melalui platform digital. Peserta akan belajar tentang pemasaran sosial media, manajemen pesanan online, dan strategi branding produk lokal.",
    gambarSampul:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=800",
    kategori: "kabar_desa" as const,
    status: "published" as const,
    tanggalPublish: new Date("2024-10-20"),
  },
  {
    judul: "Perbaikan Jalan Dusun Parhalangan Selesai Dikerjakan",
    slug: "perbaikan-jalan-dusun-parhalangan-selesai",
    isi: "Proyek perbaikan jalan di Dusun Parhalangan telah selesai dikerjakan. Perbaikan ini mencakup pengaspalan sepanjang 2,5 kilometer dengan lebar 4 meter. Pengerjaan dilaksanakan selama 3 bulan dan telah meningkatkan aksesibilitas bagi warga Dusun Parhalangan dan sekitarnya.",
    gambarSampul:
      "https://images.unsplash.com/photo-1596727147705-54a9d750e58d?w=800",
    kategori: "kabar_desa" as const,
    status: "published" as const,
    tanggalPublish: new Date("2024-09-05"),
  },
];
for (const item of beritaData) {
  await db.insert(schema.berita).values(item);
}

// 4. Seed panduan
console.log("Seeding panduan...");
const panduanData = [
  {
    judul: "Panduan Pembuatan KTP Elektronik",
    konten:
      "Persyaratan:\n1. Fotokopi KK\n2. Surat pengantar dari RT/RW\n3. KTP lama (untuk penggantian)\n\nProsedur:\n1. Datang ke kantor desa dengan membawa persyaratan\n2. Mengisi formulir permohonan\n3. Verifikasi data oleh petugas\n4. Pengambilan foto dan sidik jari\n5. Menunggu proses cetak (maksimal 14 hari kerja)\n6. Pengambilan KTP di kantor desa",
    kategori: "Dokumen Kependudukan",
    urutan: 1,
  },
  {
    judul: "Panduan Pembuatan KK Baru",
    konten:
      "Persyaratan:\n1. Surat pengantar dari RT/RW\n2. Buku nikah/akta perkawinan\n3. KTP kepala keluarga\n4. KTP seluruh anggota keluarga\n\nProsedur:\n1. Mengajukan permohonan di kantor desa\n2. Mengisi formulir F-1.15\n3. Verifikasi oleh petugas\n4. Proses penerbitan KK baru\n5. Pengambilan KK (maksimal 7 hari kerja)",
    kategori: "Dokumen Kependudukan",
    urutan: 2,
  },
  {
    judul: "Panduan Pengurusan Surat Keterangan Domisili",
    konten:
      "Persyaratan:\n1. Fotokopi KTP\n2. Fotokopi KK\n3. Surat pengantar dari RT/RW\n\nProsedur:\n1. Mengajukan permohonan di kantor desa\n2. Mengisi formulir permohonan\n3. Verifikasi data oleh petugas\n4. Penerbitan surat keterangan domisili\n5. Surat dapat diambil pada hari yang sama",
    kategori: "Surat Keterangan",
    urutan: 3,
  },
  {
    judul: "Panduan Pengurusan Surat Keterangan Usaha",
    konten:
      "Persyaratan:\n1. Fotokopi KTP\n2. Fotokopi KK\n3. Surat pengantar dari RT/RW\n4. Keterangan lokasi usaha\n\nProsedur:\n1. Mengajukan permohonan di kantor desa\n2. Mengisi formulir permohonan\n3. Verifikasi lokasi usaha oleh petugas\n4. Penerbitan surat keterangan usaha\n5. Surat dapat diambil dalam 1-2 hari kerja",
    kategori: "Surat Keterangan",
    urutan: 4,
  },
];
for (const item of panduanData) {
  await db.insert(schema.panduan).values(item);
}

// 5. Seed dokumen
console.log("Seeding dokumen...");
const dokumenData = [
  {
    judul: "Rencana Pembangunan Jangka Menengah Desa (RPJMD) 2024-2029",
    fileUrl: "#",
    deskripsi: "Dokumen perencanaan pembangunan desa periode 2024-2029",
    kategori: "Perencanaan",
    urutan: 1,
  },
  {
    judul: "Peraturan Desa Nomor 1 Tahun 2024 tentang APBDes",
    fileUrl: "#",
    deskripsi: "Peraturan desa mengenai Anggaran Pendapatan dan Belanja Desa tahun 2024",
    kategori: "Peraturan Desa",
    urutan: 2,
  },
  {
    judul: "Laporan Realisasi APBDes Tahun 2024",
    fileUrl: "#",
    deskripsi: "Laporan realisasi anggaran desa tahun 2024",
    kategori: "Laporan Keuangan",
    urutan: 3,
  },
  {
    judul: "Produk Hukum Desa Tahun 2024",
    fileUrl: "#",
    deskripsi: "Kumpulan produk hukum yang diterbitkan desa tahun 2024",
    kategori: "Produk Hukum",
    urutan: 4,
  },
];
for (const item of dokumenData) {
  await db.insert(schema.dokumen).values(item);
}

// 6. Seed lembaga
console.log("Seeding lembaga...");
const lembagaData = [
  {
    nama: "Pemerintah Desa Sianjur Mula-Mula",
    jenis: "pemerintahan" as const,
    deskripsi:
      "Pemerintah Desa Sianjur Mula-Mula merupakan lembaga eksekutif desa yang bertanggung jawab atas penyelenggaraan pemerintahan dan pembangunan desa. Terdiri dari Kepala Desa, Sekretaris Desa, dan perangkat desa lainnya.",
    fotoUrl: "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=600",
    ketua: "Mangaratua Simanjuntak",
    anggota: 12,
    urutan: 1,
  },
  {
    nama: "Badan Permusyawaratan Desa (BPD)",
    jenis: "bpd" as const,
    deskripsi:
      "BPD merupakan lembaga legislatif desa yang berfungsi sebagai penyelenggara musyawarah desa, menampung dan menyalurkan aspirasi masyarakat, serta melakukan pengawasan terhadap penyelenggaraan pemerintahan desa.",
    fotoUrl: "https://images.unsplash.com/photo-1558008258-3256797b43f3?w=600",
    ketua: "Jonatan Sihombing",
    anggota: 7,
    urutan: 2,
  },
  {
    nama: "Pemberdayaan dan Kesejahteraan Keluarga (PKK)",
    jenis: "pkk" as const,
    deskripsi:
      "PKK Desa Sianjur Mula-Mula aktif dalam berbagai kegiatan pemberdayaan perempuan dan kesejahteraan keluarga, termasuk program kesehatan, pendidikan, dan ekonomi keluarga.",
    fotoUrl: "https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600",
    ketua: "Dra. Rosmawati Sitorus",
    anggota: 25,
    urutan: 3,
  },
  {
    nama: "Karang Taruna",
    jenis: "karang_taruna" as const,
    deskripsi:
      "Karang Taruna Desa Sianjur Mula-Mula merupakan wadah pengembangan generasi muda yang aktif dalam kegiatan sosial, olahraga, seni budaya, dan kewirausahaan pemuda.",
    fotoUrl: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600",
    ketua: "Andreas Manurung",
    anggota: 35,
    urutan: 4,
  },
  {
    nama: "Lembaga Pemberdayaan Masyarakat Desa (LPMD)",
    jenis: "lpmd" as const,
    deskripsi:
      "LPMD berperan dalam memfasilitasi pemberdayaan masyarakat dan koordinasi pelaksanaan program pembangunan di tingkat desa.",
    fotoUrl: "https://images.unsplash.com/photo-1491438590914-bc09fcaaf77a?w=600",
    ketua: "Poltak Simbolon",
    anggota: 15,
    urutan: 5,
  },
];
for (const item of lembagaData) {
  await db.insert(schema.lembaga).values(item);
}

// 7. Seed galeri
console.log("Seeding galeri...");
const galeriData = [
  {
    judul: "Upacara Peringatan HUT RI Ke-79",
    gambarUrl:
      "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=800",
    kategori: "kegiatan" as const,
    tanggal: new Date("2024-08-17"),
    deskripsi: "Peringatan Hari Kemerdekaan RI di lapangan desa",
  },
  {
    judul: "Pemandangan Danau Toba dari Desa",
    gambarUrl:
      "https://images.unsplash.com/photo-1518548419970-58e3b4079ab2?w=800",
    kategori: "pariwisata" as const,
    tanggal: new Date("2024-06-15"),
    deskripsi: "Keindahan Danau Toba yang terlihat dari Desa Sianjur Mula-Mula",
  },
  {
    judul: "Festival Budaya Batak",
    gambarUrl:
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800",
    kategori: "kegiatan" as const,
    tanggal: new Date("2024-07-20"),
    deskripsi: "Festival budaya tahunan yang menampilkan tarian dan musik tradisional Batak",
  },
  {
    judul: "Pertanian Sayur Mayur Warga",
    gambarUrl:
      "https://images.unsplash.com/photo-1595855759920-86582396756a?w=800",
    kategori: "pertanian" as const,
    tanggal: new Date("2024-05-10"),
    deskripsi: "Aktivitas pertanian sayur mayur oleh masyarakat desa",
  },
  {
    judul: "Produk Kerajinan Ulos",
    gambarUrl:
      "https://images.unsplash.com/photo-1606293926075-69a00febf780?w=800",
    kategori: "umkm" as const,
    tanggal: new Date("2024-04-22"),
    deskripsi: "Produk kerajinan kain ulos khas Batak",
  },
  {
    judul: "Rapat Koordinasi Pembangunan",
    gambarUrl:
      "https://images.unsplash.com/photo-1577962917302-cd874c4e31d2?w=800",
    kategori: "kegiatan" as const,
    tanggal: new Date("2024-03-15"),
    deskripsi: "Rapat koordinasi perencanaan pembangunan desa",
  },
];
for (const item of galeriData) {
  await db.insert(schema.galeri).values(item);
}

// 8. Seed komoditas
console.log("Seeding komoditas...");
const komoditasData = [
  {
    nama: "Padi",
    jenis: "pertanian" as const,
    deskripsi:
      "Padi merupakan komoditas utama pertanian di Desa Sianjur Mula-Mula. Ditanam di sawah irigasi dan tadah hujan dengan varietas unggul lokal.",
    luasLahan: "450.00",
    hasilProduksi: "2250.00",
    satuan: "ton",
    fotoUrl:
      "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600",
    urutan: 1,
  },
  {
    nama: "Jagung",
    jenis: "pertanian" as const,
    deskripsi:
      "Jagung ditanam sebagai komoditas kedua setelah padi, digunakan untuk konsumsi lokal dan pakan ternak.",
    luasLahan: "200.00",
    hasilProduksi: "800.00",
    satuan: "ton",
    fotoUrl:
      "https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=600",
    urutan: 2,
  },
  {
    nama: "Sayur Mayur",
    jenis: "pertanian" as const,
    deskripsi:
      "Berbagai jenis sayuran seperti sawi, bayam, dan cabai ditanam oleh kelompok tani desa untuk pasar lokal.",
    luasLahan: "75.00",
    hasilProduksi: "150.00",
    satuan: "ton",
    fotoUrl:
      "https://images.unsplash.com/photo-1595855759920-86582396756a?w=600",
    urutan: 3,
  },
  {
    nama: "Sapi",
    jenis: "peternakan" as const,
    deskripsi:
      "Peternakan sapi merupakan salah satu mata pencaharian warga, baik untuk penggemukan maupun perah.",
    hasilProduksi: "320",
    satuan: "ekor",
    fotoUrl:
      "https://images.unsplash.com/photo-1596733430284-f7437764b1a9?w=600",
    urutan: 4,
  },
  {
    nama: "Kerbau",
    jenis: "peternakan" as const,
    deskripsi:
      "Kerbau menjadi bagian penting dalam budaya Batak dan juga sebagai aset ekonomi masyarakat.",
    hasilProduksi: "180",
    satuan: "ekor",
    fotoUrl:
      "https://images.unsplash.com/photo-1569493086584-33e0b36f3145?w=600",
    urutan: 5,
  },
  {
    nama: "Ayam Kampung",
    jenis: "peternakan" as const,
    deskripsi:
      "Ternak ayam kampung dikembangkan untuk memenuhi kebutuhan pasar lokal dan wisata kuliner.",
    hasilProduksi: "2500",
    satuan: "ekor",
    fotoUrl:
      "https://images.unsplash.com/photo-1569506382784-1d8b275e24bb?w=600",
    urutan: 6,
  },
  {
    nama: "Ikan Nila",
    jenis: "perikanan" as const,
    deskripsi:
      "Budidaya ikan nila di kolam terpal dan sungai oleh kelompok nelayan desa.",
    hasilProduksi: "45.00",
    satuan: "ton",
    fotoUrl:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600",
    urutan: 7,
  },
];
for (const item of komoditasData) {
  await db.insert(schema.komoditas).values(item);
}

// 9. Seed UMKM
console.log("Seeding umkm...");
const umkmData = [
  {
    namaProduk: "Kain Ulos Batak Toba",
    namaUsaha: "Ulos Sianjur Indah",
    deskripsi:
      "Kerajinan kain ulos tradisional Batak Toba dengan motif khas. Diproduksi secara turun-temurun oleh pengrajin lokal desa.",
    fotoUrl:
      "https://images.unsplash.com/photo-1606293926075-69a00febf780?w=600",
    link: "#",
    kategori: "kerajinan" as const,
    pemilik: "Ibu Marpaung",
    kontak: "081234567891",
  },
  {
    namaProduk: "Mie Gomak Khas Batak",
    namaUsaha: "Mie Gomak Mak Ria",
    deskripsi:
      "Mie Gomak adalah makanan khas Batak yang terbuat dari mie lokal dengan kuah santan dan andaliman. Tersedia dalam kemasan siap masak.",
    fotoUrl:
      "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600",
    link: "#",
    kategori: "makanan" as const,
    pemilik: "Ibu Ria Naibaho",
    kontak: "081234567892",
  },
  {
    namaProduk: "Kopi Sidikalang Arabika",
    namaUsaha: "Sianjur Coffee",
    deskripsi:
      "Kopi arabika asli dataran tinggi Sidikalang dengan cita rasa yang khas. Diproses secara tradisional oleh petani kopi lokal.",
    fotoUrl:
      "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=600",
    link: "#",
    kategori: "minuman" as const,
    pemilik: "Bapak Panggabean",
    kontak: "081234567893",
  },
  {
    namaProduk: "Souvenir Gantungan Kunci Batak",
    namaUsaha: "Cendera Mata Sianjur",
    deskripsi:
      "Berbagai souvenir khas Batak seperti gantungan kunci, magnet kulkas, dan hiasan dinding dengan motif ulos dan patung Sigale-gale.",
    fotoUrl:
      "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600",
    link: "#",
    kategori: "kerajinan" as const,
    pemilik: "Bapak Silalahi",
    kontak: "081234567894",
  },
  {
    namaProduk: "Sayur Organik Segar",
    namaUsaha: "Tani Organik Sianjur",
    deskripsi:
      "Berbagai sayuran organik segar ditanam tanpa pestisida kimia. Tersedia sayur sawi, bayam, kangkung, dan cabai.",
    fotoUrl:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600",
    link: "#",
    kategori: "pertanian" as const,
    pemilik: "Kelompok Tani Makmur",
    kontak: "081234567895",
  },
];
for (const item of umkmData) {
  await db.insert(schema.umkm).values(item);
}

// 10. Seed APBDes
console.log("Seeding apbdes...");
await db.insert(schema.apbdes).values({
  tahun: 2024,
  pendapatanTotal: "2850000000.00",
  belanjaTotal: "2750000000.00",
  pembiayaanTotal: "100000000.00",
  rincianPendapatan: [
    { sumber: "Dana Desa", jumlah: 1200000000 },
    { sumber: "Bagi Hasil Pajak", jumlah: 350000000 },
    { sumber: "Alokasi Dana Desa", jumlah: 800000000 },
    { sumber: "PAD Desa", jumlah: 500000000 },
  ],
  rincianBelanja: [
    { bidang: "Penyelenggaraan Pemerintahan Desa", jumlah: 800000000 },
    { bidang: "Pelaksanaan Pembangunan Desa", jumlah: 900000000 },
    { bidang: "Pemberdayaan Masyarakat", jumlah: 550000000 },
    { bidang: "Pembinaan Kemasyarakatan", jumlah: 350000000 },
    { bidang: "Penanganan Darurat", jumlah: 150000000 },
  ],
  dokumenUrl: "#",
});

// 11. Seed pengaduan
console.log("Seeding pengaduan...");
const pengaduanData = [
  {
    nama: "Budi Simanjuntak",
    kontak: "081234567890",
    email: "budi@email.com",
    pesan:
      "Mohon perhatiannya untuk perbaikan lampu jalan di Dusun Parhalangan karena sudah 2 minggu padam. Terima kasih.",
    status: "selesai" as const,
    respon: "Terima kasih atas laporannya. Perbaikan lampu jalan telah dilakukan pada tanggal 5 November 2024.",
  },
  {
    nama: "Maria Sihombing",
    kontak: "081234567899",
    email: "maria@email.com",
    pesan:
      "Saya ingin melaporkan adanya saluran air yang tersumbat di RT 03 RW 02. Mohon ditindaklanjuti. Terima kasih.",
    status: "diproses" as const,
    respon: "Laporan Anda sedang dalam proses penanganan. Petugas akan segera datang ke lokasi.",
  },
  {
    nama: "Poltak Nainggolan",
    kontak: "081234567888",
    pesan:
      "Apakah ada jadwal vaksinasi hewan ternak bulan ini? Mohon informasinya. Terima kasih.",
    status: "baru" as const,
  },
];
for (const item of pengaduanData) {
  await db.insert(schema.pengaduan).values(item);
}

console.log("\n✅ Seeding completed successfully!");

await connection.end();
