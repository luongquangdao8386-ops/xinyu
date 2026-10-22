// Nội dung HSK 1, cụm “Tên, thông tin cá nhân, câu hỏi cơ bản” (việc A7.1): bài H1-01–H1-10 theo docs/lo-trinh-hsk1.md.
// Điền vào Google Sheet bằng: node tools/dien-noi-dung.mjs <nguồn Sheet>. Dòng mới vào Sheet ở trạng thái “nháp”.
// Mỗi tab: các dòng ghi theo tên trường JSON của tools/lib/cau-truc.mjs; danh sách viết dạng mảng.
// Từ đã có nghĩa ở a4-phat-am.mjs chỉ ghi thêm câu ví dụ và Hán Việt; công cụ gộp hai chỗ soạn.
// Âm Hán Việt theo từ điển Hán Việt (Thiều Chửu); bộ thủ theo Unihan (kRSKangXi), viết dạng giản thể; số nét theo
// dữ liệu Hanzi Writer.

const NGAY = '22/10/2026';

// ---------- Bài ----------
const bai = (ma, { chu, tenRieng, hoatDong, dangThi, tieuChi, loiThuongGap }) => ({ ma, chu, tenRieng, hoatDong, dangThi, tieuChi, loiThuongGap, phienBan: '1', ngayCapNhat: NGAY });
const hoatDong = (hoiThoai, mauCau) => `Nghe và đọc ${hoiThoai} (09); học từ (10); mẫu câu ${mauCau} (11); xem cách viết chữ (13); nhại theo và đóng vai A – B (09A, 09B); kiểm tra mục tiêu bài (42).`;

const Bai = [
  bai('H1-01', {
    chu: ['我', '你', '他', '她', '是', '人'],
    tenRieng: ['王明', '李月', '阮安', '越南'],
    hoatDong: hoatDong('hội thoại tự giới thiệu', 'A 是 B và đại từ nhân xưng'),
    dangThi: 'Nghe câu, chọn nghĩa đúng; đọc, chọn câu đúng',
    tieuChi: 'Tự giới thiệu tên và quốc tịch bằng 我是…; giới thiệu người khác bằng 他是…, 她是…; nghe phân biệt 我, 你, 他.',
    loiThuongGap: 'Tìm từ riêng cho “anh, chị, em” khi xưng hô thay vì dùng 我 – 你; viết lẫn 他 và 她; giữ thứ tự tiếng Việt, nói 人越南 thay cho 越南人.',
  }),
  bai('H1-02', {
    chu: ['叫', '什', '么', '名', '字', '您', '请', '问'],
    hoatDong: hoatDong('hội thoại hỏi tên', 'câu hỏi có 什么'),
    dangThi: 'Nghe câu hỏi, chọn câu đáp; chọn từ điền vào chỗ trống',
    tieuChi: 'Hỏi tên bằng 你叫什么名字？, hỏi lịch sự bằng 请问 và 您; trả lời bằng 我叫…',
    loiThuongGap: 'Thêm 吗 vào câu đã có 什么; đặt 什么 lên đầu câu; đọc 名字 với 字 đủ thanh 4.',
  }),
  bai('H1-03', {
    chu: ['吗', '不', '呢', '也', '们'],
    hoatDong: hoatDong('hội thoại hỏi có hay không', '吗, 不, 也, 们'),
    dangThi: 'Nghe câu, chọn nghĩa đúng; đọc câu hỏi, chọn câu trả lời',
    tieuChi: 'Hỏi có/không bằng 吗; trả lời 是 hoặc 不是; hỏi lại bằng 你呢？; dùng 也 đúng chỗ.',
    loiThuongGap: 'Đặt 不 hoặc 也 sau động từ (是不, 是也); đọc 不是 thành bù shì; dùng 吗 để hỏi lại thay cho 呢.',
  }),
  bai('H1-04', {
    chu: ['中', '国', '哪', '都'],
    hoatDong: hoatDong('hội thoại hỏi quốc tịch', '哪国人 và 都'),
    dangThi: 'Nghe câu hỏi, chọn câu đáp; đọc, chọn câu đúng',
    tieuChi: 'Hỏi và nói người nước nào bằng 你是哪国人？, 我是…人; nói “đều” bằng 都 sau chủ ngữ.',
    loiThuongGap: 'Nói 人中国 theo thứ tự tiếng Việt; đặt 都 trước chủ ngữ (都我们); thêm 吗 vào câu có 哪; đọc 哪 (nǎ) thành thanh 4.',
  }),
  bai('H1-05', {
    chu: ['学', '习', '汉', '语', '文', '说', '会'],
    hoatDong: hoatDong('hội thoại về việc học tiếng Trung', '会 + động từ'),
    dangThi: 'Nghe câu hỏi, chọn câu đáp; đọc, chọn câu đúng',
    tieuChi: 'Nói mình học gì bằng 我学…, 我学习…; hỏi và trả lời biết nói tiếng gì bằng 会说… 吗？, 会 / 不会.',
    loiThuongGap: 'Dịch “biết nói” thành 是说 hoặc đặt 会 sau động từ; trả lời câu hỏi có 会 bằng 是; đọc shuō thành suō.',
  }),
  bai('H1-06', {
    chu: ['老', '师', '生', '同', '大', '的'],
    tenRieng: ['张'],
    hoatDong: hoatDong('hội thoại giới thiệu thầy cô và bạn học', 'định ngữ và 的'),
    dangThi: 'Nghe câu, chọn nghĩa đúng; đọc, chọn cụm từ đúng',
    tieuChi: 'Nói của ai bằng …的…; giới thiệu thầy cô, bạn học: 她是我们的汉语老师, 他是我的同学.',
    loiThuongGap: 'Giữ thứ tự tiếng Việt: 老师的我 thay cho 我的老师, 学生中国 thay cho 中国学生; đọc 老师 với 老 thành thanh 2.',
  }),
  bai('H1-07', {
    chu: ['朋', '友', '认', '识', '很', '好', '高', '兴', '男', '女'],
    hoatDong: hoatDong('hội thoại làm quen', '很 + tính từ'),
    dangThi: 'Nghe câu, chọn câu đáp; đọc, chọn câu đúng',
    tieuChi: 'Nói 认识你很高兴 và đáp 我也很高兴; giới thiệu bạn bè: 他是我的好朋友.',
    loiThuongGap: 'Thêm 是 trước tính từ (我是很高兴); bỏ 很 trong câu khẳng định; hiểu 认识 theo Hán Việt “nhận thức”; dùng 男朋友 cho bạn nam bình thường.',
  }),
  bai('H1-08', {
    chu: ['谁', '这', '那', '个', '先', '士'],
    tenRieng: ['王', '李'],
    hoatDong: hoatDong('hội thoại hỏi người này, người kia là ai', '这, 那 và 谁'),
    dangThi: 'Nghe câu hỏi, chọn câu đáp; chọn từ điền vào chỗ trống',
    tieuChi: 'Hỏi 这是谁？, 那个人是谁？; trả lời bằng 这是…, 那是…; gọi lịch sự bằng 先生, 女士 sau họ.',
    loiThuongGap: 'Nói 人那个 theo thứ tự tiếng Việt; đọc lẫn 那 (nà) và 哪 (nǎ); đặt 先生 trước họ như “ông Vương”.',
  }),
  bai('H1-09', {
    chu: ['工', '作', '医', '公', '司', '做', '在'],
    hoatDong: hoatDong('hội thoại về nghề nghiệp', '在 + nơi chốn + động từ'),
    dangThi: 'Nghe câu hỏi, chọn câu đáp; nghe câu, chọn nghĩa đúng',
    tieuChi: 'Hỏi 你做什么工作？; nói nghề bằng 我是…; nói làm việc ở đâu bằng 我在…工作.',
    loiThuongGap: 'Giữ thứ tự tiếng Việt: 我工作在公司 thay cho 我在公司工作; dùng 是 thay cho 做 khi hỏi nghề (你是什么工作).',
  }),
  bai('H1-10', {
    chu: ['知', '道', '写', '能', '可', '以'],
    hoatDong: hoatDong('hội thoại trong giờ học chữ Hán', '可以, 能 và câu hỏi chính phản'),
    dangThi: 'Nghe câu hỏi, chọn câu đáp; chọn từ điền vào chỗ trống',
    tieuChi: 'Phân biệt 会 (biết làm), 知道 (biết một việc), 可以 (được phép); hỏi bằng 会不会, 是不是.',
    loiThuongGap: 'Dịch mọi chữ “biết” thành 知道; thêm 吗 sau câu hỏi chính phản (会不会写吗); đọc 不 trong 会不会 đủ thanh.',
  }),
];

// ---------- Câu: hội thoại của từng bài, vai A – B ----------
const Cau = [];
const hoiThoai = (maBai, dong) =>
  dong.forEach(([vai, chuHan, pinyin, nghia], i) => Cau.push({ ma: `C${maBai}-${String(i + 1).padStart(2, '0')}`, bai: maBai, chuHan, pinyin, nghia, vai }));

