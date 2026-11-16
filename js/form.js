import { initEditor, resetScale, resetEffects } from './effects.js';
import { sendData } from './api.js';

const form = document.querySelector('.img-upload__form');
const uploadInput = form.querySelector('.img-upload__input');
const uploadOverlay = form.querySelector('.img-upload__overlay');
const cancelButton = form.querySelector('.img-upload__cancel');
const textDescription = form.querySelector('.text__description');
const textHashtags = form.querySelector('.text__hashtags');
const submitButton = form.querySelector('.img-upload__submit');
const previewImage = form.querySelector('.img-upload__preview img');
const body = document.body;

const DEFAULT_IMAGE_SRC = 'img/upload-default-image.jpg';

const validateHashtags = (value) => {
  if (!value) {
    return true;
  }
  const hashtags = value.trim().split(/\s+/);
  if (hashtags.length > 5) {
    return 'Нельзя указать больше пяти хэш-тегов';
  }
  const lowerCaseHashtags = hashtags.map((tag) => tag.toLowerCase());
  for (let i = 0; i < hashtags.length; i++) {
    const tag = hashtags[i];
    if (tag[0] !== '#') {
      return 'Хэш-тег должен начинаться с символа #';
    }
    if (tag.length > 20) {
      return 'Максимальная длина одного хэш-тега 20 символов, включая #';
    }
    if (tag === '#') {
      return 'Хэш-тег не может состоять только из одной решётки';
    }
    if (!/^#[a-zа-яё0-9]+$/i.test(tag)) {
      return 'Хэш-тег не может содержать пробелы, спецсимволы или пунктуацию';
    }
    if (lowerCaseHashtags.indexOf(tag.toLowerCase()) !== i) {
      return 'Хэш-теги не должны повторяться';
    }
  }
  return true;
};

const pristine = new Pristine(form, {
  classTo: 'img-upload__field-wrapper',
  errorTextParent: 'img-upload__field-wrapper',
  errorTextClass: 'img-upload__field-wrapper--error',
});

pristine.addValidator(textHashtags, validateHashtags);
pristine.addValidator(textDescription, (value) => value.length <= 140, 'Длина комментария не может составлять больше 140 символов');

const successTemplate = document.querySelector('#success').content.querySelector('.success');
const errorTemplate = document.querySelector('#error').content.querySelector('.error');

const showMessage = (template, isError = false) => {
  const message = template.cloneNode(true);
  body.appendChild(message);

  function onEscMessage(evt) {
    if (evt.key === 'Escape') {
      evt.stopPropagation();
      closeMessage();
    }
  }

  function closeMessage() {
    message.remove();
    document.removeEventListener('keydown', onEscMessage);
  }

  message.addEventListener('click', (evt) => {
    if (evt.target === message) {
      closeMessage();
    }
  });

  const button = message.querySelector('button');
  button.addEventListener('click', closeMessage);
  document.addEventListener('keydown', onEscMessage);

  if (isError) {
    document.removeEventListener('keydown', onEscKeyDown);
  }
};

const resetForm = () => {
  form.reset();
  uploadInput.value = '';
  previewImage.src = DEFAULT_IMAGE_SRC;
  pristine.reset();
  resetScale();
  resetEffects();
};

const closeForm = () => {
  uploadOverlay.classList.add('hidden');
  body.classList.remove('modal-open');
  document.removeEventListener('keydown', onEscKeyDown);
  resetForm();
};

function onEscKeyDown(evt) {
  if (evt.key === 'Escape') {
    closeForm();
  }
}

const openForm = () => {
  uploadOverlay.classList.remove('hidden');
  body.classList.add('modal-open');
  document.addEventListener('keydown', onEscKeyDown);
};

const onUploadInputChange = () => {
  const file = uploadInput.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = (e) => {
      previewImage.src = e.target.result;
    };
    reader.readAsDataURL(file);
  }
  openForm();
};

form.addEventListener('submit', async (evt) => {
  evt.preventDefault();
  if (!pristine.validate()) {
    return;
  }

  const formData = new FormData(form);

  try {
    submitButton.disabled = true;
    await sendData(formData);
    closeForm();
    showMessage(successTemplate);
  } catch (err) {
    showMessage(errorTemplate, true);
  } finally {
    submitButton.disabled = false;
  }
});

uploadInput.addEventListener('change', onUploadInputChange);
cancelButton.addEventListener('click', closeForm);

textDescription.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});

textHashtags.addEventListener('keydown', (evt) => {
  if (evt.key === 'Escape') {
    evt.stopPropagation();
  }
});

initEditor();
