// Глобальные переменные
let testTimer;
let timeRemaining = 25 * 60;
let currentTest = [];
let currentQuestionIndex = 0;
let userAnswers = [];
let testStartTime;
let currentDifficulty = '';
let currentSection = '';
let userName = '';

// Функции навигации
function startHome() {
  const input = document.getElementById('userNameInput').value.trim();
  if (input === '') {
    alert('Пожалуйста, введите ваше имя');
    return;
  }
  userName = input;
  localStorage.setItem('lastUserName', userName);
  
  document.getElementById('namePage').classList.add('hidden');
  document.getElementById('homePage').classList.remove('hidden');
}

function showHome() {
  stopTimer();
  
  document.getElementById('homePage').classList.remove('hidden');
  document.getElementById('integralsSection').classList.add('hidden');
  document.getElementById('derivativesSection').classList.add('hidden');
  document.getElementById('seriesSection').classList.add('hidden');
  document.getElementById('testPage').classList.add('hidden');
  document.getElementById('resultsPage').classList.add('hidden');
  document.getElementById('statisticsPage').classList.add('hidden');
}

function showSection(section) {
  currentSection = section;
  document.getElementById('homePage').classList.add('hidden');
  document.getElementById('integralsSection').classList.add('hidden');
  document.getElementById('derivativesSection').classList.add('hidden');
  document.getElementById('seriesSection').classList.add('hidden');
  
  if (section === 'integrals') {
    document.getElementById('integralsSection').classList.remove('hidden');
  } else if (section === 'derivatives') {
    document.getElementById('derivativesSection').classList.remove('hidden');
  } else if (section === 'series') {
    document.getElementById('seriesSection').classList.remove('hidden');
  }
}

