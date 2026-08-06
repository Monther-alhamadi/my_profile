import React from 'react';
import { History, Undo, Redo, X, Bot, User, RotateCcw, Clock } from 'lucide-react';
import type { CVHistoryEntry } from '@/services/cv-history';
import type { Language } from '@/lib/index';
import { toast } from 'sonner';

interface CVHistoryPanelProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  pastEntries: ReadonlyArray<CVHistoryEntry>;
  canUndo: boolean;
  canRedo: boolean;
  undoLabel: string | null;
  redoLabel: string | null;
  onUndo: () => void;
  onRedo: () => void;
  onRestoreTo: (index: number) => void;
}

export function CVHistoryPanel({
  isOpen,
  onClose,
  language,
  pastEntries,
  canUndo,
  canRedo,
  undoLabel,
  redoLabel,
  onUndo,
  onRedo,
  onRestoreTo,
}: CVHistoryPanelProps) {
  const isAr = language === 'ar';

  if (!isOpen) return null;

  const formatTime = (ts: number) => {
    const d = new Date(ts);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  return (
    <div
      className="fixed inset-y-0 right-0 z-50 w-full sm:w-80 bg-white shadow-2xl border-l border-border flex flex-col transition-all duration-300 animate-in slide-in-from-right"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-obsidian text-white border-b border-gray-800">
        <div className="flex items-center gap-2">
          <History className="w-4 h-4 text-emerald-brand" />
          <h3 className="text-xs font-bold">{isAr ? 'سجل التعديلات والتراجع' : 'History & Revision Stack'}</h3>
        </div>
        <button onClick={onClose} className="p-1 rounded text-gray-300 hover:text-white hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Toolbar: Undo & Redo */}
      <div className="p-3 bg-gray-50 border-b border-gray-200 flex items-center justify-between gap-2">
        <button
          onClick={() => {
            onUndo();
            toast.success(isAr ? 'تم التراجع عن التعديل' : 'Undone change');
          }}
          disabled={!canUndo}
          className="flex-1 py-1.5 px-3 bg-white border border-gray-200 hover:border-emerald-brand hover:text-emerald-brand disabled:opacity-40 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Undo className="w-3.5 h-3.5 text-emerald-brand" />
          <span>{isAr ? 'تراجع (Undo)' : 'Undo'}</span>
        </button>

        <button
          onClick={() => {
            onRedo();
            toast.success(isAr ? 'تم إعادة التطبيق' : 'Redone change');
          }}
          disabled={!canRedo}
          className="flex-1 py-1.5 px-3 bg-white border border-gray-200 hover:border-emerald-brand hover:text-emerald-brand disabled:opacity-40 rounded text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
        >
          <Redo className="w-3.5 h-3.5 text-blue-500" />
          <span>{isAr ? 'إعادة (Redo)' : 'Redo'}</span>
        </button>
      </div>

      {/* History Entries List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {pastEntries.length === 0 ? (
          <div className="py-12 text-center text-xs text-muted-foreground flex flex-col items-center justify-center">
            <Clock className="w-6 h-6 text-gray-300 mb-2" />
            <p>{isAr ? 'لا توجد تعديلات محفوظة في السجل بعد' : 'No revisions in history stack yet'}</p>
          </div>
        ) : (
          pastEntries
            .slice()
            .reverse()
            .map((entry, revIndex) => {
              const originalIndex = pastEntries.length - 1 - revIndex;
              return (
                <div
                  key={entry.timestamp + originalIndex}
                  className="bg-white border border-gray-200 hover:border-emerald-brand/50 rounded-lg p-2.5 shadow-sm flex items-start justify-between gap-2 text-xs transition-colors group"
                >
                  <div className="flex items-start gap-2 min-w-0">
                    <div
                      className={`p-1.5 rounded-full flex-shrink-0 mt-0.5 ${
                        entry.source === 'ai' ? 'bg-purple-100 text-purple-600' : 'bg-emerald-100 text-emerald-600'
                      }`}
                    >
                      {entry.source === 'ai' ? <Bot className="w-3.5 h-3.5" /> : <User className="w-3.5 h-3.5" />}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-obsidian text-[11px] truncate leading-tight">{entry.label}</p>
                      <span className="text-[9.5px] font-mono text-muted-foreground flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3" />
                        {formatTime(entry.timestamp)}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onRestoreTo(originalIndex);
                      toast.success(isAr ? 'تم استعادة هذه الخطوة' : 'Restored to this checkpoint');
                    }}
                    title={isAr ? 'استعادة السيرة الذاتية إلى هذه الحالة' : 'Restore CV state to this checkpoint'}
                    className="p-1 rounded hover:bg-emerald-50 text-gray-400 hover:text-emerald-brand transition-colors flex-shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
        )}
      </div>
    </div>
  );
}
