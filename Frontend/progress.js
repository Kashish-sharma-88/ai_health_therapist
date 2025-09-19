const progressFill = document.getElementById("progressFill");
const progressMessage = document.getElementById("progressMessage");
const checkboxes = document.querySelectorAll(".milestones input");

// Load saved progress on page load
window.addEventListener("DOMContentLoaded", () => {
  const saved = JSON.parse(localStorage.getItem("progress")) || {};
  checkboxes.forEach(cb => {
    cb.checked = saved[cb.value] || false;
  });
  updateProgress();
});

// Update progress bar and message
function updateProgress() {
  const total = checkboxes.length;
  const completed = [...checkboxes].filter(cb => cb.checked).length;
  const percent = Math.round((completed / total) * 100);

  // Progress bar update
  progressFill.style.width = percent + "%";
  progressFill.textContent = percent + "%";

  // Color logic
  if (percent <= 30) {
    progressFill.style.background = "#ff4d4d"; // red
    progressMessage.textContent = "💡 Let's get started!";
  } else if (percent <= 70) {
    progressFill.style.background = "#ffcc00"; // yellow
    progressMessage.textContent = "🔥 Keep going, you're doing great!";
  } else if (percent < 100) {
    progressFill.style.background = "#28a745"; // green
    progressMessage.textContent = "🌟 Almost there!";
  } else {
    progressFill.style.background = "#28a745"; // green
    progressMessage.textContent = "🎉 Amazing! You completed all tasks!";
  }

  // Save progress
  const progressData = {};
  checkboxes.forEach(cb => progressData[cb.value] = cb.checked);
  localStorage.setItem("progress", JSON.stringify(progressData));
}

// Event listeners
checkboxes.forEach(cb => cb.addEventListener("change", updateProgress));
