# Mô phỏng 3D hệ thống chiller trục vít giải nhiệt nước

Ứng dụng web mô phỏng tương tác một phòng máy gồm: cụm chiller trục vít giải nhiệt nước (CH-01), tháp giải nhiệt vuông quạt hút trên đỉnh (CT-01), bơm nước lạnh (CHWP-01), bơm nước giải nhiệt (CWP-01), AHU (AHU-01), bình giãn nở (ET-01), cùng đường ống, van, thiết bị đo và giá đỡ của ba mạch: nước lạnh, nước giải nhiệt và môi chất R134a.

Đây là mô hình minh họa kỹ thuật, không đại diện cho sản phẩm của nhà sản xuất nào. Mọi thông số trên giao diện là **giả lập minh họa**.

- Công nghệ: HTML, CSS, JavaScript ES Modules, **Three.js 0.186.1** (lõi và addon cùng phiên bản, lưu sẵn trong `vendor/three/`, chạy được khi không có mạng).
- Không dùng framework, không có bước build. Toàn bộ thiết bị dựng bằng hình học Three.js (không dùng mô hình GLB/GLTF bên ngoài).

## Chạy thử

ES Modules không chạy khi mở trực tiếp `index.html` bằng `file://`, cần một máy chủ tĩnh:

```bash
cd mo-phong-chiller
node kiem-thu/may-chu.mjs          # mở http://127.0.0.1:8080/
# hoặc
python3 -m http.server 8080        # rồi mở http://127.0.0.1:8080/
```

Trình duyệt cần hỗ trợ WebGL 2 (Chrome, Edge, Firefox, Safari bản mới).

## Thao tác

| Thao tác | Chuột | Cảm ứng |
|---|---|---|
| Xoay | kéo chuột trái | kéo một ngón |
| Phóng to/thu nhỏ | cuộn | chụm hai ngón |
| Dịch | kéo chuột phải | kéo hai ngón |
| Chọn thiết bị | bấm vào thiết bị | chạm |

Bấm vào một bộ phận: bộ phận được tô sáng vàng, thẻ thông tin hiện tên, chức năng, cấu tạo và thông số giả lập. Trên thẻ có nút *Phóng gần*, *Ẩn*, *Chỉ xem mục này*, *Hiện tất cả*. Ba nút trên mặt tủ điều khiển 3D (khởi động, dừng, đặt lại) và nút dừng khẩn bấm được.

**Tab Vận hành**: bật/tắt riêng bơm nước lạnh, bơm giải nhiệt, quạt tháp, máy nén; thanh tốc độ (biến tần) cho từng bơm; thanh tải lạnh AHU; nút *Chạy toàn hệ thống*, *Dừng toàn bộ*, *Đặt lại báo lỗi*; bảng thông số; tốc độ thời gian 1×/2×/5× và tạm dừng.

**Tab Hiển thị**: góc nhìn tổng thể 35°, từ trên, mặt trước, mặt bên, về mặc định; phóng gần từng thiết bị; ẩn vỏ chiller, ẩn một phần vỏ tháp, ẩn vỏ AHU; mặt cắt bình bay hơi, bình ngưng, máy nén, hai bơm, bình giãn nở; tháo nắp hộp nước; xem dòng chảy (ống trong suốt, hạt chuyển động); tô màu ống theo lưu chất; làm nổi bật riêng từng mạch; bật/tắt nhãn; chế độ tiết kiệm (tắt bóng, giảm hạt).

**Tab Cấu tạo**: cây bộ phận, bỏ dấu để ẩn, bấm tên để chọn.

## Nguyên lý được mô phỏng

