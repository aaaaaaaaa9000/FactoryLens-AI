import React, { useState } from 'react';
import { X, Search, MapPin, Tag, Building2, Sparkles, Filter } from 'lucide-react';

interface RefineSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialFactoryName: string;
  initialModelCode?: string;
  initialCategory?: string;
  onExecuteSearch: (params: {
    factoryName: string;
    modelCode: string;
    category: string;
    location: string;
    additionalKeywords: string;
  }) => Promise<void>;
  isLoading: boolean;
}

export const RefineSearchModal: React.FC<RefineSearchModalProps> = ({
  isOpen,
  onClose,
  initialFactoryName,
  initialModelCode = '',
  initialCategory = '',
  onExecuteSearch,
  isLoading,
}) => {
  const [factoryName, setFactoryName] = useState(initialFactoryName);
  const [modelCode, setModelCode] = useState(initialModelCode);
  const [category, setCategory] = useState(initialCategory);
  const [location, setLocation] = useState('مصر والوطن العربي');
  const [additionalKeywords, setAdditionalKeywords] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onExecuteSearch({
      factoryName,
      modelCode,
      category,
      location,
      additionalKeywords,
    });
    onClose();
  };

  const presetLocations = [
    'العاشر من رمضان',
    'المحلة الكبرى',
    'العتبة والموسكي',
    '6 أكتوبر',
    'شبرا الخيمة',
    'الإسكندرية',
    'تركيا (إسطنبول)',
    'الصين (جوانزو)',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-5 relative">
        <button
          onClick={onClose}
          className="absolute top-5 left-5 p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
            <Filter className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              تعديل معايير البحث والفلترة
            </h3>
            <p className="text-xs text-slate-400">
              قم بتعديل اسم المصنع أو المنطقة لإعادة البحث المباشر في فيسبوك وتليجرام
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-indigo-400" />
              اسم المصنع / الشركة / اللوجو:
            </label>
            <input
              type="text"
              value={factoryName}
              onChange={(e) => setFactoryName(e.target.value)}
              required
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                كود الموديل:
              </label>
              <input
                type="text"
                value={modelCode}
                onChange={(e) => setModelCode(e.target.value)}
                placeholder="مثال: 704 أو MOD-2026"
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white font-mono focus:outline-none focus:border-cyan-500"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                التصنيف التجاري:
              </label>
              <input
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="ملابس، أحذية، أدوات..."
                className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-rose-400" />
              المدينة أو المنطقة الصناعية المستهدفة:
            </label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="مثال: العاشر من رمضان، المحلة..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500 mb-2"
            />
            {/* Quick chips */}
            <div className="flex flex-wrap gap-1.5">
              {presetLocations.map((loc) => (
                <button
                  type="button"
                  key={loc}
                  onClick={() => setLocation(loc)}
                  className={`text-[10px] px-2 py-0.5 rounded-lg border transition ${
                    location === loc
                      ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                      : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                  }`}
                >
                  {loc}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              كلمات مفتاحية إضافية:
            </label>
            <input
              type="text"
              value={additionalKeywords}
              onChange={(e) => setAdditionalKeywords(e.target.value)}
              placeholder="مثال: قطاعي، شحن محافظات، جملة الجملة، تليجرام حصري..."
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-white focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-400 hover:text-white transition"
            >
              إلغاء
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold transition flex items-center gap-2 shadow-lg shadow-indigo-600/30"
            >
              {isLoading ? (
                <span>جارٍ البحث...</span>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>تحديث والبحث المباشر</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
