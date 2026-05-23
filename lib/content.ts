/**
 * Single source of truth for site content.
 * Editable text lives here so pages stay declarative.
 */

export type Room = {
  slug: 'parlor' | 'studio' | 'workshop' | 'cooperate';
  zh: string;
  en: string;
  taglineZh: string;
  taglineEn: string;
  /** Apple-emoji used as the thiings-style 3D hero. */
  glyph: string;
  /** Tile background tint — kept very subtle. */
  tint: string;
};

export const ROOMS: Room[] = [
  {
    slug: 'parlor',
    zh: '会客厅',
    en: 'Parlor',
    taglineZh: '跟世界打交道',
    taglineEn: 'meet the world',
    glyph: '🛋️',
    tint: 'bg-peach/40',
  },
  {
    slug: 'studio',
    zh: '工作台',
    en: 'Studio',
    taglineZh: '自己埋头做事',
    taglineEn: 'head down, building',
    glyph: '💻',
    tint: 'bg-sky2/50',
  },
  {
    slug: 'workshop',
    zh: '工坊',
    en: 'Workshop',
    taglineZh: '学员来学手艺',
    taglineEn: 'teach a hand',
    glyph: '🪄',
    tint: 'bg-sage/50',
  },
  {
    slug: 'cooperate',
    zh: '合作',
    en: 'Cooperate',
    taglineZh: '客户 / 金主找我',
    taglineEn: 'clients & investors',
    glyph: '🤝',
    tint: 'bg-cream/60',
  },
];

export const MANIFESTO = [
  { num: '01', text: '不靠外部标签镀金，自信从里头长出来', glyph: '🌱' },
  { num: '02', text: '害羞没用，说出来才有人听见', glyph: '🔥' },
  { num: '03', text: '一起来，不是看戏，是上场', glyph: '🤝' },
  { num: '04', text: '我学什么就播什么，过程比成品诚实', glyph: '📡' },
  { num: '05', text: '全平台、全球化，不给自己设上限', glyph: '🌍' },
  { num: '06', text: '把麦克风递给「还没敢说」的人', glyph: '🎙️' },
];

export type KeywordGroup = {
  emoji: string;
  label: string;
  tags: string[];
};

export type ChapterLevel = 'l1' | 'l2' | 'l3' | 'l4' | 'l5' | 'l6' | 'aside';

export type Chapter = {
  level: ChapterLevel;
  num: string;
  name: string;
  era: string;
  glyph: string;
  /** Short summary used in cards / index. */
  tagline: string;
  /** Quick chip cloud used in summary card. */
  keys: string[];
  /** Grouped keyword sections shown on the chapter detail page. */
  keywordGroups: KeywordGroup[];
  /** "💼 对照你的工作" — examples that map theory to creator's real day-to-day. */
  examples: string[];
  /** Optional secondary tagline (e.g. L3 has "和 L2 的区别"). */
  secondary?: { label: string; text: string };
};

