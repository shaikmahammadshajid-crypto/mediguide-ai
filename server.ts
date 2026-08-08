import express from "express";
import path from "path";
import { randomUUID } from "crypto";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT || 3000);

app.use(express.json({ limit: "10mb" }));

type SecureShareEntry = {
  encrypted: string;
  iv: string;
  expiresAt: number;
  createdAt: string;
};

const secureShares = new Map<string, SecureShareEntry>();

function pruneExpiredShares() {
  const now = Date.now();
  for (const [token, share] of secureShares.entries()) {
    if (share.expiresAt <= now) {
      secureShares.delete(token);
    }
  }
}

// Initialize Gemini Client safely
let ai: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Gemini API calls will run in fallback intelligent simulation mode.");
    }
    ai = new GoogleGenAI({ apiKey: apiKey || "MOCK_KEY" });
  }
  return ai;
}

// System Prompts for MediGuide AI
const SYSTEM_PROMPT = `
You are MediGuide AI, an intelligent, empathetic, evidence-based healthcare assistant specifically designed for patients and medical care in India.
Your goal is to provide accurate, easy-to-understand health information, explain medical terms and diagnostic reports, discuss symptoms, suggest ICMR-aligned preventive care, and clarify medicine guidelines and generic brand alternatives (e.g. Cipla, Sun Pharma, Mankind, Dolo, Glycomet).

CRITICAL SAFETY & MEDICAL RULES:
1. Always maintain an empathetic, reassuring, professional tone tailored to the Indian medical ecosystem.
2. If the user presents severe red-flag emergency symptoms (e.g. sudden severe chest pain, shortness of breath, sudden facial drooping or weakness, uncontrolled bleeding, severe head trauma, high fever with stiff neck, acute suicidal thoughts), immediately flag this as an EMERGENCY and start your response with a clear warning advising them to call Indian Emergency Services (112 / 102 / 108) or seek immediate emergency room care at the nearest hospital (e.g., AIIMS, Fortis, Apollo, Max).
3. Always express monetary values and cost estimates in Indian Rupees (₹ INR).
4. Explicitly clarify that you are an AI assistant and do NOT replace a licensed Indian healthcare professional, doctor, or clinical diagnosis.
5. Provide structured, readable answers using clear markdown headers, bullet points, and actionable tips.
6. Offer relevant follow-up suggestions or questions they can ask their doctor.
`;

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "MediGuide AI Backend", timestamp: new Date().toISOString() });
});

app.post("/api/secure-shares", (req, res) => {
  const { encrypted, iv, expiresInDays = 30 } = req.body;
  if (!encrypted || !iv || typeof encrypted !== "string" || typeof iv !== "string") {
    return res.status(400).json({ error: "Encrypted payload and IV are required." });
  }

  pruneExpiredShares();
  const token = randomUUID().replace(/-/g, "").slice(0, 18);
  const expiresAt = Date.now() + Math.min(Math.max(Number(expiresInDays) || 30, 1), 30) * 24 * 60 * 60 * 1000;
  secureShares.set(token, {
    encrypted,
    iv,
    expiresAt,
    createdAt: new Date().toISOString()
  });

  res.json({ token, expiresAt: new Date(expiresAt).toISOString() });
});

app.get("/api/secure-shares/:token", (req, res) => {
  pruneExpiredShares();
  const share = secureShares.get(req.params.token);
  if (!share) {
    return res.status(404).json({ error: "Secure report share was not found or has expired." });
  }

  res.json({
    encrypted: share.encrypted,
    iv: share.iv,
    expiresAt: new Date(share.expiresAt).toISOString(),
    createdAt: share.createdAt
  });
});

