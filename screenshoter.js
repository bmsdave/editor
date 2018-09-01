const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const screenshoter = async (fileContent) => {
    try {
        const browser = await puppeteer.launch({
            executablePath: process.env.CHROME_BIN || null,
            args: ['--no-sandbox', '--headless', '--disable-gpu']
            });
        const page = await browser.newPage();
        await page.setViewport({ width: 1200, height: 800 }); //throws an error if height parameter is not specified
        await page.setContent(fileContent);
        const screenshotStream = await page.screenshot({ type: "png" });
        await browser.close();
        return screenshotStream
    }
    catch (e) {
        console.error(e);
    }
}

module.exports = screenshoter;