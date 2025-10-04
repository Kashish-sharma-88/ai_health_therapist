const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  // Show user message
  chatBox.innerHTML += `<div class="msg user"><b>You:</b> ${msg}</div>`;
  input.value = "";

  try {
    const res = await fetch("https://ai-health-therapist-bf0u.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    const data = await res.json();

    if (res.ok && data.reply) {
      chatBox.innerHTML += `<div class="msg bot"><b>Bot:</b> ${data.reply}</div>`;
    } else {
      chatBox.innerHTML += `<div class="msg bot" style="color:red;"><b>Error:</b> ${
        data.error || "No response from AI"
      }</div>`;
    }

    // Auto scroll
    chatBox.scrollTop = chatBox.scrollHeight;
  } catch (err) {
    console.error("Frontend Chat Error:", err);
    chatBox.innerHTML += `<div class="msg bot" style="color:red;"><b>Error:</b> Something went wrong!</div>`;
  }
}

// ✅ Press Enter to send
input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    sendMessage();
  }
});
