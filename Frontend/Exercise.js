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

      <p id="song-title">Lovely Long Version</p>
      <div class="audio-player">
        <button id="prev" class="music-btn">⏮</button>
        <audio id="audio" controls>
          <source src="Music/Lovely-Long-Version-chosic.com_.mp3" type="audio/mp3">
        </audio>
        <button id="next" class="music-btn">⏭</button>
      </div>
    `;

    initMusicPlayer();
  } 
  else if (type === "breathing") {
    display.innerHTML = `
      <h3>🌬️ Breathing Exercise (4-7-8 Technique)</h3>
      <p>Inhale for 4 seconds, hold for 7, and exhale for 8. Repeat 4 times.</p>
      <p><strong>Tip:</strong> Breathe deeply and steadily for best results.</p>`;
  } 
  else if (type === "relaxation") {
    display.innerHTML = `
      <h3>💆 Guided Relaxation</h3>
      <video controls width="100%">
        <source src="Video/14487894_3840_2160_24fps.mp4" type="video/mp4">
      </video>`;
  }
}

// === Music Player Logic ===
function initMusicPlayer() {
  const songs = [
    { title: "Lovely Long Version", src: "Music/Lovely-Long-Version-chosic.com_.mp3" },
    { title: "Hope", src: "Music/Hope-Emotional-Soundtrack(chosic.com).mp3" },
    { title: "Child-Dreams", src: "Music/Child-Dreams(chosic.com).mp3" },
    { title: "Moonlight", src: "Music/scott-buckley-moonlight(chosic.com).mp3" },
    { title: "Soar", src: "Music/scott-buckley-soar(chosic.com).mp3" }
  ];

  let currentSong = 0;
  const audio = document.getElementById("audio");
  const title = document.getElementById("song-title");
  const nextBtn = document.getElementById("next");
  const prevBtn = document.getElementById("prev");

  function loadSong(index) {
    audio.src = songs[index].src;
    title.textContent = songs[index].title;
    audio.play();
  }

  nextBtn.addEventListener("click", () => {
    currentSong = (currentSong + 1) % songs.length;
    loadSong(currentSong);
  });

  prevBtn.addEventListener("click", () => {
    currentSong = (currentSong - 1 + songs.length) % songs.length;
    loadSong(currentSong);
  });

  loadSong(currentSong);
}
