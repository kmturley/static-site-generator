const http = require('http');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const BASE_URL = 'http://localhost:8080';

function getUrl(url, callback) {
  http.get(url, (res) => {
    const chunks = [];
    res.on('data', (chunk) => {
      chunks.push(chunk);
    });
    res.on('end', () => {
      callback(chunks.join(''));
    });
  });
}

getUrl(BASE_URL + '/sitemap.xml', (str) => {
  parser.parseString(str, (err, data) => {
    data.urlset.url.forEach((url) => {
      console.log(url.loc[0]);
    });
  });
});
