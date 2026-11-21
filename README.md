# 🎻 ORCHESTRA

> **The Symphony Multi-Agent Orchestration & Scaffolding Kit**  
> *Transform chaotic AI chatter into harmonious, enterprise-grade software development.*

---

## 🌟 Mengapa Orchestra?

Dalam pengembangan software modern berbasis AI, agent sering kali mengalami:
* **Agent Chatter & Halusinasi:** Model berbicara tanpa batas tanpa memahami batasan peran.
* **Kode Terpotong:** Menghasilkan `// TODO` atau `// ... rest of code` di tengah pekerjaan krusial.
* **Desain Murahan (*AI Slop*):** Gradient ungu-pink generik dan shadow tebal yang tidak bernilai jual.
* **Konflik Mutasi File:** Beberapa prompt menimpa file secara bertabrakan.

**Orchestra** menyelesaikan masalah ini dengan meminjam filosofi **Orkestra Simfoni**:
* 🎼 **The Conductor (`ORCHESTRATOR.md`):** Mengatur tempo, giliran instrumen, dan siklus kerja 4 tahap (*Intent Triage ➔ Skill Resolution ➔ Phased Execution ➔ Pre-Flight Verification*).
* 📜 **The Score (`AGENTS.md`):** Rujukan spesifikasi absolut (*Ground Truth*).
* 🗺️ **The Skill Router (`SKILL_ROUTER.md`):** Memetakan kebutuhan tugas secara otomatis ke pustaka 23+ skill terpusat tanpa membebani context window.
* 🛡️ **Quality Guardrails:** Aturan wajib *Anti-Slop Visual* dan *Full Output Enforcement*.

---

## ⚡ Quickstart: Cara Pakai

### Opsi 1: Pasang ke Proyek Apapun (Rekomendasi)
Masuk ke folder proyek Anda, lalu jalankan:

```bash
npx orchestra init
```

*Atau langsung dari GitHub tanpa perlu publish ke NPM:*
```bash
npx github:ReyCannavaro/orchestra init
```

*Mode otomatis / Non-Interaktif:*
```bash
# Otomatis deteksi & terapkan preset tanpa konfirmasi
npx orchestra init -y

# Pilih preset spesifik secara langsung
npx orchestra init --preset nextjs-fullstack -y
```

CLI pintar Orchestra akan:
1. Mendeteksi jenis stack Anda (Next.js, Flutter, Python, Monorepo, dll.).
2. Menawarkan profil preset yang sesuai.
3. Menghasilkan file panduan `AGENTS.md`, `.agents/ORCHESTRATOR.md`, `.agents/SKILL_ROUTER.md`, `.agents/WORKFLOWS.md`, serta jembatan `.cursorrules` & `CLAUDE.md`.

---

### Opsi 2: Pasang Pustaka Core Skills Global (One-Time Setup)

Agar seluruh proyek di laptop Anda bisa mengakses 23+ skill secara otomatis tanpa duplikasi file:

* **Di Windows (PowerShell):**
  ```powershell
  irm https://raw.githubusercontent.com/ReyCannavaro/orchestra/main/install.ps1 | iex
  ```
* **Di macOS / Linux:**
  ```bash
  curl -fsSL https://raw.githubusercontent.com/ReyCannavaro/orchestra/main/install.sh | bash
  ```
* **Atau via CLI lokal:**
  ```bash
  node ./bin/index.js setup-global
  ```

---

## 🎛️ Opsi & Perintah CLI

```text
USAGE:
  npx orchestra <command> [options]

COMMANDS:
  init             Scaffold Orchestra multi-agent architecture in current repository
  session <action> Kelola sesi kerja multi-agent & Baton lock (start, status, checkpoint, end)
  check, doctor    Run Quality Gatekeeper (Anti-Slop, Anti-Truncation, Agent Health)
  install-hook     Install Git pre-commit guardrail hook to prevent bad commits
  init-ci          Generate GitHub Actions CI workflow for PR verification
  setup-global     Install/Sync 23+ core skills to ~/.agents/skills (Global Hub)
  list-skills      Display all available core skills in the Orchestra library
  version, -v      Tampilkan versi Orchestra
  help, --help     Show this help menu

OPTIONS (for session):
  --step <N>           Pilih nomor langkah roadmap yang ditargetkan
  --done, --completed  Tandai langkah roadmap selesai (otomatis memajukan langkah berikutnya)
  --touch <file>       Catat file yang dimodifikasi ke riwayat sesi
  --adr <text>         Catat Keputusan Arsitektural (ADR)
  --role <name>        Tentukan pemegang baton (conductor, frontend, backend, qa)

OPTIONS (for check / doctor):
  --staged             Hanya verifikasi file yang sudah di-stage di Git (default pre-commit)
  --all                Verifikasi seluruh file source code di repositori
  --fix                Otomatis perbaiki masalah konfigurasi/bridge yang hilang
  --fast               Mode cepat: jalankan scanner AST/regex, lewati compiler lambat
  --run-linter         Jalankan script linter proyek (npm run lint) jika terkonfigurasi

OPTIONS (for init):
  -p, --preset <name>  Pilih preset langsung: universal, nextjs-fullstack, flutter-mobile, monorepo
  -y, --yes            Terima preset tanpa prompt interaktif
  -f, --force          Timpa file yang sudah ada jika ada konflik
  --dry-run            Simulasikan scaffolding tanpa menulis file ke disk
```

