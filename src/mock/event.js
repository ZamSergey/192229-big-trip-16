import dayjs from 'dayjs';

// Функция из интернета по генерации случайного числа из диапазона
// Источник - https://github.com/you-dont-need/You-Dont-Need-Lodash-Underscore#_random
const getRandomInteger = (a = 0, b = 1) => {
  const lower = Math.ceil(Math.min(a, b));
  const upper = Math.floor(Math.max(a, b));

  return Math.floor(lower + Math.random() * (upper - lower + 1));
};

const random = (a = 1, b = 0) => {
  const lower = Math.min(a, b);
  const upper = Math.max(a, b);
  return lower + Math.random() * (upper - lower);
};


const generateEventType = () => {
  const eventType = ['Taxi', 'Bus', 'Train', 'Ship', 'Drive', 'Flight', 'Check-in', 'Sightseeing', 'Restaurant'];

  const randomIndex = getRandomInteger(0, eventType.length - 1);

  return eventType[randomIndex];
};

const generateDestinationPoint = () => {
  const destination = ['Москва', 'Санкт-Петербург', 'Тверь', 'Кострома', 'Новгород', 'Ярославль', 'Вологда', 'Краснодар', 'Тихвин', 'Ростов'];

  const randomIndex = getRandomInteger(0, destination.length - 1);

  return destination[randomIndex];
};

const generateDescription = () => {
  const description = ['Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget.',
    'Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum.',
    'Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.',
    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra.'];

  const randomIndex = getRandomInteger(0, description.length - 1);

  return description[randomIndex];
};

const generateofferDescription = () => {
  const description = ['Upgrade to a business class',
    'Choose the radio station',
    'Feel good',
    'TV',
    'Air conditioner'];

  const randomIndex = getRandomInteger(0, description.length - 1);

  return description[randomIndex];
};

const generateOffer = (id) => {
  const maxPrice = 1000;
  return {
    id: id,
    title: generateofferDescription(),
    price: getRandomInteger(1,maxPrice)
  };
};

const generateOffers = (type) => {
  const maxOffers = 5;
  const currentofferNumber = getRandomInteger(1,maxOffers);
  const offers = [];
  for(let i = 0; i < currentofferNumber; i++ ){
    offers.push(generateOffer(i));
  }
  return {
    type: type,
    offers: offers
  };
};


const generatePicture = () => (
  {
    src:  `http://picsum.photos/248/152?r=${random(0,0.99999)}`,
    description: generateDescription()
  }
);

const generatePictures = () => {
  const maxPictures = 5;
  const curentMax = getRandomInteger(1,maxPictures);
  const pictures = [];
  for(let i = 0; i < curentMax;i++){
    pictures.push(generatePicture());
  }
  return pictures;
};

const generateDateStart = () => {

  //Разьборс дат для событий в днях
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);

  return dayjs().add(daysGap, 'day').toDate();
};

const generateDateEnd = (start) => {
  const maxDaysGap = 7;
  const daysGap = getRandomInteger(-maxDaysGap, maxDaysGap);
  return dayjs(start).add(daysGap, 'day').toDate();
};


const generateDestination = () => ({
  description: generateDescription(),
  name: generateDestinationPoint(),
  pictures: [
    {
      src: "http://picsum.photos/300/200?r=0.0762563005163317",
      description: ''
    }
  ]
});

const generatePoint = (id) => {
  const dateStart = generateDateStart();
  const dateEnd =  generateDateEnd(dateStart);
  const typeEvent = generateEventType();
  const point = {
    type: typeEvent,
    destination: generatePictures(),
    offers: generateOffers(typeEvent),
    id: id,
    is_favorite: Boolean(getRandomInteger(0, 1)),
    dateStart: dateStart,
    dateEnd: dateEnd,
    price: getRandomInteger(1, 1000)
  };
  return point;
};

const generateNumPoints = (number) => {
  const data = [];
  for(let i = 0; i < number; i++){
    data.push(generatePoint(i));
  }
  return data;
}

export {generateNumPoints};
