import { GoogleGenAI, Type } from "@google/genai";
import { AIDetailResponse } from "../types";

const getClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) return null;
  return new GoogleGenAI({ apiKey });
};

export const fetchConstellationDetails = async (name: string): Promise<AIDetailResponse> => {
  const ai = getClient();

  if (!ai) {
    return {
      story: "API 키가 설정되지 않아 상세 정보를 불러올 수 없습니다. 환경 변수(API_KEY)를 확인해주세요.",
      bestViewingTime: "정보 없음",
      findingTip: "설정 확인 필요",
      difficulty: "Medium",
      interestingFacts: ["API Key missing", "Please configure process.env.API_KEY"]
    };
  }

  try {
    const modelId = "gemini-2.5-flash";
    const prompt = `
      당신은 밤하늘의 이야기를 들려주는 감성적인 천문학자입니다. 
      별자리 또는 천체 관측 대상인 "${name}"에 대해 초보자도 이해하기 쉽고 흥미진진한 정보를 한국어로 알려주세요.
      
      단순한 사실 나열보다는, 독자가 밤하늘을 올려다보고 싶게 만드는 매력적인 어조로 작성해주세요.
      
      다음 형식에 맞춰 JSON으로 답변해주세요:
      1. story: 신화나 전설, 혹은 과학적 발견의 역사 (이모지를 적절히 사용하여 재미있게).
      2. bestViewingTime: 관측하기 좋은 계절, 시간, 조건.
      3. findingTip: 밤하늘에서 찾는 구체적인 방법 (주변 밝은 별 활용).
      4. difficulty: 'Easy', 'Medium', 'Hard' 중 하나.
      5. interestingFacts: 흥미로운 사실 3가지 (짧고 강렬하게).
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

  } catch (error: any) {
    console.error("Gemini API Error (Text):", error);
    
    let errorMessage = "별들의 이야기를 불러오는 도중 문제가 생겼어요.";
    if (error.message?.includes('403') || error.toString().includes('API key')) {
      errorMessage = "API 키가 올바르지 않거나 권한이 없습니다. 설정을 확인해주세요.";
    }

    return {
      story: errorMessage,
      bestViewingTime: "일시적 오류",
      findingTip: "잠시 후 다시 시도해주세요.",
      difficulty: "Medium",
      interestingFacts: ["네트워크 상태 확인", "API 키 설정 확인", "잠시 후 재시도"]
    };
  }
};

export const fetchConstellationImage = async (name: string): Promise<string | null> => {
  const ai = getClient();
  if (!ai) return null;

  try {
    // Using gemini-2.5-flash-image for image generation
    const modelId = "gemini-2.5-flash-image";
    const prompt = `A breathtaking, cinematic, and realistic 8k resolution photo of the ${name} constellation in the night sky. 
    The stars should be bright and connected by very faint, elegant lines to show the shape. 
    The background is a deep, rich milky way galaxy. 
    High quality, astrophotography style.`;

    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        // No responseMimeType for image generation models
      }
    });

    // Extract image from response parts
    if (response.candidates?.[0]?.content?.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Gemini API Error (Image):", error);
    return null;
  }
};