- **Mạch nước lạnh**: bình bay hơi → nước lạnh cấp 7 °C (trên cao) → van ba ngả và dàn coil AHU → nước hồi 12 °C → lọc Y, bình giãn nở (nối ở cửa hút) → bơm nước lạnh → van một chiều → đầu vào bình bay hơi.
- **Mạch nước giải nhiệt**: bể tháp → lọc Y → bơm giải nhiệt → đầu vào bình ngưng 30 °C → đầu ra 35 °C → ống lên đỉnh tháp → ống phân phối, vòi phun → rơi qua khối đệm → bể tháp. Có đường nước bù qua van phao và đường xả tràn, xả đáy.
- **Mạch môi chất**: máy nén → bình tách dầu → bình ngưng → phin lọc → kính xem → van tiết lưu điện tử → bình bay hơi (ngập lỏng) → máy nén. Dầu tách ra hồi về máy nén qua phin lọc dầu và van điện từ.
- Nước và môi chất chỉ trao đổi nhiệt qua thành ống trong hai bình; khi cắt bình sẽ thấy nước đi trong ống (2 pass, màu theo nhiệt độ) và môi chất bao quanh ống.
- **Liên động**: máy nén chỉ khởi động khi cả hai công tắc dòng chảy đóng liên tục 3 giây (lưu lượng ≥ 50 % thiết kế). Khi một bơm dừng, máy nén ngừng ngay, giao diện giải thích đang chờ lưu lượng và máy tự chạy lại khi có lưu lượng. Quạt tháp dừng làm nước giải nhiệt nóng dần, áp ngưng tăng, bộ điều khiển giảm tải rồi dừng bảo vệ nếu vượt 11,5 bar.

## Cấu trúc thư mục

```
mo-phong-chiller/
├── index.html                 trang chính, importmap trỏ tới vendor/three
├── css/giao-dien.css          giao diện, bảng điều khiển, nhãn 3D
├── js/
│   ├── main.js                điểm vào: ghép các phần, vòng lặp (delta time)
│   ├── cau-hinh.js            ★ vị trí thiết bị, cỡ ống, cao độ, bảng màu chú giải, camera mặc định
│   ├── canh.js                khởi tạo cảnh: renderer, camera, OrbitControls, ánh sáng, bóng, sàn có lưới toạ độ
│   ├── vat-lieu.js            ★ thư viện vật liệu (thép sơn, nhôm, đồng, cao su, bảo ôn…), mặt cắt
│   ├── hinh-hoc.js            hình học dùng chung: bu lông InstancedMesh, mặt bích, tuyến ống có co, rotor xoắn, gộp mesh tĩnh
│   ├── thanh-phan.js          sổ đăng ký bộ phận (chọn, ẩn/hiện, cây cấu tạo)
│   ├── thiet-bi/
│   │   ├── chiller.js         ★ cụm chiller và định nghĩa tuyến môi chất
│   │   ├── thap-giai-nhiet.js ★ tháp giải nhiệt
│   │   ├── bom.js             ★ bơm ly tâm (dùng cho cả hai bơm)
│   │   ├── ahu.js             ★ AHU
│   │   ├── binh-gian-no.js    ★ bình giãn nở
│   │   └── phu-kien.js        ★ van, lọc Y, khớp mềm, đồng hồ, cảm biến, EXV, phin lọc, kính xem…
│   ├── duong-ong.js           ★ tuyến ống nước, phụ kiện trên tuyến, giá đỡ, mũi tên, hạt dòng chảy
│   ├── mo-hinh-nhiet.js       ★ mô hình nhiệt giả lập (không phụ thuộc Three.js)
│   ├── van-hanh.js            ★ trạng thái vận hành, liên động, trình tự khởi động, bảo vệ
│   ├── hoat-anh.js            hoạt ảnh: rotor, bơm, quạt, nước rơi, không khí, hạt, kim đồng hồ, màn hình tủ
│   ├── giao-dien.js           bảng điều khiển, chọn thiết bị, nhãn chống chồng lấn, góc nhìn
│   └── kiem-tra.js            kiểm tra đầu ống – thiết bị, mạch kín, ống không xuyên nhau/xuyên thiết bị
├── kiem-thu/
│   ├── mo-hinh-nhiet.test.mjs kiểm thử mô hình nhiệt và liên động (node --test)
│   ├── kiem-tra-trinh-duyet.mjs kiểm tra trong Chromium và chụp ảnh vào anh/
│   └── may-chu.mjs            máy chủ tĩnh để chạy trên máy
├── anh/                       ảnh chụp từ chính ứng dụng
└── vendor/three/              three.module.js, three.core.js và addon (OrbitControls, CSS2DRenderer,
                               RoomEnvironment, RoundedBoxGeometry, BufferGeometryUtils) bản 0.186.1
```

## Muốn sửa gì thì sửa ở đâu

