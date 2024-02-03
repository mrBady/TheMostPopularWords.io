// Получаем элементы
const getTitle = document.querySelector('.english__word-eng');
const getButtons = document.querySelectorAll('.english__translate');
const getWrapper = document.querySelector('.wrapper')
const getScore = document.querySelector('.header__score')

// Путь к файлу JSON
const filePath = 'js/eng-v2.json';

let randomWord;

// Загрузка результата из localStorage при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
  // Восстанавливаем счет из localStorage, если он есть
  const savedScore = localStorage.getItem('userScore');
  if (savedScore) {
    getScore.textContent = savedScore; // Преобразование строки в целое число
  }
  // Вызываем функцию загрузки данных
  fetchJsonFile(filePath);
});

// Функция для отправки запроса и обработки данных
function fetchJsonFile(filePath) {
  fetch(filePath)
    .then(response => response.json())
    .then(data => {
      const randomIndex = Math.floor(Math.random() * data.words.length);
      randomWord = data.words[randomIndex];
      createTitle(randomWord.eng);
      createButtons(randomWord.ru, data.words);
      addClickEventListeners(data.words);
    })
    .catch(error => console.error('Ошибка при загрузке файла:', error));
}

// Функция для установки текста в элемент
function createTitle(englishText) {
  getTitle.textContent = englishText;
}

// Функция для установки текста в кнопки
function createButtons(correctTranslation, allWords) {
  const correctIndex = Math.floor(Math.random() * 4);
  const translations = getUniqueTranslations(correctTranslation, allWords, 3);

  getButtons.forEach((button, index) => {
    if (index === correctIndex) {
      button.textContent = correctTranslation;
    } else {
      button.textContent = translations[index - (index > correctIndex ? 1 : 0)];
    }
  });
}

// Функция для получения уникальных рандомных переводов
function getUniqueTranslations(correctTranslation, allWords, count) {
  const translations = [];

  while (translations.length < count) {
    const randomIndex = Math.floor(Math.random() * allWords.length);
    const randomWord = allWords[randomIndex];

    if (randomWord.ru !== correctTranslation && !translations.includes(randomWord.ru)) {
      translations.push(randomWord.ru);
    }
  }

  return translations;
}

// Функция для добавления обработчиков событий на кнопки
function addClickEventListeners(allWords) {
  getButtons.forEach(button => {
    button.removeEventListener('click', handleButtonClick);
    button.addEventListener('click', handleButtonClick);
  });
}

// Функция для обработки нажатия на кнопку
function handleButtonClick() {
  const selectedTranslation = this.textContent;
  checkAnswer(selectedTranslation, randomWord.ru);
}

// Функция для проверки ответа
function checkAnswer(selectedTranslation, correctTranslation) {
  const isCorrect = selectedTranslation === correctTranslation;
  getWrapper.classList.add(isCorrect ? 'right' : 'wrong');

  if (isCorrect) {
    setTimeout(() => {
      fetchJsonFile(filePath);
      getWrapper.classList.remove('right');
    }, 1000);
    scoreUser(); // Вызываем scoreUser только в случае правильного ответа
  } else {
    setTimeout(() => {
      getWrapper.classList.remove('wrong');
    }, 500);
  }
}

// Функция для обновления счета пользователя и сохранения в localStorage
function scoreUser() {
  const currentScore = parseInt(getScore.textContent);
  const newScore = `${currentScore + 1} очков`;
  getScore.textContent = newScore;

  // Сохраняем новый счет в localStorage
  localStorage.setItem('userScore', newScore);
}