// H1-01: A là Vương Minh, B là Nguyễn An; A giới thiệu Lý Nguyệt.
hoiThoai('H1-01', [
  ['A', '你好！我是王明。', 'Nǐ hǎo! Wǒ shì Wáng Míng.', 'Xin chào! Tôi là Vương Minh.'],
  ['B', '你好！我是阮安。', 'Nǐ hǎo! Wǒ shì Ruǎn Ān.', 'Xin chào! Tôi là Nguyễn An.'],
  ['B', '我是越南人。', 'Wǒ shì Yuènánrén.', 'Tôi là người Việt Nam.'],
  ['A', '她是李月。', 'Tā shì Lǐ Yuè.', 'Cô ấy là Lý Nguyệt.'],
  ['B', '李月，你好！', 'Lǐ Yuè, nǐ hǎo!', 'Chào Lý Nguyệt!'],
  ['A', '李月，他是阮安。', 'Lǐ Yuè, tā shì Ruǎn Ān.', 'Lý Nguyệt, anh ấy là Nguyễn An.'],
  ['A', '他是越南人。', 'Tā shì Yuènánrén.', 'Anh ấy là người Việt Nam.'],
]);
// H1-02: A là Nguyễn An, B là Vương Minh.
hoiThoai('H1-02', [
  ['A', '你好！请问，你叫什么名字？', 'Nǐ hǎo! Qǐngwèn, nǐ jiào shénme míngzi?', 'Xin chào! Cho hỏi, bạn tên là gì?'],
  ['B', '我叫王明。', 'Wǒ jiào Wáng Míng.', 'Tôi tên là Vương Minh.'],
  ['B', '您叫什么名字？', 'Nín jiào shénme míngzi?', 'Anh tên là gì ạ?'],
  ['A', '我叫阮安。', 'Wǒ jiào Ruǎn Ān.', 'Tôi tên là Nguyễn An.'],
  ['A', '请问，她叫什么名字？', 'Qǐngwèn, tā jiào shénme míngzi?', 'Cho hỏi, cô ấy tên là gì?'],
  ['B', '她叫李月。', 'Tā jiào Lǐ Yuè.', 'Cô ấy tên là Lý Nguyệt.'],
  ['A', '谢谢！', 'Xièxie!', 'Cảm ơn!'],
  ['B', '不客气。', 'Bú kèqi.', 'Không có gì.'],
]);
// H1-03: A là Lý Nguyệt, B là Nguyễn An.
hoiThoai('H1-03', [
  ['A', '你好！你是阮安吗？', 'Nǐ hǎo! Nǐ shì Ruǎn Ān ma?', 'Chào bạn! Bạn là Nguyễn An à?'],
  ['B', '是，我是阮安。', 'Shì, wǒ shì Ruǎn Ān.', 'Vâng, tôi là Nguyễn An.'],
  ['B', '你呢？', 'Nǐ ne?', 'Còn bạn?'],
  ['A', '我是李月。', 'Wǒ shì Lǐ Yuè.', 'Tôi là Lý Nguyệt.'],
  ['A', '你们是越南人吗？', 'Nǐmen shì Yuènánrén ma?', 'Các bạn là người Việt Nam phải không?'],
  ['B', '是，我们是越南人。', 'Shì, wǒmen shì Yuènánrén.', 'Vâng, chúng tôi là người Việt Nam.'],
  ['B', '你也是越南人吗？', 'Nǐ yě shì Yuènánrén ma?', 'Bạn cũng là người Việt Nam à?'],
  ['A', '不，我不是越南人。', 'Bù, wǒ bú shì Yuènánrén.', 'Không, tôi không phải người Việt Nam.'],
  ['A', '王明也不是越南人。', 'Wáng Míng yě bú shì Yuènánrén.', 'Vương Minh cũng không phải người Việt Nam.'],
]);
// H1-04: A là Nguyễn An, B là Lý Nguyệt.
hoiThoai('H1-04', [
  ['A', '你是哪国人？', 'Nǐ shì nǎ guó rén?', 'Bạn là người nước nào?'],
  ['B', '我是中国人。', 'Wǒ shì Zhōngguórén.', 'Tôi là người Trung Quốc.'],
  ['B', '你是越南人吗？', 'Nǐ shì Yuènánrén ma?', 'Bạn là người Việt Nam phải không?'],
  ['A', '是，我是越南人。', 'Shì, wǒ shì Yuènánrén.', 'Vâng, tôi là người Việt Nam.'],
  ['A', '他们是哪国人？', 'Tāmen shì nǎ guó rén?', 'Họ là người nước nào?'],
  ['B', '他们是中国人。', 'Tāmen shì Zhōngguórén.', 'Họ là người Trung Quốc.'],
  ['A', '她们也是中国人吗？', 'Tāmen yě shì Zhōngguórén ma?', 'Các cô ấy cũng là người Trung Quốc à?'],
  ['B', '不是，她们都是越南人。', 'Bú shì, tāmen dōu shì Yuènánrén.', 'Không phải, các cô ấy đều là người Việt Nam.'],
  ['A', '我们都是越南人！', 'Wǒmen dōu shì Yuènánrén!', 'Chúng tôi đều là người Việt Nam!'],
]);
// H1-05: A là Vương Minh, B là Nguyễn An.
hoiThoai('H1-05', [
  ['A', '阮安，你学什么？', 'Ruǎn Ān, nǐ xué shénme?', 'Nguyễn An, bạn học gì?'],
  ['B', '我学汉语。', 'Wǒ xué Hànyǔ.', 'Tôi học tiếng Trung.'],
  ['A', '你会说汉语吗？', 'Nǐ huì shuō Hànyǔ ma?', 'Bạn biết nói tiếng Trung không?'],
  ['B', '会，我会说汉语。', 'Huì, wǒ huì shuō Hànyǔ.', 'Biết, tôi biết nói tiếng Trung.'],
  ['A', '你们都学习中文吗？', 'Nǐmen dōu xuéxí Zhōngwén ma?', 'Các bạn đều học tiếng Trung à?'],
  ['B', '是，我们都学习中文。', 'Shì, wǒmen dōu xuéxí Zhōngwén.', 'Vâng, chúng tôi đều học tiếng Trung.'],
  ['A', '他们会说汉语吗？', 'Tāmen huì shuō Hànyǔ ma?', 'Họ biết nói tiếng Trung không?'],
  ['B', '他们不会说。', 'Tāmen bú huì shuō.', 'Họ không biết nói.'],
]);
// H1-06: A là Vương Minh, B là Nguyễn An.
hoiThoai('H1-06', [
  ['A', '她是你们的老师吗？', 'Tā shì nǐmen de lǎoshī ma?', 'Cô ấy là cô giáo của các bạn à?'],
  ['B', '是，她是我们的汉语老师。', 'Shì, tā shì wǒmen de Hànyǔ lǎoshī.', 'Vâng, cô ấy là cô giáo tiếng Trung của chúng tôi.'],
  ['B', '她是张老师。', 'Tā shì Zhāng lǎoshī.', 'Cô ấy là cô Trương.'],
  ['A', '你是大学生吗？', 'Nǐ shì dàxuéshēng ma?', 'Bạn là sinh viên à?'],
  ['B', '是，我是大学生。', 'Shì, wǒ shì dàxuéshēng.', 'Vâng, tôi là sinh viên.'],
  ['A', '他也是你们大学的学生吗？', 'Tā yě shì nǐmen dàxué de xuéshēng ma?', 'Anh ấy cũng là sinh viên trường các bạn à?'],
  ['B', '是，他是我的同学。', 'Shì, tā shì wǒ de tóngxué.', 'Vâng, anh ấy là bạn học của tôi.'],
  ['B', '他是中国学生。', 'Tā shì Zhōngguó xuéshēng.', 'Anh ấy là sinh viên Trung Quốc.'],
]);
// H1-07: A là Lý Nguyệt, B là Nguyễn An.
hoiThoai('H1-07', [
  ['A', '你好！我叫李月。', 'Nǐ hǎo! Wǒ jiào Lǐ Yuè.', 'Chào bạn! Mình tên là Lý Nguyệt.'],
  ['B', '你好！我叫阮安。', 'Nǐ hǎo! Wǒ jiào Ruǎn Ān.', 'Chào bạn! Mình tên là Nguyễn An.'],
  ['A', '认识你很高兴。', 'Rènshi nǐ hěn gāoxìng.', 'Rất vui được làm quen với bạn.'],
  ['B', '我也很高兴。', 'Wǒ yě hěn gāoxìng.', 'Mình cũng rất vui.'],
  ['B', '你认识王明吗？', 'Nǐ rènshi Wáng Míng ma?', 'Bạn có quen Vương Minh không?'],
  ['A', '认识，他是我的男朋友。', 'Rènshi, tā shì wǒ de nánpéngyou.', 'Có, anh ấy là bạn trai mình.'],
  ['B', '是吗？他是我的好朋友！', 'Shì ma? Tā shì wǒ de hǎo péngyou!', 'Thế à? Cậu ấy là bạn thân của mình!'],
  ['A', '很好！我们都是朋友。', 'Hěn hǎo! Wǒmen dōu shì péngyou.', 'Tốt quá! Chúng ta đều là bạn bè.'],
]);
// H1-08: A là Nguyễn An, B là Lý Nguyệt.
hoiThoai('H1-08', [
  ['A', '这是谁？', 'Zhè shì shéi?', 'Đây là ai?'],
  ['B', '这是王先生。', 'Zhè shì Wáng xiānsheng.', 'Đây là ông Vương.'],
  ['B', '他是我的汉语老师。', 'Tā shì wǒ de Hànyǔ lǎoshī.', 'Ông ấy là thầy giáo tiếng Trung của mình.'],
  ['A', '那是谁？', 'Nà shì shéi?', 'Kia là ai?'],
  ['B', '那是李女士。', 'Nà shì Lǐ nǚshì.', 'Kia là bà Lý.'],
  ['A', '那个人是谁？', 'Nàge rén shì shéi?', 'Người kia là ai?'],
  ['B', '那个人是我的同学。', 'Nàge rén shì wǒ de tóngxué.', 'Người kia là bạn học của mình.'],
  ['A', '这个人呢？', 'Zhège rén ne?', 'Còn người này?'],
  ['B', '这个人我不认识。', 'Zhège rén wǒ bú rènshi.', 'Người này mình không quen.'],
]);
// H1-09: A là Nguyễn An, B là Lý Nguyệt.
hoiThoai('H1-09', [
  ['A', '你做什么工作？', 'Nǐ zuò shénme gōngzuò?', 'Bạn làm nghề gì?'],
  ['B', '我是汉语老师。', 'Wǒ shì Hànyǔ lǎoshī.', 'Mình là giáo viên tiếng Trung.'],
  ['B', '你也是老师吗？', 'Nǐ yě shì lǎoshī ma?', 'Bạn cũng là giáo viên à?'],
  ['A', '不是，我在公司工作。', 'Bú shì, wǒ zài gōngsī gōngzuò.', 'Không phải, mình làm việc ở công ty.'],
  ['B', '你在中国公司工作吗？', 'Nǐ zài Zhōngguó gōngsī gōngzuò ma?', 'Bạn làm ở công ty Trung Quốc à?'],
  ['A', '不，我在越南公司工作。', 'Bù, wǒ zài Yuènán gōngsī gōngzuò.', 'Không, mình làm ở công ty Việt Nam.'],
  ['B', '你的女朋友也在公司工作吗？', 'Nǐ de nǚpéngyou yě zài gōngsī gōngzuò ma?', 'Bạn gái bạn cũng làm ở công ty à?'],
  ['A', '不，她是医生。', 'Bù, tā shì yīshēng.', 'Không, cô ấy là bác sĩ.'],
  ['B', '王明呢？', 'Wáng Míng ne?', 'Còn Vương Minh?'],
  ['A', '王明说他在中国公司工作。', 'Wáng Míng shuō tā zài Zhōngguó gōngsī gōngzuò.', 'Vương Minh nói anh ấy làm ở công ty Trung Quốc.'],
]);
// H1-10: A là cô Trương, B là Nguyễn An.
hoiThoai('H1-10', [
  ['A', '阮安，你会写汉字吗？', 'Ruǎn Ān, nǐ huì xiě Hànzì ma?', 'Nguyễn An, em biết viết chữ Hán không?'],
  ['B', '会，我会写汉字。', 'Huì, wǒ huì xiě Hànzì.', 'Dạ biết, em biết viết chữ Hán.'],
  ['A', '这个字你会不会写？', 'Zhège zì nǐ huì bu huì xiě?', 'Chữ này em có biết viết không?'],
  ['B', '这个字我不会写。', 'Zhège zì wǒ bú huì xiě.', 'Chữ này em không biết viết.'],
  ['A', '你知道这是什么字吗？', 'Nǐ zhīdào zhè shì shénme zì ma?', 'Em có biết đây là chữ gì không?'],
  ['B', '这是不是“国”字？', 'Zhè shì bu shì “guó” zì?', 'Đây có phải chữ “国” không ạ?'],
  ['A', '是，这是“国”字，中国的国。', 'Shì, zhè shì “guó” zì, Zhōngguó de guó.', 'Đúng, đây là chữ “国”, chữ 国 trong 中国.'],
  ['B', '老师，我能写吗？', 'Lǎoshī, wǒ néng xiě ma?', 'Thưa cô, em viết thử được không ạ?'],
  ['A', '可以。', 'Kěyǐ.', 'Được.'],
]);

