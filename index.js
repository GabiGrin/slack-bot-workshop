const http = require('http');

const app = http.createServer((req, res) => {

  const currentUrl = req.url;

  var url = require('url');
  var url_parts = url.parse(currentUrl, true);
  var query = url_parts.query;

  res.send = res.end;

  const isSlackRequest = query.token && query.channel_name;

  if (isSlackRequest) {
    const command = query.text;
    const userName = query.user_name;

    const end = thing => {
      res.end(JSON.stringify(thing));
    };

    switch (command) {
      case '':
        end('Hi there! you can ask for a suggestion by entering /lunch suggest and list restaurants /lunch ls and get the log by /lunch log, add a new by /lunch add [PLACENAME]');
        break;
      case 'ls':
        res.end(getPlaces().join(', '));
        break;
      case 'log':
        end(getSuggestionsLog());
        break;
      case 'suggest':
        const place = suggestAPlaceToEat();
        logSuggestion(place, userName);
        res.end('You should eat at....... ... .. . ' + place + '!!!!!');
        break;
      default:
        const isAdd = command.indexOf('add ') === 0;
        if (isAdd) {

          const whatToAdd = command.replace('add ', '');
          const placeExists = getPlaces().indexOf(whatToAdd) !== -1;

          if (placeExists) {
            res.send(whatToAdd + ' is already in our list!');
          } else {
            logAddPlace(whatToAdd, userName);
            res.end('You just added ' + whatToAdd);
          }
        } else {
          res.end('Sorry sir, i do not understand this - ' + command);
        }
    }

  } else {
    switch (currentUrl) {
      case '/suggest':
          res.end(suggestAPlaceToEat());
          break;
      case '/log':

          const items = getSuggestionsLog();

          const html = `<head><style>body {width: 800px; background: #efefef}</style></head><body><h1>Our Amazeballs log</h1><ul>${items.map(item => {
            return `<li><strong>${item.user} ${item.type === 'add' ? 'added' : 'got a suggestion'} <i>${item.place}</i> at ${new Date(item.time).toLocaleString()}</li>`;
          })}</ul></body>`;
          res.end(html);
          break;
      default:
          res.end('<h1>404</h1>');
    }
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
  return place;
};

const logSuggestion = (place, user) => {
  const record = {
    place,
    type: 'suggest',
    user,
    time: Date.now()
  };
  suggestionsLog.push(record);
};

const logAddPlace = (place, user) => {
  const record = {
    place,
    type: 'new',
    user,
    time: Date.now()
  };
  suggestionsLog.push(record);
};

const getSuggestionsLog = () => {
  return suggestionsLog;
}


addPlace('Ziporah');
addPlace('McDonalds');
addPlace('Jeremiah');


app.listen(8000);
