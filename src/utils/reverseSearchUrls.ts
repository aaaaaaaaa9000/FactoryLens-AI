/**
 * Helpers to build direct deep search queries across search engines,
 * Facebook, Telegram, Instagram, and Twitter (X) directories.
 */

export interface SearchEngineLink {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  iconName: string;
  badge: string;
  badgeColor: string;
  url: string;
  isImageUpload?: boolean;
}

export function generateReverseSearchLinks(queryKeywords: string[], imageUrl?: string): SearchEngineLink[] {
  const query = encodeURIComponent(queryKeywords.filter(Boolean).join(' '));

  return [
    {
      id: 'google-lens',
      name: 'Google Lens & Images',
      nameAr: 'عدسة جوجل (Google Lens)',
      description: 'أقوى محرك عالمي للتعرف على المنتجات ومطابقة الصور والموديلات المتشابهة بدقة حتى مع اختلاف الزوايا والإضاءة.',
      iconName: 'Sparkles',
      badge: 'الأكثر دقة',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      url: `https://lens.google.com/`,
      isImageUpload: true,
    },
    {
      id: 'yandex-images',
      name: 'Yandex Visual Search',
      nameAr: 'ياندكس للصور (Yandex)',
      description: 'المحرك الأفضل عالمياً في العثور على نفس تصميم الملابس والمنتجات بنمط النسيج وتفاصيل القصات الدقيقة.',
      iconName: 'Image',
      badge: 'الأفضل للملابس والأقمشة',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      url: `https://yandex.com/images/`,
      isImageUpload: true,
    },
    {
      id: 'bing-visual',
      name: 'Bing Visual Search',
      nameAr: 'بينج البصري (Bing)',
      description: 'بحث بصري متقدم ومطابقة الموديلات والمنتجات عبر المتاجر العالمية وكتالوجات المصانع مع معالجة الظلال.',
      iconName: 'Search',
      badge: 'متاجر ومصانع',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      url: `https://www.bing.com/visualsearch`,
      isImageUpload: true,
    },
    {
      id: 'pinterest',
      name: 'Pinterest Search',
      nameAr: 'بينترست (Pinterest)',
      description: 'للبحث عن استايلات وتصميمات الموضة والأزياء والكتالوجات المماثلة الملتقطة بزوايا احترافية.',
      iconName: 'Flame',
      badge: 'كتالوجات وأزياء',
      badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
      url: `https://www.pinterest.com/search/pins/?q=${query}`,
      isImageUpload: false,
    },
  ];
}

export function generateFacebookDeepLinks(factoryName: string, modelCode?: string, category?: string) {
  const baseName = factoryName.trim();
  const cleanModel = modelCode?.trim() || '';

  const qFactory = encodeURIComponent(baseName);
  const qFactoryWholesale = encodeURIComponent(`مصنع ${baseName} جملة`);
  const qFactoryGroup = encodeURIComponent(`جروب مصنع ${baseName}`);
  const qModel = cleanModel ? encodeURIComponent(`${baseName} ${cleanModel}`) : qFactory;

  return [
    {
      id: 'fb-pages',
      title: 'صفحات المصنع الرسمية',
      titleEn: 'Facebook Pages',
      subtitle: `البحث عن صفحات بيزنس المصنع: "${baseName}"`,
      badge: 'صفحات معتمدة',
      url: `https://www.facebook.com/search/pages/?q=${qFactoryWholesale}`,
      color: 'from-blue-600 to-indigo-600',
    },
    {
      id: 'fb-groups',
      title: 'مجموعات تجار الجملة والمصانع',
      titleEn: 'Wholesale Groups',
      subtitle: `البحث في مجموعات تجار ومكاتب الجملة عن: "${baseName}"`,
      badge: 'أسعار الجملة',
      url: `https://www.facebook.com/search/groups/?q=${qFactoryGroup}`,
      color: 'from-indigo-600 to-purple-600',
    },
    {
      id: 'fb-posts',
      title: 'منشورات الموديل وكود القطعة',
      titleEn: 'Posts & Model Codes',
      subtitle: `البحث في كافة البوستات عن كود القطعة: "${cleanModel || baseName}"`,
      badge: 'أحدث العروض',
      url: `https://www.facebook.com/search/posts/?q=${qModel}`,
      color: 'from-sky-600 to-blue-600',
    },
    {
      id: 'fb-marketplace',
      title: 'ماركت بليس فيسبوك',
      titleEn: 'Marketplace Deals',
      subtitle: `البحث في صفقات البيع المباشر عن منتجات المصنع`,
      badge: 'أسعار معلنة',
      url: `https://www.facebook.com/marketplace/search/?query=${qFactory}`,
      color: 'from-violet-600 to-indigo-600',
    },
  ];
}

