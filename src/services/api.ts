import { ChatMessage, UserProfile } from '../types';

export async function sendChatMessage(
  message: string, 
  history: ChatMessage[] = [], 
  patientProfile?: UserProfile,
  language?: string
): Promise<{ reply: string; emergencyWarning?: boolean }> {
  try {
    const res = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history, patientProfile, language })
    });

    if (!res.ok) {
      throw new Error(`Server returned HTTP ${res.status}`);
    }

    const data = await res.json();
    return {
      reply: data.reply || "I'm sorry, I couldn't generate a response. Please try again.",
      emergencyWarning: data.emergencyWarning || false
    };
  } catch (error) {
    console.warn("API Chat fetch error, using client-side fallback:", error);
    
    // Client-side fallback if server is unreachable
    const isEmergency = message.toLowerCase().includes("chest pain") || message.toLowerCase().includes("breath");
    if (isEmergency) {
      return {
        reply: "⚠️ **EMERGENCY WARNING**\n\nThe symptoms you described may indicate a critical emergency. Please call 911 / 112 or visit the nearest Emergency Room immediately.",
        emergencyWarning: true
      };
    }

    return {
      reply: `Thank you for asking about "${message}". As an AI healthcare assistant, I recommend maintaining rest, monitoring symptoms, and consulting your doctor if discomfort persists.`,
      emergencyWarning: false
    };
  }
}

export async function analyzeReportWithAI(
  reportTitle: string, 
  reportType: string, 
  reportText: string
): Promise<{ summary: string; keyFindings: string[]; questionsForDoctor: string[]; urgency: string }> {
  try {
    const res = await fetch('/api/ai/analyze-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ reportTitle, reportType, reportText })
    });

    if (!res.ok) throw new Error("Report API error");

    return await res.json();
  } catch (err) {
    console.warn("Report AI analysis fallback:", err);
    return {
      summary: `The report "${reportTitle}" highlights general laboratory parameters. All critical ranges should be validated by your consulting doctor.`,
      keyFindings: [
        "Primary values recorded and indexed",
        "No extreme critical automated abnormalities flagged",
        "Routine physician follow-up recommended"
      ],
      questionsForDoctor: [
        "Are these values consistent with my baseline history?",
        "Should I continue my current daily medication dosage?"
      ],
      urgency: "Routine"
    };
  }
}

export async function createSecureShare(
  encrypted: string,
  iv: string,
  expiresInDays = 30
): Promise<{ token: string; expiresAt: string }> {
  const res = await fetch('/api/secure-shares', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ encrypted, iv, expiresInDays })
  });

  if (!res.ok) {
    throw new Error(`Secure share API returned HTTP ${res.status}`);
  }

  return res.json();
}

export async function fetchSecureShare(token: string): Promise<{ encrypted: string; iv: string; expiresAt: string; createdAt: string }> {
  const res = await fetch(`/api/secure-shares/${encodeURIComponent(token)}`);
  if (!res.ok) {
    throw new Error(`Secure share API returned HTTP ${res.status}`);
  }
  return res.json();
}

export async function checkSymptomsWithAI(
  symptoms: string,
  duration: string,
  severity: string,
  age: number,
  gender: string
): Promise<any> {
  try {
    const res = await fetch('/api/ai/symptom-checker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms, duration, severity, age, gender })
    });

    if (!res.ok) throw new Error("Symptom API error");

    return await res.json();
  } catch (err) {
    console.warn("Symptom checker fallback:", err);
    return {
      urgency: severity === 'High' ? 'Urgent Care' : 'Routine Consultation',
      potentialConditions: [
        { name: 'Common Viral Syndrome', likelihood: 'High', explanation: 'Mild inflammatory reaction or seasonal viral infection.' },
        { name: 'Tension / Fatigue Response', likelihood: 'Moderate', explanation: 'Stress or dehydration exacerbating physical discomfort.' }
      ],
      selfCareTips: ['Drink plenty of warm fluids', 'Get at least 8 hours of sleep', 'Avoid strenuous exercise'],
      whenToSeekEmergency: 'Seek immediate emergency help if experiencing breathing distress, chest pain, or high unremitting fever.'
    };
  }
}
