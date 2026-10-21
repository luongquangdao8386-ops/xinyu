// Nội dung Nền phát âm (việc A4): bài PA01–PA08 theo docs/lo-trinh-hsk1.md.
// Điền vào Google Sheet bằng: node tools/dien-noi-dung.mjs <nguồn Sheet>. Dòng mới vào Sheet ở trạng thái “nháp”.
// Mỗi tab: các dòng ghi theo tên trường JSON của tools/lib/cau-truc.mjs; danh sách viết dạng mảng.

const NGAY = '21/10/2026';

// ---------- Bài: điền các cột còn trống của PA01–PA08 ----------
const bai = (ma, hoatDong, dangThi, tieuChi, loiThuongGap) => ({ ma, hoatDong, dangThi, tieuChi, loiThuongGap, phienBan: '1', ngayCapNhat: NGAY });
const KHONG_THI = 'Không có dạng câu hỏi thi riêng; là nền cho mọi câu nghe';

const Bai = [
  bai(
    'PA01',
    'Nghe mẫu từng thanh; đọc theo bốn thanh trên mā má mǎ mà; nghe chọn thanh; ghi âm, nghe lại và so với mẫu (12).',
    KHONG_THI,
    'Nghe nhận ra thanh của âm tiết đơn; đọc liền được bốn thanh trên một âm tiết; đọc được dấu thanh trong Pinyin.',
    'Thanh 1 đọc thấp như thanh ngang tiếng Việt; thanh 3 đọc như dấu hỏi; thanh 4 đọc như dấu huyền.',
  ),
  bai(
    'PA02',
    'Nghe và nhại 11 âm đầu; luyện ba cặp b–p, d–t, g–k với tờ giấy trước miệng; nghe chọn âm tiết.',
    KHONG_THI,
    'Nghe phân biệt được bā – pā, dà – tà, gē – kē; giấy rung khi đọc p, t, k và không rung khi đọc b, d, g.',
    'Đọc b, d, g như “b, đ, g” tiếng Việt; p, t, k không phả hơi; k đọc thành “kh”; h đọc nhẹ như “h” tiếng Việt.',
  ),
  bai(
    'PA03',
    'Nghe và nhại 10 âm đầu theo ba nhóm j q x – zh ch sh r – z c s; luyện zi ci si, zhi chi shi ri; nghe chọn âm tiết.',
    KHONG_THI,
    'Nghe phân biệt xī – shī – sī và jī – zhī – zī; đọc qī, cài, zài không theo mặt chữ tiếng Việt.',
    'q đọc thành “k”, c thành “c”, z thành “d”; zh ch sh r không uốn lưỡi; si, shi đọc thành “xi”.',
  ),
  bai(
    'PA04',
    'Nghe và nhại vần đơn, vần ghép; luyện e và ü; học cách viết y, w và ü bỏ hai chấm; nghe chọn âm tiết.',
    KHONG_THI,
    'Đọc đúng e, ü, iu, ui, üe, er; đọc được Pinyin có y, w và ju, qu, xu, yu.',
    'e đọc thành “e”; ü đọc thành “u”; iu, ui đọc theo mặt chữ, thiếu âm giữa.',
  ),
  bai(
    'PA05',
    'Nghe và nhại vần mũi; luyện các cặp -n – -ng; nghe chọn âm tiết.',
    KHONG_THI,
    'Nghe phân biệt an – ang, en – eng, in – ing; đọc ian gần “iên”, ong gần “ung”, üan gần “uyên”.',
    'ian đọc thành “i-an”; ong đọc như “ong” tiếng Việt (ngậm môi ở cuối); lẫn en – eng, in – ing.',
  ),
  bai(
    'PA06',
    'Luyện thanh điệu (47): nghe từ, chọn cặp thanh; nghe mẫu, ghi âm, nghe lại từng cặp trong 20 cặp.',
    KHONG_THI,
    'Nghe nhận đúng cặp thanh của các từ ví dụ; đọc liền 20 cặp, không ngắt giữa hai âm tiết.',
    'Đọc tách từng âm tiết; cặp 4-4 rơi hết cả hai lần; cặp 3-3 đọc đủ hai thanh 3; thanh nhẹ đọc đủ thanh.',
  ),
  bai(
    'PA07',
    'Nghe và đọc từ có thanh nhẹ, hai thanh 3 liền nhau, nửa thanh 3, 一, 不 và vần -r; chọn cách đọc đúng.',
    KHONG_THI,
    'Đọc đúng 你好, 谢谢, 老师, 一下, 一点儿, 不要, 对不起, 哪儿.',
    'Đọc thanh nhẹ đủ thanh gốc; lúc nào cũng đọc yī, bù; đọc -r thành một âm tiết riêng.',
  ),
  bai(
    'PA08',
    'Nghe và nhại bốn cặp chào hỏi (09A); đóng vai A – B (09B); nghe câu, chọn câu đáp.',
    'Nghe câu, chọn câu đáp; ghép câu với câu trả lời (phần đọc)',
    'Nói và đáp đúng sáu lời chào; nghe một lời chào và chọn đúng câu đáp.',
    'Đáp 谢谢 bằng 没关系 và đáp 对不起 bằng 不客气; đọc 不客气 thành bù kèqi; nói 你好老师 thay cho 老师好.',
  ),
];

// ---------- Mục phát âm ----------
// pa(mã, bài, loại, ký hiệu, cách đọc, so sánh với tiếng Việt, lỗi hay mắc, âm tiết ví dụ, chữ đọc mẫu, từ ví dụ)
const pa = (ma, loai, kyHieu, cachDoc, soSanh, loiHayMac, amTiet = [], chuDoc = [], viDu = []) => ({
  ma,
  bai: ma.slice(0, 4),
  loai,
  kyHieu,
  cachDoc,
  soSanh,
  loiHayMac,
  amTiet,
  chuDoc,
  viDu,
});

