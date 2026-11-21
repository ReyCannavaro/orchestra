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
  setup-global     Install/Sync 23+ core skills to ~/.agents/skills (Global Hub)
  list-skills      Display all available core skills in the Orchestra library
  help, --help     Show this help menu

OPTIONS (for init):
  -p, --preset <name>  Pilih preset langsung: universal, nextjs-fullstack, flutter-mobile, monorepo
  -y, --yes            Terima preset tanpa prompt interaktif
  -f, --force          Timpa file yang sudah ada jika ada konflik
  --dry-run            Simulasikan scaffolding tanpa menulis file ke disk
  -v, --version        Tampilkan versi Orchestra
```

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
