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

('heic-converter', 'en', 2, '02', 'Privacy-First Image Conversion Engine', 'Web Application / WebAssembly',
'Users frequently face upload failures on critical government portals (e.g., Absher, Najiz) due to HEIC image format incompatibilities, while existing online tools compromise privacy by uploading sensitive documents to external servers.',
'Engineered a highly optimized, 100% client-side HEIC-to-JPG conversion platform utilizing WebAssembly. The system processes heavy image payloads directly within the browser, ensuring absolute privacy, zero data retention, and instant conversion speeds without server wait times.',
'High',
'["Next.js","React","WebAssembly","Web Workers","PWA","SEO Strategy"]',
'["Implemented WebAssembly (heic2any) for robust, local browser-based image processing","Architected a privacy-first (Zero-Upload) ecosystem, ensuring GDPR/CCPA compliance","Developed advanced SEO content silos and localized targeting for MENA government portal users","Engineered a scalable Monetization-AdSense funnel with smart tier-based processing limits","Full PWA readiness for native-like offline capabilities and localized i18n support"]'),

('university-scheduler', 'en', 3, '03', 'University Scheduling Engine (AI)', 'AI / Hybrid Algorithms',
'University administration spent weeks manually resolving complex scheduling conflicts for thousands of students across limited classrooms and faculty availability.',
'Developed a highly advanced hybrid scheduling engine that combines Genetic Algorithms with Google OR-Tools (Constraint Programming) to autonomously generate optimal, clash-free schedules. This hybrid approach perfectly balances hard capacity limits with soft professor time preferences.',
'Advanced',
'["TypeScript","Genetic Algorithms","Google OR-Tools","PostgreSQL"]',
'["Engineered a hybrid solver combining Genetic Algorithms and Google OR-Tools (CP-SAT)","Reduced schedule generation time from 3 weeks to 4 minutes","Handled hard constraints (clashes) and soft constraints (preferences)","Optimized memory usage for processing 10,000+ variables concurrently"]'),

('ai-image-platform', 'en', 4, '03', 'AI-Powered Image Conversion Platform', 'SaaS Platform',
'Users worldwide struggled with HEIC image format compatibility across different devices and platforms. Businesses needed compliant image formats for various international markets with different technical requirements.',
'Created a global image conversion platform supporting HEIC and 20+ international format standards. Built SEO-optimized blog system with 30+ technical articles driving organic traffic. Implemented multi-country compliance engine for US, UK, UAE, and other markets with automated format recommendations.',
'High',
'["Next.js","Python","ImageMagick","AWS Lambda","Elasticsearch","CDN"]',
'["HEIC conversion with quality preservation","Support for 20+ global compliance formats","SEO-driven content system (30+ articles)","Multi-country format recommendations","High-performance batch processing","CDN-optimized delivery"]'),

