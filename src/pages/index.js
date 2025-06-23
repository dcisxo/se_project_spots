import "../pages/index.css";
import logoPath from "../images/logo.svg";
import pencilPath from "../images/pencil.svg";
import plusPath from "../images/plus.svg";
import avatarPath from "../images/avatar.jpg";
import closeIcon from "../images/close-icon.svg";
import { enableValidation, resetValidation } from '../scripts/validation.js';
import Api from "../scripts/Api.js";
import { renderLoading, handleSubmit } from '../scripts/utils.js';

const profileAvatar = document.querySelector(".profile__avatar");

document.querySelector(".header__logo").src = logoPath;
document.querySelector(".profile__edit-btn img").src = pencilPath;
document.querySelector(".profile__add-btn img").src = plusPath;
profileAvatar.src = avatarPath;

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "932461a1-5689-412a-b2e1-d7861760d1f6",
    "Content-Type": "application/json"
  }
});

// Validation settings
const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__submit-btn_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible"
};

// Enable form validation
enableValidation(settings);

//Profile Elements
const profileEditButton = document.querySelector(".profile__edit-btn");
const cardEditButton = document.querySelector(".profile__add-btn");
const profileName = document.querySelector(".profile__name");
const profileDesc = document.querySelector(".profile__description");

//Form Elements
const editModal = document.querySelector("#edit-modal");
const editFormElement = document.forms["edit-profile"];
const editModalCloseBtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescInput = editModal.querySelector("#profile-desc-input");

const cardModal = document.querySelector("#add-card-modal");
const cardForm = document.forms["add-card"];
const cardSubmitBtn = cardModal.querySelector(".modal__submit-btn");
const cardModalCloseBtn = cardModal.querySelector(".modal__close-btn");
const cardNameInput = cardModal.querySelector("#add-card-name-input");
const cardLinkInput = cardModal.querySelector("#add-card-link-input");

const previewModal = document.querySelector("#preview-modal");
const previewModalImageEl = previewModal.querySelector(".modal__image");
const previewModalCaptionEl = previewModal.querySelector(".modal__caption");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");

const avatarModal = document.querySelector("#avatar-modal");
const avatarForm = document.forms["avatar"];
const avatarModalCloseBtn = avatarModal.querySelector(".modal__close-btn");
const avatarLinkInput = avatarModal.querySelector("#avatar-link-input");

// Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

const deleteModal = document.querySelector("#delete-card-modal");
const deleteForm = document.forms["delete-card"];
const deleteModalCloseBtn = deleteModal.querySelector(".modal__close-btn");
const deleteModalCancelBtn = deleteModal.querySelector(".modal__cancel-btn");

editModalCloseBtn.querySelector("img").src = closeIcon;
cardModalCloseBtn.querySelector("img").src = closeIcon;
deleteModalCloseBtn.querySelector("img").src = closeIcon;
avatarModalCloseBtn.querySelector("img").src = closeIcon;

let currentUser = {};
let selectedCard;
let selectedCardId;

function handleOverlayClick(evt) {
  if (evt.target.classList.contains('modal')) {
    closeModal(evt.target);
  }
}

