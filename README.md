# 📦 Supply Chain & POS Terintegrasi (B2B & B2C)

Sistem informasi manajemen rantai pasok terintegrasi yang menghubungkan **Supplier**, **Reseller**, dan **Vendor** dalam satu platform. Proyek ini dikembangkan oleh **Agiel Fernanda** sebagai bagian dari studi di **Informatika ITENAS** dan riset di **SSIP Lab**.

---

## 🚀 Fitur Utama
* **Manajemen Kontrak B2B**: Kesepakatan objek barang, harga grosir, dan jumlah pesanan.
* **Term of Payment (TOP)**: Pengaturan jatuh tempo pembayaran untuk transaksi antar perusahaan.
* **Point of Sale (POS)**: Antarmuka kasir cepat untuk transaksi retail pelanggan.
* **Multi-Payment Gateway**: Simulasi pembayaran menggunakan:
    1. **Uang Real**: Perhitungan tunai dan kembalian.
    2. **Kartu Debit/Kredit**: Input nomor kartu sebagai referensi.
    3. **Uang Digital (QRIS)**: Integrasi QR Code dinamis untuk pembayaran e-wallet.
* **Inventory Sync**: Sinkronisasi stok gudang real-time setiap kali transaksi POS berhasil.

---

## 🛠️ Tech Stack
* **Backend**: Golang (Gin Gonic) & GORM.
* **Frontend**: React.js (Vite) & Axios.
* **Database**: MySQL.
* **Styling**: Vanilla CSS (Enterprise Dashboard Theme).

---

## 🔧 Instalasi & Menjalankan Project

### 1. Persiapan Database
1. Pastikan MySQL sudah aktif (XAMPP/Docker).
2. Buat database: `CREATE DATABASE db_supply_pos;`
3. Import file `uts.sql` ke dalam database tersebut.

### 2. Jalankan Backend (Go)
```bash
cd backend
go mod tidy
go run main.go
