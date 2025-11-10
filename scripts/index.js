const editProfileButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = editProfileModal.querySelector(".modal__form");
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");

function openModal(modal) {
    modal.classList.add("modal_is-opened");
}
function closeModal(modal) {
    modal.classList.remove("modal_is-opened");
}

editProfileButton.addEventListener("click", () => {
    editProfileNameInput.value = profileNameEl.textContent;
    editProfileDescriptionInput.value = profileDescriptionEl.textContent;
    openModal(editProfileModal);
});
editCloseBtn.addEventListener("click", () => {
    closeModal(editProfileModal);
});
function handleEditProfileSubmit(evt) {
    evt.preventDefault();
    profileNameEl.textContent = editProfileNameInput.value;
    profileDescriptionEl.textContent = editProfileDescriptionInput.value;
     closeModal(editProfileModal);
}
editProfileForm.addEventListener("submit", handleEditProfileSubmit);

const newPostButton = document.querySelector(".profile__post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

const addCardFormElement = newPostModal.querySelector(".modal__form");

const linkInput = addCardFormElement.querySelector("#card-image-input");   
const nameInput = addCardFormElement.querySelector("#card-caption-input");

newPostButton.addEventListener("click", () => {
    openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
    closeModal(newPostModal);
});

function handleAddCardSubmit(evt) {
    evt.preventDefault();
    console.log(nameInput.value, linkInput.value);
     closeModal(newPostModal);
}

addCardFormElement.addEventListener('submit', handleAddCardSubmit);