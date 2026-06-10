-- ============================================================
-- Seed Portfolio Data
-- Paste and run this in Supabase SQL Editor
-- ============================================================

-- 1. PROFILE
INSERT INTO profile (name, title_en, title_ar, bio_en, bio_ar, location, email, github_url, linkedin_url, facebook_url)
VALUES (
  'Monther Alhamadi',
  'Software Engineer | Full-Stack & Intelligent Systems',
  'مهندس برمجيات | تطوير شامل وأنظمة ذكية',
  'With 4+ years of experience in full-stack development and AI integration, I specialize in building production-ready systems that combine technical excellence with business value. From retail management platforms to AI-powered tools, I focus on creating intelligent, scalable solutions that make a real impact.',
  'مع أكثر من 4 سنوات من الخبرة في التطوير الشامل ودمج الذكاء الاصطناعي، أتخصص في بناء أنظمة جاهزة للإنتاج تجمع بين التميز التقني والقيمة التجارية. من منصات إدارة التجزئة إلى أدوات مدعومة بالذكاء الاصطناعي، أركز على إنشاء حلول ذكية وقابلة للتوسع تحدث تأثيراً حقيقياً.',
  'Remote / Global',
  'montheralhamadi7@gmail.com',
  'https://github.com/Monther-alhamadi',
  'https://www.linkedin.com/in/monther-alhamadi-51315a216?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B8KRfM%2Bj4QIi1DBA8XOgXfQ%3D%3D',
  'https://www.facebook.com/profile.php?id=100005415252086'
);

-- 2. PROJECTS (EN)
INSERT INTO projects (id, locale, sort_order, number, title, category, problem, solution, complexity, technologies, highlights) VALUES
('cachear-pos', 'en', 1, '01', 'Cachear Enterprise Mobile POS', 'Enterprise Mobile Application',
'Businesses required a highly sophisticated, offline-capable POS system that could handle complex multi-role employee environments, hardware integrations, and robust financial tracking without being tied to expensive desktop setups.',
'Engineered a massive offline-first enterprise POS ecosystem. Built an advanced sandboxed workspace system where employees authenticate via QR to isolated, role-specific environments. Designed an omnidirectional camera scanning engine, WhatsApp PDF integrations, and a sovereign local database for seamless offline operations with future cloud-sync readiness.',
'Critical',
'["Flutter","Dart","BLoC","Clean Architecture","Drift (SQLite)","Hardware Integration"]',
'["Multi-environment sandboxing for isolated, role-specific employee workspaces via QR login","High-speed omnidirectional camera barcode scanning & external hardware scanner integration","Versatile invoicing: Bluetooth thermal printing & automated PDF generation sent via WhatsApp","Offline-First Sovereign Database with complex SQL triggers for automated ledger reconciliation","Native device integrations including deep contact imports and background data synchronization","Strict Domain-Driven Clean Architecture ensuring enterprise-grade scalability and maintainability"]'),

('heic-converter', 'en', 2, '02', 'HEIC Converter → Image Conversion SaaS (Product Evolution)', 'Web Application / WebAssembly → SaaS Platform',
'Phase 1 (Free Tool): Users face upload failures on government portals (Absher, Najiz) due to HEIC incompatibility, while online tools compromise privacy by uploading sensitive documents. Phase 2 (SaaS Platform): Businesses need compliant image formats for international markets with varying technical requirements — HEIC and 20+ global format standards.',
'Phase 1: Engineered a highly optimized, 100% client-side HEIC-to-JPG conversion platform utilizing WebAssembly. Zero-upload, GDPR/CCPA compliant, PWA-ready, SEO-optimized for MENA government portal users. Phase 2: Created a global image conversion SaaS supporting HEIC and 20+ international format standards with batch processing, multi-country compliance engine (US, UK, UAE), SEO-driven content system (30+ articles), and CDN-optimized delivery.',
'High',
'["Next.js","React","WebAssembly","Web Workers","PWA","SEO Strategy","Python","ImageMagick","AWS Lambda","Elasticsearch","CDN"]',
'["Phase 1: WebAssembly (heic2any) for local browser-based processing","Phase 1: Privacy-first Zero-Upload ecosystem (GDPR/CCPA)","Phase 1: SEO content silos for MENA government portals","Phase 1: Monetization-AdSense funnel with tier-based limits","Phase 1: Full PWA readiness with i18n support","Phase 2: 20+ global compliance formats supported","Phase 2: High-performance batch processing","Phase 2: Multi-country compliance engine (US, UK, UAE)","Phase 2: SEO-driven content system (30+ articles)","Phase 2: CDN-optimized global delivery"]'),

