import React, { useState } from 'react';
import {
  ExternalLink,
  Copy,
  Check,
  Search,
  Calendar,
  Sparkles,
  ArrowUpRight,
  TrendingUp,
  MessageCircle,
} from 'lucide-react';
import { TwitterFinding } from '../types';
import { generateTwitterDeepLinks } from '../utils/reverseSearchUrls';

interface TwitterSearchSectionProps {
  factoryName: string;
  modelCode?: string;
  category?: string;
  findings: TwitterFinding[];
  isSearching: boolean;
  onRefineSearch: () => void;
}

export const TwitterSearchSection: React.FC<TwitterSearchSectionProps> = ({
  factoryName,
  modelCode,
  category,
  findings,
  isSearching,
  onRefineSearch,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const deepLinks = generateTwitterDeepLinks(factoryName, modelCode, category);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Twitter / X Launchers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-slate-800 text-white border border-slate-700 font-black text-sm flex items-center justify-center w-9 h-9">
              𝕏
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">
                أدوات البحث في منصة تويتر (X) عن صفقات وتوريد المصنع
              </h3>
              <p className="text-[11px] text-slate-400">
                متابعة أحدث التغريدات، إعلانات التوريد المباشرة، وحسابات المسؤولين
              </p>
            </div>
          </div>
          <button
            onClick={onRefineSearch}
            className="text-xs text-sky-400 hover:text-sky-300 font-semibold flex items-center gap-1 transition"
          >
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
              className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-sky-500/40 p-4 rounded-xl transition flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-sky-400 transition">
                    {link.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                    {link.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {link.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-300 group-hover:text-white font-semibold">
                <span>بحث على 𝕏</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Discovered X Posts & Accounts */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              التغريدات والحسابات المكتشفة على 𝕏 لمصنع "{factoryName}"
            </h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {findings.length} نتيجة
            </span>
          </div>

          <span className="text-xs text-slate-400">
            تحديثات وعروض تجارية
          </span>
        </div>

        {isSearching ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <div className="w-8 h-8 mx-auto border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">جارٍ فحص التغريدات والحسابات على منصة 𝕏...</p>
          </div>
        ) : findings.length > 0 ? (
          <div className="space-y-3">
            {findings.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-850 hover:border-slate-700 p-4 rounded-xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700 font-medium">
                      {item.relevance || 'تغريدة / حساب'}
                    </span>
                    <h5 className="text-sm font-bold text-white hover:text-sky-400 transition">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h5>
                    {item.handle && (
                      <span className="text-xs text-slate-400 font-mono">
                        {item.handle}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.snippet}
                  </p>

                  {item.postDate && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1 pt-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.postDate}</span>
                    </div>
                  )}
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
                    className="px-3.5 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm border border-slate-700"
                  >
                    <span>فتح في 𝕏</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs space-y-2">
            <p>لم يتم العثور على تغريدات متطابقة بالاسم الصريح على 𝕏.</p>
            <p className="text-slate-400">
              يمكنك استخدام زر "أحدث التغريدات" أو بحث جوجل لـ x.com بالأعلى للوصول إلى مناقشات الموردين.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