const PhatAm = [
  // PA01 — Bốn thanh điệu
  pa('PA01-01', 'thanh điệu', 'Thanh 1 (ā)', 'Giọng cao và giữ phẳng từ đầu đến cuối, kéo dài như hát một nốt cao. Ghi bằng dấu ngang trên nguyên âm.', 'Gần thanh ngang (không dấu) của tiếng Việt nhưng cao hơn rõ rệt.', 'Đọc thấp và thả lỏng như thanh ngang tiếng Việt, nghe mờ, không rõ thanh.', ['mā', 'bā', 'tā', 'yī'], ['妈', '八', '他', '一']),
  pa('PA01-02', 'thanh điệu', 'Thanh 2 (á)', 'Bắt đầu từ giọng trung bình rồi đi lên đều tới cao, như khi hỏi lại “Hả?”.', 'Gần dấu sắc nhưng dài hơn và đi lên từ từ, không ngắt giữa chừng.', 'Lên quá ngắn và gắt như dấu sắc; hoặc chùng xuống trước rồi mới lên, nghe thành thanh 3.', ['má', 'chá', 'rén', 'nián'], ['麻', '茶', '人', '年']),
  pa('PA01-03', 'thanh điệu', 'Thanh 3 (ǎ)', 'Bắt đầu hơi thấp, hạ xuống thấp nhất rồi mới lên lại. Đọc đủ khi đứng một mình hoặc cuối câu; đứng trước âm tiết khác thường chỉ đọc nửa đầu (bài PA07).', 'Gần dấu hỏi nhưng xuống thấp hơn và dài hơn; đoạn thấp mới là phần chính.', 'Đọc như dấu hỏi hoặc dấu ngã tiếng Việt, ngắn và có chỗ gãy; chỉ chú ý đoạn đi lên mà bỏ đoạn thấp.', ['mǎ', 'nǐ', 'hǎo', 'wǒ'], ['马', '你', '好', '我']),
  pa('PA01-04', 'thanh điệu', 'Thanh 4 (à)', 'Bắt đầu cao rồi rơi mạnh, nhanh xuống thấp, dứt khoát như khi ra lệnh “Đi!”.', 'Cùng hướng đi xuống với dấu huyền nhưng bắt đầu cao hơn nhiều, ngắn và mạnh hơn; không bị chặn ở cuối như dấu nặng.', 'Đọc như dấu huyền: bắt đầu thấp, đi ngang, kéo dài; hoặc như dấu nặng, tắc ở cuối.', ['mà', 'bà', 'shì', 'qù'], ['骂', '爸', '是', '去']),
  pa('PA01-05', 'thanh điệu', 'Một âm tiết, bốn thanh', 'Cùng một âm tiết, đổi thanh là đổi nghĩa: mā (妈, mẹ), má (麻, cây gai), mǎ (马, ngựa), mà (骂, mắng). Đọc liền bốn thanh trên cùng một âm tiết để tai quen với khoảng cách giữa các thanh.', 'Giống tiếng Việt: ma, má, mả, mạ là bốn từ khác nhau.', 'Đọc bốn thanh gần giống nhau vì giọng không đủ cao ở thanh 1 và đầu thanh 4.', ['mā', 'má', 'mǎ', 'mà'], ['妈', '麻', '马', '骂']),
  pa('PA01-06', 'quy tắc', 'Vị trí dấu thanh', 'Dấu thanh đặt trên nguyên âm chính: có a thì đặt trên a (hǎo, kuài); không có a thì đặt trên o hoặc e (duō, xiè); gặp iu, ui thì đặt trên chữ đứng sau (liù, guì). Dấu đặt trên i thì bỏ dấu chấm (nǐ). Thanh nhẹ không có dấu.', 'Như tiếng Việt, dấu ghi trên nguyên âm; khác ở chỗ mỗi âm tiết chỉ có một dấu thanh và chữ cái đọc khác chữ quốc ngữ.', 'Đọc chữ Pinyin như chữ quốc ngữ; xem cách đọc vần ở bài PA04, PA05.', ['hǎo', 'duō', 'xiè', 'liù', 'guì'], ['好', '多', '谢', '六', '贵']),

  // PA02 — Âm đầu (1)
  pa('PA02-01', 'âm đầu', 'b', 'Hai môi khép rồi bật ra nhẹ, không phả hơi, dây thanh không rung.', 'Không giống “b” tiếng Việt (có rung và hơi nuốt vào); gần “p” trong “pin” của tiếng Việt.', 'Đọc thành “b” tiếng Việt, nghe nặng và đục.', ['bā', 'bǐ', 'bù'], ['八', '笔', '不']),
  pa('PA02-02', 'âm đầu', 'p', 'Như b nhưng phả mạnh một luồng hơi khi mở môi; để tờ giấy trước miệng sẽ thấy giấy rung.', 'Tiếng Việt không có âm này; gần “p” kèm luồng hơi như trong tiếng Anh “pen”.', 'Không phả hơi nên người nghe nghe thành b: pā thành bā.', ['pā', 'pí', 'pǔ'], ['趴', '皮', '普']),
  pa('PA02-03', 'âm đầu', 'm', 'Hai môi khép, hơi ra đằng mũi.', 'Như “m” tiếng Việt.', 'Ít gặp lỗi.', ['mā', 'mǐ', 'mù'], ['妈', '米', '木']),
  pa('PA02-04', 'âm đầu', 'f', 'Răng trên chạm nhẹ môi dưới, hơi thoát qua khe.', 'Như “ph” tiếng Việt.', 'Ít gặp lỗi; nhớ fo đọc gần “phua”.', ['fā', 'fú', 'fàn'], ['发', '服', '饭']),
  pa('PA02-05', 'âm đầu', 'd', 'Đầu lưỡi chạm lợi trên rồi bật ra nhẹ, không phả hơi, dây thanh không rung.', 'Gần “t” tiếng Việt (ta, tô), không phải “đ”.', 'Đọc thành “đ” tiếng Việt, nghe nặng và đục: dà thành “đa”.', ['dà', 'dì', 'dú'], ['大', '地', '读']),
  pa('PA02-06', 'âm đầu', 't', 'Như d nhưng phả mạnh hơi.', 'Gần “th” tiếng Việt (tha, thu).', 'Đọc thành “t” tiếng Việt không phả hơi, người nghe nghe thành d: tā thành dā.', ['tā', 'tí', 'tǔ'], ['他', '题', '土']),
  pa('PA02-07', 'âm đầu', 'n', 'Đầu lưỡi chạm lợi trên, hơi ra đằng mũi.', 'Như “n” tiếng Việt.', 'Người quen nói lẫn n và l cần luyện cặp nǐ – lǐ.', ['ná', 'nǐ', 'nù'], ['拿', '你', '怒']),
  pa('PA02-08', 'âm đầu', 'l', 'Đầu lưỡi chạm lợi trên, hơi đi ra hai bên lưỡi.', 'Như “l” tiếng Việt.', 'Lẫn với n.', ['lā', 'lǐ', 'lù'], ['拉', '里', '路']),
  pa('PA02-09', 'âm đầu', 'g', 'Gốc lưỡi chạm vòm mềm rồi bật ra nhẹ, không phả hơi.', 'Gần “c/k” tiếng Việt (ca, ki), không phải “g”.', 'Đọc thành “g” tiếng Việt (ga): gē thành “gơ”.', ['gē', 'gǔ', 'gè'], ['哥', '古', '个']),
  pa('PA02-10', 'âm đầu', 'k', 'Như g nhưng phả mạnh hơi.', 'Gần “k” kèm luồng hơi mạnh; không phải “kh” tiếng Việt.', 'Đọc thành “kh” tiếng Việt: kě thành “khở”; hoặc không phả hơi nên nghe thành g.', ['kā', 'kě', 'kù'], ['咖', '可', '酷']),
  pa('PA02-11', 'âm đầu', 'h', 'Gốc lưỡi nâng gần vòm mềm, hơi cọ xát đi ra.', 'Gần “kh” tiếng Việt (khá), mạnh hơn “h” tiếng Việt.', 'Đọc nhẹ như “h” tiếng Việt (hà), nghe yếu và mờ.', ['hē', 'hú', 'hǎo'], ['喝', '湖', '好']),
  pa('PA02-12', 'quy tắc', 'Bật hơi: b–p, d–t, g–k', 'Ba cặp b–p, d–t, g–k chỉ khác nhau ở luồng hơi: chữ thứ hai phả hơi mạnh. Tiếng Trung không phân biệt âm rung và không rung dây thanh như tiếng Việt (b – p, đ – t); nghĩa đổi theo việc có phả hơi hay không.', 'Tiếng Việt có một cặp gần như vậy: t – th.', 'Đọc b, d, g theo kiểu “b, đ, g” tiếng Việt và p, t, k không phả hơi, nên không phân biệt được bā – pā, dù – tù.', ['bā', 'pā', 'dù', 'tù', 'gē', 'kē'], ['八', '趴', '度', '兔', '哥', '科']),

  // PA03 — Âm đầu (2)
  pa('PA03-01', 'âm đầu', 'j', 'Mặt lưỡi áp lên vòm cứng, môi dẹt như cười, bật ra nhẹ, không phả hơi. Chỉ đi với i và ü (ü viết thành u: ju).', 'Gần “ch” tiếng Việt (chi) nhưng mặt lưỡi rộng và mềm hơn.', 'Đọc thành “gi” hoặc “d” tiếng Việt: jī thành “di”.', ['jī', 'jiā', 'jǔ'], ['鸡', '家', '举']),
  pa('PA03-02', 'âm đầu', 'q', 'Như j nhưng phả mạnh hơi.', 'Tiếng Việt không có; nghe như “ch” kèm luồng hơi.', 'Đọc theo mặt chữ như “q” tiếng Việt: qī thành “ki”, qù thành “cu” hoặc “quy”. Lỗi rất hay gặp.', ['qī', 'qián', 'qù'], ['七', '钱', '去']),
  pa('PA03-03', 'âm đầu', 'x', 'Mặt lưỡi đến gần vòm cứng, hơi lướt qua khe hẹp, môi dẹt.', 'Gần “x” tiếng Việt (xi) nhưng mềm và nhẹ hơn, lưỡi để phẳng.', 'Đọc cong lưỡi như “s” giọng miền Trung, nghe thành sh.', ['xī', 'xiè', 'xué'], ['西', '谢', '学']),
  pa('PA03-04', 'âm đầu', 'zh', 'Đầu lưỡi cong lên chạm phần cứng phía sau lợi trên, bật ra nhẹ, không phả hơi.', 'Gần “tr” tiếng Việt khi đọc uốn lưỡi rõ (giọng miền Trung, miền Nam).', 'Đọc thành “ch” vì giọng Bắc không uốn lưỡi: zhè thành “chừa”.', ['zhè', 'zhōng', 'zhù'], ['这', '中', '住']),
  pa('PA03-05', 'âm đầu', 'ch', 'Như zh nhưng phả mạnh hơi.', 'Gần “tr” uốn lưỡi kèm luồng hơi.', 'Đọc thành “ch” tiếng Việt không phả hơi, nghe thành zh hoặc j.', ['chī', 'chá', 'chū'], ['吃', '茶', '出']),
  pa('PA03-06', 'âm đầu', 'sh', 'Đầu lưỡi cong lên gần vòm, hơi lướt qua khe.', 'Gần “s” uốn lưỡi (giọng miền Trung, miền Nam phân biệt s – x).', 'Đọc thành “x” tiếng Việt: shū thành “xu”.', ['shū', 'shì', 'shǎo'], ['书', '是', '少']),
  pa('PA03-07', 'âm đầu', 'r', 'Lưỡi cong như sh nhưng dây thanh rung; đầu lưỡi không rung.', 'Gần “r” uốn lưỡi nhẹ của giọng miền Nam; không rung lưỡi.', 'Đọc thành “d/gi” giọng Bắc (rè thành “dừa”), hoặc thành “l”.', ['rè', 'rén', 'ròu'], ['热', '人', '肉']),
  pa('PA03-08', 'âm đầu', 'z', 'Đầu lưỡi chạm sau răng cửa trên rồi bật ra kèm tiếng xì nhẹ, không phả hơi, như đọc liền “t” và “x”.', 'Tiếng Việt không có; gần “ts”. Không phải “d” tiếng Việt.', 'Đọc theo mặt chữ thành “d” giọng Bắc: zài thành “dai”.', ['zài', 'zǎo', 'zuò'], ['再', '早', '做']),
  pa('PA03-09', 'âm đầu', 'c', 'Như z nhưng phả mạnh hơi.', 'Gần “ts” kèm luồng hơi; không phải “c” tiếng Việt.', 'Đọc theo mặt chữ thành “c”: cài thành “cai”. Lỗi rất hay gặp.', ['cài', 'cóng', 'cuò'], ['菜', '从', '错']),
  pa('PA03-10', 'âm đầu', 's', 'Đầu lưỡi đến gần sau răng cửa trên, hơi lướt qua.', 'Gần “x” tiếng Việt (xa).', 'Đọc cong lưỡi như “s” giọng miền Trung, nghe thành sh.', ['sān', 'sì', 'suì'], ['三', '四', '岁']),
  pa('PA03-11', 'quy tắc', 'i sau z c s, zh ch sh r', 'Sau z c s và zh ch sh r, chữ i không đọc là “i” mà kéo dài chính âm đầu, miệng hơi mở, lưỡi giữ nguyên chỗ: nghe gần “ư”.', 'Gần vần “ư” tiếng Việt: sì gần “xư”, shì gần “sư” uốn lưỡi, rì gần “rư”.', 'Đọc thành “i”: sì thành “xi”, shì thành “si”, chī thành “chi”.', ['zì', 'cí', 'sì', 'zhī', 'chī', 'shí', 'rì'], ['字', '词', '四', '知', '吃', '十', '日']),
  pa('PA03-12', 'quy tắc', 'j q x – zh ch sh – z c s', 'Ba nhóm khác nhau ở chỗ đặt lưỡi: j q x dùng mặt lưỡi, môi dẹt; zh ch sh r cong đầu lưỡi lên; z c s để đầu lưỡi sau răng cửa. j q x chỉ đi với i, ü; hai nhóm kia không đi với i thật hay ü.', 'Giọng miền Trung, miền Nam phân biệt tr – ch, s – x giúp đọc nhóm zh ch sh dễ hơn.', 'Lẫn ba nhóm: xī – shī – sī, jī – zhī – zī.', ['xī', 'shī', 'sī', 'jī', 'zhī', 'zī'], ['西', '诗', '丝', '鸡', '知', '资']),

  // PA04 — Vần đơn và vần ghép
  pa('PA04-01', 'vần', 'a', 'Miệng mở to, lưỡi để thấp.', 'Như “a” tiếng Việt.', 'Ít gặp lỗi.', ['ā', 'bà', 'dà'], ['啊', '爸', '大']),
  pa('PA04-02', 'vần', 'o', 'Môi tròn, lưỡi hơi lùi; chỉ đi sau b p m f, và nghe như có chút “u” lướt trước: bō gần “pua”.', 'Gần “ô” tiếng Việt, môi tròn hơn.', 'Đọc thành “o” mở của tiếng Việt.', ['bō', 'pó', 'mō', 'fó'], ['波', '婆', '摸', '佛']),
  pa('PA04-03', 'vần', 'e', 'Miệng hơi mở, môi không tròn, lưỡi lùi về sau; giữ nguyên khẩu hình khi đọc.', 'Gần “ơ” tiếng Việt, hơi lẫn “ư”; không phải “e”.', 'Đọc theo mặt chữ thành “e” tiếng Việt: hē thành “khe”, gè thành “ghé”.', ['è', 'hē', 'kě', 'rè'], ['饿', '喝', '可', '热']),
  pa('PA04-04', 'vần', 'i', 'Môi dẹt, lưỡi nâng cao. Đứng đầu âm tiết viết yi.', 'Như “i” tiếng Việt.', 'Ít gặp lỗi; nhớ i sau z c s, zh ch sh r đọc khác (bài PA03).', ['yī', 'nǐ', 'mǐ'], ['一', '你', '米']),
  pa('PA04-05', 'vần', 'u', 'Môi tròn, chu ra. Đứng đầu âm tiết viết wu.', 'Như “u” tiếng Việt.', 'Ít gặp lỗi.', ['wǔ', 'bù', 'lù'], ['五', '不', '路']),
  pa('PA04-06', 'vần', 'ü', 'Lưỡi đặt như đọc i, môi tròn như đọc u, giữ cả hai cùng lúc, không trượt.', 'Tiếng Việt không có; gần “uy” nhưng đọc liền một âm, môi tròn suốt.', 'Đọc thành “u”, hoặc “uy” trượt hai nhịp.', ['nǚ', 'lǜ', 'yú', 'qù'], ['女', '绿', '鱼', '去']),
  pa('PA04-07', 'quy tắc', 'ü viết thành u', 'Sau j q x và y, ü viết bỏ hai chấm: ju, qu, xu, yu, jue, xue, yuan… nhưng vẫn đọc ü. Chỉ sau n, l mới giữ hai chấm để phân biệt: nǚ – nǔ, lǜ – lù.', 'Chữ u ở đây không đọc như “u” tiếng Việt.', 'Thấy chữ u sau j q x y lại đọc “u”: qù thành “cu”, yǔ thành “dủ”.', ['jù', 'qù', 'xū', 'yǔ'], ['句', '去', '需', '雨']),
  pa('PA04-08', 'vần', 'ai', 'Đọc a rồi lướt sang i.', 'Như “ai” tiếng Việt.', 'Ít gặp lỗi.', ['ài', 'lái', 'mǎi'], ['爱', '来', '买']),
  pa('PA04-09', 'vần', 'ei', 'Bắt đầu từ âm gần “ê” rồi lướt sang i.', 'Gần “ây” tiếng Việt: bēi gần “pây”, hēi gần “khây”.', 'Đọc theo mặt chữ thành “e-i” tách đôi.', ['bēi', 'fēi', 'hēi'], ['杯', '飞', '黑']),
  pa('PA04-10', 'vần', 'ao', 'Đọc a rồi lướt sang o, gần “u”.', 'Như “ao” tiếng Việt.', 'Ít gặp lỗi.', ['hǎo', 'lǎo', 'zǎo'], ['好', '老', '早']),
  pa('PA04-11', 'vần', 'ou', 'Bắt đầu từ âm gần “ơ” rồi lướt sang u.', 'Gần “âu” tiếng Việt: dōu gần “tâu”.', 'Đọc theo mặt chữ thành “ô-u”.', ['dōu', 'zǒu', 'ròu'], ['都', '走', '肉']),
  pa('PA04-12', 'vần', 'ia', 'i lướt nhanh sang a trong một nhịp. Đứng đầu âm tiết viết ya.', 'Gần “ia” tiếng Việt đọc liền một nhịp.', 'Đọc tách thành hai nhịp “i – a”.', ['jiā', 'xià', 'yā'], ['家', '下', '鸭']),
  pa('PA04-13', 'vần', 'ie', 'i lướt sang âm gần “ê”. Đứng đầu âm tiết viết ye.', 'Gần “iê” tiếng Việt: xiè gần “xiê”.', 'Đọc thành “i-e” hoặc “ia”.', ['xiè', 'jiě', 'yě'], ['谢', '姐', '也']),
  pa('PA04-14', 'vần', 'iao', 'Đọc liền i + ao trong một nhịp, miệng mở rộng ở giữa. Đứng đầu âm tiết viết yao.', 'Tiếng Việt không có vần này; gần “i-ao” đọc liền.', 'Bỏ mất i: jiào thành “chao”.', ['jiào', 'xiǎo', 'yào'], ['叫', '小', '要']),
  pa('PA04-15', 'vần', 'iu (iou)', 'Viết iu nhưng đọc là i + ou, giữa có âm gần “ơ”. Đứng đầu âm tiết viết you.', 'Gần “iêu” tiếng Việt: liù gần “liêu”, jiǔ gần “chiểu”.', 'Đọc theo mặt chữ thành “iu” tiếng Việt: liù thành “liu”.', ['liù', 'jiǔ', 'yǒu'], ['六', '九', '有']),
  pa('PA04-16', 'vần', 'ua', 'u lướt sang a. Đứng đầu âm tiết viết wa.', 'Gần “oa” tiếng Việt: huā gần “khoa”.', 'Ít gặp lỗi.', ['huā', 'guā', 'wà'], ['花', '瓜', '袜']),
  pa('PA04-17', 'vần', 'uo', 'u lướt sang o. Đứng đầu âm tiết viết wo.', 'Gần “ua” tiếng Việt: duō gần “tua”, wǒ gần “ủa”.', 'Đọc thành “ô” hoặc tách “u – o”.', ['duō', 'guó', 'wǒ'], ['多', '国', '我']),
  pa('PA04-18', 'vần', 'uai', 'u lướt sang ai. Đứng đầu âm tiết viết wai.', 'Gần “oai” tiếng Việt: kuài gần “khoai” (nhưng k phả hơi, không phải “kh”).', 'Ít gặp lỗi ở vần; hay sai ở âm đầu k.', ['kuài', 'wài', 'huài'], ['快', '外', '坏']),
  pa('PA04-19', 'vần', 'ui (uei)', 'Viết ui nhưng đọc là u + ei. Đứng đầu âm tiết viết wei.', 'Gần “uây” tiếng Việt: guì gần “quây”, duì gần “tuây”.', 'Đọc theo mặt chữ thành “ui” tiếng Việt: duì thành “tui”.', ['duì', 'guì', 'shuǐ', 'wèi'], ['对', '贵', '水', '位']),
  pa('PA04-20', 'vần', 'üe', 'ü lướt sang âm gần “ê”. Sau j q x viết ue, đứng đầu âm tiết viết yue.', 'Gần “uê” tiếng Việt nhưng môi tròn: xué gần “xuế”.', 'Không tròn môi, đọc thành “uê” hoặc “ue”.', ['xué', 'yuè', 'jué'], ['学', '月', '觉']),
  pa('PA04-21', 'vần', 'er', 'Đọc âm gần “ơ” rồi cong đầu lưỡi lên.', 'Gần “ơ” kèm uốn lưỡi, như “ơr”.', 'Đọc thành “ơ” không uốn lưỡi.', ['ér', 'èr', 'ěr'], ['儿', '二', '耳']),
  pa('PA04-22', 'quy tắc', 'y, w ở đầu âm tiết', 'Âm tiết bắt đầu bằng i, u, ü thì viết thêm hoặc đổi thành y, w: i → yi, ia → ya, ie → ye, iu → you; u → wu, ua → wa, uo → wo, ui → wei; ü → yu, üe → yue. y, w không phải âm đầu, đọc như vần đứng một mình.', 'Không đọc y như “d/gi” tiếng Việt.', 'Đọc yě thành “dể”, yào thành “dao”.', ['yě', 'yǒu', 'wǒ', 'wèi', 'yuè'], ['也', '有', '我', '位', '月']),

  // PA05 — Vần mũi
  pa('PA05-01', 'vần', 'an', 'a rồi kết thúc bằng n: đầu lưỡi chạm lợi trên.', 'Như “an” tiếng Việt.', 'Ít gặp lỗi.', ['sān', 'fàn', 'kàn'], ['三', '饭', '看']),
  pa('PA05-02', 'vần', 'en', 'Âm gần “ơ” ngắn rồi kết thúc bằng n.', 'Gần “ân” tiếng Việt: rén gần “rấn”, mén gần “mấn”.', 'Đọc theo mặt chữ thành “en”.', ['mén', 'rén', 'hěn'], ['门', '人', '很']),
  pa('PA05-03', 'vần', 'ang', 'a rồi kết thúc bằng ng: cuối lưỡi nâng lên chặn phía sau, miệng mở.', 'Như “ang” tiếng Việt.', 'Ít gặp lỗi.', ['máng', 'táng', 'shàng'], ['忙', '糖', '上']),
  pa('PA05-04', 'vần', 'eng', 'Âm gần “ơ” rồi kết thúc bằng ng.', 'Gần “âng” tiếng Việt: lěng gần “lẩng”.', 'Đọc thành “en” hoặc “eng” theo mặt chữ; lẫn với en.', ['lěng', 'péng', 'děng'], ['冷', '朋', '等']),
  pa('PA05-05', 'vần', 'ong', 'Môi tròn, kết thúc bằng ng, môi không khép lại ở cuối.', 'Gần “ung” tiếng Việt: dōng gần “tung”; không phải “ong”.', 'Đọc như “ong” tiếng Việt, ngậm môi ở cuối.', ['dōng', 'hóng', 'zhōng'], ['东', '红', '中']),
  pa('PA05-06', 'vần', 'ian', 'Viết ian nhưng đọc gần “iên”. Đứng đầu âm tiết viết yan.', 'Gần “iên” tiếng Việt: tiān gần “thiên”, qián gần “chiến” kèm hơi.', 'Đọc theo mặt chữ thành “i-an”.', ['tiān', 'qián', 'diàn'], ['天', '钱', '电']),
  pa('PA05-07', 'vần', 'in', 'i rồi kết thúc bằng n. Đứng đầu âm tiết viết yin.', 'Như “in” tiếng Việt.', 'Lẫn với ing.', ['nín', 'jīn', 'xīn'], ['您', '今', '新']),
  pa('PA05-08', 'vần', 'iang', 'i lướt sang ang trong một nhịp. Đứng đầu âm tiết viết yang.', 'Đọc liền “i-ang”, miệng mở rộng; không phải “iêng”.', 'Đọc thành “iêng” hoặc bỏ mất i.', ['liǎng', 'xiǎng', 'jiǎng'], ['两', '想', '讲']),
  pa('PA05-09', 'vần', 'ing', 'i rồi kết thúc bằng ng. Đứng đầu âm tiết viết ying.', 'Gần “inh” tiếng Việt: míng gần “minh”, tīng gần “thinh”.', 'Lẫn với in.', ['míng', 'tīng', 'xíng'], ['名', '听', '行']),
  pa('PA05-10', 'vần', 'iong', 'i lướt sang ong, môi tròn. Đứng đầu âm tiết viết yong.', 'Gần “iung” tiếng Việt.', 'Đọc thành “iong” ngậm môi.', ['xióng', 'yòng', 'qióng'], ['熊', '用', '穷']),
  pa('PA05-11', 'vần', 'uan', 'u lướt sang an. Đứng đầu âm tiết viết wan.', 'Gần “oan” tiếng Việt: huān gần “khoan”, duǎn gần “toản”.', 'Ít gặp lỗi.', ['wǎn', 'huán', 'duǎn'], ['晚', '还', '短']),
  pa('PA05-12', 'vần', 'un (uen)', 'Viết un nhưng đọc là u + en. Đứng đầu âm tiết viết wen.', 'Gần “uân” tiếng Việt: chūn gần “truân”, lùn gần “luận”.', 'Đọc theo mặt chữ thành “un”.', ['chūn', 'lùn', 'wèn'], ['春', '论', '问']),
  pa('PA05-13', 'vần', 'uang', 'u lướt sang ang. Đứng đầu âm tiết viết wang.', 'Gần “oang” tiếng Việt: huáng gần “khoàng”.', 'Ít gặp lỗi.', ['huáng', 'chuáng', 'wǎng'], ['黄', '床', '网']),
  pa('PA05-14', 'vần', 'üan', 'Sau j q x viết uan, đứng đầu âm tiết viết yuan, nhưng đọc là ü + an.', 'Gần “uyên” tiếng Việt: yuǎn gần “uyển”.', 'Đọc thành “oan”: yuǎn thành “doản”.', ['yuǎn', 'quán', 'xuǎn'], ['远', '全', '选']),
  pa('PA05-15', 'vần', 'ün', 'Sau j q x viết un, đứng đầu âm tiết viết yun, nhưng đọc là ü + n.', 'Gần “uyn” tiếng Việt: yún gần “uyn”.', 'Đọc thành “un”.', ['yún', 'jūn', 'qún'], ['云', '军', '群']),
  pa('PA05-16', 'quy tắc', '-n và -ng', 'Âm cuối -n: đầu lưỡi chạm lợi trên, miệng khép hơn. Âm cuối -ng: đầu lưỡi để thấp, cuối lưỡi nâng lên chặn phía sau, miệng mở. Ba cặp hay lẫn: an – ang, en – eng, in – ing.', 'Tiếng Việt có đủ -n và -ng: dựa vào cặp “ân – âng”, “in – inh” để phân biệt.', 'Lẫn en – eng, in – ing: mén – méng, xīn – xīng.', ['fàn', 'fàng', 'mén', 'méng', 'xīn', 'xīng'], ['饭', '放', '门', '萌', '新', '星']),

  // PA06 — 20 cặp thanh (từ ví dụ ở tab CapThanh)
  pa('PA06-01', 'quy tắc', 'Đọc liền hai âm tiết', 'Từ hai âm tiết đọc liền một hơi, âm tiết sau thường rõ hơn. Luyện 20 cặp thanh: 16 tổ hợp của bốn thanh và 4 tổ hợp có thanh nhẹ ở sau, mỗi cặp có từ ví dụ HSK 1. Thanh 3 đứng trước đọc nửa thanh hoặc đổi thành thanh 2 (bài PA07).', 'Giống tiếng Việt, hai âm tiết của một từ đọc liền, không ngắt.', 'Đọc tách từng âm tiết như đọc chữ rời; cặp 1-1 hạ thấp âm sau; cặp 4-4 rơi hết cả hai lần.'),
  pa('PA06-02', 'quy tắc', 'Năm mức cao độ', 'Chia giọng thành năm mức từ thấp (1) đến cao (5): thanh 1 là 55, thanh 2 là 35, thanh 3 là 214, thanh 4 là 51. Khi đọc liền, thanh 1 giữ ở mức 5 như nhau, thanh 4 luôn bắt đầu từ mức cao.', 'Giọng nói tiếng Việt thường thấp hơn: nâng cả giọng lên khi đọc thanh 1 và đầu thanh 4.', 'Thanh 1 ở âm tiết sau thấp hơn âm tiết đầu; thanh 4 bắt đầu thấp nên nghe như dấu huyền.'),

  // PA07 — Thanh nhẹ và biến điệu
  pa('PA07-01', 'thanh điệu', 'Thanh nhẹ', 'Âm tiết đọc ngắn, nhẹ, không ghi dấu thanh. Cao độ tùy âm tiết đứng trước: sau thanh 1, 2 ở mức vừa; sau thanh 3 cao hơn; sau thanh 4 thấp nhất.', 'Giống cách nói lướt chữ thứ hai khi nói nhanh tiếng Việt, nhưng ở tiếng Trung đây là quy định, có ghi trong Pinyin.', 'Đọc đủ thanh gốc: māma thành “mā mā”, xièxie thành “xiè xiè”.', [], [], ['妈妈', '爸爸', '姐姐', '谢谢', '朋友']),
  pa('PA07-02', 'quy tắc', 'Thanh 3 + thanh 3', 'Hai thanh 3 đi liền thì thanh 3 đầu đọc thành thanh 2. Pinyin vẫn ghi dấu thanh 3: nǐ hǎo đọc là ní hǎo.', 'Tiếng Việt không có quy tắc này.', 'Đọc đủ cả hai thanh 3, nghe gãy và nặng; hoặc sửa luôn dấu trong Pinyin thành thanh 2.', [], [], ['你好', '水果', '可以']),
  pa('PA07-03', 'quy tắc', 'Nửa thanh 3', 'Thanh 3 đứng trước thanh 1, 2, 4 hoặc thanh nhẹ chỉ đọc nửa đầu: xuống thấp và giữ thấp, không lên lại.', 'Nửa thanh 3 gần dấu huyền tiếng Việt: lǎoshī đọc gần “lào sư”.', 'Đọc đủ thanh 3 có đoạn đi lên ở mọi chỗ, câu nghe lên xuống liên tục.', [], [], ['老师', '起床', '米饭']),
  pa('PA07-04', 'quy tắc', 'Biến điệu của 一', '一 đọc yī khi đứng một mình, khi đếm số, đọc số thứ tự, ngày tháng (第一, 一月). Trước thanh 4 đọc yí (一下 yíxià, 一半 yíbàn); trước thanh 1, 2, 3 đọc yì (一些 yìxiē, 一点儿 yìdiǎnr). Pinyin trong app ghi thanh đã biến.', 'Tiếng Việt không có quy tắc này.', 'Lúc nào cũng đọc yī; hoặc dùng yí và yì ngược nhau.', [], [], ['一', '一下', '一半', '一些', '一点儿']),
  pa('PA07-05', 'quy tắc', 'Biến điệu của 不', '不 đọc bù; trước thanh 4 đọc bú (不要 búyào, 不客气 bú kèqi). Đứng giữa từ hoặc giữa hai động từ thì đọc thanh nhẹ: 对不起 duìbuqǐ. Pinyin trong app ghi thanh đã biến.', 'Tiếng Việt không có quy tắc này.', 'Lúc nào cũng đọc bù: 不客气 thành bù kèqi.', [], [], ['不', '不要', '不客气', '对不起']),
  pa('PA07-06', 'quy tắc', 'Vần cuốn lưỡi -r', '儿 viết sau âm tiết khác thành -r: đọc âm tiết đó rồi cong đầu lưỡi lên ngay ở cuối, không đọc thành âm tiết riêng: nǎr (哪儿), zhèr (这儿), yìdiǎnr (一点儿).', 'Tiếng Việt không có; giống “r” cuối từ của tiếng Anh giọng Mỹ.', 'Đọc tách thành hai âm tiết “nǎ ér”, hoặc bỏ hẳn -r.', [], [], ['哪儿', '这儿', '那儿', '一点儿']),
];

