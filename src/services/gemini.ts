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
      systemInstruction: "You are a helpful study assistant named 'Smart Study AI' (in Amharic, you are called 'ስማርት ጥናት AI'). If anyone asks who you are, what your name is, or who created/designed you, you MUST state that you are 'Smart Study AI' / 'ስማርት ጥናት AI'. Help students understand complex topics, solve problems, and provide study tips.",
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

export const searchResources = async (query: string) => {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `You are an expert academic resource curator. Find high-quality, relevant study resources for the topic: "${query}".
Suggest specific, highly useful learning resources from any of the following platforms:
1. YouTube (e.g. video courses, explanations, from creators like CrashCourse, Khan Academy, 3Blue1Brown, etc.)
2. GitHub (e.g. interactive visualizations, cheat sheets, code repositories, lists of materials)
3. Reddit (e.g. discussions in r/explainlikeimfive, r/science, r/learning, r/askscience, r/programming)
4. Wikipedia (e.g. comprehensive reference articles, portals)
5. Khan Academy (e.g. structured lessons, video sessions, interactive exercises)
6. MIT OpenCourseWare / Stanford Online (e.g. syllabus, lectures, downloadable course resources)
7. Coursera (e.g. structured courses, specializations, professional credentials)
8. StackOverflow (e.g. technical explanations, conceptual code discussions)
9. Medium (e.g. deep dives, expert guides, tutorials, science communication)
10. Web (e.g. generic high-authority educational sites like Britannica, NASA, Stanford Encyclopedia of Philosophy)

For each resource, generate:
- title: A descriptive human title for the resource.
- url: A highly accurate, actual link or standard search/navigation query link.
  - For YouTube: use a link like "https://www.youtube.com/results?search_query=..." or direct video URL.
  - For GitHub: use "https://github.com/search?q=..." or direct repository link.
  - For Reddit: use "https://www.reddit.com/search/?q=..." or subreddits like "https://www.reddit.com/r/...".
  - For Wikipedia: use a direct Wikipedia article link or search link like "https://en.wikipedia.org/wiki/...".
  - For Khan Academy: use "https://www.khanacademy.org/search?page_search_query=...".
  - For MIT OCW: use "https://ocw.mit.edu/search/?q=...".
  - For Coursera: use "https://www.coursera.org/search?query=...".
  - For StackOverflow: use "https://stackoverflow.com/search?q=...".
  - For Medium: use "https://medium.com/search?q=...".
  - For Web: use direct Wikipedia, Stanford, Britannica, or official education portals.
- source: must be exactly one of: "youtube", "github", "reddit", "wikipedia", "khanacademy", "mitocw", "coursera", "stackoverflow", "medium", or "web" (lowercase).
- description: A concise 1-2 sentence summary of why this specific resource is useful for mastering the topic.
- authorOrChannel: The channel name, repo owner, subreddit, or publishing platform (e.g., "Crash Course", "MIT OCW", "r/science", "Wikipedia").

Return exactly 10-15 high-quality resources spanning multiple sources.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            title: { type: Type.STRING },
            url: { type: Type.STRING },
            source: { type: Type.STRING, description: "Must be 'youtube', 'github', 'reddit', 'wikipedia', 'khanacademy', 'mitocw', 'coursera', 'stackoverflow', 'medium', or 'web'" },
            description: { type: Type.STRING },
            authorOrChannel: { type: Type.STRING },
          },
          required: ["title", "url", "source", "description"],
        },
      },
    },
  });

  return JSON.parse(response.text);
};
