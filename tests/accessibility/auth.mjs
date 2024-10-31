import puppeteer from "puppeteer";
import lighthouse from "lighthouse";
import fs from "fs";
import path from "path";
import Loader from './Loader.js'; // Adjust the path as necessary

// Define the URL of the login page and the authenticated page to check
const LOGIN_URL = "http://localhost:8001/admin-dev";

// Trigger workflow
main();

async function main() {
  // Create loader instance
  const loader = new Loader();
  const browser = await puppeteer.launch({
    headless: true, // Set to true to run in headless mode
    slowMo: 50, // Slows down Puppeteer operations for visibility
  });

  const page = await browser.newPage();

  // Set screen size
  await page.setViewport({ width: 1400, height: 900 });

  // Setup the browser session to be logged into our site
  console.log(`Connect to BO:`);
  
  loader.start();
  await login(page, LOGIN_URL);
  loader.stop();

  // Extract and clean the token

  // Construct the URL to check
  const urlToCheckNoToken = `http://localhost:8001/admin-dev/index.php?controller=AdminSelfUpgrade&new-ui=1&route=home-page`;

  await page.goto(urlToCheckNoToken);

  // Click the continue button if it exists
  await clickContinueButton(page);
  
  const token = extractToken(page.url());
  const urlToCheck = `http://localhost:8001/admin-dev/index.php?controller=AdminSelfUpgrade&token=${token}&new-ui=1&route=home-page`;
  
  // Start the loader
  console.log(`Start Lighthouse`);
  loader.start();

  // Launch Lighthouse in the context of the current browser session
  const runLightHouse = await launchLighthouse(urlToCheck, page);

  // Stop the loader
  loader.stop();
  
  // Close the browser
  await browser.close();
}

function startLoader() {
  const spinnerChars = ['|', '/', '-', '\\'];
  let idx = 0;

  const loader = setInterval(() => {
    process.stdout.write(`\rLoading... ${spinnerChars[idx]}`);
    idx = (idx + 1) % spinnerChars.length; // Loop through spinner chars
  }, 100);

  return loader; // Return the loader for stopping it later
}

function stopLoader(loader) {
  clearInterval(loader);
  process.stdout.write('\rDone!         \n'); // Clear line and print "Done!"
}

async function login(page, origin) {
  await page.goto(origin);
  await page.waitForSelector("#email", { visible: true });
  await page.waitForSelector("#passwd", { visible: true });

  // Input login credentials
  const emailInput = await page.$("#email");
  await emailInput.type("admin@prestashop.com");

  const passwordInput = await page.$("#passwd");
  await passwordInput.type("prestashop");

  // Click the submit button and wait for navigation to complete
  await Promise.all([
    page.click("#submit_login"),
    page.waitForNavigation({ waitUntil: "networkidle0" }),
  ]);
}

function extractToken(currentUrl) {
  const urlParams = new URLSearchParams(currentUrl.split("?")[1]);
  let token = urlParams.get("token");

  // Remove '#' and anything that follows it, if it exists
  if (token) {
    token = token.split("#")[0];
  }

  return token; // Return the cleaned token
}

async function clickContinueButton(page) {
  const continueButton = await page.$(".btn-continue");

  if (continueButton) {
    await continueButton.click(); // Click the button if it exists

    // Optionally, wait for navigation or any other action after clicking
    await page.waitForNavigation({ waitUntil: "networkidle0" });
  } else {
    console.log("btn-continue not found.");
  }
}

async function launchLighthouse(urlToCheck, page) {
  // Define Lighthouse options to run only accessibility audits
  const config = {
    output: ["html", "json"],
    outputPath: "./",
    onlyCategories: ["accessibility"],
    formFactor: "desktop",
    screenEmulation: {
      width: 1400,
      height: 900,
      deviceScaleRatio: 1,
      mobile: false,
    },
  };

  // Launch Lighthouse and get the results
  const runnerResult = await lighthouse(urlToCheck, config);

  // Log the accessibility score directly
  const accessibilityScore =
    runnerResult.lhr.categories.accessibility.score * 100;
  console.log(`Accessibility Score: ${accessibilityScore}`);

  // Destructure the reports array to get HTML and JSON separately
  const reportHTML = runnerResult.report[0];
  const reportJSON = runnerResult.report[1];

  // Define the output paths
  const htmlOutputPath = path.join(
    "./tests/accessibility/",
    "lighthouse-report.html"
  );
  const jsonOutputPath = path.join(
    "./tests/accessibility/",
    "lighthouse-report.json"
  );

  // Write HTML and JSON reports to their respective files
  fs.writeFileSync(htmlOutputPath, reportHTML);
  fs.writeFileSync(jsonOutputPath, reportJSON);

  console.log("Lighthouse reports saved as HTML and JSON.");

  // Return separate constants for HTML and JSON report content
  return { reportHTML, reportJSON };
}
