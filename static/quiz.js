var answers = document.querySelector(".answers")
var nextButton = document.querySelector(".nextBtn")
var question = document.querySelector(".question")
var questionContainer = document.querySelector(".questionContainer")

// var questionNumber = 0
window.localStorage.setItem("questionNumber",0)
window.localStorage.setItem("correctAnswers",0)

const getQuizQuestions = async (info) => {
  const url = '/getQuizQuestions'; // the URL to send the HTTP request to
  const body = JSON.stringify(info); // whatever you want to send in the body of the HTTP request
  const headers = {'Content-Type': 'application/json'}; // if you're sending JSON to the server
  const method = 'POST';
  const response = await fetch(url, { method, body, headers });
  const data = await response.text(); // or response.json() if your server returns JSON
  return data
}

answersArray = new Array()
// correctAnswer = "answer1"
start()



async function start(){
  // questionsInformation = await getQuizQuestions(["elevenPlusMaths",questionNumber])
  // questionsInformation = JSON.parse(questionsInformation)  //this converts it into a JSON object so can work like a dictionary
  // console.log(questionsInformation["answer0"])
  // question.innerHTML = questionsInformation["question"]
  nextButton.addEventListener("click",nextButtonClicked)
  for (var i=0;i<4;i++){
    newAnswer = document.createElement("button")
    newAnswer.classList.add("btn")
    newAnswer.setAttribute("id","answer"+i)
    // newAnswer.innerHTML = questionsInformation["answer"+i]
    newAnswer.addEventListener("click", answerClicked)
    answers.appendChild(newAnswer)
    answersArray[i] = newAnswer
  }
  nextQuestion()
}

function nextButtonClicked(e){
  nextQuestion()
}

function openResultsScreen(){
  questionContainer.classList.add("hide")
}

async function nextQuestion(){
  questionNumber = window.localStorage.getItem("questionNumber")
  alert(questionNumber)
  questionsInformation = await getQuizQuestions(["elevenPlusMaths",questionNumber])
  if (questionsInformation == "nothing"){
    alert("Reached end of questions")
    openResultsScreen()
  }else{
    questionsInformation = JSON.parse(questionsInformation)  //this converts it into a JSON object so can work like a dictionary
    correctAnswer = "answer" + questionsInformation["correctAnswer"]
    nextButton.classList.add("hide")
    for (var i=0;i<answersArray.length;i++){
      answersArray[i].classList.remove("correct")
      answersArray[i].classList.remove("wrong")
    }
    questionNumber = window.localStorage.getItem("questionNumber")
    questionNumber++;
    questionNumber = window.localStorage.setItem("questionNumber",questionNumber)
    questionContainer.classList.remove("green-glow")
    questionContainer.classList.remove("red-glow")
    question.innerHTML = questionsInformation["question"]
    for (var i=0;i<4;i++){
      answersArray[i].innerHTML = questionsInformation["answer"+i]
    }
  }
}

function answerClicked(e){
  var answerPressed = e.target;
  checkIfCorrect(answerPressed)
}

function checkIfCorrect(answerElement){
  if (answerElement.getAttribute("id") == correctAnswer){
    questionContainer.classList.add("green-glow")
  } else{
    questionContainer.classList.add("red-glow")
  }
  nextButton.classList.remove("hide")
  for (var i=0;i<answersArray.length;i++){
    if (answersArray[i].getAttribute("id") == correctAnswer){
      answersArray[i].classList.add("correct")
    } else{
      answersArray[i].classList.add("wrong")
    }
  }
}
