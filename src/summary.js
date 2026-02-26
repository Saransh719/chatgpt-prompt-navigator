import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY } from "./config";

const ai = new GoogleGenAI({apiKey: GEMINI_API_KEY});
const SYSTEM_INSTRUCTION = [
    "You must respond in plain text only. ",
    "Do not use markdown. ",
    "Do not use asterisks, bullet points, or formatting symbols.",
]

async function summarizePrompt(promptText) {
    const response = await ai.models.generateContent({
        model: "gemma-3-1b-it",
        contents : 'Summarize this prompt in 6 words or less, do not write anything else ' + promptText,
        SYSTEM_INSTRUCTION : SYSTEM_INSTRUCTION
    })

    return response.text.trim();
}

const summaryCache = new Map();

export async function summarizePromptCatched(promptText) {
    if(summaryCache.has(promptText)) {
        return summaryCache.get(promptText);
    }
    const summary = await summarizePrompt(promptText);
    summaryCache.set(promptText, summary);
    return summary;
}

export async function summarizeAllPrompts(prompts) {
    const promises = prompts.map(async (prompt) => {
        const summary = await summarizePromptCatched(prompt.text);
        return { ...prompt, summary, expanded: false };
    });
    return Promise.all(promises);
}