('university-scheduler', 'en', 3, '03', 'University Scheduling Engine (AI)', 'AI / Hybrid Algorithms',
'University administration spent weeks manually resolving complex scheduling conflicts for thousands of students across limited classrooms and faculty availability.',
'Developed a highly advanced hybrid scheduling engine that combines Genetic Algorithms with Google OR-Tools (Constraint Programming) to autonomously generate optimal, clash-free schedules. This hybrid approach perfectly balances hard capacity limits with soft professor time preferences.',
'Advanced',
'["TypeScript","Genetic Algorithms","Google OR-Tools","PostgreSQL"]',
'["Engineered a hybrid solver combining Genetic Algorithms and Google OR-Tools (CP-SAT)","Reduced schedule generation time from 3 weeks to 4 minutes","Handled hard constraints (clashes) and soft constraints (preferences)","Optimized memory usage for processing 10,000+ variables concurrently"]'),

('nextvendors-ecommerce', 'en', 4, '04', 'NextVendors E-Commerce Platform', 'SaaS Platform',
'Yemen lacked reliable centralized digital marketplaces. Additionally, strict API constraints and financial infrastructure limitations made standard payment gateways unviable for local businesses.',
'Architected and deployed a decoupled multi-vendor SaaS platform from scratch. Designed a custom, borderless payment module to handle manual/ledger transactions, eliminating geographical restrictions and enabling immediate local adoption.',
'High',
'["Python","FastAPI","React","Zustand","PostgreSQL","Docker","Nginx"]',
'["Decoupled system architecture (Python backend, React SPA)","Custom modular payment engine bypassing local constraints","Complex relational DB with automated migrations (Alembic)","Advanced state management via Zustand & React Query","Multi-language UI (i18next) with Tailwind CSS","Containerized deployment pipeline with Docker & Nginx"]'),

('ai-tools-hub', 'en', 6, '05', 'AI Tools Orchestration Hub', 'AI Integration Platform',
'Businesses struggled to integrate and manage multiple AI tools and APIs. Prompt engineering required technical expertise, and there was no unified interface for AI workflow automation.',
'Developed an AI orchestration platform that unifies multiple AI services (GPT, Claude, Midjourney, etc.) with intelligent prompt management, workflow automation, and result optimization. Features template library, A/B testing for prompts, and cost tracking across providers.',
'Advanced',
'["React","Node.js","OpenAI API","Anthropic API","MongoDB","Bull Queue","WebSocket"]',
'["Multi-provider AI integration","Intelligent prompt template system","Automated workflow orchestration","A/B testing for prompt optimization","Cost tracking & analytics","Real-time result streaming"]'),

('kayany', 'en', 6, '06', 'Kayany — Tax Compliance SaaS for GCC Freelancers', 'SaaS / FinTech / Tax Compliance',
'Over 300% growth in GCC freelancers since 2020, yet most unaware of tax obligations. Penalties: 10,000 SAR (KSA), 20,000 AED (UAE), 20,000 OMR (Oman). No Arabic SaaS targets freelancers — existing solutions target SMEs.',
'Integrated platform: multi-country tax calculator (6 GCC), ZATCA-compliant e-invoicing with QR codes, multi-currency income/expense tracking, smart threshold reminders, PDF/Excel tax reports. Free tier + Basic 49 SAR/mo + Pro 99 SAR/mo.',
'Advanced',
'["TypeScript 5.x","Next.js 15.x","Tailwind CSS 4.x","shadcn/ui","Supabase","Prisma 6.x","next-intl 3.x","Zod 3.x","Stripe","Recharts 2.x","IBM Plex Arabic","Open Exchange Rates API","Sonner","Sentry","react-hook-form","Radix UI","Lucide React"]',
'["6 GCC countries with official tax rules","ZATCA Wave 24 QR codes","Real-time tax calculator (4 states)","Multi-currency with auto-conversion","Full Arabic RTL + IBM Plex Arabic","RLS for data isolation","Free/Basic/Pro tiers","Public invoice sharing via secure tokens","Automated threshold reminders (80%/100%)","5-step onboarding wizard","PDF/Excel tax reports","Server-side cron jobs"]');

