const quotes = [
  {
    id: 1,
    text: "Не ошибается тот, кто ничего не делает.",
    author: "Теодор Рузвельт",
  },
  {
    id: 2,
    text: "Жизнь - это то, что с тобой рпоисходит, пока ты строишь планы.",
    author: "Джон Леннон",
  },
  {
    id: 3,
    text: "Секрет успеха - это настойчивость в достижении цели.",
    author: "Бенджамин Дизраэли",
  },
  {
    id: 4,
    text: "Будь тем изменением, которое ты хочешь увидеть в мире.",
    author: "Махатма Ганди",
  },
];

const item = document.querySelector("#item");
const newQuoteBtn = document.querySelector("#new-quote");
const saveBtn = document.querySelector("#save-quote");
const savedQuotesContainer = document.querySelector("#saved-quotes");
const savedQuotesShowBtn = document.querySelector("#show-saved-quote");

function getRandomQuote() {
  const randomIdx = Math.floor(Math.random() * quotes.length);
  return quotes[randomIdx];
}

console.log(getRandomQuote()); //Выбираем случайную цитату

//Выводим
function displayQuote() {
  const quote = getRandomQuote();
  const markup = markupQuote(quote);

  item.innerHTML = markup;
}

//Шаблон вывода цитаты
function markupQuote(quote) {
  return `

<div data-id="${quote.id}">
<p class="quote">${quote.text}</p>
<p class="author">- ${quote.author}</p>
</div>


`;
}

function markupQuote2(quote) {
  return `
  <div class="wrapper" >
<div data-id="${quote.id}">
<p class="quote">${quote.text}</p>
<p class="author">- ${quote.author}</p>
</div>
<div class="delBtn" data-id="${quote.id}">
<button data-action="delete">Удалить</button>
</div>
</div>
`;
}

//Сохраняем цитату в локальное хранилище
function saveQuote() {
  const saveQuotesIds = JSON.parse(localStorage.getItem("quoteIds")) || [];
  console.log("saveQuotesIds", saveQuotesIds);
  const quote = item.querySelector("[data-id]");

  if (!quote) {
    return alert("Сгенерируйте цитату, перед тем как её сохранить");
  }
  const quoteId = quote.dataset.id;

  const findId = saveQuotesIds.find((el) => el == quoteId);
  if (findId) {
    return alert("Цитата была ранее сохранена");
  }

  saveQuotesIds.push(Number(quoteId));
  localStorage.setItem("quoteIds", JSON.stringify(saveQuotesIds));
  alert("Цитата была сохранена!");

  if (savedQuotesShowBtn.dataset.show === "show") {
    const quoteData = quotes.find((el) => {
      return el["id"] == quoteId;
    });

    savedQuotesContainer.insertAdjacentHTML(
      "afterbegin",
      markupQuote2(quoteData)
    );
  }

  displayQuote();
}

//Показываем/Скрываем сохраненные цитаты
function toggleBtn() {
  if (savedQuotesShowBtn.dataset.show === "none") {
    savedQuotesShowBtn.dataset.show = "show";
    savedQuotesShowBtn.innerText = "Скрыть сохраненные цитаты";
  } else {
    savedQuotesShowBtn.dataset.show = "none";
    savedQuotesShowBtn.innerText = "Показать сохраненные цитаты";
  }

  return savedQuotesShowBtn.dataset.show === "show";
}

function displayShowQuote() {
  const isShow = toggleBtn();
  console.log(isShow);
  if (!isShow) {
    return (savedQuotesContainer.innerHTML = "");
  }

  const saveQuotesIds = JSON.parse(localStorage.getItem("quoteIds")) || [];

  console.log(saveQuotesIds);

  const quotesData = [];

  saveQuotesIds.forEach((id) => {
    const foundQuote = quotes.find((el) => {
      return el.id === id;
    });

    quotesData.push(foundQuote);
  });


  if (quotesData.length === 0) {
    return savedQuotesContainer.insertAdjacentHTML(
      "afterbegin",
      "<p>Нет сохраненных цитат<p/>"
    );
  }
  
  


    quotesData.forEach((el) => {
      const markup = markupQuote2(el);

      savedQuotesContainer.insertAdjacentHTML("afterbegin", markup);
    });
  
  console.log(filteredQuotes);
}

function removeQuote(e) {
  console.log(e.target.closest("[data-id]").dataset.id);
  if (
    !e.target.hasAttribute("data-action") ||
    e.target.getAttribute("data-action") != "delete"
  ) {
    return;
  }

  if (confirm("Удалить цитату?")) {
    e.target.closest(".wrapper").remove();
  }

  const ids = JSON.parse(localStorage.getItem("quoteIds"));

  const id = e.target.closest("[data-id]").dataset.id;

  const index = ids.indexOf(id);

  ids.splice(index, 1);
  localStorage.setItem("quoteIds", JSON.stringify(ids));

  if (ids.length == 0) {
    savedQuotesShowBtn.dataset.show = "none";
    savedQuotesShowBtn.innerText = "Показать сохраненные цитаты";
  }
}

newQuoteBtn.addEventListener("click", displayQuote);
saveBtn.addEventListener("click", saveQuote);
savedQuotesShowBtn.addEventListener("click", displayShowQuote);
savedQuotesContainer.addEventListener("click", removeQuote);
