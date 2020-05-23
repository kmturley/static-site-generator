const api = require('./api.js');

async function init() {
  const sitemap = await api.getXML(`${api.getBaseUrl()}/sitemap.xml`);
  const items = sitemap.urlset.url;
  items.forEach(async (item) => {
    const page = await api.get(`${api.getBaseUrl()}${item.loc[0]}`)
    console.log(item.loc[0], page.substr(0, 100));
  });
};

init();