-- 3. PROJECTS (AR)
INSERT INTO projects (id, locale, sort_order, number, title, category, problem, solution, complexity, technologies, highlights) VALUES
('cachear-pos', 'ar', 1, '01', 'نظام Cachear المؤسسي لإدارة التجزئة', 'نظام مؤسسي متكامل (Offline-First)',
'الحاجة إلى نظام POS ذكي ومحمول قادر على العمل دون إنترنت، مع إدارة معقدة لصلاحيات الموظفين، ودعم واسع للملحقات الخارجية، دون الارتباط بأجهزة كمبيوتر مكلفة.',
'هندسة نظام مؤسسي ضخم يعمل محلياً بالكامل. ابتكرت نظام "بيئات معزولة" (Sandboxed Workspaces) حيث يدخل الموظف عبر QR إلى واجهات مخصصة لصلاحياته. طورت محرك مسح باركود ذكي بجميع الاتجاهات، ونظام فواتير يصدر PDF عبر واتساب أو يطبع حرارياً، مع بنية تحتية جاهزة للمزامنة السحابية.',
'Critical',
'["Flutter","Dart","BLoC","Clean Architecture","Drift (SQLite)","Hardware Integration"]',
'["نظام بيئات معزولة متعددة للموظفين عبر مسح QR، مع واجهات وإشعارات مخصصة لكل دور وظيفي","محرك مسح باركود فائق الذكاء عبر الكاميرا (بجميع الاتجاهات) مع دعم أجهزة المسح الطرفية","تصدير كشوفات الحساب والفواتير كملفات PDF وإرسالها آلياً عبر واتساب، أو طباعتها حرارياً","تكامل عميق مع النظام لسحب جهات الاتصال، وتتبع مالي دقيق للسجلات مع نظام مزامنة متطور","قاعدة بيانات سيادية ومحفزات SQL معقدة (Triggers) لأتمتة المبيعات والمخزون دون إنترنت","بنية معمارية صارمة (Clean Architecture) تضمن قابلية التوسع لربط النظام بلوحات تحكم مستقبلاً"]'),

('heic-converter', 'ar', 2, '02', 'محول HEIC → منصة تحويل صور SaaS (تطور المنتج)', 'تطبيق ويب / WebAssembly → منصة SaaS',
'المرحلة 1 (أداة مجانية): يواجه المستخدمون رفض صيغة HEIC في البوابات الحكومية (أبشر، ناجز)، بينما تنتهك أدوات التحويل عبر الإنترنت الخصوصية برفع المستندات الحساسة. المرحلة 2 (منصة SaaS): تحتاج الشركات لتنسيقات صور متوافقة للأسواق الدولية بمتطلبات تقنية متنوعة — HEIC و 20+ معيار عالمي.',
'المرحلة 1: هندسة منصة محسنة 100% من جانب العميل لتحويل HEIC إلى JPG باستخدام WebAssembly. صفر رفع، امتثال GDPR/CCPA، جاهز لـ PWA، محسن SEO لمستخدمي البوابات الحكومية في MENA. المرحلة 2: إنشاء منصة SaaS عالمية لتحويل الصور تدعم HEIC و 20+ معيار دولي مع معالجة دفعات، محرك امتثال متعدد الدول (الولايات المتحدة، المملكة المتحدة، الإمارات)، نظام محتوى محسن SEO (30+ مقال)، وتوصيل محسن عبر CDN.',
'High',
'["Next.js","React","WebAssembly","Web Workers","PWA","SEO Strategy","Python","ImageMagick","AWS Lambda","Elasticsearch","CDN"]',
'["المرحلة 1: WebAssembly (heic2any) لمعالجة المتصفح المحلي","المرحلة 1: نظام صفر-رفع يركز على الخصوصية (GDPR/CCPA)","المرحلة 1: صوامع محتوى SEO للبوابات الحكومية في MENA","المرحلة 1: مسار تحقيق أرباح AdSense مع حدود متدرجة","المرحلة 1: جاهزية PWA كاملة مع دعم i18n","المرحلة 2: دعم 20+ تنسيق امتثال عالمي","المرحلة 2: معالجة دفعات عالية الأداء","المرحلة 2: محرك امتثال متعدد الدول (الولايات المتحدة، المملكة المتحدة، الإمارات)","المرحلة 2: نظام محتوى محسن SEO (30+ مقال)","المرحلة 2: توصيل عالمي محسن عبر CDN"]'),