// AI Chat Consultation Endpoint
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history = [], patientProfile, language } = req.body;

    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    // Detect emergency terms client-server side check
    const emergencyKeywords = [
      "chest pain", "can't breathe", "cannot breathe", "shortness of breath", 
      "stroke", "slurred speech", "face drooping", "unconscious", "seizure", 
      "severe bleeding", "coughing blood", "stiff neck fever", "heart attack"
    ];

    const isEmergencyPrompt = emergencyKeywords.some(kw => message.toLowerCase().includes(kw));

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      // Fallback medical response if key not configured
      let reply = "";
      if (isEmergencyPrompt) {
        reply = `⚠️ **EMERGENCY WARNING**\n\nThe symptoms you mentioned (such as chest pain or breathing difficulty) can indicate a critical medical emergency. **Please call emergency services in India (112 / 102 / 108) or go to the nearest emergency casualty ward immediately.**\n\nWhile waiting for medical help:\n- Sit comfortably and stay calm.\n- Do not ingest food or heavy fluids.\n- Have someone stay with you if possible.\n\n*Disclaimer: MediGuide AI is an educational assistant and cannot replace emergency medical care.*`;
      } else if (message.toLowerCase().includes("headache") || message.toLowerCase().includes("migraine")) {
        reply = `### Understanding Headaches & Relief Guidance\n\nHeadaches can stem from stress, dehydration, lack of sleep, eye strain, or sinus pressure.\n\n#### Recommended Steps:\n- **Hydrate:** Drink 1-2 glasses of water.\n- **Rest:** Lie down in a dark, quiet room with cool compression on your forehead.\n- **Reduce Strain:** Limit screen time on phones and computers.\n- **Consultation:** If headaches are unusually severe, sudden ("thunderclap"), or paired with vision changes, consult a physician promptly.`;
      } else {
        reply = `Hello! I am **MediGuide AI**, your intelligent healthcare assistant.\n\nBased on your query regarding "${message}", here is evidence-based guidance:\n\n1. **General Care:** Ensure proper rest, balanced nutrition, and hydration.\n2. **Monitoring:** Track any changing symptoms, duration, and pain severity.\n3. **When to see a Doctor:** Schedule an appointment if symptoms persist for more than 48-72 hours or worsen.\n\n*Note: MediGuide AI provides health information for educational purposes. Always consult a licensed physician for diagnosis and treatments.*`;
      }

      if (language && language !== "en-IN") {
        reply += `\n\nVoice language selected: ${language}. Configure GEMINI_API_KEY for full translated medical responses in this language.`;
      }

      return res.json({
        reply,
        emergencyWarning: isEmergencyPrompt,
        timestamp: new Date().toISOString()
      });
    }

    // Call Gemini API
    const gemini = getGeminiClient();
    
    // Build context string from patient profile if available
    let contextStr = "";
    if (patientProfile) {
      contextStr = `\nPatient Context: Age ${patientProfile.age || "N/A"}, Gender ${patientProfile.gender || "N/A"}, Existing Conditions: ${patientProfile.existingDiseases || "None listed"}, Allergies: ${patientProfile.allergies || "None listed"}.`;
    }

    const languageInstruction = language
      ? `\nRespond in the user's selected language/locale (${language}) while keeping medical emergency numbers and medicine names clear. If a medical term is hard to translate, include the English term in parentheses.`
      : "";

    const fullPrompt = `${SYSTEM_PROMPT}${contextStr}${languageInstruction}\n\nUser Question: ${message}`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt,
    });

    const replyText = response.text || "I apologize, but I could not generate a response at this moment. Please try again.";

    return res.json({
      reply: replyText,
      emergencyWarning: isEmergencyPrompt || replyText.includes("EMERGENCY") || replyText.includes("911"),
      timestamp: new Date().toISOString()
    });

  } catch (err: any) {
    console.error("Gemini Chat API Error:", err);
    res.status(500).json({
      error: "Failed to generate AI response.",
      message: err.message || "Internal server error"
    });
  }
});

// AI Medical Report Explainer Endpoint
app.post("/api/ai/analyze-report", async (req, res) => {
  try {
    const { reportTitle, reportType, reportText, keyValues } = req.body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.json({
        summary: `The provided report (${reportTitle || reportType || "Medical Lab Report"}) shows general health markers. High WBC or Hemoglobin flags should be reviewed with your primary care physician to verify context.`,
        keyFindings: [
          "Overall parameters within standard reference ranges",
          "Hydration and electrolyte levels appear balanced",
          "Follow up with ordering doctor for final clinical correlation"
        ],
        questionsForDoctor: [
          "What do these specific test levels mean for my overall health?",
          "Are any follow-up tests or re-checks needed in 3-6 months?",
          "Should I adjust any dietary habits or current medications?"
        ],
        urgency: "Routine"
      });
    }

    const gemini = getGeminiClient();
    const prompt = `You are MediGuide AI report analyzer. Analyze the following medical report details in plain language that a patient can easily understand.
    Report Title: ${reportTitle || "Medical Test"}
    Report Type: ${reportType || "General Lab"}
    Report Details / Text: ${reportText || keyValues || "No details provided"}

    Provide a JSON response strictly formatted as:
    {
      "summary": "Plain English overall explanation (2-3 sentences)",
      "keyFindings": ["Point 1", "Point 2", "Point 3"],
      "questionsForDoctor": ["Question 1", "Question 2"],
      "urgency": "Routine" | "Attention Recommended" | "Urgent Doctor Visit Required"
    }`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);

  } catch (err: any) {
    console.error("Report Analysis Error:", err);
    return res.status(500).json({ error: "Failed to analyze medical report." });
  }
});

// AI Symptom Checker Endpoint
app.post("/api/ai/symptom-checker", async (req, res) => {
  try {
    const { symptoms, duration, severity, age, gender } = req.body;

    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;

    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      return res.json({
        urgency: severity === "High" ? "Urgent Care" : "Routine Consultation",
        potentialConditions: [
          { name: "Viral Upper Respiratory Infection", likelihood: "High", explanation: "Common causes include rhinovirus or influenza, usually resolving with rest and fluids." },
          { name: "Seasonal Allergies", likelihood: "Moderate", explanation: "Environmental triggers causing mild inflammation and discomfort." }
        ],
        selfCareTips: ["Rest adequately", "Stay well hydrated", "Monitor temperature twice daily"],
        whenToSeekEmergency: "Seek immediate emergency room care if you experience severe shortness of breath, confusion, or chest pain."
      });
    }

    const gemini = getGeminiClient();
    const prompt = `Analyze symptoms for an educational symptom checker tool.
    Symptoms: ${symptoms}
    Duration: ${duration || "Recent"}
    Severity: ${severity || "Moderate"}
    Patient Age: ${age || "Adult"}, Gender: ${gender || "Unspecified"}

    Return JSON with:
    {
      "urgency": "Self Care" | "Routine Consultation" | "Urgent Care" | "Emergency",
      "potentialConditions": [
        {"name": "Condition name", "likelihood": "High/Moderate/Low", "explanation": "Brief reasoning"}
      ],
      "selfCareTips": ["Tip 1", "Tip 2"],
      "whenToSeekEmergency": "Clear warning signs"
    }`;

    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json"
      }
    });

    const parsed = JSON.parse(response.text || "{}");
    return res.json(parsed);

  } catch (err: any) {
    console.error("Symptom Checker Error:", err);
    return res.status(500).json({ error: "Failed to process symptom analysis." });
  }
});

// Vite Middleware & Production Handler
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediGuide AI Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
