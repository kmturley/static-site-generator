const request = require('sync-request');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

const BASE_URL = 'http://localhost:8080';
const TOKEN = '';
const OPTIONS = {
  headers: {
    'Authorization': 'Basic ' + Buffer.from(TOKEN + ':').toString('base64')
  }
};

function getBaseUrl() {
  return BASE_URL;
}

async function get(url, auth) {
  console.log('api.get', url);
  return await request('GET', url, auth === false ? null : OPTIONS).getBody('utf8');
};

async function getRaw(url, auth) {
  console.log('api.getRaw', url);
  return await request('GET', url, auth === false ? null : options).body;
};

async function getJSON(url) {
  console.log('api.getJSON', url);
  return JSON.parse(await get(url));
};

async function getXML(url) {
  console.log('api.getXML', url);
  return await new Promise(async (resolve, reject) => {
    const str = await get(url);
    parser.parseString(str, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
};

module.exports.getBaseUrl = getBaseUrl;
module.exports.get = get;
module.exports.getRaw = getRaw;
module.exports.getJSON = getJSON;
module.exports.getXML = getXML;
