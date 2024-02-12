// Получаем элементы
const getTitle = document.querySelectorAll('.tab__word');
const getSubTitle = document.querySelectorAll('.tab__word-subtitle');
const getButtons = document.querySelectorAll('.tab__translate');
const getWrapper = document.querySelector('.wrapper')
const getScore = document.querySelector('.header__score')
const getEngTab = document.querySelector('.tab-eng')
const getPolTab = document.querySelector('.tab-pol')

let filePath;
let randomWord;
let language;

// Функция для отправки запроса и обработки данных
function fetchJsonFile(language) {
   if (language === 'eng') {
      filePath = 'js/eng-lang.json';
   } else if (language === 'pol') {
      filePath = 'js/pol-lang.json';
   } else {
      console.error('Unsupported language:', language);
      return;
   }

   fetch(filePath)
   .then(response => response.json())
   .then(data => {
      const randomIndex = Math.floor(Math.random() * data.words.length);
      randomWord = data.words[randomIndex];
      createTitle(randomWord.main);
      createSubtitle(randomWord.transcription)
      createButtons(randomWord.ru, data.words);
      addClickEventListeners(data.words);
   })
   .catch(error => console.error('Error loading file:', error));
}

// Табы 
document.addEventListener('DOMContentLoaded', function () {
   const getButtonsTabs = document.querySelectorAll('.tab__title-button');
   const getItemTabs = document.querySelectorAll('.tab__body');
   const getTabsScore = document.querySelectorAll('.header__score');

   getButtonsTabs.forEach(function(item) {
      item.addEventListener("click", function(){
         let currentBtn = item;
         let tabValue = currentBtn.getAttribute("data-tab-name");
         let currentTab = document.querySelector(`.tab__body[data-tab-name="${tabValue}"]`);
         let currentScore = document.querySelector(`.header__score[data-tab-name="${tabValue}"]`);

         if (!currentBtn.classList.contains('is-active')) {
            getButtonsTabs.forEach(function (btn) {
               btn.classList.remove('is-active');
            });

            getItemTabs.forEach(function (tab) {
               tab.classList.remove('is-active');
            });

            getTabsScore.forEach(function (score) {
               score.classList.remove('is-active');
            });

            currentScore.classList.add('is-active');
            currentBtn.classList.add('is-active');
            currentTab.classList.add('is-active');
         }
         if(tabValue == 'tab-1' ){
            document.documentElement.classList.add('eng')
            document.documentElement.classList.remove('pol')
            language = 'eng'; 
            fetchJsonFile('eng')
         } else {
            document.documentElement.classList.add('pol')
            document.documentElement.classList.remove('eng')
            language = 'pol'; // Устанавливаем значение language
            fetchJsonFile('pol')
         }
      });
   });
   document.querySelector('.tab__title-button:not(:nth-child(0))').click();

});

// Функция для загрузки и обновления счета из localStorage
function loadAndUpdateScores() {
   // Получаем счета из localStorage
   const savedScores = JSON.parse(localStorage.getItem('langScores')) || {};

   // Получаем текущий счет для активного языка
   const currentScore = savedScores[language] || 0;

   // Обновляем счет на странице
   getScore.textContent = `${currentScore} очков`;

   // Обновляем текст для обоих счетчиков на странице
   const engScore = savedScores['eng'] || 0;
   const polScore = savedScores['pol'] || 0;

   document.querySelector('.header__score[data-tab-name="tab-1"]').textContent = `${engScore} очков на английском`;
   document.querySelector('.header__score[data-tab-name="tab-2"]').textContent = `${polScore} очков на польском`;
}

// Загрузка и обновление счетов при загрузке страницы
document.addEventListener('DOMContentLoaded', function () {
   loadAndUpdateScores();
});

// Функция для обновления счета пользователя и сохранения в localStorage
function scoreUser() {
   // Получаем текущий счет со страницы
   const currentScore = parseInt(getScore.textContent);

   // Обновляем счет на странице
   getScore.textContent = `${currentScore + 1} очков`;

   // Получаем или инициализируем объект счетов из localStorage
   let langScores = JSON.parse(localStorage.getItem('langScores')) || {};

   // Увеличиваем счет для текущего языка
   langScores[language] = (langScores[language] || 0) + 1;

   // Сохраняем обновленный объект счетов в localStorage
   localStorage.setItem('langScores', JSON.stringify(langScores));

   // Загружаем и обновляем счета на странице
   loadAndUpdateScores();
}


//===========================================================================================
// Функция для установки текста в элемент
function createTitle(englishText) {
   getTitle.forEach(function (element) {
      element.textContent = englishText;
   });
 }
 
function createSubtitle(transcription) {
   getSubTitle.forEach(function (element) {
      element.textContent = transcription;
   });
}

// Функция для установки текста в кнопки
function createButtons(correctTranslation, allWords) {
   const correctIndex = Math.floor(Math.random() * 4);
   const translations = getUniqueTranslations(correctTranslation, allWords, 3);

   const activeTabButtons = document.querySelectorAll('.tab__body.is-active .tab__translate');

   activeTabButtons.forEach((button, index) => {
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
         fetchJsonFile(language);
         getWrapper.classList.remove('right');
      }, 1000);
     scoreUser(); 
   } else {
      setTimeout(() => {
         getWrapper.classList.remove('wrong');
      }, 500);
   }
}

// клик для ios
document.addEventListener('DOMContentLoaded', function() {
   const isiPhone = /iPhone/i.test(navigator.userAgent);
 
   if (isiPhone) {
     const translateButtons = document.querySelectorAll('.tab__translate');
 
     translateButtons.forEach(button => {
       button.addEventListener('touchstart', () => {
         // Задержка перед началом анимации
         setTimeout(() => {
           // Добавляем класс для анимации
           button.classList.add('pressed');
 
           // Устанавливаем начальные стили
           button.style.transform = 'translateY(0px)';
           button.style.boxShadow = '0px 5px 0px 0px rgba(66, 68, 90, 1)';
         }, 300); // Задержка в миллисекундах перед началом анимации
       });
 
       // Используем событие touchcancel для обработки случая, когда палец перемещается за пределы кнопки
       button.addEventListener('touchcancel', () => {
         resetStyles(button);
       });
 
       button.addEventListener('touchend', () => {
         resetStyles(button);
       });
     });
 
     // Функция для сброса стилей
     function resetStyles(button) {
       // Убираем класс анимации
       button.classList.remove('pressed');
 
       // Возвращаем переходы и сбрасываем стили
       button.style.transition = '';
       button.style.transform = 'translateY(5px)';
       button.style.boxShadow = '0px 0px 0px 0px rgba(66, 68, 90, 1)';
     }
   }
});
