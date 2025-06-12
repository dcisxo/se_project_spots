import "../pages/index.css";
import logoPath from "../images/logo.svg";
import pencilPath from "../images/pencil.svg";
import plusPath from "../images/plus.svg";
import avatarPath from "../images/avatar.jpg";
import closeIcon from "../images/close-icon.svg";
import { enableValidation, resetValidation } from '../scripts/validation.js';
import Api from "../scripts/Api.js";


document.querySelector(".header__logo").src = logoPath;
document.querySelector(".profile__edit-btn img").src = pencilPath;
document.querySelector(".profile__add-btn img").src = plusPath;
document.querySelector(".profile__avatar").src = avatarPath;

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

// Card related elements
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

editModalCloseBtn.querySelector("img").src = closeIcon;
cardModalCloseBtn.querySelector("img").src = closeIcon;

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
  evt.preventDefault();

  api.editProfile(editModalNameInput.value, editModalDescInput.value)
    .then((userData) => {
      profileName.textContent = userData.name;
      profileDesc.textContent = userData.about;
      closeModal(editModal);
    })
    .catch((err) => {
      console.error("Error updating profile:", err);
    });
}

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  api.addCard(cardNameInput.value, cardLinkInput.value)
    .then((cardData) => {
      renderCard(cardData);
      cardForm.reset();
      closeModal(cardModal);
    })
    .catch((err) => {
      console.error("Error adding card:", err);
    });
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

  // Check if card is liked by current user
  if (data.isLiked) {
    cardLikeBtn.classList.add("card__like-btn_liked");
  }

  cardLikeBtn.addEventListener("click", () => {
    const isLiked = cardLikeBtn.classList.contains("card__like-btn_liked");

    if (isLiked) {
      api.dislikeCard(data._id)
        .then(() => {
          cardLikeBtn.classList.remove("card__like-btn_liked");
        })
        .catch((err) => console.error("Error disliking card:", err));
    } else {
      api.likeCard(data._id)
        .then(() => {
          cardLikeBtn.classList.add("card__like-btn_liked");
        })
        .catch((err) => console.error("Error liking card:", err));
    }
  });

  cardRemoveBtn.addEventListener("click", () => {
    api.deleteCard(data._id)
      .then(() => {
        cardElement.remove();
      })
      .catch((err) => console.error("Error deleting card:", err));
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
    // Update profile with user data
    profileName.textContent = userData.name;
    profileDesc.textContent = userData.about;

    // Render cards from server
    cards.forEach(cardData => {
      renderCard(cardData, "append");
    });
  })
  .catch((err) => {
    console.error("Error loading initial data:", err);
  });

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
  openModal(cardModal);
});

cardModalCloseBtn.addEventListener("click", () => {
  closeModal(cardModal);
});

previewModalCloseBtn.addEventListener("click", () => {
  closeModal(previewModal);
});

editFormElement.addEventListener("submit", handleEditFormSubmit);
cardForm.addEventListener("submit", handleAddCardSubmit);