export const CHAPTERS: Chapter[] = [
  {
    level: 'l6',
    num: 'L6',
    name: '行业 · 产品 · 岗位',
    era: '你的主场',
    glyph: '🗺️',
    tagline: '从 PM / 创业者的视角，看 AI 怎么变成生意。这层是你最不陌生的——等底下五层打通了，再回来看会有"原来这群人在干这个"的快感。',
    keys: ['AI 产品 vs 传统产品', 'AI 行业现状', 'AI 全岗位分析', 'AI 产品落地全流程'],
    keywordGroups: [
      {
        emoji: '🏷️',
        label: '落在这层的词',
        tags: ['AI 产品 vs 传统产品', 'AI 行业现状', 'AI 全岗位分析', 'AI 产品落地全流程'],
      },
    ],
    examples: [
      '这层是你最不陌生的。等底下五层打通了，再回来看会有"哦，原来这群人在干这个"的快感 ✨',
    ],
  },
  {
    level: 'l5',
    num: 'L5',
    name: '大模型应用层',
    era: '产品化工具箱',
    glyph: '🧰',
    tagline: '光有 LLM 不能直接卖钱——得装进具体场景做成产品。RAG 给它私人资料库，Agent 让它自己跑完一整条流程。',
    keys: ['RAG 检索增强', 'Agent 智能体', '知识图谱', '智能对话技术'],
    keywordGroups: [
      {
        emoji: '🏷️',
        label: '落在这层的词',
        tags: ['RAG 检索增强', 'Agent 智能体', '知识图谱', '智能对话技术'],
      },
    ],
    examples: [
      'RAG：把你所有播客文稿做成 AI 的"私人资料库"，问它"我以前讲过这个吗"',
      'Agent：一句话交代——"看完 B站视频 → 提炼亮点 → 改成小红书文案 → 生成封面 → 排期发布"——它自己做完',
      '知识图谱：B站「番剧—UP 主—标签」那种关系网',
    ],
  },
  {
    level: 'l4',
    num: 'L4',
    name: '大模型时代',
    era: '2017 至今 · 这就是当下',
    glyph: '💬',
    tagline: '让机器理解上下文，生成像人写的内容。Transformer 是引擎，LLM 是产物——你每天用的 Claude、ChatGPT 都在这层。',
    keys: ['Transformer', 'LLM', 'Embedding', '预训练 · 微调 · RLHF'],
    keywordGroups: [
      {
        emoji: '⚙️',
        label: '核心引擎',
        tags: ['Transformer 架构', '注意力机制', '嵌入词向量 Embedding'],
      },
      {
        emoji: '📦',
        label: '核心产物',
        tags: ['基础模型 Foundation Model', '大语言模型 LLM', 'ChatGPT', 'Claude'],
      },
      {
        emoji: '🛠️',
        label: '怎么造出来',
        tags: ['模型参数', '数据集', '数据标注', '预训练', '微调', 'RLHF 人类反馈强化训练要求'],
      },
      {
        emoji: '📊',
        label: '怎么验收',
        tags: ['模型评测'],
      },
      {
        emoji: '🐒',
        label: '附带概念',
        tags: ['无限猴子定理'],
      },
    ],
    examples: [
      '你用 Claude 起标题、ChatGPT 改播客大纲——都在调用 LLM',
      '把你 100 期播客文稿喂进去训出"你的专属 AI"——叫微调',
      'ChatGPT 一夜爆红背后的秘密——预训练 + RLHF',
    ],
  },
  {
    level: 'l3',
    num: 'L3',
    name: '深度学习',
    era: '2012–2017 主流',
    glyph: '🧠',
    tagline: '人不用挑特征了——机器自己学会"该看什么"。图像走 CNN / Diffusion，文本走 RNN / LSTM。代价是更费数据、更费算力。',
    keys: ['CNN', 'RNN · LSTM', 'GAN · Diffusion', '强化学习'],
    keywordGroups: [
      {
        emoji: '🏗️',
        label: '底层架构',
        tags: ['感知机', '神经元', '激活函数', '神经网络'],
      },
      {
        emoji: '🖼️',
        label: '图像方向',
        tags: ['CNN 卷积神经网络', 'GAN 生成对抗网络', 'Diffusion 扩散模型', 'AI 绘画'],
      },
      {
        emoji: '📝',
        label: '文本 / 序列方向',
        tags: ['RNN 循环神经网络', 'LSTM 长短时记忆'],
      },
      {
        emoji: '🎮',
        label: '特殊范式',
        tags: ['强化学习'],
      },
    ],
    secondary: {
      label: '和 L2 的区别',
      text: '人不用挑特征了，机器自己学会"该看什么"。代价是更费数据、更费算力。',
    },
    examples: [
      '小红书识别封面里"有没有人脸、食物、风景"——CNN',
      '你用 Midjourney、可灵生成 AI 短视频——背后是 Diffusion',
      'B站自动生成字幕、弹幕情绪识别——LSTM',
    ],
  },
  {
    level: 'l2',
    num: 'L2',
    name: '经典机器学习',
    era: '~2010 年前主流',
    glyph: '🎯',
    tagline: '人先告诉机器看什么特征，机器再学。三大问题：分类、回归、聚类——你给笔记分类、预测涨粉、做粉丝分群，全在这层。',
    keys: ['分类', '回归', '聚类', 'KNN · SVM · 决策树 · K-means'],
    keywordGroups: [
      {
        emoji: '🎯',
        label: '三大问题',
        tags: ['分类', '回归', '聚类'],
      },
      {
        emoji: '⚙️',
        label: '核心算法',
        tags: [
          'KNN K-近邻',
          '线性回归',
          '逻辑回归',
          '朴素贝叶斯',
          '决策树',
          '随机森林',
          'SVM 支持向量机',
          'K-means',
        ],
      },
      {
        emoji: '🔁',
        label: '配套流程',
        tags: ['模型构建过程', '模型评估'],
      },
    ],
    examples: [
      '分类：把笔记分到「穿搭 / 美食 / 职场」',
      '回归：预测一条笔记 24 小时涨多少粉',
      '聚类：粉丝画像分群，没有现成标签',
      'KNN：找跟这条爆款"最像"的 5 条历史笔记',
    ],
  },
  {
    level: 'l1',
    num: 'L1',
    name: '数学 & 统计学',
    era: '地基 · Foundation',
    glyph: '🧊',
    tagline: '给 AI 打底的那一层。不用专门学，碰到再补就行——你看后台均值、标准差、AB 测试已经在用了。',
    keys: ['数学统计学知识', '统计学基本概念'],
    keywordGroups: [
      {
        emoji: '🏷️',
        label: '落在这层的词',
        tags: ['数学统计学知识', '统计学基本概念'],
      },
    ],
    examples: [
      '看后台数据时的均值、标准差、AB 测试就是这层。',
      '"这条笔记的互动率显著高于均值"——你已经在用统计学了。',
    ],
  },
];

