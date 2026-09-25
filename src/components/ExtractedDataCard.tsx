import React, { useState } from 'react';
import {
  Building2,
  Tag,
  Phone,
  MessageCircle,
  MapPin,
  Barcode,
  Layers,
  FileText,
  Copy,
  Check,
  Edit3,
  ExternalLink,
  ShieldCheck,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { ImageAnalysisResult } from '../types';

interface ExtractedDataCardProps {
  analysis: ImageAnalysisResult;
  onEditFactoryName: () => void;
}

export const ExtractedDataCard: React.FC<ExtractedDataCardProps> = ({
  analysis,
  onEditFactoryName,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showFullOcr, setShowFullOcr] = useState<boolean>(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const confidenceBadgeColor = (confidence: string) => {
    if (confidence.includes('عالي') || confidence.toLowerCase().includes('high')) {
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
    }
    if (confidence.includes('متوسط') || confidence.toLowerCase().includes('medium')) {
      return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
    }
    return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
  };

  return (
    <div className="space-y-6">
      {/* Primary Factory & Brand Spotlight Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950/20 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 min-w-[240px]">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
                <Building2 className="w-5 h-5" />
              </span>
              <span className="text-xs font-semibold text-indigo-300 uppercase tracking-wider">
                اسم المصنع / الشركة المستخرج
              </span>
              <span
                className={`text-[11px] px-2.5 py-0.5 rounded-full border font-medium ${confidenceBadgeColor(
                  analysis.confidence
                )}`}
              >
                ثقة الكشف: {analysis.confidence}
              </span>
            </div>

            <div className="flex items-center gap-2 pt-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                {analysis.factoryName || 'غير محدد في التيكت'}
              </h2>
              <button
                onClick={onEditFactoryName}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="تعديل اسم المصنع للبحث"
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => copyToClipboard(analysis.factoryName, 'factory-name')}
                className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition"
                title="نسخ الاسم"
              >
                {copiedKey === 'factory-name' ? (
                  <Check className="w-4 h-4 text-emerald-400" />
                ) : (
                  <Copy className="w-4 h-4" />
                )}
              </button>
            </div>

            {analysis.factoryNameEn && (
              <p className="text-xs text-slate-400 font-mono">
                {analysis.factoryNameEn}
              </p>
            )}

            <p className="text-xs text-slate-300 pt-2 leading-relaxed bg-slate-950/40 p-3 rounded-xl border border-slate-800">
              <span className="font-semibold text-indigo-300">ملخص الفحص البصري: </span>
              {analysis.summaryAr}
            </p>
          </div>
        </div>

        {/* Logo Information snippet */}
        {analysis.logoDetails?.hasLogo && (
          <div className="mt-4 pt-4 border-t border-slate-800 flex flex-wrap items-center gap-3 text-xs">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4" />
              تم رصد لوجو / علامة تجارية:
            </span>
            {analysis.logoDetails.logoText && (
              <span className="px-2.5 py-1 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20 font-mono">
                {analysis.logoDetails.logoText}
              </span>
            )}
            {analysis.logoDetails.description && (
              <span className="text-slate-400">
                ({analysis.logoDetails.description})
              </span>
            )}
          </div>
        )}
      </div>

      {/* Grid of Extracted Specific Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Model Codes & Style Numbers */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-cyan-400">
              <Barcode className="w-4 h-4" />
              أكواد الموديل والتصميم
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Model / Style</span>
          </div>

          {analysis.modelCodes && analysis.modelCodes.length > 0 ? (
            <div className="space-y-1.5">
              {analysis.modelCodes.map((code, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs font-mono text-cyan-300"
                >
                  <span className="font-bold">{code}</span>
                  <button
                    onClick={() => copyToClipboard(code, `code-${idx}`)}
                    className="p-1 hover:text-white transition"
                    title="نسخ الكود"
                  >
                    {copiedKey === `code-${idx}` ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">لم يتم العثور على كود موديل رقمي صريح</p>
          )}
        </div>

        {/* Contact Info & WhatsApp */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-emerald-400">
              <Phone className="w-4 h-4" />
              بيانات التواصل المطبوعة
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Contact / WhatsApp</span>
          </div>

          {analysis.contactInfo?.phones && analysis.contactInfo.phones.length > 0 ? (
            <div className="space-y-1.5">
              {analysis.contactInfo.phones.map((phone, idx) => {
                const cleanPhone = phone.replace(/[^0-9]/g, '');
                const waUrl = `https://wa.me/${cleanPhone.startsWith('0') ? '2' + cleanPhone : cleanPhone}`;
                return (
                  <div
                    key={idx}
                    className="flex items-center justify-between bg-slate-950 px-3 py-2 rounded-lg border border-slate-800 text-xs"
                  >
                    <span className="font-mono text-emerald-400 font-bold">{phone}</span>
                    <div className="flex items-center gap-1.5">
                      <a
                        href={waUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 hover:bg-emerald-500/30 text-[10px] font-semibold flex items-center gap-1"
                      >
                        <MessageCircle className="w-3 h-3" />
                        واتساب
                      </a>
                      <a
                        href={`tel:${phone}`}
                        className="p-1 text-slate-400 hover:text-white"
                        title="اتصال"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">لا توجد أرقام هواتف واضحة على الصورة</p>
          )}

          {analysis.contactInfo?.addresses && analysis.contactInfo.addresses.length > 0 && (
            <div className="text-[11px] text-slate-400 flex items-start gap-1 pt-1">
              <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0 mt-0.5" />
              <span>{analysis.contactInfo.addresses.join(' - ')}</span>
            </div>
          )}
        </div>

        {/* Product Category & Specifications */}
        <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-300">
            <span className="flex items-center gap-1.5 text-amber-400">
              <Tag className="w-4 h-4" />
              مواصفات القطعة والجملة
            </span>
            <span className="text-[10px] text-slate-500 font-mono">Specs</span>
          </div>

          <div className="space-y-1.5 text-xs text-slate-300">
            <div className="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
              <span className="text-slate-400">الفئة:</span>
              <span className="font-semibold text-white">{analysis.productCategory}</span>
            </div>

            {analysis.specs?.materials && analysis.specs.materials.length > 0 && (
              <div className="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">الخامات:</span>
                <span className="font-medium text-slate-200">{analysis.specs.materials.join('، ')}</span>
              </div>
            )}

            {analysis.specs?.wholesalePackaging && (
              <div className="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">التعبئة والجملة:</span>
                <span className="font-medium text-amber-300">{analysis.specs.wholesalePackaging}</span>
              </div>
            )}

            {analysis.specs?.sizes && analysis.specs.sizes.length > 0 && (
              <div className="flex items-center justify-between bg-slate-950/60 px-2.5 py-1.5 rounded-lg border border-slate-800/80">
                <span className="text-slate-400">المقاسات:</span>
                <span className="font-mono text-cyan-300">{analysis.specs.sizes.join(' - ')}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Distinctive Features */}
      {analysis.visualFeatures && analysis.visualFeatures.length > 0 && (
        <div className="bg-slate-900/40 border border-slate-800 rounded-xl p-4">
          <h4 className="text-xs font-bold text-slate-300 mb-2 flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-indigo-400" />
            السمات البصرية المميزة للمطابقة والبحث عن الصور المماثلة:
          </h4>
          <div className="flex flex-wrap gap-2">
            {analysis.visualFeatures.map((feat, i) => (
              <span
                key={i}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/80"
              >
                {feat}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Raw OCR Text Reader */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4">
        <div className="flex items-center justify-between mb-2">
          <button
            onClick={() => setShowFullOcr(!showFullOcr)}
            className="flex items-center gap-2 text-xs font-bold text-slate-300 hover:text-white transition"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>نصوص الـ OCR الكاملة المستخرجة من الصورة</span>
            {showFullOcr ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            onClick={() => copyToClipboard(analysis.fullOcrText, 'full-ocr')}
            className="text-xs text-slate-400 hover:text-cyan-300 flex items-center gap-1 transition"
          >
            {copiedKey === 'full-ocr' ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>تم النسخ</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>نسخ كل النصوص</span>
              </>
            )}
          </button>
        </div>

        {showFullOcr && (
          <pre className="mt-3 p-3 rounded-lg bg-slate-900/90 text-xs text-slate-300 font-mono whitespace-pre-wrap leading-relaxed border border-slate-800 max-h-60 overflow-y-auto">
            {analysis.fullOcrText}
          </pre>
        )}
      </div>
    </div>
  );
};
