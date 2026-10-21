// Dựng các tab của Google Sheet biên soạn (tab HuongDan và các tab nội dung theo cau-truc.mjs) để ghi .xlsx.
// Dùng chung cho mẫu Sheet (tools/tao-mau-sheet.mjs) và tệp cập nhật Sheet (tools/dien-noi-dung.mjs).

import { TAB } from './cau-truc.mjs';

export const HUONG_DAN = [
  'Mỗi tab là một loại nội dung. Dòng đầu là tên cột: không đổi tên, không xóa cột; có thể thêm cột riêng ở bên phải.',
  'Cột Trạng thái: để “nháp” khi đang soạn, đổi sang “đã kiểm tra” sau khi tự xem lại. Công cụ chỉ xuất dòng “đã kiểm tra” và không có lỗi.',
  'Tab Tu, Chu, NguPhap đã điền sẵn danh sách HSK 1 của đề cương thi 11/2025 (300 từ, 246 chữ nhận biết, 70 điểm ngữ pháp); tab Bai điền sẵn 56 bài theo docs/lo-trinh-hsk1.md. Không đổi Mã, Mã đề cương, Từ, Cấp của các dòng này.',
  'Danh sách trong một ô (từ của bài, mã câu…) cách nhau bằng dấu phẩy, dấu 、 hoặc xuống dòng.',
  'Gọi một từ bằng chữ Hán như ở tab Tu (từ đồng hình thêm số, ví dụ 会1), một chữ bằng chính chữ đó; gọi bài, câu, câu hỏi, ngữ pháp bằng mã.',
  'Câu của bài hoặc truyện nằm ở tab Cau, cột Bài ghi mã bài hoặc mã truyện; thứ tự dòng là thứ tự câu. Câu chỉ được dùng từ đã học tính đến bài đó, tên riêng khai ở cột Tên riêng của tab Bai.',
  'Xây nội dung: Tệp > Tải xuống > Microsoft Excel (.xlsx), gửi tệp cho Claude để chạy node tools/xay-noi-dung.mjs <tệp>. Hoặc Tệp > Chia sẻ > Công bố lên web (Publish to web), chọn cả tài liệu và định dạng .xlsx, rồi dùng đường dẫn đó thay cho tệp.',
  'Tab CanSua: dán danh sách nội dung cần sửa xuất từ app (màn 29); ghi x ở cột Đã xử lý khi sửa xong.',
  'Nội dung Claude soạn đến dạng tệp .xlsx cập nhật (chỉ điền ô trống, thêm dòng mới để “nháp”): Tệp > Nhập > Tải lên > Thay thế bảng tính, làm ngay khi nhận tệp vì chỗ sửa trên Sheet sau khi Claude tạo tệp sẽ mất. Cần quay lại thì dùng Tệp > Nhật ký phiên bản.',
];

// dong: tên tab → các dòng dạng { khoa JSON: giá trị }; cột riêng người dùng thêm bên phải ghi ở cotRieng
// (tên tab → tên cột) và trong dòng với khóa '+<tên cột>'.
export function dungTab(dong = {}, cotRieng = {}) {
  return [
    {
      ten: 'HuongDan',
      xuongDong: true,
      doRong: [14, 22, 10, 90],
      dong: [
        ['Xinyu — Sheet biên soạn nội dung', '', '', ''],
        ...HUONG_DAN.map((h, i) => [`${i + 1}.`, '', '', h]),
        ['', '', '', ''],
        ['Tab', 'Cột', 'Bắt buộc', 'Mô tả'],
        ...TAB.flatMap((t) => [
          [t.ten, `(${t.tieuDe})`, '', ''],
          ...t.cot.map((c) => ['', c.tieuDe, c.batBuoc ? 'có' : '', [c.moTa, c.chon ? `Chọn: ${c.chon.join(', ')}.` : ''].filter(Boolean).join(' ')]),
        ]),
      ],
    },
    ...TAB.map((t) => {
      const rieng = cotRieng[t.ten] || [];
      return {
        ten: t.ten,
        doRong: [...t.cot.map((c) => c.rong || 12), ...rieng.map(() => 12)],
        dong: [
          [...t.cot.map((c) => c.tieuDe), ...rieng],
          ...(dong[t.ten] || []).map((o) => [...t.cot.map((c) => o[c.khoa] ?? ''), ...rieng.map((r) => o[`+${r}`] ?? '')]),
        ],
        danhSach: t.cot.map((c, i) => (c.chon ? { cot: i, giaTri: c.chon } : null)).filter(Boolean),
      };
    }),
  ];
}
