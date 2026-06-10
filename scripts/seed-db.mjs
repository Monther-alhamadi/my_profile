// Run: node scripts/seed-db.mjs
// Set SUPABASE_URL and SUPABASE_SERVICE_KEY as env vars or edit below

import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.SUPABASE_URL || "https://muwblfmcmomhuhipzsal.supabase.co";
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || "";

if (!supabaseKey) {
  console.log("❌ Set SUPABASE_SERVICE_KEY env var");
  console.log('   $env:SUPABASE_SERVICE_KEY="your_key"  (PowerShell)');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const profile = {
  name: "Monther Alhamadi",
  title_en: "Software Engineer | Full-Stack & Intelligent Systems",
  title_ar: "مهندس برمجيات | تطوير شامل وأنظمة ذكية",
    bio_en:
    "With 4+ years of experience in full-stack development and AI integration, I specialize in building production-ready systems that combine technical excellence with business value. From retail management platforms to AI-powered tools, I focus on creating intelligent, scalable solutions that make a real impact.",
  bio_ar:
    "مع أكثر من 4 سنوات من الخبرة في التطوير الشامل ودمج الذكاء الاصطناعي، أتخصص في بناء أنظمة جاهزة للإنتاج تجمع بين التميز التقني والقيمة التجارية. من منصات إدارة التجزئة إلى أدوات مدعومة بالذكاء الاصطناعي، أركز على إنشاء حلول ذكية وقابلة للتوسع تحدث تأثيراً حقيقياً.",
  location: "Remote / Global",
  email: "montheralhamadi7@gmail.com",
  github_url: "https://github.com/Monther-alhamadi",
  linkedin_url:
    "https://www.linkedin.com/in/monther-alhamadi-51315a216?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B8KRfM%2Bj4QIi1DBA8XOgXfQ%3D%3D",
  facebook_url: "https://www.facebook.com/profile.php?id=100005415252086",
};

const projects_en = [
  {
    id: "cachear-pos",
    locale: "en",
    sort_order: 1,
    number: "01",
    title: "Cachear Enterprise Mobile POS",
    category: "Enterprise Mobile Application",
    problem:
      "Businesses required a highly sophisticated, offline-capable POS system that could handle complex multi-role employee environments, hardware integrations, and robust financial tracking without being tied to expensive desktop setups.",
    solution:
      "Engineered a massive offline-first enterprise POS ecosystem. Built an advanced sandboxed workspace system where employees authenticate via QR to isolated, role-specific environments. Designed an omnidirectional camera scanning engine, WhatsApp PDF integrations, and a sovereign local database for seamless offline operations with future cloud-sync readiness.",
    complexity: "Critical",
    technologies: [
      "Flutter",
      "Dart",
      "BLoC",
      "Clean Architecture",
      "Drift (SQLite)",
      "Hardware Integration",
    ],
    highlights: [
      "Multi-environment sandboxing for isolated, role-specific employee workspaces via QR login",
      "High-speed omnidirectional camera barcode scanning & external hardware scanner integration",
      "Versatile invoicing: Bluetooth thermal printing & automated PDF generation sent via WhatsApp",
      "Offline-First Sovereign Database with complex SQL triggers for automated ledger reconciliation",
      "Native device integrations including deep contact imports and background data synchronization",
      "Strict Domain-Driven Clean Architecture ensuring enterprise-grade scalability and maintainability",
    ],
  },
  {
    id: "heic-converter",
    locale: "en",
    sort_order: 2,
    number: "02",
    title: "HEIC Converter \u2192 Image Conversion SaaS (Product Evolution)",
    category: "Web Application / WebAssembly \u2192 SaaS Platform",
    problem:
      "Phase 1 (Free Tool): Users face upload failures on government portals (Absher, Najiz) due to HEIC incompatibility, while online tools compromise privacy by uploading sensitive documents. Phase 2 (SaaS Platform): Businesses need compliant image formats for international markets with varying technical requirements \u2014 HEIC and 20+ global format standards.",
    solution:
      "Phase 1: Engineered a highly optimized, 100% client-side HEIC-to-JPG conversion platform utilizing WebAssembly. Zero-upload, GDPR/CCPA compliant, PWA-ready, SEO-optimized for MENA government portal users. Phase 2: Created a global image conversion SaaS supporting HEIC and 20+ international format standards with batch processing, multi-country compliance engine (US, UK, UAE), SEO-driven content system (30+ articles), and CDN-optimized delivery.",
    complexity: "High",
    technologies: [
      "Next.js",
      "React",
      "WebAssembly",
      "Web Workers",
      "PWA",
      "SEO Strategy",
      "Python",
      "ImageMagick",
      "AWS Lambda",
      "Elasticsearch",
      "CDN",
    ],
    highlights: [
      "Phase 1: WebAssembly (heic2any) for local browser-based processing",
      "Phase 1: Privacy-first Zero-Upload ecosystem (GDPR/CCPA)",
      "Phase 1: SEO content silos for MENA government portals",
      "Phase 1: Monetization-AdSense funnel with tier-based limits",
      "Phase 1: Full PWA readiness with i18n support",
      "Phase 2: 20+ global compliance formats supported",
      "Phase 2: High-performance batch processing",
      "Phase 2: Multi-country compliance engine (US, UK, UAE)",
      "Phase 2: SEO-driven content system (30+ articles)",
      "Phase 2: CDN-optimized global delivery",
    ],
  },
  {
    id: "university-scheduler",
    locale: "en",
    sort_order: 3,
    number: "03",
    title: "University Scheduling Engine (AI)",
    category: "AI / Hybrid Algorithms",
    problem:
      "University administration spent weeks manually resolving complex scheduling conflicts for thousands of students across limited classrooms and faculty availability.",
    solution:
      "Developed a highly advanced hybrid scheduling engine that combines Genetic Algorithms with Google OR-Tools (Constraint Programming) to autonomously generate optimal, clash-free schedules. This hybrid approach perfectly balances hard capacity limits with soft professor time preferences.",
    complexity: "Advanced",
    technologies: [
      "TypeScript",
      "Genetic Algorithms",
      "Google OR-Tools",
      "PostgreSQL",
    ],
    highlights: [
      "Engineered a hybrid solver combining Genetic Algorithms and Google OR-Tools (CP-SAT)",
      "Reduced schedule generation time from 3 weeks to 4 minutes",
      "Handled hard constraints (clashes) and soft constraints (preferences)",
      "Optimized memory usage for processing 10,000+ variables concurrently",
    ],
  },
  {
    id: "nextvendors-ecommerce",
    locale: "en",
    sort_order: 4,
    number: "04",
    title: "NextVendors E-Commerce Platform",
    category: "SaaS Platform",
    problem:
      "Yemen lacked reliable centralized digital marketplaces. Additionally, strict API constraints and financial infrastructure limitations made standard payment gateways unviable for local businesses.",
    solution:
      "Architected and deployed a decoupled multi-vendor SaaS platform from scratch. Designed a custom, borderless payment module to handle manual/ledger transactions, eliminating geographical restrictions and enabling immediate local adoption.",
    complexity: "High",
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "Zustand",
      "PostgreSQL",
      "Docker",
      "Nginx",
    ],
    highlights: [
      "Decoupled system architecture (Python backend, React SPA)",
      "Custom modular payment engine bypassing local constraints",
      "Complex relational DB with automated migrations (Alembic)",
      "Advanced state management via Zustand & React Query",
      "Multi-language UI (i18next) with Tailwind CSS",
      "Containerized deployment pipeline with Docker & Nginx",
    ],
  },
  {
    id: "ai-tools-hub",
    locale: "en",
    sort_order: 6,
    number: "05",
    title: "AI Tools Orchestration Hub",
    category: "AI Integration Platform",
    problem:
      "Businesses struggled to integrate and manage multiple AI tools and APIs. Prompt engineering required technical expertise, and there was no unified interface for AI workflow automation.",
    solution:
      "Developed an AI orchestration platform that unifies multiple AI services (GPT, Claude, Midjourney, etc.) with intelligent prompt management, workflow automation, and result optimization. Features template library, A/B testing for prompts, and cost tracking across providers.",
    complexity: "Advanced",
    technologies: [
      "React",
      "Node.js",
      "OpenAI API",
      "Anthropic API",
      "MongoDB",
      "Bull Queue",
      "WebSocket",
    ],
    highlights: [
      "Multi-provider AI integration",
      "Intelligent prompt template system",
      "Automated workflow orchestration",
      "A/B testing for prompt optimization",
      "Cost tracking & analytics",
      "Real-time result streaming",
    ],
  },
  {
    id: "kayany",
    locale: "en",
    sort_order: 6,
    number: "06",
    title: "Kayany \u2014 Tax Compliance SaaS for GCC Freelancers",
    category: "SaaS / FinTech / Tax Compliance",
    problem:
      "Over 300% growth in GCC freelancers since 2020, yet most unaware of tax obligations. Penalties: 10,000 SAR (KSA), 20,000 AED (UAE), 20,000 OMR (Oman). No Arabic SaaS targets freelancers \u2014 existing solutions target SMEs.",
    solution:
      "Integrated platform: multi-country tax calculator (6 GCC countries), ZATCA-compliant e-invoicing with QR codes, multi-currency income/expense tracking, smart threshold reminders, PDF/Excel tax reports. Free tier + Basic 49 SAR/mo + Pro 99 SAR/mo.",
    complexity: "Advanced",
    technologies: [
      "TypeScript 5.x",
      "Next.js 15.x",
      "Tailwind CSS 4.x",
      "shadcn/ui",
      "Supabase",
      "Prisma 6.x",
      "next-intl 3.x",
      "Zod 3.x",
      "Stripe",
      "Recharts 2.x",
      "IBM Plex Arabic",
      "Open Exchange Rates API",
      "Sonner",
      "Sentry",
      "react-hook-form",
      "Radix UI",
      "Lucide React",
    ],
    highlights: [
      "6 GCC countries with official tax rules",
      "ZATCA Wave 24 QR codes",
      "Real-time tax calculator (4 states)",
      "Multi-currency with auto-conversion",
      "Full Arabic RTL + IBM Plex Arabic",
      "RLS for data isolation",
      "Free/Basic/Pro tiers",
      "Public invoice sharing via secure tokens",
      "Automated threshold reminders (80%/100%)",
      "5-step onboarding wizard",
      "PDF/Excel tax reports",
      "Server-side cron jobs",
    ],
  },
];

