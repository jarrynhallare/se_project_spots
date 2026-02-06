import "./index.css";
import { enableValidation, settings, disableButton } from "../scripts/validation.js";
import Api from "../utils/Api.js";

let currentUserId = null;

import { API_CONFIG, VALIDATION_SETTINGS } from "../utils/constants.js";

const api = new Api(API_CONFIG);
enableValidation(VALIDATION_SETTINGS);

function handleEscKey(e) {
  if (e.key === "Escape" || e.key === "Esc" || e.keyCode === 27) {
    const openModalEl = document.querySelector(".modal_is-opened");
    if (openModalEl) closeModal(openModalEl);
  }
}

function openModal(modal) {
  if (!modal) return;
  modal.classList.add("modal_is-opened");
  document.body.style.overflow = "hidden";
  document.addEventListener("keydown", handleEscKey);
}

function closeModal(modal) {
  if (!modal) return;
  modal.classList.remove("modal_is-opened");
  document.body.style.overflow = "";
  document.removeEventListener("keydown", handleEscKey);
}

function enableOverlayClose(modal) {
  if (!modal) return;
  modal.addEventListener("click", function (e) {
    if (e.target === e.currentTarget) closeModal(e.currentTarget);
  });
}

function _getOwnerId(owner) {
  if (!owner) return null;
  return typeof owner === "string" ? owner : owner._id || null;
}

function _isCardLikedByUser(cardData, userId) {
  if (typeof cardData.isLiked === "boolean") return cardData.isLiked;
  if (Array.isArray(cardData.likes)) {
    return cardData.likes.some((like) => {
      if (!like) return false;
      return (like._id || like) === userId;
    });
  }
  return false;
}