export type Platform = {
  key: string;
  zh: string;
  en: string;
  handle: string;
  href: string;
  glyph: string;
  group: 'cn' | 'global' | 'mail';
};

export const PLATFORMS: Platform[] = [
  // CN
  { key: 'rednote', zh: '小红书', en: 'Xiaohongshu', handle: '@Claire · 29.8K 赞', href: 'https://xhslink.com/m/A7Sw3zZLj08', glyph: '📕', group: 'cn' },
  { key: 'bili', zh: 'B 站', en: 'Bilibili', handle: 'UID 293315913', href: 'https://space.bilibili.com/293315913', glyph: '📺', group: 'cn' },
  { key: 'douyin', zh: '抖音', en: 'Douyin', handle: '点击扫码关注', href: '#', glyph: '🎵', group: 'cn' },
  { key: 'xyz', zh: '小宇宙', en: 'Podcast', handle: 'Claire 的会客厅', href: 'https://www.xiaoyuzhoufm.com/podcast/69e4c6803a001fce5f9c48a2', glyph: '🎙️', group: 'cn' },
  { key: 'netease', zh: '网易云', en: '播客', handle: 'Claire 的会客厅', href: 'https://music.163.com/#/djradio?id=1491594017', glyph: '🎧', group: 'cn' },
  { key: 'wechat', zh: '公众号', en: 'WeChat', handle: '点击扫码关注', href: '#', glyph: '💬', group: 'cn' },
  { key: 'jike', zh: '即刻', en: 'Jike', handle: '@Claire', href: 'https://web.okjike.com/u/3b2eb514-7b8d-4bb3-aa5b-5501f34dd4b2', glyph: '🟡', group: 'cn' },
  // Global
  { key: 'yt', zh: 'YouTube', en: 'YouTube', handle: '@clairesparlor', href: 'https://www.youtube.com/@clairesparlor', glyph: '📹', group: 'global' },
  { key: 'x', zh: 'X · Twitter', en: 'X', handle: '@clairesparlor', href: 'https://x.com/clairesparlor', glyph: '✖️', group: 'global' },
  { key: 'substack', zh: 'Substack', en: 'Newsletter', handle: 'clairesparlor.substack.com', href: 'https://clairesparlor.substack.com', glyph: '📬', group: 'global' },
  { key: 'reddit', zh: 'Reddit', en: 'Reddit', handle: 'u/clairesparlor', href: 'https://reddit.com/user/clairesparlor', glyph: '👽', group: 'global' },
  // Mail
  { key: 'mail', zh: 'Email', en: 'Email', handle: 'yutingliu1996@gmail.com', href: 'mailto:yutingliu1996@gmail.com', glyph: '✉️', group: 'mail' },
];

