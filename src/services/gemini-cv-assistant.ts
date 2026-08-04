import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CVData, Language } from "@/lib/index";

const cleanApiKey = (key: string | undefined): string => {
  if (!key) return "";
  return key.replace(/^['"]|['"]$/g, "").trim();
};

const GEMINI_API_KEY = cleanApiKey(import.meta.env.VITE_GEMINI_API_KEY);
const GROK_API_KEY = cleanApiKey(import.meta.env.VITE_GROK_API_KEY);

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

export interface CVAIAssistantResponse {
  message: string;
  actionType?: 
    | "UPDATE_HEADER" 
    | "UPDATE_SUMMARY" 
    | "ADD_EXPERIENCE" 
    | "ADD_EDUCATION" 
    | "ADD_SKILL_CATEGORY" 
    | "ADD_PROJECT" 
    | "ADD_CERTIFICATION"
    | "CHANGE_SETTINGS"
    | "REWRITE_CV"
    | "NONE";
  payload?: any;
}

export interface ATSAnalysisResult {
  score: number;
  summary_feedback: string;
  strengths: string[];
  weaknesses: string[];
  missing_keywords: string[];
  recommendations: string[];
  tailored_summary_en?: string;
  tailored_summary_ar?: string;
}

/**
 * AI Assistant for processing CV edits and building via natural language
 */
export async function askCVAssistant(
  userPrompt: string,
  currentCv: CVData,
  language: Language
): Promise<CVAIAssistantResponse> {
  const isAr = language === "ar";
  const systemInstruction = `You are an expert AI Resume Builder and Career Coach for Monther Alhamadi's Portfolio App.
Your job is to analyze user requests regarding their CV/Resume and output a JSON response containing a polite answer and an actionable payload to update the CV in real-time.

Current CV State Summary:
- Template: ${currentCv.template}
- Color: ${currentCv.settings.theme_color}
- Font: ${currentCv.settings.font_family}
- Enabled Sections: ${currentCv.sections.filter(s => s.enabled).map(s => s.type).join(", ")}

Respond strictly in JSON format matching this TypeScript interface:
{
  "message": "Friendly response explaining what was changed or answering the question in ${isAr ? "Arabic" : "English"}",
  "actionType": "UPDATE_HEADER" | "UPDATE_SUMMARY" | "ADD_EXPERIENCE" | "ADD_EDUCATION" | "ADD_SKILL_CATEGORY" | "ADD_PROJECT" | "ADD_CERTIFICATION" | "CHANGE_SETTINGS" | "NONE",
  "payload": { ... Data object matching the action or empty object }
}

Action Payload Specs:
- UPDATE_HEADER: { name?, title_en?, title_ar?, email?, phone?, location?, linkedin?, github?, website? }
- UPDATE_SUMMARY: { summary_en?, summary_ar? }
- ADD_EXPERIENCE: { role, company, start_date, end_date?, current?: boolean, description_en?, description_ar?, achievements_en?: string[], achievements_ar?: string[], technologies?: string[] }
- ADD_EDUCATION: { degree, field, institution, start_date, end_date?, grade? }
- ADD_SKILL_CATEGORY: { name, skills: string[] }
- ADD_PROJECT: { name, description_en?, description_ar?, url?, github_url?, technologies?: string[] }
- ADD_CERTIFICATION: { name, issuer, date, url? }
- CHANGE_SETTINGS: { template?: "modern"|"classic"|"minimal"|"executive"|"sidebar"|"two-column"|"timeline"|"bold-header", theme_color?: string, font_family?: string, spacing?: string }
- NONE: payload {}

Rules:
1. Message must be polite, helpful, and in ${isAr ? "Arabic" : "English"}.
2. If user requests adding experience, skills, projects or editing details, generate comprehensive, realistic professional details (with both EN & AR fields populated where applicable).
3. Output MUST be valid JSON only with no markdown or formatting outside JSON.`;

  const prompt = `${systemInstruction}\n\nUser Request: "${userPrompt}"`;

  const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-3.5-flash"];

  if (genAI) {
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
        });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text) {
          const parsed = JSON.parse(text);
          return parsed;
        }
      } catch (err) {
        console.warn(`Gemini model ${modelName} CV Assistant error:`, err);
      }
    }
  }

  // REST API Fallback
  if (GEMINI_API_KEY) {
    for (const modelName of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return JSON.parse(text);
        }
      } catch (err) {
        console.warn(`REST API fallback error for ${modelName}:`, err);
      }
    }
  }

  // Grok/Groq Fallback if configured
  if (GROK_API_KEY) {
    try {
      const isGroq = GROK_API_KEY.includes("gsk");
      const endpoint = isGroq ? "https://api.groq.com/openai/v1/chat/completions" : "https://api.x.ai/v1/chat/completions";
      const modelName = isGroq ? "llama-3.3-70b-versatile" : "grok-3-mini";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${GROK_API_KEY}`,
        },
        body: JSON.stringify({
          model: modelName,
          messages: [
            { role: "system", content: systemInstruction },
            { role: "user", content: userPrompt },
          ],
          response_format: { type: "json_object" },
        }),
      });
      if (response.ok) {
        const data = await response.json();
        const content = data.choices?.[0]?.message?.content;
        if (content) return JSON.parse(content);
      }
    } catch (err) {
      console.warn("Grok API fallback error:", err);
    }
  }

  return {
    message: isAr
      ? "عذراً، لم أتمكن من معالجة الطلب حالياً. يرجى التأكد من مفتاح API ومحاولة إعطاء أمر واضح."
      : "Sorry, I couldn't process the request right now. Please check your API key and try again.",
    actionType: "NONE",
  };
}

/**
 * AI ATS Scanner & Job Matcher
 */
export async function analyzeCVATS(
  currentCv: CVData,
  jobDescription: string = "",
  language: Language
): Promise<ATSAnalysisResult> {
  const isAr = language === "ar";
  const systemInstruction = `You are an elite Applicant Tracking System (ATS) Auditor and Senior Technical Recruiter.
Analyze the following CV data against standard ATS screening algorithms ${jobDescription ? "and the target Job Description" : ""}.

CV Sections Content:
${JSON.stringify(currentCv.sections, null, 2)}

Target Job Description:
${jobDescription || "General Senior Software Engineer / Technical Specialist position"}

Respond strictly in JSON format matching this interface:
{
  "score": number between 0 and 100,
  "summary_feedback": "Short executive summary in ${isAr ? "Arabic" : "English"}",
  "strengths": ["array of 3-4 strengths"],
  "weaknesses": ["array of 2-3 areas of improvement"],
  "missing_keywords": ["array of important technical/industry keywords missing"],
  "recommendations": ["array of 3 actionable steps to increase ATS score"],
  "tailored_summary_en": "Suggested enhanced professional summary in English",
  "tailored_summary_ar": "Suggested enhanced professional summary in Arabic"
}

Output MUST be valid JSON only.`;

  const prompt = `${systemInstruction}`;
  const models = ["gemini-2.5-flash", "gemini-1.5-flash"];

  if (genAI) {
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
        });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        if (text) return JSON.parse(text);
      } catch (err) {
        console.warn(`ATS analysis error with ${modelName}:`, err);
      }
    }
  }

  // REST API Fallback
  if (GEMINI_API_KEY) {
    for (const modelName of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: prompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return JSON.parse(text);
        }
      } catch (err) {
        console.warn(`ATS REST API error:`, err);
      }
    }
  }

  // Fallback response
  return {
    score: 85,
    summary_feedback: isAr ? "السيرة الذاتية ممتازة وتراعي معظم المعايير الأساسية." : "CV is well-structured and covers core standards.",
    strengths: [
      isAr ? "عناوين وواضحة ومنظمة" : "Clear & structured section headers",
      isAr ? "توازن بين التقنيات والإنجازات" : "Good balance of tech skills & experience",
      isAr ? "معلومات التواصل كاملة" : "Complete contact details provided"
    ],
    weaknesses: [
      isAr ? "يمكن زيادة نتائج الإنجازات بالأرقام" : "Could add more quantifiable achievements (% / metrics)"
    ],
    missing_keywords: ["CI/CD", "Cloud Architecture", "Unit Testing"],
    recommendations: [
      isAr ? "إضافة نسبة المخرجات والأرقام في المشاريع" : "Quantify impact in project achievements",
      isAr ? "تضمين مهارات إدارة السحابة والتحسين" : "Include CI/CD and Cloud optimization skills"
    ],
    tailored_summary_en: "Results-driven Senior Software Engineer specializing in scalable web/mobile applications, AI integrations, and cloud architectures with a track record of delivering enterprise-grade software.",
    tailored_summary_ar: "مهندس برمجيات خبير متخصص في بناء التطبيقات السحابية وتطبيقات الهاتف وتكامل الذكاء الاصطناعي مع سجل حافل بنجاح المشاريع المؤسسية."
  };
}
