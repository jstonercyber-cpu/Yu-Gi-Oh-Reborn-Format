// Card-database logic.
// Each card page sets <body data-category="Monster|Spell|Trap"> and contains
// a #cardGrid. Non-database pages (home, rules, draft) have no #cardGrid, so
// this whole block is skipped and the script does nothing on those pages.

const cardGrid = document.getElementById("cardGrid");

if (cardGrid) {
  const pageCategory = document.body.dataset.category || "Monster";

  const searchBox = document.getElementById("searchBox");
  const searchButton = document.getElementById("searchButton");
  const clearButton = document.getElementById("clearButton");

  const sortSelect = document.getElementById("sortSelect");
  const directionSelect = document.getElementById("directionSelect");

  // These exist only on the Monster page; everything below treats them as optional.
  const attributeFilter = document.getElementById("attributeFilter");
  const monsterTypeFilter = document.getElementById("monsterTypeFilter");
  const raceFilter = document.getElementById("raceFilter");
  const levelFilter = document.getElementById("levelFilter");

  let allCards = [];

  fetch("cards.json")
    .then(response => response.json())
    .then(cards => {
      // Only keep this page's category. Cards with no category default to Monster.
      allCards = cards.filter(card => (card.category || "Monster") === pageCategory);
      populateFilters(allCards);
      applySearchAndFilters();
    })
    .catch(() => {
      cardGrid.innerHTML = `<p class="no-results">Could not load the card database.</p>`;
    });

  function getImagePath(card) {
    const folder =
      pageCategory === "Spell" ? "Spells" :
      pageCategory === "Trap" ? "Traps" :
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
          ${card.level ? `Level ${card.level}` : (card.category || pageCategory)} |
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
            <summary>Effect &#9660;</summary>
            <p>${card.effect}</p>
          </details>
        ` : ""}
      `;

      cardGrid.appendChild(cardElement);
    });
  }

  function populateFilters(cards) {
    if (attributeFilter) {
      fillSelect(attributeFilter, cards.map(card => card.attribute).filter(Boolean));
    }
    if (raceFilter) {
      fillSelect(raceFilter, cards.map(card => card.race).filter(Boolean));
    }
    if (levelFilter) {
      fillSelect(levelFilter, cards.map(card => card.level).filter(Boolean).sort((a, b) => a - b));
    }
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
    const searchTerm = (searchBox ? searchBox.value : "").toLowerCase().trim();

    const filteredCards = allCards.filter(card => {
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
        !attributeFilter || !attributeFilter.value || card.attribute === attributeFilter.value;

      const matchesMonsterType =
        !monsterTypeFilter || !monsterTypeFilter.value || card.monsterType === monsterTypeFilter.value;

      const matchesRace =
        !raceFilter || !raceFilter.value || card.race === raceFilter.value;

      const matchesLevel =
        !levelFilter || !levelFilter.value || String(card.level) === String(levelFilter.value);

      return matchesSearch && matchesAttribute && matchesMonsterType && matchesRace && matchesLevel;
    });

    sortCards(filteredCards);
    renderCards(filteredCards);
  }

  function sortCards(cards) {
    const sortBy = sortSelect ? sortSelect.value : "name";
    const direction = directionSelect ? directionSelect.value : "asc";

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

  // --- Event listeners (each guarded in case the control is absent) ---
  if (searchButton) searchButton.addEventListener("click", applySearchAndFilters);

  if (searchBox) {
    searchBox.addEventListener("keydown", event => {
      if (event.key === "Enter") applySearchAndFilters();
    });
  }

  if (sortSelect) sortSelect.addEventListener("change", applySearchAndFilters);
  if (directionSelect) directionSelect.addEventListener("change", applySearchAndFilters);
  if (attributeFilter) attributeFilter.addEventListener("change", applySearchAndFilters);
  if (monsterTypeFilter) monsterTypeFilter.addEventListener("change", applySearchAndFilters);
  if (raceFilter) raceFilter.addEventListener("change", applySearchAndFilters);
  if (levelFilter) levelFilter.addEventListener("change", applySearchAndFilters);

  if (clearButton) {
    clearButton.addEventListener("click", () => {
      if (searchBox) searchBox.value = "";
      if (sortSelect) sortSelect.value = "name";
      if (directionSelect) directionSelect.value = "asc";
      if (attributeFilter) attributeFilter.value = "";
      if (monsterTypeFilter) monsterTypeFilter.value = "";
      if (raceFilter) raceFilter.value = "";
      if (levelFilter) levelFilter.value = "";
      applySearchAndFilters();
    });
  }
}