export type Guest = {
  ep: string;
  role: string;
  topic: string;
};

export const GUESTS: Guest[] = [
  { ep: 'EP·01', role: 'AI Founder', topic: '"在 AI 大潮里做 0→1 的人，是什么模样"' },
  { ep: 'EP·02', role: 'AI Builder', topic: '"做产品的人，被工具反过来改造的故事"' },
  { ep: 'EP·03', role: 'Investor', topic: '"投资人怎么看 2026 的 AI 落地节奏"' },
  { ep: 'EP·04', role: 'Consultant', topic: '"咨询顾问视角：AI 怎么真正进企业"' },
  { ep: 'EP·05', role: 'Female Leader', topic: '"女性管理者：在 AI 转向中怎么不被推走"' },
  { ep: 'OPEN', role: 'Reader · 你', topic: '"想上播客的 reader：写信给我们"' },
];

export const HANGOUTS = [
  {
    name: '听友群',
    en: 'Listener Club',
    tag: '免费',
    glyph: '☕',
    pitch: '每期播客的"返场咖啡馆"——聊感受、推嘉宾、互相安利你最近喜欢的内容。',
    meta: ['📱 微信群', '👥 不限', '💸 免费'],
    href: 'mailto:yutingliu1996@gmail.com?subject=听友群候补',
  },
  {
    name: '书友共读',
    en: 'Book Circle',
    tag: '免费',
    glyph: '📚',
    pitch: '每月一本，跟着我的书架挑——投资思想 / 内容方法 / 中国社会观察。',
    meta: ['📱 微信群', '📅 月度', '💸 免费'],
    href: 'mailto:yutingliu1996@gmail.com?subject=书友共读候补',
  },
  {
    name: '答疑小屋',
    en: 'Office Hours',
    tag: '付费',
    glyph: '🎓',
    pitch: 'AI / 内容 / 个人品牌 三大主题月度答疑。群里 24h 内必回 + 每月一次 1v1 视频。',
    meta: ['📱 微信群 + 1v1', '📅 月订阅', '💸 待定'],
    href: 'mailto:yutingliu1996@gmail.com?subject=答疑小屋候补',
  },
];

export const WORKSHOP_TRACKS = [
  {
    direction: 'content',
    eyebrow: '自媒体方向 · 流量漏斗',
    title: '从 0 到第一个 1 万粉',
    glyph: '📱',
    desc: '4 天起号方法论（我自己 4 天小红书起号验证过）· 1-on-1 内容咨询陪跑 · 优秀的签 MCN，我们孵化你做号。',
    href: 'mailto:yutingliu1996@gmail.com?subject=自媒体工坊咨询',
    cta: '报名 / 咨询',
  },
  {
    direction: 'ai',
    eyebrow: 'AI 创业方向 · 投资漏斗',
    title: 'AI Founder 训练营',
    glyph: '🚀',
    desc: '给 AI Founder / Builder / 国央企 + B 端 PM 想 turn Founder。上游资金 ~10 亿元 · 方向：AI / SaaS to B / 企业数字化转型。',
    href: 'mailto:yutingliu1996@gmail.com?subject=AI创业训练营路演',
    cta: '路演 / 报名',
  },
  {
    direction: 'hackathon',
    eyebrow: '黑客松 · 48h 协作',
    title: '下一场什么时候？',
    glyph: '⚡',
    desc: '线上 + 线下两种 · 题目偏 AI 应用 / 内容创新 · 评委含投资人 + 业界专家 · 优秀项目直接进 AI 训练营。',
    href: 'mailto:yutingliu1996@gmail.com?subject=黑客松下场提前预约',
    cta: '提前预约',
  },
];

