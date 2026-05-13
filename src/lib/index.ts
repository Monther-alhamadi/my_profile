import { Facebook } from "lucide-react";

export const ROUTE_PATHS = {
  HOME: '/',
} as const;

export type Language = 'en' | 'ar';

export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  problem: string;
  solution: string;
  complexity: 'High' | 'Critical' | 'Advanced';
  technologies: string[];
  highlights: string[];
  image?: string;
  link?: string;
}

export interface Skill {
  category: string;
  icon: string;
  description: string;
  technologies: string[];
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  pricing: string;
  features: string[];
}

export interface Experience {
  id: string;
  year: string;
  title: string;
  company: string;
  description: string;
  achievements: string[];
}

export interface Stat {
  id: string;
  value: string;
  label: string;
  suffix?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

export const PROJECTS_EN: Project[] = [
  {
    id: 'cachear-pos',
    number: '01',
    title: 'Cachear Enterprise Mobile POS',
    category: 'Enterprise Mobile Application',
    problem: 'Businesses required a highly sophisticated, offline-capable POS system that could handle complex multi-role employee environments, hardware integrations, and robust financial tracking without being tied to expensive desktop setups.',
    solution: 'Engineered a massive offline-first enterprise POS ecosystem. Built an advanced sandboxed workspace system where employees authenticate via QR to isolated, role-specific environments. Designed an omnidirectional camera scanning engine, WhatsApp PDF integrations, and a sovereign local database for seamless offline operations with future cloud-sync readiness.',
    complexity: 'Critical',
    technologies: ['Flutter', 'Dart', 'BLoC', 'Clean Architecture', 'Drift (SQLite)', 'Hardware Integration'],
    highlights: [
      'Multi-environment sandboxing for isolated, role-specific employee workspaces via QR login',
      'High-speed omnidirectional camera barcode scanning & external hardware scanner integration',
      'Versatile invoicing: Bluetooth thermal printing & automated PDF generation sent via WhatsApp',
      'Offline-First Sovereign Database with complex SQL triggers for automated ledger reconciliation',
      'Native device integrations including deep contact imports and background data synchronization',
      'Strict Domain-Driven Clean Architecture ensuring enterprise-grade scalability and maintainability'
    ],
  },
  {
    id: 'heic-converter',
    number: '02',
    title: 'Privacy-First Image Conversion Engine',
    category: 'Web Application / WebAssembly',
    problem: 'Users frequently face upload failures on critical government portals (e.g., Absher, Najiz) due to HEIC image format incompatibilities, while existing online tools compromise privacy by uploading sensitive documents to external servers.',
    solution: 'Engineered a highly optimized, 100% client-side HEIC-to-JPG conversion platform utilizing WebAssembly. The system processes heavy image payloads directly within the browser, ensuring absolute privacy, zero data retention, and instant conversion speeds without server wait times.',
    complexity: 'High',
    technologies: ['Next.js', 'React', 'WebAssembly', 'Web Workers', 'PWA', 'SEO Strategy'],
    highlights: [
      'Implemented WebAssembly (heic2any) for robust, local browser-based image processing',
      'Architected a privacy-first (Zero-Upload) ecosystem, ensuring GDPR/CCPA compliance',
      'Developed advanced SEO content silos and localized targeting for MENA government portal users',
      'Engineered a scalable Monetization-AdSense funnel with smart tier-based processing limits',
      'Full PWA readiness for native-like offline capabilities and localized i18n support'
    ],
  },
  {
    id: 'university-scheduler',
    number: '03',
    title: 'University Scheduling Engine (AI)',
    category: 'AI / Hybrid Algorithms',
    problem: 'University administration spent weeks manually resolving complex scheduling conflicts for thousands of students across limited classrooms and faculty availability.',
    solution: 'Developed a highly advanced hybrid scheduling engine that combines Genetic Algorithms with Google OR-Tools (Constraint Programming) to autonomously generate optimal, clash-free schedules. This hybrid approach perfectly balances hard capacity limits with soft professor time preferences.',
    complexity: 'Advanced',
    technologies: ['TypeScript', 'Genetic Algorithms', 'Google OR-Tools', 'PostgreSQL'],
    highlights: [
      'Engineered a hybrid solver combining Genetic Algorithms and Google OR-Tools (CP-SAT)',
      'Reduced schedule generation time from 3 weeks to 4 minutes',
      'Handled hard constraints (clashes) and soft constraints (preferences)',
      'Optimized memory usage for processing 10,000+ variables concurrently'
    ],
  },
  {
    id: 'ai-image-platform',
    number: '03',
    title: 'AI-Powered Image Conversion Platform',
    category: 'SaaS Platform',
    problem: 'Users worldwide struggled with HEIC image format compatibility across different devices and platforms. Businesses needed compliant image formats for various international markets with different technical requirements.',
    solution: 'Created a global image conversion platform supporting HEIC and 20+ international format standards. Built SEO-optimized blog system with 30+ technical articles driving organic traffic. Implemented multi-country compliance engine for US, UK, UAE, and other markets with automated format recommendations.',
    complexity: 'High',
    technologies: ['Next.js', 'Python', 'ImageMagick', 'AWS Lambda', 'Elasticsearch', 'CDN'],
    highlights: [
      'HEIC conversion with quality preservation',
      'Support for 20+ global compliance formats',
      'SEO-driven content system (30+ articles)',
      'Multi-country format recommendations',
      'High-performance batch processing',
      'CDN-optimized delivery'
    ],
  },
  {
    id: 'nextvendors-ecommerce',
    number: '04',
    title: 'NextVendors E-Commerce Platform',
    category: 'SaaS Platform',
    problem: 'Yemen lacked reliable centralized digital marketplaces. Additionally, strict API constraints and financial infrastructure limitations made standard payment gateways unviable for local businesses.',
    solution: 'Architected and deployed a decoupled multi-vendor SaaS platform from scratch. Designed a custom, borderless payment module to handle manual/ledger transactions, eliminating geographical restrictions and enabling immediate local adoption.',
    complexity: 'High',
    technologies: ['Python', 'FastAPI', 'React', 'Zustand', 'PostgreSQL', 'Docker', 'Nginx'],
    highlights: [
      'Decoupled system architecture (Python backend, React SPA)',
      'Custom modular payment engine bypassing local constraints',
      'Complex relational DB with automated migrations (Alembic)',
      'Advanced state management via Zustand & React Query',
      'Multi-language UI (i18next) with Tailwind CSS',
      'Containerized deployment pipeline with Docker & Nginx'
    ],
  },
  {
    id: 'ai-tools-hub',
    number: '05',
    title: 'AI Tools Orchestration Hub',
    category: 'AI Integration Platform',
    problem: 'Businesses struggled to integrate and manage multiple AI tools and APIs. Prompt engineering required technical expertise, and there was no unified interface for AI workflow automation.',
    solution: 'Developed an AI orchestration platform that unifies multiple AI services (GPT, Claude, Midjourney, etc.) with intelligent prompt management, workflow automation, and result optimization. Features template library, A/B testing for prompts, and cost tracking across providers.',
    complexity: 'Advanced',
    technologies: ['React', 'Node.js', 'OpenAI API', 'Anthropic API', 'MongoDB', 'Bull Queue', 'WebSocket'],
    highlights: [
      'Multi-provider AI integration',
      'Intelligent prompt template system',
      'Automated workflow orchestration',
      'A/B testing for prompt optimization',
      'Cost tracking & analytics',
      'Real-time result streaming'
    ],
  }
];

export const PROJECTS_AR: Project[] = [
  {
    id: 'cachear-pos',
    number: '01',
    title: 'نظام Cachear المؤسسي لإدارة التجزئة',
    category: 'نظام مؤسسي متكامل (Offline-First)',
    problem: 'الحاجة إلى نظام POS ذكي ومحمول قادر على العمل دون إنترنت، مع إدارة معقدة لصلاحيات الموظفين، ودعم واسع للملحقات الخارجية، دون الارتباط بأجهزة كمبيوتر مكلفة.',
    solution: 'هندسة نظام مؤسسي ضخم يعمل محلياً بالكامل. ابتكرت نظام "بيئات معزولة" (Sandboxed Workspaces) حيث يدخل الموظف عبر QR إلى واجهات مخصصة لصلاحياته. طورت محرك مسح باركود ذكي بجميع الاتجاهات، ونظام فواتير يصدر PDF عبر واتساب أو يطبع حرارياً، مع بنية تحتية جاهزة للمزامنة السحابية.',
    complexity: 'Critical',
    technologies: ['Flutter', 'Dart', 'BLoC', 'Clean Architecture', 'Drift (SQLite)', 'Hardware Integration'],
    highlights: [
      'نظام "بيئات معزولة" متعددة للموظفين عبر مسح QR، مع واجهات وإشعارات مخصصة لكل دور وظيفي',
      'محرك مسح باركود فائق الذكاء عبر الكاميرا (بجميع الاتجاهات) مع دعم أجهزة المسح الطرفية',
      'تصدير كشوفات الحساب والفواتير كملفات PDF وإرسالها آلياً عبر واتساب، أو طباعتها حرارياً',
      'تكامل عميق مع النظام لسحب جهات الاتصال، وتتبع مالي دقيق للسجلات مع نظام مزامنة متطور',
      'قاعدة بيانات سيادية ومحفزات SQL معقدة (Triggers) لأتمتة المبيعات والمخزون دون إنترنت',
      'بنية معمارية صارمة (Clean Architecture) تضمن قابلية التوسع لربط النظام بلوحات تحكم مستقبلاً'
    ]
  },
  {
    id: 'heic-converter',
    number: '02',
    title: 'محرك تحويل الصور الآمن (Client-Side)',
    category: 'تطبيق ويب / WebAssembly',
    problem: 'معاناة المستخدمين الدائمة من رفض صيغة HEIC في البوابات الحكومية (مثل أبشر وناجز)، وتخوفهم من رفع مستنداتهم الحساسة لمواقع التحويل التي تنتهك الخصوصية.',
    solution: 'هندسة منصة ويب تعتمد بنسبة 100% على معالجة الصور داخل متصفح المستخدم (Client-Side) باستخدام WebAssembly. لا يتم رفع أي صورة لأي خادم، مما يضمن أقصى درجات الخصوصية والأمان، بالإضافة إلى سرعة تحويل فورية.',
    complexity: 'High',
    technologies: ['Next.js', 'React', 'WebAssembly', 'Web Workers', 'PWA', 'SEO Strategy'],
    highlights: [
      'استخدام تقنية WebAssembly لمعالجة وتحويل الصور الثقيلة محلياً داخل المتصفح',
      'هندسة نظام "صفر-رفع" (Zero-Upload) لضمان الخصوصية التامة والامتثال لقوانين حماية البيانات',
      'تطبيق استراتيجية SEO عميقة وموجهة لحل مشاكل رفع الملفات في البوابات الحكومية العربية',
      'بناء مسارات تحويل ذكية لتحقيق الأرباح (Monetization Funnel) عبر دمج إعلانات AdSense',
      'دعم كامل لتطبيقات الويب التقدمية (PWA) وتوطين ثنائي اللغة (عربي/إنجليزي)'
    ]
  },
  {
    id: 'university-scheduler',
    number: '03',
    title: 'محرك الجدولة الجامعي (AI)',
    category: 'الذكاء الاصطناعي / خوارزميات هجينة',
    problem: 'كانت إدارة الجامعة تقضي أسابيع في حل تعارضات الجدولة المعقدة يدوياً لآلاف الطلاب عبر قاعات دراسية محدودة وتوافر أعضاء هيئة التدريس.',
    solution: 'تم تطوير محرك جدولة هجين يدمج بين قوة "الخوارزميات الجينية" وتقنيات "برمجة القيود" (Google OR-Tools) لإنشاء جداول خالية من التعارضات. هذا الدمج سمح بحل المشاكل المعقدة جداً وموازنة القيود الصارمة والمرنة بدقة وسرعة فائقة.',
    complexity: 'Advanced',
    technologies: ['TypeScript', 'Genetic Algorithms', 'Google OR-Tools', 'PostgreSQL'],
    highlights: [
      'هندسة محرك هجين يدمج بين الخوارزميات الجينية ودقة Google OR-Tools (CP-SAT)',
      'تقليل وقت إنشاء الجدول من 3 أسابيع إلى 4 دقائق',
      'التعامل مع القيود الصارمة (التعارضات) والقيود المرنة (التفضيلات)',
      'تحسين استخدام الذاكرة لمعالجة أكثر من 10,000 متغير رياضي في وقت واحد'
    ]
  },
  {
    id: 'ai-image-platform',
    number: '03',
    title: 'منصة تحويل الصور بالذكاء الاصطناعي',
    category: 'منصة SaaS',
    problem: 'يعاني المستخدمون حول العالم من توافق تنسيق صور HEIC عبر الأجهزة والمنصات المختلفة. احتاجت الشركات إلى تنسيقات صور متوافقة للأسواق الدولية المختلفة مع متطلبات تقنية متنوعة.',
    solution: 'إنشاء منصة عالمية لتحويل الصور تدعم HEIC وأكثر من 20 معياراً دولياً. تم بناء نظام مدونة محسن لمحركات البحث مع 30+ مقال تقني لجذب الزيارات. تم تنفيذ محرك امتثال متعدد الدول للولايات المتحدة والمملكة المتحدة والإمارات وغيرها مع توصيات آليّة للتنسيق.',
    complexity: 'High',
    technologies: ["Next.js", "Python", "ImageMagick", "AWS Lambda", "Elasticsearch", "CDN"],
    highlights: [
      "تحويل HEIC مع الحفاظ على الجودة الأصلية",
      "دعم أكثر من 20 تنسيق امتثال عالمي",
      "نظام محتوى محسن لـ SEO (30+ مقال)",
      "توصيات تنسيق مخصصة لكل دولة",
      "معالجة دفعات عالية الأداء",
      "توصيل محتوى محسن عبر الـ CDN"
    ]
  },
  {
    id: 'nextvendors-ecommerce',
    number: '04',
    title: 'منصة NextVendors للتجارة الإلكترونية',
    category: 'منصة SaaS متكاملة',
    problem: 'غياب المتاجر المركزية الموثوقة في السوق المحلي، بالإضافة إلى القيود المعقدة وشروط بوابات الدفع المحلية التي تعيق تبني حلول التجارة الإلكترونية التقليدية.',
    solution: 'هندسة وبناء منصة SaaS متعددة البائعين من الصفر. تم تصميم نظام دفع مرن ومستقل يعتمد على المعالجة اليدوية وسجلات الأستاذ لتجاوز تعقيدات البنوك، مما كسر القيود الجغرافية وسمح باستقطاب البائعين بحرية.',
    complexity: 'High',
    technologies: ['Python', 'FastAPI', 'React', 'Zustand', 'PostgreSQL', 'Docker', 'Nginx'],
    highlights: [
      'هندسة معمارية مفصولة (Decoupled System) تعتمد على Python و React',
      'محرك سداد مخصص لتجاوز القيود التقنية والجغرافية لبوابات الدفع',
      'تصميم قواعد بيانات تدعم تعدد المتاجر مع إدارة ترحيلات (Alembic)',
      'إدارة متقدمة للحالة باستخدام Zustand و React Query',
      'واجهة مستخدم تفاعلية تدعم تعدد اللغات (i18n)',
      'بيئة إنتاج مستقرة ومعبأة بالكامل باستخدام Docker و Nginx'
    ]
  },
  {
    id: 'ai-tools-hub',
    number: '05',
    title: 'مركز تنسيق أدوات الذكاء الاصطناعي',
    category: 'منصة دمج الذكاء الاصطناعي',
    problem: 'واجهت الشركات صعوبة في دمج وإدارة أدوات ونماذج الذكاء الاصطناعي المتاصطناعي المتعددة. تطلبت هندسة الأوامر (Prompt Engineering) خبرة تقنية، ولم تكن هناك واجهة موحدة لأتمتة سير عمل الذكاء الاصطناعي.',
    solution: 'تطوير منصة تنسيق ذكاء اصطناعي توحد خدمات متعددة (GPT, Claude, Midjourney, إلخ) مع إدارة ذكية للأوامر، وأتمتة سير العمل، وتحسين النتائج. تتميز بمكتبة قوالب، واختبار A/B للأوامر، وتتبع التكلفة عبر المزودين.',
    complexity: 'Advanced',
    technologies: ["React", "Node.js", "OpenAI API", "Anthropic API", "MongoDB", "Bull Queue", "WebSocket"],
    highlights: [
      "دمج مزودي ذكاء اصطناعي متعددين",
      "نظام ذكي لقوالب الأوامر",
      "تنسيق آلي لسير العمل (Orchestration)",
      "اختبار A/B لتحسين الأوامر",
      "تتبع التكاليف والتحليلات",
      "بث النتائج في الوقت الفعلي"
    ]
  }
];

export const SKILLS_EN: Skill[] = [
  {
    category: 'Engineering Systems',
    icon: 'cpu',
    description: 'Architecting scalable, high-performance systems with focus on reliability, security, and maintainability.',
    technologies: ['System Design', 'Microservices', 'API Architecture', 'Database Design', 'Cloud Infrastructure', 'DevOps'],
  },
  {
    category: 'Web Development',
    icon: 'code',
    description: 'Building modern, responsive web applications with cutting-edge frameworks and best practices.',
    technologies: ['React', 'Next.js', 'TypeScript', 'Node.js', 'Laravel', 'PostgreSQL', 'Tailwind CSS'],
  },
  {
    category: 'AI & Data Processing',
    icon: 'brain',
    description: 'Implementing intelligent systems with machine learning, automation, and advanced data pipelines.',
    technologies: ['Machine Learning', 'Data Cleaning', 'Preprocessing', 'Automation', 'Python', 'Genetic Algorithms'],
  },
  {
    category: 'Mobile Development',
    icon: 'smartphone',
    description: 'Creating native-quality mobile experiences with cross-platform frameworks and native integrations.',
    technologies: ['React Native', 'Mobile UI/UX', 'Native Modules', 'Push Notifications', 'Offline-First'],
  },
];

export const SKILLS_AR: Skill[] = [
  {
    category: "أنظمة الهندسة",
    icon: "cpu",
    description: "تصميم أنظمة قابلة للتوسع وعالية الأداء مع التركيز على الموثوقية والأمان وسهولة الصيانة.",
    technologies: ["System Design", "Microservices", "API Architecture", "Database Design", "Cloud Infrastructure", "DevOps"]
  },
  {
    category: "تطوير الويب",
    icon: "code",
    description: "بناء تطبيقات ويب حديثة ومتجاوبة باستخدام أحدث الأطر البرمجية وأفضل الممارسات.",
    technologies: ["React", "Next.js", "TypeScript", "Node.js", "Laravel", "PostgreSQL", "Tailwind CSS"]
  },
  {
    category: "الذكاء الاصطناعي ومعالجة البيانات",
    icon: "brain",
    description: "تنفيذ أنظمة ذكية مع تعلم الآلة، والأتمتة، ومسارات معالجة البيانات المتقدمة.",
    technologies: ["Machine Learning", "Data Cleaning", "Preprocessing", "Automation", "Python", "Genetic Algorithms"]
  },
  {
    category: "تطوير الموبايل",
    icon: "smartphone",
    description: "إنشاء تجارب تطبيقات موبايل بجودة النيتف (Native) مع أطر عمل متعددة المنصات وتكاملات أصيلة.",
    technologies: ["React Native", "Mobile UI/UX", "Native Modules", "Push Notifications", "Offline-First"]
  }
];

export const SERVICES_EN: Service[] = [
  {
    id: 'fullstack-dev',
    icon: 'layers',
    title: 'Full-Stack Development',
    description: 'End-to-end web and mobile application development with modern frameworks, scalable architecture, and production-ready code.',
    pricing: 'from $5,000',
    features: [
      'Custom web & mobile applications',
      'API design & development',
      'Database architecture',
      'Cloud deployment & DevOps',
      'Performance optimization',
      'Ongoing maintenance & support'
    ],
  },
  {
    id: 'ai-integration',
    icon: 'sparkles',
    title: 'AI Integration & Automation',
    description: 'Integrate cutting-edge AI capabilities into your products. From GPT-powered features to custom ML models and intelligent automation.',
    pricing: 'from $3,000',
    features: [
      'AI API integration (OpenAI, Claude, etc.)',
      'Custom ML model development',
      'Intelligent automation workflows',
      'Data preprocessing & cleaning',
      'Prompt engineering & optimization',
      'AI-powered analytics'
    ],
  },
  {
    id: 'system-architecture',
    icon: 'network',
    title: 'System Architecture & Consulting',
    description: 'Strategic technical consulting for complex systems. Architecture design, performance optimization, and scalability planning.',
    pricing: 'from $2,000',
    features: [
      'System architecture design',
      'Technical feasibility analysis',
      'Performance optimization',
      'Scalability planning',
      'Security audit & hardening',
      'Technology stack recommendations'
    ],
  },
];

export const SERVICES_AR: Service[] = [
  {
    id: "fullstack-dev",
    icon: "layers",
    title: "تطوير متكامل (Full-Stack)",
    description: "تطوير تطبيقات الويب والموبايل من البداية إلى النهاية مع أطر عمل حديثة ومعمارية قابلة للتوسع.",
    pricing: "تبدأ من $5,000",
    features: [
      "تطبيقات ويب وموبايل مخصصة",
      "تصميم وتطوير الـ APIs",
      "هندسة قواعد البيانات",
      "النشر السحابي والـ DevOps",
      "تحسين الأداء",
      "الصيانة والدعم المستمر"
    ]
  },
  {
    id: "ai-integration",
    icon: "sparkles",
    title: "دمج الذكاء الاصطناعي والأتمتة",
    description: "دمج قدرات الذكاء الاصطناعي المتطورة في منتجاتك. من ميزات GPT إلى نماذج تعلم الآلة المخصصة والأتمتة الذكية.",
    pricing: "تبدأ من $3,000",
    features: [
      "دمج واجهات الذكاء الاصطناعي (OpenAI, Claude, إلخ)",
      "تطوير نماذج تعلم آلة مخصصة",
      "مسارات عمل للأتمتة الذكية",
      "معالجة وتنظيف البيانات",
      "هندسة وتحسين الأوامر (Prompts)",
      "تحليلات مدعومة بالذكاء الاصطناعي"
    ]
  },
  {
    id: "system-architecture",
    icon: "network",
    title: "هندسة الأنظمة والاستشارات",
    description: "استشارات تقنية استراتيجية للأنظمة المعقدة. تصميم المعمارية، وتحسين الأداء، وتخطيط القابلية للتوسع.",
    pricing: "تبدأ من $2,000",
    features: [
      "تصميم معمارية الأنظمة",
      "تحليل الجدوى التقنية",
      "تحسين الأداء التقني",
      "تخطيط التوسع المستقبلي",
      "تدقيق الأمان وتقوية الأنظمة",
      "توصيات بمجموعة التقنيات المناسبة"
    ]
  }
];

export const EXPERIENCE_EN: Experience[] = [
  {
    id: 'exp-1',
    year: '2022 - Present',
    title: 'Senior Full-Stack Engineer',
    company: 'Freelance / Contract',
    description: 'Leading development of complex web and mobile applications for international clients. Specializing in AI integration, system architecture, and high-performance solutions.',
    achievements: [
      'Delivered 20+ production systems across retail, education, and SaaS domains',
      'Architected multi-vendor e-commerce platform serving 1000+ daily users',
      'Implemented AI-powered tools reducing manual work by 70%',
      'Optimized database queries achieving 10x performance improvement'
    ],
  },
  {
    id: 'exp-2',
    year: '2020 - 2022',
    title: 'Full-Stack Developer',
    company: 'Tech Startup',
    description: 'Built core product features and infrastructure for fast-growing SaaS platform. Focused on scalability, user experience, and rapid iteration.',
    achievements: [
      'Developed real-time collaboration features using WebSocket',
      'Reduced API response time by 60% through caching strategies',
      'Implemented CI/CD pipeline reducing deployment time by 80%',
      'Mentored junior developers on best practices'
    ],
  },
];

export const EXPERIENCE_AR: Experience[] = [
  {
    id: "exp-1",
    year: "2022 - الآن",
    title: "مهندس برمجيات أول (Full-Stack)",
    company: "عمل حر / تعاقد",
    description: "قيادة تطوير تطبيقات ويب وموبايل معقدة لعملاء دوليين. متخصص في دمج الذكاء الاصطناعي ومعمارية الأنظمة والحلول عالية الأداء.",
    achievements: [
      "تسليم أكثر من 20 نظاماً إنتاجياً في مجالات التجزئة والتعليم و الـ SaaS",
      "هندسة منصة تجارة إلكترونية متعددة التجار تخدم 1000+ مستخدم يومياً",
      "تنفيذ أدوات مدعومة بالذكاء الاصطناعي قللت العمل اليدوي بنسبة 70%",
      "تحسين استعلامات قواعد البيانات وتحقيق تحسن في الأداء بمقدار 10 أضعاف"
    ]
  },
  {
    id: "exp-2",
    year: "2020 - 2022",
    title: "مطور Full-Stack",
    company: "شركة تقنية ناشئة",
    description: "بناء ميزات المنتج الأساسية والبنية التحتية لمنصة SaaS سريعة النمو. التركيز على القابلية للتوسع وتجربة المستخدم والتحسين السريع.",
    achievements: [
      "تطوير ميزات تعاون فوري باستخدام WebSocket",
      "تقليل وقت استجابة الـ API بنسبة 60% عبر استراتيجيات التخزين المؤقت",
      "تنفيذ خط مسار CI/CD قلل وقت النشر بنسبة 80%",
      "توجيه المطورين المبتدئين حول أفضل الممارسات"
    ]
  }
];

export const STATS_EN: Stat[] = [
  { id: 'stat-1', value: '4', label: 'Years Experience', suffix: '+' },
  { id: 'stat-2', value: '20', label: 'Projects Delivered', suffix: '+' },
  { id: 'stat-3', value: '5', label: 'AI Systems Built' },
  { id: 'stat-4', value: '15', label: 'Technologies Mastered', suffix: '+' },
];

export const STATS_AR: Stat[] = [
  { id: "stat-1", value: "4", label: "سنوات خبرة", suffix: "+" },
  { id: "stat-2", value: "20", label: "مشروع تم تسليمه", suffix: "+" },
  { id: "stat-3", value: "5", label: "أنظمة ذكاء اصطناعي" },
  { id: "stat-4", value: "15", label: "تقنيات متقنة", suffix: "+" }
];

export const TESTIMONIALS_EN: Testimonial[] = [
  {
    id: 'test-1',
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'RetailTech Solutions',
    content: 'The retail management system transformed our operations. The QR onboarding and POS integration saved us countless hours. Exceptional technical expertise and attention to detail.',
    rating: 5,
  },
  {
    id: 'test-2',
    name: 'Dr. Michael Chen',
    role: 'Academic Director',
    company: 'University of Technology',
    content: 'The scheduling system solved a problem we struggled with for years. The genetic algorithm approach was brilliant, and the drag-and-drop interface made it incredibly user-friendly.',
    rating: 5,
  },
  {
    id: 'test-3',
    name: 'Ahmed Al-Rashid',
    role: 'Founder',
    company: 'Digital Commerce Hub',
    content: 'Outstanding work on our e-commerce platform. The multi-vendor system and dropshipping integration exceeded expectations. Professional, responsive, and delivered on time.',
    rating: 5,
  },
];

export const TESTIMONIALS_AR: Testimonial[] = [
  {
    id: "test-1",
    name: "سارة جونسون",
    role: "المدير التنفيذي",
    company: "RetailTech Solutions",
    content: "نظام إدارة التجزئة غير عملياتنا تماماً. تسجيل الموظفين عبر QR وتكامل POS وفر لنا ساعات لا تحصى. خبرة تقنية استثنائية واهتمام بالتفاصيل.",
    rating: 5
  },
  {
    id: "test-2",
    name: "د. مايكل تشن",
    role: "المدير الأكاديمي",
    company: "جامعة التكنولوجيا",
    content: "نظام الجدولة حل مشكلة عانينا منها لسنوات. نهج الخوارزمية الجينية كان عبقرياً، وواجهة السحب والإفلات جعلته سهل الاستخدام للغاية.",
    rating: 5
  },
  {
    id: "test-3",
    name: "أحمد الراشد",
    role: "المؤسس",
    company: "Digital Commerce Hub",
    content: "عمل رائع في منصة التجارة الإلكترونية الخاصة بنا. نظام التجار المتعددين وتكامل الدروب شيبنج تجاوز التوقعات. احترافية واستجابة وتسليم في الموعد.",
    rating: 5
  }
];

export const translations: Record<Language, any> = {
  en: {
    nav: {
      home: 'Home',
      about: 'About',
      expertise: 'Expertise',
      projects: 'Projects',
      services: 'Services',
      experience: 'Experience',
      testimonials: 'Testimonials',
      contact: 'Contact',
      letsTalk: "Let's Talk",
    },
    hero: {
      greeting: "Hi, I'm Monther Alhamadi",
      title: 'Software Engineer | Full-Stack & Intelligent Systems',
      specializations: [
        'Building scalable web applications',
        'Architecting intelligent systems',
        'Integrating AI-powered solutions',
        'Optimizing complex algorithms',
      ],
      cta1: 'Start a Project',
      cta2: 'View My Work',
      techStack: 'Tech Stack',
    },
    about: {
      title: 'About',
      subtitle: 'Building intelligent systems that solve real problems',
      statement: 'I don\'t just write code—I architect solutions.',
      bio: 'With 4+ years of experience in full-stack development and AI integration, I specialize in building production-ready systems that combine technical excellence with business value. From retail management platforms to AI-powered tools, I focus on creating intelligent, scalable solutions that make a real impact.',
      highlights: [
        'Systems thinking approach to complex problems',
        'Production-grade code with focus on maintainability',
        'Deep expertise in AI integration and automation',
        'Track record of delivering high-impact projects',
      ],
    },
    expertise: {
      title: 'Expertise',
      subtitle: 'Core capabilities across the full development stack',
    },
    projects: {
      title: 'Projects',
      subtitle: 'Case studies of complex systems and intelligent solutions',
      problem: 'Problem',
      solution: 'Solution',
      complexity: 'Complexity',
      technologies: 'Technologies',
      highlights: 'Key Highlights',
      viewDetails: 'View Details',
    },
    services: {
      title: 'Services',
      subtitle: 'How I can help bring your vision to life',
      features: 'What\'s Included',
    },
    experience: {
      title: 'Experience',
      subtitle: 'Professional journey and key achievements',
      achievements: 'Key Achievements',
    },
    testimonials: {
      title: 'Testimonials',
      subtitle: 'What clients say about working together',
    },
    contact: {
      title: 'Let\'s Work Together',
      subtitle: 'Have a project in mind? Let\'s discuss how I can help.',
      info: 'Contact Information',
      email: 'Email',
      location: 'Location',
      availability: 'Availability',
      availableText: 'Available for freelance projects',
      social: 'Connect',
      form: {
        name: 'Your Name',
        email: 'Your Email',
        projectType: 'Project Type',
        message: 'Tell me about your project',
        submit: 'Send Message',
        sending: 'Sending...',
        projectTypes: {
          web: 'Web Application',
          mobile: 'Mobile App',
          ai: 'AI Integration',
          consulting: 'Consulting',
          other: 'Other',
        },
      },
    },
    footer: {
      copyright: '© 2026 All rights reserved.',
      builtWith: 'Built with precision and passion',
    },
  },
  ar: {
    nav: {
      home: 'الرئيسية',
      about: 'نبذة',
      expertise: 'الخبرات',
      projects: 'المشاريع',
      services: 'الخدمات',
      experience: 'التجربة',
      testimonials: 'الآراء',
      contact: 'تواصل',
      letsTalk: 'لنتحدث',
    },
    hero: {
      greeting: 'مرحباً، أنا منذر الحمادي',
      title: 'مهندس برمجيات | تطوير شامل وأنظمة ذكية',
      specializations: [
        'بناء تطبيقات ويب قابلة للتوسع',
        'تصميم أنظمة ذكية',
        'دمج حلول مدعومة بالذكاء الاصطناعي',
        'تحسين الخوارزميات المعقدة',
      ],
      cta1: 'ابدأ مشروعاً',
      cta2: 'شاهد أعمالي',
      techStack: 'التقنيات',
    },
    about: {
      title: 'نبذة',
      subtitle: 'بناء أنظمة ذكية تحل مشاكل حقيقية',
      statement: 'لا أكتب الكود فقط—أصمم الحلول.',
      bio: 'مع أكثر من 4 سنوات من الخبرة في التطوير الشامل ودمج الذكاء الاصطناعي، أتخصص في بناء أنظمة جاهزة للإنتاج تجمع بين التميز التقني والقيمة التجارية. من منصات إدارة التجزئة إلى أدوات مدعومة بالذكاء الاصطناعي، أركز على إنشاء حلول ذكية وقابلة للتوسع تحدث تأثيراً حقيقياً.',
      highlights: [
        'نهج تفكير منظومي للمشاكل المعقدة',
        'كود بجودة إنتاجية مع التركيز على سهولة الصيانة',
        'خبرة عميقة في دمج الذكاء الاصطناعي والأتمتة',
        'سجل حافل في تسليم مشاريع عالية التأثير',
      ],
    },
    expertise: {
      title: 'الخبرات',
      subtitle: 'القدرات الأساسية عبر مجموعة التطوير الكاملة',
    },
    projects: {
      title: 'المشاريع',
      subtitle: 'دراسات حالة لأنظمة معقدة وحلول ذكية',
      problem: 'المشكلة',
      solution: 'الحل',
      complexity: 'التعقيد',
      technologies: 'التقنيات',
      highlights: 'النقاط الرئيسية',
      viewDetails: 'عرض التفاصيل',
    },
    services: {
      title: 'الخدمات',
      subtitle: 'كيف يمكنني المساعدة في تحويل رؤيتك إلى واقع',
      features: 'ما المتضمن',
    },
    experience: {
      title: 'التجربة',
      subtitle: 'الرحلة المهنية والإنجازات الرئيسية',
      achievements: 'الإنجازات الرئيسية',
    },
    testimonials: {
      title: 'الآراء',
      subtitle: 'ما يقوله العملاء عن العمل معاً',
    },
    contact: {
      title: 'لنعمل معاً',
      subtitle: 'لديك مشروع في ذهنك؟ دعنا نناقش كيف يمكنني المساعدة.',
      info: 'معلومات الاتصال',
      email: 'البريد الإلكتروني',
      location: 'الموقع',
      availability: 'التوفر',
      availableText: 'متاح لمشاريع العمل الحر',
      social: 'تواصل',
      form: {
        name: 'اسمك',
        email: 'بريدك الإلكتروني',
        projectType: 'نوع المشروع',
        message: 'أخبرني عن مشروعك',
        submit: 'إرسال الرسالة',
        sending: 'جاري الإرسال...',
        projectTypes: {
          web: 'تطبيق ويب',
          mobile: 'تطبيق موبايل',
          ai: 'دمج ذكاء اصطناعي',
          consulting: 'استشارات',
          other: 'أخرى',
        },
      },
    },
    footer: {
      copyright: '© 2026 جميع الحقوق محفوظة.',
      builtWith: 'بُني بدقة وشغف',
    },
  },
};

export const CONTACT_INFO = {
  email: 'montheralhamadi7@gmail.com',
  location: 'Remote / Global',
  github: 'https://github.com/Monther-alhamadi',
  linkedin: 'https://www.linkedin.com/in/monther-alhamadi-51315a216?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3B8KRfM%2Bj4QIi1DBA8XOgXfQ%3D%3D',
  Facebook: 'https://www.facebook.com/profile.php?id=100005415252086',
};
