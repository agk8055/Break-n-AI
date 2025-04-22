// backend/test-gemini.js
const { GoogleGenerativeAi } = require("@google/generative-ai");

console.log("Attempting to load GoogleGenerativeAi...");

if (typeof GoogleGenerativeAi === 'function') {
  console.log("GoogleGenerativeAi loaded as a function (likely a constructor).");
} else {
  console.log("GoogleGenerativeAi is NOT loaded as a function. Type:", typeof GoogleGenerativeAi);
}

try {
  const genAI = new GoogleGenerativeAi("YOUR_API_KEY_HERE"); // Replace with any string for API key for this test
  console.log("GoogleGenerativeAi constructor seems to work (instance created).");
} catch (error) {
  console.error("Error creating GoogleGenerativeAi instance:", error);
}