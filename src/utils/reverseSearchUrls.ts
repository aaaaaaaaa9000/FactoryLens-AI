/**
 * Helpers to build direct deep search queries across search engines,
 * Facebook directories, and Telegram channels.
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
      description: 'أقوى محرك عالمي للتعرف على المنتجات ومطابقة الصور والموديلات المتشابهة بدقة.',
      iconName: 'Sparkles',
      badge: 'الأكثر دقة',
      badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      url: `https://www.google.com/search?q=${query}&tbm=isch`,
      isImageUpload: true,
    },
    {
      id: 'yandex-images',
      name: 'Yandex Visual Search',
      nameAr: 'ياندكس للصور (Yandex)',
      description: 'المحرك الأفضل عالمياً في العثور على نفس تصميم الملابس والمنتجات والعلامات التجارية بدقة متناهية.',
      iconName: 'Image',
      badge: 'الأفضل للملابس',
      badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      url: `https://yandex.com/images/search?text=${query}`,
      isImageUpload: true,
    },
    {
      id: 'bing-visual',
      name: 'Bing Visual Search',
      nameAr: 'بينج البصري (Bing)',
      description: 'بحث بصري متقدم ومطابقة الموديلات والمنتجات عبر المتاجر العالمية ومنصات البيع.',
      iconName: 'Search',
      badge: 'متاجر ومصانع',
      badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
      url: `https://www.bing.com/images/search?q=${query}`,
      isImageUpload: true,
    },
    {
      id: 'pinterest',
      name: 'Pinterest Search',
      nameAr: 'بينترست (Pinterest)',
      description: 'للبحث عن استايلات وتصميمات الموضة والأزياء والكتالوجات المماثلة.',
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
  const cleanCategory = category?.trim() || '';

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