const projects_ar = [
  {
    id: "cachear-pos",
    locale: "ar",
    sort_order: 1,
    number: "01",
    title: "نظام Cachear المؤسسي لإدارة التجزئة",
    category: "نظام مؤسسي متكامل (Offline-First)",
    problem:
      "الحاجة إلى نظام POS ذكي ومحمول قادر على العمل دون إنترنت، مع إدارة معقدة لصلاحيات الموظفين، ودعم واسع للملحقات الخارجية، دون الارتباط بأجهزة كمبيوتر مكلفة.",
    solution:
      'هندسة نظام مؤسسي ضخم يعمل محلياً بالكامل. ابتكرت نظام "بيئات معزولة" (Sandboxed Workspaces) حيث يدخل الموظف عبر QR إلى واجهات مخصصة لصلاحياته. طورت محرك مسح باركود ذكي بجميع الاتجاهات، ونظام فواتير يصدر PDF عبر واتساب أو يطبع حرارياً، مع بنية تحتية جاهزة للمزامنة السحابية.',
    complexity: "Critical",
    technologies: [
      "Flutter",
      "Dart",
      "BLoC",
      "Clean Architecture",
      "Drift (SQLite)",
      "Hardware Integration",
    ],
    highlights: [
      "نظام بيئات معزولة متعددة للموظفين عبر مسح QR، مع واجهات وإشعارات مخصصة لكل دور وظيفي",
      "محرك مسح باركود فائق الذكاء عبر الكاميرا (بجميع الاتجاهات) مع دعم أجهزة المسح الطرفية",
      "تصدير كشوفات الحساب والفواتير كملفات PDF وإرسالها آلياً عبر واتساب، أو طباعتها حرارياً",
      "تكامل عميق مع النظام لسحب جهات الاتصال، وتتبع مالي دقيق للسجلات مع نظام مزامنة متطور",
      "قاعدة بيانات سيادية ومحفزات SQL معقدة (Triggers) لأتمتة المبيعات والمخزون دون إنترنت",
      "بنية معمارية صارمة (Clean Architecture) تضمن قابلية التوسع لربط النظام بلوحات تحكم مستقبلاً",
    ],
  },
  {
    id: "heic-converter",
    locale: "ar",
    sort_order: 2,
    number: "02",
    title: "محول HEIC \u2192 منصة تحويل صور SaaS (تطور المنتج)",
    category: "تطبيق ويب / WebAssembly \u2192 منصة SaaS",
    problem:
      "المرحلة 1 (أداة مجانية): يواجه المستخدمون رفض صيغة HEIC في البوابات الحكومية (أبشر، ناجز)، بينما تنتهك أدوات التحويل عبر الإنترنت الخصوصية برفع المستندات الحساسة. المرحلة 2 (منصة SaaS): تحتاج الشركات لتنسيقات صور متوافقة للأسواق الدولية بمتطلبات تقنية متنوعة \u2014 HEIC و 20+ معيار عالمي.",
    solution:
      "المرحلة 1: هندسة منصة محسنة 100% من جانب العميل لتحويل HEIC إلى JPG باستخدام WebAssembly. صفر رفع، امتثال GDPR/CCPA، جاهز لـ PWA، محسن SEO لمستخدمي البوابات الحكومية في MENA. المرحلة 2: إنشاء منصة SaaS عالمية لتحويل الصور تدعم HEIC و 20+ معيار دولي مع معالجة دفعات، محرك امتثال متعدد الدول (الولايات المتحدة، المملكة المتحدة، الإمارات)، نظام محتوى محسن SEO (30+ مقال)، وتوصيل محسن عبر CDN.",
    complexity: "High",
    technologies: [
      "Next.js",
      "React",
      "WebAssembly",
      "Web Workers",
      "PWA",
      "SEO Strategy",
      "Python",
      "ImageMagick",
      "AWS Lambda",
      "Elasticsearch",
      "CDN",
    ],
    highlights: [
      "المرحلة 1: WebAssembly (heic2any) لمعالجة المتصفح المحلي",
      "المرحلة 1: نظام صفر-رفع يركز على الخصوصية (GDPR/CCPA)",
      "المرحلة 1: صوامع محتوى SEO للبوابات الحكومية في MENA",
      "المرحلة 1: مسار تحقيق أرباح AdSense مع حدود متدرجة",
      "المرحلة 1: جاهزية PWA كاملة مع دعم i18n",
      "المرحلة 2: دعم 20+ تنسيق امتثال عالمي",
      "المرحلة 2: معالجة دفعات عالية الأداء",
      "المرحلة 2: محرك امتثال متعدد الدول (الولايات المتحدة، المملكة المتحدة، الإمارات)",
      "المرحلة 2: نظام محتوى محسن SEO (30+ مقال)",
      "المرحلة 2: توصيل عالمي محسن عبر CDN",
    ],
  },
  {
    id: "university-scheduler",
    locale: "ar",
    sort_order: 3,
    number: "03",
    title: "محرك الجدولة الجامعي (AI)",
    category: "الذكاء الاصطناعي / خوارزميات هجينة",
    problem:
      "كانت إدارة الجامعة تقضي أسابيع في حل تعارضات الجدولة المعقدة يدوياً لآلاف الطلاب عبر قاعات دراسية محدودة وتوافر أعضاء هيئة التدريس.",
    solution:
      'تم تطوير محرك جدولة هجين يدمج بين قوة "الخوارزميات الجينية" وتقنيات "برمجة القيود" (Google OR-Tools) لإنشاء جداول خالية من التعارضات. هذا الدمج سمح بحل المشاكل المعقدة جداً وموازنة القيود الصارمة والمرنة بدقة وسرعة فائقة.',
    complexity: "Advanced",
    technologies: [
      "TypeScript",
      "Genetic Algorithms",
      "Google OR-Tools",
      "PostgreSQL",
    ],
    highlights: [
      "هندسة محرك هجين يدمج بين الخوارزميات الجينية ودقة Google OR-Tools (CP-SAT)",
      "تقليل وقت إنشاء الجدول من 3 أسابيع إلى 4 دقائق",
      "التعامل مع القيود الصارمة (التعارضات) والقيود المرنة (التفضيلات)",
      "تحسين استخدام الذاكرة لمعالجة أكثر من 10,000 متغير رياضي في وقت واحد",
    ],
  },
  {
    id: "nextvendors-ecommerce",
    locale: "ar",
    sort_order: 4,
    number: "04",
    title: "منصة NextVendors للتجارة الإلكترونية",
    category: "منصة SaaS متكاملة",
    problem:
      "غياب المتاجر المركزية الموثوقة في السوق المحلي، بالإضافة إلى القيود المعقدة وشروط بوابات الدفع المحلية التي تعيق تبني حلول التجارة الإلكترونية التقليدية.",
    solution:
      "هندسة وبناء منصة SaaS متعددة البائعين من الصفر. تم تصميم نظام دفع مرن ومستقل يعتمد على المعالجة اليدوية وسجلات الأستاذ لتجاوز تعقيدات البنوك، مما كسر القيود الجغرافية وسمح باستقطاب البائعين بحرية.",
    complexity: "High",
    technologies: [
      "Python",
      "FastAPI",
      "React",
      "Zustand",
      "PostgreSQL",
      "Docker",
      "Nginx",
    ],
    highlights: [
      "هندسة معمارية مفصولة (Decoupled System) تعتمد على Python و React",
      "محرك سداد مخصص لتجاوز القيود التقنية والجغرافية لبوابات الدفع",
      "تصميم قواعد بيانات تدعم تعدد المتاجر مع إدارة ترحيلات (Alembic)",
      "إدارة متقدمة للحالة باستخدام Zustand و React Query",
      "واجهة مستخدم تفاعلية تدعم تعدد اللغات (i18n)",
      "بيئة إنتاج مستقرة ومعبأة بالكامل باستخدام Docker و Nginx",
    ],
  },
  {
    id: "ai-tools-hub",
    locale: "ar",
    sort_order: 6,
    number: "05",
    title: "مركز تنسيق أدوات الذكاء الاصطناعي",
    category: "منصة دمج الذكاء الاصطناعي",
    problem:
      "واجهت الشركات صعوبة في دمج وإدارة أدوات ونماذج الذكاء الاصطناعي المتاصطناعي المتعددة. تطلبت هندسة الأوامر (Prompt Engineering) خبرة تقنية، ولم تكن هناك واجهة موحدة لأتمتة سير عمل الذكاء الاصطناعي.",
    solution:
      "تطوير منصة تنسيق ذكاء اصطناعي توحد خدمات متعددة (GPT, Claude, Midjourney, إلخ) مع إدارة ذكية للأوامر، وأتمتة سير العمل، وتحسين النتائج. تتميز بمكتبة قوالب، واختبار A/B للأوامر، وتتبع التكلفة عبر المزودين.",
    complexity: "Advanced",
    technologies: [
      "React",
      "Node.js",
      "OpenAI API",
      "Anthropic API",
      "MongoDB",
      "Bull Queue",
      "WebSocket",
    ],
    highlights: [
      "دمج مزودي ذكاء اصطناعي متعددين",
      "نظام ذكي لقوالب الأوامر",
      "تنسيق آلي لسير العمل (Orchestration)",
      "اختبار A/B لتحسين الأوامر",
      "تتبع التكاليف والتحليلات",
      "بث النتائج في الوقت الفعلي",
    ],
  },
  {
    id: "kayany",
    locale: "ar",
    sort_order: 6,
    number: "06",
    title: "كياني \u2014 منصة الامتثال الضريبي لمستقلين الخليج",
    category: "SaaS / فين تك / امتثال ضريبي",
    problem:
      "أكثر من 300% نمو في فريلانسر الخليج منذ 2020، ومعظمهم لا يعلمون بالتزاماتهم الضريبية. غرامات: 10,000 ر.س (السعودية)، 20,000 درهم (الإمارات)، 20,000 ريال عُماني. لا يوجد حل SaaS عربي يستهدف الفريلانسر.",
    solution:
      "منصة متكاملة: حاسبة ضريبية لـ 6 دول خليجية، فواتير ZATCA مع QR، تتبع دخل/مصروفات متعدد العملات، تذكيرات ذكية، تقارير PDF/Excel. خطة مجانية + أساسية 49 ر.س/شهر + برو 99 ر.س/شهر.",
    complexity: "Advanced",
    technologies: [
      "TypeScript 5.x",
      "Next.js 15.x",
      "Tailwind CSS 4.x",
      "shadcn/ui",
      "Supabase",
      "Prisma 6.x",
      "next-intl 3.x",
      "Zod 3.x",
      "Stripe",
      "Recharts 2.x",
      "IBM Plex Arabic",
      "Open Exchange Rates API",
      "Sonner",
      "Sentry",
      "react-hook-form",
      "Radix UI",
      "Lucide React",
    ],
    highlights: [
      "6 دول خليجية بقواعد ضريبية رسمية",
      "فواتير ZATCA Wave 24 مع QR",
      "حاسبة ضريبية فورية (4 حالات)",
      "متعدد العملات مع تحويل تلقائي",
      "عربي RTL كامل + IBM Plex Arabic",
      "RLS لعزل البيانات",
      "خطط مجانية/أساسية/برو",
      "مشاركة فواتير عامة برموز آمنة",
      "تذكيرات حدود آلية (80%/100%)",
      "معالج تسجيل 5 خطوات",
      "تقارير ضريبية PDF/Excel",
      "مهام cron من جانب الخادم",
    ],
  },
];

