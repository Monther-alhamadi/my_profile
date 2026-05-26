import { GoogleGenerativeAI } from "@google/generative-ai"
import { PROFILE_STATIC, PROJECTS_EN, PROJECTS_AR } from "@/lib/data-static"
import type { Language } from "@/lib/index"

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

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
${PROJECTS_EN.map(p => `- ${p.number}. ${p.title} (${p.category}): ${p.solution}`).join("\n")}

Technical Skills: React, Next.js, TypeScript, Node.js, Python, Flutter, PostgreSQL, Docker, AI/ML Integration, WebAssembly, PWA, Clean Architecture, BLoC, Drift (SQLite)

Experience: Senior Full-Stack Engineer (Freelance/Contract, 2022-present), Tech Startup (2020-2022)
`

async function askGemini(question: string, language: Language): Promise<string> {
  if (!genAI) throw new Error("Gemini API key not configured")

  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-lite" })
  const lang = language === "ar" ? "Arabic" : "English"

  const prompt = `You are the AI assistant for Monther Alhamadi's portfolio website. You help visitors learn about Monther's skills, experience, projects, and how to contact him.

Here is Monther's profile information:
${profileSummary}

Rules:
- Answer in ${lang} only
- Be concise and professional (2-4 sentences max)
- If asked something outside this context, politely redirect to Monther's relevant skills/projects
- Do not make up information not provided above
- Use natural, conversational language

Visitor question: ${question}`

  const result = await model.generateContent(prompt)
  return result.response.text()
}

const RESPONSES_EN: Record<string, string> = {
  hello: "Hi there! Monther is a Software Engineer with 4+ years of experience in full-stack development and AI integration. How can I help you?",
  hi: "Hi there! Monther is a Software Engineer with 4+ years of experience in full-stack development and AI integration. How can I help you?",
  skills: "Monther's core skills include: React, Next.js, TypeScript, Node.js, Python, Flutter, PostgreSQL, Docker, and AI/ML integration. He specializes in building scalable, production-ready systems.",
  experience: "Monther has 4+ years of experience. He currently works as a Senior Full-Stack Engineer (Freelance/Contract) since 2022, and previously worked at a Tech Startup (2020-2022) building core product features for SaaS platforms.",
  projects: "Monther has delivered 20+ projects including: Cachear POS (enterprise mobile POS), HeicConverter (privacy-first image conversion), University Scheduler (AI-powered), NextVendors (e-commerce platform), Kayany7 (business management), and AI Tools Hub (orchestration platform).",
  contact: "You can reach Monther at montheralhamadi7@gmail.com. He's available for freelance projects and remote work globally.",
  default: "I'm not sure about that. Feel free to ask about Monther's skills, experience, projects, or how to contact him!",
}

const RESPONSES_AR: Record<string, string> = {
  مرحبا: "مرحباً! منذر هو مهندس برمجيات مع أكثر من 4 سنوات من الخبرة في التطوير الشامل ودمج الذكاء الاصطناعي. كيف يمكنني مساعدتك؟",
  اهلا: "مرحباً! منذر هو مهندس برمجيات مع أكثر من 4 سنوات من الخبرة في التطوير الشامل ودمج الذكاء الاصطناعي. كيف يمكنني مساعدتك؟",
  المهارات: "تشمل مهارات منذر الأساسية: React، Next.js، TypeScript، Node.js، Python، Flutter، PostgreSQL، Docker، ودمج الذكاء الاصطناعي. يتخصص في بناء أنظمة قابلة للتوسع وجاهزة للإنتاج.",
  الخبرات: "لدى منذر أكثر من 4 سنوات من الخبرة. يعمل حالياً كمهندس برمجيات أول (عمل حر) منذ 2022، وعمل سابقاً في شركة تقنية ناشئة (2020-2022) لبناء ميزات المنتج الأساسية لمنصات SaaS.",
  المشاريع: "قدم منذر أكثر من 20 مشروعاً منها: Cachear POS (نظام نقاط بيع مؤسسي)، HeicConverter (تحويل الصور مع خصوصية)، University Scheduler (جدولة ذكية)، NextVendors (تجارة إلكترونية)، Kayany7 (إدارة أعمال)، و AI Tools Hub.",
  تواصل: "يمكنك التواصل مع منذر على montheralhamadi7@gmail.com. وهو متاح لمشاريع العمل الحر والعمل عن بعد عالمياً.",
  default: "لست متأكداً من ذلك. اسأل عن مهارات منذر، خبراته، مشاريعه، أو كيفية التواصل معه!",
}

function getFallbackResponse(input: string, language: Language): string {
  const responses = language === "ar" ? RESPONSES_AR : RESPONSES_EN
  const lower = input.toLowerCase().trim()
  for (const [key, value] of Object.entries(responses)) {
    if (lower.includes(key)) return value
  }
  return responses["default"]
}

export async function askAssistant(question: string, language: Language): Promise<string> {
  if (!API_KEY) return getFallbackResponse(question, language)

  try {
    const response = await askGemini(question, language)
    return response
  } catch (error) {
    console.warn("Gemini API error, falling back to static responses:", error)
    return getFallbackResponse(question, language)
  }
}
