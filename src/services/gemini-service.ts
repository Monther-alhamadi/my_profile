import { GoogleGenerativeAI } from "@google/generative-ai";
import { PROFILE_STATIC, PROJECTS_EN } from "@/lib/data-static";
import type { Language } from "@/lib/index";

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GROK_API_KEY = import.meta.env.VITE_GROK_API_KEY;

const genAI = GEMINI_API_KEY?.startsWith("AIzaSy") ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const profileSummary = `
Name: ${PROFILE_STATIC.name}
Title (EN): ${PROFILE_STATIC.title_en}
Title (AR): ${PROFILE_STATIC.title_ar}
Bio (EN): ${PROFILE_STATIC.bio_en}
Bio (AR): ${PROFILE_STATIC.bio_ar}
Location: ${PROFILE_STATIC.location}
Email: ${PROFILE_STATIC.email}
GitHub: ${PROFILE_STATIC.github_url}
LinkedIn: ${PROFILE_STATIC.linkedin_url}
CV: ${PROFILE_STATIC.cv_url}

Projects:
${PROJECTS_EN.map((p) => `- ${p.number}. ${p.title} (${p.category}): ${p.solution}`).join("\n")}

Technical Skills: React, Next.js, TypeScript, Node.js, Python, Flutter, PostgreSQL, Docker, AI/ML Integration, WebAssembly, PWA, Clean Architecture, BLoC, Drift (SQLite)

Experience: Senior Full-Stack Engineer (Freelance/Contract, 2022-present), Tech Startup (2020-2022)
`;

function getSystemPrompt(language: Language): string {
  const lang = language === "ar" ? "Arabic" : "English";
  return `You are the AI assistant for Monther Alhamadi's portfolio website. You help visitors learn about Monther's skills, experience, projects, and how to contact him.

Here is Monther's profile information:
${profileSummary}

Rules:
- Answer in ${lang} only
- Be concise and professional (2-4 sentences max)
- If asked something outside this context, politely redirect to Monther's relevant skills/projects
- Do not make up information not provided above
- Use natural, conversational language`;
}

async function askGemini(
  question: string,
  language: Language,
): Promise<string> {
  if (!GEMINI_API_KEY) throw new Error("Gemini API key not configured");

  const prompt = `${getSystemPrompt(language)}\n\nVisitor question: ${question}`;

  if (GEMINI_API_KEY.startsWith("AIzaSy")) {
    if (!genAI) throw new Error("Gemini SDK not initialized");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent(prompt);
    return result.response.text();
  }

  // New key format (AQ....) - use REST API directly
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { maxOutputTokens: 200, temperature: 0.7 },
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Gemini API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.candidates[0].content.parts[0].text;
}

async function askGrok(
  question: string,
  language: Language,
): Promise<string> {
  if (!GROK_API_KEY) throw new Error("Grok API key not configured");

  const response = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${GROK_API_KEY}`,
    },
    body: JSON.stringify({
      model: "grok-3-mini",
      messages: [
        { role: "system", content: getSystemPrompt(language) },
        { role: "user", content: question },
      ],
      max_tokens: 200,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Grok API error: ${response.status} ${error}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

const RESPONSES_EN: Record<string, string> = {
  hello:
    "Hi there! Monther is a Software Engineer with 3+ years of experience in full-stack development and AI integration. How can I help you?",
  hi: "Hi there! Monther is a Software Engineer with 3+ years of experience in full-stack development and AI integration. How can I help you?",
  skills:
    "Monther's core skills include: React, Next.js, TypeScript, Node.js, Python, Flutter, PostgreSQL, Docker, and AI/ML integration. He specializes in building scalable, production-ready systems.",
  experience:
    "Monther has 3+ years of experience. He currently works as a Senior Full-Stack Engineer (Freelance/Contract) since 2022, and previously worked at a Tech Startup (2020-2022) building core product features for SaaS platforms.",
  projects:
    "Monther has delivered 20+ projects including: Cachear POS (enterprise mobile POS), HeicConverter (privacy-first image conversion), University Scheduler (AI-powered), NextVendors (e-commerce platform), Kayany7 (business management), and AI Tools Hub (orchestration platform).",
  contact:
    "You can reach Monther at montheralhamadi7@gmail.com. He's available for freelance projects and remote work globally.",
  default:
    "I'm not sure about that. Feel free to ask about Monther's skills, experience, projects, or how to contact him!",
};

const RESPONSES_AR: Record<string, string> = {
  مرحبا:
    "مرحباً! منذر هو مهندس برمجيات مع أكثر من 3+ سنوات من الخبرة في التطوير الشامل ودمج الذكاء الاصطناعي. كيف يمكنني مساعدتك؟",
  اهلا: "مرحباً! منذر هو مهندس برمجيات مع أكثر من 3+ سنوات من الخبرة في التطوير الشامل ودمج الذكاء الاصطناعي. كيف يمكنني مساعدتك؟",
  المهارات:
    "تشمل مهارات منذر الأساسية: React، Next.js، TypeScript، Node.js، Python، Flutter، PostgreSQL، Docker، ودمج الذكاء الاصطناعي. يتخصص في بناء أنظمة قابلة للتوسع وجاهزة للإنتاج.",
  الخبرات:
    "لدى منذر أكثر من 3+ سنوات من الخبرة. يعمل حالياً كمهندس برمجيات أول (عمل حر) منذ 2022، وعمل سابقاً في شركة تقنية ناشئة (2020-2022) لبناء ميزات المنتج الأساسية لمنصات SaaS.",
  المشاريع:
    "قدم منذر أكثر من 20 مشروعاً منها: Cachear POS (نظام نقاط بيع مؤسسي)، HeicConverter (تحويل الصور مع خصوصية)، University Scheduler (جدولة ذكية)، NextVendors (تجارة إلكترونية)، Kayany7 (إدارة أعمال)، و AI Tools Hub.",
  تواصل:
    "يمكنك التواصل مع منذر على montheralhamadi7@gmail.com. وهو متاح لمشاريع العمل الحر والعمل عن بعد عالمياً.",
  default:
    "لست متأكداً من ذلك. اسأل عن مهارات منذر، خبراته، مشاريعه، أو كيفية التواصل معه!",
};

function getFallbackResponse(input: string, language: Language): string {
  const responses = language === "ar" ? RESPONSES_AR : RESPONSES_EN;
  const lower = input.toLowerCase().trim();
  for (const [key, value] of Object.entries(responses)) {
    if (lower.includes(key)) return value;
  }
  return responses["default"];
}

export async function askAssistant(
  question: string,
  language: Language,
): Promise<string> {
  // Try Gemini first
  if (GEMINI_API_KEY) {
    try {
      const response = await askGemini(question, language);
      return response;
    } catch (error) {
      console.warn("Gemini API error, trying Grok:", error);
    }
  }

  // Try Grok as fallback
  if (GROK_API_KEY) {
    try {
      const response = await askGrok(question, language);
      return response;
    } catch (error) {
      console.warn("Grok API error, using static responses:", error);
    }
  }

  // Final fallback to static responses
  return getFallbackResponse(question, language);
}
