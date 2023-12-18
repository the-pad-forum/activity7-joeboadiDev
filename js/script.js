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
/*
* Function to finish Quiz
*/
const finishQuiz = () => {
  clearInterval(quizTimeInterval)

  // Time duration user spent taking quiz
  const endTime = new Date()
  const timeTaken = new Date(endTime - startTime)
  const minutes = timeTaken.getUTCMinutes()
  const seconds = timeTaken.getUTCSeconds()

  const correctAnswerCount = questions.filter(
    (q, index) => userAnswer[index] === q.answer).length

    const incorrectAnswersCount = questions.length.correctAnswerCount

    resetTimer()

    const finalScore = calculateScore()
    // TODO: Create a function to calculate score

    const scorePercentage = (finalScore / questions.length) * 100

    // Tag to display the result of Quiz
    let resultsHTML = `
      <h1>Simple Quiz App  Results</h1>
      <p>
        Final Score: ${finalScore} / ${questions.length}
        (${scorePercentage.toFixed(2)}%)
      </p>

      <div class="review-container">
      <h3 class="review-title">Performance Review</h3>
    `
    // Generate personalized feedback
    let feedback = ''
    if(scorePercentage >= 80){
      feedback = 'Excellent work! Keep it up!'
    }else if(scorePercentage >= 50){
      feedback = 'Good effort! Review the incorrect answers to improve further.'
    }else{
      feedback ='Looks you might need some practice. \n Review the material and try retaking the quiz'
    }

    resultsHTML += `<p class="feedback">${feedback}</p>`

    // Compile results for each question
    questions.forEach((question, index) => {
      const userAnswers = userAnswers[index]
      const isCorrect = userAnswers === question.answer
      const correctClass = isCorrect ? 'correct-answer' : 'incorrect-answer'

      resultsHTML += `
        <div class="question-review ${correctClass}">
          <p>Question ${index + 1}: ${question.question}</p>
          <p>Your answer: ${userAnswers || 'No answer'}</p>
          <p>${isCorrect ? 'Correct' : 'Incorrect'}</p>
        </div>  
      `
    })

    resultsHTML += `
      <button id="retry-quiz" onclick="location.reload();">
          Retry Quiz
      </button>
      `

    resultsHTML += `
      <button id="download-pdf" onclick="generatePDF();">
          Download PDF Report
      </button>
    `

    // Display the Results
    document.getElementById('quiz-container').innerHTML = resultsHTML

    // Data for Chart
    const correctAnswers = questions.filter(
      (q, index) => userAnswer[index] === q.answer
    ).length

    const incorrectAnswers = questions.length - correctAnswers

    // Canvas element for Chart
    resultsHTML += `<canvas id="resultsChart" width="400" height="400"><canvas/>
                    </div>` // End of "Review Container" div

  document.getElementById('quiz-container').innerHTML = resultsHTML

  // Generate Chart
  const ctx = document.getElementById('resultsChart').getContext('2d')
  const resultsChart = new Chart(ctx,{
    type: 'pie',
    data:{
      labels:['Correct Answers', 'Incorrect Answers'],
      datasets:[
        {
          label: 'Quiz Results',
          data: [correctAnswerCount, incorrectAnswersCount],
          backgroundColor:[
            'rgba(0, 128, 0, 0.7)', // Green => Correct
            'rgba(255, 0, 0, 0.7)', // Red => Incorrect
          ],
        },
      ],
    },
  })
}

/*
 * Function to move question 
 */
const goToNextQuestion = () => {
  currentQuestionIndex++
  if(currentQuestionIndex < questions.length) loadQuestion(currentQuestionIndex)
  finishQuiz()
}

/**
 * Function to handle selected option
 */
const handleOptionSelect = (selectedOption, button) => {
  // Create Tooltip
  let tooltip = document.createElement('span')
  tooltip.classList.add('tooltip')
  tooltip.textContent = 'Selected'
  // Method to store user's answer.
  userAnswer[currentQuestionIndex] = selectedOption
  // A method to remove "Selected answer" from the options
  const options = document.querySelectorAll('#options button')
  options.forEach((opt) => opt.classList.remove('selected-answer'))
  // Adding a tooltip to clicked button
  button.appendChild(tooltip)
  // Adding "selected answer" class to clicked button
  button.classList.add('selected-answer')
  // Show Tooltip
  setTimeout(() => {
    tooltip.classList.add('show-tooltip')
  }, 100)
  // Remove Tooltip after some time
  setTimeout(() => {
    tooltip.remove()
  }, 1000) // Adjusting time duration

  // Check for last question
  if(currentQuestionIndex === questions.length - 1){
    finishQuiz()
  }else{
    // Enable for next question if user is not done
    document.getElementById('next-question').disabled = false
  }

  // Visual feedback for selection
  button.classList.add('selected-answer', 'selected-option-color');
}

/**
 * Function to Calculate the Score
 */
const calculateScore = () => {
  let score = 0
  userAnswer.forEach((answer, index) => {
    if(answer === questions[index].answer) {
      score++
    }
  })
  return score
}

