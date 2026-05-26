# Tailwind CSS Setup untuk Production

## ✅ Perubahan yang Dilakukan:

### 1. **Install Tailwind CSS**
   - Installed: `tailwindcss`, `postcss`, `autoprefixer`
   - Removed: `cdn.tailwindcss.com` (CDN tidak baik untuk production)

### 2. **Konfigurasi Files Baru**
   - `tailwind.config.js` - Konfigurasi Tailwind
   - `postcss.config.js` - PostCSS plugins  
   - `input.css` - Source CSS dengan @tailwind directives
   - `build-css.js` - Build script untuk generate CSS
   - `.vercelignore` - Ignore file untuk Vercel deployment

### 3. **HTML Changes** ([index.html](index.html))
   - ❌ Removed: `<script src="https://cdn.tailwindcss.com"></script>`
   - ✅ Added: `<link rel="stylesheet" href="./dist/output.css">`
   - ❌ Removed: Inline `<style>` tag (moved ke input.css)

### 4. **CSS Updates** ([input.css](input.css))
   - Ditambahkan Google Fonts import
   - Semua styles dari HTML inline dipindahkan ke sini
   - Termasuk: scrollbar, resume timeline, skill tags, project cards, sidebar styling

### 5. **Build Scripts** ([package.json](package.json))
```json
"scripts": {
  "build:css": "node build-css.js",
  "dev": "node build-css.js && npx serve .",
  "build": "node build-css.js"
}
```

### 6. **Vercel Deployment** ([vercel.json](vercel.json))
   - Added `"buildCommand": "npm run build:css"`
   - CSS akan auto-build saat deploy

## 📦 Output

File CSS compiled: **`dist/output.css`** (2.1 KB)

## 🚀 Cara Menggunakan

### Local Development:
```bash
npm run dev        # Build CSS + start server
npm run build:css  # Build CSS only
```

### Production (Vercel):
- Automatic: CSS akan di-build saat deployment
- Manual push ke GitHub akan trigger build

## ⚠️ Production Benefits:

✅ **Lebih Cepat** - CSS sudah di-compile, tidak perlu runtime compilation
✅ **Lebih Aman** - Tidak expo credentials di CDN
✅ **Lebih Ringan** - Hanya CSS yang dipakai, tidak ada CDN overhead
✅ **Offline-Ready** - Bisa bekerja tanpa internet (CSS sudah lokal)
✅ **Vercel Optimized** - Native support untuk build commands

## 🔄 Next Steps:

1. Test di localhost: `npm run dev`
2. Check browser: Styling harus sama seperti sebelumnya
3. Push ke GitHub untuk auto-deploy di Vercel
