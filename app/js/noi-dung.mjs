// Nạp nội dung JSON trong content/ (sinh bằng tools/xay-noi-dung.mjs và tools/tao-lo-trinh.mjs).
// Khi không có mạng, service worker trả bản đã lưu.

const daNap = new Map();
export function napNoiDung(ten) {
  if (!daNap.has(ten)) {
    daNap.set(
      ten,
      fetch(`content/${ten}.json`).then((tl) => {
        if (!tl.ok) throw new Error(`Không tải được content/${ten}.json (${tl.status})`);
        return tl.json();
      }),
    );
  }
  return daNap.get(ten);
}
