// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');
// @todo: DOM узлы
const placesList = document.querySelector('.places__list');
// @todo: Функция создания карточки
function createCard(item, deleteCallback) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardImage = cardElement.querySelector('.card__image');
    cardImage.alt = item.name;
    cardImage.src = item.link;
    cardElement.querySelector('.card__title').textContent = item.name;
    const deleteButton = cardElement.querySelector('.card__delete-button');
    deleteButton.addEventListener('click', () => deleteCallback(cardElement))
    return cardElement
};
// @todo: Функция удаления карточки
function deleteCard(cardElement) {
    cardElement.remove();
};
// @todo: Вывести карточки на страницу
function renderCards(cards) {
  cards.forEach((card) => {
    const cardElement = createCard(card, deleteCard);
    placesList.append(cardElement);
  })
};

renderCards(initialCards);