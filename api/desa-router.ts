import { z } from "zod";
import { eq, desc, asc, sql, like, and } from "drizzle-orm";
import { getDb } from "./queries/connection";
import {
  profilDesa,
  statistikDesa,
  berita,
  panduan,
  dokumen,
  lembaga,
  galeri,
  komoditas,
  umkm,
  pengaduan,
  apbdes,
} from "@db/schema";
import { createRouter, publicQuery, adminQuery } from "./middleware";

const db = () => getDb();

// ============================================================
// Profil Desa Router
// ============================================================
const profilRouter = createRouter({
  list: publicQuery.query(async () => {
    const rows = await db().select().from(profilDesa);
    const result: Record<string, string> = {};
    for (const row of rows) {
      result[row.kunci] = row.nilai || "";
    }
    return result;
  }),

  getByKey: publicQuery
    .input(z.object({ kunci: z.string() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(profilDesa)
        .where(eq(profilDesa.kunci, input.kunci));
      return rows[0]?.nilai || null;
    }),

  set: adminQuery
    .input(
      z.object({
        kunci: z.string().max(100),
        nilai: z.string(),
      })
    )
    .mutation(async ({ input }) => {
      const existing = await db()
        .select()
        .from(profilDesa)
        .where(eq(profilDesa.kunci, input.kunci));

      if (existing.length > 0) {
        await db()
          .update(profilDesa)
          .set({ nilai: input.nilai })
          .where(eq(profilDesa.kunci, input.kunci));
        return { ...existing[0], nilai: input.nilai };
      } else {
        const result = await db().insert(profilDesa).values(input);
        return { id: Number((result as any)[0]?.insertId ?? 0), ...input };
      }
    }),

  setMany: adminQuery
    .input(z.record(z.string(), z.string()))
    .mutation(async ({ input }) => {
      for (const [kunci, nilai] of Object.entries(input)) {
        const existing = await db()
          .select()
          .from(profilDesa)
          .where(eq(profilDesa.kunci, kunci));

        if (existing.length > 0) {
          await db()
            .update(profilDesa)
            .set({ nilai })
            .where(eq(profilDesa.kunci, kunci));
        } else {
          await db().insert(profilDesa).values({ kunci, nilai });
        }
      }
      return { success: true };
    }),

  delete: adminQuery
    .input(z.object({ kunci: z.string() }))
    .mutation(async ({ input }) => {
      await db()
        .delete(profilDesa)
        .where(eq(profilDesa.kunci, input.kunci));
      return { success: true };
    }),
});

// ============================================================
// Statistik Desa Router
// ============================================================
const statistikRouter = createRouter({
  list: publicQuery.query(async () => {
    return db().select().from(statistikDesa).orderBy(desc(statistikDesa.tahun));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(statistikDesa)
        .where(eq(statistikDesa.id, input.id));
      return rows[0] || null;
    }),

  getLatest: publicQuery.query(async () => {
    const rows = await db()
      .select()
      .from(statistikDesa)
      .orderBy(desc(statistikDesa.tahun))
      .limit(1);
    return rows[0] || null;
  }),

  create: adminQuery
    .input(
      z.object({
        tahun: z.number(),
        totalPenduduk: z.number().optional(),
        totalKK: z.number().optional(),
        totalLakiLaki: z.number().optional(),
        totalPerempuan: z.number().optional(),
        luasWilayah: z.string().optional(),
        jumlahDusun: z.number().optional(),
        jumlahRT: z.number().optional(),
        jumlahRW: z.number().optional(),
        dataPendidikan: z.any().optional(),
        dataAngkatanKerja: z.any().optional(),
        dataUsia: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db().insert(statistikDesa).values(input);
      return { id: Number((result as any)[0]?.insertId ?? 0), ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        tahun: z.number().optional(),
        totalPenduduk: z.number().optional(),
        totalKK: z.number().optional(),
        totalLakiLaki: z.number().optional(),
        totalPerempuan: z.number().optional(),
        luasWilayah: z.string().optional(),
        jumlahDusun: z.number().optional(),
        jumlahRT: z.number().optional(),
        jumlahRW: z.number().optional(),
        dataPendidikan: z.any().optional(),
        dataAngkatanKerja: z.any().optional(),
        dataUsia: z.any().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db().update(statistikDesa).set(data).where(eq(statistikDesa.id, id));
      return { id, ...data };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db()
        .delete(statistikDesa)
        .where(eq(statistikDesa.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// Berita Router
// ============================================================
const beritaRouter = createRouter({
  list: publicQuery
    .input(
      z
        .object({
          kategori: z.string().optional(),
          status: z.string().optional(),
          search: z.string().optional(),
          limit: z.number().optional(),
        })
        .optional()
    )
    .query(async ({ input }) => {
      let query = db()
        .select()
        .from(berita)
        .orderBy(desc(berita.tanggalPublish));

      const conditions = [];
      if (input?.kategori) {
        conditions.push(eq(berita.kategori, input.kategori as any));
      }
      if (input?.status) {
        conditions.push(eq(berita.status, input.status as any));
      }
      if (input?.search) {
        conditions.push(like(berita.judul, `%${input.search}%`));
      }

      if (conditions.length > 0) {
        query = db()
          .select()
          .from(berita)
          .where(and(...conditions))
          .orderBy(desc(berita.tanggalPublish)) as any;
      }

      const rows = await query;
      return input?.limit ? rows.slice(0, input.limit) : rows;
    }),

  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(berita)
        .where(eq(berita.slug, input.slug));
      return rows[0] || null;
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(berita)
        .where(eq(berita.id, input.id));
      return rows[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        judul: z.string(),
        slug: z.string(),
        isi: z.string(),
        gambarSampul: z.string().optional(),
        kategori: z.enum(["kabar_desa", "pengumuman", "berita"]).optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
        tanggalPublish: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const data: any = { ...input };
      if (input.tanggalPublish) {
        data.tanggalPublish = new Date(input.tanggalPublish);
      }
      const result = await db().insert(berita).values(data);
      return { id: Number((result as any)[0]?.insertId ?? 0), ...data };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        judul: z.string().optional(),
        slug: z.string().optional(),
        isi: z.string().optional(),
        gambarSampul: z.string().optional(),
        kategori: z.enum(["kabar_desa", "pengumuman", "berita"]).optional(),
        status: z.enum(["draft", "published", "archived"]).optional(),
        tanggalPublish: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...rawData } = input;
      const data: any = { ...rawData };
      if (data.tanggalPublish) {
        data.tanggalPublish = new Date(data.tanggalPublish);
      }
      await db().update(berita).set(data).where(eq(berita.id, id));
      return { id, ...data };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db().delete(berita).where(eq(berita.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// Panduan Router
// ============================================================
const panduanRouter = createRouter({
  list: publicQuery.query(async () => {
    return db().select().from(panduan).orderBy(asc(panduan.urutan));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(panduan)
        .where(eq(panduan.id, input.id));
      return rows[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        judul: z.string(),
        konten: z.string(),
        filePdf: z.string().optional(),
        kategori: z.string().optional(),
        urutan: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db().insert(panduan).values(input);
      return { id: Number((result as any)[0]?.insertId ?? 0), ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        judul: z.string().optional(),
        konten: z.string().optional(),
        filePdf: z.string().optional(),
        kategori: z.string().optional(),
        urutan: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db().update(panduan).set(data).where(eq(panduan.id, id));
      return { id, ...data };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db().delete(panduan).where(eq(panduan.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// Dokumen Router
// ============================================================
const dokumenRouter = createRouter({
  list: publicQuery.query(async () => {
    return db().select().from(dokumen).orderBy(asc(dokumen.urutan));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(dokumen)
        .where(eq(dokumen.id, input.id));
      return rows[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        judul: z.string(),
        fileUrl: z.string(),
        deskripsi: z.string().optional(),
        kategori: z.string().optional(),
        urutan: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db().insert(dokumen).values(input);
      return { id: Number((result as any)[0]?.insertId ?? 0), ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        judul: z.string().optional(),
        fileUrl: z.string().optional(),
        deskripsi: z.string().optional(),
        kategori: z.string().optional(),
        urutan: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db().update(dokumen).set(data).where(eq(dokumen.id, id));
      return { id, ...data };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db().delete(dokumen).where(eq(dokumen.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// Lembaga Router
// ============================================================
const lembagaRouter = createRouter({
  list: publicQuery
    .input(z.object({ jenis: z.string().optional() }).optional())
    .query(async ({ input }) => {
      if (input?.jenis) {
        return db()
          .select()
          .from(lembaga)
          .where(eq(lembaga.jenis, input.jenis as any))
          .orderBy(asc(lembaga.urutan));
      }
      return db().select().from(lembaga).orderBy(asc(lembaga.urutan));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(lembaga)
        .where(eq(lembaga.id, input.id));
      return rows[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        nama: z.string(),
        jenis: z
          .enum([
            "pemerintahan",
            "bpd",
            "pkk",
            "karang_taruna",
            "lpmd",
            "lainnya",
          ])
          .optional(),
        deskripsi: z.string().optional(),
        fotoUrl: z.string().optional(),
        ketua: z.string().optional(),
        anggota: z.number().optional(),
        urutan: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db().insert(lembaga).values(input);
      return { id: Number((result as any)[0]?.insertId ?? 0), ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        nama: z.string().optional(),
        jenis: z
          .enum([
            "pemerintahan",
            "bpd",
            "pkk",
            "karang_taruna",
            "lpmd",
            "lainnya",
          ])
          .optional(),
        deskripsi: z.string().optional(),
        fotoUrl: z.string().optional(),
        ketua: z.string().optional(),
        anggota: z.number().optional(),
        urutan: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db().update(lembaga).set(data).where(eq(lembaga.id, id));
      return { id, ...data };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db().delete(lembaga).where(eq(lembaga.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// Galeri Router
// ============================================================
const galeriRouter = createRouter({
  list: publicQuery
    .input(z.object({ kategori: z.string().optional() }).optional())
    .query(async ({ input }) => {
      if (input?.kategori) {
        return db()
          .select()
          .from(galeri)
          .where(eq(galeri.kategori, input.kategori as any))
          .orderBy(desc(galeri.tanggal));
      }
      return db().select().from(galeri).orderBy(desc(galeri.tanggal));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(galeri)
        .where(eq(galeri.id, input.id));
      return rows[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        judul: z.string(),
        gambarUrl: z.string(),
        kategori: z
          .enum([
            "kegiatan",
            "infraastruktur",
            "pariwisata",
            "umkm",
            "pertanian",
            "infografis",
            "lainnya",
          ])
          .optional(),
        tanggal: z.string().optional(),
        deskripsi: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const data: any = { ...input };
      if (input.tanggal) {
        data.tanggal = new Date(input.tanggal);
      }
      const result = await db().insert(galeri).values(data);
      return { id: Number((result as any)[0]?.insertId ?? 0), ...data };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        judul: z.string().optional(),
        gambarUrl: z.string().optional(),
        kategori: z
          .enum([
            "kegiatan",
            "infraastruktur",
            "pariwisata",
            "umkm",
            "pertanian",
            "infografis",
            "lainnya",
          ])
          .optional(),
        tanggal: z.string().optional(),
        deskripsi: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...rawData } = input;
      const data: any = { ...rawData };
      if (data.tanggal) {
        data.tanggal = new Date(data.tanggal);
      }
      await db().update(galeri).set(data).where(eq(galeri.id, id));
      return { id, ...data };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db().delete(galeri).where(eq(galeri.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// Komoditas Router
// ============================================================
const komoditasRouter = createRouter({
  list: publicQuery
    .input(z.object({ jenis: z.string().optional() }).optional())
    .query(async ({ input }) => {
      if (input?.jenis) {
        return db()
          .select()
          .from(komoditas)
          .where(eq(komoditas.jenis, input.jenis as any))
          .orderBy(asc(komoditas.urutan));
      }
      return db().select().from(komoditas).orderBy(asc(komoditas.urutan));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(komoditas)
        .where(eq(komoditas.id, input.id));
      return rows[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        nama: z.string(),
        jenis: z
          .enum(["pertanian", "peternakan", "perikanan", "perkebunan"])
          .optional(),
        deskripsi: z.string().optional(),
        luasLahan: z.string().optional(),
        hasilProduksi: z.string().optional(),
        satuan: z.string().optional(),
        fotoUrl: z.string().optional(),
        urutan: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db().insert(komoditas).values(input);
      return { id: Number((result as any)[0]?.insertId ?? 0), ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        nama: z.string().optional(),
        jenis: z
          .enum(["pertanian", "peternakan", "perikanan", "perkebunan"])
          .optional(),
        deskripsi: z.string().optional(),
        luasLahan: z.string().optional(),
        hasilProduksi: z.string().optional(),
        satuan: z.string().optional(),
        fotoUrl: z.string().optional(),
        urutan: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db().update(komoditas).set(data).where(eq(komoditas.id, id));
      return { id, ...data };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db().delete(komoditas).where(eq(komoditas.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// UMKM Router
// ============================================================
const umkmRouter = createRouter({
  list: publicQuery
    .input(z.object({ kategori: z.string().optional() }).optional())
    .query(async ({ input }) => {
      if (input?.kategori) {
        return db()
          .select()
          .from(umkm)
          .where(eq(umkm.kategori, input.kategori as any))
          .orderBy(desc(umkm.createdAt));
      }
      return db().select().from(umkm).orderBy(desc(umkm.createdAt));
    }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(umkm)
        .where(eq(umkm.id, input.id));
      return rows[0] || null;
    }),

  create: adminQuery
    .input(
      z.object({
        namaProduk: z.string(),
        namaUsaha: z.string().optional(),
        deskripsi: z.string().optional(),
        fotoUrl: z.string().optional(),
        link: z.string().optional(),
        kategori: z
          .enum([
            "makanan",
            "minuman",
            "kerajinan",
            "fashion",
            "pertanian",
            "jasa",
            "lainnya",
          ])
          .optional(),
        pemilik: z.string().optional(),
        kontak: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db().insert(umkm).values(input);
      return { id: Number((result as any)[0]?.insertId ?? 0), ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        namaProduk: z.string().optional(),
        namaUsaha: z.string().optional(),
        deskripsi: z.string().optional(),
        fotoUrl: z.string().optional(),
        link: z.string().optional(),
        kategori: z
          .enum([
            "makanan",
            "minuman",
            "kerajinan",
            "fashion",
            "pertanian",
            "jasa",
            "lainnya",
          ])
          .optional(),
        pemilik: z.string().optional(),
        kontak: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db().update(umkm).set(data).where(eq(umkm.id, id));
      return { id, ...data };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db().delete(umkm).where(eq(umkm.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// Pengaduan Router
// ============================================================
const pengaduanRouter = createRouter({
  list: adminQuery.query(async () => {
    return db().select().from(pengaduan).orderBy(desc(pengaduan.createdAt));
  }),

  listPublic: publicQuery.query(async () => {
    return db()
      .select({
        id: pengaduan.id,
        nama: pengaduan.nama,
        pesan: pengaduan.pesan,
        status: pengaduan.status,
        respon: pengaduan.respon,
        createdAt: pengaduan.createdAt,
      })
      .from(pengaduan)
      .orderBy(desc(pengaduan.createdAt));
  }),

  getById: adminQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(pengaduan)
        .where(eq(pengaduan.id, input.id));
      return rows[0] || null;
    }),

  create: publicQuery
    .input(
      z.object({
        nama: z.string().min(1),
        kontak: z.string().min(1),
        email: z.string().email().optional(),
        pesan: z.string().min(1),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db().insert(pengaduan).values(input);
      return { id: Number((result as any)[0]?.insertId ?? 0), ...input };
    }),

  updateStatus: adminQuery
    .input(
      z.object({
        id: z.number(),
        status: z.enum(["baru", "diproses", "selesai", "ditolak"]),
        respon: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db().update(pengaduan).set(data).where(eq(pengaduan.id, id));
      return { id, ...data };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db().delete(pengaduan).where(eq(pengaduan.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// APBDes Router
// ============================================================
const apbdesRouter = createRouter({
  list: publicQuery.query(async () => {
    return db().select().from(apbdes).orderBy(desc(apbdes.tahun));
  }),

  getById: publicQuery
    .input(z.object({ id: z.number() }))
    .query(async ({ input }) => {
      const rows = await db()
        .select()
        .from(apbdes)
        .where(eq(apbdes.id, input.id));
      return rows[0] || null;
    }),

  getLatest: publicQuery.query(async () => {
    const rows = await db()
      .select()
      .from(apbdes)
      .orderBy(desc(apbdes.tahun))
      .limit(1);
    return rows[0] || null;
  }),

  create: adminQuery
    .input(
      z.object({
        tahun: z.number(),
        pendapatanTotal: z.string().optional(),
        belanjaTotal: z.string().optional(),
        pembiayaanTotal: z.string().optional(),
        rincianPendapatan: z.any().optional(),
        rincianBelanja: z.any().optional(),
        dokumenUrl: z.string().optional(),
        gambarInfografis: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const result = await db().insert(apbdes).values(input);
      return { id: Number((result as any)[0]?.insertId ?? 0), ...input };
    }),

  update: adminQuery
    .input(
      z.object({
        id: z.number(),
        tahun: z.number().optional(),
        pendapatanTotal: z.string().optional(),
        belanjaTotal: z.string().optional(),
        pembiayaanTotal: z.string().optional(),
        rincianPendapatan: z.any().optional(),
        rincianBelanja: z.any().optional(),
        dokumenUrl: z.string().optional(),
        gambarInfografis: z.string().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      await db().update(apbdes).set(data).where(eq(apbdes.id, id));
      return { id, ...data };
    }),

  delete: adminQuery
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      await db().delete(apbdes).where(eq(apbdes.id, input.id));
      return { success: true };
    }),
});

// ============================================================
// Dashboard Router (for admin statistics)
// ============================================================
const dashboardRouter = createRouter({
  stats: adminQuery.query(async () => {
    const db_instance = db();

    const [beritaCount] = await db_instance
      .select({ count: sql<number>`count(*)` })
      .from(berita);
    const [pengaduanCount] = await db_instance
      .select({ count: sql<number>`count(*)` })
      .from(pengaduan);
    const [umkmCount] = await db_instance
      .select({ count: sql<number>`count(*)` })
      .from(umkm);
    const [galeriCount] = await db_instance
      .select({ count: sql<number>`count(*)` })
      .from(galeri);
    const [lembagaCount] = await db_instance
      .select({ count: sql<number>`count(*)` })
      .from(lembaga);
    const [pengaduanBaru] = await db_instance
      .select({ count: sql<number>`count(*)` })
      .from(pengaduan)
      .where(eq(pengaduan.status, "baru"));

    return {
      totalBerita: beritaCount.count,
      totalPengaduan: pengaduanCount.count,
      totalUmkm: umkmCount.count,
      totalGaleri: galeriCount.count,
      totalLembaga: lembagaCount.count,
      pengaduanBaru: pengaduanBaru.count,
    };
  }),
});

// ============================================================
// Main Router Export
// ============================================================
export const desaRouter = createRouter({
  profil: profilRouter,
  statistik: statistikRouter,
  berita: beritaRouter,
  panduan: panduanRouter,
  dokumen: dokumenRouter,
  lembaga: lembagaRouter,
  galeri: galeriRouter,
  komoditas: komoditasRouter,
  umkm: umkmRouter,
  pengaduan: pengaduanRouter,
  apbdes: apbdesRouter,
  dashboard: dashboardRouter,
});
