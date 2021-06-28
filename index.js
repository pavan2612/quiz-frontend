const myQuestions = [
  {
    question: "Which is red in color?",
    answers: {
      a: "orange",
      b: "apple",
      c: "strawberry"
    },
    correctAnswer: "c"
  },
  {
    question: "Which is orange in color?",
    answers: {
      a: "orange",
      b: "apple",
      c: "strawberry"
    },
    correctAnswer: "a"
  },
  {
    question: "Which is green in color?",
    answers: {
      a: "Orange",
      b: "grapes",
      c: "strawberry",
    },
    correctAnswer: "b"
  },
   {
    question: "Which is yellow in color?",
    answers: {
      a: "Orange",
      b: "banana",
      c: "strawberry",
    },
    correctAnswer: "b"
  },
   {
    question: "Which is smaller in shape?",
    answers: {
      a: "Orange",
      b: "grapes",
      c: "strawberry",
    },
    correctAnswer: "b"
  }
];

const quizContainer = document.getElementById('quiz');
const resultsContainer = document.getElementById('results');
const submitButton = document.getElementById('submit');
const number = document.getElementById('number');

let slides = "";

function buildQuiz(){
  // variable to store the HTML output
  const output = [];

  // for each question...
  myQuestions.forEach(
    (currentQuestion, questionNumber) => {

      // variable to store the list of possible answers
      const answers = [];

      // and for each available answer...
      for(let letter in currentQuestion.answers){

        // ...add an HTML radio button
        answers.push(
          `<label>
            <input type="radio" name="question${questionNumber}" value="${letter}">
            ${currentQuestion.answers[letter]}
          </label>`
        );
      }

      // add this question and its answers to the output
      output.push(
          `<div class="slide">
            <div class="question"> ${currentQuestion.question} </div>
            <div class="answers"> ${answers.join("")} </div>
          </div>`
            );
    }
  );

  // finally combine our output list into one string of HTML and put it on the page
  quizContainer.innerHTML = output.join('');
  slides = document.querySelectorAll(".slide");
  slides[0].classList.add('active-slide');
  previousButton.style.display = 'none';
  submitButton.style.display = 'none';
}

function showResults(){

  // gather answer containers from our quiz
  const answerContainers = quizContainer.querySelectorAll('.answers');

  // keep track of user's answers
  let numCorrect = 0;
  let userAnswers = {answers:[]}

  // for each question...
  myQuestions.forEach( (currentQuestion, questionNumber) => {

    // find selected answer
    const answerContainer = answerContainers[questionNumber];
    const selector = `input[name=question${questionNumber}]:checked`;
    const userAnswer = (answerContainer.querySelector(selector) || {}).value;
    userAnswers.answers.push(userAnswer)

    // if answer is correct
    if(userAnswer === currentQuestion.correctAnswer){
      // add to the number of correct answers
      numCorrect++;

      // color the answers green
      answerContainers[questionNumber].style.color = 'lightgreen';
    }
    // if answer is wrong or blank
    else{
      // color the answers red
      answerContainers[questionNumber].style.color = 'red';
    }
  });
  userAnswers.score = numCorrect;

  let option = {
    method:"POST",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body:JSON.stringify(userAnswers)};
  fetch("http://localhost:3000/submit",option)
  .then(response => response.json())
  .then(res => {
    console.log(res);
    // show number of correct answers out of total
    resultsContainer.innerHTML = `${res[0].score} out of ${res[0].answers.length} are correct`;
  })


}


const previousButton = document.getElementById("previous");
const nextButton = document.getElementById("next");

// display quiz right away
buildQuiz();

let currentSlide = 0;

function showSlide(n) {
  slides[currentSlide].classList.remove('active-slide');
  slides[n].classList.add('active-slide');
  currentSlide = n;
  if(currentSlide === 0){
    previousButton.style.display = 'none';
  }else{
    previousButton.style.display = 'inline-block';
  }
  if(currentSlide === slides.length-1){
    nextButton.style.display = 'none';
    submitButton.style.display = 'inline-block';
  }  else{
    nextButton.style.display = 'inline-block';
    submitButton.style.display = 'none';
  }

}
function showNextSlide() {
  showSlide(currentSlide + 1);
  number.innerHTML = currentSlide + 1
}

function showPreviousSlide() {
  showSlide(currentSlide - 1);
  number.innerHTML = currentSlide+1
}

// on submit, show results
submitButton.addEventListener('click', showResults);
previousButton.addEventListener("click", showPreviousSlide);
nextButton.addEventListener("click", showNextSlide);