// ---------- Cặp thanh (bài PA06, màn 47) ----------
const ct = (toHop, cachDoc, viDu) => ({ ma: `CT${toHop.replace('-', '')}`, toHop, cachDoc, viDu });
const CapThanh = [
  ct('1-1', 'Hai âm tiết cùng cao và phẳng; âm sau không hạ xuống.', ['今天', '星期']),
  ct('1-2', 'Giữ cao phẳng rồi âm sau đi lên từ mức trung.', ['中国', '中文']),
  ct('1-3', 'Giữ cao phẳng; âm sau đứng cuối nên đọc đủ thanh 3.', ['中午']),
  ct('1-4', 'Giữ cao phẳng rồi âm sau rơi mạnh từ mức cao.', ['高兴', '工作']),
  ct('1-0', 'Âm sau ngắn, nhẹ, thấp hơn âm đầu một chút.', ['妈妈', '哥哥']),
  ct('2-1', 'Đi lên rồi giữ cao phẳng.', ['明天', '时间']),
  ct('2-2', 'Đi lên hai lần; âm đầu lên ngắn hơn.', ['同学', '学习']),
  ct('2-3', 'Đi lên, rồi âm sau xuống thấp và lên lại.', ['苹果', '牛奶']),
  ct('2-4', 'Đi lên tới cao rồi rơi mạnh.', ['学校', '没事']),
  ct('2-0', 'Âm sau ngắn, nhẹ, ở mức vừa.', ['朋友', '名字']),
  ct('3-1', 'Âm đầu đọc nửa thanh 3 (xuống thấp, không lên), âm sau cao phẳng.', ['老师', '手机']),
  ct('3-2', 'Nửa thanh 3 rồi đi lên.', ['起床', '小时']),
  ct('3-3', 'Đọc thành 2-3: âm đầu đổi thành thanh 2, Pinyin vẫn ghi thanh 3.', ['你好', '水果']),
  ct('3-4', 'Nửa thanh 3 rồi rơi từ cao xuống.', ['米饭', '好看']),
  ct('3-0', 'Nửa thanh 3; âm sau nhẹ nhưng cao hơn âm đầu.', ['姐姐', '喜欢']),
  ct('4-1', 'Rơi xuống rồi âm sau bật lên cao phẳng.', ['面包', '上班']),
  ct('4-2', 'Rơi xuống rồi đi lên.', ['大学', '问题']),
  ct('4-3', 'Rơi xuống rồi âm sau xuống thấp, lên lại.', ['汉语', '电影']),
  ct('4-4', 'Âm đầu rơi nửa chừng, không xuống hết; âm sau rơi đủ.', ['再见', '电话']),
  ct('4-0', 'Âm sau ngắn, nhẹ, thấp nhất.', ['爸爸', '谢谢']),
];

