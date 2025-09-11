// ====== DEBUG HELPERS ======
function debugLog(...args) { console.log("[APP]", ...args); }

// Check DOM elements exist (helps catch ID mismatches)
debugLog("loginForm:", !!document.getElementById("loginForm"),
         "signupForm:", !!document.getElementById("signupForm"));

// ====== LOGIN ======
document.getElementById("loginForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = (document.getElementById("loginEmail")?.value || "").trim();
  const password = document.getElementById("loginPassword")?.value || "";

  debugLog("Attempting login for:", email);
  try {
    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    debugLog("Response status:", res.status, res.statusText);
    const ct = res.headers.get("content-type") || "";
    let data;
    if (ct.includes("application/json")) {
      data = await res.json();
      debugLog("Response JSON:", data);
    } else {
      const txt = await res.text();
      debugLog("Non-JSON response text:", txt);
      throw new Error("Server returned non-JSON response: " + txt);
    }

    if (res.ok) {
      debugLog("Login OK, token length:", (data.token || "").length);
      localStorage.setItem("token", data.token);
      alert("Login successful 🎉");
      window.location.href = "dashboard.html"; // change as needed
    } else {
      // show server message if any
      alert(data.message || data.error || "Login failed ❌");
    }
  } catch (err) {
    console.error("[LOGIN ERROR]", err);
    // Friendly alert but ask user to check console for details
    alert("Something went wrong. Open browser Console (F12) for details.");
  }
});

// ====== SIGNUP ======
document.getElementById("signupForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  const name = (document.getElementById("signupName")?.value || "").trim();
  const email = (document.getElementById("signupEmail")?.value || "").trim();
  const password = document.getElementById("signupPassword")?.value || "";

  debugLog("Attempting signup:", { name, email });
  try {
    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });

    debugLog("Response status:", res.status, res.statusText);
    const ct = res.headers.get("content-type") || "";
    let data;
    if (ct.includes("application/json")) {
      data = await res.json();
      debugLog("Response JSON:", data);
    } else {
      const txt = await res.text();
      debugLog("Non-JSON response text:", txt);
      throw new Error("Server returned non-JSON response: " + txt);
    }

    if (res.ok) {
      alert("Signup successful 🎉 Please login.");
      window.location.href = "login.html";
    } else {
      alert(data.message || data.error || "Signup failed ❌");
    }
  } catch (err) {
    console.error("[SIGNUP ERROR]", err);
    alert("Something went wrong. Open browser Console (F12) for details.");
  }
});
