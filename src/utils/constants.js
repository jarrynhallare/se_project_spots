
export const API_CONFIG = {
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "bd19a400-a994-4eac-8438-3bbbcede364b",
    "Content-Type": "application/json",
  },
};


export const SELECTORS = {
  cardsList: ".cards__list",
  cardTemplate: "#card-template",
  profileName: ".profile__name",
  profileDescription: ".profile__description",
  profileAvatar: ".profile__avatar",
};


export const MODALS = {
  editProfile: "#edit-profile-modal",
  newPost: "#new-post-modal",
  preview: "#preview-modal",
  avatar: "#avatar-modal",
  deleteConfirm: "#delete-confirm-modal",
};


export const BUTTON_TEXT = {
  saving: "Saving...",
  deleting: "Deleting...",
};


export const VALIDATION_SETTINGS = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};