('university-scheduler', 'ar', 3, '03', 'محرك الجدولة الجامعي (AI)', 'الذكاء الاصطناعي / خوارزميات هجينة',
'كانت إدارة الجامعة تقضي أسابيع في حل تعارضات الجدولة المعقدة يدوياً لآلاف الطلاب عبر قاعات دراسية محدودة وتوافر أعضاء هيئة التدريس.',
'تم تطوير محرك جدولة هجين يدمج بين قوة "الخوارزميات الجينية" وتقنيات "برمجة القيود" (Google OR-Tools) لإنشاء جداول خالية من التعارضات. هذا الدمج سمح بحل المشاكل المعقدة جداً وموازنة القيود الصارمة والمرنة بدقة وسرعة فائقة.',
'Advanced',
'["TypeScript","Genetic Algorithms","Google OR-Tools","PostgreSQL"]',
'["هندسة محرك هجين يدمج بين الخوارزميات الجينية ودقة Google OR-Tools (CP-SAT)","تقليل وقت إنشاء الجدول من 3 أسابيع إلى 4 دقائق","التعامل مع القيود الصارمة (التعارضات) والقيود المرنة (التفضيلات)","تحسين استخدام الذاكرة لمعالجة أكثر من 10,000 متغير رياضي في وقت واحد"]'),

('nextvendors-ecommerce', 'ar', 4, '04', 'منصة NextVendors للتجارة الإلكترونية', 'منصة SaaS متكاملة',
'غياب المتاجر المركزية الموثوقة في السوق المحلي، بالإضافة إلى القيود المعقدة وشروط بوابات الدفع المحلية التي تعيق تبني حلول التجارة الإلكترونية التقليدية.',
'هندسة وبناء منصة SaaS متعددة البائعين من الصفر. تم تصميم نظام دفع مرن ومستقل يعتمد على المعالجة اليدوية وسجلات الأستاذ لتجاوز تعقيدات البنوك، مما كسر القيود الجغرافية وسمح باستقطاب البائعين بحرية.',
'High',
'["Python","FastAPI","React","Zustand","PostgreSQL","Docker","Nginx"]',
'["هندسة معمارية مفصولة (Decoupled System) تعتمد على Python و React","محرك سداد مخصص لتجاوز القيود التقنية والجغرافية لبوابات الدفع","تصميم قواعد بيانات تدعم تعدد المتاجر مع إدارة ترحيلات (Alembic)","إدارة متقدمة للحالة باستخدام Zustand و React Query","واجهة مستخدم تفاعلية تدعم تعدد اللغات (i18n)","بيئة إنتاج مستقرة ومعبأة بالكامل باستخدام Docker و Nginx"]'),