const skills_en = [
  {
    locale: "en",
    sort_order: 1,
    category: "Engineering Systems",
    icon: "cpu",
    description:
      "Architecting scalable, high-performance systems with focus on reliability, security, and maintainability. Designing distributed architectures, API contracts, and cloud-native infrastructure.",
    technologies: [
      "System Design",
      "Microservices",
      "API Architecture",
      "Database Design",
      "Cloud Infrastructure",
      "DevOps",
      "CI/CD",
      "Observability",
    ],
  },
  {
    locale: "en",
    sort_order: 2,
    category: "Full-Stack Web Development",
    icon: "code",
    description:
      "Building modern, responsive web applications with cutting-edge frameworks and best practices. End-to-end development from database to UI with type-safe tooling.",
    technologies: [
      "React 18/19",
      "Next.js 15 (App Router)",
      "TypeScript 5.x",
      "Node.js",
      "Tailwind CSS 4.x",
      "shadcn/ui",
      "Radix UI",
      "React Hook Form",
      "Zod",
      "Prisma ORM",
      "PostgreSQL",
      "Supabase",
      "Stripe",
      "Next-Intl (i18n)",
    ],
  },
  {
    locale: "en",
    sort_order: 3,
    category: "AI & Data Processing",
    icon: "brain",
    description:
      "Implementing intelligent systems with machine learning, automation, and advanced data pipelines. Integrating LLMs, building custom ML models, and creating intelligent workflows.",
    technologies: [
      "Machine Learning",
      "LLM Integration (OpenAI, Anthropic)",
      "Prompt Engineering",
      "RAG Systems",
      "Vector Databases",
      "Data Cleaning",
      "Preprocessing",
      "Automation",
      "Python",
      "Genetic Algorithms",
      "Constraint Programming (OR-Tools)",
    ],
  },
  {
    locale: "en",
    sort_order: 4,
    category: "Mobile Development",
    icon: "smartphone",
    description:
      "Creating native-quality mobile experiences with cross-platform frameworks and native integrations. Offline-first architecture with background sync.",
    technologies: [
      "React Native",
      "Expo",
      "Mobile UI/UX",
      "Native Modules",
      "Push Notifications",
      "Offline-First",
      "SQLite (Drift/Expo SQLite)",
      "Background Tasks",
    ],
  },
  {
    locale: "en",
    sort_order: 5,
    category: "FinTech & SaaS Platforms",
    icon: "credit-card",
    description:
      "Building compliant financial platforms with multi-currency support, tax calculations, invoicing, and subscription billing. Regulatory-ready architecture for GCC markets.",
    technologies: [
      "Multi-Currency & Exchange Rates",
      "Tax Compliance (ZATCA, GCC)",
      "E-Invoicing (QR Codes)",
      "Stripe Billing",
      "Subscription Management",
      "Role-Based Access (RLS)",
      "Audit Logging",
      "PDF/Excel Report Generation",
    ],
  },
];

