# 📋 WORKFLOWS: Flutter Mobile Standard Operating Procedures (SOP)

Alur kerja terstandarisasi untuk pengembangan aplikasi Flutter pada repositori ini:

---

## 1. Workflow Pembuatan Screen / Widget UI

```text
[Analisis Mockup Desain & Komponen UI]
                    │
                    ▼
[Muat Skill: responsive-craft & design-taste-frontend]
                    │
                    ▼
[Pecah UI Menjadi Sub-Widget Independen (StatelessWidget dengan const)]
                    │
                    ▼
[Bungkus dengan SafeArea & Cek Layout Responsif (Cegah RenderFlex Overflow)]
                    │
                    ▼
[Hubungkan ke State Controller (ConsumerWidget / BlocBuilder)]
                    │
                    ▼
[Uji Tampilan di Variasi Ukuran Layar & Dark/Light Theme]
```

---

## 2. Workflow State Management & Integrasi API

```text
[Definisikan Model Data (Freezed / json_serializable) & DTO]
                    │
                    ▼
[Buat Repository Interface & Concrete Implementation dengan Try-Catch / Either]
                    │
                    ▼
[Buat State Provider / Notifier / Cubit dengan Status Loading, Success, Error]
                    │
                    ▼
[Konsumsi State di Widget UI dengan Feedback User (Snackbar / Dialog)]
                    │
                    ▼
[Verifikasi Error Handling (Offline, Timeout 408/504, 401 Unauthorized)]
```

---

## 3. Workflow Profiling Performa & Debugging

1. **Static Analysis First:** Jalankan `flutter analyze` atau `dart analyze` untuk memastikan 0 linter warnings.
2. **Rebuild Inspection:** Gunakan Flutter DevTools Performance view untuk memastikan tidak terjadi unnecessary rebuild saat scroll list.
3. **Controller Hygiene:** Pastikan setiap `AnimationController`, `ScrollController`, atau `TextEditingController` dibersihkan pada method `dispose()`.
