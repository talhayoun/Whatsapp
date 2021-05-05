const express = require("express");
const app = express();
const puppeteer = require("puppeteer");



app.use(express.json());
app.post("/", async(req, res)=>{
    console.log(req.body)
    let name = req.body.name;
    let text = req.body.text;
    await send(name, text)
    res.send("Success");
})

function send(name, txt){
    (async () => {
        try{

            let whatsappLink = "https://web.whatsapp.com/"; // A link to whatsapp web

            let userDataDirectory = "C:\Users\Administrator\AppData\Local\Google\Chrome\User Data"    //  It users the computer user data, so only need to activate barcode once
            let browser = await puppeteer.launch({ userDataDir: userDataDirectory ,headless: false}); // this launches the browser
        
        

            let page = await browser.newPage();     // Creating a new page
            await page.goto(whatsappLink);          // Going to the link specificed above ^^
            await page.waitForSelector('._2_1wd');  // Waiting for this the browser to find this query selector, if not found after 30 secs, shuts down.
            await page.waitForTimeout(1000);    // Time out for 1000 seconds so the browser loads everything


            // Clicking on the input search bar and setting focus on

            await page.click('div[data-tab="3"]');
            let pg = await page.$('div[data-tab="3"]');
            await pg.focus();


            // This inserts the user name in the search bar
            await page.evaluate(function(username){
                console.log(name, "%%%%");
                document.execCommand("insertText", false, username);
            }, name)

            // Finding the username in the suggested names list and setting focus on the message input

            await page.waitForTimeout(3000);
            await page.click(`span[title="${name}"]`)
            await page.waitForTimeout(1000);
            let text = await page.$('div[data-tab="6"]');
            text.focus();


            // Sending the message to the user
            await page.evaluate(function(textMessage){
                document.execCommand("insertText", false, textMessage)
            }, txt)
            await page.waitForTimeout(500);
            await page.click('button[class="_1E0Oz"]')
        }
        catch(err){
            console.log(err);
        }
    
      })();
}


app.listen(3000, ()=>{
    console.log("Server connected!");
})