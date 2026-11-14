# 🎻 ORCHESTRA: Project Context & Master Handover Protocol

> **Status:** Initialized & Ready for Next Development Session  
> **Repository:** `C:\Users\Rey Cannavaro\orchestra`  
> **Author & Architect:** Rey Cannavaro  
> **Timestamp:** 14 November 2026  

---

## 📖 1. Genesis & Latar Belakang Proyek

Proyek **`orchestra`** ini lahir dari audit mendalam terhadap seluruh folder `.agents` di laptop Rey Cannavaro (total 21 lokasi proyek). Ditemukan bahwa Rey telah mengembangkan beberapa arsitektur multi-agent yang sangat maju di berbagai proyeknya, namun terdapat tantangan:
1. **Redundansi Besar:** File skills (23+ skill) berukuran ribuan baris diduplikasi manual di berbagai repositori.
2. **Kebutuhan Berbagi (Shareable Kit):** Rey ingin agar setup agent berkualitas tinggi ini bisa dibagikan dengan mudah ke teman-teman dan kolaborator proyeknya.
3. **Kemudahan Instalasi:** Cukup satu perintah (misal `npx orchestra init` atau one-liner script), teman atau repo baru langsung terkonfigurasi dengan standar AI Agent terbaik tanpa perlu setup manual yang rumit.
4. **Universal Interoperability:** Kompatibel dengan berbagai AI Coding Assistant (Antigravity, Cursor, Claude Code, Windsurf, GitHub Copilot).

---

## 🔍 2. Hasil Audit 21 Repositori Sebelumnya

Dari investigasi sebelumnya, ditemukan beberapa proyek acuan utama yang menjadi DNA dari `orchestra`:

1. **`shape-tool/.agents` (Paling Kompleks Secara Protokol & Spesifikasi):**
   - **The Symphony Paradigm (`AGENT.md`):** Membagi AI ke dalam *Grand Conductor*, *Creative Ensemble* (`ARTIST`, `VIOLINIST`, `FLUTIST`, `TROMBONIST`, `PERCUSSIONIST`), dan *Engineering Division* (`FE`, `BE`, `FS`, `ENG`, `QA`, `QC`, `SECURITY`).
   - **The Baton Protocol (`BATON.md`):** Menerapkan $Workspace Mutability = f(Possession(Baton))$, *Single-Writer Invariant*, verifikasi integritas *Merkle Tree SHA-256*, dan katalog error formal `B001`–`B040`.
   - Ukuran: 130 files, 37.408 lines, 15 persona @ 1.000+ baris instruksi.
2. **`urbangrow-workspace/.agents` (Paling Kompleks Secara Multi-Domain & Real System):**
   - Mengintegrasikan 6 spektrum: Hardware IoT ESP32 (FreeRTOS), Backend API (ElysiaJS), Time-Series DB (TimescaleDB), Machine Learning (Python XGBoost/Isolation Forest), Mobile Client (Flutter), Web Analytics (Next.js 16), dan Monorepo (Moonrepo).
   - **Hierarchical Conflict Resolution Matrix:** Aturan bahwa *Keamanan Fisik/Hardware (Level 1) wajib menganulir saran AI jika berbahaya*.
   - **Cross-Domain Verification Matrix:** Checklist E2E dan simulasi bencana (PLN padam, kabel sensor copot, MQTT broker down).
3. **`see-mbg/.agents` & `asterisk/.agents` (Paling Pragmatis & Efisien):**
   - **4-Step Execution Lifecycle:**
     1. *Intent Triage* (Mengenali domain tugas).
     2. *Skill Resolution* (Membaca matriks `SKILL_ROUTER.md`).
     3. *Phased Execution* (Menjalankan SOP `WORKFLOWS.md`).
     4. *Pre-Flight Verification* (Linting, port standard, anti-slop check).

Laporan komprehensif lengkap dapat dibaca di:
👉 [`docs/ANALYSIS_REPORT.md`](docs/ANALYSIS_REPORT.md)

---

## 🎯 3. Visi & Filosofi Nama `orchestra`

