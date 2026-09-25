import React, { useState } from 'react';
import {
  Facebook,
  ExternalLink,
  Users,
  Building,
  Share2,
  Copy,
  Check,
  Search,
  MapPin,
  Phone,
  Filter,
  CheckCircle,
  HelpCircle,
  MessageCircle,
} from 'lucide-react';
import { FacebookFinding } from '../types';
import { generateFacebookDeepLinks } from '../utils/reverseSearchUrls';

interface FacebookSearchSectionProps {
  factoryName: string;
  modelCode?: string;
  category?: string;
  findings: FacebookFinding[];
  isSearching: boolean;
  onRefineSearch: () => void;
}

export const FacebookSearchSection: React.FC<FacebookSearchSectionProps> = ({
  factoryName,
  modelCode,
  category,
  findings,
  isSearching,
  onRefineSearch,
}) => {
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('all');
  const [hasPhoneOnly, setHasPhoneOnly] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const deepLinks = generateFacebookDeepLinks(factoryName, modelCode, category);

  const filteredFindings = findings.filter((item) => {
    if (selectedTypeFilter !== 'all' && !item.type.includes(selectedTypeFilter)) {
      return false;
    }
    if (hasPhoneOnly && !item.phone) {
      return false;
    }
    return true;
  });

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Facebook Launchers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-blue-600/20 text-blue-400">
              <Facebook className="w-5 h-5" />
            </span>
            <h3 className="text-sm font-bold text-white">
              أدوات البحث المباشر في فيسبوك باسم المصنع واللوجو
            </h3>
          </div>
          <button
            onClick={onRefineSearch}
            className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
          >
            <Filter className="w-3.5 h-3.5" />
            تعديل كلمات البحث
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {deepLinks.map((link) => (
            <a
              key={link.id}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/40 p-4 rounded-xl transition flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-blue-400 transition">
                    {link.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                    {link.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {link.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-blue-400 font-semibold">
                <span>فتح فيسبوك</span>
                <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Live AI Discovered Facebook Results */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              الصفحات والجروبات المكتشفة لمصنع "{factoryName}"
            </h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {filteredFindings.length} نتيجة
            </span>
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setSelectedTypeFilter('all')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                selectedTypeFilter === 'all'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              الكل
            </button>
            <button
              onClick={() => setSelectedTypeFilter('صفحة')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                selectedTypeFilter === 'صفحة'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              صفحات رسمية
            </button>
            <button
              onClick={() => setSelectedTypeFilter('جروب')}
              className={`px-2.5 py-1 rounded-lg border transition ${
                selectedTypeFilter === 'جروب'
                  ? 'bg-blue-600 text-white border-blue-500'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
              }`}
            >
              جروبات جملة
            </button>
            <label className="flex items-center gap-1.5 cursor-pointer text-slate-400 hover:text-slate-200 px-2">
              <input
                type="checkbox"
                checked={hasPhoneOnly}
                onChange={(e) => setHasPhoneOnly(e.target.checked)}
                className="rounded border-slate-700 bg-slate-900 text-blue-600 focus:ring-0"
              />
              <span>بأرقام هواتف فقط</span>
            </label>
          </div>
        </div>

        {/* Results List */}
        {isSearching ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <div className="w-8 h-8 mx-auto border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">جارٍ كشف صفحات المصنع والجروبات على فيسبوك...</p>
          </div>
        ) : filteredFindings.length > 0 ? (
          <div className="space-y-3">
            {filteredFindings.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-850 hover:border-slate-700 p-4 rounded-xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-blue-500/10 text-blue-300 border border-blue-500/20 font-medium">
                      {item.type}
                    </span>
                    <h5 className="text-sm font-bold text-white hover:text-blue-400 transition">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h5>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.snippet}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                    {item.location && (
                      <span className="flex items-center gap-1 text-slate-400">
                        <MapPin className="w-3.5 h-3.5 text-rose-400" />
                        {item.location}
                      </span>
                    )}
                    {item.phone && (
                      <span className="flex items-center gap-1 text-emerald-400 font-mono">
                        <Phone className="w-3.5 h-3.5" />
                        {item.phone}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => copyUrl(item.url)}
                    className="p-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white border border-slate-800 transition"
                    title="نسخ الرابط"
                  >
                    {copiedLink === item.url ? (
                      <Check className="w-4 h-4 text-emerald-400" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </button>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <span>زيارة الصفحة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs space-y-2">
            <p>لم يتم العثور على صفحات فيسبوك مباشرة مطابقة لهذه المعايير المحددة.</p>
            <p className="text-slate-400">
              يمكنك النقر على أحد أزرار البحث بالأعلى لفتح فيسبوك مباشرة والبحث هناك.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
