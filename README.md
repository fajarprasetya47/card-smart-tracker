# Card Smart Tracker

Prototipe UI frontend untuk melihat kartu kredit dan mengelola status subscription layanan secara langsung. Seluruh data bersifat mock dan perubahan subscription hanya tersimpan di memori aplikasi selama aplikasi berjalan.

## Fitur

- Dashboard dengan navigasi ke modul kartu kredit.
- Halaman login UI-only di `/login`, reset password di `/forgot-password`, dan pendaftaran di `/sign-up`.
- Daftar kartu kredit mock beserta jaringan, nomor yang dimasking, saldo, limit, dan ringkasan subscription.
- Halaman detail kartu dengan informasi limit, saldo, jatuh tempo, serta daftar layanan.
- Subscribe langsung dan unsubscribe melalui dialog konfirmasi.
- Ringkasan biaya dan jumlah subscription diperbarui otomatis.
- Toast setelah subscribe/unsubscribe.
- Modal mock untuk tombol tambah kartu.
- Rute kartu tidak ditemukan dan halaman 404.
- Layout responsif untuk mobile, tablet, dan desktop.

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

Buka URL yang ditampilkan Vite di terminal (biasanya `http://localhost:5173`).

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
| `/login` | Login prototype (tanpa autentikasi sungguhan) |
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

- Tidak ada backend, API, database, autentikasi sungguhan, atau integrasi eksternal.
- Form login hanya memvalidasi input wajib/email melalui browser, lalu menuju Dashboard; kredensial tidak dikirim atau disimpan. Reset password dan sign up hanya simulasi UI serta tidak mengirim email atau membuat akun.
- Tidak ada data kartu sungguhan; nomor kartu hanya ditampilkan dalam bentuk masked.
- Perubahan subscription hanya ada di memori browser dan kembali ke data awal setelah halaman dimuat ulang.
- Tombol tambah kartu hanya menampilkan pemberitahuan; tidak menambahkan kartu.
- Fitur layanan selain kartu kredit hanya ditampilkan sebagai “Coming soon”.

## Struktur kode

```text
src/
  App.tsx
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
  state/SubscriptionProvider.tsx
  styles.css
  types.ts
  utils.ts
```
