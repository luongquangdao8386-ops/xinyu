# Lộ trình bài Nền phát âm và HSK 1

> Sinh từ `tools/lo-trinh/hsk1.mjs` bằng `node tools/tao-lo-trinh.mjs`. Sửa lộ trình ở tệp đó rồi chạy lại; script kiểm tra mỗi từ và mỗi điểm ngữ pháp HSK 1 có mặt đúng một lần.

Lộ trình dựng thẳng từ Đề cương thi HSK (11/2025) trong `content/de-cuong/hsk1.json`, không theo giáo trình nào (mục 3.2 của [đặc tả](dac-ta.md)). Các cụm theo khung 12 tuần ở mục 4.3; mỗi bài HSK 1 có 4–8 từ (mục 5.2). Ngữ pháp ghi mã bỏ tiền tố NP1-.

| Cụm | Việc soạn | Số bài | Số từ |
|---|---|---|---|
| Nền phát âm | A4 | 8 | 6 |
| Tên, thông tin cá nhân, câu hỏi cơ bản | A7.1 | 10 | 63 |
| Gia đình, số đếm, ngày giờ | A7.2 | 10 | 64 |
| Ăn uống, mua sắm | A7.3 | 10 | 59 |
| Địa điểm, di chuyển | A7.4 | 10 | 60 |
| Hẹn gặp, sinh hoạt, ôn tập tổng hợp | A7.5 | 8 | 48 |
| **Cộng** | | **56** | **300** |

Bài Nền phát âm PA01–PA07 luyện âm và thanh trên âm tiết, không tính từ vựng; PA08 dạy sáu lời chào thuộc danh sách HSK 1.

## Nền phát âm (A4)

| Mã | Chủ đề | Mục tiêu | Từ | Ngữ pháp |
|---|---|---|---|---|
| PA01 | Bốn thanh điệu | Nghe và đọc đúng bốn thanh trên âm tiết đơn |  |  |
| PA02 | Âm đầu (1): b p m f d t n l g k h | Phân biệt âm bật hơi và không bật hơi |  |  |
| PA03 | Âm đầu (2): j q x zh ch sh r z c s | Phân biệt ba nhóm âm dễ nhầm với tiếng Việt |  |  |
| PA04 | Vần đơn và vần ghép | Đọc đúng vần, gồm ü và e |  |  |
| PA05 | Vần mũi | Phân biệt -n và -ng |  |  |
| PA06 | 20 cặp thanh | Đọc liền hai âm tiết với 20 tổ hợp thanh |  |  |
| PA07 | Thanh nhẹ và biến điệu | Đọc thanh nhẹ, biến điệu thanh 3, 一 và 不 |  |  |
| PA08 | Lời chào | Chào, cảm ơn, xin lỗi, tạm biệt | 你好、谢谢、不客气、再见、对不起、没关系 | 45 单句: 非主谓句 |

## Tên, thông tin cá nhân, câu hỏi cơ bản (A7.1)

