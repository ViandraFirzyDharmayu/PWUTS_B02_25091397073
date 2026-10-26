# PinjamAlat – Konsol Admin Sistem (UTS Pemrograman Web)
Folder: `PWUTS_B02_25091397073` · Mahasiswa: Viandra Firzy Dharmayu (25091397073) · Kelompok 2, kelas 2025B.
Topik mengacu pada SRS kelompok "Sistem Peminjaman Alat Pendukung Praktikum dan Mata Kuliah". Bagian saya: **Admin Sistem** (FR-18, FR-23, FR-25).

## Menjalankan
```
python server.py     # buka http://127.0.0.1:8000
```
Ajax (`$.load`) dan POST butuh server HTTP, jadi jangan buka `index.html` dengan klik ganda. Akun baru tersimpan di `data/akun.json`.

## Pemetaan tugas
| Item | File | Isi |
|---|---|---|
| 2.a | `index.html`, `css/style.css`, `js/app.js`, `img/hero.svg` | Layout sidebar responsif, ringkasan, menu Ajax |
| 2.b | `pages/log.html` | Log aktivitas (cari, filter modul, ekspor CSV) + simulasi akun terkunci setelah 5x gagal login |
| tambahan | `pages/backup.html` | Backup manual, jadwal otomatis, restore, dan log backup (FR-24) |
| 2.c | `pages/akun.html`, `server.py` | Form tambah akun, validasi jQuery sebelum POST ke `/api/akun` |

## Penjelasan teknis
- **Responsive**: flex/grid; di bawah 760px sidebar menjadi menu geser lewat tombol Menu.
- **Ajax**: link `data-page` memanggil `$('#isi').load('pages/xxx.html')` tanpa reload; hash URL didukung.
- **Validasi 2.c**: peran wajib; nama huruf saja; NIM mahasiswa 11 digit atau ID Admin Lab 4–20 huruf kecil/angka; username unik; kelas A/B/C/D/I (khusus mahasiswa); no. HP 08xx; password ≥8 karakter dengan huruf besar, kecil, angka beserta indikator kekuatan; konfirmasi password sama. Field mengikuti tabel PENGGUNA di ERD.
- **Server**: `server.py` memeriksa ulang data dan menyimpan password dengan hash SHA-256 + salt (bcrypt di SRS butuh library tambahan).
- **Tanpa Bootstrap**: seluruh CSS ditulis sendiri. jQuery dari CDN.
- **Batasan**: data log pada 2.b berupa contoh di JavaScript, belum dari database.