const skills_ar = [
  {
    locale: "ar",
    sort_order: 1,
    category: "أنظمة الهندسة",
    icon: "cpu",
    description:
      "تصميم أنظمة قابلة للتوسع وعالية الأداء مع التركيز على الموثوقية والأمان وسهولة الصيانة. تصميم بنى موزعة، عقود APIs، وبنية تحتية سحابية أصلية.",
    technologies: [
      "System Design",
      "Microservices",
      "API Architecture",
      "Database Design",
      "Cloud Infrastructure",
      "DevOps",
      "CI/CD",
      "Observability",
    ],
  },
  {
    locale: "ar",
    sort_order: 2,
    category: "تطوير الويب الشامل (Full-Stack)",
    icon: "code",
    description:
      "بناء تطبيقات ويب حديثة ومتجاوبة بأحدث الأطر والممارسات. تطوير شامل من قاعدة البيانات إلى الواجهة مع أدوات آمنة من حيث الأنواع (Type-Safe).",
    technologies: [
      "React 18/19",
      "Next.js 15 (App Router)",
      "TypeScript 5.x",
      "Node.js",
      "Tailwind CSS 4.x",
      "shadcn/ui",
      "Radix UI",
      "React Hook Form",
      "Zod",
      "Prisma ORM",
      "PostgreSQL",
      "Supabase",
      "Stripe",
      "Next-Intl (i18n)",
    ],
  },
  {
    locale: "ar",
    sort_order: 3,
    category: "الذكاء الاصطناعي ومعالجة البيانات",
    icon: "brain",
    description:
      "تنفيذ أنظمة ذكية مع تعلم الآلة، والأتمتة، ومسارات البيانات المتقدمة. دمج LLMs، بناء نماذج ML مخصصة، وإنشاء سير عمل ذكية.",
    technologies: [
      "Machine Learning",
      "LLM Integration (OpenAI, Anthropic)",
      "Prompt Engineering",
      "RAG Systems",
      "Vector Databases",
      "Data Cleaning",
      "Preprocessing",
      "Automation",
      "Python",
      "Genetic Algorithms",
      "Constraint Programming (OR-Tools)",
    ],
  },
  {
    locale: "ar",
    sort_order: 4,
    category: "تطوير الموبايل",
    icon: "smartphone",
    description:
      "إنشاء تجارب موبايل بجودة النيتف (Native) مع أطر عمل متعددة المنصات وتكاملات أصيلة. معمارية Offline-First مع مزامنة خلفية.",
    technologies: [
      "React Native",
      "Expo",
      "Mobile UI/UX",
      "Native Modules",
      "Push Notifications",
      "Offline-First",
      "SQLite (Drift/Expo SQLite)",
      "Background Tasks",
    ],
  },
  {
    locale: "ar",
    sort_order: 5,
    category: "منصات فين تك و SaaS",
    icon: "credit-card",
    description:
      "بناء منصات مالية ملتزمة مع دعم متعدد العملات، حسابات ضريبية، فواتير إلكترونية، واشتراكات. معمارية جاهزة للامتثال التنظيمي في أسواق الخليج.",
    technologies: [
      "Multi-Currency & Exchange Rates",
      "Tax Compliance (ZATCA, GCC)",
      "E-Invoicing (QR Codes)",
      "Stripe Billing",
      "Subscription Management",
      "Role-Based Access (RLS)",
      "Audit Logging",
      "PDF/Excel Report Generation",
    ],
  },
];

