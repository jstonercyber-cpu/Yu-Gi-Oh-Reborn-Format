const cardGrid = document.getElementById("cardGrid");
const searchBox = document.getElementById("searchBox");

let allCards = [];

function fandomTitle(cardName) {
  return cardName.replaceAll(" ", "_");
}

function fandomPageUrl(cardName) {
  return `https://yugioh.fandom.com/wiki/${fandomTitle(cardName)}`;
}

async function getCardImage(cardName) {
  const title = fandomTitle(cardName);

  const apiUrl =
    `https://yugioh.fandom.com/api.php?action=query` +
    `&titles=${encodeURIComponent(title)}` +
    `&prop=pageimages` +
    `&format=json` +
    `&pithumbsize=300` +
    `&origin=*`;

  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    const pages = data.query.pages;
    const page = Object.values(pages)[0];

    return page.thumbnail ? page.thumbnail.source : "";
  } catch {
    return "";
  }
}

async function renderCards(cards) {
  cardGrid.innerHTML = "";

  for (const cardName of cards) {
    const imageUrl = await getCardImage(cardName);

    const card = document.createElement("a");
    card.className = "card";
    card.href = fandomPageUrl(cardName);
    card.target = "_blank";

    card.innerHTML = `
      ${imageUrl ? `<img src="${imageUrl}" alt="${cardName}">` : `<div class="missing-img">No Image</div>`}
      <h2>${cardName}</h2>
    `;

    cardGrid.appendChild(card);
  }
}

fetch("cards.json")
  .then(response => response.json())
  .then(cards => {
    allCards = cards;
    renderCards(allCards);
  });

searchBox.addEventListener("input", () => {
  const search = searchBox.value.toLowerCase();

  const filtered = allCards.filter(card =>
    card.toLowerCase().includes(search)
  );

  renderCards(filtered);
});