---

## 📜 The Baton Protocol & Session Continuity

Untuk mengatasi masalah **AI amnesia** saat berpindah editor (misal: Cursor ➔ Claude Code ➔ Antigravity) atau saat token context window penuh, Orchestra menyediakan **Baton Protocol**:

```bash
# Mulai sesi pengerjaan baru dengan roadmap otomatis
npx orchestra session start "Refactor Sistem Autentikasi"

# Catat checkpoint: langkah 1 selesai & catat file yang dimutasi
npx orchestra session checkpoint --step 1 --done --touch src/auth.ts --adr "ADR-001: Gunakan Lucia v3"

# Lihat status sesi, pemegang baton, dan progress roadmap
npx orchestra session status

# Selesaikan sesi (otomatis jalankan verifikasi pre-flight & ekspor docs/ADR.md)
npx orchestra session end
```

State disimpan di `.agents/BATON.json`. Setiap AI yang membaca repositori ini akan langsung mengenali langkah apa yang sedang dikerjakan dan tidak akan menimpa kode yang sudah selesai!

---

## 🛡️ Quality Gatekeeper (Anti-Slop & Anti-Truncation)

Orchestra menyertakan scanner otomatis untuk memastikan AI tidak memasukkan kode rusak ke repository Anda:

```bash
# Periksa kode yang baru diubah sebelum commit
npx orchestra check

# Otomatis pasang hook pre-commit agar tidak ada kode slop yang bisa di-commit
npx orchestra install-hook

# Generate workflow GitHub Actions untuk proteksi Pull Request
npx orchestra init-ci
```

Scanner memeriksa 4 lapisan:
1. 🚫 **Anti-Truncation Guard:** Mendeteksi `// TODO`, `// ... rest of code`, fungsi stub kosong.
2. 🎨 **Anti-Slop Visual Inspector:** Mendeteksi palette AI generik (gradient ungu-pink murah, shadow neon berlebihan, button tanpa interactive hover/focus states).
3. ⚙️ **Compiler & Linter Runner:** Menjalankan `tsc`, `flutter analyze`, atau `eslint` secara otomatis.
4. 🩺 **Agent Health & Integrity:** Memastikan integritas konfigurasi `AGENTS.md`, `.agents/`, `.cursorrules`, dan `CLAUDE.md`.

---

## 📚 23+ Core Skills Terpasang

Orchestra menyertakan pustaka skill kelas dunia yang siap dipanggil:
* 🎨 **Desain & Anti-Slop:** `design-taste-frontend`, `high-end-visual-design`, `minimalist-ui`, `industrial-brutalist-ui`, `responsive-craft`, `stitch-design-taste`, `brandkit`.
* ⚡ **Rekayasa Kode & Integrity:** `full-output-enforcement`, `context7-mcp`, `image-to-code`.
* 🧪 **Testing & Browser:** `browser-use`, `valyu-best-practices`.
* 🤖 **Pengembangan Agent & Hook:** `agent-development`, `skill-development`, `hook-development`, `mcp-integration`.

---

## 🌐 Kompatibilitas Lintas Alat AI

Orchestra dirancang dengan standar universal:
* ✅ **Google Antigravity & Gemini CLI** (Native `AGENTS.md`)
* ✅ **Cursor IDE** (Otomatis bridge via `.cursorrules`)
* ✅ **Claude Code** (Otomatis bridge via `CLAUDE.md`)
* ✅ **Windsurf & Cascade**
* ✅ **GitHub Copilot / VS Code**

---

## 🗺️ Engineering Roadmap
Ingin melihat arah pengembangan masa depan Orchestra menjadi AI Operating System mandiri?
Baca blueprint mendalam 5 pilar strategis kami di:
👉 [**`docs/ROADMAP.md`**](docs/ROADMAP.md)

---

## 📄 Lisensi
Dilisensikan di bawah [MIT License](LICENSE). Dibuat dengan dedikasi oleh **Rey Cannavaro**.
