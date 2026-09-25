import React, { useState } from 'react';
import {
  Send,
  ExternalLink,
  Copy,
  Check,
  Search,
  MessageSquare,
  ShieldAlert,
  ArrowUpRight,
  Sparkles,
  Layers,
  Radio,
} from 'lucide-react';
import { TelegramFinding } from '../types';
import { generateTelegramDeepLinks } from '../utils/reverseSearchUrls';

interface TelegramSearchSectionProps {
  factoryName: string;
  modelCode?: string;
  category?: string;
  findings: TelegramFinding[];
  isSearching: boolean;
  onRefineSearch: () => void;
}

export const TelegramSearchSection: React.FC<TelegramSearchSectionProps> = ({
  factoryName,
  modelCode,
  category,
  findings,
  isSearching,
  onRefineSearch,
}) => {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);

  const deepLinks = generateTelegramDeepLinks(factoryName, modelCode, category);

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedLink(url);
    setTimeout(() => setCopiedLink(null), 1800);
  };

  return (
    <div className="space-y-6">
      {/* 1-Click Telegram Launchpad */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-xl bg-sky-500/20 text-sky-400">
              <Send className="w-5 h-5" />
            </span>
            <h3 className="text-sm font-bold text-white">
              محركات وأدوات البحث في قنوات ومجموعات تليجرام
            </h3>
          </div>
          <span className="text-xs text-sky-400 font-medium">
            تليجرام المنصة رقم 1 لجملة المصانع
          </span>
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
                  <span className="text-xs font-bold text-white group-hover:text-sky-300 transition">
                    {link.title}
                  </span>
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium">
                    {link.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 leading-snug">
                  {link.subtitle}
                </p>
              </div>

              <div className="pt-3 mt-2 border-t border-slate-800/80 flex items-center justify-between text-xs text-sky-400 font-semibold">
                <span>بحث تليجرام</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-[-2px] transition" />
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Discovered Telegram Channels List */}
      <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <h4 className="text-sm font-bold text-slate-200">
              قنوات ومجموعات تليجرام المكتشفة لمصنع "{factoryName}"
            </h4>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 font-mono">
              {findings.length} قناة/مكتب
            </span>
          </div>

          <button
            onClick={onRefineSearch}
            className="text-xs text-slate-400 hover:text-sky-400 transition"
          >
            تعديل الاستعلام
          </button>
        </div>

        {isSearching ? (
          <div className="py-12 text-center text-slate-400 space-y-2">
            <div className="w-8 h-8 mx-auto border-2 border-sky-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs">جارٍ مسح أدلة وقنوات تليجرام التجارية...</p>
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
                    <span className="text-xs px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20 font-medium">
                      {item.category || 'قناة تليجرام'}
                    </span>
                    <h5 className="text-sm font-bold text-white hover:text-sky-400 transition">
                      <a href={item.url} target="_blank" rel="noopener noreferrer">
                        {item.title}
                      </a>
                    </h5>
                    {item.username && (
                      <span className="text-xs text-sky-400 font-mono">
                        {item.username}
                      </span>
                    )}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {item.snippet}
                  </p>
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
                    className="px-3.5 py-2 rounded-lg bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold flex items-center gap-1.5 transition shadow-sm"
                  >
                    <span>معاينة القناة</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="py-8 text-center text-slate-500 text-xs space-y-2">
            <p>لم تظهر قناة تليجرام مباشرة بالاسم الدقيق، أو أن القناة خاصة بحاجة لدعوة.</p>
            <p className="text-slate-400">
              يمكنك استخدام محرك TGStat أو بحث جوجل المتخصص (site:t.me) من الأزرار بالأعلى للوصول لكافة القنوات ذات الصلة.
            </p>
          </div>
        )}
      </div>

      {/* Telegram Buyer Security Note */}
      <div className="bg-sky-950/20 border border-sky-800/30 rounded-xl p-4 text-xs text-slate-300 space-y-1.5">
        <div className="flex items-center gap-1.5 text-sky-400 font-bold">
          <ShieldAlert className="w-4 h-4" />
          تنبيه مهم للتعامل التجاري عبر قنوات تليجرام:
        </div>
        <p className="text-slate-400 leading-relaxed">
          تحقق دائماً من رقم هاتف المسؤول في وصف القناة (Bio)، ولا تقم بتحويل مبالغ نقدية أو عربون إلا بعد مطابقة كود الموديل وتأكيد الاستلام من مقر المصنع أو مكتب الشحن المعتمد.
        </p>
      </div>
    </div>
  );
};
