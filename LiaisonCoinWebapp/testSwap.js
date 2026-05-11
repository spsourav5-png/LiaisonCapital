import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.error('PAGE LOG:', msg.text());
  });
  page.on('pageerror', error => {
    console.error('PAGE ERROR:', error.message);
  });
  
  try {
    await page.goto('http://localhost:5177/swap', { waitUntil: 'networkidle2' });
    console.log("Page loaded successfully.");
  } catch (e) {
    console.error("Navigation Error:", e.message);
  }
  
  await browser.close();
})();