/*
* Function to load question
*/
const loadQuestion = (questionIndex) => {
  if(questionIndex === 0){
    //Start timer on the first question
    startTime = new Date()
    startQuizTimer()
  }

  const questionEL = document.getElementById('question')
  const optionsEL = document.getElementById('options')
  const progressEL = document.getElementById('progress')

  // Update progress
  progressEL.innerText = `Question ${questionIndex + 1} of ${questions.length}`
  // Load first question
  loadQuestion(currentQuestionIndex)
  // Set the question text
  questionEL.innerText = questions[questionIndex].question
  // Clear previous options
  optionsEL.innerHTML = ''

// Load options, Add eventListeners
questions[questionIndex].options.forEach((option) =>{
  const button = document.createElement('button')
  button.innerText = option
  button.classList.add('btn', 'btn-primary', 'btn-lg', 'my-2') //Bootsrap classes

  button.addEventListener('click', () => 
    handleOptionSelect(option, button))
    optionsEL.appendChild(button)
  })

// Disable the Next Question button an option is selected
document.getElementById('next-question').disabled = true

// Start or reset the timer
  if(questionIndex < questions.length - 1){
      startTimer(timeForQuestion, document.getElementById('quiz-timer'))   
    }
}

/*
 *  Function to generate the PDF
 */
const generatePDF = () => {
  const{jsPDF} = window.jsPDF
  const _document = new jsPDF()

  let yPos = 20; //Postion for quiz review

  /*
   * Add quiz information 
   */
  const quizTitle = 'Simple Quiz App Report' //Replace with quiz title
  const quizDate = new Date().toLocaleDateString() // Current Date & Time

  _document.setFontSize(24)
  _document.setFont('helvetica','bold')
  _document.text(quizTitle, 20, yPos)
  _document.setFont('helvetica', 'normal')

  /*
  * Add final score
  */
  const finalScore = calculateScore()
  const scorePercentage = `Final Score: ${finalScore}/${questions.length}(${scorePercentage.toFixed(2)}%)`


  _document.setFontSize(11) // Decrease font size of final score date
  _document.text(scorePercentage, 20, (yPos += 7)) // Add score summary
  _document.text(`Date: ${quizDate}`, 75, yPos) // Add Date on the same line as score summary
  _document.setFontSize(12) // Reset fonnt size to default
  _document.line(20,32,190,31) //Add horizontal line
  _document.text("", 20, (yPos += 10)) // Add empty space after horizontal

  /*
  * Add detailed question review
  */
 questions.forEach((question, index) => {
  const userAnswers = userAnswers[index] || 'No Answer'
  const correctAnswer = question.answer
  const isCorrect = userAnswers === correctAnswers
  const questionNumber = `Q${index + 1}`
  const questionText = `${question.question}`
  const answerText = `Your Answer: ${userAnswers}(${isCorrect ? 'Correct': 'Incorrect'})`

  _document.setTextColor(100, 102, 104)
  _document.text(answerText, 30, (yPos += 5))
  _document.setTextColor(0, 0, 0)

  yPos += 3
  if(yPos > 270){
    _document.addPage()
    yPos = 20
  }
 })

 /*
 * Ad graphical representation of results
 */
  const correctAnswers = calculateScore()
  const
  incorrectAnswers = questions.length - correctAnswers
  yPos += 10 // Adjusted yPos after adding questions
  _document.setFontSize(10) // Decrease font size for visualization
  _document.text('Visualization', 23, yPos + 20, {angle:90}) // Add vertical effect
  _document.rect(25 + correctAnswers * 3, yPos, incorrectAnswers * 3, 20) //Bar for incorrect answers
  _document.rect(25, yPos, correctAnswers * 3, 20, 'F') // Bar for correct answers
  _document.text(`Correct[filled]: ${correctAnswers}`, 25, (yPos += 24))
  _document.text(`Incorrect [no fill]:${incorrectAnswers}`, 55, (yPos))
  _document.setFontSize(10)

  /*
  *  Generate personalized feedback
  */
  let feedback = ""
  if(scorePercentage >= 80){
    feedback = "Excellent work! Keep it up!"
  }else if(scorePercentage >= 50){
    feedback = "Good effort! Review the incorrect answers to improve further"
  }else{
    feedback = "'Looks you might need some practice. \n Review the material and try retaking the quiz"
  }

  _document.text(feedback, 25, (yPos += 5)) //Add feedback
  _document.line(20, 270, 190, 270) //Add horizontal

  _document.save('Quiz Report.pdf')
}

// Add eventListener for next question
document.getElementById('next-question').addEventListener('click', () => {
  currentQuestionIndex++
  if(currentQuestionIndex < questions.length){
    loadQuestion(currentQuestionIndex)
  }else{
    // TODO: Display result after end of quiz
  }
})

// Start button interaction and response.
document.getElementById('quiz-start-btn')
  .addEventListener('click', () =>{
    startQuizTimer() //Timer to start when quiz starts
    document.getElementById('quiz-content').style.display = 'block' //Display quiz
    document.getElementById('quiz-start-text').style.display = 'none' // Hide start button
    loadQuestion(0) //First question load
    this.style.display = 'none'// HIde start button
  })

  loadQuestion(questionIndex)