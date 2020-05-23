var http = require('http');
var xml2js = require('xml2js');
var parser = new xml2js.Parser();

var BASE_URL = 'http://localhost:8080';

http.get(BASE_URL + '/sitemap.xml', function(res) {
  var chunks = [];
  res.on('data', function(chunk) {
    chunks.push(chunk);
  });
  res.on('end', function() {
    parser.parseString(chunks.join(''), function(err, result) {
      console.log('Done', result);
    });
  });
});
