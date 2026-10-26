WEB PEMINJAMAN ALAT

UTS Pemrograman Web – Gasal 2026/2027
Dosen: Bapak Ari Kurniawan, S.Kom, M.T.

| | |
|---|---|
| Nama | Viandra Firzy Dharmayu |
| NIM | 25091397073 |
| Kelas | D4 Manajemen Informatika 2025B |
| Folder repository | `PWUTS_B02_25091397073` |

Topik:
Website mengacu pada SRS kelompok **"Sistem Peminjaman Alat Pendukung Praktikum dan Mata Kuliah"** Prodi Manajemen Informatika. Sesuai ketentuan UTS yang bersifat mandiri, bagian yang saya kerjakan adalah peran **Admin Sistem**: pengelolaan akun, keamanan, backup/restore, dan log aktivitas (kebutuhan FR-18, FR-23, FR-24, FR-25 di SRS).

Pembagian di kelompok agar tidak sama:

| Anggota | Peran yang dikerjakan |
|---|---|
| Viandra Firzy Dharmayu | Admin Sistem |
| Prahma Agis Shevina | Mahasiswa |
| Muhammad Richard Esa | Admin Lab |

Layout dasar mengikuti wireframe SRS (header, navigasi, area konten), sedangkan tampilan visual, konten, dan fungsinya saya buat sendiri.

Cara menjalankan

# Ajax dan pengiriman form membutuhkan server HTTP, sehingga `index.html` tidak bisa dibuka dengan klik ganda.

```
cd PWUTS_B02_25091397073
python server.py
```
Lalu buka **http://127.0.0.1:8000** di Chrome atau Edge (Ctrl+F5 jika tampilan belum berubah).
Data akun baru dari form tersimpan di `data/akun.json` (dibuat otomatis).

## Pemetaan ke tugas UTS

| Item | File | Keterangan |
|---|---|---|
| 2.a Homepage | `index.html`, `css/style.css`, `js/app.js`, `img/` | Layout utama responsif dengan sidebar. Menu memuat halaman lain lewat Ajax. |
| 2.b Halaman konten interaktif | `pages/log.html` | Log aktivitas dan simulasi keamanan. |
| 2.c Halaman form + validasi | `pages/akun.html`, `server.py` | Form tambah akun, divalidasi jQuery sebelum dikirim ke server. |
| Halaman tambahan | `pages/backup.html` | Backup dan restore database (simulasi). |
| 2.e Catatan | `README.md` | Dokumen ini. |

## Penjelasan fitur

### 2.a Homepage (responsive + Ajax)
- Sidebar kiri berisi menu Ringkasan, Log & Keamanan, Tambah Akun, dan Backup & Restore.
- Halaman utama menampilkan ringkasan statistik (jumlah akun, entri log, kejadian keamanan, backup terakhir) yang dihitung dari data, serta penjelasan tanggung jawab Admin Sistem.
- Responsive: layout memakai flexbox dan CSS grid. Pada lebar layar di bawah 760px sidebar tersembunyi dan dibuka lewat tombol **Menu**.
- Ajax: link bertanda `data-page` memanggil `$('#isi').load('pages/xxx.html')` tanpa memuat ulang halaman. Alamat `#log`, `#akun`, dan `#backup` juga bisa dibuka langsung.
- Gambar: ilustrasi admin pada halaman utama (`img/`).

### 2.b Log aktivitas dan simulasi keamanan (`pages/log.html`)
- Tabel log menampilkan waktu, pengguna, modul, aksi, dan IP.
- Pencarian langsung (live search) berdasarkan pengguna atau aksi, ditambah filter per modul.
- Tombol **Ekspor CSV** mengunduh log yang ada (FR-25).
- **Simulasi login gagal**: setiap klik menambah satu percobaan gagal ke log; pada percobaan ke-5 akun otomatis terkunci dan tombol dinonaktifkan (NFR-03). Tombol **Buka kunci** mengembalikan keadaan dan juga tercatat di log.

### 2.c Form tambah akun (`pages/akun.html`)
Field mengikuti tabel PENGGUNA pada ERD: peran, nama, username, kelas, angkatan, no. HP, dan password.

Validasi jQuery (dijalankan saat meninggalkan kolom dan saat submit):
- Peran wajib dipilih.
- Nama minimal 3 karakter dan hanya huruf.
- Username Mahasiswa harus 11 digit angka (NIM); ID Admin Lab 4–20 karakter huruf kecil/angka; username tidak boleh duplikat.
- Kelas wajib (A/B/C/D/I) khusus Mahasiswa dan disembunyikan untuk Admin Lab.
- Angkatan 2020–2030.
- No. HP berformat `08xxxxxxxxxx` (10–13 digit).
- Password minimal 8 karakter dengan huruf besar, huruf kecil, dan angka, dilengkapi indikator kekuatan password.
- Ulangi password harus sama.

Jika valid, data dikirim lewat `$.ajax` (POST JSON) ke `/api/akun`. `server.py` memeriksa ulang data, menolak username ganda, menyimpan password dalam bentuk hash SHA-256 + salt, lalu menyimpannya ke `data/akun.json`. Pesan sukses atau gagal tampil di halaman, dan penambahan akun tercatat di log.

### Backup dan restore (`pages/backup.html`)
- **Backup sekarang** menambah file backup ke riwayat (FR-24).
- Pilihan jadwal backup otomatis: mingguan, harian, atau nonaktif.
- Tombol **Restore** pada tiap file, dengan konfirmasi sebelum dijalankan.
- Semua aksi tercatat di tabel log backup pada halaman ini dan di halaman Log & Keamanan.

## Struktur folder
```
PWUTS_B02_25091397073/
├── index.html        # layout utama (2.a)
├── server.py         # server HTTP + endpoint POST /api/akun
├── README.md
├── css/style.css     # seluruh gaya, ditulis sendiri
├── js/app.js         # navigasi Ajax, log, backup, validasi form
├── img/              # gambar halaman utama
└── pages/
    ├── log.html      # 2.b
    ├── akun.html     # 2.c
    └── backup.html   # halaman tambahan
```

## Teknologi
HTML5, CSS3 (tanpa framework, **tanpa Bootstrap**), JavaScript, jQuery 3.7.1 (CDN), Python 3 (`http.server`) untuk server. Font IBM Plex Sans dari Google Fonts.


## Sumber gambar
https://pin.it/2t5HYSB9a
