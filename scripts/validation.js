const settings = {
  formSelector: ".modal__form",
  inputSelector: ".modal__input",
  submitButtonSelector: ".modal__submit-btn",
  inactiveButtonClass: "modal__button_disabled",
  inputErrorClass: "modal__input_type_error",
  errorClass: "modal__error_visible",
};

const showInputError = (formEl, inputEl, errorMsg) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textcontent = errorMsg;
  inputEl.classList.add("config.inputErrorClass");
};

const hideInputError = (formEl, inputEl) => {
  const errorMsgEl = formEl.querySelector(`#${inputEl.id}-error`);
  errorMsgEl.textcontent = "";
  inputEl.classList.remove("config.inputErrorClass");
};

const checkInputValidity = (formEl, inputEl) => {
  if (!inputEl.validity.valid) {
    showInputError(formEl, inputEl, inputEl.validationMessage);
  } else {
    hideInputError(formEl, inputEl);
  }
};

const hasInvalidInput = (inputList) => {
  return inputList.some((input) => {
    return !input.validity.valid;
  });
};

const toggleButtonState = (inputList, buttonEl) => {
  if (hasInvalidInput(inputList)) {
    disableButton(buttonEl);
  } else {
    buttonEl.disabled = false;
    // remove the disabled class - enable the button
  }
};

const disableButton = (buttonEl) => {
  buttonEl.disabled = true;
  // Add a modifier class to the buttonEl to make it grey
  // dont forget the CSS
};

const setEventListeners = (formEl) => {
  const inputList = Array.from(formEl.querySelectorAll("config.inputSelector"));
  const buttonEl = formEl.querySelector("config.submitButtonSelector");

  toggleButtonState(inputList, buttonEl, config);

  inputList.forEach((inputEl) => {
    inputEl.addEventListener("input", function () {
      checkInputValidity(formEl, inputEl, config);
      toggleButtonState(inputList, buttonEl, config);
    });
  });
};

const enableValidation = (config) => {
  const formList = document.querySelectorAll("config.formSelector");
  formList.forEach((formEl) => {
    setEventListeners(formEl, config);
  });
};

const resetValidation = (formEl, inputList) => {
  inputList.forEach((input) => {
    hideInputError(formEl, input);
  });
};

enableValidation(settings);