export const READING_BOOKS = [
  { cat: '投资 · 段永平', title: '大道：段永平投资问答录', author: '段永平', cover: 'https://res.weread.qq.com/wrepub/CB_GHi8Yk8YP7sZ6wl6xA2op3Fg_parsecover' },
  { cat: '社科 · 中国基层', title: '小镇喧嚣', author: '吴毅', cover: 'https://cdn.weread.qq.com/weread/cover/89/cpPlatform_nVqL1T1SuysradaMks3Dbi/t6_cpPlatform_nVqL1T1SuysradaMks3Dbi.jpg' },
  { cat: '个人成长', title: '学会卓越', author: '埃里克·波特拉特', cover: 'https://cdn.weread.qq.com/weread/cover/1/cpplatform_jx9sxr6m9sezufvjgqg7wr/t6_cpplatform_jx9sxr6m9sezufvjgqg7wr1775811594.jpg' },
  { cat: '内容方法论', title: '新媒体写作', author: '赵博平', cover: 'https://cdn.weread.qq.com/weread/cover/30/cpplatform_hh1emysxgi7whrsr4qryfq/t6_cpplatform_hh1emysxgi7whrsr4qryfq1717404127.jpg' },
  { cat: '主体性', title: '活出主体性', author: '苏尼塔·萨', cover: 'https://cdn.weread.qq.com/weread/cover/6/cpplatform_qbfgveet8mwtowlrnyiz1x/t6_cpplatform_qbfgveet8mwtowlrnyiz1x1777006041.jpg' },
  { cat: '投资思想', title: '原则', author: '瑞·达利欧', cover: 'https://cdn.weread.qq.com/weread/cover/23/YueWen_921568/t6_YueWen_921568.jpg' },
];

export const FINISHED_BOOKS = [
  { cat: '中国政经', title: '置身事内', author: '兰小欢', cover: 'https://cdn.weread.qq.com/weread/cover/52/YueWen_40055543/t6_YueWen_40055543.jpg' },
  { cat: '认知思维', title: '无界成长', author: '谢胜子', cover: 'https://cdn.weread.qq.com/weread/cover/90/3300011390/t6_3300011390.jpg' },
  { cat: '人生哲学', title: '纳瓦尔宝典', author: '埃里克·乔根森', cover: 'https://cdn.weread.qq.com/weread/cover/89/YueWen_44026191/t6_YueWen_44026191.jpg' },
  { cat: '企业管理', title: '效率为王', author: '卫哲', cover: 'https://cdn.weread.qq.com/weread/cover/35/cpplatform_1mevksbugsx8pv5hyjztvf/t6_cpplatform_1mevksbugsx8pv5hyjztvf1743389852.jpg' },
  { cat: '理财 · 人生', title: '赚钱的艺术', author: '蔡澜', cover: 'https://cdn.weread.qq.com/weread/cover/17/cpplatform_pdrag5phynati4qhglgss1/t6_cpplatform_pdrag5phynati4qhglgss11751019997.jpg' },
  { cat: '内容方法论', title: '内容力', author: '夏翰杰', cover: 'https://cdn.weread.qq.com/weread/cover/94/cpplatform_8gzpruz2anqtbvpacaoil6/t6_cpplatform_8gzpruz2anqtbvpacaoil61769770993.jpg' },
];

// ============== STUDIO · IP 化妆间 ==============