// ---------- Từ ----------
const tu = (chu, nghia, them = {}) => ({ tu: chu, ...(nghia ? { nghia } : {}), ...them });
const vd = (...cauViDu) => ({ cauViDu });
const cungNghia = (hanViet, ...cauViDu) => ({ hanViet, loaiHanViet: 'cùng nghĩa', cauViDu });
const bayNghia = (hanViet, ...cauViDu) => ({ hanViet, loaiHanViet: 'bẫy nghĩa', cauViDu });

const Tu = [
  // H1-01
  tu('我', 'tôi, mình, tớ (ngôi thứ nhất)', vd('CH1-01-01')),
  tu('你', 'bạn, anh, chị… (ngôi thứ hai)', vd('CH1-01-05')),
  tu('他', 'anh ấy, ông ấy (nam; cũng dùng khi không rõ nam hay nữ)', vd('CH1-01-06')),
  tu('她', 'cô ấy, chị ấy, bà ấy', vd('CH1-01-04')),
  tu('是', 'là', vd('CH1-01-03')),
  tu('人', 'người', vd('CH1-01-03')),
  // H1-02
  tu('叫', 'gọi; tên là', vd('CH1-02-02')),
  tu('什么', 'gì, cái gì', vd('CH1-02-01')),
  tu('名字', undefined, vd('CH1-02-01')),
  tu('您', 'ông, bà, anh, chị… (cách gọi lịch sự của 你)', vd('CH1-02-03')),
  tu('请问', 'xin hỏi, cho hỏi', vd('CH1-02-05')),
  // H1-03
  tu('吗', 'không?, à? (trợ từ cuối câu hỏi có hay không)', vd('CH1-03-01')),
  tu('不', undefined, vd('CH1-03-08')),
  tu('呢', 'còn … thì sao? (trợ từ hỏi lại)', vd('CH1-03-03')),
  tu('也', 'cũng', vd('CH1-03-07')),
  tu('们', 'các, những (hậu tố số nhiều sau đại từ, danh từ chỉ người)', vd('CH1-03-05')),
  tu('我们', 'chúng tôi, chúng ta', vd('CH1-03-06')),
  tu('你们', 'các bạn, các anh chị', vd('CH1-03-05')),
  // H1-04
  tu('中国', undefined, vd('CH1-04-02')),
  tu('国', 'nước, quốc gia', vd('CH1-04-01')),
  tu('哪', 'nào', vd('CH1-04-01')),
  tu('他们', 'họ, các anh ấy', vd('CH1-04-06')),
  tu('她们', 'các cô ấy, các chị ấy', vd('CH1-04-08')),
  tu('都', 'đều, tất cả đều', vd('CH1-04-08')),
  // H1-05
  tu('学', 'học', vd('CH1-05-01')),
  tu('学习', undefined, vd('CH1-05-05')),
  tu('汉语', undefined, vd('CH1-05-02')),
  tu('中文', undefined, vd('CH1-05-06')),
  tu('说', 'nói', vd('CH1-05-03')),
  tu('会', 'biết (làm việc gì do học mà có)', { dongHinh: 1, ...vd('CH1-05-04') }),
  // H1-06
  tu('老师', undefined, vd('CH1-06-03')),
  tu('学生', 'học sinh, sinh viên', cungNghia('học sinh', 'CH1-06-08')),
  tu('同学', undefined, vd('CH1-06-07')),
  tu('大学', undefined, vd('CH1-06-06')),
  tu('大学生', 'sinh viên (đại học)', vd('CH1-06-04')),
  tu('的', 'của (trợ từ nối định ngữ với danh từ)', vd('CH1-06-02')),
  // H1-07
  tu('朋友', undefined, cungNghia('bằng hữu', 'CH1-07-08')),
  tu('认识', 'quen, quen biết (một người); nhận ra', bayNghia('nhận thức', 'CH1-07-03')),
  tu('很', 'rất (trước tính từ, thường đọc nhẹ)', vd('CH1-07-04')),
  tu('好', 'tốt, hay, khỏe', vd('CH1-07-08')),
  tu('高兴', undefined, vd('CH1-07-03')),
  tu('男朋友', 'bạn trai (người yêu)', vd('CH1-07-06')),
  tu('女朋友', 'bạn gái (người yêu)', vd('CH1-09-07')),
  // H1-08
  tu('谁', 'ai', vd('CH1-08-01')),
  tu('这', 'này, đây', vd('CH1-08-02')),
  tu('那', 'kia, đó', vd('CH1-08-05')),
  tu('这个', 'cái này, … này', vd('CH1-08-09')),
  tu('那个', 'cái kia, … kia', vd('CH1-08-07')),
  tu('先生', 'ông, anh (cách gọi lịch sự với nam giới, đặt sau họ)', bayNghia('tiên sinh', 'CH1-08-02')),
  tu('女士', 'bà, chị, cô (cách gọi lịch sự với phụ nữ, đặt sau họ)', bayNghia('nữ sĩ', 'CH1-08-05')),
  // H1-09
  tu('工作', undefined, cungNghia('công tác', 'CH1-09-01')),
  tu('医生', 'bác sĩ', vd('CH1-09-08')),
  tu('公司', 'công ty', cungNghia('công ty', 'CH1-09-04')),
  tu('做', 'làm', vd('CH1-09-01')),
  tu('在', 'ở, tại', vd('CH1-09-04')),
  tu('男', 'nam, (thuộc) đàn ông'),
  tu('女', 'nữ, (thuộc) phụ nữ'),
  // H1-10
  tu('知道', 'biết (một việc, một thông tin)', vd('CH1-10-05')),
  tu('汉字', 'chữ Hán', cungNghia('Hán tự', 'CH1-10-01')),
  tu('字', 'chữ', vd('CH1-10-03')),
  tu('写', 'viết', vd('CH1-10-04')),
  tu('能', 'có thể (có khả năng, điều kiện cho phép)', vd('CH1-10-08')),
  tu('可以', undefined, vd('CH1-10-09')),
];