const services_en = [
  {
    id: "fullstack-dev",
    locale: "en",
    sort_order: 1,
    icon: "layers",
    title: "Full-Stack Development",
    description:
      "End-to-end web and mobile application development with modern frameworks, scalable architecture, and production-ready code.",
    pricing: "from $5,000",
    features: [
      "Custom web & mobile applications",
      "API design & development",
      "Database architecture",
      "Cloud deployment & DevOps",
      "Performance optimization",
      "Ongoing maintenance & support",
    ],
  },
  {
    id: "ai-integration",
    locale: "en",
    sort_order: 2,
    icon: "sparkles",
    title: "AI Integration & Automation",
    description:
      "Integrate cutting-edge AI capabilities into your products. From GPT-powered features to custom ML models and intelligent automation.",
    pricing: "from $3,000",
    features: [
      "AI API integration (OpenAI, Claude, etc.)",
      "Custom ML model development",
      "Intelligent automation workflows",
      "Data preprocessing & cleaning",
      "Prompt engineering & optimization",
      "AI-powered analytics",
    ],
  },
  {
    id: "system-architecture",
    locale: "en",
    sort_order: 3,
    icon: "network",
    title: "System Architecture & Consulting",
    description:
      "Strategic technical consulting for complex systems. Architecture design, performance optimization, and scalability planning.",
    pricing: "from $2,000",
    features: [
      "System architecture design",
      "Technical feasibility analysis",
      "Performance optimization",
      "Scalability planning",
      "Security audit & hardening",
      "Technology stack recommendations",
    ],
  },
];

