import React, { useState } from 'react';
import {
  Building2,
  Tag,
  Facebook,
  Send,
  Image as ImageIcon,
  Globe,
  FileText,
  Filter,
  Share2,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { ImageAnalysisResult, GroundedSearchResult, GroundingSource } from '../types';
import { ExtractedDataCard } from './ExtractedDataCard';
import { FacebookSearchSection } from './FacebookSearchSection';
import { TelegramSearchSection } from './TelegramSearchSection';
import { ReverseSearchEngines } from './ReverseSearchEngines';
import { GroundedWebFindings } from './GroundedWebFindings';

interface AnalysisOverviewProps {
  analysis: ImageAnalysisResult;
  searchResult?: GroundedSearchResult;
  groundingSources?: GroundingSource[];
  imageUrl: string;
  isSearchingFactory: boolean;
  onOpenRefineModal: () => void;
  onOpenExportModal: () => void;
  onNewScan: () => void;
}

type TabType = 'extracted' | 'facebook' | 'telegram' | 'reverse' | 'web';

export const AnalysisOverview: React.FC<AnalysisOverviewProps> = ({
  analysis,
  searchResult,
  groundingSources,
  imageUrl,
  isSearchingFactory,
  onOpenRefineModal,
  onOpenExportModal,
  onNewScan,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('extracted');

  const fbCount = searchResult?.facebookFindings?.length || 0;
  const tgCount = searchResult?.telegramFindings?.length || 0;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Floating Control Bar */}
      <div className="bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-3xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        {/* Left: Thumbnail & Core Identification */}
        <div className="flex items-center gap-3.5">
          <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-950 border border-slate-700/80 p-1 shrink-0 shadow-md">
            <img
              src={imageUrl}
              alt="الصورة المفحوصة"
              className="w-full h-full object-contain rounded-xl"
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-black text-white">
                {analysis.factoryName || 'اسم المصنع غير مدون'}
              </h2>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 font-semibold">
                {analysis.confidence}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400 mt-0.5">
              <span>{analysis.productTitle}</span>
              {analysis.modelCodes?.[0] && (
                <>
                  <span>•</span>
                  <span className="text-cyan-400 font-mono font-bold">
                    كود: {analysis.modelCodes[0]}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right: Quick Global Actions */}
        <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
          <button
            onClick={onOpenRefineModal}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 transition flex items-center justify-center gap-1.5"
            title="تعديل اسم المصنع أو الفلترة"
          >
            <Filter className="w-4 h-4 text-cyan-400" />
            <span>تعديل البحث والفلترة</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex-1 sm:flex-initial px-3.5 py-2 rounded-xl bg-indigo-600/90 hover:bg-indigo-600 text-white text-xs font-semibold transition flex items-center justify-center gap-1.5 shadow-md shadow-indigo-600/20"
            title="تصدير بطاقة المصنع ورسائل الواتساب"
          >
            <Share2 className="w-4 h-4" />
            <span>تصدير البطاقة</span>
          </button>

          <button
            onClick={onNewScan}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-slate-700/80 transition flex items-center justify-center gap-1.5"
            title="رفع أو فحص صورة جديدة"
          >
            <ArrowRight className="w-4 h-4 text-slate-400" />
            <span className="hidden sm:inline">صورة جديدة</span>
          </button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 border-b border-slate-800/80 scrollbar-none">
        <button
          onClick={() => setActiveTab('extracted')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'extracted'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>استخراج البيانات والشعار (OCR)</span>
        </button>

        <button
          onClick={() => setActiveTab('facebook')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'facebook'
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Facebook className="w-4 h-4 text-blue-400 group-hover:text-white" />
          <span>صفحات وجروبات فيسبوك</span>
          {fbCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
              {fbCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('telegram')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'telegram'
              ? 'bg-sky-600 text-white shadow-lg shadow-sky-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Send className="w-4 h-4 text-sky-400" />
          <span>قنوات تليجرام والموردين</span>
          {tgCount > 0 && (
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 text-white font-mono">
              {tgCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveTab('reverse')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'reverse'
              ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <ImageIcon className="w-4 h-4 text-purple-400" />
          <span>البحث عن الصور المماثلة</span>
        </button>

        <button
          onClick={() => setActiveTab('web')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'web'
              ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/25'
              : 'bg-slate-900/60 text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          <span>نتائج الويب وملف المصنع</span>
        </button>
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'extracted' && (
          <ExtractedDataCard
            analysis={analysis}
            onEditFactoryName={onOpenRefineModal}
          />
        )}

        {activeTab === 'facebook' && (
          <FacebookSearchSection
            factoryName={analysis.factoryName}
            modelCode={analysis.modelCodes?.[0]}
            category={analysis.productCategory}
            findings={searchResult?.facebookFindings || []}
            isSearching={isSearchingFactory}
            onRefineSearch={onOpenRefineModal}
          />
        )}

        {activeTab === 'telegram' && (
          <TelegramSearchSection
            factoryName={analysis.factoryName}
            modelCode={analysis.modelCodes?.[0]}
            category={analysis.productCategory}
            findings={searchResult?.telegramFindings || []}
            isSearching={isSearchingFactory}
            onRefineSearch={onOpenRefineModal}
          />
        )}

        {activeTab === 'reverse' && (
          <ReverseSearchEngines
            keywords={analysis.searchQueries?.reverseImageKeywords || []}
            factoryName={analysis.factoryName}
            productTitle={analysis.productTitle}
            modelCode={analysis.modelCodes?.[0]}
            uploadedImageUrl={imageUrl}
          />
        )}

        {activeTab === 'web' && (
          <GroundedWebFindings
            searchResult={searchResult}
            groundingSources={groundingSources}
            factoryName={analysis.factoryName}
          />
        )}
      </div>
    </div>
  );
};