// ---------- Chữ ----------
// ch(chữ, số nét, bộ thủ, tên bộ, cấu tạo, âm Hán Việt)
const ch = (chu, soNet, boThu, tenBo, cauTao, amHanViet) => ({ chu, soNet, boThu, tenBo, cauTao, amHanViet });
const Chu = [
  // H1-01
  ch('我', 7, '戈', 'qua', 'Gốc là hình một thứ binh khí (戈 là cây giáo), mượn để chỉ “tôi”.', 'ngã'),
  ch('你', 7, '亻', 'nhân đứng', '亻 (người) + 尔.', 'nễ'),
  ch('他', 5, '亻', 'nhân đứng', '亻 (người) + 也.', 'tha'),
  ch('她', 6, '女', 'nữ', '女 (phụ nữ) + 也: cùng âm tā với 他, bộ 女 chỉ người nữ.', 'tha'),
  ch('是', 9, '日', 'nhật', '日 ở trên.', 'thị'),
  ch('人', 2, '人', 'nhân', 'Hình người đứng, hai nét tựa vào nhau.', 'nhân'),
  // H1-02
  ch('叫', 5, '口', 'khẩu', '口 (miệng) + 丩: kêu, gọi.', 'khiếu'),
  ch('什', 4, '亻', 'nhân đứng', '亻 + 十.', 'thập'),
  ch('么', 3, '丿', 'phiệt', '丿 + 厶.', 'ma'),
  ch('名', 6, '口', 'khẩu', '夕 (buổi tối) + 口 (miệng): tối không nhìn thấy mặt nên phải xưng tên.', 'danh'),
  ch('字', 6, '子', 'tử', '宀 (mái nhà) + 子 (con).', 'tự'),
  ch('您', 11, '心', 'tâm', '你 + 心 (lòng): gọi “bạn” bằng cả tấm lòng kính trọng.', 'nâm'),
  ch('请', 10, '讠', 'ngôn', '讠 (lời nói) + 青 (gợi âm qīng).', 'thỉnh'),
  ch('问', 6, '门', 'môn', '门 (cửa) + 口 (miệng): đến cửa mở miệng hỏi.', 'vấn'),
  // H1-03
  ch('吗', 6, '口', 'khẩu', '口 + 马 (gợi âm mǎ).', 'ma'),
  ch('不', 4, '一', 'nhất', undefined, 'bất'),
  ch('呢', 8, '口', 'khẩu', '口 + 尼 (gợi âm ní).', 'ni'),
  ch('也', 3, '乙', 'ất', undefined, 'dã'),
  ch('们', 5, '亻', 'nhân đứng', '亻 (người) + 门 (gợi âm mén).', 'môn'),
  // H1-04
  ch('中', 4, '丨', 'cổn', 'Nét sổ đi qua giữa khung 口: ở giữa.', 'trung'),
  ch('国', 8, '囗', 'vi', '囗 (vòng bao quanh, biên giới) + 玉 (ngọc).', 'quốc'),
  ch('哪', 9, '口', 'khẩu', '口 + 那: thêm bộ 口 vào 那 (kia) thành chữ để hỏi.', 'na'),
  ch('都', 10, '阝', 'ấp', '者 + 阝 (bên phải là bộ ấp: thành, ấp).', 'đô'),
  // H1-05
  ch('学', 8, '子', 'tử', 'Đứa trẻ (子) dưới mái nhà (冖) học.', 'học'),
  ch('习', 3, '冫', 'băng', undefined, 'tập'),
  ch('汉', 5, '氵', 'ba chấm thủy', '氵 (nước: tên sông Hán) + 又.', 'hán'),
  ch('语', 9, '讠', 'ngôn', '讠 (lời nói) + 吾.', 'ngữ'),
  ch('文', 4, '文', 'văn', undefined, 'văn'),
  ch('说', 9, '讠', 'ngôn', '讠 (lời nói) + 兑.', 'thuyết'),
  ch('会', 6, '人', 'nhân', '人 + 云.', 'hội'),
  // H1-06
  ch('老', 6, '老', 'lão', undefined, 'lão'),
  ch('师', 6, '巾', 'cân', undefined, 'sư'),
  ch('生', 5, '生', 'sinh', 'Hình mầm cây mọc lên từ mặt đất.', 'sinh'),
  ch('同', 6, '口', 'khẩu', undefined, 'đồng'),
  ch('大', 3, '大', 'đại', 'Hình người dang rộng hai tay: to, lớn.', 'đại'),
  ch('的', 8, '白', 'bạch', '白 + 勺.', 'đích'),
  // H1-07
  ch('朋', 8, '月', 'nguyệt', 'Hai chữ 月 đứng cạnh nhau.', 'bằng'),
  ch('友', 4, '又', 'hựu', undefined, 'hữu'),
  ch('认', 4, '讠', 'ngôn', '讠 + 人.', 'nhận'),
  ch('识', 7, '讠', 'ngôn', '讠 + 只.', 'thức'),
  ch('很', 9, '彳', 'xích', '彳 + 艮.', 'ngận'),
  ch('好', 6, '女', 'nữ', '女 (phụ nữ) + 子 (con): có mẹ có con là tốt.', 'hảo'),
  ch('高', 10, '高', 'cao', 'Hình một ngôi lầu cao.', 'cao'),
  ch('兴', 6, '八', 'bát', undefined, 'hưng, hứng'),
  ch('男', 7, '田', 'điền', '田 (ruộng) + 力 (sức): người dùng sức làm ruộng.', 'nam'),
  ch('女', 3, '女', 'nữ', 'Hình người phụ nữ ngồi khoanh tay.', 'nữ'),
  // H1-08
  ch('谁', 10, '讠', 'ngôn', '讠 + 隹.', 'thùy'),
  ch('这', 7, '辶', 'sước (quai xước)', '辶 + 文.', 'giá'),
  ch('那', 6, '阝', 'ấp', undefined, 'na'),
  ch('个', 3, '丨', 'cổn', '人 + 丨.', 'cá'),
  ch('先', 6, '儿', 'nhân đi', undefined, 'tiên'),
  ch('士', 3, '士', 'sĩ', 'Khác 土 (đất): nét ngang trên của 士 dài hơn nét dưới.', 'sĩ'),
  // H1-09
  ch('工', 3, '工', 'công', undefined, 'công'),
  ch('作', 7, '亻', 'nhân đứng', '亻 (người) + 乍.', 'tác'),
  ch('医', 7, '匸', 'hễ', '匸 + 矢.', 'y'),
  ch('公', 4, '八', 'bát', '八 + 厶.', 'công'),
  ch('司', 5, '口', 'khẩu', undefined, 'ti'),
  ch('做', 11, '亻', 'nhân đứng', '亻 (người) + 故: người làm việc.', 'tố'),
  ch('在', 6, '土', 'thổ', undefined, 'tại'),
  // H1-10
  ch('知', 8, '矢', 'thỉ', '矢 (mũi tên) + 口 (miệng).', 'tri'),
  ch('道', 12, '辶', 'sước (quai xước)', '辶 (đi) + 首 (đầu): con đường.', 'đạo'),
  ch('写', 5, '冖', 'mịch', '冖 + 与.', 'tả'),
  ch('能', 10, '月', 'nhục', undefined, 'năng'),
  ch('可', 5, '口', 'khẩu', '丁 + 口.', 'khả'),
  ch('以', 4, '人', 'nhân', undefined, 'dĩ'),
];