document.addEventListener("DOMContentLoaded", () => {
  // DOM queries (guarded)
  const editProfileButton = document.querySelector(".profile__edit-btn");
  const editProfileModal = document.querySelector("#edit-profile-modal");
  const editCloseBtn = editProfileModal && editProfileModal.querySelector(".modal__close-btn");
  const editProfileForm = document.forms["editProfileForm"];
  const editProfileNameInput = editProfileModal && editProfileModal.querySelector("#profile-name-input");
  const editProfileDescriptionInput = editProfileModal && editProfileModal.querySelector("#profile-description-input");

  const profileNameEl = document.querySelector(".profile__name");
  const profileDescriptionEl = document.querySelector(".profile__description");
  const profileAvatarEl = document.querySelector(".profile__avatar");
  const profileIdEl = document.querySelector(".profile__id");

  const previewModal = document.querySelector("#preview-modal");
  const previewModalCloseBtn = previewModal && previewModal.querySelector(".modal__close-btn");
  const previewImageEl = previewModal && previewModal.querySelector(".modal__image");
  const modalCaptionEl = previewModal && previewModal.querySelector(".modal__caption");

  const newPostButton = document.querySelector(".profile__post-button");
  const newPostModal = document.querySelector("#new-post-modal");
  const newPostCloseBtn = newPostModal && newPostModal.querySelector(".modal__close-btn");
  const cardSubmitBtn = newPostModal && newPostModal.querySelector(settings.submitButtonSelector);
  const addCardFormElement = newPostModal && newPostModal.querySelector(".modal__form");
  const linkInput = addCardFormElement && addCardFormElement.querySelector("#card-image-input");
  const nameInput = addCardFormElement && addCardFormElement.querySelector("#card-caption-input");

  const cardTemplate = document.querySelector("#card-template") && document.querySelector("#card-template").content.querySelector(".card");
  const cardsList = document.querySelector(".cards__list");

  const avatarModal = document.querySelector("#avatar-modal");
  const avatarForm = avatarModal && avatarModal.querySelector(".modal__form");
  const avatarSubmitBtn = avatarModal && avatarModal.querySelector(".modal__submit-btn");
  const avatarModalCloseBtn = avatarModal && avatarModal.querySelector(".modal__close-btn");
  const avatarInput = avatarModal && avatarModal.querySelector("#profile-avatar-input");
  const avatarModalBtn = document.querySelector(".profile__avatar-btn");

  // Optional delete-confirm modal selectors (if you added that modal)
  const deleteConfirmModal = document.querySelector("#delete-confirm-modal");
  const deleteConfirmForm = document.querySelector("#delete-confirm-form");
  const deleteConfirmCloseBtn = deleteConfirmModal && deleteConfirmModal.querySelector(".modal__close-btn");
  const deleteConfirmSubmitBtn = deleteConfirmForm && deleteConfirmForm.querySelector(".modal__submit-btn");

  // Enable overlay close for modals that exist
  [editProfileModal, newPostModal, previewModal, avatarModal, deleteConfirmModal].forEach(enableOverlayClose);

  // Avatar button
  if (avatarModalBtn) avatarModalBtn.addEventListener("click", () => openModal(avatarModal));
  if (avatarModalCloseBtn) avatarModalCloseBtn.addEventListener("click", () => closeModal(avatarModal));

  // Avatar form
  if (avatarForm) {
    avatarForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const avatarLink = avatarInput.value.trim();
      if (!avatarLink || !avatarInput.validity.valid) return;
      const oldText = avatarSubmitBtn ? avatarSubmitBtn.textContent : null;
      if (avatarSubmitBtn) avatarSubmitBtn.textContent = "Saving...";
      api.editUserAvatar({ avatar: avatarLink })
        .then((updatedUser) => {
          if (profileAvatarEl && profileAvatarEl.tagName === "IMG") {
            profileAvatarEl.src = updatedUser.avatar;
            profileAvatarEl.alt = `${updatedUser.name} avatar`;
          }
          avatarForm.reset();
          if (avatarSubmitBtn) disableButton(avatarSubmitBtn, settings);
          closeModal(avatarModal);
        })
        .catch((err) => console.error("Avatar update failed:", err))
        .finally(() => {
          if (avatarSubmitBtn) avatarSubmitBtn.textContent = oldText;
        });
    });
  }

  // Open/close edit profile modal
  if (editProfileButton) {
    editProfileButton.addEventListener("click", () => {
      if (editProfileNameInput) editProfileNameInput.value = profileNameEl ? profileNameEl.textContent : "";
      if (editProfileDescriptionInput) editProfileDescriptionInput.value = profileDescriptionEl ? profileDescriptionEl.textContent : "";
      openModal(editProfileModal);
    });
  }
  if (editCloseBtn) editCloseBtn.addEventListener("click", () => closeModal(editProfileModal));
  if (previewModalCloseBtn) previewModalCloseBtn.addEventListener("click", () => closeModal(previewModal));

  if (newPostButton) newPostButton.addEventListener("click", () => openModal(newPostModal));
  if (newPostCloseBtn) newPostCloseBtn.addEventListener("click", () => closeModal(newPostModal));

  // Edit profile submit
  if (editProfileForm) {
    editProfileForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const name = editProfileNameInput.value.trim();
      const about = editProfileDescriptionInput.value.trim();
      if (!name || !about) return;
      const submitBtn = editProfileForm.querySelector(".modal__submit-btn");
      const oldText = submitBtn ? submitBtn.textContent : null;
      if (submitBtn) submitBtn.textContent = "Saving...";
      api.editUserInfo({ name, about })
        .then((updatedUser) => {
          if (profileNameEl) profileNameEl.textContent = updatedUser.name;
          if (profileDescriptionEl) profileDescriptionEl.textContent = updatedUser.about;
          if (profileAvatarEl && profileAvatarEl.tagName === "IMG") {
            profileAvatarEl.src = updatedUser.avatar;
            profileAvatarEl.alt = `${updatedUser.name} avatar`;
          }
          closeModal(editProfileModal);
        })
        .catch((err) => console.error("Profile update failed:", err))
        .finally(() => {
          if (submitBtn) submitBtn.textContent = oldText;
        });
    });
  }

  // Add card submit
  if (addCardFormElement) {
    addCardFormElement.addEventListener("submit", (evt) => {
      evt.preventDefault();
      const name = nameInput.value.trim();
      const link = linkInput.value.trim();
      if (!name || !link || !linkInput.validity.valid) return;
      const oldText = cardSubmitBtn ? cardSubmitBtn.textContent : null;
      if (cardSubmitBtn) cardSubmitBtn.textContent = "Saving...";
      api.addCard({ name, link })
        .then((createdCard) => {
          const cardElement = getCardElement(createdCard);
          if (cardsList) cardsList.prepend(cardElement);
          addCardFormElement.reset();
          if (cardSubmitBtn) disableButton(cardSubmitBtn, settings);
          closeModal(newPostModal);
        })
        .catch((err) => console.error("Add card failed:", err))
        .finally(() => {
          if (cardSubmitBtn) cardSubmitBtn.textContent = oldText;
        });
    });
  }

  // Delete confirmation modal handlers (if present)
  let selectedCardElement = null;
  let selectedCardId = null;

  function handleDeleteCardRequest(cardElement, cardData) {
    selectedCardElement = cardElement;
    selectedCardId = cardData._id;
    openModal(deleteConfirmModal);
  }

  if (deleteConfirmForm) {
    deleteConfirmForm.addEventListener("submit", (evt) => {
      evt.preventDefault();
      if (!selectedCardId) return;
      const oldText = deleteConfirmSubmitBtn ? deleteConfirmSubmitBtn.textContent : null;
      if (deleteConfirmSubmitBtn) deleteConfirmSubmitBtn.textContent = "Deleting...";
      api.deleteCard(selectedCardId)
        .then(() => {
          if (selectedCardElement && selectedCardElement.remove) selectedCardElement.remove();
          selectedCardElement = null;
          selectedCardId = null;
          closeModal(deleteConfirmModal);
        })
        .catch((err) => console.error("Delete card failed:", err))
        .finally(() => {
          if (deleteConfirmSubmitBtn) deleteConfirmSubmitBtn.textContent = oldText;
        });
    });
  }
  if (deleteConfirmCloseBtn) deleteConfirmCloseBtn.addEventListener("click", () => closeModal(deleteConfirmModal));

  const deleteModal = document.querySelector('#delete-confirm-modal');
