# Card Smart Tracker

Prototipe UI frontend untuk melihat kartu kredit dan mengelola status subscription layanan secara langsung. Seluruh data bersifat mock dan perubahan subscription hanya tersimpan di memori aplikasi selama aplikasi berjalan.

## Fitur

- Dashboard dengan navigasi ke modul kartu kredit.
- Login backend JWT di `/login`, reset password UI prototype di `/forgot-password`, dan pendaftaran UI prototype di `/sign-up`.
- Daftar kartu kredit mock beserta jaringan, nomor yang dimasking, saldo, limit, dan ringkasan subscription.
- Halaman detail kartu dengan informasi limit, saldo, jatuh tempo, serta daftar layanan.
- Subscribe langsung dan unsubscribe melalui dialog konfirmasi.
- Ringkasan biaya dan jumlah subscription diperbarui otomatis.
- Toast setelah subscribe/unsubscribe.
- Modal mock untuk tombol tambah kartu.
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

Development server Vite mem-proxy request `/api` ke backend pada `VITE_API_PROXY_TARGET`, sehingga request login tidak memerlukan CORS browser. Pastikan backend dan MySQL berjalan. Setelah mengubah file env, restart Vite.

Login memakai `POST /api/auth/login`. JWT dan profil pengguna disimpan dalam `sessionStorage` selama tab browser aktif; token dihapus saat logout atau saat kedaluwarsa. Kredensial tidak disimpan. Route Dashboard dan kartu memerlukan sesi login. **Data kartu dan subscription masih mock frontend**; integrasi endpoint kartu merupakan tahap terpisah.

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

## Data mock dan state

Data kartu serta layanan berada di [`src/data.ts`](./src/data.ts). Status subscription awal dan aksi state berada di [`src/state/SubscriptionProvider.tsx`](./src/state/SubscriptionProvider.tsx).

State subscription dihitung per kombinasi ID kartu dan ID layanan. Jumlah subscription aktif serta biaya bulanannya merupakan nilai turunan, bukan state terpisah. Aksi subscribe/unsubscribe idempoten dan tidak mengubah saldo, limit, atau data kartu lainnya.

### Data awal

- **Visa Platinum:** 2 layanan aktif, Rp 241.000/bulan.
- **Mastercard Gold:** 3 layanan aktif, Rp 335.000/bulan.
- **Visa Signature:** belum memiliki layanan aktif.

## Batasan prototipe

- Login terhubung ke backend JWT. Endpoint reset password dan pendaftaran belum terhubung; keduanya hanya simulasi UI tanpa mengirim email atau membuat akun.
- Daftar kartu dan subscription masih memakai data mock frontend; belum membaca atau mengubah data kartu melalui API.
- Tidak ada data kartu sungguhan; nomor kartu hanya ditampilkan dalam bentuk masked.
- Perubahan subscription hanya ada di memori browser dan kembali ke data awal setelah halaman dimuat ulang.
- Preferensi tema juga hanya berada di memori; setelah reload, tema gelap menjadi default kembali.
- Tombol tambah kartu hanya menampilkan pemberitahuan; tidak menambahkan kartu.
- Fitur layanan selain kartu kredit hanya ditampilkan sebagai “Coming soon”.

## Struktur kode

```text
src/
  App.tsx
  api/
    auth.ts
    sessionStorage.ts
  components/
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
  data.ts
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
