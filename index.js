const http = require('http');

const app = http.createServer((req, res) => {

  const url = req.url;

  if (url.indexOf('suggest') !== -1) {
    res.end(suggestAPlaceToEat());
  } else {
    res.end(JSON.stringify(getSuggestionsLog()));
  }
  // res.end('YO!2');
});


let placesToEat = [];

let suggestionsLog = [];

const addPlace = (name) => {
  placesToEat.push(name);
};

const getPlaces = () => {
  return placesToEat;
};

const suggestAPlaceToEat = () => {
  const place =  placesToEat[Math.floor(Math.random() * placesToEat.length)];
  logSuggestion(place);
  return place;
};

const logSuggestion = place => {
  const record = {
    place,
    time: Date.now()
  };
  suggestionsLog.push(record);
};

const getSuggestionsLog = () => {
  return suggestionsLog;
}


addPlace('Ziporah');
addPlace('McDonalds');

console.log('Places:', getPlaces());

console.log('You shoud east it', suggestAPlaceToEat());
console.log('You shoud east it', suggestAPlaceToEat());
console.log('You shoud east it', suggestAPlaceToEat());
console.log('You shoud east it', suggestAPlaceToEat());

console.log(getSuggestionsLog());


app.listen(8000);
