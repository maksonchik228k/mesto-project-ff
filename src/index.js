import { initialCards } from './scripts/cards.js';
import { openModal, closeModal, } from './components/modal.js';
import { createCard, deleteCard, likeHandler  } from './components/card.js';
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const editProfileModal = document.querySelector('.popup_type_edit');
const addCardModal = document.querySelector('.popup_type_new-card');
const cardModal = document.querySelector(".popup_type_image");
const cardModalImage = cardModal.querySelector('.popup__image');
const cardModalCaption = cardModal.querySelector('.popup__caption')
const closeButtons = document.querySelectorAll('.popup__close');
const cardList = document.querySelector(".places__list");
const editProfileForm = document.forms["edit-profile"];
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(".popup__input_type_description");
const addCardForm = document.forms["new-place"];
const cardNameInput = addCardForm.querySelector(".popup__input_type_card-name");
const cardUrlInput = addCardForm.querySelector(".popup__input_type_url");
const popups = document.querySelectorAll('.popup');
const profileInfoElement = document.querySelector(".profile__info");
const profileTitleElement = profileInfoElement.querySelector(".profile__title");
const profileDescriptionElement = profileInfoElement.querySelector(".profile__description");

const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');
const placesList = document.querySelector('.places__list');
function handleCardImageClick(item, openModal, cardModal, cardModalImage, cardModalCaption) {
  cardModalImage.src = item.link;
  cardModalImage.alt = item.name;
  cardModalCaption.textContent = item.name;
  openModal(cardModal);
}
function renderCards(cards, openModal, cardModal, cardModalImage, cardModalCaption, cardTemplate, imageClickHandler) {
    cards.forEach((card) => {
  const cardElement = createCard(card, deleteCard, likeHandler, openModal, cardModal, cardModalImage, cardModalCaption, cardTemplate, imageClickHandler);
  placesList.append(cardElement);
});
}
renderCards(initialCards, openModal, cardModal, cardModalImage, cardModalCaption, cardTemplate, handleCardImageClick);
import './pages/index.css';

popups.forEach((popup) => {
  popup.addEventListener("click", (evt) => {
    if (evt.target === popup) {
      closeModal(popup);
    }
  });
})

editProfileButton.addEventListener('click', () => { 
  nameInput.value = profileTitleElement.textContent;
  jobInput.value = profileDescriptionElement.textContent;
  openModal(editProfileModal);
});
addCardButton.addEventListener('click',() => openModal(addCardModal));

closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.popup');
    closeModal(modal);
  });
});

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();

  const cardInfo = {
    name: cardNameInput.value,
    link: cardUrlInput.value
  };
    const newCard = createCard( cardInfo, deleteCard, likeHandler, openModal, cardModal, cardModalImage, cardModalCaption, cardTemplate, handleCardImageClick);
    cardList.prepend(newCard);

    closeModal(addCardModal);
    cardNameInput.value = "";
    cardUrlInput.value = "";
}

nameInput.value = profileTitleElement.textContent;
jobInput.value = profileDescriptionElement.textContent;

editProfileForm.addEventListener("submit", handleEditProfileFormSubmit);
addCardForm.addEventListener("submit", handleAddCardFormSubmit);


function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  profileTitleElement.textContent = nameInput.value;
  profileDescriptionElement.textContent = jobInput.value;

  closeModal(editProfileModal);
}
