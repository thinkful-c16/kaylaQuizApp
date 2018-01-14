/* global $ */
'use strict';

//**********/
//STEP 0: INITIALIZATION
//*********/

$(document).ready(function() {
  render();
  handleQuizStart();
  handleAnswerSubmitted();
  handleResetButton();
  handleCurrentScore();

});


/******************************************************** 
Step 1: Define objects & database 
********************************************************/

const QUESTIONS = [
  {question: 'What position did he play?', 
    answers: ['Point guard', 'Center', 'Power Forward', 'Shooting guard', 'Small Forward'], 
    correctAnswer: 'Shooting guard'},
  {question: 'Jordan made a NBA comeback in 2001. Which team did he play for?', 
    answers: ['Chicago Bulls', 'Washington Wizards', 'Boston Celtics', 'Phoenix Suns', 'Los Angeles Lakers'],
    correctAnswer: 'Washington Wizards'},
  {question: 'In 2010, Michael became majority owner of which NBA team?', 
    answers: ['Oklahoma City Thunder', 'Houston Rockets', 'Philadelphia 76ers', 'Charlotte Bobcats', 'Chicago Bulls'], 
    correctAnswer: 'Charlotte Bobcats'},
  {question: 'Which of the following NBA players did NOT appear in the film Space Jam?', 
    answers: ['Larry Bird', 'Shawn Bradley', 'Charles Barkley', 'Muggsy Bogues', 'Kobe Bryant'],
    correctAnswer: 'Kobe Bryant'},
  {question: 'How many NBA Championships did Michael have?', 
    answers: ['6', '10', '4', '8', '3'],
    correctAnswer: '6'}];

const STORE = {
  currentQuestionIndex: null,
  userAnswer: [],
  userCorrectAnswers: [],
  userIncorrectAnswers: [],
  currentView: 'start',
  currentScore: 0,

};

/***********************/
//TEMPLATE GENERATORS//
/**********************/

const introTemplate = function() {
  return `<h1 id='js-quiz-header'>His Airness, Michael Jordan:<br> How much do you know?</h1>
  <img id='js-jordan-dunk' src='jordandunk.jpg' class='js-splash-page-dunk alt='Michael Jordan dunking the basketball from free throw line'>
    <input type='submit' class='js-the-button' id='startButton' value='Start Quiz'>`;
};

const correctAnswerTemplate = function() {
  return `
  <p class='js-feedback'>Correct!</p>
  `;
};

const wrongAnswerTemplate = function() {
  return `
  <p class='js-feedback'><p>Sorry, that is incorrect.</p>
  `;
};

const resultsTemplate = function() {
  return `
  <div class='js-outro'>
    <p>You scored ${handleFinalScore()}</p><br>
      <p>Reset quiz to play again</p><br>
  <input type='submit' id='js-reset-quiz' value='Reset Quiz'></div>
  `;

};

const questionTemplate = function() {
  return `<div class='js-questions' 'js-question-item-${STORE.currentQuestionIndex}>${QUESTIONS[STORE.currentQuestionIndex].question}</div<br>
  <div class='js-answer-choices'>
  <form id='js-answerSelected'>
    <input type='radio' name='answers' id='js-choice1' value='${QUESTIONS[STORE.currentQuestionIndex].answers[0]}'>
    <label for='js-choice1'>${QUESTIONS[STORE.currentQuestionIndex].answers[0]}</label><br/>
    <input type='radio' name='answers' value='${QUESTIONS[STORE.currentQuestionIndex].answers[1]}'>
    <label for='js-choice2' id='js-choice2'>${QUESTIONS[STORE.currentQuestionIndex].answers[1]}</label><br/>
    <input type='radio' name='answers' value='${QUESTIONS[STORE.currentQuestionIndex].answers[2]}'>
    <label for='js-choice3' id='js-choice3'>${QUESTIONS[STORE.currentQuestionIndex].answers[2]}</label><br/>
    <input type='radio' name='answers' value='${QUESTIONS[STORE.currentQuestionIndex].answers[3]}'>
    <label for='js-choice4' id='js-choice4'>${QUESTIONS[STORE.currentQuestionIndex].answers[3]}</label><br/>
    <input type='radio' name='answers' value='${QUESTIONS[STORE.currentQuestionIndex].answers[4]}'>
    <label for='js-choice5' id='js-choice5'>${QUESTIONS[STORE.currentQuestionIndex].answers[4]}</label><br/>
    <input type='submit' id='js-answersSubmit' class='js-the-button' value='Enter'>
    <input type='submit' id='js-reset-quiz' value='Reset Quiz'>
    </div>Question ${STORE.currentQuestionIndex+1} of ${QUESTIONS.length}</div>
    <div>Current score: ${handleCurrentScore()}</div>
  </form>
    
  `;
};


