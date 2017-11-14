/* global $ */
'use strict';

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

/**********/
//STEP 1: RENDER
//**********/

function render() {

  if (STORE.currentView === 'start') {
    $('.intro').show();
    $('.intro').html(introTemplate);
    $('.questions').hide();
    $('.feedback').hide();
    $('.score').hide();
    $('.outro').hide();

  } 
  else if (STORE.currentView === 'questions' && STORE.userCorrectAnswers[STORE.currentQuestionIndex]) {
    $('.questions').show();
    $('.questions').html(questionTemplate);
    $('.intro').hide();
    $('.feedback').show();
    $('.feedback').append(correctAnswerTemplate);
    $('.outro').hide();

  }
  else if (STORE.currentView === 'questions' && STORE.userIncorrectAnswers[STORE.currentQuestionIndex]) {
    $('.intro').hide();
    $('.questions').show();
    $('.questions').html(questionTemplate);
    $('.feedback').show();
    $('.feedback').append(wrongAnswerTemplate);
    $('.outro').hide();
  }
  else if (STORE.currentView === 'questions') {
    $('.intro').hide();
    $('.questions').show();
    $('.questions').html(questionTemplate);
    $('.feedback').hide();
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


/*******/
//Template generators//
/*****/

const introTemplate = function() {
  return `<h1>His Airness, Michael Jordan:<br> How much do you know?</h1>
  <img src='jordandunk.jpg' class='js-splash-page-dunk alt='Michael Jordan dunking the basketball from free throw line'>
    <input type='submit' class='js-the-button' id='startButton' value='Start Quiz'>`;
};

const correctAnswerTemplate = function() {
  return `
  <p class='js-feedback>Correct!</p>
  `;
};

const wrongAnswerTemplate = function() {
  return `
  <p class='js-feedback><p>Sorry, that is incorrect.</p>
  `;
};

const resultsTemplate = function() {
  return `
  <div class='js-outro'>Reset quiz to play again
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
    <div>Current score: ${handleScore()}%</div>
  </form>
    
  `;
};


/**********/
//STEP 2: EVENT LISTENERS(USER INPUT)
/*********/

function handleQuizStart() {
  changeView('start');
  $('.js-quiz-container').on('click', '#startButton', function(e) {
    e.preventDefault();
    changeView('questions');
    STORE.currentQuestionIndex = 0;
    render();
  });

}

function handleResetButton() {
  $('.js-quiz-container').on('click', '#js-reset-quiz', function(e) {
    e.preventDefault();
    STORE['userAnswer'] = [];
    handleQuizStart();
    render();
  });
}


function handleAnswerSubmitted() {
  $('.js-quiz-container').on('click', '#js-answersSubmit', function(e) {
    e.preventDefault();    
    if (STORE.currentQuestionIndex === QUESTIONS.length) {
      handleResults();
      render();
    } 
    else {
      const answer = $('input[name=answers]:checked').val(); 
      STORE.userAnswer.push(answer);
      checkAnswer(answer);
      $('input[type=radio]').prop('checked',false); 
      STORE.currentQuestionIndex++;
      render();
    }
  });
}


//bugs: results page anf feedback will not render.

/***************/
//STEP 3: Helper Functions
/**************/

function checkAnswer(answer) {
  if (STORE.userAnswer[STORE.currentQuestionIndex] === QUESTIONS[STORE.currentQuestionIndex].correctAnswer) {
    STORE.userCorrectAnswers.push(answer);
    changeView('feedback');
    render();
  } else {
    STORE.userIncorrectAnswers.push(answer);
    render();
  }
}

function changeView(view) {
  STORE.currentView = view;
  //grab from event handler
}

function handleResults() {
  changeView('results');
  handleResetButton();
  render();

}

function handleScore() {
  const percentage = STORE.currentScore/5*100;
  return percentage;
}

//**********/
//STEP 0: INITIALIZATION
//*********/

$(document).ready(function() {
  render();
  handleQuizStart();
  handleAnswerSubmitted();
  handleResetButton();
  handleScore();

});


