const cardGrid = document.getElementById("cardGrid");
const searchBox = document.getElementById("searchBox");
const searchButton = document.getElementById("searchButton");
const clearButton = document.getElementById("clearButton");

const sortSelect = document.getElementById("sortSelect");
const directionSelect = document.getElementById("directionSelect");
const attributeFilter = document.getElementById("attributeFilter");
const monsterTypeFilter = document.getElementById("monsterTypeFilter");
const raceFilter = document.getElementById("raceFilter");
const levelFilter = document.getElementById("levelFilter");

const navTabs = document.querySelectorAll(".nav-tab");

let allCards = [];
let currentCategory = "Home";

fetch("cards.json")
  .then(response => response.json())
  .then(cards => {
    allCards = cards;
    populateFilters(allCards);
    applySearchAndFilters();
  });

function getCardCategory(card) {
  return card.category || "Monster";
}

function getImagePath(card) {
  const category = getCardCategory(card);

  const folder =
    category === "Spell" ? "Spells" :
    category === "Trap" ? "Traps" :
    "Monsters";

  const fileName = card.name
    .replaceAll(" ", "_")
    .replaceAll("#", "No")
    .replaceAll("&", "and")
    .replaceAll("'", "")
    .replaceAll(",", "");

  return `Images/${folder}/${fileName}.jpg`;
}

function renderCards(cards) {
  cardGrid.innerHTML = "";

  if (cards.length === 0) {
    cardGrid.innerHTML = `<p class="no-results">No cards found.</p>`;
    return;
  }

  cards.forEach(card => {
    const imagePath = getImagePath(card);
    const cardElement = document.createElement("div");

    cardElement.className = "card";

    cardElement.innerHTML = `
      <img loading="lazy" src="${imagePath}" alt="${card.name}">

      <h2>${card.name}</h2>

      <p>
        ${card.level ? `Level ${card.level}` : getCardCategory(card)} |
        ${card.attribute || ""}
      </p>

      <p>
        ${card.race || ""} 
        ${card.monsterType ? `| ${card.monsterType}` : ""}
      </p>

      ${
        card.atk !== undefined || card.def !== undefined
          ? `<p>ATK ${card.atk ?? "?"} / DEF ${card.def ?? "?"}</p>`
          : ""
      }

      ${card.effect ? `
        <details class="effect-box">
          <summary>Effect ▼</summary>
          <p>${card.effect}</p>
        </details>
      ` : ""}
    `;

    cardGrid.appendChild(cardElement);
  });
}

function populateFilters(cards) {
  fillSelect(attributeFilter, cards.map(card => card.attribute).filter(Boolean));
  fillSelect(raceFilter, cards.map(card => card.race).filter(Boolean));
  fillSelect(levelFilter, cards.map(card => card.level).filter(Boolean).sort((a, b) => a - b));
}

function fillSelect(selectElement, values) {
  const uniqueValues = [...new Set(values)];

  uniqueValues.forEach(value => {
    const option = document.createElement("option");
    option.value = value;
    option.textContent = value;
    selectElement.appendChild(option);
  });
}

function applySearchAndFilters() {
  const searchTerm = searchBox.value.toLowerCase().trim();

  let filteredCards = allCards.filter(card => {
    const category = getCardCategory(card);

    const matchesCategory =
      currentCategory === "Home" || category === currentCategory;

    const searchableText = `
      ${card.name || ""}
      ${card.category || ""}
      ${card.attribute || ""}
      ${card.race || ""}
      ${card.monsterType || ""}
      ${card.level || ""}
      ${card.atk || ""}
      ${card.def || ""}
      ${card.effect || ""}
    `.toLowerCase();

    const matchesSearch = searchableText.includes(searchTerm);

    const matchesAttribute =
      !attributeFilter.value || card.attribute === attributeFilter.value;

    const matchesMonsterType =
      !monsterTypeFilter.value || card.monsterType === monsterTypeFilter.value;

    const matchesRace =
      !raceFilter.value || card.race === raceFilter.value;

    const matchesLevel =
      !levelFilter.value || String(card.level) === String(levelFilter.value);

    return (
      matchesCategory &&
      matchesSearch &&
      matchesAttribute &&
      matchesMonsterType &&
      matchesRace &&
      matchesLevel
    );
  });

  sortCards(filteredCards);
  renderCards(filteredCards);
}

function sortCards(cards) {
  const sortBy = sortSelect.value;
  const direction = directionSelect.value;

  cards.sort((a, b) => {
    let valueA = a[sortBy];
    let valueB = b[sortBy];

    if (typeof valueA === "string") valueA = valueA.toLowerCase();
    if (typeof valueB === "string") valueB = valueB.toLowerCase();

    if (valueA === undefined || valueA === null) valueA = "";
    if (valueB === undefined || valueB === null) valueB = "";

    if (valueA < valueB) return direction === "asc" ? -1 : 1;
    if (valueA > valueB) return direction === "asc" ? 1 : -1;
    return 0;
  });
}

function setTheme(category) {
  document.body.classList.remove("theme-home", "theme-monster", "theme-spell", "theme-trap");

  if (category === "Monster") {
    document.body.classList.add("theme-monster");
  } else if (category === "Spell") {
    document.body.classList.add("theme-spell");
  } else if (category === "Trap") {
    document.body.classList.add("theme-trap");
  } else {
    document.body.classList.add("theme-home");
  }
}

navTabs.forEach(tab => {
  tab.addEventListener("click", event => {
    event.preventDefault();

    currentCategory = tab.dataset.category;

    navTabs.forEach(t => t.classList.remove("active-tab"));
    tab.classList.add("active-tab");

    setTheme(currentCategory);
    applySearchAndFilters();
  });
});

searchButton.addEventListener("click", applySearchAndFilters);

searchBox.addEventListener("keydown", event => {
  if (event.key === "Enter") {
    applySearchAndFilters();
  }
});

sortSelect.addEventListener("change", applySearchAndFilters);
directionSelect.addEventListener("change", applySearchAndFilters);
attributeFilter.addEventListener("change", applySearchAndFilters);
monsterTypeFilter.addEventListener("change", applySearchAndFilters);
raceFilter.addEventListener("change", applySearchAndFilters);
levelFilter.addEventListener("change", applySearchAndFilters);

clearButton.addEventListener("click", () => {
  searchBox.value = "";
  sortSelect.value = "name";
  directionSelect.value = "asc";
  attributeFilter.value = "";
  monsterTypeFilter.value = "";
  raceFilter.value = "";
  levelFilter.value = "";

  applySearchAndFilters();
});
