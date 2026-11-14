# 📋 WORKFLOWS: Next.js Fullstack Standard Operating Procedures (SOP)

Alur kerja terstandarisasi untuk pengembangan Next.js Fullstack pada repositori ini:

---

## 1. Workflow UI / Komponen Halaman (Next.js App Router)

```text
[Analisis Kebutuhan & Desain Halaman / Komponen]
                     │
                     ▼
[Muat Skill: design-taste-frontend + responsive-craft]
                     │
                     ▼
[Tentukan Arsitektur: Server Component (Default) vs Client Component ('use client')]
                     │
                     ▼
[Implementasikan Kode Utuh dengan Tailwind / CSS Variables Tanpa AI Slop]
                     │
                     ▼
[Verifikasi: Uji Responsif Mobile (<768px), Cek Hydration, & Dark/Light Mode]
```

---

## 2. Workflow Mutasi Data & API (Server Actions & Route Handlers)

```text
[Definisikan Kontrak Data & Skema Validasi (Zod / TypeBox)]
                     │
                     ▼
[Implementasikan Server Action / Route Handler dengan Try-Catch & Safe Action Return]
                     │
                     ▼
[Lakukan Revalidasi Path / Tag (revalidatePath / revalidateTag)]
                     │
                     ▼
[Hubungkan ke Client Component dengan Form State / useActionState / useTransition]
                     │
                     ▼
[Uji Happy Path & Penanganan Error UI (Error State & Toast)]
```

---

## 3. Workflow Perbaikan Bug & Optimasi Performa

1. **Reproduce & Inspect:** Cek console log browser & server terminal untuk melacak error (termasuk React Hydration Warning).
2. **Eliminate Waterfalls:** Gabungkan request paralel menggunakan `Promise.all` jika beberapa server fetch saling independen.
3. **Bundle & Boundary Check:** Pastikan import berat (library charting, editor, pdf) hanya dimuat secara dinamis (`next/dynamic` dengan `ssr: false` jika perlu).
4. **Pre-Flight Verification:** Jalankan `npm run build` atau `npm run lint` untuk memastikan tidak ada compiler error.