const services_ar = [
  {
    id: "fullstack-dev",
    locale: "ar",
    sort_order: 1,
    icon: "layers",
    title: "تطوير متكامل (Full-Stack)",
    description:
      "تطوير تطبيقات الويب والموبايل من البداية إلى النهاية مع أطر عمل حديثة ومعمارية قابلة للتوسع.",
    pricing: "تبدأ من $5,000",
    features: [
      "تطبيقات ويب وموبايل مخصصة",
      "تصميم وتطوير الـ APIs",
      "هندسة قواعد البيانات",
      "النشر السحابي والـ DevOps",
      "تحسين الأداء",
      "الصيانة والدعم المستمر",
    ],
  },
  {
    id: "ai-integration",
    locale: "ar",
    sort_order: 2,
    icon: "sparkles",
    title: "دمج الذكاء الاصطناعي والأتمتة",
    description:
      "دمج قدرات الذكاء الاصطناعي المتطورة في منتجاتك. من ميزات GPT إلى نماذج تعلم الآلة المخصصة والأتمتة الذكية.",
    pricing: "تبدأ من $3,000",
    features: [
      "دمج واجهات الذكاء الاصطناعي (OpenAI, Claude, إلخ)",
      "تطوير نماذج تعلم آلة مخصصة",
      "مسارات عمل للأتمتة الذكية",
      "معالجة وتنظيف البيانات",
      "هندسة وتحسين الأوامر (Prompts)",
      "تحليلات مدعومة بالذكاء الاصطناعي",
    ],
  },
  {
    id: "system-architecture",
    locale: "ar",
    sort_order: 3,
    icon: "network",
    title: "هندسة الأنظمة والاستشارات",
    description:
      "استشارات تقنية استراتيجية للأنظمة المعقدة. تصميم المعمارية، وتحسين الأداء، وتخطيط القابلية للتوسع.",
    pricing: "تبدأ من $2,000",
    features: [
      "تصميم معمارية الأنظمة",
      "تحليل الجدوى التقنية",
      "تحسين الأداء التقني",
      "تخطيط التوسع المستقبلي",
      "تدقيق الأمان وتقوية الأنظمة",
      "توصيات بمجموعة التقنيات المناسبة",
    ],
  },
];

