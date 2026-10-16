# Card Smart Track — UI Plan (Tahap 1) — Revisi

> **Catatan revisi:** Inti fitur tidak berubah (Dashboard → daftar kartu → detail kartu → subscribe/unsubscribe on the fly). Revisi ini hanya melengkapi penjelasan yang sebelumnya ambigu.
> Bagian bertanda **[ASUMSI]** adalah keputusan default yang masuk akal. Ubah langsung jika tidak sesuai kebutuhan.

> **BATASAN TAHAP 1: HANYA UI.**
> Yang dibangun hanya tampilan dan interaksi frontend. Semua data berasal dari file mock lokal, dan perubahan subscribe/unsubscribe hanya hidup di state frontend (memori browser). **Tidak ada** backend, API call (`fetch`/`axios`), database, autentikasi, `localStorage`, maupun integrasi eksternal. Jika ada keraguan apakah sesuatu perlu dibuat, jawabannya: tidak, cukup tampilannya saja.

---

## 0. Konteks Project (WAJIB DIISI SEBELUM IMPLEMENTASI)

| Item | Nilai |
|---|---|
| Framework | React latest |
| Build tool | **[ISI: Vite]** |
| Routing | **[ISI: React Router]** |
| Bahasa | **[ISI: TypeScript]** |
| Styling | CSS biasa (tanpa dependensi styling) |
| Referensi visual Dashboard | `screenshot/image-2.png` |
| Referensi visual halaman kartu | `screenshot/image-1.png`, `screenshot/image-3.png`, dan `screenshot/image-4.png` |

**Aturan:**
- Jangan mengganti stack dan jangan menambah dependensi baru kecuali benar-benar perlu (jelaskan alasannya di PR/catatan).
- Struktur folder pada bagian 6 hanyalah rekomendasi. Sesuaikan dengan konvensi project yang sudah ada.
- Elemen Dashboard yang **harus dipertahankan persis**: layout, warna, tipografi, urutan dan ikon kartu layanan. Satu-satunya perubahan: kartu *Credit Card* menjadi dapat diklik.

---

## 1. Fokus

Bangun UI frontend untuk satu alur utama:
**Dashboard → daftar kartu kredit → detail kartu → subscribe/unsubscribe layanan secara langsung (on the fly).**

Tahap ini memakai **data mock dan state frontend**. Tidak ada koneksi ke bank, pembayaran, penyedia subscription, API, atau database.

### Keputusan Umum **[ASUMSI]**

| Topik | Keputusan |
|---|---|
| Target perangkat | Mobile-first (lebar acuan 390px), tetap rapi di desktop (konten dibatasi lebar maksimum dan diletakkan di tengah) |
| Bahasa antarmuka | Bahasa Inggris, sesuai label yang sudah ada (My Credit Cards, Subscribe, dst.). Dokumen ini berbahasa Indonesia |
| Mata uang | IDR, format `Rp 54.000` (locale `id-ID`, tanpa desimal) |
| Format tanggal | `15 Nov 2026` (locale `id-ID`/`en-GB` konsisten di seluruh aplikasi) |
| Persistensi | Tidak ada. Refresh browser mengembalikan state ke data seed awal. **Ini perilaku yang disengaja, bukan bug** |
| Data sensitif | Semua data kartu fiktif. Nomor kartu selalu dimasking (`•••• 1234`); tidak ada nomor kartu lengkap di kode maupun UI |

---

## 2. User Flow Utama

1. Pengguna membuka Dashboard (`/`).
2. Pengguna menekan kartu layanan **Credit Card**.
3. Aplikasi menampilkan **My Credit Cards** (`/credit-cards`).
4. Pengguna mengeklik salah satu kartu.
5. Aplikasi menampilkan **Card Detail** (`/credit-cards/:cardId`) beserta daftar layanan.
6. Pengguna dapat:
   - **Subscribe** layanan yang belum aktif pada kartu tersebut.
   - **Unsubscribe** layanan yang sudah aktif (dengan konfirmasi, lihat bagian 4).
7. UI langsung memperbarui status layanan, jumlah subscription aktif, total biaya bulanan, dan ringkasan kartu tanpa reload halaman.

---

## 3. Halaman dan Komponen

### A. Dashboard — `/`
- Tampilan dipertahankan sesuai referensi visual (bagian 0).
- Kartu **Credit Card** dapat diklik dan membuka `/credit-cards`.
- Kartu layanan lain (Investments, Savings Goal, E-Wallet) **[ASUMSI]**: tampil seperti biasa, tetapi diberi label "Coming soon" dan tidak berpindah halaman saat diklik (tanpa error).

