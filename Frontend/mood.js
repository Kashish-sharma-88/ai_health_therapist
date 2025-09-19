// ===== Mood Tracker JS =====
const moodForm = document.getElementById("moodForm");
const moodResult = document.getElementById("moodResult");
const moodHistoryEl = document.getElementById("moodHistory");
const ctx = document.getElementById("moodChart").getContext("2d");

// Array to store moods
let moodHistory = [];

// Initialize Chart.js
const moodChart = new Chart(ctx, {
    type: "line",
    data: {
        labels: [],
        datasets: [
            {
                label: "Mood Score",
                data: [],
                backgroundColor: "rgba(38,129,129,0.2)",
                borderColor: "rgba(38,129,129,1)",
                borderWidth: 2,
                fill: true,
                tension: 0.3
            }
        ]
    },
    options: {
        responsive: true,
        scales: {
            y: { min: 0, max: 10, stepSize: 1 }
        }
    }
});

// Function to convert select inputs to numerical score
function moodValue(input) {
    if (input === "Low") return 2;
    if (input === "Medium") return 3;
    if (input === "High") return 5;
    if (input === "Yes") return 5;
    if (input === "No") return 2;
    return parseInt(input) || 0;
}

// Function to calculate mood score
function calculateMoodScore() {
    const feeling = parseInt(document.getElementById("moodFeeling").value);
    const energy = moodValue(document.getElementById("moodEnergy").value);
    const sleep = moodValue(document.getElementById("moodSleep").value);
    const stress = parseInt(document.getElementById("moodStress").value) || 0;

    const score = feeling + energy + sleep - stress;
    return Math.max(0, Math.min(10, score)); 
}

function moodMessage(score) {
    if (score >= 8) return "😊 You're feeling great today!";
    if (score >= 6) return "🙂 You're feeling okay today.";
    if (score >= 3) return "😐 You're feeling a bit low today.";
    return "😔 You're feeling stressed or unhappy today. Take care!";
}

// Update mood history list (daywise, no duplicate per day)
function updateMoodHistory(score) {
    const date = new Date().toLocaleDateString();

    // Check if today's entry already exists
    const existingIndex = moodChart.data.labels.indexOf(date);
    if (existingIndex !== -1) {
        // Replace existing score for today
        moodChart.data.datasets[0].data[existingIndex] = score;
        moodChart.update();

        // Update history list
        const listItems = moodHistoryEl.querySelectorAll("li");
        listItems.forEach(li => {
            if (li.textContent.startsWith(date)) {
                li.textContent = `${date} - Mood Score: ${score}`;
            }
        });
        return;
    }

    // Add new entry
    moodHistory.push(score);

    // Add to list
    const li = document.createElement("li");
    li.textContent = `${date} - Mood Score: ${score}`;
    moodHistoryEl.prepend(li);

    // Add to chart
    moodChart.data.labels.push(date);
    moodChart.data.datasets[0].data.push(score);
    moodChart.update();
}


// Handle form submission
moodForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const score = calculateMoodScore();
    moodResult.textContent = moodMessage(score);

    updateMoodHistory(score);

    // Reset form for next entry
    moodForm.reset();
});
