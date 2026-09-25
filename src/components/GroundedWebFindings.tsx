import React from 'react';
import { Globe, ExternalLink, ShieldCheck, MapPin, Phone, MessageSquare, AlertCircle } from 'lucide-react';
import { GroundedSearchResult, GroundingSource } from '../types';

interface GroundedWebFindingsProps {
  searchResult?: GroundedSearchResult;
  groundingSources?: GroundingSource[];
  factoryName: string;
}

export const GroundedWebFindings: React.FC<GroundedWebFindingsProps> = ({
  searchResult,
  groundingSources,
  factoryName,
}) => {
  if (!searchResult) {
    return (
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-8 text-center text-slate-400 text-xs">
        لم يتم تشغيل البحث المباشر للويب بعد.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Factory Profile Overview */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
          <Globe className="w-4 h-4 text-indigo-400" />
          الملف التعريفي للمصنع ونشاطه في السوق
        </h4>
        <p className="text-xs text-slate-200 leading-relaxed bg-slate-950 p-4 rounded-xl border border-slate-800/80">
          {searchResult.factoryOverview}
        </p>
      </div>

      {/* Directory & Contacts */}
      {searchResult.contactDirectory && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {searchResult.contactDirectory.knownAddresses &&
            searchResult.contactDirectory.knownAddresses.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <MapPin className="w-4 h-4" />
                  عناوين المصنع والمخازن المعروفة:
                </span>
                <ul className="space-y-1.5 text-xs text-slate-300">
                  {searchResult.contactDirectory.knownAddresses.map((addr, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <span className="text-slate-500">•</span>
                      <span>{addr}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

          {searchResult.contactDirectory.phones &&
            searchResult.contactDirectory.phones.length > 0 && (
              <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-2">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Phone className="w-4 h-4" />
                  أرقام التواصل المؤكدة عبر الإنترنت:
                </span>
                <div className="flex flex-wrap gap-2 pt-1">
                  {searchResult.contactDirectory.phones.map((phone, i) => (
                    <a
                      key={i}
                      href={`tel:${phone}`}
                      className="px-2.5 py-1 rounded-lg bg-slate-950 border border-slate-800 text-emerald-400 font-mono text-xs hover:border-emerald-500/40 transition"
                    >
                      {phone}
                    </a>
                  ))}
                </div>
              </div>
            )}
        </div>
      )}

      {/* Other Wholesale Sources if present */}
      {searchResult.otherWholesaleSources && searchResult.otherWholesaleSources.length > 0 && (
        <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-200">
            أدلة ومواقع توريد إضافية ذات صلة
          </h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {searchResult.otherWholesaleSources.map((source, i) => (
              <a
                key={i}
                href={source.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-slate-950 border border-slate-850 hover:border-slate-700 p-3.5 rounded-xl transition flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between text-xs font-bold text-white group-hover:text-cyan-300">
                    <span className="truncate">{source.title}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                      {source.platform}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                    {source.snippet}
                  </p>
                </div>
                <div className="pt-2 mt-2 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-indigo-400">
                  <span>زيارة المصدر</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Action tips */}
      {searchResult.actionTips && searchResult.actionTips.length > 0 && (
        <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900 border border-indigo-500/20 rounded-2xl p-5 space-y-2.5">
          <h4 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" />
            نصائح التعامل التجاري المباشر مع المصنع:
          </h4>
          <ul className="space-y-1.5 text-xs text-slate-300">
            {searchResult.actionTips.map((tip, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-amber-400 font-bold shrink-0">•</span>
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Grounding web citations */}
      {groundingSources && groundingSources.length > 0 && (
        <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-4 space-y-2 text-[11px] text-slate-400">
          <span className="font-semibold text-slate-300 block">
            مصادر الويب الحية الموثقة عبر Google Search:
          </span>
          <div className="flex flex-wrap gap-2">
            {groundingSources.map((src, i) => (
              <a
                key={i}
                href={src.uri}
                target="_blank"
                rel="noopener noreferrer"
                className="px-2.5 py-1 rounded-md bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-300 hover:text-white transition flex items-center gap-1.5 truncate max-w-xs"
              >
                <Globe className="w-3 h-3 text-cyan-400 shrink-0" />
                <span className="truncate">{src.title}</span>
                <ExternalLink className="w-2.5 h-2.5 shrink-0 opacity-60" />
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
