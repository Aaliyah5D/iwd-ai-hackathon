import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export async function generateGuardianTips(helpType: string) {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You're a trauma-informed counselor. A student has just accepted a help request for "${helpType}" on a campus safety app. 
      Provide 5 concise, compassionate tips for the guardian. Focus on:
      - Preserving the requester's dignity
      - De-escalation techniques
      - When to involve professional help
      - Cultural sensitivity for South African context
      
      Format as a bulleted list, max 15 words per tip.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error generating tips:", error);
    return "Stay calm, be compassionate, and respect the student's privacy.";
  }
}
