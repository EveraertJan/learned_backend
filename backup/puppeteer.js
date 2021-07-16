const puppeteer = require('puppeteer');
const iPhone = puppeteer.devices['iPhone 6'];
const select = require ('puppeteer-select');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.emulate(iPhone);

  await page.goto('https://crashlab.be/');
  await page.screenshot({path: 'src/output/screencap1.png'});
  

  const element = await select(page).getElement('a:contains(Tree-scape)');
  await element.click()


  await page.screenshot({path: 'src/output/test 2.png'});

  await browser.close();
})();