### B. My Credit Cards — `/credit-cards`
- Header: tombol kembali (ke `/`) dan judul "My Credit Cards".
- Tombol **+** **[ASUMSI]**: membuka modal mock berisi pesan "Add card is not available in this prototype" dan tombol Close. Tidak menambah kartu ke state.
- Daftar kartu dengan visual berbeda per jaringan (Visa, Mastercard).
- Setiap item kartu menampilkan:
  - Nama kartu dan jaringan.
  - Nomor kartu yang dimasking.
  - Nama pemegang dan tanggal kedaluwarsa.
  - Jumlah subscription aktif.
  - Total biaya subscription bulanan.
  - Saldo tagihan (`currentBalance`) dan limit (`creditLimit`) **[ASUMSI: wajib ditampilkan, versi ringkas]**.
- Seluruh area kartu dapat diklik dan membuka detail sesuai ID kartu.
- **Empty state:** jika daftar kartu kosong, tampilkan "No cards yet".

### C. Card Detail — `/credit-cards/:cardId`
- Tombol kembali ke `/credit-cards` (rute tetap, bukan `history.back`, agar perilaku konsisten saat halaman dibuka lewat link langsung).
- Visual kartu kredit.
- Ringkasan kartu: available limit, current balance, persentase penggunaan limit, tanggal jatuh tempo.
- Ringkasan subscription: jumlah aktif dan total biaya per bulan.
- Daftar layanan yang dapat dikelola untuk kartu terpilih.
- **Card not found:** jika `cardId` tidak valid, tampilkan pesan "Card not found" dan tombol kembali ke `/credit-cards`.

Setiap item layanan menampilkan:
- Nama dan ikon layanan.
- Kategori.
- Harga per bulan.
- Tanggal tagihan berikutnya (hanya jika berstatus Subscribed).
- Status badge: **Subscribed** atau **Not subscribed**.
- Tombol aksi: **Subscribe** atau **Unsubscribe**.

**Urutan daftar layanan [ASUMSI]:** urutan tetap sesuai data mock (tidak berpindah posisi saat status berubah, agar tidak membingungkan). Tidak ada filter, pencarian, maupun pengelompokan kategori pada tahap ini.

### D. Rute Lain
- `/` → Dashboard.
- Rute tidak dikenal → halaman 404 sederhana dengan tombol "Back to Dashboard".

---

## 4. Perilaku Subscribe / Unsubscribe On the Fly

### Subscribe
1. Pengguna menekan **Subscribe** pada layanan yang belum aktif.
2. Status layanan langsung menjadi **Subscribed** (instan, tanpa loading tiruan).
3. Jumlah subscription aktif bertambah satu.
4. Total biaya bulanan bertambah sebesar `monthlyPrice` layanan.
5. `nextBillingDate` tampil pada item layanan (lihat aturan di bawah).
6. Ringkasan pada Card Detail dan daftar kartu diperbarui langsung.
7. Toast singkat muncul: `"{Service} subscribed on {Card}"` (hilang otomatis ±3 detik).

### Unsubscribe — **[KEPUTUSAN: memakai konfirmasi]**
1. Pengguna menekan **Unsubscribe** → `ConfirmDialog` terbuka.
2. Isi dialog: judul "Unsubscribe {Service}?", teks "This only updates the app (prototype). No real subscription is cancelled.", tombol **Cancel** dan **Unsubscribe**.
3. **Cancel** / klik di luar dialog / tombol Esc → dialog ditutup, tidak ada perubahan.
4. **Unsubscribe** → status menjadi **Not subscribed**, jumlah aktif berkurang satu, total biaya berkurang sebesar `monthlyPrice`, `nextBillingDate` disembunyikan.
5. Ringkasan pada Card Detail dan daftar kartu diperbarui langsung.
6. Toast: `"{Service} unsubscribed from {Card}"`.

### Aturan `nextBillingDate` **[ASUMSI]**
- Data seed: tiap layanan yang berstatus subscribed di awal memiliki tanggal mock tetap.
- Saat user baru subscribe: tanggal diisi **tanggal hari ini + 1 bulan** (dihitung di frontend).
- Saat unsubscribe: tanggal tidak ditampilkan. Jika subscribe lagi, dihitung ulang.

