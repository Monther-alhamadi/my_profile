import React, { useState, useEffect } from 'react';
import { Target, CheckCircle2, AlertTriangle, Key, Sparkles, Loader2, RefreshCcw, Wand2, X } from 'lucide-react';
import { analyzeCVATS, ATSAnalysisResult } from '@/services/gemini-cv-assistant';
import type { CVData, Language } from '@/lib/index';
import { toast } from 'sonner';

interface CVATSCheckerProps {
  cv: CVData;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onApplySummary: (summaryEn: string, summaryAr: string) => void;
}

export function CVATSChecker({ cv, isOpen, onClose, language, onApplySummary }: CVATSCheckerProps) {
  const isAr = language === 'ar';
  const [jobDescription, setJobDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ATSAnalysisResult | null>(null);

  const runAnalysis = async () => {
    setLoading(true);
    try {
      const data = await analyzeCVATS(cv, jobDescription, language);
      setResult(data);
      toast.success(isAr ? 'تم اكتمال تحليل السيرة الذاتية بنجاح' : 'CV ATS analysis completed successfully');
    } catch (err) {
      toast.error(isAr ? 'فشل إجراء التحليل' : 'Analysis failed');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen && !result) {
      runAnalysis();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const scoreColor =
    (result?.score || 0) >= 80 ? 'text-emerald-500 stroke-emerald-500' : (result?.score || 0) >= 60 ? 'text-amber-500 stroke-amber-500' : 'text-red-500 stroke-red-500';

  return (
    <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto" dir={isAr ? 'rtl' : 'ltr'}>
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-2xl overflow-hidden border border-border flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-obsidian text-white">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-emerald-brand" />
            <h3 className="text-sm font-bold">{isAr ? 'فاحص توافق أنظمة التوظيف ATS & مطابقة الوظائف' : 'ATS Compatibility & Job Matcher'}</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-gray-300 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Target Job Description Input */}
          <div className="bg-gray-50 border border-gray-200 rounded-md p-3">
            <label className="text-xs font-semibold text-obsidian flex items-center gap-1.5 mb-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-brand" />
              {isAr ? 'طابق السيرة الذاتية مع وصف وظيفي محدد (اختياري):' : 'Match against specific Job Description (Optional):'}
            </label>
            <textarea
              rows={3}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder={isAr ? 'الصق الوصف الوظيفي هنا لتحليل الكلمات المفتاحية الناقصة...' : 'Paste target job description here to analyze missing keywords...'}
              className="w-full text-xs bg-white border border-gray-200 rounded p-2 focus:outline-none focus:ring-1 focus:ring-emerald-brand"
            />
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="mt-2 text-xs bg-emerald-brand text-white font-semibold py-1.5 px-3 rounded flex items-center gap-1.5 hover:bg-emerald-600 transition-colors disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCcw className="w-3.5 h-3.5" />}
              {isAr ? 'إعادة تحليل وتكييف المهارات' : 'Run ATS Analysis & Match'}
            </button>
          </div>

          {/* Results Display */}
          {loading ? (
            <div className="py-12 flex flex-col items-center justify-center text-center">
              <Loader2 className="w-8 h-8 text-emerald-brand animate-spin mb-2" />
              <p className="text-xs font-semibold text-obsidian">{isAr ? 'جاري فحص السيرة الذاتية ومطابقة الكلمات المفتاحية...' : 'Analyzing CV against ATS algorithms...'}</p>
            </div>
          ) : result ? (
            <div className="space-y-4">
              {/* Score Meter */}
              <div className="flex items-center justify-between bg-emerald-50/50 border border-emerald-100 rounded-lg p-4">
                <div>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider">{isAr ? 'درجة التوافق ATS' : 'ATS Compatibility Score'}</h4>
                  <p className="text-xs text-gray-600 mt-1 max-w-sm">{result.summary_feedback}</p>
                </div>
                <div className="relative w-16 h-16 flex items-center justify-center">
                  <span className={`text-xl font-extrabold ${scoreColor}`}>{result.score}%</span>
                </div>
              </div>

              {/* Strengths & Weaknesses */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="border border-green-200 bg-green-50/40 rounded-md p-3">
                  <h5 className="text-xs font-bold text-green-800 flex items-center gap-1 mb-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    {isAr ? 'نقاط القوة (Strengths)' : 'Strengths'}
                  </h5>
                  <ul className="space-y-1">
                    {result.strengths.map((s, i) => (
                      <li key={i} className="text-[11px] text-green-900 flex items-start gap-1.5">
                        <span className="text-green-500 font-bold">•</span>
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border border-amber-200 bg-amber-50/40 rounded-md p-3">
                  <h5 className="text-xs font-bold text-amber-800 flex items-center gap-1 mb-2">
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    {isAr ? 'نقاط للتحسين (Weaknesses)' : 'Areas to Improve'}
                  </h5>
                  <ul className="space-y-1">
                    {result.weaknesses.map((w, i) => (
                      <li key={i} className="text-[11px] text-amber-900 flex items-start gap-1.5">
                        <span className="text-amber-500 font-bold">•</span>
                        <span>{w}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Missing Keywords */}
              {result.missing_keywords?.length > 0 && (
                <div className="border border-purple-200 bg-purple-50/30 rounded-md p-3">
                  <h5 className="text-xs font-bold text-purple-900 flex items-center gap-1 mb-2">
                    <Key className="w-4 h-4 text-purple-600" />
                    {isAr ? 'الكلمات المفتاحية الموصى بإضافتها (Missing Keywords):' : 'Recommended Keywords to Include:'}
                  </h5>
                  <div className="flex flex-wrap gap-1.5">
                    {result.missing_keywords.map((kw, i) => (
                      <span key={i} className="text-[10px] font-semibold bg-purple-100 text-purple-800 px-2 py-0.5 rounded border border-purple-200">
                        + {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Tailored Summary Suggestion */}
              {(result.tailored_summary_en || result.tailored_summary_ar) && (
                <div className="border border-emerald-200 bg-emerald-50/30 rounded-md p-3 space-y-2">
                  <div className="flex items-center justify-between">
                    <h5 className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                      <Wand2 className="w-4 h-4 text-emerald-600" />
                      {isAr ? 'الملخص المهني المطور والمطابق للـ ATS:' : 'ATS Optimized Professional Summary:'}
                    </h5>
                    <button
                      onClick={() => {
                        onApplySummary(result.tailored_summary_en || '', result.tailored_summary_ar || '');
                        toast.success(isAr ? 'تم تطبيق الملخص الجديد للسيرة الذاتية!' : 'Applied new summary to CV!');
                      }}
                      className="text-xs bg-emerald-brand text-white px-2.5 py-1 rounded font-semibold hover:bg-emerald-600 transition-colors"
                    >
                      {isAr ? 'تطبيق هذا الملخص' : 'Apply Summary'}
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-700 leading-relaxed italic bg-white p-2 rounded border border-emerald-100">
                    "{isAr ? result.tailored_summary_ar : result.tailored_summary_en}"
                  </p>
                </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
