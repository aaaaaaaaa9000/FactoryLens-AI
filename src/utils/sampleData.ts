import { ImageAnalysisResult, GroundedSearchResult } from '../types';

export interface SampleItem {
  id: string;
  name: string;
  category: string;
  description: string;
  imageBase64: string;
  mockAnalysis: ImageAnalysisResult;
  mockSearch: GroundedSearchResult;
}

// Generate realistic SVG image tags as data URIs
function createTagSvg(
  factoryName: string,
  modelCode: string,
  category: string,
  phone: string,
  location: string,
  specs: string,
  accentColor: string
): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="700" viewBox="0 0 600 700">
    <defs>
      <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#1e293b"/>
        <stop offset="100%" stop-color="#0f172a"/>
      </linearGradient>
      <linearGradient id="gold" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="${accentColor}"/>
        <stop offset="100%" stop-color="#f59e0b"/>
      </linearGradient>
    </defs>
    
    <!-- Background Card -->
    <rect width="600" height="700" fill="url(#bg)" rx="24"/>
    <rect x="20" y="20" width="560" height="660" fill="none" stroke="${accentColor}" stroke-width="2" stroke-dasharray="6,4" rx="16"/>

    <!-- Hole for tag string -->
    <circle cx="300" cy="50" r="14" fill="#334155" stroke="#64748b" stroke-width="3"/>
    <circle cx="300" cy="50" r="8" fill="#0f172a"/>

    <!-- Logo Emblem -->
    <g transform="translate(260, 90)">
      <polygon points="40,0 80,25 80,70 40,95 0,70 0,25" fill="none" stroke="url(#gold)" stroke-width="4"/>
      <path d="M25,50 L40,30 L55,50 L40,65 Z" fill="${accentColor}"/>
      <circle cx="40" cy="48" r="6" fill="#ffffff"/>
    </g>

    <!-- Factory Name Header -->
    <text x="300" y="225" font-family="Cairo, sans-serif" font-size="28" font-weight="bold" fill="#ffffff" text-anchor="middle" direction="rtl">
      ${factoryName}
    </text>
    <text x="300" y="255" font-family="sans-serif" font-size="13" letter-spacing="3" fill="#94a3b8" text-anchor="middle">
      PREMIUM INDUSTRIAL QUALITY
    </text>

    <!-- Divider line -->
    <line x1="80" y1="280" x2="520" y2="280" stroke="#334155" stroke-width="2"/>

    <!-- Details Grid -->
    <g transform="translate(60, 310)" font-family="Cairo, sans-serif" font-size="17" fill="#cbd5e1" direction="rtl">
      <text x="480" y="30" font-weight="bold" fill="${accentColor}">التصنيف: <tspan fill="#ffffff">${category}</tspan></text>
      <text x="480" y="70" font-weight="bold" fill="${accentColor}">كود الموديل: <tspan fill="#38bdf8" font-family="monospace" font-size="20">${modelCode}</tspan></text>
      <text x="480" y="110" font-weight="bold" fill="${accentColor}">المواصفات: <tspan fill="#ffffff">${specs}</tspan></text>
      <text x="480" y="150" font-weight="bold" fill="${accentColor}">العنوان / الإدارة: <tspan fill="#ffffff">${location}</tspan></text>
      <text x="480" y="190" font-weight="bold" fill="${accentColor}">مبيعات الجملة وواتساب: <tspan fill="#4ade80" font-family="monospace" font-size="19">${phone}</tspan></text>
    </g>

    <!-- Barcode Box -->
    <rect x="140" y="530" width="320" height="90" fill="#ffffff" rx="8"/>
    <g transform="translate(170, 545)" fill="#000000">
      <!-- Simulated Barcode Lines -->
      <rect x="0" y="0" width="4" height="50"/>
      <rect x="8" y="0" width="2" height="50"/>
      <rect x="14" y="0" width="6" height="50"/>
      <rect x="24" y="0" width="3" height="50"/>
      <rect x="32" y="0" width="5" height="50"/>
      <rect x="42" y="0" width="2" height="50"/>
      <rect x="48" y="0" width="6" height="50"/>
      <rect x="60" y="0" width="4" height="50"/>
      <rect x="70" y="0" width="3" height="50"/>
      <rect x="80" y="0" width="7" height="50"/>
      <rect x="94" y="0" width="2" height="50"/>
      <rect x="100" y="0" width="5" height="50"/>
      <rect x="110" y="0" width="3" height="50"/>
      <rect x="120" y="0" width="6" height="50"/>
      <rect x="132" y="0" width="4" height="50"/>
      <rect x="142" y="0" width="2" height="50"/>
      <rect x="150" y="0" width="6" height="50"/>
      <rect x="162" y="0" width="3" height="50"/>
      <rect x="172" y="0" width="5" height="50"/>
      <rect x="182" y="0" width="4" height="50"/>
      <rect x="192" y="0" width="6" height="50"/>
      <rect x="204" y="0" width="2" height="50"/>
      <rect x="212" y="0" width="5" height="50"/>
      <rect x="224" y="0" width="4" height="50"/>
      <rect x="234" y="0" width="6" height="50"/>
      <rect x="246" y="0" width="3" height="50"/>
      <text x="130" y="66" font-family="monospace" font-size="12" fill="#000000" text-anchor="middle">6 221045 ${modelCode.replace(/[^0-9]/g, '') || '987654'}</text>
    </g>

    <!-- Footer stamp -->
    <text x="300" y="655" font-family="Cairo, sans-serif" font-size="14" fill="#64748b" text-anchor="middle">
      سيرية كاملة - بيع جملة المصنع فقط - ممنوع بيع القطاعي
    </text>
  </svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const SAMPLE_DATA: SampleItem[] = [
  {
    id: 'sample-al-nour',
    name: 'تيكت مصنع النور للأزياء والتريكو',
    category: 'ملابس حريمي وترنجات شتوي',
    description: 'بطاقة ملابس تحتوي على اسم المصنع، شعار سداسي، كود موديل 704، ورقم واتساب المبيعات في العاشر من رمضان.',
    imageBase64: createTagSvg(
      'مصنع النور للأزياء والملابس الجاهزة',
      'MOD-704-NOUR',
      'ترنج شتوي قطن ميلتون مبطن',
      '01092837465',
      'المنطقة الصناعية - العاشر من رمضان',
      'قطن 100% - سيرية 4 قطع (L-XL-2XL-3XL)',
      '#eab308'
    ),
    mockAnalysis: {
      factoryName: 'مصنع النور للأزياء والملابس الجاهزة',
      factoryNameEn: 'Al Nour Garments & Fashion Factory',
      confidence: 'عالي',
      logoDetails: {
        hasLogo: true,
        logoText: 'AL NOUR',
        description: 'شعار هندسي سداسي الشكل بداخله ماسة ونجمة باللون الذهبي المميز',
      },
      fullOcrText: `مصنع النور للأزياء والملابس الجاهزة\nPREMIUM INDUSTRIAL QUALITY\nالتصنيف: ترنج شتوي قطن ميلتون مبطن\nكود الموديل: MOD-704-NOUR\nالمواصفات: قطن 100% - سيرية 4 قطع (L-XL-2XL-3XL)\nالعنوان: المنطقة الصناعية - العاشر من رمضان\nمبيعات الجملة وواتساب: 01092837465\nباركود: 6 221045 704987\nسيرية كاملة - بيع جملة المصنع فقط`,
      productTitle: 'ترنج شتوي ميلتون مبطن خروج كود 704',
      productCategory: 'ملابس حريمي وكاجوال شتوي',
      modelCodes: ['MOD-704-NOUR', '704'],
      contactInfo: {
        phones: ['01092837465'],
        addresses: ['المنطقة الصناعية B1، العاشر من رمضان، مصر'],
        socialHandles: ['@al_nour_fashion', 'fb.com/alnourgarments'],
      },
      specs: {
        colors: ['أسود كلاسيك', 'زيتي ملكي', 'كشمير دافئ', 'هافان'],
        materials: ['ميلتون معالج ضد الانكماش', 'قطن 100%'],
        sizes: ['L', 'XL', '2XL', '3XL'],
        wholesalePackaging: 'سيرية كاملة 4 قطع ألوان مختلفة، كرتونة التوزيع 24 قطعة',
      },
      visualFeatures: [
        'ياقة دائرية محكمة',
        'تطريز بارز على الصدر لشعار النور',
        'شريط جانبي مميز على البنطلون',
        'أساور قطنية مضلعة',
      ],
      searchQueries: {
        facebookPageQueries: [
          'مصنع النور للأزياء العاشر من رمضان جملة',
          'مكتب النور ترنجات شتوي كود 704',
          'جروب مصنع النور للملابس الجاهزة فيسبوك',
        ],
        facebookGroupQueries: [
          'جروبات جملة ملابس العاشر من رمضان النور',
          'تجار ملابس العتبة والموسكي مصنع النور',
        ],
        telegramQueries: [
          'قناة مصنع النور للأزياء تليجرام',
          'مكتب النور جملة العاشر t.me',
          'مصنع النور كود 704 تليجرام',
        ],
        reverseImageKeywords: [
          'مصنع النور ملابس العاشر من رمضان',
          'MOD-704-NOUR ترنج قطن ميلتون',
          'Al Nour garments wholesale Egypt',
        ],
      },
      summaryAr:
        'تم التعرف بنجاح وبدقة فائقة على مصنع "النور للأزياء" بالعاشر من رمضان، وتحديد كود الموديل MOD-704-NOUR مع رقم واتساب مبيعات الجملة وبيانات السيرية والمقاسات.',
    },
    mockSearch: {
      factoryOverview:
        'مصنع النور للأزياء والملابس الجاهزة يعد من كبرى الورش والمصانع المتخصصة في الترنجات والملابس الرياضية والكاجوال بالعاشر من رمضان، وله مكاتب توزيع رئيسية في العتبة (شارع الرويعي) ووكالة البلح والإسكندرية.',
      facebookFindings: [
        {
          title: 'صفحة مصنع النور للملابس الجاهزة - Al Nour Factory',
          url: 'https://www.facebook.com/search/pages/?q=مصنع+النور+العاشر+من+رمضان',
          snippet:
            'الصفحة الرسمية لمصنع النور للأزياء - العاشر من رمضان، عرض أحدث كولكشن شتوي وصيفي بأسعار المصنع مباشرة بدون وسطاء.',
          type: 'صفحة رسمية',
          phone: '01092837465',
          location: 'العاشر من رمضان / مكتب العتبة',
        },
        {
          title: 'جروب تجار جملة ملابس العاشر ومصنع النور',
          url: 'https://www.facebook.com/search/groups/?q=جروب+مصنع+النور+ملابس',
          snippet:
            'تجمع تجار الجملة وأصحاب المحلات لعرض موديلات مصنع النور فوري وكود 704 وحجز السريات للشحن لجميع المحافظات.',
          type: 'جروب جملة',
          phone: '01092837465',
          location: 'مصر - شحن لجميع المحافظات',
        },
      ],
      telegramFindings: [
        {
          title: 'قناة مصنع النور جملة فقط (Al Nour Official)',
          url: 'https://t.me/s/al_nour_fashion',
          username: '@al_nour_fashion',
          snippet:
            'قناة تليجرام الرئيسية لعرض صور وفيديوهات الموديلات على الطبيعة بكود الموديل والأسعار جملة أول يد.',
          category: 'قناة مصنع رسمية',
        },
        {
          title: 'مكتب توزيع النور - وكيل العتبة والموسكي',
          url: 'https://t.me/s/elnour_wholesale',
          username: '@elnour_wholesale',
          snippet:
            'عرض السريات المتاحة فورياً واستلام من مقر المكتب بالعتبة أو حجز شحن محافظات.',
          category: 'مكتب جملة وتوزيع',
        },
      ],
      contactDirectory: {
        phones: ['01092837465'],
        whatsapps: ['https://wa.me/201092837465'],
        knownAddresses: ['المنطقة الصناعية الثالثة B1، العاشر من رمضان', 'مكتب التوزيع: العتبة، عمارة الأوقاف، القاهرة'],
      },
      actionTips: [
        'اطلب دائماً السعر لجملة الدستة أو السيرية، فالمصنع لا يبيع بالقطعة.',
        'تأكد من وجود الكود الأصلي MOD-704 لتجنب الموديلات المقلدة التي تصنع بخامات مخلوطة.',
        'يمكنك التواصل عبر رابط واتساب المباشر لمطابقة كروت المقاسات قبل تحويل العربون.',
      ],
    },
  },
  {
    id: 'sample-royal-shoes',
    name: 'ستيكر كرتونة مصنع رويال للأحذية',
    category: 'أحذية رياضية وكوتشيات',
    description: 'بيانات كرتونة كوتشي من مصنع رويال فوتوير بالمحلة الكبرى مع كود الموديل ومقاسات 41-45.',
    imageBase64: createTagSvg(
      'مصنع رويال للأحذية الرياضية والفوتوير',
      'ROYAL-RUN-2026',
      'كوتشي رياضي فوم خفيف طبي',
      '01154789632',
      'المحلة الكبرى - منطقة الورش الصناعية',
      'سيرية 8 أزواج - نعل حقن إيفا مستورد',
      '#06b6d4'
    ),
    mockAnalysis: {
      factoryName: 'مصنع رويال للأحذية والفوتوير',
      factoryNameEn: 'Royal Shoes & Footwear Industry',
      confidence: 'عالي',
      logoDetails: {
        hasLogo: true,
        logoText: 'ROYAL SPORT',
        description: 'تاج ملكي محاط برسم ديناميكي رياضي باللون الفيروزي والأزرق',
      },
      fullOcrText: `مصنع رويال للأحذية الرياضية والفوتوير\nPREMIUM INDUSTRIAL QUALITY\nالتصنيف: كوتشي رياضي فوم خفيف طبي\nكود الموديل: ROYAL-RUN-2026\nالمواصفات: سيرية 8 أزواج - نعل حقن إيفا مستورد\nالعنوان: المحلة الكبرى - منطقة الورش الصناعية\nمبيعات الجملة وواتساب: 01154789632\nباركود: 6 221045 202688`,
      productTitle: 'كوتشي رويال طبي نعل فوم ميموري كود 2026',
      productCategory: 'أحذية رياضية وسنيكرز',
      modelCodes: ['ROYAL-RUN-2026', '2026'],
      contactInfo: {
        phones: ['01154789632'],
        addresses: ['منطقة الورش الصناعية، المحلة الكبرى، الغربية'],
        socialHandles: ['@royal_shoes_wholesale'],
      },
      specs: {
        colors: ['أبيض * رصاصي', 'أسود فل كربون', 'كحلي نيون'],
        materials: ['قماش شبكي تنفسي Mesh', 'نعل إيفا فوم مرن طبي'],
        sizes: ['41', '42', '43', '44', '45'],
        wholesalePackaging: 'كرتونة 8 أزواج مكررة المقاسات الأكثر طلباً',
      },
      visualFeatures: [
        'نعل ممتص للصدمات مرتفع من الخلف',
        'شعار التاج مطبوع على اللسان والجوانب',
        'فرش طبي ميموري فوم مضاد للروائح',
      ],
      searchQueries: {
        facebookPageQueries: [
          'مصنع رويال للأحذية المحلة الكبرى جملة',
          'كوتشيات رويال سبورت جملة كود 2026',
          'مكتب أحذية رويال باب الشعرية والعتبة',
        ],
        facebookGroupQueries: [
          'جروب تجار أحذية وكوتشيات جملة مصر',
          'سوق أحذية المحلة وباب الشعرية رويال',
        ],
        telegramQueries: [
          'قناة كوتشيات رويال جملة تليجرام',
          'مصنع رويال أحذية t.me',
          'كوتشي 2026 رويال جملة',
        ],
        reverseImageKeywords: [
          'كوتشي رويال مصنع المحلة',
          'ROYAL-RUN-2026 sneaker wholesale',
          'مصنع أحذية رياضية رويال',
        ],
      },
      summaryAr:
        'تم استخراج تفاصيل مصنع "رويال للأحذية" بالمحلة الكبرى، وكود الموديل الطبي 2026، مع أرقام التواصل لحجز كراتين الجملة والسريات.',
    },
    mockSearch: {
      factoryOverview:
        'مصنع رويال للأحذية والكوتشيات يعد من أبرز مصنعي الأحذية الرياضية الاقتصادية والطبية بالمحلة الكبرى وباب الشعرية، ويوفر توريداً لكبرى المحلات والمعارض بجميع المحافظات.',
      facebookFindings: [
        {
          title: 'صفحة رويال شوز للأحذية الرياضية جملة المصنع',
          url: 'https://www.facebook.com/search/pages/?q=مصنع+رويال+أحذية+المحلة',
          snippet:
            'المصنع الأول لتصنيع وتصدير الكوتشي الرياضي بنعل الحقن المستورد - عروض خاصة للكميات وأصحاب المحلات التجارية.',
          type: 'صفحة رسمية',
          phone: '01154789632',
          location: 'المحلة الكبرى / معرض باب الشعرية بالقاهرة',
        },
      ],
      telegramFindings: [
        {
          title: 'قناة كوتشيات مصنع رويال (Royal Footwear Wholesale)',
          url: 'https://t.me/s/royal_shoes_wholesale',
          username: '@royal_shoes_wholesale',
          snippet: 'قناة متخصصة لعرض صور الكوتشيات وفيديوهات المرونة والوزن مع كروت المقاسات والأسعار للجملة فقط.',
          category: 'قناة مصنع',
        },
      ],
      contactDirectory: {
        phones: ['01154789632'],
        whatsapps: ['https://wa.me/201154789632'],
        knownAddresses: ['المحلة الكبرى، طريق طنطا القديم', 'معرض التوزيع: باب الشعرية، القاهرة'],
      },
      actionTips: [
        'احرص على طلب الكشف عن كثافة النعل (حَقْن إيفا خفيف) لضمان الخامات الطبية الممتازة.',
        'يقدم المصنع خصماً إضافياً عند شراء أكثر من 5 كراتين مجمعة.',
      ],
    },
  },
];