### Aturan State
- Status subscription disimpan dalam state frontend bersama (React Context atau state manager sederhana yang sudah ada di project) agar konsisten di seluruh halaman.
- Gunakan ID unik untuk setiap kartu dan layanan; **jangan** memakai nama tampilan sebagai ID.
- Status dikelola per kombinasi **`cardId + serviceId`**. Subscribe di satu kartu tidak mengubah kartu lain.
- Aksi `subscribe` dan `unsubscribe` harus **idempoten**: sebelum mengubah state, cek status saat ini.
  - Subscribe pada layanan yang sudah aktif → tidak ada perubahan.
  - Unsubscribe pada layanan yang tidak aktif → tidak ada perubahan.
- Klik berulang tidak boleh menyebabkan biaya terhitung dua kali. Implementasi: logika idempoten di reducer/aksi (sebagai jaminan utama) dan tombol tidak dapat ditekan ulang selama dialog konfirmasi terbuka.
- Perpindahan halaman tidak boleh mereset perubahan selama aplikasi berjalan (provider berada di atas router).
- Jumlah aktif dan total biaya **tidak disimpan** sebagai state terpisah. Keduanya **dihitung (derived)** dari relasi subscription agar tidak pernah tidak sinkron.

**Penting:** aksi ini hanya mensimulasikan perubahan status pada UI. Aplikasi tidak membatalkan atau membuat langganan sungguhan di penyedia eksternal.

---

## 5. Data Mock

### 5.1 Tipe Data

```ts
type CardNetwork = 'visa' | 'mastercard';

interface CreditCard {
  id: string;              // contoh: 'card-visa-platinum'
  name: string;            // 'Visa Platinum'
  network: CardNetwork;
  maskedNumber: string;    // '•••• •••• •••• 1234'
  cardholderName: string;  // nama fiktif
  expiry: string;          // 'MM/YY'
  creditLimit: number;     // integer rupiah
  currentBalance: number;  // integer rupiah
  dueDate: string;         // ISO 'YYYY-MM-DD'
}

interface Service {
  id: string;              // 'svc-netflix'
  name: string;
  category: string;
  monthlyPrice: number;    // integer rupiah
  icon: string;            // nama ikon dari library ikon yang sudah ada / path aset lokal
}

type SubscriptionStatus = 'subscribed' | 'not_subscribed';

interface Subscription {
  cardId: string;
  serviceId: string;
  status: SubscriptionStatus;
  nextBillingDate?: string; // ISO; hanya ada saat subscribed
}
```

### 5.2 Rumus Perhitungan

| Nilai | Rumus |
|---|---|
| Jumlah subscription aktif (kartu X) | Jumlah relasi dengan `cardId = X` dan `status = subscribed` |
| Total biaya bulanan (kartu X) | Jumlah `monthlyPrice` dari layanan yang `subscribed` pada kartu X |
| Available limit | `creditLimit − currentBalance` |
| Persentase penggunaan limit | `currentBalance / creditLimit × 100`, ditampilkan **dibulatkan satu desimal** (mis. 42,5%) |

**Subscribe/unsubscribe tidak mengubah `currentBalance`, `availableLimit`, maupun persentase limit pada tahap ini.** Nilai-nilai tersebut adalah data mock statis.

### 5.3 Data Seed **[ASUMSI — contoh, boleh disesuaikan]**

**Kartu**

| id | name | network | maskedNumber | cardholderName | expiry | creditLimit | currentBalance | dueDate |
|---|---|---|---|---|---|---|---|---|
| card-visa-platinum | Visa Platinum | visa | •••• 4821 | Andi Pratama | 08/28 | 30.000.000 | 8.450.000 | 2026-11-05 |
| card-mc-gold | Mastercard Gold | mastercard | •••• 7390 | Andi Pratama | 03/27 | 20.000.000 | 12.300.000 | 2026-11-12 |
| card-visa-signature | Visa Signature | visa | •••• 1156 | Andi Pratama | 11/29 | 50.000.000 | 0 | 2026-11-20 |

**Layanan** (tersedia untuk **semua kartu**)

| id | name | category | monthlyPrice |
|---|---|---|---|
| svc-netflix | Netflix | Entertainment | 186.000 |
| svc-spotify | Spotify | Music | 55.000 |
| svc-youtube | YouTube Premium | Entertainment | 71.000 |
| svc-icloud | iCloud+ | Cloud Storage | 14.000 |
| svc-chatgpt | AI Assistant Plus | Productivity | 320.000 |
| svc-gym | Fitness Club | Health | 250.000 |

**Status awal subscription**

| Kartu | Subscribed di awal | Jumlah aktif | Total biaya/bulan |
|---|---|---|---|
| card-visa-platinum | Netflix, Spotify | 2 | Rp 241.000 |
| card-mc-gold | YouTube Premium, iCloud+, Fitness Club | 3 | Rp 335.000 |
| card-visa-signature | (tidak ada) | 0 | Rp 0 |

