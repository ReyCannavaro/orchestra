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
- **Master Strategic Roadmap Created:** Merumuskan dokumen blueprint strategis super mendalam 5 pilar evolusi Orchestra di [`docs/ROADMAP.md`](docs/ROADMAP.md) (Native MCP Server, Quality Gatekeeper CLI, Skill Package Manager, Dynamic Baton Handover, dan Mission Control TUI).

Pada 21 November 2026:
- **Penyelesaian Penuh Tahap 1 (Pilar 2: Quality Gatekeeper CLI):**
  - Mengembangkan arsitektur modular di folder `lib/`:
    - `lib/utils/colors.js` & `lib/utils/git.js`: Helper git diff/status/staged scannable files.
    - `lib/checker/truncationRule.js`: Mendeteksi pemotongan kode, stub, dan `// TODO`.
    - `lib/checker/antiSlopRule.js`: Mendeteksi gradient ungu-pink generik, shadow neon berlebihan, dan elemen button tanpa interactive states.
    - `lib/checker/compilerRule.js`: Menjalankan typecheck / linter sesuai stack (`tsc`, `dart analyze`, `eslint`).
    - `lib/checker/agentHealthRule.js`: Memverifikasi integritas konfigurasi agent & IDE bridges.
    - `lib/checker/reporter.js`: Terminal diagnostic report berstandar tinggi.
    - `lib/hooks/installHook.js`: Pemasang otomatis Git pre-commit hook dan generator GitHub Actions CI workflow.
  - Mengintegrasikan perintah `orchestra check`, `orchestra doctor`, `orchestra install-hook`, dan `orchestra init-ci` ke `bin/index.js`.
  - Berhasil diuji coba menyeluruh (termasuk verifikasi deteksi pelanggaran dengan test suite sementara).
- **Penyelesaian Penuh Tahap 2 (Pilar 4: Dynamic Baton Protocol & Session Handover Engine):**
  - Mengembangkan arsitektur state management di `lib/session/`:
    - `lib/session/schema.js`: Skema data `.agents/BATON.json`, ID sesi otomatis, roadmap 4-fase terstruktur.
    - `lib/session/batonManager.js`: Read/write `.agents/BATON.json`, arsip history sesi (`.agents/history/`), dan generator `docs/ADR.md`.
    - `lib/session/reporter.js`: Visualisasi status sesi, active goal, baton holder, roadmap steps, touched files, dan ADRs.
    - `lib/session/index.js`: API lengkap: `sessionStart`, `sessionStatus`, `sessionCheckpoint`, `sessionAcquire`, `sessionRelease`, `sessionEnd`.
  - Mengintegrasikan perintah `orchestra session` dan `orchestra baton` ke `bin/index.js`.
  - Mengupdate seluruh directive `AGENTS.md` (root & semua templates) dengan aksioma ke-5: *State Continuity & The Baton Protocol*.
  - Teruji tuntas: start session, checkpoint advance, touch file tracking, ADR logging, baton handover, dan auto-archive saat end session.
- **Penyelesaian Penuh Tahap 3 (Pilar 3: Modular Skill Registry & Package Manager):**
  - Membuat format manifest terstandarisasi `skill.json` dan central index `registry/index.json` (mengindeks 23 core skills dengan kategori & tags).
  - Mengembangkan modul `lib/skills/`:
    - `lib/skills/manifest.js`: Parser & generator manifest `skill.json` serta ekstraktor frontmatter `SKILL.md`.
    - `lib/skills/registry.js`: Resolusi registry hybrid (local `registry/index.json` & remote GitHub CDN fallback).
    - `lib/skills/reporter.js`: Tampilan tabel ANSI untuk `skill list` dan `skill search`.
    - `lib/skills/routerUpdater.js`: Auto-injection skill baru ke dalam `.agents/SKILL_ROUTER.md`.
    - `lib/skills/index.js`: API lengkap perintah CLI: `skillList`, `skillSearch`, `skillAdd`, `skillRemove`, `skillUpdate`, dan `skillNew`.
  - Mengintegrasikan perintah `orchestra skill` / `skills` ke `bin/index.js`.
  - Teruji tuntas: listing skills, pencarian berbasis keyword/tag, penambahan skill lokal/global, scaffolding skill baru, dan penghapusan skill.
  - Memperbarui roadmap active Baton session di `.agents/BATON.json` (Step 3: COMPLETED ✔).
- **Penyelesaian Penuh Tahap 4 (Pilar 1: Native Orchestra MCP Server):**
  - Mengembangkan native JSON-RPC 2.0 Model Context Protocol (MCP) Server di `lib/mcp/`:
    - `lib/mcp/tools.js`: Deklarasi schema 6 tools standar MCP (`orchestra_resolve_skill`, `acquire_baton`, `release_baton`, `verify_diff`, `session_status`, `list_skills`).
    - `lib/mcp/handlers.js`: Implementasi eksekusi aktif untuk masing-masing tool (lazy skill resolving, locking, verification).
    - `lib/mcp/server.js`: Zero-dependency STDIO message loop dengan stream terisolasi (stdout murni JSON-RPC, stderr untuk log diagnosa).
    - `lib/mcp/ideConfig.js`: Generator konfigurasi multi-IDE (`.cursor/mcp.json`, Claude Desktop snippet, Antigravity instruction).
    - `lib/mcp/index.js`: Entrypoint CLI `runMcpServer` dan `setupIdeMcpConfig`.
  - Mengintegrasikan perintah `orchestra mcp` dan `orchestra mcp-setup` ke `bin/index.js`.
  - Teruji tuntas: pengujian handshake JSON-RPC 2.0 (initialize, tools/list, tools/call) melewati automated harness 100% lulus.
  - Memperbarui roadmap active Baton session di `.agents/BATON.json` (Step 4: COMPLETED ✔).
