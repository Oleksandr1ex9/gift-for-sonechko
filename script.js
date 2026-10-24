
/* =========================================
   1. НАЛАШТУВАННЯ ПОДАРУНКА
   ЗМІНЮЙ ТЕКСТИ В ЦЬОМУ БЛОЦІ
   ========================================= */

const GIFT = {
  name: "Сонечко",

  // Тексти трьох загадок.
  // correctIndex — номер правильної відповіді, починаючи з 0.
  questions: [
    {
      category: "маленька загадка",
      icon: "♡",
      title: "Що робить день особливішим?",
      question: "Іноді для щастя не потрібно нічого великого. Що з цього може зробити звичайний день приємнішим?",
      answers: [
        "Маленька несподіванка",
        "Щира розмова",
        "Трохи турботи",
        "Усе це разом ♡"
      ],
      correctIndex: 3,
      success: "Саме так! Маленькі речі часто мають найбільше значення ♡"
    },
    {
      category: "трішки романтики",
      icon: "✿",
      title: "Загадка про тепло",
      question: "Що стає ціннішим, коли ним ділишся з іншою людиною?",
      answers: [
        "Список домашніх завдань",
        "Доброта й турбота",
        "Кількість справ на день",
        "Ранковий будильник"
      ],
      correctIndex: 1,
      success: "Правильно! Теплом і добротою завжди приємно ділитися."
    },
    {
      category: "останній секрет",
      icon: "✨",
      title: "А тепер найголовніше",
      question: "Як думаєш, чому цей маленький сайт з'явився?",
      answers: [
        "Просто випадково",
        "Щоб перевірити швидкість інтернету",
        "Бо хтось хотів зробити для тебе щось особливе ♡",
        "Щоб порахувати сердечка"
      ],
      correctIndex: 2,
      success: "Так! Цей маленький світ створений спеціально для тебе ♡"
    }
  ],

  // Три повідомлення, які відкриваються сердечками.
  treasures: [
    "Мені подобається, що з тобою навіть звичайні моменти можуть ставати особливими. ♡",
    "Твоя усмішка, твої думки й твій характер — у тобі є багато того, що хочеться цінувати.",
    "Я хотів, щоб у тебе залишилося щось маленьке, до чого можна повернутися й згадати про мене з теплом. ✿"
  ],

  // Фінальний лист. Кожен елемент paragraphs — окремий абзац.
  letter: {
    greeting: "Привіт, Сонечко ♡",

    paragraphs: [
      "Я хотів зробити для тебе щось не зовсім звичайне. Не просто подарунок, який можна покласти на полицю, а маленький світ, у якому кожна деталь створена з думкою про тебе.",

      "Можливо, це лише невеличкий сайт, кілька загадок і сердечок. Але за ним стоїть моє бажання подарувати тобі трохи радості й побачити твою усмішку.",

      "Дякую тобі за наші моменти, розмови, прогулянки й усе те маленьке, з чого складаються приємні спогади. Я сподіваюся, що попереду в нас буде ще багато хорошого.",

      "Нехай у тебе буде якомога більше приводів усміхатися, здійснювати свої мрії й відчувати, наскільки ти особлива."
    ],

    signature: "З теплом, від мене ♡"
  }
};


/* =========================================
   2. ЗНАХОДИМО ЕЛЕМЕНТИ СТОРІНКИ
   ========================================= */

const screens = document.querySelectorAll(".screen");

const envelope = document.getElementById("envelope");
const startBtn = document.getElementById("start-btn");
const beginBtn = document.getElementById("begin-btn");
const nextQuestionBtn = document.getElementById("next-question-btn");
const toFinalBtn = document.getElementById("to-final-btn");
const restartBtn = document.getElementById("restart-btn");
const homeLink = document.getElementById("home-link");

const quizCategory = document.getElementById("quiz-category");
const quizIcon = document.getElementById("quiz-icon");
const quizTitle = document.getElementById("quiz-title");
const quizQuestion = document.getElementById("quiz-question");
const answerList = document.getElementById("answer-list");
const quizFeedback = document.getElementById("quiz-feedback");

const stageLabel = document.getElementById("stage-label");
const progressLabel = document.getElementById("progress-label");
const progressFill = document.getElementById("progress-fill");