| Muốn thay đổi | Tệp | Ghi chú |
|---|---|---|
| Vị trí thiết bị, góc quay | `js/cau-hinh.js` → `VI_TRI` | Sau khi dời, xem lại điểm gấp khúc trong `js/duong-ong.js` rồi chạy kiểm tra (mục bên dưới) |
| Cỡ ống, chiều dày bảo ôn, cao độ tuyến trên cao | `js/cau-hinh.js` → `ONG`, `CAO_DO` | |
| Màu chú giải các lưu chất | `js/cau-hinh.js` → `MAU` | Dùng chung cho ống, hạt, mũi tên, nhãn, bảng chú giải |
| Màu và độ nhám vật liệu | `js/vat-lieu.js` → `taoVatLieu()` | |
| Hình dạng, kích thước từng thiết bị | `js/thiet-bi/*.js` | Hằng số kích thước ở đầu mỗi tệp (`E`, `C` cho hai bình, `THAP`, `AHU`, `BGN`) |
| Tuyến ống nước, vị trí van, đồng hồ | `js/duong-ong.js` → `dinhNghiaTuyenNuoc()` | Mỗi tuyến: danh sách điểm vuông góc, `pk` là phụ kiện đặt theo độ dài `s` hoặc điểm `p` |
| Tuyến ống môi chất | `js/thiet-bi/chiller.js` → `tuyenMoiChat` | |
| Giá đỡ ống | `js/duong-ong.js` → `dinhNghiaGiaDo()` | |
| Thông số thiết kế (công suất, lưu lượng, bầu ướt, cột áp…) | `js/mo-hinh-nhiet.js` → `THIET_KE` | |
| Ngưỡng liên động, bảo vệ, trình tự | `js/van-hanh.js` → `NGUONG`, `buoc()` | |
| Tên, chức năng, cấu tạo hiển thị khi chọn | đối số `dangKy(...)` trong tệp dựng thiết bị | |
| Góc nhìn mặc định | `js/cau-hinh.js` → `CAMERA`; góc phóng gần từng thiết bị ở `GOC_TB` trong `js/giao-dien.js` | |

Mô hình nhiệt dùng cân bằng năng lượng gộp cho từng mạch nước, hiệu suất tháp so với nhiệt độ bầu ướt, độ chênh tiếp cận cho nhiệt độ bay hơi/ngưng và bảng áp suất bão hòa R134a. Tệp này không phụ thuộc Three.js nên có thể thay bằng mô hình chi tiết hơn mà không đụng phần dựng hình: chỉ cần giữ đầu vào/đầu ra của `buocNhiet()` và `daiLuongPhu()`.

## Kiểm tra

```bash
cd mo-phong-chiller
node --test kiem-thu/*.test.mjs            # mô hình nhiệt, liên động lưu lượng, bảo vệ áp suất
node kiem-thu/kiem-tra-trinh-duyet.mjs     # cần gói playwright và Chromium; ghi ảnh vào anh/
```

Trong trình duyệt có thể gọi `window.__moPhong.kiemTra()` ở console để kiểm tra đầu ống và va chạm sau khi sửa tuyến ống.

## Hiệu năng

- Bu lông, ống trao đổi nhiệt, lá tản nhiệt coil, cánh tản nhiệt động cơ, tấm khối đệm, thanh chớp, hạt nước dùng `InstancedMesh`; geometry dùng chung qua bộ nhớ đệm `dungChung()`.
- Sau khi dựng, các mesh tĩnh cùng vật liệu trong cùng nhóm được gộp lại (`gopTinh()`), chi tiết nhỏ không đổ bóng.
- Mọi chuyển động nhân với delta time. Chế độ tiết kiệm tắt bóng đổ, giảm độ phân giải và mật độ hạt.

## Ảnh chụp từ ứng dụng

Ảnh trong `anh/` do `kiem-thu/kiem-tra-trinh-duyet.mjs` chụp từ chính ứng dụng đang chạy:

