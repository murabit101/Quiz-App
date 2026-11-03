// Setting Variables
const countSpan = document.querySelector(".quiz-info .count span");
const bulletsSpans = document.querySelector(".bullets .spans");

// Fetch Question JSON Function
async function getQuestions() {
  try {
    let res = await fetch("json/html_questions.json");
    let data = await res.json();
    let questionsArray = data;
    createBullets(questionsArray.length);
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

// Create Bullets Function
function createBullets(num) {
  // Create Number Of Count Span
  countSpan.textContent = num;
  // Create Bullets Spans
  for (let i = 0; i < num; i++) {
    let bullet = document.createElement("span");
    if (i === 0) bullet.className = "on";
    bulletsSpans.append(bullet);
  }
}