import React, { useState } from 'react';
import {
  Sparkles, X, FileText, Check, ArrowRight, ArrowLeft, Loader2,
  User, Briefcase, GraduationCap, Code2, FolderGit2, Award, Trash2
} from 'lucide-react';
import { parseRawResumeTextWithAI } from '@/services/gemini-cv-assistant';
import type { CVData, Language } from '@/lib/index';
import { toast } from 'sonner';

interface CVImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onConfirmImport: (importedCv: Partial<CVData>, versionName: string) => Promise<void>;
}

export function CVImportModal({
  isOpen,
  onClose,
  language,
  onConfirmImport,
}: CVImportModalProps) {
  const isAr = language === 'ar';
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [rawText, setRawText] = useState('');
  const [parsing, setParsing] = useState(false);
  const [importing, setImporting] = useState(false);
  const [versionName, setVersionName] = useState('');
  const [parsedCv, setParsedCv] = useState<Partial<CVData> | null>(null);

  if (!isOpen) return null;

  const handleRunAIParse = async () => {
    if (!rawText.trim() || parsing) return;

    setParsing(true);
    try {
      const cvResult = await parseRawResumeTextWithAI(rawText, language);
      setParsedCv(cvResult);

      const headerData = cvResult.sections?.find((s) => s.type === 'header')?.data;
      const suggestedName = headerData?.name
        ? `${headerData.name} - ${isAr ? 'مستوردة' : 'Imported'}`
        : isAr ? 'سيرة ذاتية مستوردة بالذكاء الاصطناعي' : 'AI Imported Resume';

      setVersionName(suggestedName);
      setStep(2);
      toast.success(isAr ? 'تم تفكيك واستخراج بيانات السيرة الذاتية بنجاح' : 'CV data extracted successfully');
    } catch (err: any) {
      toast.error(err.message || (isAr ? 'فشل تفكيك البيانات' : 'Failed to parse data'));
    } finally {
      setParsing(false);
    }
  };

  const handleConfirm = async () => {
    if (!parsedCv || importing) return;

    const finalName = versionName.trim() || (isAr ? 'سيرة مستوردة' : 'Imported CV');
    setImporting(true);
    try {
      await onConfirmImport(parsedCv, finalName);
      toast.success(isAr ? 'تم إنشاء نسخة السيرة الذاتية الجديدة بنجاح' : 'New CV version created successfully');
      onClose();
    } catch (err: any) {
      toast.error(isAr ? 'فشل إكمال عملية الاستيراد' : 'Failed to complete import');
    } finally {
      setImporting(false);
    }
  };

  // Helper to remove an item from preview
  const removeItemFromSection = (sectionType: string, itemId: string) => {
    if (!parsedCv?.sections) return;

    const updatedSections = parsedCv.sections.map((sec) => {
      if (sec.type !== sectionType) return sec;

      const data = { ...sec.data };
      if (sectionType === 'experience' && Array.isArray(data.items)) {
        data.items = data.items.filter((item: any) => item.id !== itemId);
      } else if (sectionType === 'education' && Array.isArray(data.education_items)) {
        data.education_items = data.education_items.filter((item: any) => item.id !== itemId);
      } else if (sectionType === 'skills' && Array.isArray(data.skill_categories)) {
        data.skill_categories = data.skill_categories.filter((item: any) => item.id !== itemId);
      } else if (sectionType === 'projects' && Array.isArray(data.project_items)) {
        data.project_items = data.project_items.filter((item: any) => item.id !== itemId);
      } else if (sectionType === 'certifications' && Array.isArray(data.cert_items)) {
        data.cert_items = data.cert_items.filter((item: any) => item.id !== itemId);
      }
      return { ...sec, data };
    });

    setParsedCv({ ...parsedCv, sections: updatedSections });
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      dir={isAr ? 'rtl' : 'ltr'}
    >
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-3xl overflow-hidden border border-border flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 bg-obsidian text-white border-b border-gray-800">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-purple-500/20 text-purple-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-bold">{isAr ? 'الاستيراد الذكي بالسيرة الذاتية (AI CV Parser)' : 'Smart AI Resume & LinkedIn Parser'}</h3>
              <p className="text-[10px] text-gray-400">{isAr ? 'استخراج وهيكلة البيانات تلقائياً بنقرة زر' : 'Automatically extract & structure resume data'}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1 rounded text-gray-300 hover:text-white hover:bg-white/10">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Stepper Progress Bar */}
        <div className="flex items-center justify-around bg-gray-50 border-b border-gray-200 px-6 py-2.5 text-xs font-semibold">
          <div className={`flex items-center gap-1.5 ${step === 1 ? 'text-purple-600 font-bold' : step > 1 ? 'text-emerald-600' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${step === 1 ? 'bg-purple-600 text-white' : step > 1 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>1</span>
            <span>{isAr ? '1. إدخال النص' : '1. Raw Text'}</span>
          </div>
          <div className="w-8 h-[1px] bg-gray-300" />
          <div className={`flex items-center gap-1.5 ${step === 2 ? 'text-purple-600 font-bold' : step > 2 ? 'text-emerald-600' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${step === 2 ? 'bg-purple-600 text-white' : step > 2 ? 'bg-emerald-600 text-white' : 'bg-gray-200 text-gray-600'}`}>2</span>
            <span>{isAr ? '2. معاينة البيانات' : '2. Preview & Edit'}</span>
          </div>
          <div className="w-8 h-[1px] bg-gray-300" />
          <div className={`flex items-center gap-1.5 ${step === 3 ? 'text-purple-600 font-bold' : 'text-gray-400'}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[11px] font-mono ${step === 3 ? 'bg-purple-600 text-white' : 'bg-gray-200 text-gray-600'}`}>3</span>
            <span>{isAr ? '3. حفظ كنسخة' : '3. Save Version'}</span>
          </div>
        </div>

        {/* Step Contents */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {/* STEP 1: RAW TEXT INPUT */}
          {step === 1 && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-obsidian block">
                {isAr ? 'الصق نص السيرة الذاتية القديمة، بروفايل LinkedIn، أو نبذة عن الخبرات:' : 'Paste raw resume text, LinkedIn profile text, or bio:'}
              </label>
              <textarea
                rows={10}
                value={rawText}
                onChange={(e) => setRawText(e.target.value)}
                placeholder={
                  isAr
                    ? 'مثال:\nMonther Alhamadi - Senior Software Engineer\nEmail: monther@example.com\nExperience: 3 years building React, Node.js and Flutter applications...\nEducation: Computer Science degree...'
                    : 'Paste full resume text here...'
                }
                className="w-full text-xs font-mono bg-gray-50 border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
          )}

          {/* STEP 2: PREVIEW PARSED DATA */}
          {step === 2 && parsedCv && (
            <div className="space-y-4">
              <p className="text-xs text-gray-600 bg-purple-50 p-2.5 rounded-lg border border-purple-100">
                {isAr ? '✨ قام الذكاء الاصطناعي بستخراج البيانات وتنسيقها. يمكنك مراجعة واستبعاد أي عناصر غير مطلوبة قبل الحفظ:' : '✨ AI extracted the following structured data. You can review and remove items before saving:'}
              </p>

              {/* Header Preview */}
              {parsedCv.sections?.find((s) => s.type === 'header')?.data && (
                <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-purple-700 mb-1">
                    <User className="w-4 h-4" />
                    <span>{isAr ? 'البيانات الشخصية والترويسة' : 'Header & Contact'}</span>
                  </div>
                  {(() => {
                    const h = parsedCv.sections?.find((s) => s.type === 'header')?.data;
                    return (
                      <p className="text-gray-700">
                        <strong>{h?.name}</strong> — {h?.title_en || h?.title_ar} | 📧 {h?.email} | 📍 {h?.location}
                      </p>
                    );
                  })()}
                </div>
              )}

              {/* Experience Preview */}
              {(() => {
                const items = parsedCv.sections?.find((s) => s.type === 'experience')?.data?.items || [];
                if (!items.length) return null;
                return (
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-purple-700">
                      <Briefcase className="w-4 h-4" />
                      <span>{isAr ? 'الخبرات المستخرجة' : 'Extracted Experiences'} ({items.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {items.map((exp: any) => (
                        <div key={exp.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 text-[11px]">
                          <div>
                            <strong className="text-obsidian">{exp.role}</strong> @ {exp.company} ({exp.start_date} - {exp.end_date})
                          </div>
                          <button onClick={() => removeItemFromSection('experience', exp.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Education Preview */}
              {(() => {
                const items = parsedCv.sections?.find((s) => s.type === 'education')?.data?.education_items || [];
                if (!items.length) return null;
                return (
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-purple-700">
                      <GraduationCap className="w-4 h-4" />
                      <span>{isAr ? 'التعليم المستخرج' : 'Extracted Education'} ({items.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {items.map((edu: any) => (
                        <div key={edu.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 text-[11px]">
                          <div>
                            <strong className="text-obsidian">{edu.degree} in {edu.field}</strong> @ {edu.institution}
                          </div>
                          <button onClick={() => removeItemFromSection('education', edu.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Skills Preview */}
              {(() => {
                const items = parsedCv.sections?.find((s) => s.type === 'skills')?.data?.skill_categories || [];
                if (!items.length) return null;
                return (
                  <div className="bg-white border border-gray-200 rounded-lg p-3 text-xs space-y-2">
                    <div className="flex items-center gap-1.5 font-bold text-purple-700">
                      <Code2 className="w-4 h-4" />
                      <span>{isAr ? 'المهارات المستخرجة' : 'Extracted Skill Categories'} ({items.length})</span>
                    </div>
                    <div className="space-y-1.5">
                      {items.map((cat: any) => (
                        <div key={cat.id} className="flex items-center justify-between bg-gray-50 p-2 rounded border border-gray-200 text-[11px]">
                          <div>
                            <strong className="text-obsidian">{cat.name}:</strong> {(cat.skills || []).join(', ')}
                          </div>
                          <button onClick={() => removeItemFromSection('skills', cat.id)} className="text-red-500 hover:text-red-700 p-1">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}

          {/* STEP 3: CONFIRM & NAME VERSION */}
          {step === 3 && (
            <div className="space-y-4 py-4 text-xs">
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-lg flex items-start gap-3">
                <Check className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-bold">{isAr ? 'البيانات جاهزة للاستيراد!' : 'Data Ready for Import!'}</h4>
                  <p className="mt-1">{isAr ? 'سيتم إنشاء نسخة جديدة كاملة ومستقلة في قائمة النسخ المتعددة الخاصة بك.' : 'A new independent version will be created in your multi-version CV list.'}</p>
                </div>
              </div>

              <div>
                <label className="font-bold text-obsidian block mb-1">
                  {isAr ? 'اسم نسخة السيرة الذاتية الجديدة:' : 'Name for the new CV Version:'}
                </label>
                <input
                  type="text"
                  value={versionName}
                  onChange={(e) => setVersionName(e.target.value)}
                  placeholder={isAr ? 'مثال: سيرة ذاتية - مطور Frontend' : 'e.g. Frontend Developer CV'}
                  className="w-full text-xs bg-gray-50 border border-gray-300 rounded-lg p-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
          {step > 1 ? (
            <button
              onClick={() => setStep((step - 1) as any)}
              disabled={parsing || importing}
              className="text-xs font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-100 px-3 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>{isAr ? 'السابق' : 'Back'}</span>
            </button>
          ) : <div />}

          {step === 1 && (
            <button
              onClick={handleRunAIParse}
              disabled={parsing || !rawText.trim()}
              className="text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {parsing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              <span>{isAr ? 'تحليل وتفكيك بالذكاء الاصطناعي' : 'Parse with AI'}</span>
            </button>
          )}

          {step === 2 && (
            <button
              onClick={() => setStep(3)}
              className="text-xs font-semibold bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-lg flex items-center gap-1.5 transition-colors"
            >
              <span>{isAr ? 'متابعة إلى التسمية والحفظ' : 'Continue to Save'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          )}

          {step === 3 && (
            <button
              onClick={handleConfirm}
              disabled={importing}
              className="text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white px-5 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
            >
              {importing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Check className="w-4 h-4" />}
              <span>{isAr ? 'تأكيد وحفظ النسخة' : 'Confirm & Save Version'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
