// @todo: Функция создания карточки
export function createCard(item, deleteCallback, likeHandler, openModal, cardModal, cardModalImage, cardModalCaption, cardTemplate, imageClickHandler) {
  const cardElement = cardTemplate.cloneNode(true);
  const cardImage = cardElement.querySelector('.card__image');
  cardImage.alt = item.name;
  cardImage.src = item.link;
  cardElement.querySelector('.card__title').textContent = item.name;
  const deleteButton = cardElement.querySelector('.card__delete-button');
  deleteButton.addEventListener('click', () => deleteCallback(cardElement));
  cardImage.addEventListener('click', () => 
    imageClickHandler(item, openModal, cardModal, cardModalImage, cardModalCaption));
  const likeButton = cardElement.querySelector('.card__like-button');
  likeButton.addEventListener('click', (evt) => likeHandler(evt));
  return cardElement;
}

// @todo: Функция удаления карточки
export function deleteCard(cardElement) {
  cardElement.remove();
}


export function likeHandler(evt) {
  evt.target.classList.toggle("card__like-button_is-active");
}