// ---------- Ngữ pháp ----------
const np = (ma, mauCau, giaiThich, soSanh, loiHayMac, viDu) => ({ ma, mauCau, giaiThich, soSanh, loiHayMac, viDu });
const NguPhap = [
  // H1-01
  np(
    'NP1-09',
    '我 / 你 / 您 / 他 / 她 (+ 们)',
    'Đại từ nhân xưng (人称代词): 我 tôi, 你 bạn, 您 (lịch sự), 他 anh ấy, 她 cô ấy, 它 nó (con vật, đồ vật); thêm 们 thành số nhiều: 我们, 你们, 他们, 她们, 它们; 大家 là mọi người. Đại từ giữ nguyên ở mọi vị trí trong câu.',
    'Tiếng Việt xưng hô theo quan hệ (anh, chị, em, cô, cháu…); tiếng Trung chỉ dùng 我 và 你 cho mọi người, muốn lịch sự thì dùng 您. 他 và 她 đọc giống nhau (tā), chỉ khác chữ viết.',
    'Tìm từ riêng để dịch “anh, chị, em” khi xưng hô; viết lẫn 他 và 她; nói 您们 cho số nhiều (thường nói 你们).',
    ['CH1-01-01', 'CH1-01-04', 'CH1-01-06'],
  ),
  np(
    'NP1-52',
    'A 是 B',
    'Câu chữ 是 (“是”字句): A 是 B nói A là ai, là gì hoặc thuộc loại nào. Phủ định: A 不是 B (bài H1-03).',
    'Giống câu “A là B” của tiếng Việt, cùng thứ tự.',
    'Thêm 是 trước tính từ như chữ “là” (我是高兴): câu có tính từ không dùng 是 (bài H1-07).',
    ['CH1-01-01', 'CH1-01-03', 'CH1-01-04'],
  ),
  np(
    'NP1-35',
    'Chủ ngữ + vị ngữ',
    'Chủ ngữ (主语): danh từ, đại từ hoặc cụm danh từ đứng đầu câu, cho biết câu nói về ai, về cái gì.',
    'Như tiếng Việt: chủ ngữ đứng trước động từ.',
    'Ít gặp lỗi trật tự. Nhớ đại từ không đổi theo người nghe: 我 là “tôi”, “mình”, “em”, “con”… tùy người nói chuyện.',
    ['CH1-01-04', 'CH1-01-07'],
  ),
  np(
    'NP1-38',
    'Động từ + tân ngữ',
    'Tân ngữ (宾语): danh từ, đại từ hoặc cụm danh từ đứng sau động từ, chịu tác động của động từ: 是王明, 是越南人.',
    'Như tiếng Việt: tân ngữ đứng sau động từ.',
    'Ít gặp lỗi; chú ý trạng ngữ nơi chốn, thời gian không đứng sau tân ngữ như tiếng Việt (bài H1-09).',
    ['CH1-01-01', 'CH1-01-03'],
  ),
  np(
    'NP1-42',
    'Chủ ngữ + động từ (+ tân ngữ)',
    'Câu vị ngữ động từ (动词谓语句): vị ngữ là động từ hoặc cụm động từ. Đây là kiểu câu hay gặp nhất: 我是阮安, 我学汉语.',
    'Cùng thứ tự với tiếng Việt: Tôi là Nguyễn An.',
    'Bỏ động từ 是 khi nói “tôi người Việt Nam” theo văn nói tiếng Việt: tiếng Trung cần 我是越南人.',
    ['CH1-01-02', 'CH1-01-03'],
  ),
  np(
    'NP1-46',
    'Câu kể + 。',
    'Câu trần thuật (陈述句): câu kể, nói một việc hay một ý; cuối câu viết dấu chấm 。, giọng hạ xuống ở cuối.',
    'Giống câu kể của tiếng Việt. Dấu chấm tiếng Trung là vòng tròn nhỏ 。.',
    'Viết dấu chấm tròn (.) của tiếng Việt khi viết chữ Hán; lên giọng ở cuối câu kể như câu hỏi.',
    ['CH1-01-03', 'CH1-01-07'],
  ),
  // H1-02
  np(
    'NP1-48',
    '…什么…？',
    'Câu hỏi có đại từ nghi vấn (特指问句): đặt từ để hỏi (什么, 谁, 哪…) vào đúng chỗ của thông tin cần hỏi; cuối câu không thêm 吗.',
    'Giống tiếng Việt: “Bạn tên là gì?” — 你叫什么名字？ Từ để hỏi đứng đúng chỗ câu trả lời sẽ đứng.',
    'Thêm 吗 vào câu đã có 什么 (你叫什么名字吗？); đưa từ để hỏi lên đầu câu như tiếng Anh.',
    ['CH1-02-01', 'CH1-02-03', 'CH1-02-05'],
  ),
  np(
    'NP1-30',
    'Động từ + tân ngữ: 叫王明',
    'Cụm động tân (动宾短语): động từ đi với tân ngữ đứng sau thành một cụm: 叫王明, 叫什么名字, 学汉语.',
    'Cùng thứ tự với tiếng Việt: tên là Vương Minh, học tiếng Trung.',
    'Nói 我名字王明 theo kiểu “tôi tên Vương Minh”, thiếu động từ 叫: nói 我叫王明.',
    ['CH1-02-02', 'CH1-02-06'],
  ),
  // H1-03
  np(
    'NP1-47',
    '…吗？',
    'Câu hỏi có hay không (是非问句): thêm 吗 vào cuối câu kể. Trả lời 是 / 不是, hoặc lặp lại động từ: 会 / 不会.',
    '吗 giống “… không?”, “… à?”, “… phải không?” ở cuối câu tiếng Việt.',
    'Dùng 吗 trong câu đã có từ để hỏi; trả lời 是 cho mọi câu hỏi (你会说汉语吗？ nên trả lời 会).',
    ['CH1-03-01', 'CH1-03-05', 'CH1-03-07'],
  ),
  np(
    'NP1-20',
    '不 + động từ / tính từ',
    'Phó từ phủ định (否定副词): 不 đứng trước động từ hoặc tính từ để phủ định: 不是, 不会. Sau này học thêm 没（有） (bài H1-14) và 不要 (bài H1-48). 不 đọc bú trước thanh 4: 不是 bú shì.',
    'Giống “không” đặt trước động từ: không phải, không biết.',
    'Đặt 不 sau động từ (是不); đọc 不是 thành bù shì; trả lời câu hỏi chỉ bằng 不 mà không nói rõ (nên nói 不，我不是…).',
    ['CH1-03-08', 'CH1-03-09'],
  ),
  np(
    'NP1-19',
    'Chủ ngữ + 也 + động từ',
    'Phó từ liên kết 也 (关联副词): 也 “cũng” đứng sau chủ ngữ, trước động từ; với phủ định đứng trước 不: 也不是. Sau này học thêm 还 (bài H1-29).',
    'Giống “cũng” của tiếng Việt, cùng vị trí: Tôi cũng là…',
    'Đặt 也 sau động từ (我是也…); đặt 也 lên đầu câu; nói 不也是 thay cho 也不是.',
    ['CH1-03-07', 'CH1-03-09'],
  ),
  np(
    'NP1-02',
    'Đại từ / danh từ chỉ người + 们',
    'Hậu tố 们 (后缀): thêm sau đại từ hoặc danh từ chỉ người để chỉ số nhiều: 我们, 你们, 老师们, 同学们. 们 đọc thanh nhẹ. Sau này học thêm hậu tố 边 (bài H1-33).',
    'Giống “các, những” nhưng đứng sau: 你们 = các bạn.',
    'Thêm 们 sau danh từ chỉ đồ vật; dùng 们 khi đã có số lượng (三个学生, không nói 三个学生们).',
    ['CH1-03-05', 'CH1-03-06'],
  ),
  // H1-04
  np(
    'NP1-16',
    'Chủ ngữ số nhiều + 都 + động từ',
    'Phó từ phạm vi 都 (范围副词): 都 “đều” đứng sau chủ ngữ số nhiều, trước động từ: 我们都是越南人. Có 也 thì 也 đứng trước: 我们也都是越南人.',
    'Giống “đều” của tiếng Việt, cùng vị trí. “Tất cả chúng tôi” cũng nói 我们都是…',
    'Đặt 都 trước chủ ngữ theo kiểu “tất cả chúng tôi” (都我们是…); đặt 都 sau động từ (我们是都…).',
    ['CH1-04-08', 'CH1-04-09'],
  ),
  np(
    'NP1-29',
    'Phần bổ nghĩa + phần chính: 中国人',
    'Cụm chính phụ (偏正短语): phần bổ nghĩa đứng trước, phần chính đứng sau: 中国人, 哪国人, 汉语老师.',
    'Ngược với tiếng Việt: 中国人 là “người Trung Quốc”, 越南人 là “người Việt Nam”.',
    'Giữ thứ tự tiếng Việt: 人中国, 人越南.',
    ['CH1-04-01', 'CH1-04-02'],
  ),
  // H1-05
  np(
    'NP1-04',
    '会 + động từ',
    'Động từ năng nguyện 会, 能 (能愿动词): 会 + động từ là biết làm việc gì nhờ học mà có: 会说汉语, 会写汉字. Phủ định 不会. Trả lời câu hỏi có 会 bằng 会 hoặc 不会. 能 học ở bài H1-10.',
    'Giống “biết” trong “biết nói, biết bơi”. Tiếng Việt dùng một chữ “biết” cho cả 会 (biết làm), 知道 (biết một việc) và 认识 (quen người).',
    'Đặt 会 sau động từ (说会汉语); dùng 是 thay cho 会 (我是说汉语); trả lời 是 cho câu hỏi 你会…吗？',
    ['CH1-05-03', 'CH1-05-04', 'CH1-05-08'],
  ),
  // H1-06
  np(
    'NP1-24',
    'Định ngữ + 的 + danh từ',
    'Trợ từ kết cấu 的 (结构助词): nối định ngữ với danh từ đứng sau: 我的老师, 我们大学的学生. Quan hệ thân thiết, quen dùng thì thường bỏ 的: 我们老师; danh từ chỉ loại đứng trước không cần 的: 汉语老师.',
    '的 gần với “của” nhưng thứ tự ngược: 我的老师 là “thầy giáo của tôi”.',
    'Giữ thứ tự tiếng Việt: 老师的我; thêm 的 vào mọi chỗ (汉语的老师 nghe như “thầy giáo của tiếng Trung”).',
    ['CH1-06-01', 'CH1-06-02', 'CH1-06-07'],
  ),
  np(
    'NP1-39',
    'Định ngữ + danh từ: 汉语老师, 中国学生',
    'Định ngữ (定语): danh từ, cụm tính từ hoặc cụm số lượng đứng trước danh từ để bổ nghĩa: 汉语老师, 中国学生, 好朋友.',
    'Ngược với tiếng Việt: tiếng Việt nói “sinh viên Trung Quốc”, tiếng Trung nói 中国学生.',
    'Đặt định ngữ sau danh từ như tiếng Việt: 学生中国, 老师汉语.',
    ['CH1-06-02', 'CH1-06-08'],
  ),
  // H1-07
  np(
    'NP1-43',
    'Chủ ngữ + 很 + tính từ',
    'Câu vị ngữ tính từ (形容词谓语句): vị ngữ là tính từ, không dùng 是. Câu khẳng định thường thêm 很 trước tính từ, 很 ở đây nhẹ nghĩa, gần như không phải “rất”: 我很高兴.',
    'Tiếng Việt nói “Tôi vui” không cần “là”; tiếng Trung cũng không dùng 是, nhưng thường thêm 很.',
    'Thêm 是 trước tính từ (我是很高兴); bỏ 很 (我高兴 nghe như đang so sánh hoặc chưa nói hết câu).',
    ['CH1-07-04', 'CH1-07-08'],
  ),
  np(
    'NP1-15',
    '很 + tính từ',
    'Phó từ chỉ mức độ (程度副词): đứng trước tính từ để nói mức độ: 很 rất. Sau này học thêm 非常, 太 (bài H1-27), 真 (bài H1-30), 有（一）点儿 (bài H1-39).',
    'Giống “rất” nhưng đứng trước tính từ như tiếng Việt: 很好 rất tốt.',
    'Đặt 很 sau tính từ theo kiểu “vui lắm” (高兴很).',
    ['CH1-07-03', 'CH1-07-04'],
  ),
  // H1-08
  np(
    'NP1-10',
    '这 / 那 (+ 个 + danh từ)',
    'Đại từ chỉ thị (指示代词): 这 chỉ người, vật ở gần, 那 chỉ người, vật ở xa: 这是…, 那是…; trước danh từ thường thêm 个: 这个人, 那个人. Sau này học thêm 这儿, 那儿, 这里, 那里 (bài H1-31), 这些, 那些 (bài H1-34), 有的, 有些 (bài H1-30).',
    'Ngược với tiếng Việt: 这个人 là “người này”, 那个人 là “người kia”.',
    'Giữ thứ tự tiếng Việt (人这个); đọc lẫn 那 nà (kia) với 哪 nǎ (nào).',
    ['CH1-08-02', 'CH1-08-05', 'CH1-08-07'],
  ),
  np(
    'NP1-08',
    '…谁？',
    'Đại từ nghi vấn (疑问代词): từ để hỏi, đặt đúng chỗ của thông tin cần hỏi: 谁 ai, 什么 gì, 哪 nào. Sau này học thêm 几, 多 (bài H1-15), 多少 (bài H1-26), 哪儿, 哪里 (bài H1-31), 哪些 (bài H1-36), 怎么 (bài H1-37), 怎么样 (bài H1-42). 谁 thường đọc shéi, cũng đọc shuí.',
    'Giống tiếng Việt: “Đây là ai?” — 这是谁？',
    'Thêm 吗 vào câu đã có 谁; đặt 谁 lên đầu câu khi hỏi “Đây là ai?” (谁是这).',
    ['CH1-08-01', 'CH1-08-04', 'CH1-08-06'],
  ),
  // H1-09
  np(
    'NP1-21',
    'Chủ ngữ + 在 + nơi chốn + động từ',
    'Giới từ 在 (介词): 在 + nơi chốn đứng trước động từ, cho biết việc xảy ra ở đâu: 我在公司工作.',
    'Ngược với tiếng Việt: tiếng Việt nói “tôi làm việc ở công ty”, tiếng Trung nói 我在公司工作 (ở công ty làm việc).',
    'Giữ thứ tự tiếng Việt: 我工作在公司.',
    ['CH1-09-04', 'CH1-09-05', 'CH1-09-06'],
  ),
  np(
    'NP1-31',
    'Động từ + (chủ ngữ + vị ngữ)',
    'Cụm chủ vị (主谓短语): một cụm có chủ ngữ và vị ngữ, làm một thành phần của câu lớn; hay gặp nhất là làm tân ngữ sau 说, 知道: 王明说他在中国公司工作.',
    'Giống tiếng Việt: “Vương Minh nói anh ấy làm ở công ty Trung Quốc.”',
    'Thêm từ nối như “rằng” của tiếng Việt; tiếng Trung đặt thẳng cụm chủ vị sau 说.',
    ['CH1-09-10'],
  ),
  np(
    'NP1-33',
    '在 + nơi chốn',
    'Cụm giới tân (介宾短语): giới từ đi với tân ngữ thành một cụm: 在公司, 在越南公司. Cụm này đứng trước động từ.',
    'Giống “ở công ty” nhưng đứng trước động từ.',
    'Đặt cụm giới tân ở cuối câu như tiếng Việt.',
    ['CH1-09-04', 'CH1-09-06'],
  ),
  // H1-10
  np(
    'NP1-06',
    '可以 + động từ',
    'Động từ năng nguyện 可以 (能愿动词): 可以 + động từ là được phép hoặc có thể làm. Xin phép: 我可以…吗？ hoặc 我能…吗？; trả lời 可以 hoặc 不可以.',
    'Giống “được”, “có thể”. Tiếng Việt dùng “có thể” cho cả 会, 能 và 可以.',
    'Dùng 会 để xin phép (我会写吗？ nghĩa là hỏi mình có biết viết không); đặt 可以 sau động từ theo kiểu “viết được không”.',
    ['CH1-10-08', 'CH1-10-09'],
  ),
  np(
    'NP1-49',
    'Động từ + 不 + động từ？',
    'Câu hỏi chính phản (正反问句): đặt dạng khẳng định và phủ định liền nhau để hỏi: 是不是, 会不会, 能不能. Cuối câu không thêm 吗. 不 ở giữa đọc nhẹ: huì bu huì.',
    'Giống “có … không?” của tiếng Việt: 会不会写 = có biết viết không.',
    'Thêm 吗 sau câu hỏi chính phản (你会不会写吗？); đọc 不 ở giữa đủ thanh.',
    ['CH1-10-03', 'CH1-10-06'],
  ),
];