export function generateTelegramDeepLinks(factoryName: string, modelCode?: string, category?: string) {
  const baseName = factoryName.trim();
  const qFactory = encodeURIComponent(`مصنع ${baseName} جملة`);
  const qTgRaw = encodeURIComponent(baseName);

  return [
    {
      id: 'tg-app-direct',
      title: 'فتح تطبيق تليجرام المباشر',
      titleEn: 'Open in Telegram App',
      subtitle: `بحث داخلي فوري في تطبيق تليجرام عن: "${baseName}"`,
      badge: 'تطبيق مباشر',
      url: `tg://search?query=${encodeURIComponent(baseName)}`,
      color: 'from-sky-500 to-blue-600',
    },
    {
      id: 'tg-web-channels',
      title: 'بحث جوجل المتخصص لقنوات تليجرام',
      titleEn: 'Google site:t.me search',
      subtitle: `كشف جميع قنوات ومجموعات تليجرام المفتوحة للمصنع ومكاتبه`,
      badge: 'قنوات ومجموعات',
      url: `https://www.google.com/search?q=site:t.me+${encodeURIComponent(`"${baseName}" جملة OR مصنع`)}`,
      color: 'from-cyan-500 to-blue-600',
    },
    {
      id: 'tg-tgstat',
      title: 'محرك دليل TGStat العالمي',
      titleEn: 'TGStat Channel Directory',
      subtitle: `البحث في أرشيف القنوات والمجموعات التجارية الرائدة والمصانع`,
      badge: 'دليل قنوات موثق',
      url: `https://tgstat.com/search?q=${qTgRaw}`,
      color: 'from-blue-600 to-indigo-700',
    },
    {
      id: 'tg-telemetr',
      title: 'محرك Telemetr لإحصاء القنوات',
      titleEn: 'Telemetr Telegram Search',
      subtitle: `فحص قنوات المصانع ومكاتب التوريد والتواصل المباشر`,
      badge: 'فحص التفاعل',
      url: `https://telemetr.io/en/channels?filter%5Bsearch%5D=${qTgRaw}`,
      color: 'from-indigo-500 to-sky-600',
    },
  ];
}

export function generateInstagramDeepLinks(factoryName: string, modelCode?: string, category?: string) {
  const baseName = factoryName.trim();
  const cleanModel = modelCode?.trim() || '';
  const cleanTag = baseName.replace(/[\s\-_]+/g, '_');
  const qFactory = encodeURIComponent(`"مصنع ${baseName}"`);

  return [
    {
      id: 'ig-google-profiles',
      title: 'كشف حسابات المصنع على انستغرام',
      titleEn: 'Google site:instagram.com',
      subtitle: `البحث عن بروفايل المصنع المعتمد ومعارض الملابس: "${baseName}"`,
      badge: 'حسابات ومتاجر',
      url: `https://www.google.com/search?q=site:instagram.com+${encodeURIComponent(`"${baseName}" OR "مصنع ${baseName}"`)}`,
      color: 'from-pink-600 to-rose-600',
    },
    {
      id: 'ig-hashtag-search',
      title: 'هاشتاج المصنع والموديل',
      titleEn: 'Factory Hashtag',
      subtitle: `استعراض المنشورات ومقاطع الريلز تحت وسم: #${cleanTag}`,
      badge: 'ريلز وصور',
      url: `https://www.instagram.com/explore/tags/${encodeURIComponent(cleanTag)}/`,
      color: 'from-fuchsia-600 to-pink-500',
    },
    {
      id: 'ig-model-search',
      title: 'منشورات كود الموديل بالصور',
      titleEn: 'Model Code Posts',
      subtitle: `البحث عن صور الموديل الملتقطة بالفيديو والريلز: "${cleanModel || baseName}"`,
      badge: 'صور الموديل',
      url: `https://www.google.com/search?q=site:instagram.com+${encodeURIComponent(`"${baseName}" "${cleanModel}"`)}`,
      color: 'from-purple-600 to-pink-600',
    },
    {
      id: 'ig-direct-app',
      title: 'فتح بحث تطبيق انستغرام',
      titleEn: 'Instagram App Search',
      subtitle: `استكشاف الموديلات المشابهة وموردي الجملة عبر انستغرام`,
      badge: 'تطبيق مباشر',
      url: `https://www.instagram.com/explore/search/`,
      color: 'from-rose-500 to-amber-500',
    },
  ];
}

export function generateTwitterDeepLinks(factoryName: string, modelCode?: string, category?: string) {
  const baseName = factoryName.trim();
  const cleanModel = modelCode?.trim() || '';
  const qXAll = encodeURIComponent(`"${baseName}" (مصنع OR جملة OR توريد OR تصنيع)`);
  const qXMedia = encodeURIComponent(`"${baseName}" filter:media`);
  const qXUsers = encodeURIComponent(`"${baseName}"`);

  return [
    {
      id: 'tw-posts-latest',
      title: 'أحدث تغريدات وإعلانات المصنع',
      titleEn: 'Latest Tweets & News',
      subtitle: `البحث المباشر في أحدث تغريدات المصنع وعروض التوريد على منصة X`,
      badge: 'تغريدات حية',
      url: `https://x.com/search?q=${qXAll}&f=live`,
      color: 'from-slate-700 to-slate-900',
    },
    {
      id: 'tw-media-photos',
      title: 'صور وفيديوهات الموديلات على X',
      titleEn: 'Media & Photo Feed',
      subtitle: `فحص صور المنتجات المرفوعة من المعارض والمصنع على تويتر`,
      badge: 'صور وفيديوهات',
      url: `https://x.com/search?q=${qXMedia}&f=media`,
      color: 'from-slate-800 to-blue-900',
    },
    {
      id: 'tw-accounts',
      title: 'حسابات المصانع والشركات',
      titleEn: 'Official Accounts on X',
      subtitle: `البحث في الحسابات الرسمية الموثقة للمصانع والورش والمسؤولين`,
      badge: 'حسابات موثقة',
      url: `https://x.com/search?q=${qXUsers}&f=user`,
      color: 'from-blue-700 to-slate-900',
    },
    {
      id: 'tw-google-x',
      title: 'أرشيف تويتر المتخصص عبر جوجل',
      titleEn: 'Google site:x.com',
      subtitle: `كشف ثريدات وصفقات الجملة وأرقام التواصل المذكورة في التغريدات`,
      badge: 'أرشيف صفقات',
      url: `https://www.google.com/search?q=site:x.com+${encodeURIComponent(`"${baseName}" (مصنع OR هاتف OR واتساب)`)}`,
      color: 'from-cyan-700 to-slate-800',
    },
  ];
}
