const puppeteer = require("puppeteer");
const path = require('path');

const browserOptions = {
    headless: true,
    defaultViewport: null,
    devtools: false,
}
let browser;
let page;

beforeAll(async () => {
    browser = await puppeteer.launch(browserOptions);
    page = await browser.newPage();
    await page.goto('file://' + path.resolve('./index.html'));
    //await page.screenshot({ path: 'Homepage.png' });
},30000);

afterAll((done) => {
    try {
        this.puppeteer.close();
    } catch (e) { }
    done();
});

describe("Basic HTML structure", () => {
    it("`index.html` should contain appropriate meta tags", async () => {
        const metaTags = await page.$$('meta');
        expect(metaTags.length).toBeGreaterThan(1);
    });
    it("`index.html` should contain a title tag that is not empty", async () => {
        const title = await page.$eval('title', el => el.innerHTML);
        expect(title).not.toBe('');
    });
});
describe("CSS Stylesheet", () => {
    it("CSS file should be linked", async () => {
        const cssLink = await page.$('link[rel="stylesheet"]');
        expect(cssLink).toBeTruthy();
    });
    it('No style attribute should be used in the table', async () => {
        // get all child elements of the table
        const table = await page.$('table');
        const styleAttributes = await table.$x('//*[@style]');
        // expect no style attributes to be present on the table
        expect(styleAttributes.length).toBe(0);
    });
});
describe("Table", () => {
    it("Table exists", async () => {
        const table = await page.$('table');
        expect(table).toBeTruthy();
    });
    it("Table should have 4 Columns", async () => {
        const columns = await page.$$('tbody tr:first-child td');
        expect(columns.length).toBe(4);
    });
});
describe("Table Links", () => {
    it("Links on the Page should open in a new tab", async () => {
        const links = await page.$$eval('*', el => Array.from(el).map(e => e.getAttribute('target')));
        expect(links.some(e => e === '_blank')).toBe(true);
    });
});