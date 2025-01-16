export function openModal(popupElement) {
    popupElement.classList.add('popup_is-opened');
    document.addEventListener('keydown', escapeClickHandler);
  }
  
  export function closeModal(popupElement) {
    popupElement.classList.remove('popup_is-opened');
    popupElement.classList.add('popup_is-animated');
    document.removeEventListener('keydown', escapeClickHandler);
  }
  
  function escapeClickHandler(evt) {
    if (evt.key === 'Escape') {
      const openedPopup = document.querySelector(".popup_is-opened");
      closeModal(openedPopup);
    }
  }