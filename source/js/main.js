'use strict';

// utils

function isEscEvent(evt) {
  return evt.keyCode === 27 || evt.key === 'Escape' || evt.key === 'Esc';
}

// scroll

function scrollToElement(element) {
  element.scrollIntoView({
    behavior: 'smooth',
    block: 'start',
  });
}

function smoothAnchorScroll() {
  var smoothLinks = document.querySelectorAll('a[href^="#"]:not(a[href="#"]');
  smoothLinks.forEach(function (smoothLink) {
    smoothLink.addEventListener('click', function (evt) {
      evt.preventDefault();
      var id = smoothLink.getAttribute('href');
      scrollToElement(document.querySelector(id));
    });
  });
}

smoothAnchorScroll();

// burger-menu

var navMain = document.querySelector('.main-nav');
var navLink = navMain.querySelectorAll('.main-nav__link');
var navToggle = navMain.querySelector('.main-nav__toggle');
var overlay = navMain.querySelector('.overlay');

function hideMenu() {
  navToggle.setAttribute('aria-label', 'Открыть меню');
  navMain.classList.add('main-nav--closed');
  navMain.classList.remove('main-nav--opened');
  overlay.classList.remove('overlay--show');
}

function onNavLinkClick() {
  for (var ind = 0; ind < navLink.length; ind++) {
    navLink[ind].addEventListener('click', function () {
      hideMenu();
    });
  }
}

function closeOnOverlay() {
  overlay.addEventListener('click', function (evt) {
    evt.preventDefault();
    hideMenu();
    document.removeEventListener('click', closeOnOverlay);
  });
}

function closeOnEsc(evt) {
  if (isEscEvent(evt)) {
    evt.preventDefault();
    hideMenu();
    document.removeEventListener('keydown', closeOnEsc);
  }
}

function showMenu() {
  navToggle.setAttribute('aria-label', 'Закрыть меню');
  navMain.classList.remove('main-nav--closed');
  navMain.classList.add('main-nav--opened');
  overlay.classList.add('overlay--show');

  document.addEventListener('click', closeOnOverlay);
  document.addEventListener('keydown', closeOnEsc);
}

function onNavToggleClick() {
  navMain.classList.remove('main-nav--nojs');

  navToggle.addEventListener('click', function () {
    if (navMain.classList.contains('main-nav--closed')) {
      showMenu();
    } else {
      hideMenu();
    }
  });
}

onNavToggleClick();
onNavLinkClick();


// form-validation

var form = document.querySelector('.form__content');
var nameInput = form.querySelector('input[type="text"]');
var phoneInput = form.querySelector('input[type="tel"]');
var submitButton = form.querySelector('button[type="submit"]');

var nameRegex = /^[A-Za-zА-Яа-яЁё\s]+$/;
var phoneRegex = /^((\+7|7|8)+([0-9]){10})$/;
var MIN_NUMBERS_LENGTH = 16;
var errorMessage = 'Пожалуйста, проверьте правильность введенных данных';

function createPhoneMask(evt) {
  var ind = 0;
  var matrix = '+7(___) ___-__-__';
  var defaultPrefix = matrix.replace(/\D/g, '');
  var value = evt.target.value.replace(/\D/g, '');

  if (defaultPrefix.length >= value.length) {
    value = defaultPrefix;
  }

  evt.target.value = matrix.replace(/./g, function (symbol) {
    if (/[_\d]/.test(symbol) && ind < value.length) {
      return value.charAt(ind++);
    } else {
      if (ind >= value.length) {
        return '';
      } else {
        return symbol;
      }
    }
  });
}

function checkPhoneFocus(field) {
  field.addEventListener('focus', function (evt) {
    if (field.value.length === 0) {
      evt.target.value = '+7';
    }
  });
  field.addEventListener('blur', function (evt) {
    if (field.value === '+7') {
      evt.target.value = '';
    }
  });
}

function showError(input) {
  if (!input.validity.valid) {
    input.classList.add('form__input-error');
  } else {
    input.classList.remove('form__input-error');
  }
}

function checkNameField(regex, field) {
  var inputValue = field.value;

  if (!inputValue) {
    field.setCustomValidity('Пожалуйста, введите Ваше имя');
    showError(field);
  } else if (!regex.test(inputValue)) {
    field.setCustomValidity(errorMessage);
    showError(field);
  } else {
    field.setCustomValidity('');
    showError(field);
  }
  field.reportValidity();
}

function checkPhoneField(regex, field) {
  var inputValue = field.value.replace(/\D/g, '');
  var valueLength = inputValue.length;

  if (valueLength === 0) {
    field.setCustomValidity('Пожалуйста, введите номер');
    showError(field);
  } else if (valueLength < MIN_NUMBERS_LENGTH && !regex.test(inputValue)) {
    field.setCustomValidity(errorMessage);
    showError(field);
  } else if (!regex.test(inputValue)) {
    field.setCustomValidity(errorMessage);
    showError(field);
  } else {
    field.setCustomValidity('');
    showError(field);
  }
  field.reportValidity();
}

checkPhoneFocus(phoneInput);

phoneInput.addEventListener('keypress', function (evt) {
  if (!/\d/.test(evt.key)) {
    evt.preventDefault();
    showError(phoneInput);
    phoneInput.setCustomValidity('Пожалуйста, начните вводить цифры');
  } else {
    phoneInput.setCustomValidity('');
    showError(phoneInput);
  }
});

phoneInput.addEventListener('input', createPhoneMask);

// localStorage

var storageName = '';
var storageTel = '';

function isStorage() {
  try {
    storageName = localStorage.getItem('userName');
    storageTel = localStorage.getItem('userPhone');
    return true;
  } catch (err) {
    return false;
  }
}

var isStorageSupport = isStorage();

function saveFormData() {
  if (isStorageSupport) {
    localStorage.setItem('userName', nameInput.value);
    localStorage.setItem('userPhone', phoneInput.value);
  }
}

function fillForm() {
  isStorage();
  if (storageName && storageTel) {
    nameInput.value = storageName;
    phoneInput.value = storageTel;
  } else if (storageName) {
    nameInput.value = storageName;
    phoneInput.focus();
  } else if (storageTel) {
    phoneInput.value = storageTel;
    nameInput.focus();
  } else {
    nameInput.focus();
  }
}

fillForm();

// nameInput.addEventListener('input', function (evt) {
//  checkNameField(nameRegex, evt.target);
// });

// phoneInput.addEventListener('input', function (evt) {
//  checkPhoneField(phoneRegex, evt.target);
// });

function onButtonClick() {
  submitButton.addEventListener('click', function () {
    checkNameField(nameRegex, nameInput);
    checkPhoneField(phoneRegex, phoneInput);
  });
}

form.addEventListener('submit', function (evt) {

  if (onButtonClick() === false) {
    evt.preventDefault();
  } else {
    saveFormData();
    // evt.target.submit();
  }
});
