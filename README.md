# Card Smart Tracker

Frontend Card Smart Tracker untuk melihat kartu kredit dan mengelola pencatatan subscription melalui backend Spring Boot.

## Fitur

- Dashboard dengan navigasi ke modul kartu kredit.
- Login backend JWT di `/login`, reset password UI prototype di `/forgot-password`, dan pendaftaran UI prototype di `/sign-up`.
- Daftar dan detail kartu kredit dari API, dengan nomor kartu yang dimasking.
- Daftar subscription aktif maupun riwayat nonaktif per kartu dari API.
- Subscribe ulang dan unsubscribe melalui endpoint backend, dengan dialog konfirmasi untuk unsubscribe.
- Tambah pencatatan subscription bulanan pada kartu melalui endpoint backend.
- Ringkasan jumlah dan biaya subscription diperbarui setelah perubahan berhasil.
- Toast setelah subscribe/unsubscribe.
- Informasi bahwa tambah kartu belum tersedia karena backend belum menyediakan endpoint tersebut.
- Rute kartu tidak ditemukan dan halaman 404.
- Layout responsif untuk mobile, tablet, dan desktop.
- Toggle tema gelap/terang yang berlaku di seluruh halaman selama aplikasi terbuka.

## Teknologi

- React 19
- TypeScript
- Vite
- React Router
- CSS biasa (tanpa framework styling tambahan)

## Persyaratan

- Node.js 20.19+ atau 22.12+
- npm

## Menjalankan secara lokal

Pasang dependensi:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Buka URL yang ditampilkan Vite di terminal (biasanya `http://localhost:5173`). Vite dikonfigurasi untuk menerima koneksi dari perangkat lain di jaringan lokal; gunakan IP laptop dan port `5173`, misalnya `http://192.168.1.10:5173`. Pastikan perangkat berada di jaringan yang sama dan firewall laptop mengizinkan koneksi tersebut. Jangan gunakan konfigurasi ini untuk mengekspos development server ke internet publik.

## Konfigurasi backend

Salin `.env.example` ke `.env.local` jika konfigurasi lokal berbeda:

```env
VITE_API_BASE_URL=/api
VITE_API_PROXY_TARGET=http://localhost:18081
```

Development server Vite mem-proxy request `/api` ke backend pada `VITE_API_PROXY_TARGET`, sehingga request browser (termasuk dari perangkat lain di LAN) tetap diteruskan oleh laptop dan tidak memerlukan CORS browser. Pastikan backend dan MySQL berjalan. Setelah mengubah file env, restart Vite.

Frontend memanggil `POST /api/auth/login`. JWT dan profil pengguna disimpan dalam `sessionStorage` selama tab browser aktif; token dihapus saat logout atau saat kedaluwarsa. Kredensial tidak disimpan. Route Dashboard dan kartu memerlukan sesi login. API kartu dan subscription memakai JWT dari sesi tersebut.

Jika ingin membuka frontend dari perangkat lain di jaringan yang sama, buka `http://<IP-laptop>:5173` dan pastikan firewall mengizinkan koneksi. Vite proxy tetap meneruskan API ke backend di laptop. Jangan mengekspos development server ke internet publik.

## Build production

Jalankan pemeriksaan TypeScript dan buat build:

```bash
npm run build
```

Untuk melihat hasil build secara lokal:

```bash
npm run preview
```

## Rute aplikasi

| Rute | Halaman |
|---|---|
| `/login` | Login backend |
| `/forgot-password` | Reset password prototype (tanpa pengiriman email) |
| `/sign-up` | Pendaftaran prototype (tanpa pembuatan akun) |
| `/` | Dashboard |
| `/credit-cards` | Daftar kartu kredit |
| `/credit-cards/:cardId` | Detail kartu dan pengelolaan layanan |
| Rute lain | Halaman 404 |

## Integrasi kartu dan subscription

Endpoint terintegrasi:

- `GET /api/cards` — daftar kartu nasabah.
- `GET /api/cards/{cardId}` — detail kartu.
- `GET /api/cards/{cardId}/subscriptions` — subscription aktif dan nonaktif.
- `POST /api/cards/{cardId}/subscriptions` — tambah pencatatan subscription baru (form saat ini membuat siklus bulanan).
- `POST /api/subscriptions/{id}/subscribe` — aktifkan kembali subscription nonaktif.
- `POST /api/subscriptions/{id}/unsubscribe` — nonaktifkan subscription aktif.

Status tampilan dan jumlah/biaya ringkasan mengikuti respons backend; data tidak disimpan sebagai mock lokal frontend.

## Batasan prototipe

- Login terhubung ke backend JWT. Endpoint reset password dan pendaftaran belum terhubung; keduanya hanya simulasi UI tanpa mengirim email atau membuat akun.
- Backend belum menyediakan endpoint untuk menambahkan kartu. Tombol tambah kartu menjelaskan batasan tersebut dan tidak membuat data palsu.
- Subscribe/unsubscribe mengubah status pencatatan pada backend; aksi ini tidak membatalkan atau membuat tagihan secara langsung di penyedia layanan.
- Saldo akun/dashboard selain informasi kartu masih memakai nilai UI prototipe karena belum ada endpoint ringkasan akun.
- Preferensi tema juga hanya berada di memori; setelah reload, tema gelap menjadi default kembali.
- Fitur layanan selain kartu kredit hanya ditampilkan sebagai “Coming soon”.

## Struktur kode

```text
src/
  App.tsx
  api/
    auth.ts
    cards.ts
    client.ts
    sessionStorage.ts
  components/
    AddSubscriptionDialog.tsx
    AuthBrand.tsx
    CardSummary.tsx
    ConfirmDialog.tsx
    CreditCardListItem.tsx
    CreditCardVisual.tsx
    Dialog.tsx
    Icon.tsx
    PageHeader.tsx
    ServiceTile.tsx
    SimpleDialog.tsx
    SubscriptionItem.tsx
    SubscriptionList.tsx
    ThemeToggle.tsx
    Toast.tsx
  main.tsx
  pages/
    CardDetailPage.tsx
    CreditCardsPage.tsx
    DashboardPage.tsx
    ForgotPasswordPage.tsx
    LoginPage.tsx
    NotFoundPage.tsx
    SignUpPage.tsx
  state/
    AuthProvider.tsx
    SubscriptionProvider.tsx
    ThemeProvider.tsx
  styles.css
  types.ts
  utils.ts
```
