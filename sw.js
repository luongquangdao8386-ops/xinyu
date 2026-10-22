// Service worker của Xinyu (mục 12.1, 12.7): lưu sẵn khung app, font và nội dung để mở được khi không có mạng;
// âm thanh lưu vào bộ nhớ đệm khi đã mở. Trang và nội dung lấy bản mới trên mạng trước (chờ tối đa 3 giây),
// không được thì dùng bản đã lưu; font và âm thanh dùng bản đã lưu trước.
// Thêm tệp vào app/, vendor/font/ hoặc content/ thì thêm vào LUU_SAN (kiểm thử báo khi thiếu).

const BAN = 'xinyu-1';
const KHO_AM_THANH = 'xinyu-am-thanh';
const LUU_SAN = [
  './',
  'index.html',
  'manifest.webmanifest',
  'app/css/xinyu.css',
  'app/js/giao-dien.mjs',
  'app/js/ke-hoach.mjs',
  'app/js/khoi-dong.mjs',
  'app/js/kho.mjs',
  'app/js/noi-dung.mjs',
  'app/js/man/chao-mung.mjs',
  'app/js/man/cho-xay.mjs',
  'app/js/man/diem-bat-dau.mjs',
  'app/js/man/hom-nay.mjs',
  'app/js/man/ke-hoach.mjs',
  'app/js/man/muc-tieu.mjs',
  'app/js/man/thanh-phan.mjs',
  'app/js/man/toi.mjs',
  'app/hinh/apple-touch-icon.png',
  'app/hinh/bieu-tuong-192.png',
  'app/hinh/bieu-tuong-512.png',
  'app/hinh/bieu-tuong-mask-512.png',
  'vendor/font/font.css',
  'vendor/font/noto-sans-400.woff2',
  'vendor/font/noto-sans-600.woff2',
  'vendor/font/noto-sans-sc-400-1.woff2',
  'vendor/font/noto-sans-sc-400-2.woff2',
  'vendor/font/noto-sans-sc-600-1.woff2',
  'vendor/font/noto-sans-sc-600-2.woff2',
  'vendor/font/noto-serif-600.woff2',
  'vendor/font/noto-serif-sc-600-1.woff2',
  'vendor/font/noto-serif-sc-600-2.woff2',
  'content/bai.json',
  'content/cap-de-nham.json',
  'content/cap-thanh.json',
  'content/cau-hoi.json',
  'content/cau.json',
  'content/chu.json',
  'content/lo-trinh.json',
  'content/ngu-phap.json',
  'content/phat-am.json',
  'content/truyen.json',
  'content/tu.json',
  'audio/danh-sach.json',
];

self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(BAN).then((c) => c.addAll(LUU_SAN)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches
      .keys()
      .then((ds) => Promise.all(ds.filter((k) => k !== BAN && k !== KHO_AM_THANH).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

// Bản đã lưu trước; chưa có thì tải rồi lưu.
async function luuTruoc(yc, kho) {
  const c = await caches.open(kho);
  const da = await c.match(yc);
  if (da) return da;
  const tl = await fetch(yc);
  if (tl.ok) c.put(yc, tl.clone());
  return tl;
}

// Bản trên mạng trước; mạng chậm quá 3 giây hoặc lỗi thì dùng bản đã lưu.
async function mangTruoc(yc) {
  const c = await caches.open(BAN);
  const mang = fetch(yc).then((tl) => {
    if (tl.ok) c.put(yc, tl.clone());
    return tl;
  });
  const het = new Promise((xong) => setTimeout(xong, 3000));
  const tl = await Promise.race([mang.catch(() => null), het]);
  if (tl) return tl;
  return (await c.match(yc, { ignoreSearch: true })) || mang;
}

self.addEventListener('fetch', (e) => {
  const yc = e.request;
  const url = new URL(yc.url);
  if (yc.method !== 'GET' || url.origin !== location.origin) return;
  if (/\/audio\/.+\.mp3$/.test(url.pathname)) e.respondWith(luuTruoc(yc, KHO_AM_THANH));
  else if (/\/vendor\/font\//.test(url.pathname) && url.pathname.endsWith('.woff2')) e.respondWith(luuTruoc(yc, BAN));
  else e.respondWith(mangTruoc(yc));
});
