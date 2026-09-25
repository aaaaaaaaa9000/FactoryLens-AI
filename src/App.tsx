import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  AlertTriangle,
  RefreshCw,
  Search,
  Building2,
  Send,
  Facebook,
  Instagram,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  HelpCircle,
} from 'lucide-react';
import {
  ImageAnalysisResult,
  GroundedSearchResult,
  GroundingSource,
  HistoryItem,
} from './types';
import { SAMPLE_DATA, SampleItem } from './utils/sampleData';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { AnalysisOverview } from './components/AnalysisOverview';
import { RefineSearchModal } from './components/RefineSearchModal';
import { ExportDossierModal } from './components/ExportDossierModal';
import { HistoryDrawer } from './components/HistoryDrawer';
import { UserGuideModal } from './components/UserGuideModal';

const HISTORY_STORAGE_KEY = 'factory_lens_history_v1';

export default function App() {
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<ImageAnalysisResult | null>(null);
  const [searchResult, setSearchResult] = useState<GroundedSearchResult | null>(null);
  const [groundingSources, setGroundingSources] = useState<GroundingSource[]>([]);

  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [loadingStep, setLoadingStep] = useState<string>('');
  const [isSearchingFactory, setIsSearchingFactory] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);
  const [isRefineModalOpen, setIsRefineModalOpen] = useState<boolean>(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState<boolean>(false);

  // Load history from localStorage on initial render
  useEffect(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to load history from localStorage', e);
    }
  }, []);

  // Save history item
  const saveToHistory = (
    image: string,
    res: ImageAnalysisResult,
    sRes?: GroundedSearchResult
  ) => {
    try {
      const newItem: HistoryItem = {
        id: 'hist_' + Date.now(),
        timestamp: Date.now(),
        imageBase64: image,
        factoryName: res.factoryName,
        productTitle: res.productTitle,
        category: res.productCategory,
        analysis: res,
        searchResult: sRes,
      };

      const updated = [newItem, ...history.filter((h) => h.factoryName !== res.factoryName)].slice(0, 15);
      setHistory(updated);
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('LocalStorage save failed (possibly quota limit on large images)', e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
  };

  // Perform Image Analysis
  const handleAnalyzeImage = async (
    imageBase64: string,
    mimeType: string,
    userPrompt: string
  ) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    setCurrentImage(imageBase64);
    setLoadingStep('جارٍ قراءة النصوص وفحص اللوجو والشعار عبر الذكاء الاصطناعي...');

    try {
      const response = await fetch('/api/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageBase64, mimeType, userPrompt }),
      });

      const resData = await response.json();

      if (!response.ok || !resData.success) {
        throw new Error(resData.error || 'فشل تحليل الصورة، يرجى المحاولة مرة أخرى.');
      }

      const extractedData: ImageAnalysisResult = resData.data;
      setAnalysis(extractedData);

      // Now run live factory search for Facebook & Telegram in background
      setLoadingStep('جارٍ البحث المباشر في صفحات فيسبوك وقنوات تليجرام...');
      executeFactorySearch({
        factoryName: extractedData.factoryName,
        modelCode: extractedData.modelCodes?.[0] || '',
        category: extractedData.productCategory || '',
        location: extractedData.contactInfo?.addresses?.[0] || 'مصر والوطن العربي',
        additionalKeywords: '',
      }, extractedData, imageBase64);

    } catch (err: any) {
      console.error('Analysis error:', err);
      setErrorMessage(err.message || 'تعذر الاتصال بخادم التحليل.');
    } finally {
      setIsAnalyzing(false);
      setLoadingStep('');
    }
  };

  // Execute Grounded Factory Search across Facebook & Telegram
  const executeFactorySearch = async (
    params: {
      factoryName: string;
      modelCode?: string;
      category?: string;
      location?: string;
      additionalKeywords?: string;
    },
    currentAnalysis?: ImageAnalysisResult,
    imgToSave?: string
  ) => {
    setIsSearchingFactory(true);
    try {
      const response = await fetch('/api/search-factory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      const resData = await response.json();

      if (response.ok && resData.success) {
        setSearchResult(resData.data);
        setGroundingSources(resData.groundingSources || []);

        const targetAnalysis = currentAnalysis || analysis;
        const targetImage = imgToSave || currentImage;
        if (targetAnalysis && targetImage) {
          saveToHistory(targetImage, targetAnalysis, resData.data);
        }
      } else {
        console.warn('Search returned error, continuing with extracted data', resData.error);
      }
    } catch (err) {
      console.error('Factory search failed:', err);
    } finally {
      setIsSearchingFactory(false);
    }
  };

  // Select Sample item
  const handleSelectSample = (sample: SampleItem) => {
    setCurrentImage(sample.imageBase64);
    setAnalysis(sample.mockAnalysis);
    setSearchResult(sample.mockSearch);
    setGroundingSources([
      { title: 'Google Grounded Wholesale Database', uri: 'https://google.com' },
      { title: 'Egyptian Wholesale Factory Directory', uri: 'https://facebook.com' },
    ]);
    setErrorMessage(null);
    saveToHistory(sample.imageBase64, sample.mockAnalysis, sample.mockSearch);
  };

  // Restore item from history
  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentImage(item.imageBase64);
    setAnalysis(item.analysis);
    setSearchResult(item.searchResult || null);
    setErrorMessage(null);
  };

  // Start new scan
  const handleNewScan = () => {
    setAnalysis(null);
    setSearchResult(null);
    setGroundingSources([]);
    setErrorMessage(null);
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-['Cairo',sans-serif]">
      {/* Top Header */}
      <Header
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        historyCount={history.length}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 space-y-6">
        {/* Error Alert with direct Retry button */}
        {errorMessage && (
          <div className="bg-gradient-to-r from-rose-950/60 to-slate-900 border border-rose-500/40 text-rose-200 p-4 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs animate-fade-in shadow-xl">
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </span>
              <div>
                <p className="font-semibold text-rose-300">{errorMessage}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  السيرفرات العالمية تشهد أحياناً ضغطاً لحظياً لبضع ثوانٍ. انقر على زر إعادة المحاولة للبدء مجدداً.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end pt-2 sm:pt-0 border-t sm:border-t-0 border-rose-900/40">
              {currentImage && (
                <button
                  onClick={() => handleAnalyzeImage(currentImage, 'image/jpeg', '')}
                  disabled={isAnalyzing}
                  className="px-3.5 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold transition flex items-center gap-1.5 shadow-md shadow-rose-600/30"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isAnalyzing ? 'animate-spin' : ''}`} />
                  <span>إعادة المحاولة الآن</span>
                </button>
              )}

              <button
                onClick={() => handleSelectSample(SAMPLE_DATA[0])}
                className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
              >
                تجربة عينة فورية
              </button>

              <button
                onClick={() => setErrorMessage(null)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg transition"
                title="إغلاق"
              >
                <XCircle className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* View Mode: If no analysis yet, show Hero + Uploader */}
        {!analysis ? (
          <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-xs font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                <span>محرك بحث استخبارات المصانع وتجار الجملة المباشر</span>
              </div>

              <h2 className="text-2xl sm:text-4xl font-black text-white tracking-tight leading-snug">
                ابحث عن الصور المماثلة، واكشف بيانات المصنع على{' '}
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 bg-clip-text text-transparent">
                  فيسبوك، تليجرام، انستغرام، وتويتر
                </span>
              </h2>

              <p className="text-xs sm:text-sm text-slate-400 max-w-2xl mx-auto leading-relaxed">
                ارفع صورة المنتج أو تيكت الملابس أو كرتونة الأحذية، وسيقوم النظام فوراً بتطبيق خوارزمية التطابق البصري المقاوم لاختلاف الزوايا والإضاءة، واستخراج اسم المصنع من اللوجو والنصوص، والبحث المباشر عبر كافة المنصات الاجتماعية.
              </p>
            </div>

            {/* Image Uploader & Interactive Playground */}
            <ImageUploader
              onAnalyze={handleAnalyzeImage}
              onSelectSample={handleSelectSample}
              isLoading={isAnalyzing}
              loadingStep={loadingStep}
            />

            {/* Feature Highlights Grid */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4">
              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">خوارزمية مطابقة فائقة الدقة</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  التعرف على الموديلات حتى مع اختلاف زاوية التصوير أو الإضاءة الخافتة أو انعكاسات أكياس التغليف.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20 flex items-center justify-center">
                  <Facebook className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">فيسبوك وتليجرام</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  البحث باسم المصنع واللوجو للوصول للصفحات الرسمية وجروبات الجملة وقنوات مكاتب التوريد.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-rose-500/10 text-rose-400 border border-rose-500/20 flex items-center justify-center">
                  <Instagram className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">انستغرام وتويتر (𝕏)</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  كشف معارض الموديل وريلز انستغرام ومتابعة أحدث تغريدات وإعلانات المصانع المباشرة على منصة 𝕏.
                </p>
              </div>

              <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-4 space-y-2">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h3 className="text-sm font-bold text-white">البحث العكسي Yandex و Lens</h3>
                <p className="text-xs text-slate-400 leading-relaxed">
                  مطابقة فورية في أقوى محركات البحث البصري للعثور على نفس القطعة في الكتالوجات العالمية.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* View Mode: Analysis & Search Results */
          currentImage && (
            <AnalysisOverview
              analysis={analysis}
              searchResult={searchResult || undefined}
              groundingSources={groundingSources}
              imageUrl={currentImage}
              isSearchingFactory={isSearchingFactory}
              onOpenRefineModal={() => setIsRefineModalOpen(true)}
              onOpenExportModal={() => setIsExportModalOpen(true)}
              onNewScan={handleNewScan}
            />
          )
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/60 py-6 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-400">بصير المصانع</span>
            <span>•</span>
            <span>محرك البحث البصري واستخراج بيانات المصانع والمنتجات</span>
          </div>
          <div>
            <span>يدعم فيسبوك، تليجرام، Google Lens، Yandex للصور</span>
          </div>
        </div>
      </footer>

      {/* Modals & Drawers */}
      {analysis && (
        <>
          <RefineSearchModal
            isOpen={isRefineModalOpen}
            onClose={() => setIsRefineModalOpen(false)}
            initialFactoryName={analysis.factoryName}
            initialModelCode={analysis.modelCodes?.[0] || ''}
            initialCategory={analysis.productCategory}
            onExecuteSearch={async (params) => {
              await executeFactorySearch(params);
            }}
            isLoading={isSearchingFactory}
          />

          <ExportDossierModal
            isOpen={isExportModalOpen}
            onClose={() => setIsExportModalOpen(false)}
            analysis={analysis}
            searchResult={searchResult || undefined}
            imageUrl={currentImage || undefined}
          />
        </>
      )}

      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
      />

      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
