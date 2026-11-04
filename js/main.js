// Dom Elements
const quizInfo = document.querySelector(".quiz-info");
const countSpan = document.querySelector(".quiz-info .count span");
const categorySpan = document.querySelector(".quiz-info .category span");
const questionArea = document.querySelector(".question-area h2");
const answersArea = document.querySelector(".answers-area");
const submitBtn = document.querySelector(".submit-btn");
const bullets = document.querySelector(".bullets");
const bulletsSpans = document.querySelector(".bullets .spans");
const countdownElement = document.querySelector(".bullets .countdown");
const results = document.querySelector(".results");

// Setting Variables
let currentIndex = 0;
let rightAnswers = 0;
let duration = 15;

// Questions Array
let questionsArray = [];

// Initialization
window.onload = introPage();

// Intro Page Function
function introPage() {
  let introPage = document.createElement("div");
  introPage.className = "intro-page";
  introPage.innerHTML =  `
    <h1>Quiz App</h1>
    <div class="user-choice">
      <p>Select Your Quiz Category:</p>
      <div class="options">
        <div class="option">
          <input type="radio" name="choices" id="html" data-choice="html" checked />
          <label for="html">HTML</label>
        </div>
        <div class="option">
          <input type="radio" name="choices" id="css" data-choice="css" />
          <label for="css">CSS</label>
        </div>
        <div class="option">
          <input type="radio" name="choices" id="islamic" data-choice="islamic" />
          <label for="islamic">Islamic</label>
        </div>
      </div>
      <button class="start-btn">Start Game</button>
    </div>
  `;
  document.body.prepend((introPage));
}

// Fetch Question JSON Function
async function getQuestions(userChoice) {
  try {
    let res = await fetch(`json/${userChoice}_questions.json`);
    let data = await res.json();
    questionsArray = data;
    questionsArray.length = 10;

    // Create Bullets + Set Questions Count
    createBullets(questionsArray.length, userChoice);
    // Add Questions
    createQuestions(questionsArray);

    // Start Countdown
    countdown(duration, questionsArray.length);

    // Click On Sumbit Button
    submitBtn.onclick = () => {
      // Get Right Answer
      let rightAnswer = questionsArray[currentIndex].right_answer;

      // Check The Answer
      checkAnswer(rightAnswer, questionsArray.length);

      // Increase Index
      currentIndex++;
      // Move To The Next Question
      if (currentIndex !== questionsArray.length) {
        createQuestions(questionsArray);
        clearInterval(countdownInterval);
        countdown(duration, questionsArray.length);
      } else {
        showResults(questionsArray.length);
      }
    };
  } catch (error) {
    console.error(`Error: ${error}`);
  }
}

// Create Bullets Function
function createBullets(num, category) {
  // Create Text Of Category Span
  categorySpan.textContent = category;
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
    input.dataset.answer = questionsArray[currentIndex][`answer_${i + 1}`];
    // Check If The First Radio Button
    if (i === 0) input.checked = true;
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

// Check Answer Function
function checkAnswer(rightAnswer, count) {
  let answers = document.getElementsByName("questions");
  let userAnswer;

  // Looping On Answers
  answers.forEach((answer) => {
    if (answer.checked) {
      userAnswer = answer.dataset.answer;
    }
  });

  // Check If User Answer Equals Right Answer
  if (userAnswer === rightAnswer) {
    rightAnswers++;
    document.getElementById("success").play();
    document.querySelectorAll(".bullets .spans span")[currentIndex].classList =
      "right";
  } else {
    document.getElementById("mistake").play();
    document.querySelectorAll(".bullets .spans span")[currentIndex].classList =
      "wrong";
  }

  // Check If The Next Questions Is Exited Add Class (on)
  if (currentIndex < questionsArray.length - 1)
    document.querySelectorAll(".bullets .spans span")[
      currentIndex + 1
    ].classList = "on";
}

// Create Results Function
function showResults(count) {
  // Delete All Elements Except Results Div
  quizInfo.remove();
  questionArea.parentElement.remove();
  answersArea.remove();
  submitBtn.remove();
  bullets.remove();

  // Stop Countdown Timer
  clearInterval(countdownInterval);

  // Set Result Text
  let result;
  results.style.display = "block";
  if (rightAnswers > count / 2 && rightAnswers < count) {
    result = `<span class="good">Good</span> ${rightAnswers} From ${count}`;
  } else if (rightAnswers === count) {
    result = `<span class="perfect">Perfect</span>, All Answers Are Good`;
  } else {
    result = `<span class="bad">Bad</span> ${rightAnswers} From ${count}`;
  }
  results.innerHTML = result;

  // Alert Do You Want To Play Again
  setTimeout(() => {
    Swal.fire({
      title: "Do You Want To Play Again?",
      text: "Press Yes If You Want.",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#0075ff",
      cancelButtonColor: "#dc0a0a",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload();
      }
    });
  }, 5000);
}

// Countdown Timer Function
function countdown(duration, count) {
  if (currentIndex < count) {
    let minutes, seconds;
    countdownInterval = setInterval(() => {
      minutes = parseInt(duration / 60);
      seconds = parseInt(duration % 60);

      minutes = minutes < 10 ? `0${minutes}` : minutes;
      seconds = seconds < 10 ? `0${seconds}` : seconds;

      countdownElement.innerHTML = `${minutes}:${seconds}`;

      if (duration <= 5) {
        countdownElement.classList.add("bad");
      } else {
        countdownElement.classList.remove("bad");
      }

      if (--duration < 0) {
        clearInterval(countdownInterval);
        submitBtn.click();
      }
    }, 1000);
  }
}

// Events Listeners
document.querySelector(".start-btn").onclick =  () => {
  let choices = document.getElementsByName("choices");
  let userChoice;
  choices.forEach((choice) => {
    if (choice.checked) userChoice = choice.dataset.choice;
  });

  getQuestions(userChoice);

  document.querySelector(".intro-page").remove()
}