/**********/
//STEP 1: RENDER
//**********/

function render() {

  if (STORE.currentView === 'start') {
    $('.intro').show();
    $('.intro').append(introTemplate);
    $('.questions').hide();
    $('.feedback').hide();
    $('.score').hide();
    $('.outro').hide();

  } 
  else if ((STORE.currentView === 'questions') && (STORE.userCorrectAnswers[STORE.currentQuestionIndex])) {
    $('.questions').show();
    $('.questions').append(questionTemplate);
    $('.intro').hide();
    $('.feedback').show();
    $('.answer-incorrect').hide();
    // $('.feedback').html(correctAnswerTemplate);
    $('.outro').hide();

  }
  else if ((STORE.currentView === 'questions') && (STORE.userIncorrectAnswers[STORE.currentQuestionIndex])) {
    $('.intro').hide();
    $('.questions').show();
    $('.feedback').show();
    $('.answer-correct').show();
    // $('.feedback').html(wrongAnswerTemplate);
    $('.outro').hide();
  }
  else if (STORE.currentView === 'questions') {
    $('.intro').hide();
    $('.questions').show();
    $('.questions').html(questionTemplate);
    $('.score').hide();
    $('.outro').hide();
  }

  else {
    $('.outro').show();
    $('.outro').html(resultsTemplate);
    $('.intro').hide();
    $('.questions').hide();
    $('.feedback').hide();

  }
}



/**********/
//STEP 2: EVENT LISTENERS(USER INPUT)
/*********/

function handleQuizStart() {
  changeView('start');
  $('.js-quiz-container').on('click', '#startButton', function(e) {
    e.preventDefault();
    changeView('questions');
    STORE.currentQuestionIndex = 0;
    handleCurrentScore();
    render();
  });

}

function handleResetButton() {
  $('.js-quiz-container').on('click', '#js-reset-quiz', function(e) {
    e.preventDefault();
    STORE['userAnswer'] = [];
    STORE['userCorrectAnswers'] = [];
    STORE['userIncorrectAnswers'] = [];
    STORE['currentScore'] = 0;
    handleQuizStart();
    render();
  });
}



function handleAnswerSubmitted() {
  $('.js-quiz-container').on('click', '#js-answersSubmit', function(e) {
    e.preventDefault();    
    if (STORE.currentQuestionIndex === (QUESTIONS.length-1)) {
      const lastAnswer = $('input[name=answers]:checked').val(); 
      STORE.userAnswer.push(lastAnswer);
      checkAnswer(lastAnswer);
      handleResults();
      render();
    } 
    else {
      const answer = $('input[name=answers]:checked').val(); 
      STORE.userAnswer.push(answer);
      checkAnswer(answer);
      STORE.currentQuestionIndex++;
      render();
    }
  });
}

function handleCorrectAnswer() {

  $('.answer-correct').show();
}

function handleWrongtAnswer() {
  $('.answer-incorrect').show();
}



/***************/
//STEP 3: Helper Functions
/**************/

function checkAnswer(answer) {
  if (STORE.userAnswer[STORE.currentQuestionIndex] === QUESTIONS[STORE.currentQuestionIndex].correctAnswer) {
    STORE.userCorrectAnswers.push(answer);
    render();
  } else {
    STORE.userIncorrectAnswers.push(answer);
    render();
  }
}

function changeView(view) {
  STORE.currentView = view;
}

function handleResults() {
  changeView('results');
  handleResetButton();
  render();

}

function handleCurrentScore() {
  //handling empty arrays if user has either no incorrect answers or no correct answers
  if (STORE.currentView === 'results' && STORE.userCorrectAnswers === []) {
    STORE.userCorrectAnswers = 0;
  } 
  else if (STORE.currentView === 'results' && STORE.userIncorrectAnswers === []) {
    STORE.userIncorrectAnswers = 0;
  } 
  const score = STORE.userCorrectAnswers.length;
  return score;
}

function handleFinalScore() {
  const finalScore = STORE.userAnswers.length/STORE.userCorrectAnswers.length*100;
  if (finalScore === Infinity) {
    return 100;
  } else {
    return finalScore;
  }
}