| Ảnh | Nội dung |
|---|---|
| `01-tong-the-luc-dung.jpg` | Góc tổng thể 35°, hệ đang dừng |
| `02-tong-the-dang-chay.jpg` | Góc tổng thể khi chạy, nhãn nhiệt độ trên ống |
| `03-xem-dong-chay.jpg` | Ống trong suốt, hạt chảy theo ba mạch |
| `04-mat-cat-binh-bay-hoi-may-nen.jpg` | Cắt bình bay hơi: nước trong ống, môi chất sôi quanh ống, bọt hơi |
| `05-may-nen-cap-rotor.jpg` | Cắt máy nén: động cơ, cặp rotor xoắn, ổ bi, van trượt |
| `06-mat-cat-binh-ngung.jpg` | Cắt bình ngưng nhìn từ phía sau |
| `07-bom-banh-cong-tac.jpg` | Cắt thân bơm thấy bánh công tác |
| `08-thao-nap-hop-nuoc.jpg` | Tháo nắp hộp nước: tấm chia pass, mặt sàng, miệng ống |
| `09-thap-giai-nhiet-ben-trong.jpg` | Ẩn một phần vỏ tháp: khối đệm, vòi phun, nước rơi, gió đi lên |
| `10-ahu-duong-di-khong-khi.jpg` | Ẩn vỏ AHU: lọc, coil, khay nước ngưng, hạt gió đổi màu sau coil |
| `11-chiller-an-vo.jpg` | Ẩn vỏ chiller: hai bó ống, rotor, động cơ |
| `12-chon-thiet-bi.jpg` | Chọn thiết bị bằng chuột: tô sáng và thẻ thông tin |
| `13-dien-thoai.jpg` | Bố cục màn hình điện thoại 400 px |

## Kết quả kiểm tra ngày 22/10/2026

**Đã kiểm tra** (Chromium qua Playwright, đồ họa phần mềm SwiftShader, cửa sổ 1360×820 và 400×860; chi tiết trong `kiem-thu/ket-qua-trinh-duyet.json`), 20/20 mục đạt:

- Mô hình thực sự hiển thị trên canvas WebGL; Three.js và addon cùng bản 0.186.1.
- 13 đầu ống khớp vị trí và hướng với đầu nối thiết bị; các tuyến nối liền ở tê bypass, van ba ngả, van tiết lưu, tê bình giãn nở; mỗi tuyến chỉ chứa lưu chất của mạch mình; 17 tuyến ống không xuyên thân thiết bị và không chạm nhau.
- Khi dừng: rotor, bánh công tác, quạt đứng yên. Khi chạy: rotor đực và cái quay ăn khớp đúng tỉ số −4:6; bánh công tác hai bơm, quạt tháp, quạt AHU quay.
- Hạt dòng chảy nằm đúng trên đường tâm tuyến ống và chuyển động; khi dừng bơm nước lạnh, hạt mạch nước lạnh và rotor dừng, mạch giải nhiệt vẫn chảy.
- Máy nén không chạy khi chưa có lưu lượng và giao diện giải thích trạng thái chờ; dừng khi mất lưu lượng, tự chạy lại khi có lưu lượng.
- Mặt cắt bình bay hơi, bình ngưng, máy nén, bơm; ẩn vỏ chiller, tháp, AHU; tháo nắp hộp nước.
- Chọn tháp và máy nén bằng chuột: bộ phận được tô sáng, thẻ hiện tên và chức năng.
- Bố cục 400 px không tràn ngang; không có lỗi JavaScript.
- `node --test kiem-thu/*.test.mjs`: 7/7 đạt (bảng R134a, đầy tải 7/12 °C và 30/35 °C, cân bằng năng lượng, non tải, liên động lưu lượng, tốc độ bơm thấp, quạt tháp dừng gây tăng áp ngưng và đặt lại).

**Chưa xác minh**:

- Chưa chạy trên card đồ họa thật hay máy tính phổ thông. Trong Chromium dùng đồ họa phần mềm đo được khoảng 16 khung/giây ở cửa sổ 1000×700; mỗi khung khoảng 1.100 lần vẽ và 630 nghìn tam giác (kể cả lượt bóng).
- Chưa thử thao tác cảm ứng trên thiết bị thật (OrbitControls hỗ trợ sẵn; mới kiểm tra bố cục điện thoại).
- Chưa thử Firefox và Safari.
- Phông Be Vietnam Pro và IBM Plex Mono tải từ Google Fonts; môi trường kiểm thử chặn mạng ngoài nên ảnh chụp dùng phông dự phòng của hệ thống.
- Thông số nhiệt là giả lập minh họa, chưa đối chiếu với số liệu của nhà sản xuất nào.