const heartGrid = document.getElementById("heart-grid");
const treasureCounter = document.getElementById("treasure-counter");
const treasureMessage = document.getElementById("treasure-message");

const letterGreeting = document.getElementById("letter-greeting");
const letterBody = document.getElementById("letter-body");
const letterSignature = document.getElementById("letter-signature");

const toast = document.getElementById("toast");


/* =========================================
   3. СТАН КВЕСТУ
   ========================================= */

let currentQuestion = 0;
let answered = false;
let openedTreasures = new Set();
let toastTimer = null;


/* =========================================
   4. ПЕРЕМИКАННЯ ЕКРАНІВ
   ========================================= */

function showScreen(screenId) {
  screens.forEach((screen) => {
    const isActive = screen.id === screenId;

    screen.classList.toggle("active", isActive);
    screen.hidden = !isActive;
  });

  // Після переходу повертаємо користувача на початок екрана.
  window.scrollTo({ top: 0, behavior: "smooth" });
}


/* =========================================
   5. МАЛЕНЬКІ ПОВІДОМЛЕННЯ
   ========================================= */

function showToast(message) {
  clearTimeout(toastTimer);

  toast.textContent = message;
  toast.classList.add("show");

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 2400);
}


/* =========================================
   6. ПОЧАТОК ПРИГОДИ
   ========================================= */

startBtn.addEventListener("click", () => {
  envelope.classList.add("open");
  startBtn.disabled = true;
  startBtn.innerHTML = "Конверт відкривається... ♡";

  setTimeout(() => {
    showScreen("welcome");
    startBtn.disabled = false;
    startBtn.innerHTML = 'Відкрити конверт <span>♡</span>';
  }, 650);
});

beginBtn.addEventListener("click", () => {
  currentQuestion = 0;
  renderQuestion();
  showScreen("quiz");
});


/* =========================================
   7. ПОКАЗ ЗАГАДОК
   ========================================= */

function renderQuestion() {
  const item = GIFT.questions[currentQuestion];

  if (!item) {
    showScreen("treasures");
    return;
  }

  answered = false;

  quizCategory.textContent = item.category;
  quizIcon.textContent = item.icon;
  quizTitle.textContent = item.title;
  quizQuestion.textContent = item.question;

  stageLabel.textContent = "Маленька загадка";
  progressLabel.textContent =
    `${currentQuestion + 1} / ${GIFT.questions.length}`;

  const progress = ((currentQuestion + 1) / GIFT.questions.length) * 100;
  progressFill.style.width = `${progress}%`;

  quizFeedback.textContent = "";
  answerList.replaceChildren();

  nextQuestionBtn.hidden = true;

  item.answers.forEach((answer, index) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "answer-btn";

    const letter = document.createElement("span");
    letter.className = "answer-letter";
    letter.textContent = String.fromCharCode(65 + index);

    const answerText = document.createElement("span");
    answerText.textContent = answer;

    button.append(letter, answerText);

    button.addEventListener("click", () => {
      selectAnswer(index);
    });

    answerList.appendChild(button);
  });
}


/* =========================================
   8. ПЕРЕВІРКА ВІДПОВІДЕЙ
   ========================================= */

function selectAnswer(selectedIndex) {
  if (answered) return;

  answered = true;

  const item = GIFT.questions[currentQuestion];
  const buttons = answerList.querySelectorAll(".answer-btn");

  buttons.forEach((button, index) => {
    button.disabled = true;

    if (index === item.correctIndex) {
      button.classList.add("correct");
    } else if (index === selectedIndex) {
      button.classList.add("wrong");
    }
  });

  if (selectedIndex === item.correctIndex) {
    quizFeedback.textContent = item.success;
  } else {
    quizFeedback.textContent =
      "Не зовсім 😊 Але тут головне не оцінка, а маленька пригода. Правильну відповідь підсвітив для тебе.";
  }

  nextQuestionBtn.textContent =
    currentQuestion === GIFT.questions.length - 1
      ? "Відкрити маленькі скарби ♡"
      : "Наступна загадка →";

  nextQuestionBtn.hidden = false;
}