Kartu ketiga sengaja kosong untuk memperlihatkan empty state ("No active subscriptions") dan menguji subscribe dari nol.

Layanan lainnya pada tiap kartu berstatus `not_subscribed`. Relasi disimpan untuk setiap kombinasi kartu × layanan (3 × 6 = 18 relasi).

---

## 6. Struktur State

Disimpan sebagai map dengan key gabungan agar pencarian O(1) dan unik:

```ts
// key: `${cardId}:${serviceId}`
type SubscriptionMap = Record<string, { status: SubscriptionStatus; nextBillingDate?: string }>;

interface SubscriptionContextValue {
  subscriptions: SubscriptionMap;
  subscribe: (cardId: string, serviceId: string) => void;   // idempoten
  unsubscribe: (cardId: string, serviceId: string) => void; // idempoten
  getStatus: (cardId: string, serviceId: string) => SubscriptionStatus;
}
```

Selector turunan (dihitung dari `subscriptions`, tidak disimpan):

```ts
useCardSummary(cardId) → {
  activeCount: number;
  monthlyTotal: number;
  availableLimit: number;
  usagePercent: number;
}
```

`SubscriptionProvider` dipasang di atas router agar state bertahan antarhalaman.

---

## 7. Struktur Komponen (Rekomendasi)

```
src/
  pages/
    DashboardPage
    CreditCardsPage
    CreditCardDetailPage
    NotFoundPage
  components/
    CreditCardVisual
    CreditCardListItem
    CreditCardSummary
    SubscriptionList
    SubscriptionItem
    SubscribeButton
    ConfirmDialog
    Toast
  data/
    mockCards
    mockServices
    mockSubscriptions
  state/
    SubscriptionProvider
    useCardSummary
  utils/
    formatCurrency
    formatDate
  types/
    creditCard
    subscription
```

**Peran dan props utama**

| Komponen | Peran | Props utama |
|---|---|---|
| `CreditCardVisual` | Tampilan visual kartu (warna/logo sesuai jaringan) | `card` |
| `CreditCardListItem` | Item di daftar; seluruhnya dapat diklik; memanggil `useCardSummary` | `card` |
| `CreditCardSummary` | Blok ringkasan di Card Detail (limit, saldo, persen, jatuh tempo, jumlah aktif, total biaya) | `card` |
| `SubscriptionList` | Merender daftar layanan untuk satu kartu | `cardId` |
| `SubscriptionItem` | Satu baris layanan: info, badge status, tanggal tagihan | `cardId`, `service` |
| `SubscribeButton` | Tombol aksi; menampilkan Subscribe atau Unsubscribe sesuai status; unsubscribe membuka `ConfirmDialog` | `cardId`, `serviceId` |
| `ConfirmDialog` | Dialog konfirmasi generik | `open`, `title`, `message`, `onConfirm`, `onCancel` |
| `Toast` | Notifikasi singkat setelah aksi | `message` |

Sesuaikan penamaan dan struktur dengan project yang sudah ada.

---

## 8. Non-Fungsional

- **Responsif:** mobile-first, diuji minimal pada lebar 360px, 390px, dan desktop ≥1024px. Tidak ada scroll horizontal.
- **Aksesibilitas dasar:**
  - Kartu yang dapat diklik memakai elemen `<a>`/`<Link>` atau `<button>`, bukan `div` biasa.
  - Fokus keyboard terlihat; Enter/Space mengaktifkan aksi.
  - Tombol aksi memiliki label jelas, misalnya `aria-label="Subscribe Netflix on Visa Platinum"`.
  - `ConfirmDialog` memindahkan fokus ke dalam dialog, dapat ditutup dengan Esc, dan memiliki `role="dialog"` dengan `aria-modal`.
  - Status tidak hanya dibedakan lewat warna (ada teks Subscribed / Not subscribed).
- **Konsistensi format:** semua angka uang dan tanggal melalui satu fungsi util (`formatCurrency`, `formatDate`).
- **Kualitas kode:** tidak ada error/warning di console; tidak ada dependensi baru tanpa alasan.

---

## 9. Acceptance Criteria

**Navigasi**
- [ ] Kartu Credit Card pada Dashboard dapat diklik dan membuka `/credit-cards`.
- [ ] Kartu layanan lain di Dashboard tidak menimbulkan error (tampil "Coming soon").
- [ ] Semua kartu pada daftar dapat diklik dan membuka detail kartu yang benar.
- [ ] Tombol kembali pada Card Detail menuju `/credit-cards`; pada daftar kartu menuju `/`.
- [ ] `cardId` tidak valid menampilkan "Card not found" dengan tombol kembali.
- [ ] URL tidak dikenal menampilkan halaman 404.