| Mã | Chủ đề | Mục tiêu | Từ | Ngữ pháp |
|---|---|---|---|---|
| H1-01 | Tôi là ai | Nói mình là ai bằng câu 是 | 我、你、他、她、是、人 | 09 人称代词: 我、你、您、他、她、我们、你们、他们、她们、它、它们、大家<br>52 “是”字句1: 表示等同或类属<br>35 主语: 名词、代词或名词性短语作主语<br>38 宾语: 名词、代词或名词性短语作宾语<br>42 单句: 主谓句1：动词谓语句<br>46 陈述句 |
| H1-02 | Hỏi tên | Hỏi và nói tên | 叫、什么、名字、您、请问 | 48 疑问句: （2）特指问句<br>30 基本结构类型: （3）动宾短语 |
| H1-03 | Phải không? | Hỏi có/không, phủ định và hỏi lại | 吗、不、呢、也、们、我们、你们 | 47 疑问句: （1）是非问句<br>20 否定副词: 不、没（有）、不要<br>19 关联副词: 还¹、也<br>02 后缀: —们、—边 |
| H1-04 | Quốc tịch | Hỏi và nói người nước nào | 中国、国、哪、他们、她们、都 | 16 范围副词: 都¹<br>29 基本结构类型: （2）偏正短语 |
| H1-05 | Học tiếng Trung | Nói mình học và biết nói tiếng gì | 学、学习、汉语、中文、说、会1 | 04 能愿动词: 会、能 |
| H1-06 | Thầy và trò | Giới thiệu thầy cô, bạn học | 老师、学生、同学、大学、大学生、的 | 24 结构助词: 的¹<br>39 定语: 名词性词语、形容词性短语、数量短语作定语 |
| H1-07 | Làm quen | Nói vui được làm quen | 朋友、认识、很、好、高兴、男朋友、女朋友 | 43 单句: 主谓句2：形容词谓语句<br>15 程度副词: 非常、很、太、真、有（一）点儿 |
| H1-08 | Đây là ai? | Hỏi người này, người kia là ai | 谁、这、那、这个、那个、先生、女士 | 10 指示代词: 这、那、这儿、那儿、这里、那里、这些、那些、有的、这个、那个、有些<br>08 疑问代词: 多、多少、几、哪、哪儿、哪里、哪些、什么、谁、怎么、怎么样 |
| H1-09 | Nghề nghiệp | Nói làm nghề gì, làm ở đâu | 工作、医生、公司、做、在、男、女 | 21 引出时间、处所: 在<br>31 基本结构类型: （4）主谓短语<br>33 其他结构类型: （2）介宾短语 |
| H1-10 | Biết chữ Hán | Nói biết, có thể làm gì | 知道、汉字、字、写、能、可以 | 06 能愿动词: 可以<br>49 疑问句: （3）正反问句 |

## Gia đình, số đếm, ngày giờ (A7.2)

| Mã | Chủ đề | Mục tiêu | Từ | Ngữ pháp |
|---|---|---|---|---|
| H1-11 | Đếm từ 1 đến 8 | Đếm và đọc số nhỏ | 一、二、三、四、五、六、七、八 |  |
| H1-12 | Số lớn | Đọc số đến hàng nghìn, dùng 二 và 两 | 九、十、百、千、零、两1 | 11 数词: 一、二/两、三、四、五、六、七、八、九、零、十、百、半、千 |
| H1-13 | Gia đình tôi | Nói nhà có mấy người | 家、家人、爸爸、妈妈、口、有 | 53 “有”字句1: 表示领有<br>12 名量词: （1）专用名量词：本、个、家、口、块、件、只、元 |
| H1-14 | Anh chị em | Nói có hay không có anh chị em | 哥哥、姐姐、弟弟、妹妹、和1、没（有） | 22 引出对象: 和¹、对<br>23 连接词语或短语: 和²<br>28 基本结构类型: （1）联合短语 |
| H1-15 | Tuổi | Hỏi và nói tuổi | 岁、几、多、大、孩子、儿子、女儿 | 36 谓语: 名词、代词、数词或数量短语作谓语 |
| H1-16 | Con vật nuôi | Đếm vật bằng lượng từ | 狗、猫、只、个、它、它们 | 32 其他结构类型: （1）数量短语 |
| H1-17 | Ngày tháng | Hỏi và nói hôm nay ngày mấy | 年、月、日、号、今天、明天、昨天 | 14 时量词: 日、号、岁、点、分、年、天<br>44 单句: 主谓句3：名词谓语句<br>69 时间表示法: （1）年、月、日、星期表示法 |
| H1-18 | Thứ và năm | Nói thứ trong tuần và năm | 星期、星期日、星期天、今年、明年、去年 |  |
| H1-19 | Mấy giờ rồi | Hỏi và nói giờ | 现在、点1、分、半、时候、第 | 70 时间表示法: （2）钟点表示法<br>68 数的表达法: 序数表达法1：第+数词<br>01 前缀: 小—、第— |
| H1-20 | Các buổi trong ngày | Nói làm gì vào buổi nào | 早上、上午、中午、下午、晚上、白天 | 40 状语: 副词、形容词作状语；表示时间、处所的词语作状语 |

## Ăn uống, mua sắm (A7.3)