// Функции таймера
function startTimer() {
  updateTimerDisplay();

  if (testTimer) clearInterval(testTimer);

  testTimer = setInterval(() => {
    timeRemaining--;
    updateTimerDisplay();

    if (timeRemaining <= 0) {
      clearInterval(testTimer);
      alert('Время вышло! Тест будет завершён автоматически.');
      finishTest();
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const display = `⏱️ ${minutes}:${seconds.toString().padStart(2, '0')}`;
  
  const timerElement = document.getElementById('timerDisplay');
  if (timerElement) {
    timerElement.textContent = display;
    
    if (timeRemaining <= 300) {
      timerElement.className = 'text-lg font-semibold text-red-600 bg-red-50 px-4 py-2 rounded-lg animate-pulse';
    } else if (timeRemaining <= 600) {
      timerElement.className = 'text-lg font-semibold text-orange-600 bg-orange-50 px-4 py-2 rounded-lg';
    } else {
      timerElement.className = 'text-lg font-semibold text-green-600 bg-green-50 px-4 py-2 rounded-lg';
    }
  }
}

function stopTimer() {
  if (testTimer) {
    clearInterval(testTimer);
    testTimer = null;
  }
}

// Функции теста
    function startDerivativesTest(difficulty) {
      currentSection = 'derivatives';
      const timeSelect = document.getElementById('derivativesTime');
      const selectedTime = parseInt(timeSelect.value) * 60;
      timeRemaining = selectedTime;
      currentDifficulty = difficulty;
      
      let questionPool;
      if (difficulty === 'easy') questionPool = easyDerivativesQuestions;
      else if (difficulty === 'medium') questionPool = mediumDerivativesQuestions;
      else questionPool = hardDerivativesQuestions;
      
      currentTest = [...questionPool].sort(() => 0.5 - Math.random()).slice(0, Math.min(20, questionPool.length));
      currentQuestionIndex = 0;
      userAnswers = new Array(currentTest.length).fill(null);
      testStartTime = Date.now();
      
      document.getElementById('derivativesSection').classList.add('hidden');
      document.getElementById('testPage').classList.remove('hidden');
      document.getElementById('resultsPage').classList.add('hidden');
      
      document.getElementById('totalQuestions').textContent = currentTest.length;
      document.getElementById('difficultyLabel').textContent = `Уровень: ${difficulty === 'easy' ? 'Легкий' : difficulty === 'medium' ? 'Средний' : 'Сложный'}`;
      document.getElementById('testTitle').textContent = 'Тест: Производные';
      
      startTimer();
      displayQuestion();
    }

    function startIntegralsTest(difficulty) {
      currentSection = 'integrals';
      const timeSelect = document.getElementById('integralsTime');
      const selectedTime = parseInt(timeSelect.value) * 60;
      timeRemaining = selectedTime;
      currentDifficulty = difficulty;

      let questionPool;
      if (difficulty === 'easy') questionPool = easyIntegralsQuestions;
      else if (difficulty === 'medium') questionPool = mediumIntegralsQuestions;
      else if (difficulty === 'hard') questionPool = hardIntegralsQuestions;

      currentTest = [...questionPool].sort(() => 0.5 - Math.random()).slice(0, Math.min(20, questionPool.length));
      currentQuestionIndex = 0;
      userAnswers = new Array(currentTest.length).fill(null);
      testStartTime = Date.now();

      document.getElementById('integralsSection').classList.add('hidden');
      document.getElementById('testPage').classList.remove('hidden');
      document.getElementById('resultsPage').classList.add('hidden');

      document.getElementById('totalQuestions').textContent = currentTest.length;
      document.getElementById('difficultyLabel').textContent = `Раздел: Интегралы, уровень: ${difficulty === 'easy' ? 'Легкий' : difficulty === 'medium' ? 'Средний' : 'Сложный'}`;
      document.getElementById('testTitle').textContent = 'Тест: Интегралы';

      startTimer();
      displayQuestion();
    }

    // Функции для нового раздела "Ряды и последовательности"
    function startSeriesTest(difficulty) {
      currentSection = 'series';
      const timeSelect = document.getElementById('seriesTime');
      const selectedTime = parseInt(timeSelect.value) * 60;
      timeRemaining = selectedTime;
      currentDifficulty = difficulty;
      
      let questionPool;
      if (difficulty === 'easy') questionPool = easySeriesQuestions;
      else if (difficulty === 'medium') questionPool = mediumSeriesQuestions;
      else questionPool = hardSeriesQuestions;
      
      currentTest = [...questionPool].sort(() => 0.5 - Math.random()).slice(0, Math.min(20, questionPool.length));
      currentQuestionIndex = 0;
      userAnswers = new Array(currentTest.length).fill(null);
      testStartTime = Date.now();
      
      document.getElementById('seriesSection').classList.add('hidden');
      document.getElementById('testPage').classList.remove('hidden');
      document.getElementById('resultsPage').classList.add('hidden');
      
      document.getElementById('totalQuestions').textContent = currentTest.length;
      document.getElementById('difficultyLabel').textContent = `Раздел: Ряды и последовательности, уровень: ${difficulty === 'easy' ? 'Легкий' : difficulty === 'medium' ? 'Средний' : 'Сложный'}`;
      document.getElementById('testTitle').textContent = 'Тест: Ряды и последовательности';
      
      startTimer();
      displayQuestion();
    }
    

    
    function restartTest() {
      if (currentSection === 'derivatives') {
        startDerivativesTest(currentDifficulty);
      } else if (currentSection === 'integrals') {
        startIntegralsTest(currentDifficulty);
      } else if (currentSection === 'series') {
        startSeriesTest(currentDifficulty);
      }
    }
   
    function displayQuestion() {
      const question = currentTest[currentQuestionIndex];
      const container = document.getElementById('questionContainer');
      
      container.innerHTML = `
        <div class="mb-6">
          <h3 class="text-xl font-semibold text-gray-800 mb-4 math-container">
            <div class="math-content">${question.question}</div>
          </h3>
        </div>
        
        <div class="space-y-3">
          ${question.options.map((option, index) => `
            <label class="option-label ${userAnswers[currentQuestionIndex] === index ? 'selected' : ''}">
              <input type="radio" name="answer" value="${index}" 
                     class="mr-3 mt-1 flex-shrink-0"
                     ${userAnswers[currentQuestionIndex] === index ? 'checked' : ''} 
                     onchange="selectAnswer(${index})">
              <span class="option-text">
                ${option}
              </span>
            </label>
          `).join('')}
        </div>
      `;
      
      document.getElementById('currentQuestion').textContent = currentQuestionIndex + 1;
      const progress = ((currentQuestionIndex + 1) / currentTest.length) * 100;
      document.getElementById('progressBar').style.width = progress + '%';
      
      document.getElementById('prevBtn').disabled = currentQuestionIndex === 0;
      
      const nextBtn = document.getElementById('nextBtn');
      const finishBtn = document.getElementById('finishBtn');
      
      if (currentQuestionIndex === currentTest.length - 1) {
        nextBtn.style.display = 'none';
        finishBtn.style.display = 'inline-block';
      } else {
        nextBtn.style.display = 'inline-block';
        finishBtn.style.display = 'none';
      }
      
      if (window.MathJax) {
        MathJax.typesetPromise([container]).catch((err) => console.log(err.message));
      }
    }

    function selectAnswer(answerIndex) {
      userAnswers[currentQuestionIndex] = answerIndex;
    }

    function nextQuestion() {
      if (currentQuestionIndex < currentTest.length - 1) {
        currentQuestionIndex++;
        displayQuestion();
      } else {
        finishTest();
      }
    }

    function previousQuestion() {
      if (currentQuestionIndex > 0) {
        currentQuestionIndex--;
        displayQuestion();
      }
    }

function finishTest() {
  stopTimer();
  
  let correctAnswers = 0;
  const results = [];
  
  for (let i = 0; i < currentTest.length; i++) {
    const isCorrect = userAnswers[i] === currentTest[i].correct;
    if (isCorrect) correctAnswers++;
    
    results.push({
      question: currentTest[i].question,
      userAnswer: userAnswers[i] !== null ? currentTest[i].options[userAnswers[i]] : 'Не отвечено',
      correctAnswer: currentTest[i].options[currentTest[i].correct],
      isCorrect: isCorrect
    });
  }
  
  const percentage = Math.round((correctAnswers / currentTest.length) * 100);
  
  // Сохраняем результаты теста
  saveTestResult(percentage, currentSection, currentDifficulty);
  
  document.getElementById('testPage').classList.add('hidden');
  document.getElementById('resultsPage').classList.remove('hidden');
  
  const scoreDisplay = document.getElementById('scoreDisplay');
  const scoreText = document.getElementById('scoreText');
  const detailedResults = document.getElementById('detailedResults');
  
  scoreDisplay.textContent = `${correctAnswers}/${currentTest.length}`;
  scoreDisplay.className = percentage >= 70 
      ? 'text-6xl font-bold mb-4 text-green-600' 
      : 'text-6xl font-bold mb-4 text-red-600';
  
  let comment = '';
  if (percentage === 100) {
    comment = `${userName}, феноменально! Вы набрали все баллы — поздравляю!`;
  } else if (percentage >= 90) {
    comment = `${userName}, отлично! Вы справились с тестом почти идеально!`;
  } else if (percentage >= 60) {
    comment = `${userName}, хорошо! Вы справились с тестом, но можно ещё улучшить результат.`;
  } else if (percentage >= 30) {
    comment = `${userName}, неплохо, но есть над чем поработать. Попробуйте пройти тест ещё раз.`;
  } else {
    comment = `Не отчаивайтесь, ${userName}. Этот тест пока сложен, попробуйте ещё раз!`;
  }
  
  scoreText.textContent = comment;
  
  detailedResults.innerHTML = `
    <h3 class="text-lg font-semibold mb-4">Детальные результаты:</h3>
    <div class="max-h-64 overflow-y-auto space-y-2">
      ${results.map((result, index) => `
        <div class="p-3 rounded-lg ${result.isCorrect ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'}">
          <div class="text-sm font-medium">Вопрос ${index + 1}:</div>
          <div class="text-sm text-gray-800 mb-1 math-content">${result.question}</div>
          <div class="text-xs text-gray-600">
            Ваш ответ: ${result.userAnswer} <br>
            Правильный ответ: ${result.correctAnswer} <br>
            ${result.isCorrect ? '✓ Правильно' : '✗ Неправильно'}
          </div>
        </div>
      `).join('')}
    </div>
  `;
  
  if (window.MathJax) {
    MathJax.typesetPromise([detailedResults]).catch((err) => console.log(err.message));
  }
}

    // Функции для работы с статистикой
    function saveTestResult(score, section, difficulty) {
  let statistics = JSON.parse(localStorage.getItem('mathAnalysisStatistics')) || {};
  if (!statistics[userName]) {
    statistics[userName] = {
      totalTests: 0,
      bestScore: 0,
      totalScore: 0,
      averageScore: 0,
      integrals: { easy: 0, medium: 0, hard: 0, total: 0 },
      derivatives: { easy: 0, medium: 0, hard: 0, total: 0 },
      series: { easy: 0, medium: 0, hard: 0, total: 0 }, // Добавляем раздел series
      history: []
    };
  }
  
  const userStats = statistics[userName];
  userStats.totalTests += 1;
  userStats.totalScore += score;
  userStats.bestScore = Math.max(userStats.bestScore, score);
  userStats.averageScore = Math.round(userStats.totalScore / userStats.totalTests);
  
  // Обновляем статистику для соответствующего раздела
  userStats[section][difficulty] = Math.max(userStats[section][difficulty], score);
  
  // Пересчитываем общий результат для раздела
  userStats[section].total = Math.round(
    (userStats[section].easy + userStats[section].medium + userStats[section].hard) / 3
  );
  
  userStats.history.unshift({
    date: new Date().toLocaleString(),
    section: section,
    difficulty: difficulty,
    score: score,
    totalQuestions: currentTest.length,
    correctAnswers: Math.round((score / 100) * currentTest.length)
  });
  
  if (userStats.history.length > 10) {
    userStats.history = userStats.history.slice(0, 10);
  }
  
  localStorage.setItem('mathAnalysisStatistics', JSON.stringify(statistics));
} 
    
    function showStatistics() {
  // Показываем страницу статистики
  document.getElementById('homePage').classList.add('hidden');
  document.getElementById('integralsSection').classList.add('hidden');
  document.getElementById('derivativesSection').classList.add('hidden');
  document.getElementById('seriesSection').classList.add('hidden'); // новый раздел
  document.getElementById('testPage').classList.add('hidden');
  document.getElementById('resultsPage').classList.add('hidden');
  document.getElementById('statisticsPage').classList.remove('hidden');

  // Загружаем статистику для текущего пользователя
  const statistics = JSON.parse(localStorage.getItem('mathAnalysisStatistics')) || {};
  const userStats = statistics[userName] || {
    totalTests: 0,
    bestScore: 0,
    averageScore: 0,
    integrals: { easy: 0, medium: 0, hard: 0, total: 0 },
    derivatives: { easy: 0, medium: 0, hard: 0, total: 0 },
    series: { easy: 0, medium: 0, hard: 0, total: 0 }, // добавили series
    history: []
  };

  // Обновляем отображение имени пользователя
  document.getElementById('statsUserName').textContent = userName;

  // Обновляем основную статистику
  document.getElementById('totalTests').textContent = userStats.totalTests;
  document.getElementById('bestScore').textContent = userStats.bestScore + '%';
  document.getElementById('averageScore').textContent = userStats.averageScore + '%';

  // Обновляем прогресс по разделам
  document.getElementById('integralsProgress').textContent = userStats.integrals.total + '%';
  document.getElementById('integralsProgressBar').style.width = userStats.integrals.total + '%';

  document.getElementById('derivativesProgress').textContent = userStats.derivatives.total + '%';
  document.getElementById('derivativesProgressBar').style.width = userStats.derivatives.total + '%';

  // Добавляем прогресс по series
  document.getElementById('seriesProgress').textContent = userStats.series.total + '%';
  document.getElementById('seriesProgressBar').style.width = userStats.series.total + '%';

  // Отображаем историю тестов
  const testsHistoryElement = document.getElementById('testsHistory');
  if (userStats.history.length === 0) {
    testsHistoryElement.innerHTML = '<p class="text-gray-500 text-center py-4">История тестов пуста</p>';
  } else {
    testsHistoryElement.innerHTML = userStats.history.map(test => `
      <div class="bg-gray-50 rounded-lg p-4">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-semibold">
              ${
                test.section === 'integrals'
                  ? 'Интегралы'
                  : test.section === 'derivatives'
                  ? 'Производные'
                  : 'Ряды и последовательности'
              } - ${
                test.difficulty === 'easy'
                  ? 'Легкий'
                  : test.difficulty === 'medium'
                  ? 'Средний'
                  : 'Сложный'
              }
            </h4>
            <p class="text-sm text-gray-500">${test.date}</p>
          </div>
          <div class="text-right">
            <span class="font-bold ${test.score >= 70 ? 'text-green-600' : test.score >= 50 ? 'text-yellow-600' : 'text-red-600'}">${test.score}%</span>
            <p class="text-sm text-gray-500">${test.correctAnswers}/${test.totalQuestions} вопросов</p>
          </div>
        </div>
      </div>
    `).join('');
  }
}

    function resetStatistics() {
      if (confirm('Вы уверены, что хотите сбросить всю статистику для пользователя ' + userName + '?')) {
        const statistics = JSON.parse(localStorage.getItem('mathAnalysisStatistics')) || {};
        if (statistics[userName]) {
          delete statistics[userName];
          localStorage.setItem('mathAnalysisStatistics', JSON.stringify(statistics));
          showStatistics(); // Обновляем отображение статистики
        }
      }
    }

// Вспомогательные функции
function toggleTheory(id) {
  const el = document.getElementById(id);
  el.classList.toggle('hidden');
}

function exitTest() {
  if (confirm('Вы уверены, что хотите выйти? Прогресс текущего теста будет потерян.')) {
    showHome();
  }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
  // Проверяем, есть ли сохраненное имя пользователя
  const savedUserName = localStorage.getItem('lastUserName');
  if (savedUserName) {
    document.getElementById('userNameInput').value = savedUserName;
  }
});