// ---------- Từ: điền nghĩa các từ dùng ở Nền phát âm ----------
const tu = (chu, nghia, them = {}) => ({ tu: chu, nghia, ...them });
const cungNghia = (hanViet) => ({ hanViet, loaiHanViet: 'cùng nghĩa' });
const Tu = [
  tu('你好', 'xin chào', { cauViDu: ['CPA08-01'] }),
  tu('谢谢', 'cảm ơn', { cauViDu: ['CPA08-03'] }),
  tu('不客气', 'không có gì, đừng khách sáo (đáp lời cảm ơn)', { cauViDu: ['CPA08-04'] }),
  tu('对不起', 'xin lỗi', { cauViDu: ['CPA08-05'] }),
  tu('没关系', 'không sao, không có gì (đáp lời xin lỗi)', { cauViDu: ['CPA08-06'] }),
  tu('再见', 'tạm biệt, hẹn gặp lại', { cauViDu: ['CPA08-07'] }),
  tu('今天', 'hôm nay'),
  tu('星期', 'tuần; thứ (星期一: thứ Hai)'),
  tu('中国', 'Trung Quốc', cungNghia('Trung Quốc')),
  tu('中文', 'tiếng Trung (chữ và tiếng)', cungNghia('Trung văn')),
  tu('中午', 'buổi trưa'),
  tu('高兴', 'vui, vui mừng'),
  tu('工作', 'làm việc; công việc'),
  tu('妈妈', 'mẹ'),
  tu('哥哥', 'anh trai'),
  tu('明天', 'ngày mai'),
  tu('时间', 'thời gian', cungNghia('thời gian')),
  tu('同学', 'bạn học', cungNghia('đồng học')),
  tu('学习', 'học, học tập', cungNghia('học tập')),
  tu('苹果', 'quả táo'),
  tu('牛奶', 'sữa bò'),
  tu('学校', 'trường học'),
  tu('没事', 'không sao; không có việc gì'),
  tu('朋友', 'bạn, bạn bè'),
  tu('名字', 'tên'),
  tu('老师', 'thầy giáo, cô giáo'),
  tu('手机', 'điện thoại di động'),
  tu('起床', 'thức dậy, ra khỏi giường'),
  tu('小时', 'giờ, tiếng (đơn vị thời gian)'),
  tu('水果', 'hoa quả, trái cây'),
  tu('米饭', 'cơm'),
  tu('好看', 'đẹp; hay (phim, sách)'),
  tu('姐姐', 'chị gái'),
  tu('喜欢', 'thích'),
  tu('面包', 'bánh mì'),
  tu('上班', 'đi làm'),
  tu('大学', 'đại học', cungNghia('đại học')),
  tu('问题', 'câu hỏi; vấn đề', cungNghia('vấn đề')),
  tu('汉语', 'tiếng Hán, tiếng Trung', cungNghia('Hán ngữ')),
  tu('电影', 'phim, điện ảnh', cungNghia('điện ảnh')),
  tu('电话', 'điện thoại', cungNghia('điện thoại')),
  tu('爸爸', 'bố'),
  tu('可以', 'có thể, được'),
  tu('一', 'một'),
  tu('一下', 'một chút, một lát (sau động từ)'),
  tu('一半', 'một nửa'),
  tu('一些', 'một ít, một vài'),
  tu('一点儿', 'một chút, một ít'),
  tu('不', 'không'),
  tu('不要', 'đừng; không cần'),
  tu('哪儿', 'đâu, ở đâu'),
  tu('这儿', 'đây, chỗ này'),
  tu('那儿', 'đó, chỗ kia'),
];