export type Mascot = {
  role: 'host' | 'co-host';
  roleLabel: string;
  name: string;
  glyph: string;
  quote: string;
  tags: string[];
  personality: { emoji: string; text: string }[];
};

export const MASCOTS: Mascot[] = [
  {
    role: 'host',
    roleLabel: '🎙️ HOST · 主理人',
    name: 'CLAIRE · 玉婷',
    glyph: '👩‍💻',
    quote: '"想让大家都不害羞，由内而外地自信，一起往上长。"',
    tags: ['ENTP', '5 YR PM', '播客主理人', '向上长', '圆框眼镜'],
    personality: [
      { emoji: '🧠', text: 'ENTP · 点子机器，话题能从 AI 跳到八字再跳回来不掉链子' },
      { emoji: '👓', text: '圆框眼镜不离脸 · 书卷气 + 锋利的混合' },
      { emoji: '🌱', text: '"向上长 · 无界长" · 不甘心被职场磨平的人' },
      { emoji: '🎙️', text: '采访人是真听 · 不打断、不站台、不油' },
      { emoji: '🤝', text: '把别人推到台前 · 主理人比嘉宾更隐身' },
    ],
  },
  {
    role: 'co-host',
    roleLabel: '🎙️ CO-HOST · 联合主理人',
    name: '铜板儿 · TONGBAR',
    glyph: '🐱',
    quote: '"永远困，永远饿，永远诚实。主理人犯错我就翻白眼。"',
    tags: ['英国长毛猫', '乳白色', '铜琥珀眼', '射手座', '钢琴踩键人'],
    personality: [
      { emoji: '😴', text: '永远困，但你录播客她必到场' },
      { emoji: '👁️', text: '铜眼睛会说话 · 翻白眼比说话有力' },
      { emoji: '🎹', text: '钢琴自动跳上去 · 真·co-host，会发声' },
      { emoji: '🍗', text: '永远饿，对所有食物视频感兴趣' },
      { emoji: '👑', text: '气场公主 · 但姿态永远摊着' },
    ],
  },
];

export type MerchItem = {
  glyph: string;
  name: string;
  sub: string;
  desc: string;
};

export const MERCH: MerchItem[] = [
  {
    glyph: '🏷️',
    name: '贴纸 · Sticker Pack',
    sub: 'PRINT-ON-DEMAND · 工厂打样首选',
    desc: '铜眼+鼻三角的极简头像版。一套 6 张可做不同表情（瞪 / 闭眼 / 翻白眼 / 张嘴 / 困 / 假笑）。Cricut 切割机 + 防水贴纸纸自己也能打。',
  },
  {
    glyph: '☕',
    name: '马克杯 · Mug',
    sub: 'CENTRAL PERK 致敬款',
    desc: '两面印不同图：一面铜板儿大眼睛 + CLAIRE·玉婷，另一面 "I\'ll be there for you"。播客上新发周边时这是入门级单品。',
  },
  {
    glyph: '👜',
    name: '帆布袋 · Tote Bag',
    sub: '米色帆布 · 单面丝印',
    desc: '"CLAIRE · 玉婷"大字 + 铜板儿头像 + "VOL · 01 → ∞" 编号。装播客录音设备出门，本身就是行走的播客海报。',
  },
  {
    glyph: '🧲',
    name: '冰箱贴 · Fridge Magnet',
    sub: '圆形软磁 · 软陶 / 亚克力都行',
    desc: '小、便宜、易出货。每期 Vol 出一款纪念冰箱贴（"Vol.01 纪念版"），用户集卡式收。',
  },
  {
    glyph: '🧸',
    name: '毛绒玩具 · Plush (Jellycat-style)',
    sub: '需要工厂打样 · 高客单价',
    desc: 'Jellycat 同款工艺：超柔短绒 + 内胆 PP 棉。第一版做坐姿小铜板儿（15-20cm 高），适合放在播客录音桌上当吉祥物。深圳 / 浙江工厂打样 ¥80-150 / 个。',
  },
  {
    glyph: '👕',
    name: 'T-Shirt',
    sub: '"向上长" 口号款 · 直印',
    desc: '前胸 "向上长 / GROW UP" 大字 + 太阳脸（"由内而外"的隐喻），背后小字 "CLAIRE\'S PARLOR"。简单、好印、社群辨识度强。',
  },
];

