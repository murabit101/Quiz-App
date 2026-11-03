// Setting Variables
const countSpan = document.querySelector(".quiz-info .count span");
const bulletsSpans = document.querySelector(".bullets .spans");
const questionArea = document.querySelector(".question-area h2");
const answersArea = document.querySelector(".answers-area");
const submitBtn = document.querySelector(".submit-btn");
const results = document.querySelector(".results");
let currentIndex = 0;

// Questions Array
let questionsArray = [];

// Fetch Question JSON Function
async function getQuestions() {
  try {
    let res = await fetch("json/html_questions.json");
    let data = await res.json();
    questionsArray = data;
    createBullets(questionsArray.length);
    createQuestions(questionsArray);
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

// Create Create Questions Bullets Function
function createQuestions(questionsArray) {
  // Question
  questionArea.textContent = questionsArray[currentIndex].title;
  // Answers
  answersArea.innerHTML = "";
  for (let i = 0; i < 4; i++) {
    // Create Answer Div
    let answer = document.createElement("div");
    answer.classList = "answer";
    // Create Radio Input
    let input = document.createElement("input");
    input.type = "radio";
    input.name = "questions";
    input.setAttribute("id", `answer${i + 1}`);
    input.dataset.answer = questionsArray[currentIndex][`answer_${i + 1}`];;
    // Create Label
    let label = document.createElement("label");
    label.setAttribute("for", `answer${i + 1}`);
    label.textContent = questionsArray[currentIndex][`answer_${i + 1}`];
    // Appendings
    answer.appendChild(input);
    answer.appendChild(label);
    answersArea.appendChild(answer);
  }
}

window.onload = getQuestions();