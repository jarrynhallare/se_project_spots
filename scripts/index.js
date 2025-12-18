const initialCards = [
    {
        name: "Golden Gate Bridge",
        link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/7-photo-by-griffin-wooldridge-from-pexels.jpg",
},

    { 
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
},
    {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
},
    {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
},
    {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
},
    {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
},
    {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
},
];

const editProfileButton = document.querySelector(".profile__edit-btn");
const editProfileModal = document.querySelector("#edit-profile-modal");
const editCloseBtn = editProfileModal.querySelector(".modal__close-btn");
const editProfileForm = document.forms["editProfileForm"];
const editProfileNameInput = editProfileModal.querySelector("#profile-name-input");
const editProfileDescriptionInput = editProfileModal.querySelector("#profile-description-input");

const profileNameEl = document.querySelector(".profile__name");
const profileDescriptionEl = document.querySelector(".profile__description");


const previewModal = document.querySelector("#preview-modal");
const previewModalCloseBtn = previewModal.querySelector(".modal__close-btn");
const previewImageEl = previewModal.querySelector(".modal__image");
const modalCaptionEl = previewModal.querySelector(".modal__caption");


function handleEscKey(e) {
  if (e.key === 'Escape' || e.key === 'Esc' || e.keyCode === 27) {
    const openModalEl = document.querySelector('.modal_is-opened');
    if (openModalEl) {
      closeModal(openModalEl);
    }
  }
}

function openModal(modal) {
  modal.classList.add('modal_is-opened');
  document.body.style.overflow = 'hidden';
  document.addEventListener('keydown', handleEscKey);
}

function closeModal(modal) {
  modal.classList.remove('modal_is-opened');
  document.body.style.overflow = '';
  document.removeEventListener('keydown', handleEscKey);
}

function enableOverlayClose(modal) {
  modal.addEventListener('click', function (e) {
    if (e.target === e.currentTarget) {
      closeModal(e.currentTarget);
    }
  });
}

editProfileButton.addEventListener("click", () => {
    editProfileNameInput.value = profileNameEl.textContent;
    editProfileDescriptionInput.value = profileDescriptionEl.textContent;
    openModal(editProfileModal);

    
});
editCloseBtn.addEventListener("click", () => {
    closeModal(editProfileModal);
    
});
previewModalCloseBtn.addEventListener("click", () => {
    closeModal(previewModal);
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
const cardSubmitBtn = newPostModal.querySelector(settings.submitButtonSelector);
const addCardFormElement = newPostModal.querySelector(".modal__form");

const linkInput = addCardFormElement.querySelector("#card-image-input");   
const nameInput = addCardFormElement.querySelector("#card-caption-input");

enableOverlayClose(editProfileModal);
enableOverlayClose(newPostModal);
enableOverlayClose(previewModal);

newPostButton.addEventListener("click", () => {
    openModal(newPostModal);
});

newPostCloseBtn.addEventListener("click", () => {
    closeModal(newPostModal);
});

function handleAddCardSubmit(evt) {
    evt.preventDefault();
    const inputValues = {
        name: nameInput.value.trim(),
        link: linkInput.value.trim(),
    };

    if (inputValues.name !== "" && linkInput.validity.valid) {
        const cardElement = getCardElement(inputValues);
        cardsList.prepend(cardElement);
        addCardFormElement.reset();
        disableButton(cardSubmitBtn, settings);
        closeModal(newPostModal);
    }
}
    

const cardTemplate = document.querySelector("#card-template").content.querySelector(".card");
const cardsList = document.querySelector(".cards__list");

function getCardElement(data) {
const cardElement = cardTemplate.cloneNode(true);
const cardTitleEl = cardElement.querySelector(".card__title");
const cardImageEl = cardElement.querySelector(".card__image");

cardImageEl.src = data.link;
cardImageEl.alt = data.name;
cardTitleEl.textContent = data.name;

const cardLikeBtnEl = cardElement.querySelector(".card__like-button");
cardLikeBtnEl.addEventListener("click", () => {
cardLikeBtnEl.classList.toggle("card__like-button_active")

});

const cardDeleteBtnEl = cardElement.querySelector(".card__delete-button");
cardDeleteBtnEl.addEventListener("click", () => {
cardElement.remove();

});

cardImageEl.addEventListener("click", () => {
previewImageEl.src = data.link;
previewImageEl.alt = data.name;
modalCaptionEl.textContent = data.name;
openModal(previewModal);


});

return cardElement;
}

addCardFormElement.addEventListener('submit', handleAddCardSubmit);

initialCards.forEach( function(item) 
{
const cardElement = getCardElement(item);
cardsList.append(cardElement);
});