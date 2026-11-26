import React, { useState, useRef, useEffect, DragEvent, ChangeEvent } from 'react';
import {
  UploadCloud,
  Image as ImageIcon,
  Clipboard,
  Sparkles,
  RefreshCw,
  Search,
  CheckCircle2,
  FileText,
  AlertCircle,
  Zap,
} from 'lucide-react';
import { SAMPLE_DATA, SampleItem } from '../utils/sampleData';

interface ImageUploaderProps {
  onAnalyze: (imageBase64: string, mimeType: string, userPrompt: string) => Promise<void>;
  onSelectSample: (sample: SampleItem) => void;
  isLoading: boolean;
  loadingStep: string;
}

// Shrink big photos before upload: faster, cheaper and avoids server body limits
function downscaleImage(dataUrl: string, maxSide = 1600): Promise<string> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const ratio = Math.min(1, maxSide / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * ratio);
      canvas.height = Math.round(img.height * ratio);
      const ctx = canvas.getContext('2d');
      if (!ctx) return resolve(dataUrl);
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };
    img.onerror = () => resolve(dataUrl);
    img.src = dataUrl;
  });
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  onAnalyze,
  onSelectSample,
  isLoading,
  loadingStep,
}) => {
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [clipboardNotice, setClipboardNotice] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Global paste handler to allow pasting images directly with Ctrl+V
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      for (let i = 0; i < items.length; i++) {
        if (items[i].type.indexOf('image') !== -1) {
          const file = items[i].getAsFile();
          if (file) {
            handleFile(file);
            setClipboardNotice(true);
            setTimeout(() => setClipboardNotice(false), 3500);
            break;
          }
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, []);

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('يرجى اختيار ملف صورة صالح (JPEG, PNG, WebP)');
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreviewUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleStartAnalysis = async () => {
    if (!previewUrl) return;
    const small = await downscaleImage(previewUrl);
    await onAnalyze(small, 'image/jpeg', userPrompt);
  };

  const handleClear = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    setUserPrompt('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-3xl p-5 sm:p-7 shadow-2xl relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-1/4 w-96 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-40 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {clipboardNotice && (
        <div className="mb-4 bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs px-4 py-2.5 rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>تم لصق الصورة مباشرة من الحافظة بنجاح!</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left/Main Column: Image Upload Area */}
        <div className="lg:col-span-7 space-y-4">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => !previewUrl && fileInputRef.current?.click()}
            className={`relative min-h-[300px] sm:min-h-[340px] rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center p-6 text-center cursor-pointer ${
              dragActive
                ? 'border-indigo-400 bg-indigo-500/10 scale-[1.01]'
                : previewUrl
                ? 'border-slate-700 bg-slate-950/60'
                : 'border-slate-700/80 bg-slate-800/20 hover:border-indigo-500/60 hover:bg-slate-800/40'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleChange}
            />

            {previewUrl ? (
              <div className="relative w-full h-full flex flex-col items-center justify-center group">
                <img
                  src={previewUrl}
                  alt="الصورة المرفوعة"
                  className="max-h-[300px] w-auto max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/10"
                />

                <div className="absolute top-2 left-2 flex items-center gap-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClear();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-rose-300 hover:text-white hover:bg-rose-600/80 border border-slate-700 text-xs font-medium backdrop-blur-md transition shadow-lg"
                  >
                    تغيير الصورة
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      fileInputRef.current?.click();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-900/90 text-slate-300 hover:text-white hover:bg-slate-800 border border-slate-700 text-xs font-medium backdrop-blur-md transition shadow-lg"
                  >
                    اختيار أخرى
                  </button>
                </div>

                <div className="mt-3 text-xs text-slate-400 bg-slate-900/80 px-3 py-1 rounded-full border border-slate-800">
                  جاهزة للفحص واستخراج البيانات والشعار
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-indigo-500/20 via-blue-500/20 to-cyan-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition shadow-inner">
                  <UploadCloud className="w-8 h-8" />
                </div>

                <div>
                  <p className="text-base sm:text-lg font-bold text-white mb-1">
                    اسحب وأفلت صورة المنتج هنا، أو انقر للاختيار
                  </p>
                  <p className="text-xs sm:text-sm text-slate-400">
                    تدعم صور الملابس، تيكت المصنع، كرتونة الأحذية، ستيكر المنتجات، أو تصوير القطعة بالكاميرا
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] text-slate-400 pt-2">
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700 flex items-center gap-1">
                    <Clipboard className="w-3.5 h-3.5 text-cyan-400" />
                    يمكنك لصق الصورة مباشرة بـ <kbd className="text-slate-300 font-mono">Ctrl + V</kbd>
                  </span>
                  <span className="px-2.5 py-1 rounded-md bg-slate-800/80 border border-slate-700">
                    JPG, PNG, WebP
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Optional Focus Note Input */}
          <div className="bg-slate-950/40 border border-slate-800 rounded-xl p-3">
            <label className="block text-xs font-semibold text-slate-300 mb-1.5 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                توجيه أو ملاحظة إضافية (اختياري):
              </span>
              <span className="text-[10px] text-slate-500 font-normal">
                مثل: ركز على اسم المصنع على الشريط الجانبي
              </span>
            </label>
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="مثال: ركز على رقم الواتساب المكتوب، أو تأكد من اسم المصنع في اللوجو..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-lg px-3 py-2 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Action Trigger Button */}
          {previewUrl && (
            <button
              onClick={handleStartAnalysis}
              disabled={isLoading}
              className={`w-full py-3.5 px-6 rounded-xl font-bold text-sm text-white shadow-xl transition-all flex items-center justify-center gap-2.5 ${
                isLoading
                  ? 'bg-slate-800 cursor-not-allowed text-slate-400'
                  : 'bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0'
              }`}
            >
              {isLoading ? (
                <>
                  <RefreshCw className="w-5 h-5 animate-spin text-cyan-400" />
                  <span>{loadingStep || 'جارٍ الفحص البصري واستخراج البيانات...'}</span>
                </>
              ) : (
                <>
                  <Search className="w-5 h-5" />
                  <span>فحص الصورة واستخراج بيانات المصنع والبحث الفوري</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Right Column: Instant Samples & Quick Start */}
        <div className="lg:col-span-5 space-y-4">
          <div className="border border-slate-800 bg-slate-950/60 rounded-2xl p-4 sm:p-5">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-amber-400" />
                أمثلة تجريبية سريعة (جاهزة بنقرة واحدة)
              </h3>
              <span className="text-[10px] text-slate-500">جرب فوراً</span>
            </div>

            <p className="text-xs text-slate-400 mb-3 leading-relaxed">
              اختر أحد النماذج الميدانية الجاهزة لاختبار استخراج بيانات المصانع، الشعارات، والبحث في فيسبوك وتليجرام:
            </p>

            <div className="space-y-2.5">
              {SAMPLE_DATA.map((sample) => (
                <button
                  key={sample.id}
                  onClick={() => onSelectSample(sample)}
                  disabled={isLoading}
                  className="w-full text-right p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-indigo-500/40 transition group flex items-center gap-3"
                >
                  <div className="w-14 h-14 rounded-lg bg-slate-950 overflow-hidden border border-slate-700/80 shrink-0 p-1 flex items-center justify-center">
                    <img
                      src={sample.imageBase64}
                      alt={sample.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                        {sample.name}
                      </h4>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-indigo-500/10 text-indigo-300 border border-indigo-500/20 font-mono">
                        {sample.category.split(' ')[0]}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                      {sample.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-500">
                      <span>كود: {sample.mockAnalysis.modelCodes?.[0]}</span>
                      <span>•</span>
                      <span>واتساب متاح</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Explanation Card */}
          <div className="bg-gradient-to-br from-indigo-950/40 to-slate-900/40 border border-indigo-900/30 rounded-2xl p-4 text-xs space-y-2">
            <h4 className="font-bold text-slate-200 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              ماذا يفعل التطبيق عند رفع الصورة؟
            </h4>
            <ul className="space-y-1.5 text-slate-400 list-disc list-inside">
              <li>قراءة الـ OCR لجميع النصوص المطبوعة على التيكت أو الكرتونة أو المنتج.</li>
              <li>استخراج اسم المصنع، اللوجو، وأرقام تليفونات وواتساب المبيعات.</li>
              <li>توليد روابط بحث مباشر في صفحات وجروبات فيسبوك المتخصصة بالجملة.</li>
              <li>كشف قنوات ومجموعات تليجرام التابعة للمصنع ومكاتب التوزيع.</li>
              <li>إطلاق بحث بصري عكسي في Google Lens وYandex لمطابقة الموديلات.</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