// ---------- Câu hỏi ----------
// q(mã, dạng bài, kỹ năng, điểm kiến thức, nội dung, âm thanh, đáp án đúng, [[đáp án sai, nhầm với]…], lời giải)
const q = (ma, dangBai, kyNang, diemKienThuc, noiDung, amThanh, dapAnDung, sai, loiGiai) => {
  const o = { ma, bai: ma.slice(1, 6), dangBai, kyNang, diemKienThuc, noiDung, amThanh, dapAnDung, loiGiai };
  sai.forEach(([dapAn, nhamVoi], i) => Object.assign(o, { [`dapAnSai${i + 1}`]: dapAn, [`nhamVoi${i + 1}`]: nhamVoi }));
  return o;
};
const NGHE_NGHIA = 'Nghe câu chọn nghĩa';
const NGHE_DAP = 'Nghe câu chọn câu đáp';
const NGHE_PY = 'Nghe chọn Pinyin';
const CHON_CAU = 'Chọn câu đúng';
const CHON_NGHIA = 'Chọn nghĩa';
const DIEN_TU = 'Chọn từ điền vào chỗ trống';
const nghiaCau = 'Nghe câu và chọn nghĩa đúng.';
const dapCau = 'Nghe câu và chọn câu đáp phù hợp.';
const chonPy = 'Nghe và chọn Pinyin đúng.';

