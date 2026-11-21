# 🗺️ SKILL ROUTER: Matriks Pemetaan Kebutuhan ke Skill

Gunakan tabel matriks di bawah ini untuk menentukan skill mana yang **wajib di-load (`view_file` atau dibaca)** sebelum mulai mengeksekusi kode:

---

## 1. Matriks Routing Otomatis

| Kategori Tugas | Indikator Kata Kunci | Skill yang Wajib Diaktifkan | Lokasi Skill |
| :--- | :--- | :--- | :--- |
| **Frontend UI / Layout** | Buat halaman, layout, hero section, card, komponen visual | `design-taste-frontend`<br>`high-end-visual-design` | `~/.agents/skills/design-taste-frontend/SKILL.md`<br>`~/.agents/skills/high-end-visual-design/SKILL.md` |
| **Mobile & Responsif** | Breakpoint mobile, drawer, responsive view, tablet layout | `responsive-craft` | `~/.agents/skills/responsive-craft/SKILL.md` |
| **Gaya Desain Khusus** | Brutalist, minimalis, editorial, monochrome | `minimalist-ui`<br>atau `industrial-brutalist-ui` | `~/.agents/skills/minimalist-ui/SKILL.md`<br>`~/.agents/skills/industrial-brutalist-ui/SKILL.md` |
| **Generasi Kode Lengkap** | Penulisan endpoint, query DB, state handler, utilitas kompleks | `full-output-enforcement` | `~/.agents/skills/full-output-enforcement/SKILL.md` |
| **Dokumentasi Library Modern** | Next.js 15/16, React 19, Tailwind v4, Drizzle, Elysia, Flutter | `context7-mcp` | `~/.agents/skills/context7-mcp/SKILL.md` |
| **Scraping & Browser Test** | E2E test, screenshot, navigasi web, web scraping | `browser-use` | `~/.agents/skills/browser-use/SKILL.md` |
| **Aset Branding & Logo** | Buat logo, palette warna, brand-identity board | `brandkit`<br>`imagegen-frontend-web` | `~/.agents/skills/brandkit/SKILL.md`<br>`~/.agents/skills/imagegen-frontend-web/SKILL.md` |
| **Image-to-Code** | Menerjemahkan screenshot/mockup desain ke kode | `image-to-code` | `~/.agents/skills/image-to-code/SKILL.md` |
| **Riset & Verifikasi Data** | Pencarian data faktual, verifikasi API atau sumber akademik | `valyu-best-practices` | `~/.agents/skills/valyu-best-practices/SKILL.md` |

---

## 2. Aturan Kombinasi Skill (*Chaining Rules*)

1. **Frontend Development:** Selalu kombinasikan `design-taste-frontend` + `responsive-craft`.
2. **File Kode Signifikan:** Wajib sertakan aturan `full-output-enforcement` agar kode tidak terpotong.
3. **Pustaka Baru:** Gunakan `context7-mcp` untuk memastikan dokumentasi framework tidak out-of-date.
