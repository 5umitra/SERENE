const messageInput = document.getElementById("message-input");
const sendButton = document.getElementById("send-button");
const chatHistory = document.querySelector(".chat-history");

// Replace YOUR_OPENAI_API_KEY with your actual OpenAI API key
// const apiKey = "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";

import { GoogleGenerativeAI } from "@google/generative-ai";
// import md from "../node_modules/markdown-it";
// import markdown from '../node_modules/markdown-it';
// "C:\Users\Ojus chauhan\node_modules\markdown-it\bin\markdown-it.mjs"

// Fetch your API_KEY
const API_KEY = "AIzaSyD2dp_f2_M9cji7NrchCg059AcQfM_DYMM";

// Access your API key (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI(API_KEY);
const history = [];

async function generateText(msg) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });
  const chat = model.startChat({
    history: history,
    generateConfig: {
      maxOutputTokens: 500,
    },
  });

  const result = await chat.sendMessage(msg);
  const response = await result.response;
  const text = response.text();

  history.push({ role: "user", parts: msg });
  history.push({ role: "model", parts: text });

  return text;
}

const generateChatMessage = async (message) => {
  // Show typing indicator while waiting for response
  const typingIndicator = document.createElement("div");
  typingIndicator.classList.add("message", "bot-message");
  typingIndicator.textContent = "...";
  chatHistory.appendChild(typingIndicator);
  chatHistory.scrollTop = chatHistory.scrollHeight;

  try {
    const botResponse = await generateText(message);

    // Create and render the bot message
    // let md_text =markdown.render(botResponse);
    const botMessage = document.createElement("div");
    botMessage.classList.add("message", "bot-message");
    // botMessage.innerHTML = md_text; 
    botMessage.textContent = botResponse;
    chatHistory.appendChild(botMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Remove the typing indicator
    typingIndicator.remove();
  } catch (error) {
    console.error("Error generating response:", error);

    // Handle API errors or network issues gracefully
    const errorMessage = document.createElement("div");
    errorMessage.classList.add("message", "bot-message", "error");
    errorMessage.textContent = "An error occurred. Please try again later.";
    chatHistory.appendChild(errorMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    typingIndicator.remove();
  }
};

sendButton.addEventListener("click", () => {
  const message = messageInput.value.trim();

  if (message) {
    // Clear the input field
    messageInput.value = "";
  

    // Add the user's message to the chat history
    const userMessage = document.createElement("div");
    userMessage.classList.add("message", "user-message");
    userMessage.textContent = message;
    chatHistory.appendChild(userMessage);
    chatHistory.scrollTop = chatHistory.scrollHeight;

    // Generate and display the bot's response
    generateChatMessage(message);
  }

});

messageInput.addEventListener("keypress", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault(); // Prevent default form submission
    const message = messageInput.value.trim();

    if (message) {
      messageInput.value = "";

    // Add the user's message to the chat history
      const userMessage = document.createElement("div");
      userMessage.classList.add("message", "user-message");
      userMessage.textContent = message;
      chatHistory.appendChild(userMessage);
      chatHistory.scrollTop = chatHistory.scrollHeight;

    // Generate and display the bot's response

      generateChatMessage(message);
    }
  }
});

// (Optional) Add event listeners for other interaction possibilities,
// such as text recognition, speech input, or image processing.
