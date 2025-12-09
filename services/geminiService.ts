import { GoogleGenAI, Type, SchemaType } from "@google/genai";
import { FixResult } from "../types";

// Initialize Gemini AI client
// Note: We use process.env.API_KEY as per instructions.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeAndFixCode = async (
  code: string,
  errorLog: string
): Promise<FixResult> => {
  const modelId = "gemini-3-pro-preview"; // Using Pro for complex coding tasks

  const prompt = `
    File Code:
    ${code}

    Error Log:
    ${errorLog}
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        systemInstruction: "You are an expert debugger. Analyze the code and the error. Return a JSON object with two keys: fixedCode (the full corrected code string, maintaining original indentation where possible) and explanation (a short summary of what you fixed). Do not include markdown code blocks in the fixedCode string, just the raw code.",
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            fixedCode: {
              type: Type.STRING,
              description: "The complete fixed source code.",
            },
            explanation: {
              type: Type.STRING,
              description: "A concise explanation of the bug and the fix.",
            },
          },
          required: ["fixedCode", "explanation"],
        },
      },
    });

    const responseText = response.text;
    if (!responseText) {
      throw new Error("Empty response from Gemini");
    }

    const result = JSON.parse(responseText) as FixResult;
    return result;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to analyze code. Please check your API key and try again.");
  }
};