**Tampilan data**
- [ ] Daftar kartu menampilkan nama, jaringan, nomor termasking, pemegang, expiry, jumlah aktif, total biaya, saldo dan limit.
- [ ] Card Detail menampilkan available limit, current balance, persentase penggunaan (satu desimal), dan tanggal jatuh tempo.
- [ ] Setiap layanan menampilkan nama, ikon, kategori, harga, status, dan tombol aksi yang sesuai.
- [ ] Tanggal tagihan berikutnya hanya tampil untuk layanan Subscribed.
- [ ] Kartu tanpa subscription aktif menampilkan "0" dan "Rp 0" serta empty state.

**Subscribe / Unsubscribe**
- [ ] Pengguna dapat subscribe layanan yang belum aktif.
- [ ] Pengguna dapat unsubscribe layanan yang aktif melalui dialog konfirmasi.
- [ ] Cancel pada dialog tidak mengubah apa pun.
- [ ] Perubahan terlihat langsung tanpa reload halaman.
- [ ] Jumlah aktif dan total biaya bulanan diperbarui dengan benar.
- [ ] Ringkasan di halaman daftar kartu ikut diperbarui setelah kembali dari detail.
- [ ] Status subscription pada kartu lain tidak berubah.
- [ ] Klik berulang/cepat tidak menyebabkan biaya terhitung dua kali.
- [ ] Subscribe pada layanan aktif dan unsubscribe pada layanan tidak aktif tidak mengubah total (diverifikasi lewat uji logika state).
- [ ] Perpindahan halaman tidak mereset perubahan.
- [ ] Toast tampil setelah subscribe dan unsubscribe.
- [ ] `currentBalance` dan `availableLimit` tidak berubah akibat subscribe/unsubscribe.

**Batasan tahap ini**
- [ ] Semua aksi hanya memakai mock state, tanpa transaksi atau integrasi eksternal.
- [ ] Refresh browser mengembalikan data ke seed awal (sesuai desain).

**Kualitas**
- [ ] Kartu dan tombol dapat dioperasikan dengan keyboard.
- [ ] Tampilan rapi pada 360px, 390px, dan desktop.
- [ ] Tidak ada error di console dan build berhasil.

---

## 10. Strategi Verifikasi

1. **Uji logika state** (unit test, atau skrip uji sederhana jika belum ada test runner; jangan menambah dependensi hanya untuk ini):
   - subscribe menambah aktif +1 dan total + harga;
   - subscribe ganda tidak mengubah apa pun;
   - unsubscribe mengurangi dengan benar;
   - unsubscribe ganda tidak mengubah apa pun;
   - perubahan pada kartu A tidak memengaruhi kartu B.
2. **Checklist demo manual** berdasarkan bagian 9.
3. **Skenario demo acuan** (data seed bagian 5.3):
   Dashboard → Credit Card → Visa Platinum (2 aktif, Rp 241.000) → subscribe YouTube Premium (3 aktif, Rp 312.000) → unsubscribe Netflix dengan konfirmasi (2 aktif, Rp 126.000) → kembali ke daftar kartu: angka Visa Platinum sama dengan detail, Mastercard Gold tetap 3 aktif / Rp 335.000.

---

## 11. Di Luar Scope Tahap 1

- Backend, API, dan database.
- Login dan autentikasi nyata.
- Transaksi finansial.
- Integrasi ke penyedia layanan untuk benar-benar membuat atau membatalkan subscription.
- Penambahan kartu yang benar-benar tersimpan (tombol + hanya modal mock).
- Modul Investments, Savings Goal, dan E-Wallet.
- AI Insight dan integrasi AI.
- Persistensi lintas sesi/refresh.
- Filter, pencarian, dan pengelompokan layanan.
- Perubahan `currentBalance` akibat subscription.

---

## 12. Definition of Done

Tahap ini selesai jika:

1. Alur berikut dapat didemonstrasikan dengan lancar:
   **Dashboard → Credit Card → pilih kartu → Subscribe/Unsubscribe → ringkasan dan biaya ter-update secara langsung.**
2. Seluruh item Acceptance Criteria (bagian 9) terpenuhi.
3. Skenario demo acuan (bagian 10) menghasilkan angka yang tepat.
4. Tidak ada error di console dan build berhasil.
5. Tidak ada perubahan stack atau penambahan dependensi tanpa alasan tercatat.

Fokuskan waktu pengembangan pada alur ini sebelum memperluas cakupan ke modul lain.