| Mã | Chủ đề | Mục tiêu | Từ | Ngữ pháp |
|---|---|---|---|---|
| H1-21 | Ăn gì? | Nói muốn ăn gì | 吃、饭、米饭、菜、想、要 | 05 能愿动词: 想、要 |
| H1-22 | Uống gì? | Gọi đồ uống | 喝、茶、水、牛奶、杯子、一点儿 | 13 名量词: （2）借用名量词：杯 |
| H1-23 | Món Trung Hoa | Nói món nào ngon | 包子、饺子、面条儿、面包、鸡蛋、好吃 |  |
| H1-24 | Ba bữa ăn | Rủ ăn cơm, nấu cơm | 早饭、午饭、晚饭、做饭、饭店、吧 | 26 语气助词: 吧¹、了²、吗、呢¹、呢²、呢³<br>50 祈使句 |
| H1-25 | Hoa quả | Nói thích gì | 水果、苹果、喜欢、爱、些、一些 |  |
| H1-26 | Bao nhiêu tiền? | Hỏi giá và trả tiền | 买、卖、钱、多少、块、元 | 67 数的表达法: 钱数表示法 |
| H1-27 | Đắt quá! | Khen chê giá cả | 贵、便宜、太、非常、少、了 | 63 变化态: 用动态助词“了²”表示<br>51 感叹句 |
| H1-28 | Quần áo | Chọn quần áo theo cỡ | 衣服、件、穿、漂亮、小 | 37 谓语: 动词或动词性短语、形容词或形容词性短语作谓语 |
| H1-29 | Đi siêu thị | Nói đã mua những gì | 超市、商店、东西、还、本1、书 | 61 并列复句: ……，还……<br>62 完成态: 用动态助词“了¹”表示<br>25 动态助词: 了¹ |
| H1-30 | Cửa hàng mới | Tả cửa hàng | 店、书店、新、真、有的、有些 |  |

## Địa điểm, di chuyển (A7.4)

| Mã | Chủ đề | Mục tiêu | Từ | Ngữ pháp |
|---|---|---|---|---|
| H1-31 | Ở đâu? | Hỏi và chỉ chỗ | 哪儿、这儿、那儿、哪里、这里、那里 |  |
| H1-32 | Trên dưới trong ngoài | Nói đồ vật ở vị trí nào | 上、下、里、外、前、后 | 03 方位名词: 上、下、里、外、前、后<br>34 其他结构类型: （3）方位短语<br>54 存现句1: （1）所处+是+名词 |
| H1-33 | Bên này, bên kia | Tả trong phòng có gì | 边、这边、那边、外边、桌子、椅子 | 55 存现句1: （2）处所+有+数量短语+名词 |
| H1-34 | Nhà ở | Nói mình ở đâu, phòng có gì | 住、房间、电脑、电视、这些、那些 |  |
| H1-35 | Trường học | Nói học ở trường nào | 学校、小学、中学、小学生、中学生、小朋友 |  |
| H1-36 | Đi và về | Nói đi đâu để làm gì | 去、来、到、回、哪个、哪些 | 56 连动句1: （1）前后动作先后发生，后一动作是前一动作的目的 |
| H1-37 | Phương tiện | Nói đi bằng gì | 车、出租车、火车、飞机、坐、怎么 | 57 连动句1: （2）前一动作是后一动作的方式 |
| H1-38 | Đi làm, đi học | Nói giờ đi làm, đi học | 开、开车、上学、上班、下班、对 | 07 离合词: 看病、睡觉、说话、上课、下课、上班、下班、生病 |
| H1-39 | Đi khám bệnh | Nói mình bị ốm | 医院、病、生病、看病、有（一）点儿、再 | 18 频率副词: 再¹ |
| H1-40 | Đi xem phim | Rủ đi xem phim | 电影、电影院、看、看见、好看、给 | 58 双宾语句1: 主语+动词+宾语1+宾语2 |

## Hẹn gặp, sinh hoạt, ôn tập tổng hợp (A7.5)

