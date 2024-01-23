const translateText = async (text, targetLang) => {
  const response = await fetch("/api/translate", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ text, targetLang }),
  });
  const data = await response.json();
  return data.translatedText;
};

const generateChat = async (skillLevel, words) => {
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
    const chatCompletion = await response.json(); // Get the response from your serverless function

    return chatCompletion.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching chat completion:", error);
  }
};
