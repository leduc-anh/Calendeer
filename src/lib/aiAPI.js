import axiosClient from "./axiosClient";

// API service cho AI Chatbot
// Bạn có thể cấu hình để sử dụng OpenAI, Google Gemini, hoặc API khác

const aiAPI = {
  // Gửi message tới AI và nhận response
  sendMessage: async (message, conversationHistory = []) => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      return {
        data: {
          response: "Đây là response từ AI API service. Bạn cần tích hợp API thực tế.",
          timestamp: new Date().toISOString(),
        },
      };
    } catch (error) {
      console.error("Error calling AI API:", error);
      throw error;
    }
  },

  sendToGemini: async (message, apiKey) => {
    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: message,
                  },
                ],
              },
            ],
          }),
        }
      );

      const data = await response.json();
      return data.candidates[0].content.parts[0].text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      throw error;
    }
  },
};

export default aiAPI;