('ai-tools-hub', 'ar', 6, '05', 'مركز تنسيق أدوات الذكاء الاصطناعي', 'منصة دمج الذكاء الاصطناعي',
'واجهت الشركات صعوبة في دمج وإدارة أدوات ونماذج الذكاء الاصطناعي المتاصطناعي المتعددة. تطلبت هندسة الأوامر (Prompt Engineering) خبرة تقنية، ولم تكن هناك واجهة موحدة لأتمتة سير عمل الذكاء الاصطناعي.',
'تطوير منصة تنسيق ذكاء اصطناعي توحد خدمات متعددة (GPT, Claude, Midjourney, إلخ) مع إدارة ذكية للأوامر، وأتمتة سير العمل، وتحسين النتائج. تتميز بمكتبة قوالب، واختبار A/B للأمر، وتتبع التكلفة عبر المزودين.',
'Advanced',
'["React","Node.js","OpenAI API","Anthropic API","MongoDB","Bull Queue","WebSocket"]',
'["دمج مزودي ذكاء اصطناعي متعددين","نظام ذكي لقوالب الأوامر","تنسيق آلي لسير العمل (Orchestration)","اختبار A/B لتحسين الأوامر","تتبع التكاليف والتحليلات","بث النتائج في الوقت الفعلي"]'),

('kayany', 'ar', 6, '06', 'كياني — منصة الامتثال الضريبي لمستقلين الخليج', 'SaaS / فين تك / امتثال ضريبي',
'أكثر من 300% نمو في فريلانسر الخليج منذ 2020، ومعظمهم لا يعلمون بالتزاماتهم الضريبية. غرامات: 10,000 ر.س (السعودية)، 20,000 درهم (الإمارات)، 20,000 ريال عُماني. لا يوجد حل SaaS عربي يستهدف الفريلانسر.',
'منصة متكاملة: حاسبة ضريبية لـ 6 دول خليجية، فواتير ZATCA مع QR، تتبع دخل/مصروفات متعدد العملات، تذكيرات ذكية، تقارير PDF/Excel. خطة مجانية + أساسية 49 ر.س/شهر + برو 99 ر.س/شهر.',
'Advanced',
'["TypeScript 5.x","Next.js 15.x","Tailwind CSS 4.x","shadcn/ui","Supabase","Prisma 6.x","next-intl 3.x","Zod 3.x","Stripe","Recharts 2.x","IBM Plex Arabic","Open Exchange Rates API","Sonner","Sentry","react-hook-form","Radix UI","Lucide React"]',
'["6 دول خليجية بقواعد ضريبية رسمية","فواتير ZATCA Wave 24 مع QR","حاسبة ضريبية فورية (4 حالات)","متعدد العملات مع تحويل تلقائي","عربي RTL كامل + IBM Plex Arabic","RLS لعزل البيانات","خطط مجانية/أساسية/برو","مشاركة فواتير عامة برموز آمنة","تذكيرات حدود آلية (80%/100%)","معالج تسجيل 5 خطوات","تقارير ضريبية PDF/Excel","مهام cron من جانب الخادم"]');

-- 4. SKILLS (EN)
INSERT INTO skills (locale, sort_order, category, icon, description, technologies) VALUES
('en', 1, 'Engineering Systems', 'cpu', 'Architecting scalable, high-performance systems with focus on reliability, security, and maintainability. Designing distributed architectures, API contracts, and cloud-native infrastructure.', '["System Design","Microservices","API Architecture","Database Design","Cloud Infrastructure","DevOps","CI/CD","Observability"]'),
('en', 2, 'Full-Stack Web Development', 'code', 'Building modern, responsive web applications with cutting-edge frameworks and best practices. End-to-end development from database to UI with type-safe tooling.', '["React 18/19","Next.js 15 (App Router)","TypeScript 5.x","Node.js","Tailwind CSS 4.x","shadcn/ui","Radix UI","React Hook Form","Zod","Prisma ORM","PostgreSQL","Supabase","Stripe","Next-Intl (i18n)"]'),
('en', 3, 'AI & Data Processing', 'brain', 'Implementing intelligent systems with machine learning, automation, and advanced data pipelines. Integrating LLMs, building custom ML models, and creating intelligent workflows.', '["Machine Learning","LLM Integration (OpenAI, Anthropic)","Prompt Engineering","RAG Systems","Vector Databases","Data Cleaning","Preprocessing","Automation","Python","Genetic Algorithms","Constraint Programming (OR-Tools)"]'),
('en', 4, 'Mobile Development', 'smartphone', 'Creating native-quality mobile experiences with cross-platform frameworks and native integrations. Offline-first architecture with background sync.', '["React Native","Expo","Mobile UI/UX","Native Modules","Push Notifications","Offline-First","SQLite (Drift/Expo SQLite)","Background Tasks"]'),
('en', 5, 'FinTech & SaaS Platforms', 'credit-card', 'Building compliant financial platforms with multi-currency support, tax calculations, invoicing, and subscription billing. Regulatory-ready architecture for GCC markets.', '["Multi-Currency & Exchange Rates","Tax Compliance (ZATCA, GCC)","E-Invoicing (QR Codes)","Stripe Billing","Subscription Management","Role-Based Access (RLS)","Audit Logging","PDF/Excel Report Generation"]');

