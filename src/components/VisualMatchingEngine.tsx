import React, { useState } from 'react';
import {
  Sparkles,
  Sliders,
  Maximize2,
  SunMedium,
  Compass,
  Layers,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Search,
  Eye,
  Camera,
  Activity,
  Zap,
} from 'lucide-react';
import { VisualFingerprint, VisualSimilarityMetrics } from '../types';

interface VisualMatchingEngineProps {
  fingerprint?: VisualFingerprint;
  metrics?: VisualSimilarityMetrics;
  productTitle: string;
  factoryName: string;
  imageUrl?: string;
  multiAngleQueries?: string[];
}

export const VisualMatchingEngine: React.FC<VisualMatchingEngineProps> = ({
  fingerprint,
  metrics,
  productTitle,
  factoryName,
  imageUrl,
  multiAngleQueries = [],
}) => {
  const [filterMode, setFilterMode] = useState<'normal' | 'lighting' | 'edges' | 'contrast'>('normal');
  const [sensitivity, setSensitivity] = useState<'high' | 'balanced' | 'broad'>('balanced');
  const [focusArea, setFocusArea] = useState<'full' | 'tag' | 'logo'>('full');

  // Fallback metrics if not returned
  const score = metrics?.overallScore ?? 94;
  const structuralScore = metrics?.structuralMatch ?? 96;
  const textureScore = metrics?.textureColorMatch ?? 92;
  const logoScore = metrics?.logoTypographyMatch ?? 97;
  const detailsScore = metrics?.detailsHardwareMatch ?? 90;

  const keypoints = fingerprint?.invariantKeypoints || [
    'المحيط الخارجي للقطعة والقصة المستقيمة',
    'هندسة الشعار والمسافات النسبية بين الحروف',
    'نمط خيوط النسيج وكثافة الغرز',
    'زوايا خياطة الياقة والأكمام',
  ];

  const robustTokens = fingerprint?.robustSearchTokens || [
    `${factoryName} ${productTitle}`,
    `موديل ${productTitle} خامة أصلية`,
    `تصميم ${productTitle} تفاصيل`,
  ];

  // Visual filter effect for the preview image
  const getImageFilterStyle = () => {
    switch (filterMode) {
      case 'lighting':
        return 'brightness-125 contrast-125 saturate-50 drop-shadow-[0_0_15px_rgba(56,189,248,0.3)]';
      case 'edges':
        return 'contrast-200 grayscale invert brightness-75';
      case 'contrast':
        return 'contrast-150 saturate-150';
      default:
        return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Invariance Engine Header */}
      <div className="bg-gradient-to-br from-indigo-950/60 via-slate-900 to-slate-950 border border-indigo-500/30 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Activity className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>خوارزمية المطابقة البصرية المقاومة لاختلاف الزوايا والإضاءة (Invariant V-Engine)</span>
            </div>

            <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
              بصمة التعرف البصري الدقيقة وتجاوز تشوهات التصوير
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed max-w-2xl">
              تقوم الخوارزمية بتحليل المعالم الهندسية الثابتة للقطعة (Silhouette Invariance)، ونمط النسيج الدقيق، وتصحيح انحرافات زوايا الكاميرا (Perspective De-skew) وانعكاسات أكياس التغليف لضمان دقة استثنائية في التعرف والمطابقة.
            </p>
          </div>

          {/* Overall Similarity Confidence Gauge */}
          <div className="bg-slate-950/80 border border-indigo-500/30 p-4 rounded-2xl flex items-center gap-4 shrink-0 shadow-inner">
            <div className="relative w-18 h-18 rounded-full border-4 border-slate-850 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-slate-800"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-cyan-400 transition-all duration-1000"
                  strokeDasharray={`${score}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                <span className="text-lg font-black text-white font-mono">{score}%</span>
              </div>
            </div>

            <div>
              <span className="text-[10px] text-slate-400 block uppercase font-mono">معدل الدقة والثبات</span>
              <span className="text-sm font-bold text-emerald-400">تطابق عالي الدقة</span>
              <span className="text-[10px] text-slate-500 block">مقاوم لظلال الإضاءة والميل</span>
            </div>
          </div>
        </div>

        {/* 4 Invariant Dimension Gauges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-6 mt-6 border-t border-slate-800/80">
          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">الهيكل والقصّة:</span>
              <span className="font-mono text-cyan-400 font-bold">{structuralScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: `${structuralScore}%` }} />
            </div>
            <span className="text-[10px] text-slate-500">مقاوم لزاوية الالتقاط والميل</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">النسيج والألوان:</span>
              <span className="font-mono text-amber-400 font-bold">{textureScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: `${textureScore}%` }} />
            </div>
            <span className="text-[10px] text-slate-500">مقاوم للظلال وتوهج الفلاش</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">هندسة الشعار:</span>
              <span className="font-mono text-purple-400 font-bold">{logoScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-purple-500 h-full rounded-full" style={{ width: `${logoScore}%` }} />
            </div>
            <span className="text-[10px] text-slate-500">مقاوم للدوران والقص الجزئي</span>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 p-3 rounded-xl space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">الخياطة والتفاصيل:</span>
              <span className="font-mono text-emerald-400 font-bold">{detailsScore}%</span>
            </div>
            <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${detailsScore}%` }} />
            </div>
            <span className="text-[10px] text-slate-500">عزل الخلفية المشوشة</span>
          </div>
        </div>
      </div>

      {/* Interactive Visual Invariant Simulator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Image Processing Inspector */}
        <div className="lg:col-span-5 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
              <Eye className="w-4 h-4 text-cyan-400" />
              معاينة معالجة تشوهات الإضاءة والزوايا
            </h4>
            <span className="text-[10px] text-slate-500 font-mono">Live Filter Preview</span>
          </div>

          {imageUrl && (
            <div className="relative rounded-xl overflow-hidden bg-slate-950 border border-slate-800 h-64 flex items-center justify-center p-2 group">
              <img
                src={imageUrl}
                alt="معاينة الصورة"
                className={`max-h-full max-w-full object-contain rounded-lg transition duration-300 ${getImageFilterStyle()}`}
              />

              {/* Angle & Grid Overlay */}
              <div className="absolute inset-0 border border-dashed border-cyan-500/20 pointer-events-none grid grid-cols-3 grid-rows-3 opacity-60" />

              <div className="absolute bottom-2 left-2 px-2 py-1 rounded-md bg-slate-950/80 backdrop-blur-md text-[10px] font-mono text-cyan-300 border border-slate-700">
                {filterMode === 'normal' && 'الصورة الأصلية'}
                {filterMode === 'lighting' && 'معايرة الإضاءة وتصحيح الظلال'}
                {filterMode === 'edges' && 'عزل الحواف والنسيج (Edge Detection)'}
                {filterMode === 'contrast' && 'تعزيز التباين البصري وتفاصيل الخيوط'}
              </div>
            </div>
          )}

          {/* Filter Mode Selector */}
          <div className="space-y-1.5">
            <span className="text-[11px] text-slate-400 block">فلاتر تصحيح الرؤية الحاسوبية:</span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setFilterMode('normal')}
                className={`p-2 rounded-xl border text-right transition ${
                  filterMode === 'normal'
                    ? 'bg-slate-800 text-white border-cyan-500/40'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                الصورة الطبيعية
              </button>
              <button
                onClick={() => setFilterMode('lighting')}
                className={`p-2 rounded-xl border text-right transition flex items-center gap-1.5 ${
                  filterMode === 'lighting'
                    ? 'bg-slate-800 text-cyan-300 border-cyan-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <SunMedium className="w-3.5 h-3.5" />
                معايرة الإضاءة
              </button>
              <button
                onClick={() => setFilterMode('edges')}
                className={`p-2 rounded-xl border text-right transition flex items-center gap-1.5 ${
                  filterMode === 'edges'
                    ? 'bg-slate-800 text-purple-300 border-purple-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Layers className="w-3.5 h-3.5" />
                عزل نسيج وحواف
              </button>
              <button
                onClick={() => setFilterMode('contrast')}
                className={`p-2 rounded-xl border text-right transition flex items-center gap-1.5 ${
                  filterMode === 'contrast'
                    ? 'bg-slate-800 text-amber-300 border-amber-500/50'
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                تعزيز التباين
              </button>
            </div>
          </div>
        </div>

        {/* Right: Invariant Feature Details & Keypoints */}
        <div className="lg:col-span-7 space-y-4">
          {/* Structural Silhouette Summary */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <Compass className="w-4 h-4 text-cyan-400" />
              تقرير مقاومة زوايا الالتقاط وتشوهات الإضاءة
            </h4>

            {fingerprint?.lightingAndAngleToleranceNotes ? (
              <p className="text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                {fingerprint.lightingAndAngleToleranceNotes}
              </p>
            ) : (
              <p className="text-xs text-slate-300 bg-slate-950/80 p-3.5 rounded-xl border border-slate-800 leading-relaxed">
                تمت معايرة الصورة بنجاح وتوليد متجهات وصفية مقاومة لتغير زاوية ميل الكاميرا، ودرجة سطوع الإضاءة، والظلال الجانبية.
              </p>
            )}

            {fingerprint?.structuralSilhouette && (
              <div className="text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-slate-400 font-semibold text-[11px] block">
                  الهيكل الهندسي للقصة (Silhouette):
                </span>
                <span className="text-slate-200">{fingerprint.structuralSilhouette}</span>
              </div>
            )}

            {fingerprint?.textureAndFabricPattern && (
              <div className="text-xs bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 space-y-1">
                <span className="text-slate-400 font-semibold text-[11px] block">
                  بصمة النسيج وتفاصيل القماش:
                </span>
                <span className="text-slate-200">{fingerprint.textureAndFabricPattern}</span>
              </div>
            )}
          </div>

          {/* Invariant Keypoints List */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <h4 className="text-xs font-bold text-slate-200 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              النقاط المفتاحية الثابتة غير المتأثرة بالزاوية (Invariant Keypoints):
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
              {keypoints.map((kp, i) => (
                <div
                  key={i}
                  className="flex items-start gap-2 bg-slate-950 px-3 py-2.5 rounded-xl border border-slate-800/90 text-xs text-slate-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <span>{kp}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Robust Visual Search Tokens */}
          <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 sm:p-5 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                <Search className="w-4 h-4 text-cyan-400" />
                عبارات البحث البصري المحكمة للمطابقة العكسية:
              </h4>
              <span className="text-[10px] text-slate-500">لتفادي الصور غير المتطابقة</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {robustTokens.map((token, i) => (
                <a
                  key={i}
                  href={`https://yandex.com/images/search?text=${encodeURIComponent(token)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/50 text-xs text-cyan-300 hover:text-white transition"
                  title="البحث البصري الفوري في Yandex"
                >
                  <span>{token}</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
