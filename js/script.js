/*Declaration of variables */
let currentQuestionIndex = 0
let userAnswers = [] // to store user's answers
let timeInterval
let timeForQuestion = 30  // in seconds for each
let startTime
let totalTime = 300 // Total time for quiz(300s = 5 minutes)
let quizTimeInterval


/*
*  Declare a function to start quiz tiner
*/
const startQuizTimer = () => {
  let timeRemaining = totalTime
  quizTimeInterval = setInterval(() =>{
    if(timeRemaining <= 0){
      clearInterval(quizTimeInterval)
      finishQuiz();
    }else{
      timeRemaining--
      updateTimerDisplay(timeRemaining)
    }
  }, 1000)
}

/*
* Function to update timer
*/
const updateTimerDisplay = (timeRemaining) => {
  const minutes = Math.floor(timeRemaining/60)
  const seconds = timeRemaining % 60
  document.getElementById('quiz-timer').textContent = `${minutes}: ${seconds < 10 ? '0':""}${seconds}`
}

/*
* Function to reset timer 
*/
const resetTimer = () => {
  if(timeInterval){
    clearInterval(timeInterval)
    timeInterval = null
  }
}

/*
* Function to start timer
*/
const startTimer = (duration, display) => {
  let timer = duration
  display.textContent = formatTime(timer)
  resetTimer(); // Clear any existing timer.

  timeInterval = setInterval(function(){
    timer--
    display.textContent = formatTime(timer)
    if(timer <= 0){
      clearInterval(timeInterval)
      if(currentQuestionIndex < currentQuestionIndex.length - 1){
        goToNextQuestion()
      }else{
        finishQuiz()
      }
    }
  }, 1000)
}

/*
* Function to format the time.
*/
const formatTime = (time) =>{
  let minutes = parseInt(time / 60, 10)
  let seconds = parseInt(time % 60, 10)

  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds

  return minutes + ':' + seconds
}