# Buku Kas Saku

Aplikasi pencatat keuangan harian yang bisa dipasang di layar utama HP seperti aplikasi biasa, bisa dipakai tanpa internet, dan menyinkronkan catatan ke Google Drive milikmu.

Pemasangan cukup sekali dan butuh sekitar 20–30 menit. Langkah 1–3 paling nyaman dikerjakan di laptop.

## Isi paket

| File | Fungsi |
|---|---|
| `index.html` | Aplikasinya |
| `config.js` | Tempat mengisi Client ID Google (Langkah 3) |
| `manifest.webmanifest` | Nama, ikon, dan warna aplikasi saat dipasang |
| `sw.js` | Membuat aplikasi tetap bisa dibuka tanpa internet |
| `icons/` | Ikon aplikasi |

---

## Langkah 1 — Unggah ke GitHub Pages (gratis)

1. Buat akun di [github.com](https://github.com) kalau belum punya.
2. Klik **+** di kanan atas, lalu **New repository**.
   - Repository name: `buku-kas-saku`
   - Pilih **Public**. Yang terlihat publik hanya kode aplikasinya; catatan keuanganmu tidak pernah masuk ke GitHub.
   - Klik **Create repository**.
3. Di halaman repository, klik **uploading an existing file** (atau **Add file → Upload files**).
4. Ekstrak zip ini, lalu seret **semua isi folder** `buku-kas-saku` ke halaman upload, termasuk folder `icons`. Jangan seret foldernya sendiri, tapi isinya. Klik **Commit changes**.
5. Buka **Settings → Pages**. Di bagian *Build and deployment*:
   - Source: **Deploy from a branch**
   - Branch: **main**, folder **/ (root)**, lalu **Save**.
6. Tunggu 1–2 menit. Alamat aplikasimu:

   ```
   https://USERNAME.github.io/buku-kas-saku/
   ```

   Ganti `USERNAME` dengan nama pengguna GitHub-mu. Catat alamat ini, karena dipakai di Langkah 2.

Sampai di sini aplikasi sudah bisa dibuka dan dipakai, hanya belum tersinkron ke Google.

## Langkah 2 — Buat Client ID Google

Client ID adalah "kartu identitas" aplikasimu supaya Google mengizinkannya menyimpan data di Drive-mu. Gratis, tidak perlu kartu kredit.

1. Buka [console.cloud.google.com](https://console.cloud.google.com) dan login dengan akun Google yang akan dipakai untuk sinkron.
2. Buat project baru: klik pemilih project di bagian atas → **New Project** → nama `Buku Kas Saku` → **Create**. Pastikan project ini yang terpilih.
3. Nyalakan Google Drive API: menu **APIs & Services → Library** → cari **Google Drive API** → **Enable**.
4. Atur layar izin: buka menu **Google Auth Platform** (di sebagian tampilan bernama **OAuth consent screen**) → **Get started**.
   - App name: `Buku Kas Saku`
   - User support email: email-mu
   - Audience: **External**
   - Contact information: email-mu
   - Setujui ketentuan, lalu **Create**.
5. Daftarkan izin yang dipakai: **Data Access → Add or remove scopes** → cari `drive.appdata` → centang **…/auth/drive.appdata** → **Update** → **Save**.
   Ini satu-satunya izin yang diminta aplikasi: folder data khusus milik aplikasi ini. Aplikasi tidak bisa melihat file Drive-mu yang lain.
6. Buat Client ID: **Clients → Create client**.
   - Application type: **Web application**
   - Name: `Buku Kas Saku`
   - **Authorized JavaScript origins** → Add URI:
     ```
     https://USERNAME.github.io
     ```
     (tanpa garis miring dan tanpa nama repository di belakangnya)
   - **Authorized redirect URIs** → Add URI:
     ```
     https://USERNAME.github.io/buku-kas-saku/
     ```
     (persis alamat aplikasi, **dengan** garis miring di akhir)
   - Klik **Create**. Salin **Client ID** yang muncul, bentuknya seperti `1234567890-abc...apps.googleusercontent.com`.
   - *Client secret* tidak dipakai. Jangan ditaruh di mana pun.
7. Terbitkan aplikasinya: **Audience → Publish app → Confirm**.
   Karena aplikasi hanya meminta izin non-sensitif, biasanya tidak perlu proses verifikasi dari Google.
   Kalau kamu memilih tetap di status **Testing**, tambahkan email-mu di **Audience → Test users**. Konsekuensinya, izin di mode Testing berakhir setiap 7 hari sehingga kamu perlu menghubungkan ulang akun Google seminggu sekali.

Perubahan pengaturan Client kadang baru berlaku setelah 5 menit sampai beberapa jam.

## Langkah 3 — Masukkan Client ID

1. Di GitHub, buka repository `buku-kas-saku` → klik file **config.js** → ikon pensil (**Edit this file**).
2. Tempel Client ID di antara tanda kutip:
   ```js
   window.BKS_CONFIG = {
     googleClientId: "1234567890-abc...apps.googleusercontent.com"
   };
   ```
3. Klik **Commit changes**. Tunggu 1–2 menit.

## Langkah 4 — Pasang di HP

**Android (Chrome)**
1. Buka `https://USERNAME.github.io/buku-kas-saku/` di Chrome.
2. Ketuk menu **⋮ → Instal aplikasi** (atau **Tambahkan ke layar utama**). Bisa juga lewat menu **⋯** di dalam aplikasi → **Pasang di layar utama**.
3. Ikon **Buku Kas** muncul di layar utama dan daftar aplikasi.

**iPhone (Safari)**
1. Buka alamat aplikasi di Safari.
2. Ketuk tombol **Bagikan** → **Tambah ke Layar Utama**.

## Langkah 5 — Hubungkan Google dan mulai sinkron

1. Buka aplikasi, ketuk ikon **↻** di kanan atas (atau menu **⋯ → Hubungkan akun Google**).
2. Pilih akun Google-mu.
3. Kalau muncul layar *"Google hasn't verified this app"*, ketuk **Advanced/Lanjutan → Go to Buku Kas Saku**. Ini aman karena aplikasinya buatanmu sendiri.
4. Izinkan akses, lalu kamu kembali ke aplikasi. Status di bawah judul berubah menjadi **Tersinkron pukul …**.

Ulangi Langkah 4–5 di perangkat lain (HP kedua, laptop) dengan akun Google yang sama. Catatan dari semua perangkat akan tergabung otomatis.

---

## Cara kerja sinkron

- Setiap catatan disimpan dulu di HP, jadi aplikasi tetap bisa dipakai tanpa internet.
- Data dikirim ke **folder tersembunyi khusus aplikasi** di Google Drive-mu. Folder ini tidak muncul di daftar file Drive dan tidak memakan banyak ruang.
- Selama sesi Google aktif (sekitar 1 jam setelah login), sinkron berjalan otomatis setiap kamu mencatat dan setiap aplikasi dibuka kembali. Setelah sesi habis, ketuk **↻**; biasanya hanya berkedip sebentar tanpa perlu login ulang.
- Kalau catatan yang sama diubah di dua perangkat, perubahan yang paling akhir yang dipakai. Penghapusan juga ikut tersinkron.
- Arti status di bawah judul:
  - **Tersinkron pukul …** — semua aman.
  - **Ada perubahan belum tersinkron · ketuk ↻** — ada catatan baru yang belum terkirim ke Drive.
  - **Offline** — akan disinkron saat internet tersambung.
  - **Belum terhubung ke Google** — sinkron belum dinyalakan.

## Memindahkan data dari Buku Kas Saku versi Claude

1. Di versi Claude, ketuk **Ekspor CSV** dan simpan filenya.
2. Di aplikasi ini, buka menu **⋯ → Impor CSV** dan pilih file tadi.

Impor yang sama dua kali tidak membuat catatan dobel.

## Melihat atau menghapus data di Google Drive

Buka [drive.google.com](https://drive.google.com) di laptop → ikon roda gigi → **Setelan → Kelola aplikasi** → **Buku Kas Saku** → **Opsi**. Dari sana kamu bisa menghapus data tersembunyi aplikasi atau memutus aksesnya.

## Kalau ada masalah

| Pesan / gejala | Penyebab dan solusi |
|---|---|
| `redirect_uri_mismatch` | Alamat di **Authorized redirect URIs** tidak persis sama dengan alamat aplikasi. Periksa `https`, huruf besar-kecil, dan garis miring di akhir. Tunggu beberapa menit setelah mengubah. |
| `origin_mismatch` | **Authorized JavaScript origins** belum diisi `https://USERNAME.github.io`. |
| `Error 403: access_denied` | Aplikasi masih di status Testing dan email-mu belum ada di Test users, atau belum di-*Publish*. |
| Jendela login tidak muncul atau langsung tertutup | Di menu **⋯**, ketuk **Jendela login tidak muncul? Login lewat halaman penuh**. |
| Tombol ↻ tidak muncul | `config.js` belum diisi Client ID, atau perubahan belum terunggah. Tutup aplikasi sepenuhnya lalu buka lagi. |
| Versi baru belum terlihat | Tutup aplikasi sepenuhnya (geser dari daftar aplikasi terbaru), lalu buka lagi. |
| Ganti nama repository | Ubah juga **Authorized redirect URIs** di Google Cloud sesuai alamat baru. |

**Penting:** jangan hapus data situs/aplikasi Buku Kas Saku di pengaturan browser sebelum statusnya **Tersinkron**, karena catatan yang belum terkirim ke Drive akan hilang. Untuk cadangan tambahan, sesekali gunakan **⋯ → Ekspor CSV**.