// ---------- Ngữ pháp ----------
const NguPhap = [
  {
    ma: 'NP1-45',
    mauCau: '你好！ / 谢谢！ / 再见！',
    giaiThich: 'Câu không chủ vị (非主谓句): câu chỉ gồm một từ hoặc một cụm từ, không chia ra chủ ngữ và vị ngữ. Hay dùng để chào, cảm ơn, xin lỗi, gọi người hoặc cảm thán.',
    soSanh: 'Tiếng Việt cũng có loại câu này: “Chào bạn!”, “Cảm ơn!”, “Xin lỗi!”.',
    loiHayMac: 'Dịch “Chào thầy” thành 你好老师; người Trung Quốc nói 老师好 (người được chào đứng trước 好).',
    viDu: ['CPA08-01', 'CPA08-03', 'CPA08-07'],
  },
];

// ---------- Câu (bài PA08: bốn cặp chào hỏi, vai A – B) ----------
const cau = (ma, chuHan, pinyin, nghia, vai) => ({ ma, bai: 'PA08', chuHan, pinyin, nghia, vai });
const Cau = [
  cau('CPA08-01', '你好！', 'Nǐ hǎo!', 'Xin chào!', 'A'),
  cau('CPA08-02', '你好！', 'Nǐ hǎo!', 'Xin chào!', 'B'),
  cau('CPA08-03', '谢谢！', 'Xièxie!', 'Cảm ơn!', 'A'),
  cau('CPA08-04', '不客气。', 'Bú kèqi.', 'Không có gì.', 'B'),
  cau('CPA08-05', '对不起！', 'Duìbuqǐ!', 'Xin lỗi!', 'A'),
  cau('CPA08-06', '没关系。', 'Méi guānxi.', 'Không sao đâu.', 'B'),
  cau('CPA08-07', '再见！', 'Zàijiàn!', 'Tạm biệt!', 'A'),
  cau('CPA08-08', '再见！', 'Zàijiàn!', 'Tạm biệt!', 'B'),
];

