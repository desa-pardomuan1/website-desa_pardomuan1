# Panduan Implementasi Website Desa Cantik - Step by Step

> Panduan lengkap untuk mengimplementasikan template website desa ini, mulai dari persiapan hingga deployment. Didesain agar dapat diikuti oleh pemula sekalipun.

---

## Daftar Isi

- [Langkah 0: Persiapan Lingkungan](#langkah-0-persiapan-lingkungan)
- [Langkah 1: Clone dan Setup Proyek](#langkah-1-clone-dan-setup-proyek)
- [Langkah 2: Setup Database](#langkah-2-setup-database)
- [Langkah 3: Konfigurasi Environment](#langkah-3-konfigurasi-environment)
- [Langkah 4: Menjalankan di Lokal](#langkah-4-menjalankan-di-lokal)
- [Langkah 5: Mengisi Data Awal](#langkah-5-mengisi-data-awal)
- [Langkah 6: Deployment](#langkah-6-deployment)
- [Langkah 7: Memberikan ke Desa Lain](#langkah-7-memberikan-ke-desa-lain)
- [Langkah 8: Troubleshooting](#langkah-8-troubleshooting)

---

## Langkah 0: Persiapan Lingkungan

### 0.1. Install Node.js (versi 18+)

**Apa itu Node.js?** Node.js adalah platform yang memungkinkan JavaScript dijalankan di server, digunakan untuk menjalankan aplikasi website ini.

**Cara cek apakah sudah terinstall:**

```bash
node -v
```

Jika muncul versi (misal `v20.x.x`), Node.js sudah terinstall. Jika belum:

**Windows:**
1. Buka https://nodejs.org
2. Download versi LTS (Recommended)
3. Jalankan installer, klik Next sampai selesai

**Mac:**
```bash
# Install Homebrew (jika belum)
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install Node.js
brew install node
```

**Linux (Ubuntu/Debian):**
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 0.2. Install Git

**Apa itu Git?** Git adalah sistem kontrol versi untuk mengelola kode sumber.

**Cek apakah sudah terinstall:**
```bash
git -v
```

**Install jika belum:**
- Windows: Download dari https://git-scm.com/download/win
- Mac: `brew install git`
- Linux: `sudo apt-get install git`

### 0.3. Buat Akun GitHub

1. Buka https://github.com
2. Klik "Sign up" dan ikuti instruksi pendaftaran
3. Verifikasi email Anda

---

## Langkah 1: Clone dan Setup Proyek

### 1.1. Fork/Clone Repository

**Jika Anda adalah desa pertama (pemilik template):**

```bash
# Buat folder untuk proyek
mkdir ~/projects
cd ~/projects

# Clone repository
git clone <URL_REPOSITORY_TEMPLATE> desa-website
cd desa-website
```

**Jika Anda adalah desa lain (menggunakan template):**

```bash
# Clone dari repository template
git clone https://github.com/username/template-desa-cantik.git desa-website
cd desa-website

# Atau jika dibuat sebagai GitHub Template:
# 1. Di GitHub, klik "Use this template"
# 2. Isi nama repository untuk desa Anda
# 3. Clone repository baru Anda
git clone https://github.com/username/nama-desa-anda.git desa-website
cd desa-website
```

> **Kenapa dilakukan ini?** Clone mengunduh seluruh kode sumber ke komputer Anda sehingga bisa dimodifikasi.

### 1.2. Install Dependencies

```bash
npm install
```

Perintah ini akan menginstall semua library yang dibutuhkan. Proses ini membutuhkan koneksi internet dan dapat memakan waktu 2-5 menit.

> **Kenapa dilakukan ini?** Dependencies adalah library-library pendukung yang digunakan aplikasi (React, Tailwind, database connector, dll).

---

## Langkah 2: Setup Database

### 2.1. Buat Database MySQL

Anda membutuhkan database MySQL. Pilihan:

**Opsi A: Database Lokal (untuk development)**

Install MySQL di komputer:
- Windows: Download MySQL Installer dari https://dev.mysql.com/downloads/installer/
- Mac: `brew install mysql && brew services start mysql`
- Linux: `sudo apt-get install mysql-server`

Buat database:
```bash
mysql -u root -p
# (masukkan password)
CREATE DATABASE desa_cantik CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'desa_user'@'localhost' IDENTIFIED BY 'password_anda';
GRANT ALL PRIVILEGES ON desa_cantik.* TO 'desa_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Opsi B: Database Cloud (untuk production)**

Rekomendasi layanan database cloud gratis/terjangkau:
- **PlanetScale** (https://planetscale.com) - MySQL-compatible, tier gratis tersedia
- **Aiven** (https://aiven.io) - MySQL gratis tier
- **Railway** (https://railway.app) - Database dengan credit gratis

Untuk PlanetScale:
1. Daftar akun di https://planetscale.com
2. Buat database baru
3. Pilih region terdekat (Singapore untuk Indonesia)
4. Di halaman database, klik "Connect"
5. Pilih "@planetscale/database" sebagai format
6. Copy DATABASE_URL yang diberikan

### 2.2. Push Schema ke Database

Setelah database siap dan DATABASE_URL dikonfigurasi (Langkah 3), jalankan:

```bash
npm run db:push
```

Perintah ini akan membuat semua tabel yang dibutuhkan.

> **Kenapa dilakukan ini?** Schema mendefinisikan struktur tabel (kolom, tipe data) yang akan menyimpan data desa Anda.

---

## Langkah 3: Konfigurasi Environment

### 3.1. Buat File .env

File `.env` menyimpan konfigurasi rahasia yang tidak boleh di-commit ke Git.

```bash
# Copy dari file example (jika tersedia)
cp .env.example .env

# Atau buat file baru
nano .env
```

### 3.2. Isi Konfigurasi

```env
# ==========================================
# DATABASE
# ==========================================
# Format: mysql://username:password@host:port/database
DATABASE_URL=mysql://desa_user:password_anda@localhost:3306/desa_cantik

# Jika menggunakan PlanetScale:
# DATABASE_URL=mysql://xxxxxxxxxxxx:pscale_pw_xxxxxxxxxxxx@xxxxxxxxxxxx.aws.connect.psdb.cloud/desa_cantik?ssl={"rejectUnauthorized":true}

# ==========================================
# AUTH (OAuth 2.0)
# ==========================================
# Kredensial ini akan otomatis terisi oleh sistem deployment
# atau dapat dikonfigurasi melalui portal admin
KIMI_AUTH_URL=https://auth.kimi.com
KIMI_APP_ID=your_app_id
KIMI_APP_SECRET=your_app_secret
SESSION_SECRET=random_string_untuk_session

# ==========================================
# STORAGE (Opsional - untuk upload file)
# ==========================================
# Jika ingin menggunakan S3-compatible storage
S3_ENDPOINT=
S3_BUCKET=
S3_ACCESS_KEY=
S3_SECRET_KEY=
```

> **Kenapa dilakukan ini?** Environment variables menyimpan konfigurasi yang berbeda untuk setiap environment (lokal vs production) dan menyimpan rahasia dengan aman.

---

## Langkah 4: Menjalankan di Lokal

### 4.1. Start Development Server

```bash
npm run dev
```

Anda akan melihat output seperti:
```
  VITE v7.x.x  ready in xxx ms

  ➜  Local:   http://localhost:3000/
  ➜  Network: http://192.168.x.x:3000/
  ➜  API:     http://localhost:3000/api
```

### 4.2. Akses Website

Buka browser dan akses:
- **Website Publik**: http://localhost:3000
- **Admin Panel**: http://localhost:3000/admin

### 4.3. Login sebagai Admin

1. Klik "Admin" di top bar atau akses `/admin`
2. Klik tombol Login
3. Anda akan diarahkan ke halaman autentikasi
4. Setelah login pertama, Anda perlu di-set sebagai admin di database

**Cara set admin pertama:**
```bash
# Akses database Anda
mysql -u desa_user -p desa_cantik
# atau gunakan console database cloud

# Update role user pertama menjadi admin
UPDATE users SET role = 'admin' WHERE id = 1;
EXIT;
```

---

## Langkah 5: Mengisi Data Awal

### 5.1. Jalankan Seeder (Data Contoh)

```bash
npx tsx db/seed.ts
```

Script ini akan mengisi database dengan data contoh:
- Profil desa (nama, visi, misi, sejarah)
- Statistik kependudukan
- Berita dan pengumuman
- Lembaga kemasyarakatan
- Galeri foto
- Komoditas pertanian
- UMKM
- APBDes

> **Kenapa dilakukan ini?** Data contoh membantu Anda melihat bagaimana website akan tampak dan berfungsi sebelum mengganti dengan data asli desa Anda.

### 5.2. Isi Data Profil Desa

1. Login ke admin panel
2. Pilih menu **Profil Desa**
3. Isi semua field:
   - **Umum**: Nama desa, kecamatan, kabupaten, provinsi, visi, misi, sejarah
   - **Kontak**: WhatsApp, telepon, email
   - **Media**: Footer teks BPS, logo BPS URL
   - **Lokasi**: Data geografis (JSON), Google Maps embed URL

### 5.3. Upload Gambar

Untuk gambar, Anda dapat:
1. Upload ke layanan image hosting (Cloudinary, Imgur, AWS S3)
2. Copy URL gambar
3. Paste URL ke field yang sesuai

---

## Langkah 6: Deployment

### 6.1. Push ke GitHub

```bash
# Inisialisasi git (jika belum)
git init
git add .
git commit -m "Initial commit: Website Desa Cantik"

# Push ke GitHub
git branch -M main
git remote add origin https://github.com/username/nama-repository.git
git push -u origin main
```

### 6.2. Deploy ke Platform Cloud

**Opsi A: Vercel (Rekomendasi)**

1. Buka https://vercel.com dan login dengan GitHub
2. Klik "Add New Project"
3. Import repository GitHub Anda
4. Konfigurasi:
   - **Framework Preset**: Vite
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist/public`
5. Klik "Environment Variables" dan tambahkan semua variable dari `.env`
6. Klik "Deploy"

**Opsi B: Railway**

1. Buka https://railway.app
2. New Project -> Deploy from GitHub repo
3. Pilih repository Anda
4. Tambahkan MySQL database dari Railway
5. Tambahkan environment variables
6. Deploy

**Opsi C: Docker**

```dockerfile
# Dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
# Build dan jalankan
docker build -t desa-website .
docker run -p 3000:3000 --env-file .env desa-website
```

### 6.3. Konfigurasi Domain (Opsional)

Setelah deploy berhasil:
1. Di dashboard platform (Vercel/Railway), cari pengaturan domain
2. Tambahkan custom domain (misal: desa-anda.go.id)
3. Ikuti instruksi untuk mengatur DNS

---

## Langkah 7: Memberikan ke Desa Lain

### 7.1. Buat GitHub Template Repository

1. Buka repository di GitHub
2. Klik **Settings**
3. Scroll ke bawah ke "Template repository"
4. Centang "Template repository"
5. Klik Save

### 7.2. Instruksi untuk Desa Lain

Berikan instruksi berikut ke desa lain:

```markdown
# Cara Menggunakan Template untuk Desa Anda

1. **Buat Repository Baru**
   - Buka URL template: https://github.com/username/template-desa-cantik
   - Klik "Use this template"
   - Isi nama repository untuk desa Anda
   - Klik "Create repository"

2. **Clone ke Komputer**
   ```bash
   git clone https://github.com/desa-anda/nama-repository.git
   cd nama-repository
   npm install
   ```

3. **Buat Database Sendiri**
   - Ikuti Langkah 2 di panduan ini
   - Setiap desa HARUS memiliki database terpisah

4. **Konfigurasi Environment**
   - Buat file `.env` dengan DATABASE_URL Anda sendiri

5. **Push Schema dan Seed Data**
   ```bash
   npm run db:push
   npx tsx db/seed.ts
   ```

6. **Deploy**
   - Daftar akun Vercel (gratis)
   - Hubungkan repository GitHub
   - Tambahkan environment variables
   - Deploy!
```

---

## Langkah 8: Troubleshooting

### Error: "Cannot connect to database"

**Penyebab**: DATABASE_URL salah atau database tidak berjalan.

**Solusi**:
```bash
# Cek apakah MySQL berjalan
mysql -u root -p -e "SHOW DATABASES;"

# Verifikasi DATABASE_URL format
# Benar: mysql://user:pass@host:port/db
# Salah: mysql://user:pass@host/db (tanpa port)
```

### Error: "Table doesn't exist"

**Penyebab**: Schema belum di-push ke database.

**Solusi**:
```bash
npm run db:push
```

### Error: "Access denied for user"

**Penyebab**: User database tidak memiliki hak akses.

**Solusi**:
```sql
GRANT ALL PRIVILEGES ON nama_database.* TO 'username'@'host';
FLUSH PRIVILEGES;
```

### Error: "Port 3000 already in use"

**Solusi**:
```bash
# Cari proses yang menggunakan port 3000
lsof -ti:3000
# Kill proses
kill -9 <PID>
# Atau jalankan di port berbeda
PORT=3001 npm run dev
```

### Error: "Type error" saat build

**Solusi**:
```bash
# Cek tipe TypeScript
npm run check
# Perbaiki error yang muncul
```

### Gambar Tidak Muncul

**Penyebab**: URL gambar tidak valid atau CORS.

**Solusi**:
- Gunakan URL gambar publik (bukan lokal)
- Cek apakah URL bisa diakses langsung di browser
- Untuk gambar lokal, taruh di folder `public/` dan referensikan dengan path relatif

### Admin Panel Tidak Bisa Diakses

**Penyebab**: Role user belum di-set sebagai `admin`.

**Solusi**:
```sql
-- Cek user
SELECT id, name, email, role FROM users;
-- Update role
UPDATE users SET role = 'admin' WHERE id = <user_id>;
```

### OAuth Callback Error

**Penyebab**: Konfigurasi callback URL tidak sesuai.

**Solusi**:
- Pastikan callback URL di portal auth sesuai dengan domain deployment
- Format: `https://domain-anda.com/api/oauth/callback`

---

## Catatan Penting

### Keamanan
- **JANGAN PERNAH** commit file `.env` ke GitHub
- Ganti SESSION_SECRET dengan string random yang panjang
- Selalu gunakan HTTPS di production
- Backup database secara berkala

### Performa
- Gambar yang diupload sebaiknya di-compress terlebih dahulu
- Gunakan CDN untuk aset statik (gambar, CSS, JS)
- Optimasi gambar sebelum upload ke database/galeri

### Maintenance
- Update dependencies secara berkala: `npm update`
- Monitor log error di platform deployment
- Backup database sebelum melakukan perubahan besar

---

## Kontak dan Bantuan

Jika mengalami kesulitan:
1. Cek log error di terminal
2. Cek log di dashboard platform deployment
3. Buat issue di GitHub repository

---

*Template ini dikembangkan untuk program Desa Cantik (Desa Cinta Statistik) BPS Kabupaten Samosir.*
