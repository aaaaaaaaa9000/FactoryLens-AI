export interface ExtractedSpecs {
  colors?: string[];
  materials?: string[];
  sizes?: string[];
  wholesalePackaging?: string;
}

export interface ExtractedContact {
  phones?: string[];
  addresses?: string[];
  socialHandles?: string[];
}

export interface LogoDetails {
  hasLogo: boolean;
  logoText?: string;
  description?: string;
}

export interface VisualFingerprint {
  structuralSilhouette: string; // الوصف الهندسي للقصّة والأبعاد المقاوم لزاوية التصوير
  colorPaletteInvariant: string[]; // لوحة الألوان المقاومة لدرجات الإضاءة وظلال الفلاش
  textureAndFabricPattern: string; // نمط النسيج والتطريز وخامة التصنيع
  invariantKeypoints: string[]; // نقاط التمايز البصري الثابتة غير المتأثرة بالدوران والقص
  lightingAndAngleToleranceNotes: string; // تقرير معالجة تشوهات الإضاءة وزاوية الالتقاط
  robustSearchTokens: string[]; // كلمات دلالية بصرية محكمة للبحث العكسي
}

export interface VisualSimilarityMetrics {
  overallScore: number; // النسبة الإجمالية للثقة والمطابقة (0-100)
  structuralMatch: number; // مطابقة الهيكل والقصة (مقاوم للتكبير/التصغير)
  textureColorMatch: number; // مطابقة النسيج والألوان (مقاوم لاختلاف الإضاءة)
  logoTypographyMatch: number; // مطابقة الشعار وهندسة الخط (مقاوم للميلان والانحراف)
  detailsHardwareMatch: number; // مطابقة تفاصيل الخياطة والأزرار والإكسسوار
}

export interface SearchQueries {
  facebookPageQueries: string[];
  facebookGroupQueries?: string[];
  telegramQueries: string[];
  instagramQueries: string[]; // استعلامات انستغرام (حسابات وهاشتاجات)
  twitterQueries: string[]; // استعلامات تويتر / إكس (حسابات وتغريدات)
  reverseImageKeywords: string[];
  multiAngleReverseQueries: string[]; // استعلامات بصرية مقاومة للزوايا المختلفة
}

export interface ImageAnalysisResult {
  factoryName: string;
  factoryNameEn?: string;
  confidence: 'عالي' | 'متوسط' | 'غير مؤكد' | string;
  logoDetails: LogoDetails;
  fullOcrText: string;
  productTitle: string;
  productCategory: string;
  modelCodes?: string[];
  contactInfo?: ExtractedContact;
  specs?: ExtractedSpecs;
  visualFeatures?: string[];
  visualFingerprint?: VisualFingerprint;
  similarityMetrics?: VisualSimilarityMetrics;
  searchQueries: SearchQueries;
  summaryAr: string;
}

export interface FacebookFinding {
  title: string;
  url: string;
  snippet: string;
  type: string; // 'صفحة رسمية' | 'جروب جملة' | 'مكتب توزيع'
  phone?: string;
  location?: string;
}

export interface TelegramFinding {
  title: string;
  url: string;
  username?: string;
  snippet: string;
  category?: string;
}

export interface InstagramFinding {
  title: string;
  url: string;
  username?: string;
  snippet: string;
  followersHint?: string;
  accountType?: string; // 'حساب مصنع رسمي' | 'متجر جملة وتوزيع' | 'معرض منتجات'
}

export interface TwitterFinding {
  title: string;
  url: string;
  handle?: string;
  snippet: string;
  postDate?: string;
  relevance?: string; // 'إعلان مصنع' | 'توريد جملة' | 'مكتب بيع'
}

export interface WholesaleSource {
  title: string;
  url: string;
  platform: string;
  snippet: string;
}

export interface GroundedSearchResult {
  factoryOverview: string;
  facebookFindings: FacebookFinding[];
  telegramFindings: TelegramFinding[];
  instagramFindings?: InstagramFinding[];
  twitterFindings?: TwitterFinding[];
  otherWholesaleSources?: WholesaleSource[];
  contactDirectory?: {
    phones?: string[];
    whatsapps?: string[];
    knownAddresses?: string[];
  };
  actionTips: string[];
}

export interface GroundingSource {
  title: string;
  uri: string;
}

export interface HistoryItem {
  id: string;
  timestamp: number;
  imageBase64: string;
  factoryName: string;
  productTitle: string;
  category: string;
  analysis: ImageAnalysisResult;
  searchResult?: GroundedSearchResult;
}

export interface FilterOptions {
  city: string;
  hasPhoneOnly: boolean;
  wholesaleOnly: boolean;
  category: string;
}
