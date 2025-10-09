const chatBox = document.getElementById("chatBox");
const input = document.getElementById("messageInput");

async function sendMessage() {
  const msg = input.value.trim();
  if (!msg) return;

  chatBox.innerHTML += `<div class="msg user"><b>You:</b> ${msg}</div>`;
  input.value = "";

  try {
    const res = await fetch("https://ai-health-therapist-bf0u.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: msg })
    });

    if (!res.ok) {
      chatBox.innerHTML += `<div class="msg bot" style="color:red;"><b>Error:</b> ${res.statusText}</div>`;
      return;
    }

    const data = await res.json();
    const reply = data.reply || "⚠️ No reply from AI";

    chatBox.innerHTML += `<div class="msg bot"><b>Bot:</b> ${reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight;

  } catch (err) {
    console.error("Frontend Chat Error:", err);
    chatBox.innerHTML += `<div class="msg bot" style="color:red;"><b>Error:</b> Something went wrong!</div>`;
  }
  // chatBox.innerHTML += `<div class="msg user"><b>You:</b> ${msg}</div>`;
saveChat(); // user message ke turant baad

chatBox.innerHTML += `<div class="msg bot"><b>Bot:</b> ${reply}</div>`;
saveChat(); // bot reply ke turant baad

}

input.addEventListener("keypress", function (e) {
  if (e.key === "Enter") sendMessage();
});
function saveChat() {
  const user = localStorage.getItem("loggedInUser"); // check login user
  if (user) {
    localStorage.setItem(`chat_${user}`, chatBox.innerHTML); // chat save karo
  }
}
function loadChat() {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    const savedChat = localStorage.getItem(`chat_${user}`);
    if (savedChat) {
      chatBox.innerHTML = savedChat;
    }
  }
}
window.onload = loadChat;

function clearChat() {
  const user = localStorage.getItem("loggedInUser");
  if (user) {
    localStorage.removeItem(`chat_${user}`);
    chatBox.innerHTML = "";
  }
}
