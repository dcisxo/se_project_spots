const initialCards = [
  {
    name: "Time lapse of stars in PR",
    link: "https://unsplash.com/photos/time-lapse-photography-of-star-273_wcQPfYw",
  },
  {
    name: "Drip coffee! Yum!",
    link: "https://unsplash.com/photos/person-pouring-coffee-on-white-ceramic-cup-U4euPE63P3E",
  },
  {
    name: "Bowl of ramen",
    link: "https://unsplash.com/photos/sliced-bread-on-black-ceramic-plate-CnY6_UFphs0",
  },
  {
    name: "Doing yoga at sunset",
    link: "https://unsplash.com/photos/silhouette-of-person-performing-yoga-4InW0sYpW-M",
  },
  {
    name: "Going back to them old school games",
    link: "https://unsplash.com/photos/a-person-holding-a-gameboy-in-their-hand-gsbpSj0buQg",
  },
  {
    name: "One of the Great Pyramids of Giza",
    link: "https://unsplash.com/photos/a-pyramid-in-the-desert-GsZsn8SaUzg",
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