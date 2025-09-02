
import { GoogleGenAI } from "@google/genai";

// Fix: Removed the conditional block that sets a mock API_KEY.
// The API key must be provided exclusively through the `process.env.API_KEY` environment variable as per guidelines.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
const model = 'gemini-2.5-flash';

const STREAM_PROMPT = `
Generate an endless stream of diverse code snippets.
Alternate between Python, JavaScript, Rust, Go, SQL, and CSS.
Keep each snippet concise, between 5 and 15 lines.
Do not include markdown backticks like \`\`\`python.
Just provide the raw code.
Here is an example of a JavaScript snippet:

function factorial(n) {
  if (n === 0) {
    return 1;
  }
  return n * factorial(n - 1);
}

Now, begin generating.
`;

export const generateCodeStream = async (
  onChunk: (chunk: string) => void,
  stopSignal: { stopped: boolean }
) => {
  try {
    const chat = ai.chats.create({ model });
    let response = await chat.sendMessageStream({ message: STREAM_PROMPT });

    while (!stopSignal.stopped) {
      for await (const chunk of response) {
        if (stopSignal.stopped) break;
        onChunk(chunk.text);
      }
      if (stopSignal.stopped) break;
      // When the stream ends, ask it to continue to create an "endless" loop
      response = await chat.sendMessageStream({ message: "continue generating more code snippets" });
    }
  } catch(e) {
      console.error("Gemini API Error (Streaming):", e);
      onChunk(`// Gemini API Error. Please check your API Key and network connection.\n// Auto-mode stopped.`);
      stopSignal.stopped = true;
  }
};

export const generateCodeFromPrompt = async (prompt: string): Promise<string> => {
  const fullPrompt = `
    Generate a code snippet based on the following request: "${prompt}".
    The code should be concise and directly address the request.
    Do not include any explanations or markdown formatting like \`\`\`language.
    Only output the raw code.
  `;
  try {
    const response = await ai.models.generateContent({
        model,
        contents: fullPrompt,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API Error (Prompt):", error);
    return `// Error generating code from prompt.\n// Please check your Gemini API key and network connection.`;
  }
};