// ---------- Câu hỏi ----------
// q(mã, dạng bài, kỹ năng, điểm kiến thức, nội dung, âm thanh, đáp án đúng, [[đáp án sai, nhầm với]…], lời giải)
const q = (ma, dangBai, kyNang, diemKienThuc, noiDung, amThanh, dapAnDung, sai, loiGiai) => {
  const o = { ma, bai: ma.slice(1, 5), dangBai, kyNang, diemKienThuc, noiDung, amThanh, dapAnDung, loiGiai };
  sai.forEach(([dapAn, nhamVoi], i) => Object.assign(o, { [`dapAnSai${i + 1}`]: dapAn, [`nhamVoi${i + 1}`]: nhamVoi }));
  return o;
};
const NGHE_AM = 'Nghe chọn âm tiết';
const NGHE_THANH = 'Nghe chọn thanh';
const NGHE_CT = 'Nghe chọn cặp thanh';
const DOC_PY = 'Đọc Pinyin';
const chonAm = 'Nghe và chọn âm tiết đúng.';
const chonThanh = 'Nghe và chọn thanh của âm tiết.';
const chonCt = 'Nghe từ và chọn cặp thanh.';

const CauHoi = [
  // PA01
  q('QPA01-01', NGHE_AM, 'nghe', ['PA01-05'], chonAm, 'mā', 'mā', [['má', 'Thanh 2 đi lên; thanh 1 giữ phẳng ở mức cao.'], ['mà', 'Thanh 4 rơi xuống từ mức cao.']], 'Giọng cao và phẳng từ đầu đến cuối là thanh 1.'),
  q('QPA01-02', NGHE_AM, 'nghe', ['PA01-05'], chonAm, 'mǎ', 'mǎ', [['mà', 'Thanh 4 rơi thẳng từ cao xuống; thanh 3 xuống thấp rồi lên.'], ['má', 'Thanh 2 lên đều; thanh 3 xuống thấp trước khi lên.']], 'Có đoạn xuống thấp nhất rồi lên lại là thanh 3.'),
  q('QPA01-03', NGHE_AM, 'nghe', ['PA01-05'], chonAm, 'má', 'má', [['mǎ', 'Chỉ nghe đoạn đi lên mà không để ý thanh 3 có đoạn xuống thấp trước.'], ['mā', 'Thanh 1 không đi lên.']], 'Đi lên đều từ mức trung tới cao là thanh 2.'),
  q('QPA01-04', NGHE_AM, 'nghe', ['PA01-05'], chonAm, 'mà', 'mà', [['mā', 'Thanh 4 bắt đầu cao nên dễ nhầm với thanh 1 nếu chỉ nghe đầu âm.'], ['mǎ', 'Thanh 3 xuống rồi lên; thanh 4 chỉ rơi xuống.']], 'Rơi mạnh từ cao xuống thấp là thanh 4.'),
  q('QPA01-05', NGHE_THANH, 'nghe', ['PA01-03'], chonThanh, 'nǐ', 'Thanh 3', [['Thanh 2', 'Chỉ nghe đoạn đi lên ở cuối.'], ['Thanh 4', 'Nghe đoạn đi xuống ở đầu.']], 'nǐ: xuống thấp rồi lên lại, thanh 3.'),
  q('QPA01-06', NGHE_THANH, 'nghe', ['PA01-04'], chonThanh, 'qù', 'Thanh 4', [['Thanh 1', 'Thanh 4 bắt đầu cao.'], ['Thanh 3', 'Thanh 3 có đoạn lên lại ở cuối.']], 'qù: rơi mạnh từ cao xuống, thanh 4.'),
  q('QPA01-07', NGHE_THANH, 'nghe', ['PA01-02'], chonThanh, 'chá', 'Thanh 2', [['Thanh 3', 'Thanh 3 xuống thấp trước khi lên.'], ['Thanh 1', 'Thanh 1 giữ phẳng.']], 'chá: đi lên đều, thanh 2.'),
  q('QPA01-08', NGHE_THANH, 'nghe', ['PA01-01'], chonThanh, 'yī', 'Thanh 1', [['Thanh 4', 'Đọc thấp và thả lỏng như thanh ngang tiếng Việt nghe giống thanh 4 nhẹ.'], ['Thanh 2', 'Thanh 2 đi lên.']], 'yī: cao và phẳng, thanh 1.'),
  q('QPA01-09', DOC_PY, 'đọc', ['PA01-03', 'PA01-06'], 'Âm tiết “hǎo” mang thanh mấy?', undefined, 'Thanh 3', [['Thanh 2', 'Nhầm dấu ˇ (thanh 3) với dấu ´ (thanh 2).'], ['Thanh 4', 'Dấu ` là thanh 4.']], 'Dấu ˇ là thanh 3.'),
  q('QPA01-10', DOC_PY, 'đọc', ['PA01-06'], 'Viết thanh 4 cho âm tiết “liu”, dấu đặt trên chữ nào?', undefined, 'u (liù)', [['i (lìu)', 'Với iu và ui, dấu đặt trên chữ đứng sau.']], 'Gặp iu, ui thì dấu đặt trên chữ đứng sau: liù, guì.'),

  // PA02
  q('QPA02-01', NGHE_AM, 'nghe', ['PA02-02', 'PA02-12'], chonAm, 'pā', 'pā', [['bā', 'b không phả hơi; p phả hơi mạnh.']], 'Có luồng hơi mạnh khi mở môi là p.'),
  q('QPA02-02', NGHE_AM, 'nghe', ['PA02-01', 'PA02-12'], chonAm, 'bā', 'bā', [['pā', 'b của tiếng Trung không rung, nghe gần “p” tiếng Việt, nhưng không phả hơi.']], 'Không có luồng hơi là b.'),
  q('QPA02-03', NGHE_AM, 'nghe', ['PA02-06', 'PA02-12'], chonAm, 'tā', 'tā', [['dā', 'd gần “t” tiếng Việt, không phả hơi; t gần “th”.']], 't phả hơi, gần “th” tiếng Việt.'),
  q('QPA02-04', NGHE_AM, 'nghe', ['PA02-05', 'PA02-12'], chonAm, 'dà', 'dà', [['tà', 't phả hơi mạnh; d thì không.']], 'd không phả hơi, gần “t” tiếng Việt.'),
  q('QPA02-05', NGHE_AM, 'nghe', ['PA02-10'], chonAm, 'kě', 'kě', [['gě', 'g không phả hơi; k phả hơi.']], 'k là “k” kèm luồng hơi, không phải “kh”.'),
  q('QPA02-06', NGHE_AM, 'nghe', ['PA02-11'], chonAm, 'hē', 'hē', [['kē', 'k là âm bật (tắc) kèm hơi; h là âm cọ xát, gần “kh” tiếng Việt.']], 'h gần “kh” tiếng Việt.'),
  q('QPA02-07', NGHE_AM, 'nghe', ['PA02-09', 'PA02-12'], chonAm, 'gē', 'gē', [['kē', 'k phả hơi; g thì không.']], 'g không phả hơi, gần “c/k” tiếng Việt.'),
  q('QPA02-08', NGHE_AM, 'nghe', ['PA02-07'], chonAm, 'nǐ', 'nǐ', [['lǐ', 'Lẫn n và l.']], 'n: hơi ra đằng mũi.'),
  q('QPA02-09', NGHE_AM, 'nghe', ['PA02-04'], chonAm, 'fā', 'fā', [['pā', 'p là hai môi khép rồi bật hơi; f là răng trên chạm môi dưới.']], 'f như “ph” tiếng Việt.'),

  // PA03
  q('QPA03-01', NGHE_AM, 'nghe', ['PA03-02'], chonAm, 'qī', 'qī', [['jī', 'j không phả hơi; q phả hơi.'], ['chī', 'ch cong đầu lưỡi; q dùng mặt lưỡi, môi dẹt.']], 'q: mặt lưỡi, phả hơi.'),
  q('QPA03-02', NGHE_AM, 'nghe', ['PA03-03', 'PA03-12'], chonAm, 'xī', 'xī', [['shī', 'sh cong đầu lưỡi.'], ['sī', 's để đầu lưỡi sau răng, và i sau s đọc gần “ư”.']], 'x: mặt lưỡi, môi dẹt, i đọc là “i”.'),
  q('QPA03-03', NGHE_AM, 'nghe', ['PA03-04'], chonAm, 'zhè', 'zhè', [['zè', 'z không cong lưỡi.'], ['chè', 'ch phả hơi; zh thì không.']], 'zh: cong lưỡi, không phả hơi.'),
  q('QPA03-04', NGHE_AM, 'nghe', ['PA03-09'], chonAm, 'cài', 'cài', [['zài', 'z không phả hơi; c phả hơi.'], ['gài', 'Đọc c theo mặt chữ tiếng Việt thành “c”.']], 'c gần “ts” kèm luồng hơi.'),
  q('QPA03-05', NGHE_AM, 'nghe', ['PA03-06', 'PA03-12'], chonAm, 'shū', 'shū', [['sū', 's không cong lưỡi.'], ['xū', 'x dùng mặt lưỡi và đi với ü, không đi với u.']], 'sh: cong lưỡi.'),
  q('QPA03-06', NGHE_AM, 'nghe', ['PA03-07'], chonAm, 'rè', 'rè', [['lè', 'Đọc r thành “l”.']], 'r: cong lưỡi như sh, có rung dây thanh.'),
  q('QPA03-07', NGHE_AM, 'nghe', ['PA03-11'], chonAm, 'sì', 'sì', [['shì', 'sh cong lưỡi.'], ['xì', 'i sau x đọc “i” thật; sau s đọc gần “ư”.']], 'sì gần “xư”.'),
  q('QPA03-08', NGHE_AM, 'nghe', ['PA03-08', 'PA03-11'], chonAm, 'zì', 'zì', [['jì', 'Đọc z như “ch” tiếng Việt; j dùng mặt lưỡi và i đọc “i” thật.'], ['zhì', 'zh cong lưỡi.']], 'zì: đầu lưỡi sau răng, i đọc gần “ư”.'),
  q('QPA03-09', DOC_PY, 'đọc', ['PA03-11'], 'Âm tiết nào có chữ i đọc gần “ư”?', undefined, 'shí', [['xī', 'i sau j q x đọc “i” thật.'], ['jī', 'i sau j q x đọc “i” thật.'], ['nǐ', 'i sau n đọc “i” thật.']], 'Chỉ sau z c s, zh ch sh r, chữ i mới đọc gần “ư”.'),

  // PA04
  q('QPA04-01', NGHE_AM, 'nghe', ['PA04-06'], chonAm, 'nǚ', 'nǚ', [['nǔ', 'u: môi tròn, lưỡi lùi; ü: môi tròn nhưng lưỡi đặt như i.']], 'ü giữ lưỡi như i và môi tròn như u.'),
  q('QPA04-02', NGHE_AM, 'nghe', ['PA04-06'], chonAm, 'lǜ', 'lǜ', [['lù', 'u và ü khác ở chỗ đặt lưỡi.']], 'Sau n, l giữ hai chấm để phân biệt ü với u.'),
  q('QPA04-03', NGHE_AM, 'nghe', ['PA04-03'], chonAm, 'hē', 'hē', [['hēi', 'ei lướt sang i, gần “ây”; e giữ nguyên khẩu hình, gần “ơ”.']], 'e gần “ơ”, giữ nguyên khẩu hình.'),
  q('QPA04-04', NGHE_AM, 'nghe', ['PA04-15'], chonAm, 'liù', 'liù', [['lì', 'Thiếu âm giữa: iu đọc gần “iêu”.'], ['lù', 'Bỏ mất i.']], 'liù gần “liêu”.'),
  q('QPA04-05', NGHE_AM, 'nghe', ['PA04-19'], chonAm, 'duì', 'duì', [['duò', 'uo gần “ua”; ui gần “uây”.']], 'duì gần “tuây”.'),
  q('QPA04-06', NGHE_AM, 'nghe', ['PA04-20'], chonAm, 'xué', 'xué', [['xié', 'ie môi dẹt; üe môi tròn.']], 'Sau x, chữ u là ü: xué đọc môi tròn.'),
  q('QPA04-07', DOC_PY, 'đọc', ['PA04-07'], 'Chữ u trong “qù” đọc là âm nào?', undefined, 'ü (môi tròn, lưỡi như i)', [['u như tiếng Việt', 'Sau j q x y, u là ü viết bỏ hai chấm.']], 'j q x y không đi với u; chữ u sau chúng luôn là ü.'),
  q('QPA04-08', NGHE_AM, 'nghe', ['PA04-11'], chonAm, 'dōu', 'dōu', [['duō', 'uo gần “ua”; ou gần “âu”.']], 'dōu gần “tâu”.'),
  q('QPA04-09', NGHE_AM, 'nghe', ['PA04-09'], chonAm, 'bēi', 'bēi', [['bāi', 'ai như “ai”; ei gần “ây”.']], 'bēi gần “pây”.'),
  q('QPA04-10', NGHE_AM, 'nghe', ['PA04-21'], chonAm, 'èr', 'èr', [['è', 'er cong lưỡi ở cuối.']], 'er: âm gần “ơ” rồi cong lưỡi.'),

  // PA05
  q('QPA05-01', NGHE_AM, 'nghe', ['PA05-16'], chonAm, 'mén', 'mén', [['méng', '-ng: cuối lưỡi chặn phía sau, miệng mở.']], '-n: đầu lưỡi chạm lợi trên.'),
  q('QPA05-02', NGHE_AM, 'nghe', ['PA05-16'], chonAm, 'xīng', 'xīng', [['xīn', '-n: đầu lưỡi chạm lợi trên; ing gần “inh”.']], 'xīng gần “xinh”.'),
  q('QPA05-03', NGHE_AM, 'nghe', ['PA05-06'], chonAm, 'tiān', 'tiān', [['tān', 'ian đọc gần “iên”, có i.']], 'tiān gần “thiên”.'),
  q('QPA05-04', NGHE_AM, 'nghe', ['PA05-05'], chonAm, 'dōng', 'dōng', [['dēng', 'eng gần “âng”; ong gần “ung”, môi tròn.']], 'dōng gần “tung”.'),
  q('QPA05-05', NGHE_AM, 'nghe', ['PA05-14'], chonAm, 'yuǎn', 'yuǎn', [['wǎn', 'uan gần “oan”; üan (viết yuan) gần “uyên”.']], 'yuǎn gần “uyển”.'),
  q('QPA05-06', NGHE_AM, 'nghe', ['PA05-12'], chonAm, 'chūn', 'chūn', [['chēn', 'un là cách viết gọn của uen: có âm u ở đầu vần.']], 'chūn gần “truân”.'),
  q('QPA05-07', NGHE_AM, 'nghe', ['PA05-16'], chonAm, 'fàng', 'fàng', [['fàn', 'an kết thúc bằng đầu lưỡi chạm lợi trên.']], 'ang: miệng mở, cuối lưỡi chặn phía sau.'),
  q('QPA05-08', NGHE_AM, 'nghe', ['PA05-09'], chonAm, 'míng', 'míng', [['mín', 'in: đầu lưỡi chạm lợi; ing gần “inh”.']], 'míng gần “minh”.'),

  // PA06
  q('QPA06-01', NGHE_CT, 'nghe', ['CT11', '今天'], chonCt, '今天', '1-1', [['1-4', 'Âm sau giữ cao phẳng, không rơi.']], 'jīntiān: hai thanh 1.'),
  q('QPA06-02', NGHE_CT, 'nghe', ['CT12', '中国'], chonCt, '中国', '1-2', [['1-3', 'Âm sau đi lên đều, không xuống thấp trước.']], 'Zhōngguó: thanh 1 + thanh 2.'),
  q('QPA06-03', NGHE_CT, 'nghe', ['CT21', '明天'], chonCt, '明天', '2-1', [['4-1', 'Thanh 2 đi lên; thanh 4 rơi xuống.']], 'míngtiān: thanh 2 + thanh 1.'),
  q('QPA06-04', NGHE_CT, 'nghe', ['CT31', '老师'], chonCt, '老师', '3-1', [['4-1', 'Nửa thanh 3 xuống thấp và giữ thấp; thanh 4 bắt đầu từ cao.'], ['2-1', 'Thanh 3 trước thanh 1 không đổi thành thanh 2.']], 'lǎoshī: nửa thanh 3 + thanh 1.'),
  q('QPA06-05', NGHE_CT, 'nghe', ['CT33', '你好'], chonCt, '你好', '3-3', [['2-3', 'Nghe đúng là 2-3 vì hai thanh 3 liền nhau thì thanh đầu đổi thành thanh 2, nhưng Pinyin và cặp thanh vẫn ghi 3-3.']], 'nǐ hǎo ghi 3-3, đọc thực tế 2-3.'),
  q('QPA06-06', NGHE_CT, 'nghe', ['CT43', '汉语'], chonCt, '汉语', '4-3', [['4-2', 'Âm sau xuống thấp trước khi lên.']], 'Hànyǔ: thanh 4 + thanh 3.'),
  q('QPA06-07', NGHE_CT, 'nghe', ['CT44', '再见'], chonCt, '再见', '4-4', [['4-1', 'Âm sau rơi xuống, không giữ phẳng.']], 'zàijiàn: hai thanh 4, thanh đầu rơi nửa chừng.'),
  q('QPA06-08', NGHE_CT, 'nghe', ['CT10', '妈妈'], chonCt, '妈妈', '1-0', [['1-1', 'Âm sau là thanh nhẹ: ngắn và nhẹ.']], 'māma: thanh 1 + thanh nhẹ.'),
  q('QPA06-09', NGHE_CT, 'nghe', ['CT22', '学习'], chonCt, '学习', '2-2', [['2-3', 'Âm sau đi lên đều, không xuống thấp trước.']], 'xuéxí: hai thanh 2.'),
  q('QPA06-10', NGHE_CT, 'nghe', ['CT34', '米饭'], chonCt, '米饭', '3-4', [['2-4', 'Thanh 3 trước thanh 4 chỉ đọc nửa (xuống thấp), không đi lên.']], 'mǐfàn: nửa thanh 3 + thanh 4.'),
  q('QPA06-11', NGHE_CT, 'nghe', ['CT20', '朋友'], chonCt, '朋友', '2-0', [['2-3', 'Âm sau là thanh nhẹ, ngắn, không có đoạn xuống thấp.']], 'péngyou: thanh 2 + thanh nhẹ.'),
  q('QPA06-12', NGHE_CT, 'nghe', ['CT41', '面包'], chonCt, '面包', '4-1', [['4-4', 'Âm sau giữ cao phẳng, không rơi.']], 'miànbāo: thanh 4 + thanh 1.'),

  // PA07
  q('QPA07-01', 'Chọn cách đọc', 'đọc', ['PA07-02', '你好'], '你好 (nǐ hǎo) đọc thực tế thế nào?', undefined, 'ní hǎo', [['nǐ hǎo, đủ hai thanh 3', 'Hai thanh 3 liền nhau thì thanh đầu đổi thành thanh 2.'], ['nǐ háo', 'Thanh đổi là thanh đầu, không phải thanh sau.']], 'Thanh 3 + thanh 3 đọc thành 2-3; Pinyin vẫn ghi nǐ hǎo.'),
  q('QPA07-02', 'Chọn cách đọc', 'đọc', ['PA07-04', '一下'], '一 trong 一下 đọc thanh mấy?', undefined, 'Thanh 2 (yí)', [['Thanh 1 (yī)', '一 chỉ giữ yī khi đứng một mình, đếm số, số thứ tự, ngày tháng.'], ['Thanh 4 (yì)', 'yì dùng trước thanh 1, 2, 3; 下 là thanh 4.']], '下 là thanh 4 nên 一 đọc yí: yíxià.'),
  q('QPA07-03', 'Chọn cách đọc', 'đọc', ['PA07-04', '一点儿'], '一 trong 一点儿 đọc thế nào?', undefined, 'yì', [['yí', 'yí chỉ dùng trước thanh 4; 点 là thanh 3.'], ['yī', '一 ở đây không phải số đếm.']], '点 là thanh 3 nên 一 đọc yì: yìdiǎnr.'),
  q('QPA07-04', 'Chọn cách đọc', 'đọc', ['PA07-05', '不要'], '不 trong 不要 đọc thế nào?', undefined, 'bú', [['bù', 'Trước thanh 4, 不 đổi thành thanh 2.']], '要 là thanh 4 nên 不 đọc bú: búyào.'),
  q('QPA07-05', 'Nghe chọn Pinyin', 'nghe', ['PA07-01', '谢谢'], 'Nghe và chọn Pinyin đúng.', '谢谢', 'xièxie', [['xièxiè', 'Âm tiết sau là thanh nhẹ: ngắn, nhẹ, không có dấu.']], 'Âm tiết sau của 谢谢 là thanh nhẹ.'),
  q('QPA07-06', 'Nghe chọn Pinyin', 'nghe', ['PA07-05', '对不起'], 'Nghe và chọn Pinyin đúng.', '对不起', 'duìbuqǐ', [['duìbùqǐ', '不 đứng giữa từ đọc thanh nhẹ.']], '对不起: 不 giữa từ đọc nhẹ.'),
  q('QPA07-07', 'Nghe chọn Pinyin', 'nghe', ['PA07-06', '哪儿'], 'Nghe và chọn Pinyin đúng.', '哪儿', 'nǎr', [['nǎ ér', '-r không phải âm tiết riêng; chỉ cong lưỡi ở cuối.']], '哪儿 đọc một âm tiết nǎr.'),
  q('QPA07-08', 'Chọn cách đọc', 'đọc', ['PA07-03', '老师'], 'Thanh 3 trong 老师 (lǎoshī) đọc thế nào?', undefined, 'Nửa thanh 3: xuống thấp, không lên lại', [['Đủ thanh 3: xuống rồi lên', 'Chỉ đọc đủ thanh 3 khi đứng một mình hoặc cuối câu.'], ['Thanh 2', 'Chỉ đổi thành thanh 2 khi đứng trước một thanh 3 khác.']], 'Thanh 3 trước thanh 1 đọc nửa thanh, gần dấu huyền tiếng Việt.'),

  // PA08
  q('QPA08-01', 'Nghe câu chọn câu đáp', 'nghe', ['谢谢', '不客气'], 'Nghe câu và chọn câu đáp phù hợp.', 'CPA08-03', '不客气。', [['没关系。', '没关系 đáp lại lời xin lỗi.'], ['再见！', '再见 dùng khi chia tay.']], 'Đáp lời cảm ơn 谢谢 bằng 不客气.'),
  q('QPA08-02', 'Nghe câu chọn câu đáp', 'nghe', ['对不起', '没关系'], 'Nghe câu và chọn câu đáp phù hợp.', 'CPA08-05', '没关系。', [['不客气。', '不客气 đáp lại lời cảm ơn.'], ['你好！', '你好 dùng khi chào gặp mặt.']], 'Đáp lời xin lỗi 对不起 bằng 没关系.'),
  q('QPA08-03', 'Nghe câu chọn câu đáp', 'nghe', ['你好'], 'Nghe câu và chọn câu đáp phù hợp.', 'CPA08-01', '你好！', [['再见！', '再见 dùng khi chia tay.'], ['谢谢！', '谢谢 là cảm ơn.']], 'Chào lại bằng 你好.'),
  q('QPA08-04', 'Chọn câu đúng', 'đọc', ['对不起', '没关系'], 'Muốn xin lỗi, nói câu nào?', undefined, '对不起！', [['没关系。', '没关系 là câu đáp lại lời xin lỗi.'], ['谢谢！', '谢谢 là cảm ơn.']], '对不起: xin lỗi.'),
  q('QPA08-05', 'Chọn nghĩa', 'đọc', ['再见'], '再见 nghĩa là gì?', undefined, 'Tạm biệt', [['Xin chào', 'Xin chào là 你好.'], ['Cảm ơn', 'Cảm ơn là 谢谢.']], '再见: tạm biệt, hẹn gặp lại.'),
  q('QPA08-06', 'Nghe chọn Pinyin', 'nghe', ['PA07-05', '不客气'], 'Nghe và chọn Pinyin đúng.', '不客气', 'bú kèqi', [['bù kèqi', '不 trước thanh 4 đọc bú.']], '客 là thanh 4 nên 不 đọc bú.'),
];

export const NOI_DUNG = { Bai, PhatAm, CapThanh, Tu, NguPhap, Cau, CauHoi };
