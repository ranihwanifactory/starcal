import { GoogleGenAI, Type } from "@google/genai";
import { AIDetailResponse } from "../types";

// Note: In a real production app, API keys should be handled via a backend proxy.
// For this frontend-only demo, we assume the environment variable is available.
const apiKey = process.env.API_KEY || ''; 

const ai = new GoogleGenAI({ apiKey });

export const fetchConstellationDetails = async (name: string): Promise<AIDetailResponse> => {
  if (!apiKey) {
    // Fallback if no API key is provided
    return {
      story: "API 키가 설정되지 않아 상세 정보를 불러올 수 없습니다. 환경 변수를 확인해주세요.",
      bestViewingTime: "맑은 날 밤 9시~12시 사이",
      findingTip: "남쪽 하늘을 바라보세요.",
      difficulty: "Medium",
      interestingFacts: ["API Key missing", "Please configure process.env.API_KEY"]
    };
  }

  try {
    const modelId = "gemini-2.5-flash";
    const prompt = `
      별자리 또는 천체 관측 대상인 "${name}"에 대한 흥미로운 정보를 천문학 초보자를 위해 한국어로 설명해주세요.
      다음 항목들을 포함해야 합니다:
      1. 신화나 역사적 배경 (story)
      2. 가장 관측하기 좋은 구체적인 시기와 조건 (bestViewingTime)
      3. 밤하늘에서 찾는 꿀팁 (findingTip)
      4. 관측 난이도 (difficulty: Easy, Medium, 또는 Hard)
      5. 짧고 흥미로운 사실 3가지 (interestingFacts)
    `;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            story: { type: Type.STRING },
            bestViewingTime: { type: Type.STRING },
            findingTip: { type: Type.STRING },
            difficulty: { type: Type.STRING, enum: ["Easy", "Medium", "Hard"] },
            interestingFacts: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["story", "bestViewingTime", "findingTip", "difficulty", "interestingFacts"]
        }
      }
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("Empty response from Gemini");

    return JSON.parse(jsonText) as AIDetailResponse;

  } catch (error) {
    console.error("Gemini API Error:", error);
    return {
      story: "상세 정보를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.",
      bestViewingTime: "정보 없음",
      findingTip: "정보 없음",
      difficulty: "Medium",
      interestingFacts: ["네트워크 오류 또는 API 제한"]
    };
  }
};
