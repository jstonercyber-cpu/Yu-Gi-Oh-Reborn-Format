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

let allCards = [];

fetch("cards.json")
  .then(response => response.json())
  .then(cards => {
    allCards = cards;
    populateFilters(allCards);
    applySearchAndFilters();
  });

function getImagePath(card) {
  return `Images/Monsters/${card.name.replaceAll(" ", "_")}.jpg`;
}

function renderCards(cards) {
  cardGrid.innerHTML = "";

  cards.forEach(card => {
    const imagePath = getImagePath(card);
    const cardElement = document.createElement("div");

    cardElement.className = "card";

    cardElement.innerHTML = `
      <img loading="lazy" src="${imagePath}" alt="${card.name}">

      <h2>${card.name}</h2>

      <p>
        ${card.level ? `Level ${card.level}` : "Level ?"} |
        ${card.attribute || "Attribute ?"}
      </p>

      <p>
        ${card.race || "Race ?"} |
        ${card.monsterType || "Type ?"}
      </p>

      <p>
        ATK ${card.atk ?? "?"} /
        DEF ${card.def ?? "?"}
      </p>

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
    const searchableText = `
      ${card.name || ""}
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