export type PromptItem = {
  n: string;
  glyph: string;
  name: string;
  text: string;
};

export const PROMPTS: PromptItem[] = [
  {
    n: '01',
    glyph: '🐈',
    name: '铜板儿 主形象 (Jellycat 风毛绒)',
    text: 'A super cute plush toy of a cream-colored British Longhair cat sitting upright, fluffy mane around neck, big round copper-amber eyes with golden centers, pink triangular nose, pink inner ears, sitting pose, Jellycat plush style, soft pastel cream and beige tones, studio white background, product photography, soft natural lighting, 8K, hyperdetailed fur texture, 4:5 aspect ratio',
  },
  {
    n: '02',
    glyph: '🏷️',
    name: '铜板儿 贴纸 (die-cut sticker)',
    text: 'Die-cut vinyl sticker design of a chibi cream cat face, only the head, huge round copper eyes taking up most of the face, tiny pink nose, simple cute kawaii style, thick black outline, flat colors no shading, white background, ready for sticker printing, vector illustration style, kiss-cut sticker, 1:1',
  },
  {
    n: '03',
    glyph: '🎹',
    name: '招牌画面 · 弹琴二人组',
    text: 'Editorial illustration: a young Asian woman with mid-length dark brown hair, wearing round black-framed glasses, gentle smile, playing a Yamaha upright piano, while her fluffy cream British Longhair cat with copper-amber eyes is stepping on the piano keys with one paw, warm afternoon light, cozy living room, "Friends" sitcom aesthetic, Phoebe Buffay vibe but modern, watercolor + soft vector hybrid, 16:9 aspect ratio',
  },
  {
    n: '04',
    glyph: '☕',
    name: 'Mug 印面 · "I\'ll be there for you"',
    text: 'Mug wrap design, cream British Longhair cat face on one side with huge copper eyes, "I\'ll be there for you" handwritten in marker style on the other side, color palette: cream beige + tomato red + Central Perk yellow, simple bold lines, white ceramic mug mockup, product render, 16:9',
  },
  {
    n: '05',
    glyph: '👤',
    name: '玉婷头像 (插画风 IP)',
    text: 'Stylized portrait illustration of a young Asian woman, mid-length dark brown straight hair with bangs, big round black-framed glasses, gentle subtle smile, single-eyelid eyes, fair skin, wearing all black, holding a podcast microphone, friendly approachable vibe, scholarly podcaster aesthetic, flat vector illustration with subtle gradients, cream background, minimal style, 4:5',
  },
  {
    n: '06',
    glyph: '📕',
    name: '封面海报 · Vol.01',
    text: 'Magazine cover poster for "Claire\'s Parlor · Claire 的会客厅 · Vol.01", title "AI 全景框架" in large bold sans-serif, sub-header "S01·E01 · The One About AI", featuring the woman + cat duo (described in prompt 05 + 01), Phoebe-Friends-meets-Thiings aesthetic, Friends color palette (Central Perk orange, mustard yellow, Monica purple), large playful typography, indie zine style, 2:3 aspect ratio, ready for print',
  },
];

// Tongbar floating-pet rotating speech bubble lines
export const TONGBAR_MESSAGES = [
  '喵——欢迎来 Claire 的客厅 ☕',
  '主理人又熬夜剪播客了 😴',
  '听到没？这一句要重录',
  '我饿了，给我一片鸡胸 🍗',
  '钢琴键又被我踩响了 🎹',
  '你点这里干嘛？我在睡觉',
  '主理人犯错我就翻白眼 🙄',
  '客厅永远有 BGM 🎶',
  '今天的封面图……再调一次',
  '这本书的猫描得不像 📚',
];
