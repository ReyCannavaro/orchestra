# 📋 WORKFLOWS: Monorepo Standard Operating Procedures (SOP)

Alur kerja terstandarisasi untuk pengembangan monorepo multi-package pada repositori ini:

---

## 1. Workflow Modifikasi Shared Package / Core Library

```text
[Analisis Dampak Perubahan ke Seluruh Aplikasi Konsumen]
                          │
                          ▼
[Perbarui Kontrak / Tipe di packages/shared atau packages/types]
                          │
                          ▼
[Verifikasi Backward Compatibility & Compile Shared Package]
                          │
                          ▼
[Perbarui Aplikasi Pengguna (apps/web, apps/mobile, apps/api)]
                          │
                          ▼
[Jalankan Typecheck & Test pada Seluruh Workspace yang Terdampak]
```

---

## 2. Workflow Penambahan Paket / App Baru

```text
[Inisialisasi Folder di apps/ atau packages/ sesuai Struktur Monorepo]
                          │
                          ▼
[Konfigurasi package.json dengan Scope yang Tepat & Workspace Dependencies]
                          │
                          ▼
[Daftarkan ke Konfigurasi Monorepo (pnpm-workspace.yaml / turbo.json / moon.yml)]
                          │
                          ▼
[Hubungkan ke Core Tooling (Shared ESLint, Prettier, TypeScript Config)]
                          │
                          ▼
[Verifikasi Build Task Pipeline: pnpm run build / turbo run build]
```

---

## 3. Workflow Mitigasi Konflik & Pre-Flight Verification

1. **Check Conflict Matrix:** Jika ada konflik kepentingan antara frontend app vs core service, konsultasikan aturan hierarki pada `.agents/rules/conflict-matrix.md`.
2. **Impact Boundary Test:** Pastikan perubahan tidak memicu break pada aplikasi lain di monorepo (`turbo run test` atau `pnpm -r run test`).
3. **No Phantom Dependencies:** Pastikan setiap dependency yang digunakan benar-benar dideklarasikan di `package.json` package masing-masing, bukan hanya bergantung pada hoisting root.
