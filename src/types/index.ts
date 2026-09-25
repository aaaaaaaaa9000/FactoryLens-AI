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

export interface SearchQueries {
  facebookPageQueries: string[];
  facebookGroupQueries?: string[];
  telegramQueries: string[];
  reverseImageKeywords: string[];
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
