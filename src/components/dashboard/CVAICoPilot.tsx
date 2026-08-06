import React, { useState } from 'react';
import { Bot, Send, Sparkles, X, Loader2, Check, RefreshCw, Wand2, ShieldCheck, ListChecks } from 'lucide-react';
import { askCVAssistant, CVAIAssistantResponse } from '@/services/gemini-cv-assistant';
import type { CVDeltaPatch } from '@/services/cv-delta-merge';
import type { CVData, Language } from '@/lib/index';
import { toast } from 'sonner';

interface CVAICoPilotProps {
  cv: CVData;
  isOpen: boolean;
  onClose: () => void;
  language: Language;
  onApplyAction: (actionType: CVAIAssistantResponse['actionType'], payload: any) => void;
  onApplyPatches?: (patches: CVDeltaPatch[], label: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  actionType?: CVAIAssistantResponse['actionType'];
  payload?: any;
  patches?: CVDeltaPatch[];
  applied?: boolean;
}

export function CVAICoPilot({ cv, isOpen, onClose, language, onApplyAction, onApplyPatches }: CVAICoPilotProps) {
  const isAr = language === 'ar';
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: '1',
      sender: 'ai',
      text: isAr
        ? 'مرحباً! أنا مساعدك الذكي لبناء السيرة الذاتية. أعمل بنظام الدمج الذكي بدون مسح بياناتك السابقة. اطلب مني ما تشاء!'
        : 'Hello! I am your AI CV Co-Pilot powered by Incremental Delta Merge. Ask me to add skills, roles, or update details without losing your previous data!',
    },
  ]);

  if (!isOpen) return null;

  const quickPrompts = isAr
    ? [
        'أضف خبرة مطور Flutter من 2023 حتى الآن',
        'تحسين وإعادة صياغة الملخص المهني',
        'غير القالب إلى Sidebar واللون إلى Navy',
        'أضف قسم مهارات جديد للذكاء الاصطناعي',
      ]
    : [
        'Add Senior Full-Stack Engineer experience',
        'Enhance & polish professional summary',
        'Change template to Sidebar with Navy theme',
        'Add AI & Cloud skill category',
      ];

  const handleSend = async (textToSend?: string) => {
    const promptText = textToSend || input;
    if (!promptText.trim() || loading) return;

    const userMsgId = crypto.randomUUID();
    const userMsg: Message = { id: userMsgId, sender: 'user', text: promptText };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const res = await askCVAssistant(promptText, cv, language);
      const aiMsg: Message = {
        id: crypto.randomUUID(),
        sender: 'ai',
        text: res.message,
        actionType: res.actionType,
        payload: res.payload,
        patches: res.patches,
        applied: false,
      };

      setMessages((prev) => [...prev, aiMsg]);

      // Apply Delta Patches if available
      if (res.patches && res.patches.length > 0 && onApplyPatches) {
        onApplyPatches(res.patches, `AI: ${promptText.slice(0, 30)}`);
        aiMsg.applied = true;
        toast.success(isAr ? 'تم دمج التعديلات الذكية بنجاح دون مسح بياناتك!' : 'Incremental delta merge applied safely!');
      } else if (res.actionType && res.actionType !== 'NONE' && res.payload) {
        onApplyAction(res.actionType, res.payload);
        aiMsg.applied = true;
        toast.success(isAr ? 'تم تطبيق التعديل بنجاح!' : 'CV updated successfully!');
      }
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          sender: 'ai',
          text: isAr ? 'حدث خطأ أثناء معالجة الطلب.' : 'An error occurred while processing your request.',
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white shadow-2xl border-l border-border flex flex-col transition-all duration-300 animate-in slide-in-from-right" dir={isAr ? 'rtl' : 'ltr'}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-obsidian to-slate-900 text-white">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-md bg-emerald-brand/20 text-emerald-brand">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-xs font-bold">{isAr ? 'المساعد الذكي (Smart Delta Merge)' : 'AI CV Co-Pilot (Delta Merge)'}</h3>
            <p className="text-[9px] text-emerald-400 font-mono flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" />
              {isAr ? 'حماية من مسح البيانات' : 'Safe Incremental Editing'}
            </p>
          </div>
        </div>
        <button onClick={onClose} className="p-1 rounded text-gray-300 hover:text-white hover:bg-white/10">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Quick Prompts */}
      <div className="p-2.5 bg-gray-50 border-b border-border/60">
        <p className="text-[10px] font-mono text-muted-foreground mb-1.5 flex items-center gap-1">
          <Wand2 className="w-3 h-3 text-emerald-brand" />
          {isAr ? 'أوامر سريعة:' : 'Quick Prompts:'}
        </p>
        <div className="flex flex-wrap gap-1">
          {quickPrompts.map((qp, idx) => (
            <button
              key={idx}
              disabled={loading}
              onClick={() => handleSend(qp)}
              className="text-[9.5px] bg-white border border-gray-200 hover:border-emerald-brand hover:text-emerald-brand text-gray-700 px-2 py-1 rounded transition-colors"
            >
              {qp}
            </button>
          ))}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.sender === 'ai' && (
              <div className="w-6 h-6 rounded-full bg-emerald-brand/10 text-emerald-brand flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}
            <div
              className={`max-w-[85%] rounded-lg p-3 text-xs leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-emerald-brand text-white'
                  : 'bg-gray-100 text-obsidian border border-gray-200'
              }`}
            >
              <p>{msg.text}</p>

              {/* Patches preview badge */}
              {msg.patches && msg.patches.length > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-200/80 text-[10px]">
                  <span className="font-bold text-purple-700 flex items-center gap-1 mb-1">
                    <ListChecks className="w-3 h-3" />
                    {isAr ? `التغييرات المدمجة (${msg.patches.length}):` : `Applied Patches (${msg.patches.length}):`}
                  </span>
                  <div className="space-y-0.5 font-mono text-[9.5px] text-gray-600">
                    {msg.patches.map((p, idx) => (
                      <div key={idx} className="bg-white px-1.5 py-0.5 rounded border border-gray-200">
                        <span className="font-bold uppercase text-emerald-600">{p.op}</span> {p.target}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {msg.actionType && msg.actionType !== 'NONE' && (
                <div className="mt-2 pt-2 border-t border-gray-200/60 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-emerald-600 font-semibold flex items-center gap-1">
                    <Check className="w-3 h-3" />
                    {isAr ? `تم الدمج الآمن (${msg.actionType})` : `Executed Safe Merge (${msg.actionType})`}
                  </span>
                  {!msg.applied && (
                    <button
                      onClick={() => {
                        if (msg.patches && onApplyPatches) {
                          onApplyPatches(msg.patches, 'Re-apply AI patches');
                        } else if (msg.actionType && msg.payload) {
                          onApplyAction(msg.actionType, msg.payload);
                        }
                        msg.applied = true;
                        toast.success(isAr ? 'تم التكرار!' : 'Re-applied!');
                      }}
                      className="text-emerald-brand hover:underline font-semibold"
                    >
                      {isAr ? 'إعادة التطبيق' : 'Re-apply'}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex items-center gap-2 text-xs text-muted-foreground py-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-brand" />
            <span>{isAr ? 'جاري الفحص وإعداد الدمج الذكي...' : 'Analyzing & calculating delta patches...'}</span>
          </div>
        )}
      </div>

      {/* Input Form */}
      <div className="p-3 border-t border-border bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isAr ? 'اكتب التعديل المطلوبة بالسيرة...' : 'Ask AI to update CV...'}
            disabled={loading}
            className="flex-1 text-xs bg-gray-50 border border-gray-200 rounded-md px-3 py-2 focus:outline-none focus:ring-1 focus:ring-emerald-brand"
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="p-2 bg-emerald-brand text-white rounded-md disabled:opacity-50 hover:bg-emerald-600 transition-colors"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
