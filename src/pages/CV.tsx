import { useEffect, useState, useRef } from 'react';
import {
  Eye,
  Download,
  FileCode,
  MapPin,
  Mail,
  Calendar,
  Loader2,
  Sparkles,
  Printer,
  X,
} from 'lucide-react';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import { useLanguage } from '@/hooks/useLanguage';
import { RevealWrapper } from '@/components/Sections';
import { CONTACT_INFO } from '@/lib/data-static';
import { fetchPublicPrimaryCV } from '@/services/cv-version-store';
import { downloadCVAsHTML, downloadCVAsPDF, generatePrintHTML } from '@/services/cv-exporter';
import type { CVData } from '@/lib';

export default function CV() {
  const { language } = useLanguage();
  const isAr = language === 'ar';

  const [primaryCv, setPrimaryCv] = useState<CVData | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const cvContainerRef = useRef<HTMLDivElement>(null);
  const modalCvRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadPublicCV() {
      setLoading(true);
      try {
        const cvData = await fetchPublicPrimaryCV(isAr ? 'ar' : 'en');
        setPrimaryCv(cvData);
      } catch (err) {
        console.warn('Failed to load primary CV for public view:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPublicCV();
  }, [isAr]);

  const handleDownloadHTML = () => {
    if (primaryCv) {
      downloadCVAsHTML(primaryCv, isAr);
    }
  };

  const handleDownloadPDF = async () => {
    const targetRef = modalCvRef.current || cvContainerRef.current;
    if (targetRef) {
      await downloadCVAsPDF(targetRef, isAr);
    } else {
      window.print();
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Helper to get header section data from primary CV
  const headerData = primaryCv?.sections.find((s) => s.type === 'header')?.data;
  const displayName = headerData?.name || 'Monther Alhamadi';
  const displayTitle = isAr
    ? headerData?.title_ar || headerData?.title_en || 'مهندس برمجيات | تطوير شامل وأنظمة ذكية'
    : headerData?.title_en || 'Software Engineer | Full-Stack & Intelligent Systems';
  const displayEmail = headerData?.email || CONTACT_INFO.email;
  const displayLocation = headerData?.location || CONTACT_INFO.location;

  return (
    <div className="min-h-screen bg-obsidian text-ivory">
      {/* Action Header */}
      <section className="section-obsidian py-10 md:py-14 border-b border-ivory/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12">
          <RevealWrapper>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div>
                <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                  <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-ivory">
                    {displayName}
                  </h1>
                  {primaryCv && (
                    <span className="text-[10px] bg-emerald-brand/20 text-emerald-brand border border-emerald-brand/40 font-mono px-2.5 py-0.5 rounded-full flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      {isAr ? 'السيرة الأساسية المعتمدة' : 'Primary CV'}
                    </span>
                  )}
                </div>
                <p className="text-emerald-brand font-mono text-sm mb-4">
                  {displayTitle}
                </p>
                <div className="flex flex-wrap gap-3 md:gap-4 text-xs text-ivory/50 font-mono">
                  <span className="flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-emerald-brand" /> {displayEmail}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-emerald-brand" /> {displayLocation}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-emerald-brand" />
                    {isAr ? '3+ سنوات خبرة' : '3+ Years Experience'}
                  </span>
                </div>
              </div>

              {/* Action Buttons Toolbar */}
              <div className="flex flex-wrap items-center gap-2">
                <a
                  href={headerData?.github || CONTACT_INFO.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-[10px] border border-ivory/15 rounded-md hover:border-emerald-brand hover:text-emerald-brand transition-colors text-ivory/60"
                  title="GitHub"
                >
                  <SiGithub className="w-4 h-4" />
                </a>
                <a
                  href={headerData?.linkedin || CONTACT_INFO.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-[10px] border border-ivory/15 rounded-md hover:border-emerald-brand hover:text-emerald-brand transition-colors text-ivory/60"
                  title="LinkedIn"
                >
                  <SiLinkedin className="w-4 h-4" />
                </a>

                {/* View CV Button (زر رؤية السيرة الذاتية) */}
                <button
                  onClick={() => setShowPreviewModal(true)}
                  className="px-3.5 py-2.5 border border-emerald-brand/50 bg-emerald-brand/10 hover:bg-emerald-brand/20 text-emerald-brand font-semibold text-xs rounded-md inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                  <span>{isAr ? 'رؤية السيرة الذاتية' : 'View CV'}</span>
                </button>

                {/* Download HTML Button (تحميل HTML) */}
                <button
                  onClick={handleDownloadHTML}
                  className="px-3.5 py-2.5 border border-purple-500/40 bg-purple-500/10 hover:bg-purple-500/20 text-purple-300 font-semibold text-xs rounded-md inline-flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <FileCode className="w-4 h-4 text-purple-400" />
                  <span>{isAr ? 'تحميل HTML' : 'Download HTML'}</span>
                </button>

                {/* Download PDF Button (تحميل PDF) */}
                <button
                  onClick={handleDownloadPDF}
                  className="btn-emerald text-xs py-2.5 px-4 inline-flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>{isAr ? 'تحميل PDF' : 'Download PDF'}</span>
                </button>
              </div>
            </div>
          </RevealWrapper>
        </div>
      </section>

      {/* Main CV Content Display */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-12 py-10 md:py-14">
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 text-emerald-brand animate-spin mb-3" />
            <p className="text-xs font-mono text-ivory/50">
              {isAr ? 'جاري تحميل السيرة الذاتية الافتراضية المعتمدة...' : 'Loading primary CV document...'}
            </p>
          </div>
        ) : primaryCv ? (
          <RevealWrapper>
            <div className="relative group">
              {/* Card Outer Container */}
              <div
                className="bg-white text-gray-900 rounded-xl p-6 sm:p-10 shadow-2xl border border-ivory/20 transition-all duration-300"
                id="cv-rendered-container"
                ref={cvContainerRef}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: generatePrintHTML(
                      primaryCv.sections,
                      primaryCv.settings?.theme_color || '#10b981',
                      primaryCv.settings?.font_family || 'inter',
                      isAr
                    ),
                  }}
                />
              </div>
            </div>
          </RevealWrapper>
        ) : null}
      </div>

      {/* View CV Interactive Preview Modal (زر رؤية السيرة الذاتية) */}
      {showPreviewModal && primaryCv && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-obsidian/80 backdrop-blur-md overflow-y-auto">
          <div className="bg-slate-900 border border-ivory/20 rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden my-auto">
            {/* Modal Top Toolbar */}
            <div className="bg-slate-950 border-b border-ivory/15 px-4 py-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-emerald-brand" />
                <h3 className="text-sm font-bold text-ivory font-mono">
                  {isAr ? 'معاينة السيرة الذاتية التفاعلية' : 'Interactive CV Preview'}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrint}
                  className="p-1.5 text-ivory/70 hover:text-ivory bg-slate-800 hover:bg-slate-700 rounded transition-colors text-xs flex items-center gap-1"
                  title={isAr ? 'طباعة' : 'Print'}
                >
                  <Printer className="w-3.5 h-3.5 text-emerald-brand" />
                  <span className="hidden sm:inline">{isAr ? 'طباعة' : 'Print'}</span>
                </button>
                <button
                  onClick={handleDownloadHTML}
                  className="p-1.5 text-purple-300 hover:text-purple-200 bg-purple-950/60 hover:bg-purple-900/60 border border-purple-500/30 rounded transition-colors text-xs flex items-center gap-1"
                >
                  <FileCode className="w-3.5 h-3.5 text-purple-400" />
                  <span className="hidden sm:inline">HTML</span>
                </button>
                <button
                  onClick={handleDownloadPDF}
                  className="p-1.5 text-emerald-brand hover:text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-brand/30 rounded transition-colors text-xs flex items-center gap-1"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">PDF</span>
                </button>
                <button
                  onClick={() => setShowPreviewModal(false)}
                  className="p-1.5 text-ivory/50 hover:text-ivory hover:bg-slate-800 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Container */}
            <div className="p-4 sm:p-8 overflow-y-auto bg-slate-900 flex-1 flex justify-center">
              <div
                className="bg-white text-gray-900 rounded-lg p-6 sm:p-10 shadow-2xl w-full max-w-3xl"
                ref={modalCvRef}
              >
                <div
                  dangerouslySetInnerHTML={{
                    __html: generatePrintHTML(
                      primaryCv.sections,
                      primaryCv.settings?.theme_color || '#10b981',
                      primaryCv.settings?.font_family || 'inter',
                      isAr
                    ),
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