-- 5. SKILLS (AR)
INSERT INTO skills (locale, sort_order, category, icon, description, technologies) VALUES
('ar', 1, 'أنظمة الهندسة', 'cpu', 'تصميم أنظمة قابلة للتوسع وعالية الأداء مع التركيز على الموثوقية والأمان وسهولة الصيانة. تصميم بنى موزعة، عقود APIs، وبنية تحتية سحابية أصلية.', '["System Design","Microservices","API Architecture","Database Design","Cloud Infrastructure","DevOps","CI/CD","Observability"]'),
('ar', 2, 'تطوير الويب الشامل (Full-Stack)', 'code', 'بناء تطبيقات ويب حديثة ومتجاوبة بأحدث الأطر والممارسات. تطوير شامل من قاعدة البيانات إلى الواجهة مع أدوات آمنة من حيث الأنواع (Type-Safe).', '["React 18/19","Next.js 15 (App Router)","TypeScript 5.x","Node.js","Tailwind CSS 4.x","shadcn/ui","Radix UI","React Hook Form","Zod","Prisma ORM","PostgreSQL","Supabase","Stripe","Next-Intl (i18n)"]'),
('ar', 3, 'الذكاء الاصطناعي ومعالجة البيانات', 'brain', 'تنفيذ أنظمة ذكية مع تعلم الآلة، والأتمتة، ومسارات البيانات المتقدمة. دمج LLMs، بناء نماذج ML مخصصة، وإنشاء سير عمل ذكية.', '["Machine Learning","LLM Integration (OpenAI, Anthropic)","Prompt Engineering","RAG Systems","Vector Databases","Data Cleaning","Preprocessing","Automation","Python","Genetic Algorithms","Constraint Programming (OR-Tools)"]'),
('ar', 4, 'تطوير الموبايل', 'smartphone', 'إنشاء تجارب موبايل بجودة النيتف (Native) مع أطر عمل متعددة المنصات وتكاملات أصيلة. معمارية Offline-First مع مزامنة خلفية.', '["React Native","Expo","Mobile UI/UX","Native Modules","Push Notifications","Offline-First","SQLite (Drift/Expo SQLite)","Background Tasks"]'),
('ar', 5, 'منصات فين تك و SaaS', 'credit-card', 'بناء منصات مالية ملتزمة مع دعم متعدد العملات، حسابات ضريبية، فواتير إلكترونية، واشتراكات. معمارية جاهزة للامتثال التنظيمي في أسواق الخليج.', '["Multi-Currency & Exchange Rates","Tax Compliance (ZATCA, GCC)","E-Invoicing (QR Codes)","Stripe Billing","Subscription Management","Role-Based Access (RLS)","Audit Logging","PDF/Excel Report Generation"]');

-- 6. SERVICES (EN)
INSERT INTO services (id, locale, sort_order, icon, title, description, pricing, features) VALUES
('fullstack-dev', 'en', 1, 'layers', 'Full-Stack Development', 'End-to-end web and mobile application development with modern frameworks, scalable architecture, and production-ready code.', 'from $5,000', '["Custom web & mobile applications","API design & development","Database architecture","Cloud deployment & DevOps","Performance optimization","Ongoing maintenance & support"]'),
('ai-integration', 'en', 2, 'sparkles', 'AI Integration & Automation', 'Integrate cutting-edge AI capabilities into your products. From GPT-powered features to custom ML models and intelligent automation.', 'from $3,000', '["AI API integration (OpenAI, Claude, etc.)","Custom ML model development","Intelligent automation workflows","Data preprocessing & cleaning","Prompt engineering & optimization","AI-powered analytics"]'),
('system-architecture', 'en', 3, 'network', 'System Architecture & Consulting', 'Strategic technical consulting for complex systems. Architecture design, performance optimization, and scalability planning.', 'from $2,000', '["System architecture design","Technical feasibility analysis","Performance optimization","Scalability planning","Security audit & hardening","Technology stack recommendations"]');

