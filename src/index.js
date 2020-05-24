const cheerio = require('cheerio');
const api = require('./api.js');
const file = require('./file.js');
const { URL } = require('url');

const OUT_FILE = '/index.html';
const OUT_FOLDER = './dist';
const SITEMAP = '/sitemap.xml';

async function init() {
  const sitemap = await api.get(`${api.getBaseUrl()}${SITEMAP}`);
  const urls = await parseXml(sitemap);
  urls.forEach(async (url) => {
    const path = url === '/' ? '' : url;
    const html = await api.get(`${api.getBaseUrl()}${path}`);
    await file.createDirectory(`${OUT_FOLDER}${path}`);
    await file.createFile(`${OUT_FOLDER}${path}${OUT_FILE}`, html);
    await parseHtml(html, `${api.getBaseUrl()}${path}`);
  });
};

async function downloadAsset(path, baseUrl) {
  const url = new URL(path, baseUrl);
  const asset = await api.get(url.href);
  const folder = url.pathname.substring(0, url.pathname.lastIndexOf('/'));
  let filename = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
  if (filename.includes('.') === false) {
    filename = 'index.html';
  }
  await file.createDirectory(`${OUT_FOLDER}${folder}`);
  await file.createFile(`${OUT_FOLDER}${folder}/${filename}`, asset);
};

async function parseHtml(str, baseUrl) {
  const $ = cheerio.load(str);
  $('[href],[src]').map(function(i, el) {
    const path = $(this).attr('href') || $(this).attr('src');
    if (path === '#') return;
    downloadAsset(path, baseUrl);
  });
}

async function parseXml(str) {
  const $ = cheerio.load(str, { xmlMode: true });
  const list = [];
  $('loc').map(function(i, el) {
    list.push($(this).text());
  });
  return list;
}

init();
