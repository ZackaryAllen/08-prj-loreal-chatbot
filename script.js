/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Store the conversation history in an array
const conversation = [
  {
    role: "system",
    content:
      "Only answer questions related to L'Oreal products, routines, recommendations, and beauty-related topics. Polite and concise responses are expected. Politely decline to answer any questions outside of this scope.",
  },
];

// Set initial message
chatWindow.innerHTML = `<div class="msg assistant">👋 Hello! How can I help you today?</div>`;

// Function to get a response from OpenAI API
async function getAIResponse() {
  const endpoint = "https://beautybotwd8.zackaryallen.workers.dev/";
  const data = {
    model: "gpt-4o",
    messages: conversation, // Send the full conversation history
  };

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    // Return the AI's reply
    return result.choices[0].message.content;
  } catch (error) {
    return "Sorry, I couldn't connect to the AI. Please try again.";
  }
}

/* Handle form submit */
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get the user's message
  const message = userInput.value;

  // Add the user's message to the conversation history
  conversation.push({ role: "user", content: message });

  // Show the latest user message as a bubble and a loading message
  chatWindow.innerHTML = `
    <div class="msg user"><b>You:</b> ${message}</div>
    <div class="msg assistant"><i>BeautyBot is thinking...</i></div>
  `;

  // Get the AI's response (with full context)
  const aiReply = await getAIResponse();

  // Add the AI's reply to the conversation history
  conversation.push({ role: "assistant", content: aiReply });

  // Show the latest user and BeautyBot messages as bubbles
  chatWindow.innerHTML = `
    <div class="msg user"><b>You:</b> ${message}</div>
    <div class="msg assistant"><b>BeautyBot:</b> ${aiReply}</div>
  `;

  // Clear the input box
  userInput.value = "";
});
