const puppeteer = require("puppeteer");

const EXTENSION_PATH = "build/";

jest.setTimeout(1000 * 100);

let browser;
let page;

// TODO: add linter support
const getBrowser = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    args: [
      `--disable-extensions-except=${EXTENSION_PATH}`,
      `--load-extensions=${EXTENSION_PATH}`,
    ],
  });

  return browser;
};

const getExtensionId = async (page) => {
  await page.goto(`https://web3antivirus.io`);
  await page.bringToFront();
  const swTarget = await browser.waitForTarget((target) => {
    return target.type() === "service_worker";
  });

  const serviceWorker = await swTarget.worker();
  const extensionId = await serviceWorker.evaluate(async () => {
    return chrome && chrome.runtime && chrome.runtime.id;
  });

  return extensionId;
};

describe("My Extension", () => {
  beforeAll(async () => {
    browser = await getBrowser();
    page = await browser.newPage();
  });

  afterAll(async () => {
    await browser.close();
  });

  it("check popup is rendering", async () => {
    const extensionId = await getExtensionId(page);
    await page.goto(`chrome-extension://${extensionId}/index.html`);
    await page.bringToFront();
  
    const h3Element = await page.$("h3");
    const h3Text = await h3Element.evaluate((e) => e.innerText);
    expect(h3Text).toEqual("W3A is running in the background");
  });

  it("user token created", async () => {
    await page.goto(`https://web3antivirus.io`);
    await page.bringToFront();
    const swTarget = await browser.waitForTarget((target) => {
      return target.type() === "service_worker";
    });

    const serviceWorker = await swTarget.worker();
    const data = await serviceWorker.evaluate(async () => {
      const USER_TOKEN_NAME = 'userToken';
      const result = await chrome.storage.local.get(USER_TOKEN_NAME);
      return result[USER_TOKEN_NAME];
    });

    expect(data).toBeTruthy();
  });
});
