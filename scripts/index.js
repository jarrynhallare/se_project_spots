const editProfileButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const newPostButton = document.querySelector(".profile__post-button");
const newPostModal = document.querySelector("#new-post-modal");
const newPostCloseBtn = newPostModal.querySelector(".modal__close-btn");

editProfileButton.addEventListener("click", () => {
    editProfileModal.classList.add("modal_is-opened")
});

editCloseBtn.addEventListener("click", () => {
    editProfileModal.classList.remove("modal_is-opened")
});

newPostButton.addEventListener("click", () => {
    newPostModal.classList.add("modal_is-opened")
});

newPostCloseBtn.addEventListener("click", () => {
    newPostModal.classList.remove("modal_is-opened")
});
