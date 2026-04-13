# 📦 Integrated Supply Chain & POS System (B2B & B2C)


## ✨ Fitur Utama

### 1. Manajemen Kontrak B2B (Business-to-Business)
* **Kesepakatan Objek**: Penentuan jenis barang dan kuantitas pesanan grosir.
* **Harga Khusus**: Penentuan harga kesepakatan yang berbeda dari harga retail.
* **Metode Pembayaran Flexibel**: Mendukung pembayaran tunai (*Cash*) maupun pembayaran tempo (*Term of Payment - TOP*).
* **Kebijakan Retur**: Fitur kesepakatan pengembalian barang yang tidak laku kembali ke supplier.

### 2. Smart Point of Sale (POS) - B2C
* **Katalog Dinamis**: Antarmuka kasir yang menampilkan produk tersedia dari hasil kontrak.
* **Inventory Sync**: Stok berkurang otomatis di sisi reseller setiap kali transaksi retail berhasil.
* **Bukti Transaksi**: Pembuatan struk digital otomatis dengan detail pembayaran.

### 3. Multi-Payment Gateway (Simulasi)
Sistem mendukung tiga metode pembayaran standar industri:
* **Uang Real**: Input nominal tunai dan kalkulasi kembalian otomatis.
* **Kartu Debit/Kredit**: Validasi input nomor kartu sebagai referensi transaksi perbankan.
* **Uang Digital (QRIS)**: Tampilan QR Code dinamis untuk pembayaran melalui aplikasi e-wallet.

---

## 🛠️ Tech Stack

| Komponen | Teknologi |
| :--- | :--- |
| **Backend** | Golang (Gin Gonic Framework) |
| **ORM** | GORM (Object Relational Mapping) |
| **Frontend** | React.js (Vite Build Tool) |
| **Database** | MySQL / MariaDB |
| **Styling** | Vanilla CSS (Enterprise Dashboard Theme) |
| **Security** | Bcrypt (Password Hashing) |

---

## 🔧 Panduan Instalasi & Menjalankan Project

### 1. Prasyarat
Pastikan perangkat Anda telah terpasang:
* Go (v1.20+)
* Node.js (v18+) & npm
* MySQL Server (XAMPP/Docker)

### 2. Setup Database
1. Jalankan layanan MySQL Anda.
2. Buat database baru: `CREATE DATABASE db_supply_pos;`.
3. Impor file `uts.sql` yang tersedia di root folder untuk menginisialisasi skema tabel dan data awal.

### 3. Menjalankan Backend (API)
```bash
# Pindah ke folder backend
cd backend

# Download dependensi (GORM, Gin, MySQL Driver, Bcrypt, CORS)
go mod tidy

# Jalankan aplikasi
go run main.go