const CauHoi = [
  // H1-01
  q('QH1-01-01', NGHE_NGHIA, 'nghe', ['我', 'NP1-52'], nghiaCau, 'CH1-01-01', 'Xin chào! Tôi là Vương Minh.', [['Xin chào! Anh ấy là Vương Minh.', '他 (tā) là anh ấy; câu nghe có 我 (wǒ).'], ['Xin chào! Bạn là Vương Minh.', '你 (nǐ) là bạn; 你 chỉ có trong 你好 ở đầu câu.']], '我是王明: tôi là Vương Minh.'),
  q('QH1-01-02', CHON_CAU, 'đọc', ['她', '他'], 'Chọn câu “Cô ấy là Lý Nguyệt.”', undefined, '她是李月。', [['他是李月。', '他 bộ nhân đứng 亻, chỉ nam; cô ấy là 她, bộ nữ 女.'], ['我是李月。', '我 là tôi.']], '她 (bộ nữ 女) chỉ người nữ; 他 và 她 cùng đọc tā.'),
  q('QH1-01-03', NGHE_PY, 'nghe', ['是'], chonPy, '是', 'shì', [['sì', 's không cong lưỡi; 是 có sh, cong đầu lưỡi.'], ['shí', 'Thanh 2 đi lên; 是 thanh 4 rơi xuống.']], '是 shì: sh cong lưỡi, thanh 4.'),
  q('QH1-01-04', CHON_NGHIA, 'đọc', ['人'], '人 nghĩa là gì?', undefined, 'người', [['tôi', 'Tôi là 我.'], ['là', 'Là là 是.']], '人 rén: người. 越南人: người Việt Nam.'),
  q('QH1-01-05', CHON_CAU, 'đọc', ['人', 'NP1-29', 'NP1-52'], 'Chọn câu “Tôi là người Việt Nam.”', undefined, '我是越南人。', [['我是人越南。', 'Giữ thứ tự tiếng Việt “người Việt Nam”; tiếng Trung đặt tên nước trước 人.'], ['我越南人是。', '是 đứng giữa hai phần như chữ “là”.']], 'Tên nước đứng trước 人: 越南人, 中国人.'),
  q('QH1-01-06', 'Nghe chọn từ', 'nghe', ['你', '我', '他'], 'Nghe và chọn từ đúng.', '他', '他', [['我', '我 đọc wǒ, thanh 3.'], ['你', '你 đọc nǐ, thanh 3.']], '他 tā: thanh 1, cao và phẳng.'),

  // H1-02
  q('QH1-02-01', NGHE_DAP, 'nghe', ['叫', '什么', '名字'], dapCau, 'CH1-02-01', '我叫阮安。', [['不客气。', '不客气 đáp lại lời cảm ơn.'], ['再见！', '再见 dùng khi chia tay.']], 'Câu hỏi tên 你叫什么名字？ trả lời bằng 我叫….'),
  q('QH1-02-02', CHON_CAU, 'đọc', ['您', 'NP1-48'], 'Hỏi tên một người lớn tuổi một cách lịch sự, nói câu nào?', undefined, '您叫什么名字？', [['你叫什么名字吗？', 'Câu đã có 什么 thì không thêm 吗.'], ['你什么叫名字？', '什么 đứng đúng chỗ của tên: 叫什么名字.']], 'Lịch sự dùng 您; câu có 什么 không thêm 吗.'),
  q('QH1-02-03', CHON_NGHIA, 'đọc', ['请问'], '请问 nghĩa là gì?', undefined, 'xin hỏi, cho hỏi', [['cảm ơn', 'Cảm ơn là 谢谢.'], ['tên là', 'Tên là là 叫.']], '请问 dùng trước câu hỏi cho lịch sự: 请问，你叫什么名字？'),
  q('QH1-02-04', NGHE_PY, 'nghe', ['名字'], chonPy, '名字', 'míngzi', [['míngzì', '字 trong 名字 đọc thanh nhẹ.'], ['mínzi', 'míng kết thúc bằng -ng, không phải -n.']], '名字 míngzi: 字 đọc nhẹ.'),
  q('QH1-02-05', DIEN_TU, 'đọc', ['什么', 'NP1-48'], 'Chọn từ điền vào chỗ trống: 她叫___名字？', undefined, '什么', [['吗', '吗 đứng cuối câu hỏi có hay không, không đứng trước 名字.'], ['是', '是 là “là”; câu hỏi tên cần từ để hỏi.']], '她叫什么名字？ Cô ấy tên là gì?'),
  q('QH1-02-06', 'Nghe chọn từ', 'nghe', ['您', '你'], 'Nghe và chọn từ đúng.', '您', '您', [['你', '你 đọc nǐ, thanh 3; 您 đọc nín, thanh 2 và có -n.'], ['他', '他 đọc tā.']], '您 nín: thanh 2.'),

  // H1-03
  q('QH1-03-01', NGHE_NGHIA, 'nghe', ['也', '吗', 'NP1-19'], nghiaCau, 'CH1-03-07', 'Bạn cũng là người Việt Nam à?', [['Bạn là người Việt Nam à?', 'Câu nghe có 也 (yě): cũng.'], ['Bạn cũng không phải người Việt Nam.', 'Câu nghe kết thúc bằng 吗: câu hỏi; không có 不.']], '你也是越南人吗？ Bạn cũng là người Việt Nam à?'),
  q('QH1-03-02', CHON_CAU, 'đọc', ['不', 'NP1-20'], 'Chọn câu “Tôi không phải là Vương Minh.”', undefined, '我不是王明。', [['我是不王明。', '不 đứng trước động từ: 不是.'], ['不我是王明。', '不 đứng sau chủ ngữ, trước động từ.']], '不 + động từ: 我不是王明.'),
  q('QH1-03-03', 'Chọn cách đọc', 'đọc', ['不', 'PA07-05'], '不是 đọc thế nào?', undefined, 'bú shì', [['bù shì', 'Trước thanh 4, 不 đổi thành thanh 2.'], ['bū shì', '不 không đọc thanh 1.']], '是 thanh 4 nên 不 đọc bú.'),
  q('QH1-03-04', 'Chọn câu đáp', 'đọc', ['吗', 'NP1-47', 'NP1-20'], 'Có người hỏi 你是李月吗？ nhưng bạn không phải Lý Nguyệt. Đáp thế nào?', undefined, '不，我不是李月。', [['不客气。', '不客气 là “không có gì”, đáp lời cảm ơn.'], ['是，我不是李月。', '是 là “vâng, đúng”, mâu thuẫn với 不是.']], 'Phủ định bằng 不，我不是….'),
  q('QH1-03-05', DIEN_TU, 'đọc', ['呢', '吗'], 'Chọn từ điền vào chỗ trống: 我是越南人，你___？', undefined, '呢', [['吗', '吗 cần cả câu: 你是越南人吗？; hỏi lại ngắn “còn bạn?” dùng 呢.'], ['也', '也 là cũng, không dùng để hỏi.']], '你呢？ Còn bạn thì sao?'),
  q('QH1-03-06', CHON_CAU, 'đọc', ['也', 'NP1-19'], 'Chọn câu “Tôi cũng là người Việt Nam.”', undefined, '我也是越南人。', [['也我是越南人。', '也 đứng sau chủ ngữ, không đứng đầu câu.'], ['我是也越南人。', '也 đứng trước động từ 是.']], 'Chủ ngữ + 也 + động từ.'),
  q('QH1-03-07', NGHE_PY, 'nghe', ['我们', '们'], chonPy, '我们', 'wǒmen', [['wǒmén', '们 đọc thanh nhẹ.'], ['wómen', 'Thanh 3 trước thanh nhẹ không đổi thành thanh 2.']], '我们 wǒmen: 们 đọc nhẹ.'),

  // H1-04
  q('QH1-04-01', NGHE_DAP, 'nghe', ['哪', '国'], dapCau, 'CH1-04-01', '我是越南人。', [['我叫阮安。', 'Câu hỏi về nước, không hỏi tên.'], ['是，我是中国人。', 'Câu hỏi có 哪 không trả lời bằng 是 hay 不是.']], '你是哪国人？ hỏi người nước nào.'),
  q('QH1-04-02', CHON_CAU, 'đọc', ['哪', 'NP1-48', 'NP1-29'], 'Chọn câu “Anh ấy là người nước nào?”', undefined, '他是哪国人？', [['他是人哪国？', 'Giữ thứ tự tiếng Việt; tiếng Trung nói 哪国人.'], ['他是哪国人吗？', 'Câu đã có 哪 thì không thêm 吗.']], '哪国人: người nước nào.'),
  q('QH1-04-03', CHON_CAU, 'đọc', ['都', 'NP1-16'], 'Chọn câu “Chúng tôi đều là người Trung Quốc.”', undefined, '我们都是中国人。', [['都我们是中国人。', '都 đứng sau chủ ngữ, không đứng đầu câu.'], ['我们是都中国人。', '都 đứng trước động từ 是.']], 'Chủ ngữ số nhiều + 都 + động từ.'),
  q('QH1-04-04', NGHE_PY, 'nghe', ['哪'], chonPy, '哪', 'nǎ', [['nà', 'nà (那) là kia, thanh 4; nǎ (哪) là nào, thanh 3.'], ['ná', 'Thanh 2 đi lên đều; 哪 xuống thấp rồi lên.']], '哪 nǎ: thanh 3, dùng để hỏi.'),
  q('QH1-04-05', CHON_NGHIA, 'đọc', ['她们', '他们'], '她们 nghĩa là gì?', undefined, 'các cô ấy', [['họ, các anh ấy', 'Đó là 他们, bộ nhân đứng.'], ['chúng tôi', 'Chúng tôi là 我们.']], '她们: 她 (cô ấy) + 们.'),
  q('QH1-04-06', CHON_NGHIA, 'đọc', ['国', '中国'], '国 nghĩa là gì?', undefined, 'nước, quốc gia', [['Trung Quốc', 'Trung Quốc là 中国.'], ['người', 'Người là 人.']], '国 guó: nước. 中国: Trung Quốc; 哪国人: người nước nào.'),

  // H1-05
  q('QH1-05-01', NGHE_DAP, 'nghe', ['会', 'NP1-04'], dapCau, 'CH1-05-03', '会，我会说汉语。', [['是，我是汉语。', 'Câu hỏi có 会 trả lời bằng 会 hoặc 不会, không dùng 是.'], ['我学汉语。', 'Câu hỏi biết nói hay không, không hỏi học gì.']], 'Hỏi 你会…吗？ đáp 会 hoặc 不会.'),
  q('QH1-05-02', CHON_CAU, 'đọc', ['会', '说', 'NP1-04'], 'Chọn câu “Tôi biết nói tiếng Trung.”', undefined, '我会说汉语。', [['我是说汉语。', '“Biết” làm việc gì là 会, không phải 是.'], ['我说会汉语。', '会 đứng trước động từ: 会说.']], '会 + động từ: 会说汉语.'),
  q('QH1-05-03', CHON_CAU, 'đọc', ['会', '不', 'NP1-04'], 'Chọn câu “Họ không biết nói tiếng Trung.”', undefined, '他们不会说汉语。', [['他们会不说汉语。', '不 đứng trước 会: 不会说.'], ['他们不说会汉语。', '会 đứng trước động từ 说.']], 'Phủ định: 不会 + động từ.'),
  q('QH1-05-04', NGHE_PY, 'nghe', ['说'], chonPy, '说', 'shuō', [['suō', 's không cong lưỡi; 说 có sh.'], ['shōu', 'uo gần “ua”; ou gần “âu”.']], '说 shuō: sh cong lưỡi, vần uo.'),
  q('QH1-05-05', CHON_NGHIA, 'đọc', ['学习'], '学习 nghĩa là gì?', undefined, 'học, học tập', [['nói', 'Nói là 说.'], ['biết (làm)', 'Biết làm là 会.']], '学习 xuéxí: học tập; một chữ 学 cũng là học.'),
  q('QH1-05-06', NGHE_PY, 'nghe', ['汉语'], chonPy, '汉语', 'Hànyǔ', [['Hányǔ', '汉 thanh 4 rơi xuống, không đi lên.'], ['Hànyù', '语 thanh 3, xuống thấp rồi lên.']], '汉语 Hànyǔ: thanh 4 + thanh 3.'),

  // H1-06
  q('QH1-06-01', NGHE_DAP, 'nghe', ['老师', '的', 'NP1-24'], dapCau, 'CH1-06-01', '是，她是我们的汉语老师。', [['是，我是老师。', 'Câu hỏi về 她 (cô ấy), không hỏi về mình.'], ['我是大学生。', 'Không trả lời câu hỏi cô ấy có phải cô giáo không.']], '她是你们的老师吗？ hỏi cô ấy có phải cô giáo của các bạn không.'),
  q('QH1-06-02', CHON_CAU, 'đọc', ['的', 'NP1-24'], 'Chọn cụm từ “thầy giáo của tôi”.', undefined, '我的老师', [['老师的我', 'Giữ thứ tự tiếng Việt; người sở hữu đứng trước 的.'], ['的我老师', '的 đứng giữa người sở hữu và danh từ.']], 'Định ngữ + 的 + danh từ: 我的老师.'),
  q('QH1-06-03', CHON_CAU, 'đọc', ['学生', 'NP1-39'], 'Chọn cụm từ “sinh viên Trung Quốc”.', undefined, '中国学生', [['学生中国', 'Định ngữ đứng trước danh từ: 中国 đứng trước 学生.'], ['学生的中国', '学生的中国 là “Trung Quốc của sinh viên”.']], 'Định ngữ đứng trước: 中国学生.'),
  q('QH1-06-04', CHON_NGHIA, 'đọc', ['同学'], '同学 nghĩa là gì?', undefined, 'bạn học', [['học sinh, sinh viên', 'Đó là 学生.'], ['thầy giáo, cô giáo', 'Đó là 老师.']], '同学 tóngxué: bạn học (Hán Việt: đồng học).'),
  q('QH1-06-05', NGHE_PY, 'nghe', ['老师', 'PA07-03'], chonPy, '老师', 'lǎoshī', [['láoshī', 'Thanh 3 trước thanh 1 đọc nửa thanh 3 (xuống thấp), không đổi thành thanh 2.'], ['lǎosī', 'sh cong lưỡi, không phải s.']], '老师 lǎoshī: nửa thanh 3 + thanh 1.'),
  q('QH1-06-06', NGHE_NGHIA, 'nghe', ['学生', 'NP1-39'], nghiaCau, 'CH1-06-08', 'Anh ấy là sinh viên Trung Quốc.', [['Anh ấy là thầy giáo Trung Quốc.', 'Câu nghe có 学生 (xuéshēng), không phải 老师 (lǎoshī).'], ['Anh ấy là bạn học của tôi.', 'Câu nghe không có 我的同学.']], '他是中国学生。'),

  // H1-07
  q('QH1-07-01', NGHE_DAP, 'nghe', ['认识', '高兴'], dapCau, 'CH1-07-03', '我也很高兴。', [['不客气。', '不客气 đáp lại lời cảm ơn.'], ['没关系。', '没关系 đáp lại lời xin lỗi.']], '认识你很高兴 đáp bằng 我也很高兴.'),
  q('QH1-07-02', CHON_CAU, 'đọc', ['很', 'NP1-43'], 'Chọn câu “Tôi rất vui.”', undefined, '我很高兴。', [['我是很高兴。', 'Câu có tính từ làm vị ngữ không dùng 是.'], ['我高兴很。', '很 đứng trước tính từ.']], 'Chủ ngữ + 很 + tính từ, không có 是.'),
  q('QH1-07-03', CHON_NGHIA, 'đọc', ['认识'], '认识 nghĩa là gì?', undefined, 'quen, quen biết (một người)', [['nhận thức, hiểu biết', 'Bẫy nghĩa: Hán Việt là “nhận thức”, nhưng 认识 ở HSK 1 là quen biết người.'], ['bạn bè', 'Bạn bè là 朋友.']], '认识你很高兴: rất vui được quen bạn.'),
  q('QH1-07-04', NGHE_PY, 'nghe', ['朋友'], chonPy, '朋友', 'péngyou', [['péngyǒu', '友 trong 朋友 đọc thanh nhẹ.'], ['pēngyou', '朋 thanh 2 đi lên, không giữ phẳng.']], '朋友 péngyou: thanh 2 + thanh nhẹ.'),
  q('QH1-07-05', CHON_NGHIA, 'đọc', ['男朋友', '朋友'], '男朋友 nghĩa là gì?', undefined, 'bạn trai (người yêu)', [['bạn bè (nam)', '男朋友 chỉ người yêu; bạn bè nam bình thường chỉ nói 朋友.'], ['bạn gái (người yêu)', 'Bạn gái là 女朋友.']], '男朋友: bạn trai, người yêu. Bạn bình thường là 朋友.'),
  q('QH1-07-06', NGHE_NGHIA, 'nghe', ['朋友', '都'], nghiaCau, 'CH1-07-08', 'Tốt quá! Chúng ta đều là bạn bè.', [['Tốt quá! Chúng ta đều là bạn học.', 'Bạn học là 同学; câu nghe có 朋友.'], ['Chúng ta đều rất vui.', 'Câu nghe có 很好 và 朋友, không có 高兴.']], '很好！我们都是朋友。'),

  // H1-08
  q('QH1-08-01', NGHE_DAP, 'nghe', ['谁', '这', 'NP1-08'], dapCau, 'CH1-08-01', '这是王先生。', [['是，这是王先生。', 'Câu hỏi có 谁 không trả lời bằng 是.'], ['我不认识这。', 'Thiếu danh từ sau 这: nói 这个人我不认识.']], '这是谁？ đáp 这是….'),
  q('QH1-08-02', CHON_CAU, 'đọc', ['那个', '谁', 'NP1-10'], 'Chọn câu “Người kia là ai?”', undefined, '那个人是谁？', [['人那个是谁？', 'Giữ thứ tự tiếng Việt “người kia”; tiếng Trung nói 那个人.'], ['那个人是谁吗？', 'Câu đã có 谁 thì không thêm 吗.']], '那个 + danh từ: 那个人.'),
  q('QH1-08-03', CHON_CAU, 'đọc', ['女士', '先生'], 'Chọn cách gọi “bà Lý”.', undefined, '李女士', [['李先生', '先生 dùng cho nam: ông Lý.'], ['女士李', '女士 đứng sau họ.']], 'Họ + 女士 / 先生: 李女士, 王先生.'),
  q('QH1-08-04', NGHE_PY, 'nghe', ['谁'], chonPy, '谁', 'shéi', [['séi', 's không cong lưỡi; 谁 có sh.'], ['shèi', 'Thanh 4 rơi xuống; 谁 thanh 2 đi lên.']], '谁 shéi (cũng đọc shuí): thanh 2.'),
  q('QH1-08-05', DIEN_TU, 'đọc', ['这', '那', 'NP1-10'], 'Giới thiệu người đứng ngay cạnh mình: ___是王先生。', undefined, '这', [['那', '那 chỉ người, vật ở xa.'], ['哪', '哪 dùng để hỏi “nào”.']], '这 chỉ gần, 那 chỉ xa.'),
  q('QH1-08-06', NGHE_PY, 'nghe', ['那个', '那'], chonPy, '那个', 'nàge', [['nǎge', 'nǎ thanh 3 là 哪 (nào); 那 thanh 4 rơi xuống.'], ['zhège', 'zhè là 这 (này).']], '那个 nàge: cái kia.'),
  q('QH1-08-07', CHON_NGHIA, 'đọc', ['先生'], '王先生 nghĩa là gì?', undefined, 'ông Vương', [['thầy giáo Vương', 'Bẫy nghĩa: Hán Việt “tiên sinh” xưa chỉ thầy đồ; thầy giáo là 老师.'], ['bà Vương', 'Bà Vương là 王女士.']], '先生 đặt sau họ: ông, anh.'),

  // H1-09
  q('QH1-09-01', NGHE_DAP, 'nghe', ['做', '工作'], dapCau, 'CH1-09-01', '我是汉语老师。', [['我叫李月。', 'Câu hỏi nghề nghiệp, không hỏi tên.'], ['我是中国人。', 'Câu hỏi nghề nghiệp, không hỏi quốc tịch.']], '你做什么工作？ hỏi làm nghề gì.'),
  q('QH1-09-02', CHON_CAU, 'đọc', ['在', 'NP1-21', 'NP1-33'], 'Chọn câu “Tôi làm việc ở công ty.”', undefined, '我在公司工作。', [['我工作在公司。', 'Giữ thứ tự tiếng Việt; 在 + nơi chốn đứng trước động từ.'], ['我公司在工作。', '在 đứng trước nơi chốn: 在公司.']], 'Chủ ngữ + 在 + nơi chốn + động từ.'),
  q('QH1-09-03', CHON_NGHIA, 'đọc', ['工作'], '工作 nghĩa là gì?', undefined, 'làm việc; công việc', [['đi công tác', 'Hán Việt “công tác” còn có nghĩa “đi công tác”; nghĩa này không dùng 工作.'], ['công ty', 'Công ty là 公司.']], '工作 gōngzuò: làm việc, công việc.'),
  q('QH1-09-04', NGHE_PY, 'nghe', ['医生'], chonPy, '医生', 'yīshēng', [['yīsēng', 'sh cong lưỡi, không phải s.'], ['yíshēng', '医 thanh 1, cao và phẳng.']], '医生 yīshēng: hai thanh 1.'),
  q('QH1-09-05', CHON_CAU, 'đọc', ['女', '医生', 'NP1-39'], 'Chọn cụm từ “bác sĩ nữ”.', undefined, '女医生', [['医生女', 'Định ngữ đứng trước danh từ: 女 đứng trước 医生.'], ['女士医生', '女士 là cách gọi lịch sự (bà, chị), không dùng làm định ngữ.']], '女 + danh từ chỉ nghề: 女医生, 女老师; 男 cũng vậy: 男老师.'),
  q('QH1-09-06', NGHE_NGHIA, 'nghe', ['说', 'NP1-31'], nghiaCau, 'CH1-09-10', 'Vương Minh nói anh ấy làm ở công ty Trung Quốc.', [['Vương Minh làm ở công ty Việt Nam.', 'Câu nghe có 中国公司 (công ty Trung Quốc).'], ['Vương Minh nói anh ấy là bác sĩ.', 'Câu nghe có 在…公司工作, không có 医生.']], '王明说他在中国公司工作。'),

  // H1-10
  q('QH1-10-01', NGHE_DAP, 'nghe', ['会', '写', '汉字'], dapCau, 'CH1-10-01', '会，我会写汉字。', [['我知道汉字。', '知道 là biết một việc, một thông tin; biết viết là 会写.'], ['可以。', '可以 là “được”, dùng khi trả lời xin phép.']], '你会写汉字吗？ đáp 会 hoặc 不会.'),
  q('QH1-10-02', DIEN_TU, 'đọc', ['会', '知道', 'NP1-04'], 'Chọn từ điền vào chỗ trống (biết vì đã học): 我___说汉语。', undefined, '会', [['知道', '知道 đi với một việc, một thông tin (知道这是什么字), không đi với kỹ năng.'], ['是', '是 là “là”.']], '会 + động từ: biết làm việc gì nhờ học.'),
  q('QH1-10-03', DIEN_TU, 'đọc', ['可以', '能', '会', 'NP1-06'], 'Chọn từ điền vào chỗ trống (xin phép): 老师，我___写吗？', undefined, '可以', [['会', '我会写吗？ là hỏi mình có biết viết không.'], ['知道', '知道 không đứng trước động từ để xin phép.']], 'Xin phép: 我可以…吗？ hoặc 我能…吗？'),
  q('QH1-10-04', CHON_CAU, 'đọc', ['NP1-49'], 'Chọn câu hỏi đúng.', undefined, '你会不会写？', [['你会不会写吗？', 'Câu hỏi chính phản không thêm 吗.'], ['你不会会写？', 'Dạng khẳng định đứng trước: 会不会.']], 'Động từ + 不 + động từ: 会不会, 是不是.'),
  q('QH1-10-05', NGHE_PY, 'nghe', ['汉字'], chonPy, '汉字', 'Hànzì', [['Hànzhì', 'z không cong lưỡi; 字 không phải zh.'], ['Hánzì', '汉 thanh 4 rơi xuống.']], '汉字 Hànzì: hai thanh 4; i sau z đọc gần “ư”.'),
  q('QH1-10-06', CHON_NGHIA, 'đọc', ['知道', '认识', '会'], '知道 nghĩa là gì?', undefined, 'biết (một việc, một thông tin)', [['biết (làm, nhờ học)', 'Biết làm là 会.'], ['quen biết (một người)', 'Quen người là 认识.']], '知道 đi với thông tin: 你知道这是什么字吗？'),
  q('QH1-10-07', NGHE_NGHIA, 'nghe', ['NP1-49', '是'], nghiaCau, 'CH1-10-06', 'Đây có phải chữ “国” không?', [['Đây không phải chữ “国”.', '是不是 là câu hỏi “có phải … không”, không phải câu phủ định.'], ['Đây là chữ “国”.', 'Câu nghe là câu hỏi, có 是不是.']], '这是不是“国”字？ — câu hỏi chính phản.'),
];

