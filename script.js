const cardGrid = document.getElementById("cardGrid");

fetch("cards.json")
  .then(response => response.json())
  .then(cards => {
    cards.forEach(card => {

      const imagePath =
        `images/monsters/${card.name.replaceAll(" ", "_")}.jpg`;

      const cardElement = document.createElement("div");

      cardElement.className = "card";

      cardElement.innerHTML = `
        <img src="${imagePath}" alt="${card.name}">
        <h2>${card.name}</h2>

        <p>
          Level ${card.level} |
          ${card.attribute}
        </p>

        <p>
          ATK ${card.atk} /
          DEF ${card.def}
        </p>

        <p>
          ${card.effect}
        </p>
      `;

      cardGrid.appendChild(cardElement);

    });
  });
