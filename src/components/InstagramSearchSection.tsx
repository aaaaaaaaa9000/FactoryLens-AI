import React, { useState } from 'react';
import {
  Instagram,
  ExternalLink,
  Copy,
  Check,
  Search,
  Sparkles,
  Hash,
  Users,
  Film,
  Camera,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import { InstagramFinding } from '../types';
import { generateInstagramDeepLinks } from '../utils/reverseSearchUrls';

interface InstagramSearchSectionProps {
  factoryName: string;
  modelCode?: string;
  category?: string;
  findings: InstagramFinding[];
  isSearching: boolean;
  onRefineSearch: () => void;
}

export const InstagramSearchSection: React.FC<InstagramSearchSectionProps> = ({
  factoryName,
  modelCode,
  category,
  findings,
  isSearching,
  onRefineSearch,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const deepLinks = generateInstagramDeepLinks(factoryName, modelCode, category);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Instagram Launchers */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-gradient-to-tr from-amber-500 via-rose-500 to-purple-600 text-white shadow-md shadow-rose-500/20">
              <Instagram className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-sm font-bold text-white">
                أدوات البحث في انستغرام ومطابقة صور الموديلات
              </h3>
              <p className="text-[11px] text-slate-400">
                كشف حسابات المصانع، معارض المنتجات، مقاطع الريلز، وهاشتاجات الموديل
              </p>
            </div>
          </div>
          <button
            onClick={onRefineSearch}
            className="text-xs text-rose-400 hover:text-rose-300 font-semibold flex items-center gap-1 transition"
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
              className="bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-rose-500/40 p-4 rounded-xl transition flex flex-col justify-between group shadow-sm"
            >
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-white group-hover:text-rose-400 transition">
                    {link.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-300 border border-rose-500/20 font-medium">
                    {link.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {link.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-rose-400 font-semibold">
                <span>فتح انستغرام</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Discovered Instagram Accounts & Posts */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              حسابات ومعارض انستغرام المرتبطة بمصنع "{factoryName}"
            </h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {findings.length} حساب/منشور
            </span>
          </div>

          <span className="text-xs text-slate-400">
            البحث في صور وفيديوهات الموديل
          </span>
        </div>

        {isSearching ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <div className="w-8 h-8 mx-auto border-2 border-rose-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">جارٍ فحص حسابات انستغرام ومقاطع الريلز للمصنع...</p>
          </div>
        ) : findings.length > 0 ? (
          <div className="space-y-3">
            {findings.map((item, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-slate-850 hover:border-rose-900/50 p-4 rounded-xl transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs px-2 py-0.5 rounded bg-gradient-to-r from-rose-500/10 to-purple-500/10 text-rose-300 border border-rose-500/20 font-medium">
                      {item.accountType || 'انستغرام'}
                    </span>
                    <h5 className="text-sm font-bold text-white hover:text-rose-400 transition">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h5>
                    {item.username && (
                      <span className="text-xs text-rose-400 font-mono">
                        {item.username}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.snippet}
                  </p>

                  {item.followersHint && (
                    <div className="text-[11px] text-slate-500 flex items-center gap-1.5 pt-1">
                      <Users className="w-3.5 h-3.5 text-purple-400" />
                      <span>{item.followersHint}</span>
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
                    className="px-3.5 py-2 rounded-lg bg-gradient-to-r from-rose-600 to-purple-600 hover:from-rose-500 hover:to-purple-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <span>فتح في انستغرام</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs space-y-2">
            <p>لم يتم العثور على حساب رسمي مباشر، أو أن الحساب خاص.</p>
            <p className="text-slate-400">
              يمكنك النقر على زر "هاشتاج المصنع والموديل" أو بحث جوجل المخصص بالأعلى لاستكشاف أحدث الصور والريلز المنشورة.
            </p>
          </div>
        )}
      </div>

      {/* Visual matching tip on Instagram */}
      <div className="bg-gradient-to-r from-rose-950/20 via-purple-950/20 to-slate-900 border border-rose-800/20 rounded-xl p-4 text-xs text-slate-300 flex items-start gap-3">
        <Film className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white">
            ميزة مطابقة صور ريلز انستغرام:
          </p>
          <p className="text-slate-400 leading-relaxed">
            معظم المصانع ومكاتب ملابس الجملة تعرض فيديوهات الموديل (Reels) على الطبيعة لإظهار ملمس القماش وتفاصيل الخياطة. استخدام هاشتاج المصنع يتيح لك رؤية القطعة بحركتها الطبيعية تحت إضاءات مختلفة.
          </p>
        </div>
      </div>
    </div>
  );
};
