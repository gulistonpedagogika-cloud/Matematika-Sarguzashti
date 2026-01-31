
import { GoogleGenAI } from "@google/genai";

export const getAiFeedback = async (problem: string, grade: number, isCorrect: boolean): Promise<string> => {
  // Har doim chaqiruvdan oldin yangi instance yaratish (eng xavfsiz usul)
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = isCorrect 
    ? `Matematika o'yinida ${grade}-sinf o'quvchisi "${problem}" misoliga to'g'ri javob berdi. Uni juda qisqa (bir jumla) va quvnoq ruhda tabriklang (o'zbek tilida).`
    : `Matematika o'yinida ${grade}-sinf o'quvchisi "${problem}" misolida adashdi. Unga bu misolni qanday yechish haqida juda sodda, 1-2 jumlada maslahat bering (o'zbek tilida).`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
      config: {
        systemInstruction: "Siz mehribon va aqlli matematika o'qituvchisiz. Bolalar bilan juda sodda, qisqa va do'stona gaplashasiz. Faqat o'zbek tilida javob bering.",
        maxOutputTokens: 100,
        temperature: 0.7,
      }
    });
    
    return response.text?.trim() || (isCorrect ? "Barakalla! To'g'ri!" : "Harakatdan to'xtama!");
  } catch (error) {
    console.error("Gemini API Error:", error);
    return isCorrect ? "Ajoyib natija! Barakalla!" : "Xafa bo'lma, keyingi safar albatta uddalaysan!";
  }
};
