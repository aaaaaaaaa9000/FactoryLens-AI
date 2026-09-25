import React from 'react';
import { X, Trash2, Clock, ChevronLeft, Building2, Tag, ArrowUpRight } from 'lucide-react';
import { HistoryItem } from '../types';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border-r border-slate-800 w-full max-w-md h-full flex flex-col shadow-2xl relative">
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm font-bold text-white">سجل العمليات السابقة</h3>
            <span className="text-xs px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 font-mono">
              {history.length}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="p-1.5 rounded-lg text-rose-400 hover:text-white hover:bg-rose-500/20 transition text-xs"
                title="مسح كل السجل"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* List of items */}
        <div className="p-4 flex-1 overflow-y-auto space-y-3">
          {history.length === 0 ? (
            <div className="py-20 text-center text-slate-500 text-xs space-y-2">
              <p>السجل فارغ حالياً.</p>
              <p className="text-slate-600">
                أي صورة تقوم بفحصها سيتم حفظها محلياً على جهازك لسهولة الرجوع لها لاحقاً.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onSelectHistory(item);
                  onClose();
                }}
                className="w-full text-right bg-slate-950/80 hover:bg-slate-800/90 border border-slate-800/90 hover:border-indigo-500/40 p-3.5 rounded-2xl transition group flex items-start gap-3"
              >
                <div className="w-14 h-14 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 p-1 shrink-0 flex items-center justify-center">
                  <img
                    src={item.imageBase64}
                    alt={item.factoryName}
                    className="max-h-full max-w-full object-contain"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 transition truncate">
                      {item.factoryName || 'مصنع غير معروف'}
                    </h4>
                    <span className="text-[10px] text-slate-500">
                      {new Date(item.timestamp).toLocaleDateString('ar-EG', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>

                  <p className="text-[11px] text-slate-400 truncate mt-0.5">
                    {item.productTitle}
                  </p>

                  <div className="flex items-center gap-2 mt-1.5 text-[10px] text-slate-500 font-mono">
                    <span className="px-1.5 py-0.5 rounded bg-slate-900 border border-slate-800 text-indigo-300">
                      {item.category.split(' ')[0]}
                    </span>
                    {item.analysis.modelCodes?.[0] && (
                      <span className="text-cyan-400">
                        كود: {item.analysis.modelCodes[0]}
                      </span>
                    )}
                  </div>
                </div>

                <ChevronLeft className="w-4 h-4 text-slate-600 group-hover:text-white group-hover:translate-x-[-2px] transition self-center" />
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