const experience_en = [
  {
    id: "exp-1",
    locale: "en",
    sort_order: 1,
    year: "2022 - Present",
    title: "Senior Full-Stack Engineer",
    company: "Freelance / Contract",
    description:
      "Leading development of complex web and mobile applications for international clients. Specializing in AI integration, system architecture, and high-performance solutions.",
    achievements: [
      "Delivered 20+ production systems across retail, education, and SaaS domains",
      "Architected multi-vendor e-commerce platform serving 1000+ daily users",
      "Implemented AI-powered tools reducing manual work by 70%",
      "Optimized database queries achieving 10x performance improvement",
    ],
  },
  {
    id: "exp-2",
    locale: "en",
    sort_order: 2,
    year: "2020 - 2022",
    title: "Full-Stack Developer",
    company: "Tech Startup",
    description:
      "Built core product features and infrastructure for fast-growing SaaS platform. Focused on scalability, user experience, and rapid iteration.",
    achievements: [
      "Developed real-time collaboration features using WebSocket",
      "Reduced API response time by 60% through caching strategies",
      "Implemented CI/CD pipeline reducing deployment time by 80%",
      "Mentored junior developers on best practices",
    ],
  },
];

const experience_ar = [
  {
    id: "exp-1",
    locale: "ar",
    sort_order: 1,
    year: "2022 - الآن",
    title: "مهندس برمجيات أول (Full-Stack)",
    company: "عمل حر / تعاقد",
    description:
      "قيادة تطوير تطبيقات ويب وموبايل معقدة لعملاء دوليين. متخصص في دمج الذكاء الاصطناعي ومعمارية الأنظمة والحلول عالية الأداء.",
    achievements: [
      "تسليم أكثر من 20 نظاماً إنتاجياً في مجالات التجزئة والتعليم و الـ SaaS",
      "هندسة منصة تجارة إلكترونية متعددة التجار تخدم 1000+ مستخدم يومياً",
      "تنفيذ أدوات مدعومة بالذكاء الاصطناعي قللت العمل اليدوي بنسبة 70%",
      "تحسين استعلامات قواعد البيانات وتحقيق تحسن في الأداء بمقدار 10 أضعاف",
    ],
  },
  {
    id: "exp-2",
    locale: "ar",
    sort_order: 2,
    year: "2020 - 2022",
    title: "مطور Full-Stack",
    company: "شركة تقنية ناشئة",
    description:
      "بناء ميزات المنتج الأساسية والبنية التحتية لمنصة SaaS سريعة النمو. التركيز على القابلية للتوسع وتجربة المستخدم والتحسين السريع.",
    achievements: [
      "تطوير ميزات تعاون فوري باستخدام WebSocket",
      "تقليل وقت استجابة الـ API بنسبة 60% عبر استراتيجيات التخزين المؤقت",
      "تنفيذ خط مسار CI/CD قلل وقت النشر بنسبة 80%",
      "توجيه المطورين المبتدئين حول أفضل الممارسات",
    ],
  },
];

const stats_en = [
  {
    id: "stat-1",
    locale: "en",
    sort_order: 1,
    value: "4",
    label: "Years Experience",
    suffix: "+",
  },
  {
    id: "stat-2",
    locale: "en",
    sort_order: 2,
    value: "20",
    label: "Projects Delivered",
    suffix: "+",
  },
  {
    id: "stat-3",
    locale: "en",
    sort_order: 3,
    value: "5",
    label: "AI Systems Built",
    suffix: null,
  },
  {
    id: "stat-4",
    locale: "en",
    sort_order: 4,
    value: "15",
    label: "Technologies Mastered",
    suffix: "+",
  },
];

