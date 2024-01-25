export const translateText = async (text, targetLang) => {
  const response = await fetch("/api/translateText", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, targetLang }),
  });
  const data = await response.json();
  return data.translatedText;
};

export const generateChat = async (skillLevel, words) => {
  try {
    // Send a POST request to serverless endpoint
    const response = await fetch("/api/generateChat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ skillLevel, words }), // Send skillLevel and words as the request body
    });
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const { message } = await response.json(); // Get the response from your serverless function
    return message;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
  }
};