const cancelDeleteBtn = deleteModal.querySelector('.modal__submit-btn_type_cancel');

cancelDeleteBtn.addEventListener('click', () => {
  closeModal(deleteModal);
});


  // Card creation
  function getCardElement(cardData) {
    const cardElement = cardTemplate.cloneNode(true);
    const cardTitleEl = cardElement.querySelector(".card__title");
    const cardImageEl = cardElement.querySelector(".card__image");
    const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
    const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");

    cardElement.dataset.cardId = cardData._id;

    if (cardImageEl) {
      cardImageEl.src = cardData.link;
      cardImageEl.alt = cardData.name;
      cardImageEl.addEventListener("click", () => {
        if (previewImageEl) {
          previewImageEl.src = cardData.link;
          previewImageEl.alt = cardData.name;
        }
        if (modalCaptionEl) modalCaptionEl.textContent = cardData.name;
        openModal(previewModal);
      });
    }

    if (cardTitleEl) cardTitleEl.textContent = cardData.name;

    // Ownership handling
    const ownerId = _getOwnerId(cardData.owner);
    const isOwner = ownerId && currentUserId && ownerId === currentUserId;
    if (cardDeleteBtnEl) cardDeleteBtnEl.style.display = isOwner ? "" : "none";

    if (cardDeleteBtnEl) {
      cardDeleteBtnEl.addEventListener("click", () => handleDeleteCardRequest(cardElement, cardData));
    }

    if (cardLikeBtnEl) {
      const initiallyLiked = _isCardLikedByUser(cardData, currentUserId);
      cardLikeBtnEl.classList.toggle("card__like-button_active", initiallyLiked);

      cardLikeBtnEl.addEventListener("click", () => {
        const willLike = !cardLikeBtnEl.classList.contains("card__like-button_active");
        api.changeLikeCardStatus(cardData._id, willLike)
          .then((updatedCard) => {
            const nowLiked = _isCardLikedByUser(updatedCard, currentUserId);
            cardLikeBtnEl.classList.toggle("card__like-button_active", nowLiked);
          })
          .catch((err) => console.error("Toggle like failed:", err));
      });
    }

    return cardElement;
  }

  // Initialize: load user + cards
  api.getAppInfo()
    .then(([userData, cards]) => {
      currentUserId = userData._id;
      if (profileNameEl) profileNameEl.textContent = userData.name;
      if (profileDescriptionEl) profileDescriptionEl.textContent = userData.about;
      if (profileAvatarEl && profileAvatarEl.tagName === "IMG") {
        profileAvatarEl.src = userData.avatar;
        profileAvatarEl.alt = `${userData.name} avatar`;
      }

      if (Array.isArray(cards) && cardsList) {
        cards.forEach((cardItem) => {
          const cardElement = getCardElement(cardItem);
          cardsList.append(cardElement);
        });
      }
    })
    .catch((err) => console.error("App init failed:", err));

  // Enable form validation (your existing module)
  enableValidation(settings);
});