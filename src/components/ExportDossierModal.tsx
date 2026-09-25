import React, { useState } from 'react';
import { X, Printer, Copy, Check, Share2, Building2, MessageCircle, FileText } from 'lucide-react';
import { ImageAnalysisResult, GroundedSearchResult } from '../types';

interface ExportDossierModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysis: ImageAnalysisResult;
  searchResult?: GroundedSearchResult;
  imageUrl?: string;
}

export const ExportDossierModal: React.FC<ExportDossierModalProps> = ({
  isOpen,
  onClose,
  analysis,
  searchResult,
  imageUrl,
}) => {
  const [copied, setCopied] = useState<boolean>(false);

  if (!isOpen) return null;

  const generateWhatsAppMessage = () => {
    const phones = analysis.contactInfo?.phones?.join(', ') || 'غير متوفر';
    const models = analysis.modelCodes?.join(', ') || 'بدون كود';

    return `*استفسار تجاري بخصوص منتج مصنع ${analysis.factoryName}*
------------------------------
🏷️ *المنتج:* ${analysis.productTitle}
🏭 *المصنع:* ${analysis.factoryName} (${analysis.factoryNameEn || ''})
🔢 *كود الموديل:* ${models}
📦 *التصنيف:* ${analysis.productCategory}
🎨 *المواصفات:* ${analysis.specs?.materials?.join(', ') || 'حسب العينة'}
📞 *هواتف المصنع:* ${phones}
------------------------------
السلام عليكم ورحمة الله،
أود الاستفسار عن توفر هذا الموديل وسعر بيع جملة السيرية / الدستة، وشروط الشحن والمتاح بالمخازن حالياً.`;
  };

  const handleCopyMessage = () => {
    navigator.clipboard.writeText(generateWhatsAppMessage());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                بطاقة ملف المصنع والمنتج (Dossier)
              </h3>
              <p className="text-xs text-slate-400">
                تقرير شامل وجاهز للمشاركة أو الطباعة أو الإرسال للتجار
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-slate-200">
          <div className="bg-slate-950 border border-slate-800 rounded-2xl p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-start justify-between gap-4">
              <div className="space-y-1">
                <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-wider">
                  سجل استخبارات المصنع
                </span>
                <h4 className="text-xl font-black text-white">
                  {analysis.factoryName}
                </h4>
                {analysis.factoryNameEn && (
                  <p className="text-xs text-slate-400 font-mono">
                    {analysis.factoryNameEn}
                  </p>
                )}
              </div>

              {imageUrl && (
                <div className="w-20 h-20 rounded-xl overflow-hidden border border-slate-700 bg-slate-900 p-1 shrink-0">
                  <img src={imageUrl} alt="العينة" className="w-full h-full object-contain" />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2 text-xs border-t border-slate-800/80">
              <div>
                <span className="text-slate-400 block text-[11px]">المنتج:</span>
                <span className="font-semibold text-white">{analysis.productTitle}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">كود الموديل:</span>
                <span className="font-mono text-cyan-300 font-bold">
                  {analysis.modelCodes?.join(', ') || 'غير مدون'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">الفئة:</span>
                <span className="text-white">{analysis.productCategory}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">مستوى الثقة:</span>
                <span className="text-emerald-400 font-medium">{analysis.confidence}</span>
              </div>
            </div>

            {analysis.contactInfo?.phones && analysis.contactInfo.phones.length > 0 && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 block text-[11px] mb-1">أرقام التواصل:</span>
                <div className="flex flex-wrap gap-2">
                  {analysis.contactInfo.phones.map((p, i) => (
                    <span key={i} className="font-mono bg-slate-900 px-2.5 py-1 rounded-md text-emerald-400">
                      {p}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {searchResult?.factoryOverview && (
              <div className="pt-2 border-t border-slate-800/80">
                <span className="text-slate-400 block text-[11px] mb-1">نشاط المصنع وشهرته:</span>
                <p className="text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl">
                  {searchResult.factoryOverview}
                </p>
              </div>
            )}
          </div>

          {/* Ready WhatsApp Inquiry Template */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-300 flex items-center gap-1.5">
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                صيغة رسالة استفسار واتساب وتليجرام جاهزة:
              </span>
              <button
                onClick={handleCopyMessage}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'تم النسخ' : 'نسخ الرسالة'}</span>
              </button>
            </div>

            <pre className="bg-slate-950 border border-slate-800 p-3.5 rounded-xl text-xs text-slate-300 font-sans whitespace-pre-wrap leading-relaxed">
              {generateWhatsAppMessage()}
            </pre>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition"
          >
            إغلاق
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyMessage}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1.5 transition"
            >
              <Copy className="w-4 h-4" />
              <span>نسخ الاستفسار</span>
            </button>
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-indigo-600/30"
            >
              <Printer className="w-4 h-4" />
              <span>طباعة / حفظ PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
