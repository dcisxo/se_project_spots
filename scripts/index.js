const initialCards = [
  {
    name: "Time lapse of stars in PR",
    link: "https://images.unsplash.com/photo-1542314490-be9a382dbbb2?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Time lapse of the stars in Puerto Rico"
  },
  {
    name: "Drip coffee! Yum!",
    link: "https://images.unsplash.com/photo-1617590591232-26315f8482cb?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Guy pouring water into filter for drip coffee"
  },
  {
    name: "Bowl of ramen",
    link: "https://images.unsplash.com/photo-1603911036164-f2ef8a24e235?q=80&w=1364&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Beautiful bowl of ramen with pork belly and poached egg"
  },
  {
    name: "Doing yoga at sunset",
    link: "https://images.unsplash.com/photo-1516827003699-2880f453d93b?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Silhouette of person doing yoga at sunset"
  },
  {
    name: "Going back to them old school games",
    link: "https://images.unsplash.com/photo-1708958624305-8d4c083bdba6?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "Holding an original transparent Gameboy with Super Mario Land 2 on the screen"
  },
  {
    name: "One of the Great Pyramids of Giza",
    link: "https://images.unsplash.com/photo-1652150055994-2ca33da6fed6?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    alt: "One of the Great Pyramids of Giza"
  },
];

const profileEditButton = document.querySelector(".profile__edit-btn");
const profileName = document.querySelector(".profile__name");
const profileDesc = document.querySelector(".profile__description");

const editModal = document.querySelector("#edit-modal");
const editFormElement = editModal.querySelector(".modal__form");
const editModalClosebtn = editModal.querySelector(".modal__close-btn");
const editModalNameInput = editModal.querySelector("#profile-name-input");
const editModalDescInput = editModal.querySelector("#profile-desc-input");
const cardTemplate = document.querySelector("#card-template");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
  console.log(data);

  const cardElement = cardTemplate.content.querySelector(".card").cloneNode(true);
  const cardNameEl = cardElement.querySelector(".card__title");
  const cardImageEl = cardElement.querySelector(".card__image");

  cardNameEl.textContent = data.name;
  cardImageEl.src = data.link;
  cardImageEl.alt = data.alt;



  return cardElement;
}

function openModal() {
  editModalNameInput.value = profileName.textContent;
  editModalDescInput.value = profileDesc.textContent;
  editModal.classList.add("modal_opened");
}

function closeModal() {
  editModal.classList.remove("modal_opened");
}

function handleEditFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = editModalNameInput.value;
  profileDesc.textContent = editModalDescInput.value;
  closeModal();
}

profileEditButton.addEventListener("click", openModal);
editModalClosebtn.addEventListener("click", closeModal);
editFormElement.addEventListener("submit", handleEditFormSubmit);

for (let i = 0; i < initialCards.length; i++) {
  const cardElement = getCardElement(initialCards[i]);
  cardsList.prepend(cardElement);
}