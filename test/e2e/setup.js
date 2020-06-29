const {Builder, By, Key} = require('selenium-webdriver');
const config = require('./config');
const browserstack = require('browserstack-local');

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const assert = chai.assert;

process.env['webdriver.gecko.driver'] = '../../node_modules/geckodriver/geckodriver';
process.env['webdriver.chrome.driver'] = '../../node_modules/chromedriver/lib/chromedriver';

let driver;

const capabilities = {
  'os': 'Windows',
  'os_version': '10',
  'browserName': 'Chrome',
  'browser_version': '80',
  'browserstack.local': 'true',
  'acceptSslCerts': 'true',
  'name': 'POC'
};

const bs = new browserstack.Local();
const args = {'key': 'd9sxo4YepidkqDZHzStQ',
  'local-proxy-host': 'forwardproxy-pr-build.lb.cumuli.be',
  'local-proxy-port': '3128',
  'forceLocal': 'true',
  'verbose': 'true'
}

bs.start(args, function() {
  console.log('Started browserstack local');
});

if (config.gridEnabled) {
  driver = new Builder().usingServer(config.gridUrl).withCapabilities(capabilities).build();
} else {
  driver = new Builder().forBrowser(config.browserName).build();
}

after(async () => {

  bs.stop(function() {
    console.log('Stopped BrowserStackLocal');
  });

  return driver.quit();
});

module.exports = { assert, driver, By, Key };
