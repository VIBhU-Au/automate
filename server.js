const { chromium } = require('playwright');
const path = require('path');
require('dotenv').config();

// Dummy JSON for transport date
const jsonData = {
    Journey_Date: { date: "2024-12-25" }, // Replace this dynamically from other JSONs
};
const phoneNumber = process.env.DEMO_PHONE_NUMBER;
// Path to Chrome user profile directory
const userDataDir = 'C:\\Users\\ansug\\AppData\\Local\\Google\\Chrome\\User Data\\Profile 10'; // Ensure this path is correct

(async () => {
    // Launch Chrome with your profile in persistent context
    const browser = await chromium.launchPersistentContext(userDataDir, {
        headless: false, // Run with a visible browser window
        args: ['--start-maximized'], // Maximize the window on start
    });

    // Open a dummy tab to keep the browser alive
    const dummyPage = await browser.newPage();
    await dummyPage.goto('about:blank'); // Keep a blank tab open

    // Create the two tabs
    const transportPage = await browser.newPage();
    const attractionPage = await browser.newPage();

    // Perform parallel operations
    await Promise.all([

        (async () => {   // Transport Page: Perform operations
            const transportURL = `https://www.abhibus.com/bus_search/Baroda/672/Statue%20of%20Unity%20(Navagam)/11405/${jsonData.Journey_Date.date}/O`;
            await transportPage.goto(transportURL);
            console.log(`Opened transport page: ${transportURL}`);

            const pages = browser.pages();
            if (pages.length > 0 && pages[0].url() === 'about:blank') {
                // Optional: Keeping this blank tab can help in maintaining browser state
                // await pages[0].close();
                // await pages[1].close();
            }

            // Dynamically handle login or seat selection
            // const 'a#login-link' = ''a#login-link''; // Login/SignUp button selector
            // const button.btn.bus-info-btn.filled.primary.sm.inactive.button = 'button.btn.bus-info-btn.filled.primary.sm.inactive.button'; // Select Seats button selector

            // Check which element is visible: Login/SignUp or Select Seats
            if (await transportPage.isVisible('a#login-link')) {
                console.log('Login button detected. Proceeding with login flow.');

                // Click the "Login/SignUp" button
                await transportPage.click('a#login-link');
                console.log('Login/SignUp button clicked successfully.');

                // Input a 10-digit phone number into the phone number field
                const phoneNumberSelector = 'input.true.mobileNo-input'; // Phone number input field selector
                await transportPage.fill(phoneNumberSelector, process.env.DEMO_PHONE_NUMBER);
                console.log('Phone number entered successfully.');

                // Wait for the "Login" button to be visible and interactable
                const loginButtonSelector = 'button.btn.btn-login.filled.primary.md.inactive.button'; // Login button selector
                await transportPage.click(loginButtonSelector);
                console.log('Login button clicked successfully.');

                // Optionally handle OTP here if needed (currently commented)
                // const otp = ['4', '6', '4', '6', '4', '6'];
                // for (let i = 0; i < otp.length; i++) {
                //     await transportPage.fill(`.otp-input .otp-pill:nth-child(${i + 1})`, otp[i]);
                // }
                // console.log('OTP entered successfully.');

                // Wait for the "Sign in with Google" button to disappear
                console.log('Waiting for the "Sign in with Google" button to disappear...');
                await transportPage.waitForSelector('a#login-google-link', { state: 'hidden' });
                console.log('"Sign in with Google" button has disappeared. Continuing with the next steps.');
            }
            console.log('Select Seats button detected. Proceeding with seat selection.');
            // Click the "Select Seats" button
            await transportPage.click('button.btn.bus-info-btn.filled.primary.sm.inactive.button');
            console.log('Select Seats button clicked successfully.');

            console.log('Transport page actions completed.');
        })(),

        (async () => {   // Attraction Page: Perform operations
            const attractionURL = 'https://www.soutickets.in/#/dashboard';
            await attractionPage.goto(attractionURL);
            console.log(`Opened tourist attraction page: ${attractionURL}`);

            // Assuming 'attractionPage' is the handle for the tourist attraction tab
            await attractionPage.waitForSelector('[mat-dialog-close]'); // Wait until the button is visible
            await attractionPage.click('[mat-dialog-close]'); // Click the button
            console.log('closed the popup on attraction tab.');


            // Assuming 'attractionPage' is the handle for the tourist attraction tab
            await attractionPage.waitForSelector('a.nav-link.login-btn'); // Wait for the element to be present and visible
            await attractionPage.click('a.nav-link.login-btn'); // Click the login link
            console.log('Clicked the LogIn link on the tourist attraction tab.');

            // Example phone number to input
            const phoneNumber = '9876543210';
            // Wait for the input field to be visible and interactable
            await attractionPage.waitForSelector('input[formcontrolname="phoneNumber"]');
            // Fill the phone number into the input field
            await attractionPage.fill('input[formcontrolname="phoneNumber"]', phoneNumber);
            console.log('Phone number entered successfully.');

            // Wait for the "Send OTP" button to be visible and interactable
            await attractionPage.waitForSelector('button.add-btn');
            // Click the button
            await attractionPage.click('button.add-btn');

            console.log('Send OTP button clicked successfully.');

            // OTP value to be entered
            const otp = '787878';

            // Locate the OTP input field and enter the value
            await attractionPage.fill('#mat-input-1', otp);

            console.log('OTP entered successfully in the attraction page.');


            console.log('Tourist attraction page actions completed.');
        })(),
    ]);
    dummyPage.on('close', () => {
        console.log('Dummy page closed. Browser will remain open.');
    });
    console.log('Both tab operations completed.');

})();
