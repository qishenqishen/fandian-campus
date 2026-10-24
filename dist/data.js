// Fictional campus demo data; photos illustrate dish categories rather than actual servings.
window.FANDIAN_DATA = {
  dishes: [
    {
      id: 1, name: '宫保鸡丁双拼饭', canteen: '学一食堂', floor: '一楼', window: '06 号窗口', price: 13, rating: 4.8, reviews: 128, wait: 5,
      tags: ['微辣', '人气必吃', '分量足'], flavor: '微辣', description: '鸡丁嫩、花生脆，再搭一份时蔬。午课前想吃得稳妥，同学们最常回购这一碗。', image: 'assets/dish-1.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '一颗小土豆', avatar: '土', rating: 5, date: '今天 12:10', text: '鸡肉给得很实在，阿姨还多盛了一点西兰花。微辣偏甜，下饭！', tags: ['分量足', '会回购'] },
        { name: '周三不早八', avatar: '周', rating: 4, date: '昨天 11:42', text: '12 点前来基本不用等。花生很脆，米饭稍微硬一点，喜欢软饭的留意。', tags: ['出餐快', '口味反馈'] }
      ]
    },
    {
      id: 2, name: '番茄黑椒牛肉饭', canteen: '学二食堂', floor: '二楼', window: '12 号窗口', price: 18, rating: 4.9, reviews: 86, wait: 8,
      tags: ['不辣', '高蛋白', '今日上新'], flavor: '不辣', description: '酸甜番茄搭配嫩牛肉片，淡淡黑椒香气，拌饭刚刚好。新菜单上线，先看看同学怎么说。', image: 'assets/dish-2.jpg', isNew: true, available: true,
      reviewItems: [
        { name: '饭要趁热吃', avatar: '饭', rating: 5, date: '今天 12:26', text: '牛肉片很嫩，番茄味很浓，黑椒只是提香没有明显辣感。今天这一份很合我口味！', tags: ['不辣友好', '新菜打卡'] },
        { name: '小林同学', avatar: '林', rating: 5, date: '今天 11:35', text: '18 元比普通盖饭贵一点，不过牛肉片给得实在，今天这一份值。', tags: ['肉量实在', '会回购'] }
      ]
    },
    {
      id: 3, name: '川味杂酱面', canteen: '风味食堂', floor: '一楼', window: '03 号窗口', price: 16, rating: 4.7, reviews: 203, wait: 6,
      tags: ['中辣', '人气必吃', '分量足'], flavor: '中辣', description: '劲道面条配上浓郁肉末杂酱，辣香十足。拌匀后每一口都有滋味，一碗解决大胃口。', image: 'assets/dish-3.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '干饭研究员', avatar: '研', rating: 5, date: '今天 11:58', text: '面条很筋道，肉末杂酱很香。对我来说刚好辣，不太能吃辣的先问问窗口。', tags: ['口味反馈', '分量足'] },
        { name: '橙子汽水', avatar: '橙', rating: 4, date: '昨天 18:16', text: '大份真的够吃，酱里有肉末，不是素面。拌匀再吃更入味。', tags: ['会回购', '分量足'] }
      ]
    },
    {
      id: 4, name: '鲜肉白菜蒸饺', canteen: '学一食堂', floor: '二楼', window: '08 号窗口', price: 12, rating: 4.2, reviews: 64, wait: 10,
      tags: ['不辣', '现包现蒸'], flavor: '不辣', description: '饺子现蒸出笼，鲜肉白菜馅清爽不腻。每份 12 只，适合想吃一顿热乎的同学。', image: 'assets/dish-4.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '阿团', avatar: '团', rating: 4, date: '今天 12:32', text: '12 只饺子味道不错，我饭量大吃完还要加个馒头。醋和辣油可以自己放。', tags: ['分量反馈', '口味清淡'] },
        { name: '不想起名字', avatar: '名', rating: 4, date: '昨天 17:46', text: '皮有嚼劲，现蒸等了十分钟左右。下课特别饿的时候建议先买点别的。', tags: ['现蒸需等', '会回购'] }
      ]
    },
    {
      id: 5, name: '炭烤鸡腿饭', canteen: '风味食堂', floor: '一楼', window: '09 号窗口', price: 15, rating: 4.8, reviews: 156, wait: 4,
      tags: ['不辣', '高蛋白', '人气必吃'], flavor: '不辣', description: '整只带骨鸡腿，炭烤香气浓，搭配米饭与时蔬。出餐快、分量足，吃的时候记得留意骨头。', image: 'assets/dish-5.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '今天也要早睡', avatar: '睡', rating: 5, date: '今天 12:05', text: '出餐只等了四分钟，鸡腿烤得很香。有骨头要慢点吃，别光顾着赶课。', tags: ['出餐快', '带骨提醒'] },
        { name: '三分糖', avatar: '糖', rating: 4, date: '昨天 12:22', text: '鸡皮微焦很香，肉也不柴。配菜有两样，15 元可以。', tags: ['炭烤香', '搭配丰富'] }
      ]
    },
    {
      id: 6, name: '田园蔬菜能量碗', canteen: '学二食堂', floor: '一楼', window: '05 号窗口', price: 17, rating: 4.6, reviews: 42, wait: 3,
      tags: ['素食', '不辣', '今日上新'], flavor: '不辣', description: '玉米、紫甘蓝与新鲜叶菜的清爽组合。酱汁单独装，想吃轻一点可以选它。', image: 'assets/dish-6.jpg', isNew: true, available: true,
      reviewItems: [
        { name: '青柠同学', avatar: '柠', rating: 5, date: '今天 11:48', text: '蔬菜很脆，玉米甜甜的！酱汁单独给很贴心，我放半包就够了。', tags: ['素食友好', '新菜打卡'] },
        { name: '晚风', avatar: '风', rating: 4, date: '今天 12:17', text: '适合中午想吃清爽的时候。训练日我会自己再搭一份主食和蛋白质。', tags: ['搭配反馈', '口味清淡'] }
      ]
    },
    {
      id: 7, name: '川味宫保鸡丁饭', canteen: '风味食堂', floor: '二楼', window: '16 号窗口', price: 14, rating: 3.8, reviews: 57, wait: 7,
      tags: ['中辣', '口味偏重'], flavor: '中辣', description: '更浓郁的川味版本，辣椒与酱汁香气足。近期同学反馈偏咸，点单时可以备注少盐。', image: 'assets/dish-1.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '喝水吨吨吨', avatar: '水', rating: 3, date: '今天 12:18', text: '今天这份酱汁比较咸，吃完喝了不少水。鸡肉口感还可以，希望窗口少放点盐。', tags: ['口味偏咸', '具体反馈'] },
        { name: '小陈', avatar: '陈', rating: 4, date: '昨天 18:03', text: '我口味重觉得还行，但和学一的版本差别挺大。建议先说明少盐。', tags: ['口味反馈', '可备注少盐'] }
      ]
    },
    {
      id: 8, name: '家常番茄牛肉饭', canteen: '学一食堂', floor: '一楼', window: '06 号窗口', price: 16, rating: 4.5, reviews: 93, wait: 5,
      tags: ['不辣', '分量足'], flavor: '不辣', description: '嫩牛肉片搭配酸甜番茄，汤汁浓、饱腹感强。熟悉的家常味，适合不想踩雷的一餐。', image: 'assets/dish-2.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '山山', avatar: '山', rating: 5, date: '今天 11:52', text: '番茄汁拌饭绝了。牛肉片比学二少一点，但价格也便宜两块。', tags: ['性价比', '家常味'] },
        { name: '月亮不营业', avatar: '月', rating: 4, date: '昨天 12:40', text: '热乎乎的很舒服，米饭量够。汤汁偏多，喜欢干一点的可以提前说。', tags: ['分量足', '口味反馈'] }
      ]
    },
    {
      id: 9, name: '素香菌菇汤面', canteen: '风味食堂', floor: '一楼', window: '03 号窗口', price: 10, rating: 3.9, reviews: 78, wait: 18,
      tags: ['不辣', '素食', '平价好吃'], flavor: '不辣', description: '菌菇素汤鲜香、面条劲道，十元也能吃满足。午间高峰现煮排队较久，赶课时留足时间。', image: 'assets/dish-3.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '下一节在东楼', avatar: '东', rating: 3, date: '今天 12:36', text: '面是好吃的，但 12:15 点单到拿到等了快二十分钟，赶课差点迟到。', tags: ['高峰排队久', '口味不错'] },
        { name: '早一点来', avatar: '早', rating: 5, date: '昨天 11:12', text: '11 点来人少，三四分钟就拿到了。菌菇汤清爽鲜香，10 块钱很满足。', tags: ['错峰推荐', '性价比'] }
      ]
    },
    {
      id: 10, name: '香菇三鲜蒸饺', canteen: '学一食堂', floor: '二楼', window: '08 号窗口', price: 13, rating: 4.6, reviews: 51, wait: 6,
      tags: ['不辣', '现蒸出笼'], flavor: '不辣', description: '香菇、鲜肉与鸡蛋做馅，皮薄馅饱满。刚出笼时香气最足，蘸醋吃也很合适。', image: 'assets/dish-4.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '蒸的很好吃', avatar: '蒸', rating: 5, date: '今天 12:08', text: '刚好赶上新一笼，热气腾腾的。香菇味很明显，配小米粥很舒服。', tags: ['现蒸出笼', '会回购'] },
        { name: '阿鱼', avatar: '鱼', rating: 4, date: '昨天 18:21', text: '皮薄馅多，不过每份 10 只，我会再配一碗汤。', tags: ['搭配推荐', '分量反馈'] }
      ]
    },
    {
      id: 11, name: '黑椒烤鸡腿饭', canteen: '清真食堂', floor: '一楼', window: '06 号窗口', price: 16, rating: 4.7, reviews: 112, wait: 5,
      tags: ['微辣', '高蛋白', '分量足'], flavor: '微辣', description: '黑胡椒香气搭配烤鸡腿，外皮微焦、肉质多汁。想补充蛋白质又不想等太久，可以试试。', image: 'assets/dish-5.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '跑完再吃', avatar: '跑', rating: 5, date: '今天 12:14', text: '鸡腿挺大，黑胡椒味很香。米饭和配菜都足，运动完吃很满足。', tags: ['肉量实在', '分量足'] },
        { name: '星星', avatar: '星', rating: 4, date: '昨天 11:55', text: '胡椒会有一点点辣，完全不吃辣的同学注意。阿姨可以把酱汁分开放。', tags: ['微辣提醒', '可分装酱汁'] }
      ]
    },
    {
      id: 12, name: '时蔬藜麦沙拉碗', canteen: '学二食堂', floor: '一楼', window: '05 号窗口', price: 14, rating: 4.4, reviews: 36, wait: 3,
      tags: ['素食', '不辣', '清爽轻食'], flavor: '不辣', description: '藜麦与当季蔬菜的简单搭配，油醋汁可自选。今日午餐份已售完，可先收藏下次来吃。', image: 'assets/dish-6.jpg', isNew: false, available: false,
      reviewItems: [
        { name: '小树', avatar: '树', rating: 5, date: '昨天 11:32', text: '很清爽，藜麦口感不错。午餐配一份豆腐就够我吃了。', tags: ['素食友好', '口味清淡'] },
        { name: '吃饭慢慢来', avatar: '慢', rating: 4, date: '前天 12:16', text: '14 元比较亲民，酱汁推荐油醋的。份数不多，想吃尽量早点来。', tags: ['早点来', '搭配反馈'] }
      ]
    },
    {
      id: 13, name: '番茄孜然牛肉饭', canteen: '学二食堂', floor: '二楼', window: '12 号窗口', price: 18, rating: 4.6, reviews: 19, wait: 8,
      tags: ['微辣', '高蛋白', '今日上新'], flavor: '微辣', description: '番茄牛肉饭的孜然风味版，牛肉片带一点辣香。和黑椒版同窗口，喜欢浓郁香气可以换着试。', image: 'assets/dish-13.jpg', isNew: true, available: true,
      reviewItems: [
        { name: '香菜加满', avatar: '香', rating: 5, date: '今天 12:02', text: '孜然香气很足，牛肉片也嫩。辣度比黑椒版高一点，能接受微辣的可以试试。', tags: ['新菜打卡', '微辣提醒'] },
        { name: '白日梦', avatar: '梦', rating: 4, date: '今天 12:41', text: '跟同学各买了一种，孜然版更香，黑椒版更温和。两种都是 18 元。', tags: ['口味对比', '肉量实在'] }
      ]
    },
    {
      id: 14, name: '蒜香烤鸡腿饭', canteen: '风味食堂', floor: '一楼', window: '09 号窗口', price: 16, rating: 4.5, reviews: 47, wait: 5,
      tags: ['不辣', '高蛋白', '分量足'], flavor: '不辣', description: '蒜香腌制的整只带骨鸡腿，烤至外皮微焦，搭配米饭与时蔬。蒜味爱好者的另一种选择。', image: 'assets/dish-14.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '蒜了蒜了', avatar: '蒜', rating: 5, date: '今天 11:46', text: '蒜香很明显，鸡腿里面还挺多汁。有骨头，吃的时候注意一下。', tags: ['蒜香浓郁', '带骨提醒'] },
        { name: '小路', avatar: '路', rating: 4, date: '昨天 18:14', text: '比原味多一块钱，蒜味确实更浓。我喜欢让阿姨把米饭少盛一点。', tags: ['口味反馈', '会回购'] }
      ]
    },
    {
      id: 15, name: '麻香宫保鸡丁饭', canteen: '风味食堂', floor: '二楼', window: '16 号窗口', price: 15, rating: 4.3, reviews: 39, wait: 7,
      tags: ['中辣', '花椒麻香', '分量足'], flavor: '中辣', description: '在川味宫保鸡丁里加入花椒麻香，鸡丁与花生一起下饭。同窗口还有经典川味版，重口味同学可以按喜好选。', image: 'assets/dish-15.jpg', isNew: false, available: true,
      reviewItems: [
        { name: '麻辣小分队', avatar: '麻', rating: 4, date: '今天 12:24', text: '麻感比辣感更明显，花生很脆。不太吃花椒的同学建议选经典版。', tags: ['花椒麻香', '口味反馈'] },
        { name: '一口米饭', avatar: '米', rating: 5, date: '昨天 17:57', text: '鸡丁给得够，挺下饭的。提前说了少盐，这次吃着刚好。', tags: ['分量足', '可备注少盐'] }
      ]
    }
  ],
  windows: [
    { id: 'w1', name: '家常小炒', canteen: '学一食堂', floor: '一楼', window: '06 号窗口', description: '鸡丁与番茄牛肉两种家常盖饭，出餐快、分量足。想吃清淡一点可选不辣的牛肉饭。', dishIds: [1, 8] },
    { id: 'w2', name: '手工蒸饺', canteen: '学一食堂', floor: '二楼', window: '08 号窗口', description: '鲜肉白菜与香菇三鲜两种馅，现蒸出笼。每份数量不同，点单前可按饭量选。', dishIds: [4, 10] },
    { id: 'w3', name: '番茄牛肉饭', canteen: '学二食堂', floor: '二楼', window: '12 号窗口', description: '主打番茄牛肉片盖饭，黑椒版温和、孜然版微辣。两种风味都能吃到酸甜番茄香。', dishIds: [2, 13] },
    { id: 'w4', name: '田园轻食', canteen: '学二食堂', floor: '一楼', window: '05 号窗口', description: '清爽蔬菜与谷物沙拉，酱汁单独装。想吃轻一点可以来，售罄菜品可先收藏。', dishIds: [6, 12] },
    { id: 'w5', name: '川味面馆', canteen: '风味食堂', floor: '一楼', window: '03 号窗口', description: '爱辣选肉末杂酱面，吃素选菌菇素汤面。现煮品种午高峰需多留一点时间。', dishIds: [3, 9] },
    { id: 'w6', name: '炭火烤鸡', canteen: '风味食堂', floor: '一楼', window: '09 号窗口', description: '原味炭烤与蒜香鸡腿饭，整只带骨鸡腿配米饭和时蔬。出餐较快，吃时留意骨头。', dishIds: [5, 14] },
    { id: 'w7', name: '川味小炒', canteen: '风味食堂', floor: '二楼', window: '16 号窗口', description: '川味宫保鸡丁与花椒麻香版，同样香辣下饭。近期有偏咸反馈，清淡口味可备注少盐。', dishIds: [7, 15] },
    { id: 'w8', name: '清真烤肉', canteen: '清真食堂', floor: '一楼', window: '06 号窗口', description: '主打黑椒烤鸡腿饭，烤香浓郁、分量足。黑椒带一点辣感，具体制作方式可向窗口询问。', dishIds: [11] }
  ],
  alerts: [
    { id: 1, dishId: 7, type: '口味提醒', title: '这两天有点咸，记得说少盐', text: '风味食堂 16 号 · 川味宫保鸡丁饭。近期点评提到酱汁偏咸，清淡口味同学可先备注少盐。', time: '今天 12:18', agrees: 18 },
    { id: 2, dishId: 9, type: '排队提醒', title: '12 点后排队，赶课先绕开', text: '风味食堂 03 号 · 素香菌菇汤面。午高峰现煮约等 18 分钟，建议 11:30 前错峰来。', time: '今天 12:36', agrees: 26 },
    { id: 3, dishId: 4, type: '分量提醒', title: '每份 12 只，大胃口可以加餐', text: '学一食堂 08 号 · 鲜肉白菜蒸饺。窗口按份售卖，饭量大的同学可以再搭配小食。', time: '今天 12:32', agrees: 11 }
  ],
  canteens: [
    { id: 1, name: '学一食堂', subtitle: '家常味道 · 平价管饱', distance: '距教学楼约 3 分钟', hours: '06:30–09:00 / 10:30–13:30 / 16:30–19:30', description: '主教学区旁的老朋友。一楼 06 号家常小炒做盖饭，二楼 08 号手工蒸饺适合想吃热乎面点的同学。', windowCount: 16, mapX: 27, mapY: 39 },
    { id: 2, name: '学二食堂', subtitle: '上新积极 · 轻食友好', distance: '距图书馆约 4 分钟', hours: '07:00–09:00 / 10:30–13:30 / 16:30–20:00', description: '靠近图书馆。一楼 05 号田园轻食提供清爽沙拉，二楼 12 号番茄牛肉饭可以在黑椒与孜然风味间换着吃。', windowCount: 20, mapX: 68, mapY: 30 },
    { id: 3, name: '清真食堂', subtitle: '西北风味 · 大份满足', distance: '距运动场约 2 分钟', hours: '07:00–09:00 / 10:30–13:30 / 16:30–20:00', description: '运动场旁的清真食堂，一楼 06 号清真烤肉的黑椒烤鸡腿饭很受欢迎。菜品与制作方式请以窗口现场说明为准。', windowCount: 8, mapX: 34, mapY: 73 },
    { id: 4, name: '风味食堂', subtitle: '各地小吃 · 晚课补给', distance: '距宿舍区约 3 分钟', hours: '07:00–09:30 / 10:30–14:00 / 16:30–21:00', description: '宿舍区旁的风味集合。一楼有川味面馆与炭火烤鸡，二楼 16 号川味小炒适合重口味。晚课后仍有部分窗口供应。', windowCount: 18, mapX: 76, mapY: 68 }
  ]
};