Mengapa dinamakan **`orchestra`**?
* Dalam sistem multi-agent otonom, kekacauan terjadi saat agent saling "mengobrol" tanpa aturan (*agent chatter* & *hallucination*).
* Orkestra adalah metafora rekayasa paling ideal:
  * **Conductor:** Dirigen yang mengatur pembagian tugas dan tempo (`ORCHESTRATOR.md`).
  * **Score:** Partitur musik sebagai satu-satunya *ground truth* (`AGENTS.md` / PRD).
  * **Sections:** Para pemain instrumen spesialis (Frontend, Backend, Design, DevOps).
  * **Baton:** Tongkat konduktor sebagai token izin mutasi file (*Baton Protocol*).

---

## 🏗️ 4. Struktur Repositori `orchestra`

```text
orchestra/
├── bin/
│   └── index.js              # CLI executable (npx orchestra init / setup)
├── core-skills/              # 23 Core Skills terpusat (design, code, mcp, dll)
├── templates/                # Template konfigurasi siap inject
│   ├── universal/            # Standard Intent Triage + Skill Router
│   ├── nextjs-fullstack/     # Khusus Next.js / React / Tailwind
│   ├── flutter-mobile/       # Khusus Flutter / Riverpod
│   └── monorepo/             # Khusus Monorepo multi-domain
├── docs/
│   ├── ANALYSIS_REPORT.md    # Audit 21 repositori laptop
│   └── DISTRIBUTION_BLUEPRINT.md # Arsitektur distribusi & installer
├── install.ps1               # Installer Windows
├── install.sh                # Installer macOS/Linux
├── package.json              # NPM package & bin config
├── README.md                 # Dokumentasi publik
└── CONTEXT.md                # File ini (Handover session context)
```

---

## 🚀 5. Panduan untuk AI pada Sesi Baru di Folder Ini

Ketika Anda memulai sesi baru di dalam folder `C:\Users\Rey Cannavaro\orchestra`:
1. **Pahami Misi:** Repositori ini adalah proyek open-source / kit distribusi bernama `orchestra`.
2. **Kembangkan Fitur:**
   - Sempurnakan CLI di `bin/index.js` agar memiliki tampilan interaktif yang indah (chalk/kleur-style ANSI, spinner, prompt deteksi stack).
   - Lengkapi file template di `templates/` agar siap di-copy ke repo target ketika `orchestra init` dijalankan.
   - Siapkan installer script `install.ps1` dan `install.sh` untuk teman yang ingin setup global library `~/.agents`.
   - Buatkan dokumentasi `README.md` yang memukau untuk GitHub.

---

## 📈 6. Riwayat Pengembangan & Update Terbaru (Branch `dev`)

Pada 14 November 2026:
- **Remote Installer Implementation:** Menyempurnakan `install.ps1` dan `install.sh` dengan mekanisme download arsip riil dari `ReyCannavaro/orchestra` saat dijalankan via one-liner remote (`irm ... | iex` atau `curl ... | bash`).
- **CLI Expansion (`bin/index.js`):**
  - Menambahkan argumen non-interaktif: `--preset <name>`, `-y`/`--yes`, `-f`/`--force`, `--dry-run`, dan `-v`/`--version`.
  - Memuat versi secara dinamis dari `package.json`.
  - Normalisasi opsi input preset (1-4 atau string identifier).
- **Diferensiasi Template Spesifik:**
  - `nextjs-fullstack`: Instruksi Server Components vs Client Components, App Router, Server Actions, dan anti-hydration error.
  - `flutter-mobile`: Instruksi arsitektur immutability, `const` constructor hygiene, responsive layout (`SafeArea`, `LayoutBuilder`), dan clean lifecycle management.
  - `monorepo`: Instruksi package boundaries, larangan circular dependency, task graph cache friendly, dan integrasi conflict matrix.
- **Pembaruan Repositori:** Mengarahkan seluruh URL placeholder ke repositori resmi `https://github.com/ReyCannavaro/orchestra`.
