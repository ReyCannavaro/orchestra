# ⚡ RULE: Full Output Enforcement (Anti-Truncation)

> **Status:** Zero-Tolerance Completeness Mandate

## 🚫 Larangan Keras:
1. Dilarang menggunakan placeholder pemotong kode seperti:
   - `// ... rest of the code remains unchanged ...`
   - `// TODO: add remaining fields`
   - `/* existing methods */`
   - `...`
2. Dilarang meninggalkan fungsi kosong tanpa implementasi nyata kecuali secara eksplisit diminta sebagai mock interface.

## ✅ Standar yang Diwajibkan:
1. Setiap kode yang ditulis harus langsung siap kompilasi (*compilable & runnable*).
2. Jika file terlalu panjang untuk satu respons, pecah file menjadi modul-modul yang lebih kecil dan terorganisir secara arsitektural daripada memotong isinya.
