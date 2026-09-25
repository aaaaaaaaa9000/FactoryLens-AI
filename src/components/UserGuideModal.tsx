import React from 'react';
import { X, HelpCircle, CheckCircle2, Facebook, Send, Instagram, Sparkles, Image, Search, ShieldCheck } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full max-h-[90vh] flex flex-col shadow-2xl relative overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                دليل الاستخدام السريع لمحرك "بصير المصانع"
              </h3>
              <p className="text-xs text-slate-400">
                كيف تصل إلى المصنع المباشر بأعلى دقة وتتجنب الوسطاء
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs text-slate-300 leading-relaxed">
          <div className="space-y-4">
            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 shrink-0">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">1. تصوير أو رفع صورة واضحة</h4>
                <p className="text-slate-400">
                  للحصول على أفضل النتائج، التقط صورة تركز على <strong>بطاقة السعر (التيكت)، كرتونة المنتج، أو شريط الرقبة والماركة</strong>. إذا كان اللوجو واضحاً، سيتعرف عليه الذكاء الاصطناعي ويستخرج اسم المصنع بالعربية والإنجليزية بدقة متناهية.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0">
                <Facebook className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">2. البحث المباشر في فيسبوك</h4>
                <p className="text-slate-400">
                  يوفر التطبيق نتائج مباشرة مكشوفة عبر الويب لصفحات وجروبات المصنع، بالإضافة لأزرار بحث فوري تفتح فيسبوك بكلمات استعلام مخصصة للوصول إلى صفحات المصنع المعتمدة وجروبات الجملة والمنشورات الخاصة بكود القطعة.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="p-2 rounded-xl bg-sky-500/20 text-sky-400 shrink-0">
                <Send className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">3. قنوات تليجرام لمكاتب الجملة والمصانع</h4>
                <p className="text-slate-400">
                  تعد قنوات تليجرام هي المركز الرئيسي لعرض الموديلات الفورية والأسعار الحقيقية لمصانع مصر وتركيا والصين. يتيح لك التطبيق البحث المباشر في أدلة تليجرام (مثل TGStat وTelemetr) وبحث جوجل لقنوات <code className="text-sky-300 font-mono">site:t.me</code>.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="p-2 rounded-xl bg-purple-500/20 text-purple-400 shrink-0">
                <Instagram className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">4. انستغرام وتويتر (𝕏)</h4>
                <p className="text-slate-400">
                  كشف معارض ملابس المصنع وريلز انستغرام وهاشتاج الموديل لرؤية حركة القطعة وخامتها تحت الإضاءة الطبيعية، بالإضافة لمتابعة تغريدات وصفقات التوريد المباشرة على منصة 𝕏.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="p-2 rounded-xl bg-cyan-500/20 text-cyan-400 shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">5. خوارزمية التطابق البصري المقاوم للزوايا والإضاءة</h4>
                <p className="text-slate-400">
                  تتعرف الخوارزمية على الموديل حتى لو كانت الصورة ملتقطة من زاوية مائلة، أو تحت إضاءة ضعيفة أو فلاش حاد، أو مع انعكاسات أكياس التعبئة البلاستيكية، من خلال عزل الهيكل الهندسي ونمط النسيج وتوليد استعلامات مطابقة محكمة.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80">
              <div className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 shrink-0">
                <Image className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-white text-sm">6. البحث العكسي ومطابقة الصور المتشابهة</h4>
                <p className="text-slate-400">
                  استخدم محرك Yandex أو Google Lens بنقرة واحدة لاكتشاف الصور المتطابقة لنفس التصميم في متاجر أخرى ومواقع التوريد العالمية (Alibaba, Taobao, إلخ) أو الموديلات المشابهة في القصات والألوان.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 space-y-1">
            <span className="font-bold flex items-center gap-1.5 text-xs">
              <ShieldCheck className="w-4 h-4" />
              ملاحظة بخصوص الخصوصية:
            </span>
            <p className="text-[11px] text-amber-200/80">
              يتم معالجة الصور بأمان كامل وبسرعة فائقة. يمكنك حفظ وتصدير ملف المصنع أو مسح السجل المحلي في أي وقت.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs transition"
          >
            فهمت، لنبدأ الآن!
          </button>
        </div>
      </div>
    </div>
  );
};