| Mã | Chủ đề | Mục tiêu | Từ | Ngữ pháp |
|---|---|---|---|---|
| H1-41 | Gọi điện thoại | Gọi điện hỏi có việc gì | 打电话、电话、手机、喂1、事、没事 | 27 叹词: 喂 |
| H1-42 | Hẹn gặp | Hẹn giờ và chỗ gặp | 时间、见、忙、怎么样、一下、找 | 41 数量补语1: 动词+动量补语 |
| H1-43 | Một ngày của tôi | Kể giờ dậy, giờ ngủ | 起床、睡觉、睡、休息、早、晚 |  |
| H1-44 | Đang làm gì? | Nói đang làm gì và làm bao lâu | 正在、读、读书、小时、分钟、天 | 17 时间副词: 在、正在<br>64 进行态: （1）……在/正在+动词<br>65 进行态: （2）……在/正在+动词……+呢<br>66 进行态: （3）……呢 |
| H1-45 | Thời tiết | Nói thời tiết hôm nay | 天气、冷、热、下雨、雨、雪 |  |
| H1-46 | Sở thích | Nói thích làm gì lúc rảnh | 听、歌、唱、好听、玩、好玩儿 | 59 不用关联词语的复句<br>60 并列复句: ……，也…… |
| H1-47 | Trong lớp học | Hỏi thầy cô khi chưa hiểu | 课、上课、下课、说话、问、问题、听见 |  |
| H1-48 | Mời và khuyên | Mời mọi người, khuyên đừng làm gì, nói ý kiến | 请、大家、不要、觉得、一半 |  |

## Ghi chú khi soạn

- Câu trong bài chỉ dùng từ của bài đó và các bài trước (mục 11.6 bước 3); công cụ xây nội dung kiểm tra việc này.
- Điểm ngữ pháp gồm nhiều từ (đại từ, lượng từ, phó từ…) được gán vào bài giới thiệu lần đầu; các từ còn lại học ở bài sau và được nhắc lại cùng điểm ngữ pháp đó:
  - NP1-09 (H1-01): 您 học ở H1-02, 我们 học ở H1-03, 你们 học ở H1-03, 他们 học ở H1-04, 她们 học ở H1-04, 它 học ở H1-16, 它们 học ở H1-16, 大家 học ở H1-48
  - NP1-20 (H1-03): 没（有） học ở H1-14, 不要 học ở H1-48
  - NP1-19 (H1-03): 还 học ở H1-29
  - NP1-02 (H1-03): 边 học ở H1-33
  - NP1-04 (H1-05): 能 học ở H1-10
  - NP1-15 (H1-07): 非常 học ở H1-27, 太 học ở H1-27, 真 học ở H1-30, 有（一）点儿 học ở H1-39
  - NP1-10 (H1-08): 这儿 học ở H1-31, 那儿 học ở H1-31, 这里 học ở H1-31, 那里 học ở H1-31, 这些 học ở H1-34, 那些 học ở H1-34, 有的 học ở H1-30, 有些 học ở H1-30
  - NP1-08 (H1-08): 多 học ở H1-15, 多少 học ở H1-26, 几 học ở H1-15, 哪儿 học ở H1-31, 哪里 học ở H1-31, 哪些 học ở H1-36, 怎么 học ở H1-37, 怎么样 học ở H1-42
  - NP1-11 (H1-12): 半 học ở H1-19
  - NP1-12 (H1-13): 本 học ở H1-29, 个 học ở H1-16, 块 học ở H1-26, 件 học ở H1-28, 只 học ở H1-16, 元 học ở H1-26
  - NP1-22 (H1-14): 对 học ở H1-38
  - NP1-14 (H1-17): 点 học ở H1-19, 分 học ở H1-19, 天 học ở H1-44
  - NP1-01 (H1-19): 小 học ở H1-28
  - NP1-26 (H1-24): 了 học ở H1-27
  - NP1-07 (H1-38): 看病 học ở H1-39, 睡觉 học ở H1-43, 说话 học ở H1-47, 上课 học ở H1-47, 下课 học ở H1-47, 生病 học ở H1-39
- Thứ tự và cách chia bài có thể chỉnh khi soạn từng cụm (A7); sửa `tools/lo-trinh/hsk1.mjs` rồi chạy lại script.
