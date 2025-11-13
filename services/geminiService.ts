
import { GoogleGenAI, Modality } from "@google/genai";

export const generateTryOnImage = async (
  personImageBase64: string,
  clothingImageBase64: string,
  personMimeType: string,
  clothingMimeType: string
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable not set.");
  }
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const personImagePart = {
    inlineData: {
      data: personImageBase64,
      mimeType: personMimeType,
    },
  };

  const clothingImagePart = {
    inlineData: {
      data: clothingImageBase64,
      mimeType: clothingMimeType,
    },
  };

  const textPart = {
    text: "Usando a primeira imagem da pessoa e a segunda imagem da peça de roupa, gere uma imagem realista onde a pessoa está vestindo a peça de roupa. O fundo deve ser simples e neutro. A imagem final deve focar na pessoa e na roupa, mantendo as características da pessoa.",
  };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [personImagePart, clothingImagePart, textPart],
      },
      config: {
        responseModalities: [Modality.IMAGE],
      },
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData?.data) {
        return part.inlineData.data;
      }
    }
    throw new Error("Nenhuma imagem foi gerada pela API.");
  } catch (error) {
    console.error("Erro ao chamar a API Gemini:", error);
    throw new Error("Não foi possível gerar a imagem. Tente novamente mais tarde.");
  }
};