-- 7. SERVICES (AR)
INSERT INTO services (id, locale, sort_order, icon, title, description, pricing, features) VALUES
('fullstack-dev', 'ar', 1, 'layers', 'تطوير متكامل (Full-Stack)', 'تطوير تطبيقات الويب والموبايل من البداية إلى النهاية مع أطر عمل حديثة ومعمارية قابلة للتوسع.', 'تبدأ من $5,000', '["تطبيقات ويب وموبايل مخصصة","تصميم وتطوير الـ APIs","هندسة قواعد البيانات","النشر السحابي والـ DevOps","تحسين الأداء","الصيانة والدعم المستمر"]'),
('ai-integration', 'ar', 2, 'sparkles', 'دمج الذكاء الاصطناعي والأتمتة', 'دمج قدرات الذكاء الاصطناعي المتطورة في منتجاتك. من ميزات GPT إلى نماذج تعلم الآلة المخصصة والأتمتة الذكية.', 'تبدأ من $3,000', '["دمج واجهات الذكاء الاصطناعي (OpenAI, Claude, إلخ)","تطوير نماذج تعلم آلة مخصصة","مسارات عمل للأتمتة الذكية","معالجة وتنظيف البيانات","هندسة وتحسين الأوامر (Prompts)","تحليلات مدعومة بالذكاء الاصطناعي"]'),
('system-architecture', 'ar', 3, 'network', 'هندسة الأنظمة والاستشارات', 'استشارات تقنية استراتيجية للأنظمة المعقدة. تصميم المعمارية، وتحسين الأداء، وتخطيط القابلية للتوسع.', 'تبدأ من $2,000', '["تصميم معمارية الأنظمة","تحليل الجدوى التقنية","تحسين الأداء التقني","تخطيط التوسع المستقبلي","تدقيق الأمان وتقوية الأنظمة","توصيات بمجموعة التقنيات المناسبة"]');

-- 8. EXPERIENCE (EN)
INSERT INTO experience (id, locale, sort_order, year, title, company, description, achievements) VALUES
('exp-1', 'en', 1, '2022 - Present', 'Senior Full-Stack Engineer', 'Freelance / Contract', 'Leading development of complex web and mobile applications for international clients. Specializing in AI integration, system architecture, and high-performance solutions.', '["Delivered 20+ production systems across retail, education, and SaaS domains","Architected multi-vendor e-commerce platform serving 1000+ daily users","Implemented AI-powered tools reducing manual work by 70%","Optimized database queries achieving 10x performance improvement"]'),
('exp-2', 'en', 2, '2020 - 2022', 'Full-Stack Developer', 'Tech Startup', 'Built core product features and infrastructure for fast-growing SaaS platform. Focused on scalability, user experience, and rapid iteration.', '["Developed real-time collaboration features using WebSocket","Reduced API response time by 60% through caching strategies","Implemented CI/CD pipeline reducing deployment time by 80%","Mentored junior developers on best practices"]');

