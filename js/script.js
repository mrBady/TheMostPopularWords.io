// Получаем элементы
const getTitle = document.querySelector('.english__word-eng');
const getButtons = document.querySelectorAll('.english__translate');

// Путь к файлу JSON
const filePath = 'js/jsonWordsInEng.json';

let randomWord;

// Функция для отправки запроса и обработки данных
function fetchJsonFile(filePath) {
  fetch(filePath)
    .then(response => response.json())
    .then(data => {
      // Обработка данных
      console.log(data);

      const randomIndex = Math.floor(Math.random() * data.words.length);
      randomWord = data.words[randomIndex];
      console.log(randomWord.english, randomWord.russian);
      createTitle(randomWord.english);
      createButtons(randomWord.russian, data.words);
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
  const correctIndex = Math.floor(Math.random() * 4); // Рандомный индекс для правильного перевода
  const translations = getUniqueTranslations(correctTranslation, allWords, 3);

  // Пройдемся по всем кнопкам
  getButtons.forEach((button, index) => {
    if (index === correctIndex) {
      button.textContent = correctTranslation; // Установим правильный перевод
    } else {
      button.textContent = translations[index - (index > correctIndex ? 1 : 0)]; // Установим рандомные переводы
    }
  });
}

// Функция для получения уникальных рандомных переводов
function getUniqueTranslations(correctTranslation, allWords, count) {
  const translations = [];

  while (translations.length < count) {
    const randomIndex = Math.floor(Math.random() * allWords.length);
    const randomWord = allWords[randomIndex];

    if (randomWord.russian !== correctTranslation && !translations.includes(randomWord.russian)) {
      translations.push(randomWord.russian);
    }
  }

  return translations;
}

// Функция для добавления обработчиков событий на кнопки
function addClickEventListeners(allWords) {
  getButtons.forEach(button => {
    button.removeEventListener('click', handleButtonClick); // Удаляем предыдущий обработчик
    button.addEventListener('click', handleButtonClick);
  });
}

// Функция для обработки нажатия на кнопку
function handleButtonClick() {
  const selectedTranslation = this.textContent;
  checkAnswer(selectedTranslation, randomWord.russian);
}

// Функция для проверки ответа
function checkAnswer(selectedTranslation, correctTranslation) {
  if (selectedTranslation === correctTranslation) {
    alert('Правильно!');
    fetchJsonFile(filePath); // Загрузим новое слово после правильного ответа
  } else {
    alert('Неправильно! Попробуйте еще раз.');
  }
}

// Вызов функции с указанием пути к файлу после загрузки DOM
document.addEventListener('DOMContentLoaded', function () {
  fetchJsonFile(filePath);
});
