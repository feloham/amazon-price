var request = require('request');
var cheerio = require('cheerio');
var async = require('async');

var amazonUrls = {
  uk: 'http://www.amazon.co.uk/dp/',
  us: 'http://www.amazon.com/dp/',
  es: 'http://www.amazon.es/dp/',
  fr: 'http://www.amazon.fr/dp/'
  // de: 'http://www.amazon.de/dp/',
  // it: 'http://www.amazon.it/dp/',
  // nl: 'http://www.amazon.nl/dp/'
};

function getPrice(location) {
  return function (asin, cb) {
    var url = amazonUrls[location] + asin;
    request(url, function (err, response, body) {
      if (err) return cb(err);

      var $ = cheerio.load(body);
      var price = $('.a-color-price', '#buybox').text();
      cb(null, price);
    })
  }
}

module.exports = function (asin, cb) {
  var priceCheckers = Object.keys(amazonUrls).map(function (country) {
    return async.apply(getPrice(country), asin);
  });

  async.parallel(priceCheckers, function (err, results) {
    cb(null, results);
  });
  
};
