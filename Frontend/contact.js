// ====== DEBUG HELPER ======
function debugLog(...args) {
  console.log("[CONTACT]", ...args);
}


const contactForm = document.getElementById("contactForm");
debugLog("Form found:", !!contactForm);

// ====== CONTACT FORM HANDLER ======
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = (document.getElementById("name")?.value || "").trim();
  const email = (document.getElementById("email")?.value || "").trim();
  const message = (document.getElementById("message")?.value || "").trim();

  debugLog("Form data:", { name, email, messageLength: message.length });

  // --- Basic Validation ---
  if (!name || !email || !message) {
    alert("⚠️ Please fill in all fields.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    alert("⚠️ Please enter a valid email address.");
    return;
  }

  // --- Simulate Sending ---
  debugLog("Message ready to send:", { name, email, message });
  alert("✅ Message sent successfully!");

  // Reset form
  contactForm.reset();
});