const stats_ar = [
  {
    id: "stat-1",
    locale: "ar",
    sort_order: 1,
    value: "4",
    label: "سنوات خبرة",
    suffix: "+",
  },
  {
    id: "stat-2",
    locale: "ar",
    sort_order: 2,
    value: "20",
    label: "مشروع تم تسليمه",
    suffix: "+",
  },
  {
    id: "stat-3",
    locale: "ar",
    sort_order: 3,
    value: "5",
    label: "أنظمة ذكاء اصطناعي",
    suffix: null,
  },
  {
    id: "stat-4",
    locale: "ar",
    sort_order: 4,
    value: "15",
    label: "تقنيات متقنة",
    suffix: "+",
  },
];

const testimonials_en = [
  {
    id: "test-1",
    locale: "en",
    sort_order: 1,
    name: "Sarah Johnson",
    role: "CEO",
    company: "RetailTech Solutions",
    content:
      "The retail management system transformed our operations. The QR onboarding and POS integration saved us countless hours. Exceptional technical expertise and attention to detail.",
    rating: 5,
  },
  {
    id: "test-2",
    locale: "en",
    sort_order: 2,
    name: "Dr. Michael Chen",
    role: "Academic Director",
    company: "University of Technology",
    content:
      "The scheduling system solved a problem we struggled with for years. The genetic algorithm approach was brilliant, and the drag-and-drop interface made it incredibly user-friendly.",
    rating: 5,
  },
  {
    id: "test-3",
    locale: "en",
    sort_order: 3,
    name: "Ahmed Al-Rashid",
    role: "Founder",
    company: "Digital Commerce Hub",
    content:
      "Outstanding work on our e-commerce platform. The multi-vendor system and dropshipping integration exceeded expectations. Professional, responsive, and delivered on time.",
    rating: 5,
  },
];

const testimonials_ar = [
  {
    id: "test-1",
    locale: "ar",
    sort_order: 1,
    name: "سارة جونسون",
    role: "المدير التنفيذي",
    company: "RetailTech Solutions",
    content:
      "نظام إدارة التجزئة غير عملياتنا تماماً. تسجيل الموظفين عبر QR وتكامل POS وفر لنا ساعات لا تحصى. خبرة تقنية استثنائية واهتمام بالتفاصيل.",
    rating: 5,
  },
  {
    id: "test-2",
    locale: "ar",
    sort_order: 2,
    name: "د. مايكل تشن",
    role: "المدير الأكاديمي",
    company: "جامعة التكنولوجيا",
    content:
      "نظام الجدولة حل مشكلة عانينا منها لسنوات. نهج الخوارزمية الجينية كان عبقرياً، وواجهة السحب والإفلات جعلته سهل الاستخدام للغاية.",
    rating: 5,
  },
  {
    id: "test-3",
    locale: "ar",
    sort_order: 3,
    name: "أحمد الراشد",
    role: "المؤسس",
    company: "Digital Commerce Hub",
    content:
      "عمل رائع في منصة التجارة الإلكترونية الخاصة بنا. نظام التجار المتعددين وتكامل الدروب شيبنج تجاوز التوقعات. احترافية واستجابة وتسليم في الموعد.",
    rating: 5,
  },
];

async function seed() {
  console.log("🚀 Seeding portfolio database...\n");

  const { error: pErr } = await supabase
    .from("profile")
    .upsert(profile, { onConflict: "id" });
  if (pErr) {
    console.error("❌ Profile:", pErr.message);
    return;
  }
  console.log("✅ Profile seeded");

  const { error: prErr } = await supabase
    .from("projects")
    .upsert([...projects_en, ...projects_ar], { onConflict: "id, locale" });
  if (prErr) {
    console.error("❌ Projects:", prErr.message);
    return;
  }
  console.log("✅ Projects seeded");

  const { error: skErr } = await supabase
    .from("skills")
    .upsert([...skills_en, ...skills_ar], { onConflict: "id" });
  if (skErr) {
    console.error("❌ Skills:", skErr.message);
    return;
  }
  console.log("✅ Skills seeded");

  const { error: svErr } = await supabase
    .from("services")
    .upsert([...services_en, ...services_ar], { onConflict: "id, locale" });
  if (svErr) {
    console.error("❌ Services:", svErr.message);
    return;
  }
  console.log("✅ Services seeded");

  const { error: exErr } = await supabase
    .from("experience")
    .upsert([...experience_en, ...experience_ar], { onConflict: "id, locale" });
  if (exErr) {
    console.error("❌ Experience:", exErr.message);
    return;
  }
  console.log("✅ Experience seeded");

  const { error: stErr } = await supabase
    .from("stats")
    .upsert([...stats_en, ...stats_ar], { onConflict: "id, locale" });
  if (stErr) {
    console.error("❌ Stats:", stErr.message);
    return;
  }
  console.log("✅ Stats seeded");

  const { error: teErr } = await supabase
    .from("testimonials")
    .upsert([...testimonials_en, ...testimonials_ar], {
      onConflict: "id, locale",
    });
  if (teErr) {
    console.error("❌ Testimonials:", teErr.message);
    return;
  }
  console.log("✅ Testimonials seeded");

  console.log("\n🎉 All data seeded successfully!");
}

seed();