// ---------- Cặp dễ nhầm (mục 5.9) ----------
const CapDeNham = [
  {
    ma: 'DN001',
    cacMuc: ['会', '能', '可以'],
    giaiThich: '会: biết làm nhờ học (会说汉语). 能: có khả năng, điều kiện cho phép (bài H1-10). 可以: được phép (我可以写吗？ — 可以). Xin phép dùng 可以 hoặc 能, không dùng 会. Tiếng Việt đều nói “có thể” hoặc “biết”.',
    cauHoi: ['QH1-10-02', 'QH1-10-03'],
  },
  {
    ma: 'DN002',
    cacMuc: ['他', '她'],
    giaiThich: 'Cùng đọc tā. 他 có bộ nhân đứng 亻: anh ấy, ông ấy (và khi không rõ nam hay nữ). 她 có bộ nữ 女: cô ấy, chị ấy. Nghe thì không phân biệt được, chỉ khác khi viết.',
    cauHoi: ['QH1-01-02'],
  },
  {
    ma: 'DN003',
    cacMuc: ['那', '哪'],
    giaiThich: '那 nà, thanh 4: kia, đó. 哪 nǎ, thanh 3: nào (để hỏi), có thêm bộ khẩu 口 bên trái. 那个人 là người kia; 哪国人 là người nước nào.',
    cauHoi: ['QH1-04-04', 'QH1-08-06'],
  },
  {
    ma: 'DN004',
    cacMuc: ['吗', '呢'],
    giaiThich: '吗 đứng cuối một câu đầy đủ để hỏi có hay không: 你是越南人吗？ 呢 hỏi lại ngắn sau một danh từ, đại từ: 你呢？ (còn bạn?). Câu có từ để hỏi không thêm 吗.',
    cauHoi: ['QH1-03-05'],
  },
  {
    ma: 'DN005',
    cacMuc: ['认识', '知道', '会'],
    giaiThich: 'Tiếng Việt đều nói “biết”. 认识 + người: quen biết (认识王明). 知道 + một việc, thông tin: biết (知道这是什么字). 会 + động từ: biết làm (会写汉字).',
    cauHoi: ['QH1-07-03', 'QH1-10-06', 'QH1-10-01'],
  },
];

export const NOI_DUNG = { Bai, Tu, Chu, NguPhap, Cau, CauHoi, CapDeNham };
