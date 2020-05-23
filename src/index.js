const api = require('./api.js');
const file = require('./file.js');

const OUT_FILE = '/index.html';
const OUT_FOLDER = './dist';
const SITEMAP = '/sitemap.xml';

async function init() {
  const sitemap = await api.getXML(`${api.getBaseUrl()}${SITEMAP}`);
  const items = sitemap.urlset.url;
  items.forEach(async (item) => {
    const path = item.loc[0] === '/' ? '' : item.loc[0];
    const html = await api.get(`${api.getBaseUrl()}${path}`);
    await file.createDirectory(`${OUT_FOLDER}${path}`);
    await file.createFile(`${OUT_FOLDER}${path}${OUT_FILE}`, html);
  });
};

init();
