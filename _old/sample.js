const request = require('request');

request.get('http://store.steampowered.com/api/appdetails?appids=57690', 
  (err, response, body) => {
    console.log(body);
  });