var answers = document.querySelector(".answers")
var nextButton = document.querySelector(".nextBtn")
var question = document.querySelector(".question")
var questionContainer = document.querySelector(".questionContainer")
var resultsContainer = document.querySelector(".resultsContainer")
var percentageValue = document.querySelector(".progressValue")
var restartButton = document.querySelector(".restartButton")

// var questionNumber = 0
// window.localStorage.setItem("questionNumber",0)
// window.localStorage.setItem("correctAnswers",0)

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
var questionNumber


async function start(){
  nextButton.addEventListener("click",nextButtonClicked)
  restartButton.addEventListener("click",restartButtonClicked)
  for (var i=0;i<4;i++){
    newAnswer = document.createElement("button")
    newAnswer.classList.add("btn")
    newAnswer.setAttribute("id","answer"+i)
    newAnswer.addEventListener("click", answerClicked)
    answers.appendChild(newAnswer)
    answersArray[i] = newAnswer
  }
  nextQuestion()
}

function nextButtonClicked(e){
  nextQuestion()
}

function restartButtonClicked(){
  console.log("test")
  window.localStorage.setItem("questionNumber",0)
  window.localStorage.setItem("correctAnswers",0)
  questionContainer.classList.remove("hide")
  resultsContainer.classList.add("hide")
  nextQuestion()
}

function convertColourTo2DigitHex(colour){
  twoDigit = parseInt(colour,10).toString(16)
  if (twoDigit.length < 2){
    console.log(twoDigit)
    return "0" + twoDigit
  } else{
    console.log(twoDigit)
    return twoDigit
  }
}

function convertToHex(colour){
  red = convertColourTo2DigitHex(colour[0])
  green = convertColourTo2DigitHex(colour[1])
  blue = convertColourTo2DigitHex(colour[2])

  hexCode = "#"+red+green+blue
  return hexCode
}

function convertStepsToColour(steps){
  if (steps<=255){
    return [255,steps,0]
  }else if (steps<=510){
    return [510-steps,255,0]
  }else{
    return [0,765-steps,0]
  }
}

function openResultsScreen(){
  questionContainer.classList.add("hide")
  resultsContainer.classList.remove("hide")
  correctAnswers = window.localStorage.getItem("correctAnswers")
  questionNumber = window.localStorage.getItem("questionNumber")
  console.log(questionNumber)
  if (questionNumber == 0 || questionNumber == null || questionNumber == undefined){
    restartButtonClicked()
  }
  percentage = Math.round(correctAnswers / questionNumber * 100)
  percentageValue.innerHTML = percentage + "%"
  if (percentage > 50){
    middleAngle = 180
    firstAngle = 180
    secondHalfPercentage = (percentage - 50) / 50
    secondAngle = secondHalfPercentage * 180
  }else{
    firstHalfPercentage = percentage / 50
    firstAngle = firstHalfPercentage * 180
    middleAngle = firstAngle/2
    secondAngle = 0
  }
  startColour = [255,0,0]
  console.log(startColour)
  bestColour = [0,255,0]

  steps = 665
  endSteps = Math.round(steps*percentage/100)
  endColour = convertStepsToColour(endSteps)
  // middleSteps = Math.round(endSteps/2)
  // middleColour = convertStepsToColour(middleSteps)
  // multiplier = percentage / 100
  // endColour = [(startColour[0]*(1-multiplier)+bestColour[0]*multiplier)/2,(startColour[1]*(1-multiplier)+bestColour[1]*multiplier)/2,(startColour[2]*(1-multiplier)+bestColour[2]*multiplier)/2]
  middleColour = [(startColour[0]+endColour[0])/2,(startColour[1]+endColour[1])/2,(startColour[2]+endColour[2])/2]
  startColour = convertToHex(startColour)
  middleColour = convertToHex(middleColour)
  endColour = convertToHex(endColour)
  console.log(startColour,middleColour,endColour)
  document.querySelectorAll(".progressBar").forEach(bar => {
    bar.style.setProperty("--backgroundStartColour",startColour)
    bar.style.setProperty("--backgroundEndColour",endColour)
    bar.style.setProperty("--backgroundMiddleColour",middleColour)
    bar.style.setProperty("--middleAngle",middleAngle+"deg")
    bar.style.setProperty("--secondAngle",secondAngle+"deg")
    bar.style.setProperty("--firstAngle",firstAngle+"deg")
  })
}

async function nextQuestion(){
  questionNumber = window.localStorage.getItem("questionNumber")
  questionsInformation = await getQuizQuestions(["elevenPlusMaths",questionNumber])
  if (questionsInformation == "nothing"){
    // alert("Reached end of questions")
    openResultsScreen()
  }else{
    questionsInformation = JSON.parse(questionsInformation)  //this converts it into a JSON object so can work like a dictionary
    correctAnswer = "answer" + questionsInformation["correctAnswer"]
    nextButton.classList.add("hide")
    for (var i=0;i<answersArray.length;i++){
      answersArray[i].classList.remove("correct")
      answersArray[i].classList.remove("wrong")
    }
    questionContainer.classList.remove("green-glow")
    questionContainer.classList.remove("red-glow")
    question.innerHTML = questionsInformation["question"]
    for (var i=0;i<4;i++){
      answersArray[i].innerHTML = questionsInformation["answer"+i]
    }
  }
}

function answerClicked(e){
  if (nextButton.classList.contains("hide")){
    var answerPressed = e.target;
    checkIfCorrect(answerPressed)
    questionNumber = window.localStorage.getItem("questionNumber")
    questionNumber++;
    questionNumber = window.localStorage.setItem("questionNumber",questionNumber)
  }
}

function checkIfCorrect(answerElement){
  if (answerElement.getAttribute("id") == correctAnswer){
    questionContainer.classList.add("green-glow")
    correctAnswers = window.localStorage.getItem("correctAnswers")
    correctAnswers++;
    window.localStorage.setItem("correctAnswers",correctAnswers)
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