('nextvendors-ecommerce', 'en', 5, '04', 'NextVendors E-Commerce Platform', 'SaaS Platform',
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

('kayany7', 'en', 7, '06', 'Kayany7 E-Commerce & Management System', 'Multi-Purpose Business Platform',
'Small to medium businesses needed an affordable, all-in-one platform combining e-commerce storefront, inventory management, order tracking, and customer communication — without the complexity of enterprise solutions.',
'Built a comprehensive multi-purpose business platform with integrated e-commerce, real-time inventory management, order workflow automation, and built-in customer messaging. Features a modern storefront with dynamic product catalogs, streamlined checkout, and an admin dashboard for end-to-end business operations.',
'High',
'["React","Node.js","PostgreSQL","Stripe","Redis","Docker","WebSocket"]',
'["Full e-commerce storefront with dynamic product catalogs and search","Real-time inventory tracking with automated low-stock alerts","Order management workflow from placement to fulfillment","Built-in customer communication and notification system","Admin dashboard with sales analytics and reporting","Responsive design optimized for mobile and desktop"]');

-- 3. PROJECTS (AR)
INSERT INTO projects (id, locale, sort_order, number, title, category, problem, solution, complexity, technologies, highlights) VALUES
('cachear-pos', 'ar', 1, '01', 'نظام Cachear المؤسسي لإدارة التجزئة', 'نظام مؤسسي متكامل (Offline-First)',
'الحاجة إلى نظام POS ذكي ومحمول قادر على العمل دون إنترنت، مع إدارة معقدة لصلاحيات الموظفين، ودعم واسع للملحقات الخارجية، دون الارتباط بأجهزة كمبيوتر مكلفة.',
'هندسة نظام مؤسسي ضخم يعمل محلياً بالكامل. ابتكرت نظام "بيئات معزولة" (Sandboxed Workspaces) حيث يدخل الموظف عبر QR إلى واجهات مخصصة لصلاحياته. طورت محرك مسح باركود ذكي بجميع الاتجاهات، ونظام فواتير يصدر PDF عبر واتساب أو يطبع حرارياً، مع بنية تحتية جاهزة للمزامنة السحابية.',
'Critical',
'["Flutter","Dart","BLoC","Clean Architecture","Drift (SQLite)","Hardware Integration"]',
'["نظام بيئات معزولة متعددة للموظفين عبر مسح QR، مع واجهات وإشعارات مخصصة لكل دور وظيفي","محرك مسح باركود فائق الذكاء عبر الكاميرا (بجميع الاتجاهات) مع دعم أجهزة المسح الطرفية","تصدير كشوفات الحساب والفواتير كملفات PDF وإرسالها آلياً عبر واتساب، أو طباعتها حرارياً","تكامل عميق مع النظام لسحب جهات الاتصال، وتتبع مالي دقيق للسجلات مع نظام مزامنة متطور","قاعدة بيانات سيادية ومحفزات SQL معقدة (Triggers) لأتمتة المبيعات والمخزون دون إنترنت","بنية معمارية صارمة (Clean Architecture) تضمن قابلية التوسع لربط النظام بلوحات تحكم مستقبلاً"]'),

('heic-converter', 'ar', 2, '02', 'محرك تحويل الصور الآمن (Client-Side)', 'تطبيق ويب / WebAssembly',
'معاناة المستخدمين الدائمة من رفض صيغة HEIC في البوابات الحكومية (مثل أبشر وناجز)، وتخوفهم من رفع مستنداتهم الحساسة لمواقع التحويل التي تنتهك الخصوصية.',
'هندسة منصة ويب تعتمد بنسبة 100% على معالجة الصور داخل متصفح المستخدم (Client-Side) باستخدام WebAssembly. لا يتم رفع أي صورة لأي خادم، مما يضمن أقصى درجات الخصوصية والأمان، بالإضافة إلى سرعة تحويل فورية.',
'High',
'["Next.js","React","WebAssembly","Web Workers","PWA","SEO Strategy"]',
'["استخدام تقنية WebAssembly لمعالجة وتحويل الصور الثقيلة محلياً داخل المتصفح","هندسة نظام صفر-رفع (Zero-Upload) لضمان الخصوصية التامة والامتثال لقوانين حماية البيانات","تطبيق استراتيجية SEO عميقة وموجهة لحل مشاكل رفع الملفات في البوابات الحكومية العربية","بناء مسارات تحويل ذكية لتحقيق الأرباح (Monetization Funnel) عبر دمج إعلانات AdSense","دعم كامل لتطبيقات الويب التقدمية (PWA) وتوطين ثنائي اللغة (عربي/إنجليزي)"]'),

('university-scheduler', 'ar', 3, '03', 'محرك الجدولة الجامعي (AI)', 'الذكاء الاصطناعي / خوارزميات هجينة',
'كانت إدارة الجامعة تقضي أسابيع في حل تعارضات الجدولة المعقدة يدوياً لآلاف الطلاب عبر قاعات دراسية محدودة وتوافر أعضاء هيئة التدريس.',
'تم تطوير محرك جدولة هجين يدمج بين قوة "الخوارزميات الجينية" وتقنيات "برمجة القيود" (Google OR-Tools) لإنشاء جداول خالية من التعارضات. هذا الدمج سمح بحل المشاكل المعقدة جداً وموازنة القيود الصارمة والمرنة بدقة وسرعة فائقة.',
'Advanced',
'["TypeScript","Genetic Algorithms","Google OR-Tools","PostgreSQL"]',
'["هندسة محرك هجين يدمج بين الخوارزميات الجينية ودقة Google OR-Tools (CP-SAT)","تقليل وقت إنشاء الجدول من 3 أسابيع إلى 4 دقائق","التعامل مع القيود الصارمة (التعارضات) والقيود المرنة (التفضيلات)","تحسين استخدام الذاكرة لمعالجة أكثر من 10,000 متغير رياضي في وقت واحد"]'),

('ai-image-platform', 'ar', 4, '03', 'منصة تحويل الصور بالذكاء الاصطناعي', 'منصة SaaS',
'يعاني المستخدمون حول العالم من توافق تنسيق صور HEIC عبر الأجهزة والمنصات المختلفة. احتاجت الشركات إلى تنسيقات صور متوافقة للأسواق الدولية المختلفة مع متطلبات تقنية متنوعة.',
'إنشاء منصة عالمية لتحويل الصور تدعم HEIC وأكثر من 20 معياراً دولياً. تم بناء نظام مدونة محسن لمحركات البحث مع 30+ مقال تقني لجذب الزيارات. تم تنفيذ محرك امتثال متعدد الدول للولايات المتحدة والمملكة المتحدة والإمارات وغيرها مع توصيات آليّة للتنسيق.',
'High',
'["Next.js","Python","ImageMagick","AWS Lambda","Elasticsearch","CDN"]',
'["تحويل HEIC مع الحفاظ على الجودة الأصلية","دعم أكثر من 20 تنسيق امتثال عالمي","نظام محتوى محسن لـ SEO (30+ مقال)","توصيات تنسيق مخصصة لكل دولة","معالجة دفعات عالية الأداء","توصيل محتوى محسن عبر الـ CDN"]'),

('nextvendors-ecommerce', 'ar', 5, '04', 'منصة NextVendors للتجارة الإلكترونية', 'منصة SaaS متكاملة',
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

('kayany7', 'ar', 7, '06', 'نظام Kayany7 للتجارة والإدارة', 'منصة أعمال متعددة الأغراض',
'احتاجت الشركات الصغيرة والمتوسطة إلى منصة شاملة بأسعار معقولة تجمع بين متجر إلكتروني، وإدارة المخزون، وتتبع الطلبات، والتواصل مع العملاء — دون تعقيد حلول المؤسسات الكبيرة.',
'بناء منصة أعمال شاملة متعددة الأغراض مع متجر إلكتروني متكامل، وإدارة مخزون في الوقت الفعلي، وأتمتة سير عمل الطلبات، ونظام رسائل مدمج مع العملاء. تتميز بواجهة متجر حديثة مع كتالوجات منتجات ديناميكية، وعملية دفع مبسطة، ولوحة تحكم إدارية لإدارة العمليات من البداية إلى النهاية.',
'High',
'["React","Node.js","PostgreSQL","Stripe","Redis","Docker","WebSocket"]',
'["متجر إلكتروني متكامل مع كتالوجات منتجات ديناميكية وبحث متقدم","تتبع المخزون في الوقت الفعلي مع تنبيهات آليّة لنفاد المخزون","سير عمل لإدارة الطلبات من التقديم إلى التنفيذ","نظام تواصل مدمج مع العملاء وإشعارات ذكية","لوحة تحكم إدارية مع تحليلات المبيعات والتقارير","تصميم متجاوب محسّن للجوال وسطح المكتب"]');

-- 4. SKILLS (EN)
INSERT INTO skills (locale, sort_order, category, icon, description, technologies) VALUES
('en', 1, 'Engineering Systems', 'cpu', 'Architecting scalable, high-performance systems with focus on reliability, security, and maintainability.', '["System Design","Microservices","API Architecture","Database Design","Cloud Infrastructure","DevOps"]'),
('en', 2, 'Web Development', 'code', 'Building modern, responsive web applications with cutting-edge frameworks and best practices.', '["React","Next.js","TypeScript","Node.js","Laravel","PostgreSQL","Tailwind CSS"]'),
('en', 3, 'AI & Data Processing', 'brain', 'Implementing intelligent systems with machine learning, automation, and advanced data pipelines.', '["Machine Learning","Data Cleaning","Preprocessing","Automation","Python","Genetic Algorithms"]'),
('en', 4, 'Mobile Development', 'smartphone', 'Creating native-quality mobile experiences with cross-platform frameworks and native integrations.', '["React Native","Mobile UI/UX","Native Modules","Push Notifications","Offline-First"]');

-- 5. SKILLS (AR)
INSERT INTO skills (locale, sort_order, category, icon, description, technologies) VALUES
('ar', 1, 'أنظمة الهندسة', 'cpu', 'تصميم أنظمة قابلة للتوسع وعالية الأداء مع التركيز على الموثوقية والأمان وسهولة الصيانة.', '["System Design","Microservices","API Architecture","Database Design","Cloud Infrastructure","DevOps"]'),
('ar', 2, 'تطوير الويب', 'code', 'بناء تطبيقات ويب حديثة ومتجاوبة باستخدام أحدث الأطر البرمجية وأفضل الممارسات.', '["React","Next.js","TypeScript","Node.js","Laravel","PostgreSQL","Tailwind CSS"]'),
('ar', 3, 'الذكاء الاصطناعي ومعالجة البيانات', 'brain', 'تنفيذ أنظمة ذكية مع تعلم الآلة، والأتمتة، ومسارات معالجة البيانات المتقدمة.', '["Machine Learning","Data Cleaning","Preprocessing","Automation","Python","Genetic Algorithms"]'),
('ar', 4, 'تطوير الموبايل', 'smartphone', 'إنشاء تجارب تطبيقات موبايل بجودة النيتف (Native) مع أطر عمل متعددة المنصات وتكاملات أصيلة.', '["React Native","Mobile UI/UX","Native Modules","Push Notifications","Offline-First"]');

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
