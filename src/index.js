import './pages/index.css';
import { openModal, closeModal } from './components/modal';
import { createCardElement, removeCardElement, likeCallback } from './components/card';
import { enableValidation, clearValidation } from './components/validation';
import { getCurrentUserInfo, editCurrentUserInfo, editCurrentUserAvatar, getInitialCards, createCard, deleteCard } from './components/api';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

const cardTemplate = document.querySelector("#card-template").content;
const profileInfoElement = document.querySelector(".profile__info");
const profileTitleElement = profileInfoElement.querySelector(".profile__title");
const profileDescriptionElement = profileInfoElement.querySelector(".profile__description");
const profileImageElement = document.querySelector('.profile__image');
const editProfileButton = document.querySelector('.profile__edit-button');
const addCardButton = document.querySelector('.profile__add-button');
const editProfileModal = document.querySelector('.popup_type_edit');
const editProfileAvatarElement = document.querySelector(".profile__image-wrapper");
const addCardModal = document.querySelector('.popup_type_new-card');
const deleteCardModal = document.querySelector(".popup_type_delete-card");
const avatarEditModal = document.querySelector(".popup_type_edit-avatar");
const cardModal = document.querySelector(".popup_type_image");
const cardModalImage = cardModal.querySelector(".popup__image");
const cardModalCaption = cardModal.querySelector(".popup__caption");
const closeButtons = document.querySelectorAll('.popup__close');
const deleteCardButton = deleteCardModal.querySelector(".popup__button");
const cardList = document.querySelector(".places__list");
const editProfileForm = document.forms["edit-profile"];
const editAvatarForm = document.forms["edit-avatar"];
const avatarUrlInput = editAvatarForm.querySelector(".popup__input_type_url");
const nameInput = editProfileForm.querySelector(".popup__input_type_name");
const jobInput = editProfileForm.querySelector(".popup__input_type_description");
const addCardForm = document.forms["new-place"];
const cardNameInput = addCardForm.querySelector(".popup__input_type_card-name");
const cardUrlInput = addCardForm.querySelector(".popup__input_type_url");
const popups = document.querySelectorAll('.popup');

let currentUserId;
const userPromise = getCurrentUserInfo();
const cardsPromise = getInitialCards();
Promise.all([userPromise, cardsPromise])
  .then(([userResponse, cardsResponse]) => {
    currentUserId = userResponse._id;
    profileTitleElement.textContent = userResponse.name;
    profileDescriptionElement.textContent = userResponse.about;
    profileImageElement.style.backgroundImage = `url(${userResponse.avatar})`;

    cardsResponse.forEach((card) => {
      const newCard = createCardElement(
        currentUserId,
        cardTemplate,
        card,
        openImagePopup,
        deleteCardCallback,
        likeCallback);
      cardList.append(newCard);
    });
  })
  .catch((err) => {
    console.log(err);
  });

editProfileForm.addEventListener("submit", handleEditProfileFormSubmit);
addCardForm.addEventListener("submit", handleAddCardFormSubmit);
editAvatarForm.addEventListener("submit", handleEditAvatarFormSubmit);

editProfileAvatarElement.addEventListener("click", () => {
  editAvatarForm.reset();
  clearValidation(editAvatarForm, validationConfig);
  openModal(avatarEditModal);
});

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
  clearValidation(editProfileForm, validationConfig)
  openModal(editProfileModal)
});
addCardButton.addEventListener('click', () => {
  addCardForm.reset();
  clearValidation(addCardForm, validationConfig)
  openModal(addCardModal)
});

closeButtons.forEach(button => {
  button.addEventListener('click', () => {
    const modal = button.closest('.popup');
    closeModal(modal);
  });
});

deleteCardButton.addEventListener('click', (evt) => {
  const modal = evt.target.closest(".popup");
  closeModal(modal);
});

enableValidation(validationConfig);

function openDeleteCardPopup() {
  openModal(deleteCardModal);
  return deleteCardModal;
}

function openImagePopup(evt) {
  const cardElement = evt.target;
  const cardTitleTextTrimmed = cardElement.closest(".card").querySelector(".card__title").textContent.trim();

  cardModalImage.src = cardElement.src;
  cardModalImage.alt = cardTitleTextTrimmed;
  cardModalCaption.textContent = cardTitleTextTrimmed;
  openModal(cardModal);
}

function handleEditProfileFormSubmit(evt) {
  evt.preventDefault();

  const submitButtonElement = evt.target.querySelector(".popup__button");
  renderLoading(submitButtonElement, true);
  editCurrentUserInfo({
    name: nameInput.value,
    about: jobInput.value
  })
    .then((updatedUserInfo) => {
      profileTitleElement.textContent = updatedUserInfo.name;
      profileDescriptionElement.textContent = updatedUserInfo.about;
      profileImageElement.style.backgroundImage = `url(${user.avatar})`;
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(submitButtonElement, false);
    });
}

function handleAddCardFormSubmit(evt) {
  evt.preventDefault();

  const submitButtonElement = evt.target.querySelector(".popup__button");
  renderLoading(submitButtonElement, true);
  createCard({
    name: cardNameInput.value,
    link: cardUrlInput.value
  })
    .then((newCardInfo) => {
      const newCard = createCardElement(
        currentUserId,
        cardTemplate,
        newCardInfo,
        openImagePopup,
        deleteCardCallback,
        likeCallback);
      cardList.prepend(newCard);
      closeModal(addCardModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(submitButtonElement, false);
    });


}

function handleEditAvatarFormSubmit(evt) {
  evt.preventDefault();

  const submitButtonElement = evt.target.querySelector(".popup__button");
  renderLoading(submitButtonElement, true);
  const url = avatarUrlInput.value;
  editCurrentUserAvatar(url)
    .then((user) => {
      profileImageElement.style.backgroundImage = `url(${user.avatar})`;
      closeModal(avatarEditModal);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(submitButtonElement, false);
    });


}

function renderLoading(button, isLoading) {
  if (isLoading) {
    button.textContent = "Сохранение...";
  }
  else {
    button.textContent = "Сохранить";
  }
}



const deleteCardCallback = (cardId, evt) => {
  const popup = openDeleteCardPopup();
  popup.querySelector(".popup__button").onclick = () => {
    deleteCard(cardId)
      .then(() => {
        removeCardElement(evt);
      })
      .catch((err) => {
        console.log(err);
      });
  };
}