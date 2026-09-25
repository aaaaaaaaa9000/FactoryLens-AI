import React, { useState } from 'react';
import {
  Sparkles,
  ExternalLink,
  Copy,
  Check,
  Search,
  Download,
  Info,
  Layers,
  ArrowUpRight,
  Flame,
  Globe,
} from 'lucide-react';
import { generateReverseSearchLinks, SearchEngineLink } from '../utils/reverseSearchUrls';

interface ReverseSearchEnginesProps {
  keywords: string[];
  factoryName: string;
  productTitle: string;
  modelCode?: string;
  uploadedImageUrl?: string;
}

export const ReverseSearchEngines: React.FC<ReverseSearchEnginesProps> = ({
  keywords,
  factoryName,
  productTitle,
  modelCode,
  uploadedImageUrl,
}) => {
  const [copiedKeyword, setCopiedKeyword] = useState<string | null>(null);

  const searchKeywords = [
    ...keywords,
    factoryName ? `مصنع ${factoryName}` : '',
    modelCode ? `${factoryName} ${modelCode}` : '',
    productTitle,
  ].filter(Boolean);

  // Generate unique keywords list
  const uniqueKeywords = Array.from(new Set(searchKeywords));

  const reverseEngines: SearchEngineLink[] = generateReverseSearchLinks(
    uniqueKeywords.slice(0, 4),
    uploadedImageUrl
  );

  const copyKeyword = (kw: string) => {
    navigator.clipboard.writeText(kw);
    setCopiedKeyword(kw);
    setTimeout(() => setCopiedKeyword(null), 1800);
  };

  const handleDownloadImage = () => {
    if (!uploadedImageUrl) return;
    const a = document.createElement('a');
    a.href = uploadedImageUrl;
    a.download = `product-${factoryName.replace(/\s+/g, '_') || 'image'}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-6">
      {/* Banner / Instructions */}
      <div className="bg-gradient-to-r from-blue-950/40 via-indigo-950/40 to-slate-900 border border-blue-800/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-white">
              محركات البحث العكسي ومطابقة الصور المماثلة
            </h3>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            للعثور على صور مطابقة تماماً للموديل أو صور أخرى للمنتج ملتقطة من زوايا مختلفة في مصانع ومتاجر أخرى، يمكنك استخدام الروابط المباشرة أدناه أو تنزيل الصورة ورفعها في Google Lens أو Yandex.
          </p>
        </div>

        {uploadedImageUrl && (
          <button
            onClick={handleDownloadImage}
            className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center gap-1.5 shrink-0 transition"
          >
            <Download className="w-4 h-4 text-cyan-400" />
            <span>حفظ الصورة لرفعها بالعدسة</span>
          </button>
        )}
      </div>

      {/* Search Engine Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reverseEngines.map((engine) => (
          <div
            key={engine.id}
            className="bg-slate-900/70 border border-slate-800 hover:border-indigo-500/40 rounded-2xl p-5 transition group flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-white group-hover:text-cyan-300 transition flex items-center gap-2">
                  <Globe className="w-4 h-4 text-indigo-400" />
                  {engine.nameAr}
                </span>
                <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${engine.badgeColor}`}>
                  {engine.badge}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed">
                {engine.description}
              </p>
            </div>

            <div className="pt-4 mt-2 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 font-mono">
                {engine.name}
              </span>
              <a
                href={engine.url}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-md shadow-indigo-600/20"
              >
                <span>فتح ومطابقة الصور</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Suggested Search Keywords Pill Box */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-5 space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
            <Search className="w-4 h-4 text-cyan-400" />
            استعلامات البحث البصري الموصى بها (انقر للنسخ أو البحث):
          </h4>
          <span className="text-[10px] text-slate-500">جاهزة للبحث البصري</span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {uniqueKeywords.map((kw, i) => (
            <div
              key={i}
              className="flex items-center gap-1 bg-slate-950 border border-slate-800 hover:border-slate-700 px-3 py-1.5 rounded-xl text-xs text-slate-200"
            >
              <span>{kw}</span>
              <button
                onClick={() => copyKeyword(kw)}
                className="p-1 hover:text-white text-slate-500 transition"
                title="نسخ العبارة"
              >
                {copiedKeyword === kw ? (
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <a
                href={`https://www.google.com/search?q=${encodeURIComponent(kw)}&tbm=isch`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1 hover:text-cyan-400 text-slate-500 transition"
                title="بحث فوري في صور جوجل"
              >
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          ))}
        </div>
      </div>

      {/* Tip for matching duplicate images */}
      <div className="bg-slate-950/40 border border-slate-800/80 rounded-xl p-3.5 text-xs text-slate-400 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-semibold text-slate-300">
            نصيحة للمطابقة الفائقة (Reverse Image Match):
          </p>
          <p>
            إذا كان المنتج يحتوي على تيكت باركود أو كود موديل مثل <span className="text-cyan-400 font-mono font-bold">{modelCode || '704'}</span>، فإن البحث باسم المصنع مقترناً بكود الموديل في Yandex وGoogle يعطي فوراً صور الموديل المعروضة في مكاتب الجملة والمستودعات!
          </p>
        </div>
      </div>
    </div>
  );
};