function handleEscClose(evt) {
  if (evt.key === "Escape") {
      closeModal(document.querySelector('.modal_opened'));
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener('keydown', handleEscClose);
  modal.addEventListener('click', handleOverlayClick);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener('keydown', handleEscClose);
  modal.removeEventListener('click', handleOverlayClick);
}

function handleEditFormSubmit(evt) {
  function makeRequest() {
    return api.editProfile(editModalNameInput.value, editModalDescInput.value)
      .then((userData) => {
        profileName.textContent = userData.name;
        profileDesc.textContent = userData.about;
        closeModal(editModal);
      });
  }

  handleSubmit(makeRequest, evt, "Saving...");
}

function handleAddCardSubmit(evt) {
  function makeRequest() {
    return api.addCard(cardNameInput.value, cardLinkInput.value)
      .then((cardData) => {
        renderCard(cardData);
        // Form reset is handled by handleSubmit
        closeModal(cardModal);
      });
  }

  handleSubmit(makeRequest, evt, "Saving...");
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");
  const cardLikeBtn = cardElement.querySelector(".card__like-btn");
  const cardRemoveBtn = cardElement.querySelector(".card__remove-btn");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.name;

  // Check if current user has liked this card
  // Using the isLiked property directly from the API response
  const isLiked = data.isLiked;
  if (isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  // Only show delete button if current user owns the card
  // The API returns owner as an object with _id property
  let cardOwnerId;
  if (data.owner && typeof data.owner === 'object' && data.owner._id) {
    cardOwnerId = data.owner._id;
  } else {
    cardOwnerId = data.owner;
  }

  if (cardOwnerId !== currentUser._id) {
    cardRemoveBtn.style.display = "none";
  }

cardLikeBtn.addEventListener("click", () => {
  const isCurrentlyLiked = cardLikeBtn.classList.contains("card__like-btn_liked");

  // Disable button during request
  cardLikeBtn.disabled = true;

  if (isCurrentlyLiked) {
    api.dislikeCard(data._id)
      .then((updatedCard) => {
        cardLikeBtn.classList.remove("card__like-btn_liked");
        data.likes = updatedCard.likes;
        data.isLiked = false; // Update the isLiked property
      })
      .catch((err) => console.error("Error disliking card:", err))
      .finally(() => {
        cardLikeBtn.disabled = false;
      });
  } else {
    api.likeCard(data._id)
      .then((updatedCard) => {
        cardLikeBtn.classList.add("card__like-btn_liked");
        data.likes = updatedCard.likes;
        data.isLiked = true; // Update the isLiked property
      })
      .catch((err) => console.error("Error liking card:", err))
      .finally(() => {
        cardLikeBtn.disabled = false;
      });
  }
});

  cardRemoveBtn.addEventListener("click", () => {
    selectedCard = cardElement;
    selectedCardId = data._id;
    openModal(deleteModal);
  });

  cardImageEl.addEventListener("click", () => {
    openModal(previewModal);
    previewModalCaptionEl.textContent = data.name;
    previewModalImageEl.src = data.link;
    previewModalImageEl.alt = data.name;
  });

  return cardElement;
}

function renderCard(item, method = "prepend") {
  const cardElement = getCardElement(item);
  cardsList[method](cardElement);
}

Promise.all([api.getUserInfo(), api.getInitialCards()])
  .then(([userData, cards]) => {
    // Store current user data
    currentUser = userData;

    // Update profile with user data
    profileName.textContent = userData.name;
    profileDesc.textContent = userData.about;
    // Update avatar from server data
    profileAvatar.src = userData.avatar;

    // Render cards from server - ensure we have current user info first
    cards.forEach(cardData => {
      renderCard(cardData, "append");
    });
  })
  .catch((err) => {
    console.error("Error loading initial data:", err);
  });

function handleDeleteSubmit(evt) {
  function makeRequest() {
    return api.deleteCard(selectedCardId)
      .then(() => {
        selectedCard.remove();
        closeModal(deleteModal);
        selectedCard = null;
        selectedCardId = null;
      });
  }

  handleSubmit(makeRequest, evt, "Deleting...");
}

function handleAvatarSubmit(evt) {
  function makeRequest() {
    return api.editAvatar(avatarLinkInput.value)
      .then((userData) => {
        profileAvatar.src = userData.avatar;
        // Form reset is handled by handleSubmit
        closeModal(avatarModal);
      });
  }

  handleSubmit(makeRequest, evt, "Saving...");
}

// renderLoading function moved to utils.js

profileEditButton.addEventListener("click", () => {
  editModalNameInput.value = profileName.textContent;
  editModalDescInput.value = profileDesc.textContent;
  resetValidation(editFormElement, [editModalNameInput, editModalDescInput], settings);
  openModal(editModal);
});

editModalCloseBtn.addEventListener("click", () => {
  closeModal(editModal);
});

cardEditButton.addEventListener("click", () => {
  resetValidation(cardForm, [cardNameInput, cardLinkInput], settings);
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

deleteModalCloseBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

deleteModalCancelBtn.addEventListener("click", () => {
  closeModal(deleteModal);
});

const profileAvatarContainer = document.querySelector(".profile__avatar-container");
profileAvatarContainer.addEventListener("click", () => {
  resetValidation(avatarForm, [avatarLinkInput], settings);
  openModal(avatarModal);
});

avatarModalCloseBtn.addEventListener("click", () => {
  closeModal(avatarModal);
});

avatarForm.addEventListener("submit", handleAvatarSubmit);
deleteForm.addEventListener("submit", handleDeleteSubmit);
editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

