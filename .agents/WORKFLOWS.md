# 📋 WORKFLOWS: Standard Operating Procedures (SOP)

Alur kerja terstandarisasi untuk setiap kategori tugas pengembangan pada repositori ini:

---

## 1. Workflow Pengerjaan Frontend Web / Komponen UI

```text
[Analisis Brief & Kebutuhan UI]
         │
         ▼
[Buka Skill: design-taste-frontend & responsive-craft]
         │
         ▼
[Definisikan Design Tokens & Colors (Tanpa Gradient Default Murahan)]
         │
         ▼
[Implementasikan Komponen secara Utuh (Full Output)]
         │
         ▼
[Validasi Responsif: Uji Layar Desktop (>1024px) dan Mobile (<768px)]
```

---

## 2. Workflow Pengerjaan Backend / API / Database

```text
[Rancang Skema Data / Kontrak Interface]
         │
         ▼
[Validasi Input Menggunakan Skema Validasi Ketat (TypeBox / Zod)]
         │
         ▼
[Implementasikan Handler Endpoint dengan Penanganan Error Eksplisit]
         │
         ▼
[Uji Endpoint (Unit Test / Curl / Browser)]
```

---

## 3. Workflow Perbaikan Bug (Debugging Protocol)

1. **Reproduce First:** Pastikan bug dapat direplikasi sebelum menyentuh kode.
2. **Root Cause Analysis:** Cari sumber masalah sebenarnya, jangan hanya menambal gejala di permukaan (*symptomatic patching*).
3. **Targeted Fix:** Terapkan perbaikan sespesifik mungkin untuk meminimalkan efek samping (*blast radius*).
4. **Verification:** Jalankan test suite atau verifikasi manual untuk membuktikan bug telah terselesaikan.