-- 9. EXPERIENCE (AR)
INSERT INTO experience (id, locale, sort_order, year, title, company, description, achievements) VALUES
('exp-1', 'ar', 1, '2022 - الآن', 'مهندس برمجيات أول (Full-Stack)', 'عمل حر / تعاقد', 'قيادة تطوير تطبيقات ويب وموبايل معقدة لعملاء دوليين. متخصص في دمج الذكاء الاصطناعي ومعمارية الأنظمة والحلول عالية الأداء.', '["تسليم أكثر من 20 نظاماً إنتاجياً في مجالات التجزئة والتعليم و الـ SaaS","هندسة منصة تجارة إلكترونية متعددة التجار تخدم 1000+ مستخدم يومياً","تنفيذ أدوات مدعومة بالذكاء الاصطناعي قللت العمل اليدوي بنسبة 70%","تحسين استعلامات قواعد البيانات وتحقيق تحسن في الأداء بمقدار 10 أضعاف"]'),
('exp-2', 'ar', 2, '2020 - 2022', 'مطور Full-Stack', 'شركة تقنية ناشئة', 'بناء ميزات المنتج الأساسية والبنية التحتية لمنصة SaaS سريعة النمو. التركيز على القابلية للتوسع وتجربة المستخدم والتحسين السريع.', '["تطوير ميزات تعاون فوري باستخدام WebSocket","تقليل وقت استجابة الـ API بنسبة 60% عبر استراتيجيات التخزين المؤقت","تنفيذ خط مسار CI/CD قلل وقت النشر بنسبة 80%","توجيه المطورين المبتدئين حول أفضل الممارسات"]');

-- 10. STATS (EN)
INSERT INTO stats (id, locale, sort_order, value, label, suffix) VALUES
('stat-1', 'en', 1, '4', 'Years Experience', '+'),
('stat-2', 'en', 2, '20', 'Projects Delivered', '+'),
('stat-3', 'en', 3, '5', 'AI Systems Built', NULL),
('stat-4', 'en', 4, '15', 'Technologies Mastered', '+');

-- 11. STATS (AR)
INSERT INTO stats (id, locale, sort_order, value, label, suffix) VALUES
('stat-1', 'ar', 1, '4', 'سنوات خبرة', '+'),
('stat-2', 'ar', 2, '20', 'مشروع تم تسليمه', '+'),
('stat-3', 'ar', 3, '5', 'أنظمة ذكاء اصطناعي', NULL),
('stat-4', 'ar', 4, '15', 'تقنيات متقنة', '+');

-- 12. TESTIMONIALS (EN)
INSERT INTO testimonials (id, locale, sort_order, name, role, company, content, rating) VALUES
('test-1', 'en', 1, 'Sarah Johnson', 'CEO', 'RetailTech Solutions', 'The retail management system transformed our operations. The QR onboarding and POS integration saved us countless hours. Exceptional technical expertise and attention to detail.', 5),
('test-2', 'en', 2, 'Dr. Michael Chen', 'Academic Director', 'University of Technology', 'The scheduling system solved a problem we struggled with for years. The genetic algorithm approach was brilliant, and the drag-and-drop interface made it incredibly user-friendly.', 5),
('test-3', 'en', 3, 'Ahmed Al-Rashid', 'Founder', 'Digital Commerce Hub', 'Outstanding work on our e-commerce platform. The multi-vendor system and dropshipping integration exceeded expectations. Professional, responsive, and delivered on time.', 5);

-- 13. TESTIMONIALS (AR)
INSERT INTO testimonials (id, locale, sort_order, name, role, company, content, rating) VALUES
('test-1', 'ar', 1, 'سارة جونسون', 'المدير التنفيذي', 'RetailTech Solutions', 'نظام إدارة التجزئة غير عملياتنا تماماً. تسجيل الموظفين عبر QR وتكامل POS وفر لنا ساعات لا تحصى. خبرة تقنية استثنائية واهتمام بالتفاصيل.', 5),
('test-2', 'ar', 2, 'د. مايكل تشن', 'المدير الأكاديمي', 'جامعة التكنولوجيا', 'نظام الجدولة حل مشكلة عانينا منها لسنوات. نهج الخوارزمية الجينية كان عبقرياً، وواجهة السحب والإفلات جعلته سهل الاستخدام للغاية.', 5),
('test-3', 'ar', 3, 'أحمد الراشد', 'المؤسس', 'Digital Commerce Hub', 'عمل رائع في منصة التجارة الإلكترونية الخاصة بنا. نظام التجار المتعددين وتكامل الدروب شيبنج تجاوز التوقعات. احترافية واستجابة وتسليم في الموعد.', 5);
