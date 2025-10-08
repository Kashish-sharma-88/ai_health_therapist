const buttons = document.querySelectorAll(".exercise-btn");
const display = document.getElementById("exerciseDisplay");

buttons.forEach((btn) => {
  btn.addEventListener("click", () => {
    const type = btn.getAttribute("data-type");
    showExercise(type);
  });
});

function showExercise(type) {
  if (type === "meditation") {
    display.innerHTML = `
      <h3>🌅 5-Minute Meditation</h3>
      <p>Find a comfortable position, close your eyes, and focus on your breath.</p>
      <audio controls>
        <source src="Music/Lovely-Long-Version-chosic.com_.mp3" type="audio/mp3">
      </audio>`;
  } else if (type === "breathing") {
    display.innerHTML = `
      <h3>🌬️ Breathing Exercise (4-7-8 Technique)</h3>
      <p>Inhale for 4 seconds, hold for 7, and exhale for 8. Repeat 4 times.</p>
      <p><strong>Tip:</strong> Breathe deeply and steadily for best results.</p>`;
  } else if (type === "relaxation") {
    display.innerHTML = `
      <h3>💆 Guided Relaxation</h3>
      <video controls width="100%">
        <source src="assets/relaxation.mp4" type="video/mp4">
      </video>`;
  }
}
