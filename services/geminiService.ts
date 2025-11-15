import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // A bit of a trick for the environment this runs in.
  // In a real app, you'd have a more robust way to handle this.
  console.warn("API_KEY is not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY! });

export const generateChatResponse = async (userInput: string, useThinkingMode: boolean = false): Promise<string> => {
    if (!API_KEY) {
        return "Sorry, the AI service is currently unavailable. Please check the API key configuration.";
    }

    const systemInstruction = `You are a helpful AI assistant for an asthma management app. Your goal is to provide supportive and informative responses, but you must not give medical advice.
    You will be given the user's message and their current context. Use the context to make your response more relevant.
    If the user asks for medical advice, gently decline and advise them to speak with a healthcare professional.
    Keep your responses concise and easy to understand.`;
    
    // This context would be dynamically fetched by the backend in a real application.
    const context = `{
        "AQI": 185,
        "Pollen": "High",
        "LastPeakFlow": 350,
        "BaselinePeakFlow": 450
    }`;

    const prompt = `
        User Message: "${userInput}"
        
        Current Context: ${context}
    `;

    try {
        const model = useThinkingMode ? 'gemini-2.5-pro' : 'gemini-2.5-flash';
        const config: {
            systemInstruction: string;
            temperature: number;
            topP: number;
            thinkingConfig?: { thinkingBudget: number };
        } = {
            systemInstruction: systemInstruction,
            temperature: 0.7,
            topP: 0.9,
        };

        if (useThinkingMode) {
            config.thinkingConfig = { thinkingBudget: 32768 };
        }

        const response = await ai.models.generateContent({
            model: model,
            contents: prompt,
            config: config
        });

        return response.text;
    } catch (error) {
        console.error("Error generating chat response:", error);
        return "I'm sorry, I encountered an error while trying to respond. Please try again later.";
    }
};