nextQuestionBtn.addEventListener("click", () => {
  if (!answered) return;

  currentQuestion += 1;

  if (currentQuestion >= GIFT.questions.length) {
    showScreen("treasures");
  } else {
    renderQuestion();
  }
});


/* =========================================
   9. СЕРДЕЧКА З ПРИХОВАНИМИ ПОВІДОМЛЕННЯМИ
   ========================================= */

function updateTreasureCounter() {
  treasureCounter.textContent =
    `Відкрито ${openedTreasures.size} із ${GIFT.treasures.length}`;

  if (openedTreasures.size === GIFT.treasures.length) {
    toFinalBtn.hidden = false;
    showToast("Усі маленькі скарби відкриті! ♡");
  }
}

heartGrid.addEventListener("click", (event) => {
  const button = event.target.closest(".heart-tile");

  if (!button) return;

  const index = Number(button.dataset.treasure);

  if (!Number.isInteger(index) || !GIFT.treasures[index]) return;

  const isNew = !openedTreasures.has(index);

  openedTreasures.add(index);
  button.classList.add("opened");
  button.setAttribute("aria-pressed", "true");

  const symbol = button.querySelector(".heart-symbol");
  symbol.textContent = "♥";

  const caption = button.querySelector(".heart-caption");
  caption.textContent = "відкрито ♡";

  treasureMessage.textContent = GIFT.treasures[index];
  treasureMessage.hidden = false;

  updateTreasureCounter();

  if (isNew) {
    button.setAttribute(
      "aria-label",
      `Повідомлення ${index + 1} відкрито`
    );
  }
});

toFinalBtn.addEventListener("click", () => {
  renderLetter();
  showScreen("final");
});


/* =========================================
   10. ФІНАЛЬНИЙ ЛИСТ
   ========================================= */

function renderLetter() {
  letterGreeting.textContent = GIFT.letter.greeting;
  letterSignature.textContent = GIFT.letter.signature;

  // Створюємо абзаци як текстові вузли, а не HTML.
  // Це дозволяє безпечно змінювати текст листа.
  letterBody.replaceChildren();

  GIFT.letter.paragraphs.forEach((paragraphText) => {
    const paragraph = document.createElement("p");
    paragraph.className = "letter-paragraph";
    paragraph.textContent = paragraphText;

    letterBody.appendChild(paragraph);
  });

  document.getElementById("final-title").textContent =
    `Моє ${GIFT.name},`;
}


/* =========================================
   11. ПОВТОРНЕ ПРОХОДЖЕННЯ
   ========================================= */

function resetQuest() {
  currentQuestion = 0;
  answered = false;
  openedTreasures = new Set();

  envelope.classList.remove("open");

  startBtn.disabled = false;
  startBtn.innerHTML = 'Відкрити конверт <span>♡</span>';

  heartGrid.querySelectorAll(".heart-tile").forEach((button, index) => {
    button.classList.remove("opened");
    button.setAttribute("aria-pressed", "false");
    button.setAttribute(
      "aria-label",
      `Відкрити ${["перше", "друге", "третє"][index] || "наступне"} сердечко`
    );

    const symbol = button.querySelector(".heart-symbol");
    const caption = button.querySelector(".heart-caption");

    symbol.textContent = "♡";
    caption.textContent = ["перше", "друге", "третє"][index] || "скарб";
  });

  treasureCounter.textContent = `Відкрито 0 із ${GIFT.treasures.length}`;
  treasureMessage.textContent = "";
  treasureMessage.hidden = true;
  toFinalBtn.hidden = true;

  renderQuestion();
  showScreen("intro");
}

restartBtn.addEventListener("click", resetQuest);

homeLink.addEventListener("click", (event) => {
  event.preventDefault();
  resetQuest();
});


/* =========================================
   12. ПОЧАТКОВЕ НАЛАШТУВАННЯ
   ========================================= */

letterGreeting.textContent = GIFT.letter.greeting;
letterSignature.textContent = GIFT.letter.signature;

document.title = `Для тебе, ${GIFT.name} ♡`;

heartGrid.querySelectorAll(".heart-tile").forEach((button) => {
  button.setAttribute("aria-pressed", "false");
});

// Сайт готовий до запуску.
