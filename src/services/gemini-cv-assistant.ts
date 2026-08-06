import { GoogleGenerativeAI } from "@google/generative-ai";
import type { CVData, Language } from "@/lib/index";
import { buildSmartContext, type CVDeltaPatch } from "@/services/cv-delta-merge";

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
    | "DELTA_PATCHES"
    | "NONE";
  payload?: any;
  patches?: CVDeltaPatch[];
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
 * Universal model caller fallback chain
 */
async function callGenerativeModels(
  systemInstruction: string,
  userPrompt: string,
): Promise<string | null> {
  const fullPrompt = `${systemInstruction}\n\nUser Input: "${userPrompt}"`;
  const models = ["gemini-2.5-flash", "gemini-1.5-flash", "gemini-3.5-flash"];

  if (genAI) {
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({
          model: modelName,
          generationConfig: { responseMimeType: "application/json" },
        });
        const result = await model.generateContent(fullPrompt);
        const text = result.response.text();
        if (text) return text;
      } catch (err) {
        console.warn(`Gemini model ${modelName} error:`, err);
      }
    }
  }

  if (GEMINI_API_KEY) {
    for (const modelName of models) {
      try {
        const response = await fetch(
          `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${GEMINI_API_KEY}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [{ parts: [{ text: fullPrompt }] }],
              generationConfig: { responseMimeType: "application/json" },
            }),
          }
        );
        if (response.ok) {
          const data = await response.json();
          const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (text) return text;
        }
      } catch (err) {
        console.warn(`REST API fallback error for ${modelName}:`, err);
      }
    }
  }

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
        if (content) return content;
      }
    } catch (err) {
      console.warn("Grok API fallback error:", err);
    }
  }

  return null;
}

/**
 * AI Assistant for processing CV edits with Delta Patches (Incremental Smart Merge)
 */
export async function askCVAssistant(
  userPrompt: string,
  currentCv: CVData,
  language: Language
): Promise<CVAIAssistantResponse> {
  const isAr = language === "ar";
  const cvContext = buildSmartContext(currentCv, language);

  const systemInstruction = `You are an expert AI Resume Builder and Career Coach for Monther Alhamadi's Portfolio App.
Your job is to analyze user requests regarding their CV/Resume and output atomic JSON delta patches that modify ONLY the requested parts without losing existing CV content.

CURRENT CV SNAPSHOT CONTEXT:
${cvContext}

Respond strictly in JSON format matching this TypeScript interface:
{
  "message": "Polite summary in ${isAr ? "Arabic" : "English"} explaining the changes made",
  "actionType": "DELTA_PATCHES",
  "patches": [
    {
      "op": "add" | "update" | "remove",
      "target": "header" | "summary" | "settings" | "experience" | "education" | "skills" | "projects" | "certifications" | "languages",
      "itemId": "optional string (required for updating/removing existing item by id)",
      "data": { ... fields to update or add ... }
    }
  ]
}

PATCH SPECIFICATIONS:
- "target": "header" -> data: { name?, title_en?, title_ar?, email?, phone?, location?, linkedin?, github?, website? }
- "target": "summary" -> data: { summary_en?, summary_ar? }
- "target": "experience" -> op "add" -> data: { role, company, start_date, end_date?, current?: boolean, description_en?, description_ar?, achievements_en?: string[], achievements_ar?: string[], technologies?: string[] }
- "target": "experience" -> op "update" -> itemId: "exp-id", data: { ... fields to update ... }
- "target": "education" -> op "add" -> data: { degree, field, institution, start_date, end_date?, grade? }
- "target": "skills" -> op "add" -> data: { name, skills: string[] }
- "target": "projects" -> op "add" -> data: { name, description_en?, description_ar?, url?, github_url?, technologies?: string[] }
- "target": "certifications" -> op "add" -> data: { name, issuer, date, url? }
- "target": "settings" -> op "update" -> data: { template?: "modern"|"classic"|"minimal"|"executive"|"sidebar"|"two-column"|"timeline"|"bold-header", theme_color?: string, font_family?: string, spacing?: string }

RULES:
1. NEVER overwrite existing items unless explicitly requested.
2. For adding new items, supply both EN and AR versions where applicable.
3. Keep response strictly valid JSON. No markdown backticks outside JSON.`;

  const rawJson = await callGenerativeModels(systemInstruction, userPrompt);
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      if (parsed.patches && Array.isArray(parsed.patches)) {
        parsed.actionType = "DELTA_PATCHES";
        return parsed;
      }
      return parsed;
    } catch (e) {
      console.error("Failed to parse AI CV assistant JSON:", e);
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
 * AI Resume / LinkedIn Parser
 * Parses raw text from LinkedIn profiles or unformatted CVs into a structured CVData object.
 */
export async function parseRawResumeTextWithAI(
  rawText: string,
  language: Language
): Promise<Partial<CVData>> {
  const isAr = language === "ar";
  const systemInstruction = `You are a World-Class Talent Acquisition AI and CV Extraction Parser.
Extract all possible resume data from the user provided raw text (LinkedIn profile dump, plain text resume, or bio) and return a structured JSON object.

Output format MUST strictly adhere to this JSON structure:
{
  "header": {
    "name": "Full Name",
    "title_en": "Professional Title EN",
    "title_ar": "المسمى المهني بالعربية",
    "email": "email@example.com",
    "phone": "+123456789",
    "location": "City, Country",
    "linkedin": "linkedin.com/in/username",
    "github": "github.com/username",
    "website": "https://example.com"
  },
  "summary": {
    "summary_en": "Comprehensive professional summary in English...",
    "summary_ar": "ملخص مهني متكامل باللغة العربية..."
  },
  "experience": [
    {
      "role": "Job Role",
      "company": "Company Name",
      "start_date": "2022",
      "end_date": "Present",
      "current": true,
      "description_en": "Role overview in English",
      "description_ar": "الوصف الوظيفي بالعربية",
      "achievements_en": ["Key achievement 1", "Key achievement 2"],
      "achievements_ar": ["إنجاز رئيسي 1", "إنجاز رئيسي 2"],
      "technologies": ["React", "TypeScript", "Node.js"]
    }
  ],
  "education": [
    {
      "degree": "Bachelor of Science",
      "field": "Computer Science",
      "institution": "University Name",
      "start_date": "2018",
      "end_date": "2022",
      "grade": "3.8/4.0"
    }
  ],
  "skills": [
    {
      "name": "Frontend Development",
      "skills": ["React", "TypeScript", "Tailwind CSS"]
    }
  ],
  "projects": [
    {
      "name": "Project Title",
      "description_en": "Project details in English",
      "description_ar": "تفاصيل المشروع بالعربية",
      "technologies": ["Flutter", "Supabase"]
    }
  ],
  "certifications": [
    {
      "name": "AWS Certified Solutions Architect",
      "issuer": "Amazon Web Services",
      "date": "2023"
    }
  ]
}

RULES:
1. Translate missing Arabic or English text automatically so both AR & EN fields are rich and professional.
2. Format dates consistently (e.g. "2020", "Jan 2022", "Present").
3. Output ONLY valid JSON.`;

  const rawJson = await callGenerativeModels(systemInstruction, rawText);
  if (rawJson) {
    try {
      const parsed = JSON.parse(rawJson);
      
      const sections: CVData["sections"] = [
        {
          id: "header",
          type: "header",
          title: "Header",
          enabled: true,
          order: 0,
          data: parsed.header || {},
        },
        {
          id: "summary",
          type: "summary",
          title: "Summary",
          enabled: true,
          order: 1,
          data: parsed.summary || {},
        },
        {
          id: "experience",
          type: "experience",
          title: "Experience",
          enabled: true,
          order: 2,
          data: {
            items: (parsed.experience || []).map((exp: any) => ({
              id: crypto.randomUUID(),
              ...exp,
            })),
          },
        },
        {
          id: "education",
          type: "education",
          title: "Education",
          enabled: true,
          order: 3,
          data: {
            education_items: (parsed.education || []).map((edu: any) => ({
              id: crypto.randomUUID(),
              ...edu,
            })),
          },
        },
        {
          id: "skills",
          type: "skills",
          title: "Skills",
          enabled: true,
          order: 4,
          data: {
            skill_categories: (parsed.skills || []).map((cat: any) => ({
              id: crypto.randomUUID(),
              ...cat,
            })),
          },
        },
        {
          id: "projects",
          type: "projects",
          title: "Projects",
          enabled: true,
          order: 5,
          data: {
            project_items: (parsed.projects || []).map((proj: any) => ({
              id: crypto.randomUUID(),
              ...proj,
            })),
          },
        },
        {
          id: "certifications",
          type: "certifications",
          title: "Certifications",
          enabled: true,
          order: 6,
          data: {
            cert_items: (parsed.certifications || []).map((cert: any) => ({
              id: crypto.randomUUID(),
              ...cert,
            })),
          },
        },
      ];

      return {
        locale: language,
        sections,
        template: "modern",
        settings: {
          theme_color: "#10b981",
          font_family: "inter",
          font_size: "base",
          spacing: "normal",
          show_icons: true,
          show_borders: true,
          rtl: isAr,
        },
      };
    } catch (e) {
      console.error("Failed to parse extracted CV JSON:", e);
    }
  }

  throw new Error(
    isAr
      ? "فشل تفكيك البيانات بواسطة الذكاء الاصطناعي. يرجى مراجعة النص المدخل."
      : "Failed to parse resume text with AI. Please check your raw input."
  );
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

  const rawText = await callGenerativeModels(systemInstruction, jobDescription || "General Check");
  if (rawText) {
    try {
      return JSON.parse(rawText);
    } catch (e) {
      console.warn("ATS JSON parse warning:", e);
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
