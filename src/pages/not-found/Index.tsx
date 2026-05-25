import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useLanguage } from "@/hooks/useLanguage";

const NotFound = () => {
  const location = useLocation();
  const { language } = useLanguage();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="section-obsidian min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.015]">
        <div className="w-full h-full" style={{
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)',
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="text-center relative z-10 px-6">
        <div className="font-mono text-[10rem] font-bold text-emerald-brand opacity-[0.08] leading-none select-none mb-[-3rem]">
          404
        </div>
        <h1 className="text-4xl font-bold text-ivory mb-4">
          {language === 'ar' ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-ivory/45 text-sm mb-10 font-mono max-w-md mx-auto">
          {language === 'ar'
            ? 'عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها.'
            : 'Sorry, the page you are looking for does not exist or has been moved.'}
        </p>
        <Link
          to="/"
          className="btn-emerald inline-flex items-center gap-2 text-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          {language === 'ar' ? 'العودة إلى الرئيسية' : 'Back to Home'}
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
