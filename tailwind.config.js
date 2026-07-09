/** @type {import('tailwindcss').Config} */
// Статическая компиляция Tailwind вместо browser-JIT CDN (cdn.tailwindcss.com).
// Сканирует index.html и все JS-модули (классы также строятся в template-строках).
// Регенерация:  npm run build:css   (см. package.json)
module.exports = {
  content: ['./index.html', './js/**/*.js'],
  theme: { extend: {} },
  plugins: [],
}
