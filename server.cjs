var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// server.ts
var import_express = __toESM(require("express"), 1);
var import_path = __toESM(require("path"), 1);
var import_vite = require("vite");
var import_genai = require("@google/genai");
var import_dotenv = __toESM(require("dotenv"), 1);
import_dotenv.default.config();
var app = (0, import_express.default)();
var PORT = Number(process.env.PORT || 3e3);
app.use(import_express.default.json({ limit: "10mb" }));
var ai = null;
function getGeminiClient() {
  if (!ai) {
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY is not set. Gemini API calls will run in fallback intelligent simulation mode.");
    }
    ai = new import_genai.GoogleGenAI({ apiKey: apiKey || "MOCK_KEY" });
  }
  return ai;
}
var SYSTEM_PROMPT = `
You are MediGuide AI, an intelligent, empathetic, evidence-based healthcare assistant specifically designed for patients and medical care in India.
Your goal is to provide accurate, easy-to-understand health information, explain medical terms and diagnostic reports, discuss symptoms, suggest ICMR-aligned preventive care, and clarify medicine guidelines and generic brand alternatives (e.g. Cipla, Sun Pharma, Mankind, Dolo, Glycomet).

CRITICAL SAFETY & MEDICAL RULES:
1. Always maintain an empathetic, reassuring, professional tone tailored to the Indian medical ecosystem.
2. If the user presents severe red-flag emergency symptoms (e.g. sudden severe chest pain, shortness of breath, sudden facial drooping or weakness, uncontrolled bleeding, severe head trauma, high fever with stiff neck, acute suicidal thoughts), immediately flag this as an EMERGENCY and start your response with a clear warning advising them to call Indian Emergency Services (112 / 102 / 108) or seek immediate emergency room care at the nearest hospital (e.g., AIIMS, Fortis, Apollo, Max).
3. Always express monetary values and cost estimates in Indian Rupees (\u20B9 INR).
4. Explicitly clarify that you are an AI assistant and do NOT replace a licensed Indian healthcare professional, doctor, or clinical diagnosis.
5. Provide structured, readable answers using clear markdown headers, bullet points, and actionable tips.
6. Offer relevant follow-up suggestions or questions they can ask their doctor.
`;
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "MediGuide AI Backend", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.post("/api/ai/chat", async (req, res) => {
  try {
    const { message, history = [], patientProfile } = req.body;
    if (!message || typeof message !== "string") {
      return res.status(400).json({ error: "Message is required." });
    }
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
    const emergencyKeywords = [
      "chest pain",
      "can't breathe",
      "cannot breathe",
      "shortness of breath",
      "stroke",
      "slurred speech",
      "face drooping",
      "unconscious",
      "seizure",
      "severe bleeding",
      "coughing blood",
      "stiff neck fever",
      "heart attack"
    ];
    const isEmergencyPrompt = emergencyKeywords.some((kw) => message.toLowerCase().includes(kw));
    if (!apiKey || apiKey === "MY_GEMINI_API_KEY") {
      let reply = "";
      if (isEmergencyPrompt) {
        reply = `\u26A0\uFE0F **EMERGENCY WARNING**

The symptoms you mentioned (such as chest pain or breathing difficulty) can indicate a critical medical emergency. **Please call emergency services in India (112 / 102 / 108) or go to the nearest emergency casualty ward immediately.**

While waiting for medical help:
- Sit comfortably and stay calm.
- Do not ingest food or heavy fluids.
- Have someone stay with you if possible.

*Disclaimer: MediGuide AI is an educational assistant and cannot replace emergency medical care.*`;
      } else if (message.toLowerCase().includes("headache") || message.toLowerCase().includes("migraine")) {
        reply = `### Understanding Headaches & Relief Guidance

Headaches can stem from stress, dehydration, lack of sleep, eye strain, or sinus pressure.

#### Recommended Steps:
- **Hydrate:** Drink 1-2 glasses of water.
- **Rest:** Lie down in a dark, quiet room with cool compression on your forehead.
- **Reduce Strain:** Limit screen time on phones and computers.
- **Consultation:** If headaches are unusually severe, sudden ("thunderclap"), or paired with vision changes, consult a physician promptly.`;
      } else {
        reply = `Hello! I am **MediGuide AI**, your intelligent healthcare assistant.

Based on your query regarding "${message}", here is evidence-based guidance:

1. **General Care:** Ensure proper rest, balanced nutrition, and hydration.
2. **Monitoring:** Track any changing symptoms, duration, and pain severity.
3. **When to see a Doctor:** Schedule an appointment if symptoms persist for more than 48-72 hours or worsen.

*Note: MediGuide AI provides health information for educational purposes. Always consult a licensed physician for diagnosis and treatments.*`;
      }
      return res.json({
        reply,
        emergencyWarning: isEmergencyPrompt,
        timestamp: (/* @__PURE__ */ new Date()).toISOString()
      });
    }
    const gemini = getGeminiClient();
    let contextStr = "";
    if (patientProfile) {
      contextStr = `
Patient Context: Age ${patientProfile.age || "N/A"}, Gender ${patientProfile.gender || "N/A"}, Existing Conditions: ${patientProfile.existingDiseases || "None listed"}, Allergies: ${patientProfile.allergies || "None listed"}.`;
    }
    const fullPrompt = `${SYSTEM_PROMPT}${contextStr}

User Question: ${message}`;
    const response = await gemini.models.generateContent({
      model: "gemini-3.6-flash",
      contents: fullPrompt
    });
    const replyText = response.text || "I apologize, but I could not generate a response at this moment. Please try again.";
    return res.json({
      reply: replyText,
      emergencyWarning: isEmergencyPrompt || replyText.includes("EMERGENCY") || replyText.includes("911"),
      timestamp: (/* @__PURE__ */ new Date()).toISOString()
    });
  } catch (err) {
    console.error("Gemini Chat API Error:", err);
    res.status(500).json({
      error: "Failed to generate AI response.",
      message: err.message || "Internal server error"
    });
  }
});
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
  } catch (err) {
    console.error("Report Analysis Error:", err);
    return res.status(500).json({ error: "Failed to analyze medical report." });
  }
});
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
  } catch (err) {
    console.error("Symptom Checker Error:", err);
    return res.status(500).json({ error: "Failed to process symptom analysis." });
  }
});
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await (0, import_vite.createServer)({
      server: { middlewareMode: true },
      appType: "spa"
    });
    app.use(vite.middlewares);
  } else {
    const distPath = import_path.default.join(process.cwd(), "dist");
    app.use(import_express.default.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(import_path.default.join(distPath, "index.html"));
    });
  }
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`MediGuide AI Server running on http://0.0.0.0:${PORT}`);
  });
}
startServer();
//# sourceMappingURL=server.cjs.map
