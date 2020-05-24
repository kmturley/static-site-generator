const cheerio = require('cheerio');
const api = require('./api.js');
const file = require('./file.js');

const OUT_FILE = '/index.html';
const OUT_FOLDER = './dist';
const SITEMAP = '/sitemap.xml';

async function init() {
  const sitemap = await api.getXML(`${api.getBaseUrl()}${SITEMAP}`);
  const urls = await parseXml(sitemap);
  urls.forEach(async (url) => {
    const path = url === '/' ? '' : url;
    const html = await api.get(`${api.getBaseUrl()}${path}`);
    await file.createDirectory(`${OUT_FOLDER}${path}`);
    await file.createFile(`${OUT_FOLDER}${path}${OUT_FILE}`, html);
  });
};

async function parseXml(str) {
  const $ = cheerio.load(str, { xmlMode: true });
  const list = [];
  $('loc').map(function(i, el) {
    list.push($(this).text());
  });
  return list;
}

init();
