import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const generateSummary = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Summarize the following text for a student. Use bullet points and highlight key concepts: \n\n${text}`,
  });
  return response.text;
};

export const generateQuiz = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate a quiz with 5 multiple-choice questions based on the following text. Return the response in JSON format. \n\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            question: { type: Type.STRING },
            options: { type: Type.ARRAY, items: { type: Type.STRING } },
            answer: { type: Type.STRING },
            explanation: { type: Type.STRING },
          },
          required: ["question", "options", "answer", "explanation"],
        },
      },
    },
  });
  return JSON.parse(response.text);
};

export const generateFlashcards = async (text: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Generate 5 flashcards (front and back) based on the following text. Return the response in JSON format. \n\n${text}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            front: { type: Type.STRING },
            back: { type: Type.STRING },
          },
          required: ["front", "back"],
        },
      },
    },
  });
  return JSON.parse(response.text);
};

export const chatWithAI = async (message: string, history: { role: string; parts: { text: string }[] }[]) => {
  const chat = ai.chats.create({
    model: "gemini-3-flash-preview",
    config: {
      systemInstruction: "You are a helpful study assistant. Help students understand complex topics, solve problems, and provide study tips.",
    },
  });

  // We can't pass history directly to sendMessage, so we'll use generateContent for simplicity or manage history manually
  // For now, let's use generateContent with the full context
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [...history, { role: "user", parts: [{ text: message }] }],
  });
  return response.text;
};
