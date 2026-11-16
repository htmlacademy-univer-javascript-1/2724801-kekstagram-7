function getRandomInteger(min, max) {
  if (min > max) {
    const temp = min;
    min = max;
    max = temp;
  }
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomArrayElement(elements) {
  return elements[getRandomInteger(0, elements.length - 1)];
}

const COMMENTS_TEXTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];

const NAMES = [
  'Артём',
  'Анна',
  'Иван',
  'Мария',
  'Дмитрий',
  'Елена',
  'Максим',
  'Ольга',
  'Сергей',
  'Кекс'
];

let commentIdCounter = 1;

function generateComment() {
  const isTwoSentences = getRandomInteger(0, 1);
  let message = getRandomArrayElement(COMMENTS_TEXTS);
  if (isTwoSentences) {
    let secondSentence = getRandomArrayElement(COMMENTS_TEXTS);
    while (secondSentence === message) {
      secondSentence = getRandomArrayElement(COMMENTS_TEXTS);
    }
    message = `${message} ${secondSentence}`;
  }

  return {
    id: commentIdCounter++,
    avatar: `img/avatar-${getRandomInteger(1, 6)}.svg`,
    message: message,
    name: getRandomArrayElement(NAMES)
  };
}

function generateComments() {
  const commentsCount = getRandomInteger(0, 30);
  const comments = [];

  for (let i = 0; i < commentsCount; i++) {
    comments.push(generateComment());
  }

  return comments;
}

function generatePhoto(id) {
  return {
    id: id,
    url: `photos/${id}.jpg`,
    description: `Красивая фотография номер ${id}`,
    likes: getRandomInteger(15, 200),
    comments: generateComments()
  };
}

function generatePhotos() {
  const photos = [];

  for (let i = 1; i <= 25; i++) {
    photos.push(generatePhoto(i));
  }

  return photos;
}

generatePhotos();
