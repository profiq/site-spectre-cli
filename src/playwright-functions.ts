import exp from 'constants';
import { chromium, devices } from 'playwright';
import { formatConnectionMessage, newLogger, logger } from './logger';
import chalk from 'chalk';
import { totalNumberOfLinks } from './sitemap-parsers';


// const waitForLoadStateConfig: {
//   "document": {
//     waitForLoadState: "domcontentloaded"
//   },
//   "network": {
//     waitForLoadState: "networkidle"
//   }
// }




/**
 * function logging to console without winston
 * @param links array of links we want to visit
 */
async function visitSites(links:string[]){
    const browser = await chromium.launch();
    const context = await browser.newContext(devices['Desktop Chrome']);
    const page = await context.newPage();
    let response;
    let numOfOK = 0;
    let numOfErrors = 0;
    let sTotalTime = performance.now();

    // visit and print page titles
    for(let i = 0; i< links.length; i++){
        let stime = performance.now();
        response = await page.goto(links[i]);
        let ftime = performance.now();
        let elapsed_time = ftime - stime;
        console.log(`${i+1}/${links.length} - ${response?.status()} -  ${Math.floor(elapsed_time)} ms - ${response?.url()}`);
        if(response?.status() === 200){
            numOfOK++;
        }
        else{
            numOfErrors++;
        }
    }
    let fTotalTime = performance.now()
    let elapsed_totalTime = fTotalTime - sTotalTime;


    console.log(`\nNumber of OK visits: ${numOfOK}   \nNumber of failed visits: ${numOfErrors}   \nTime to complete all visits: ${Math.floor(elapsed_totalTime/100)/10} s`);

    // Teardown
    await context.close();
    await browser.close();

}

/**
 * visits all our specified links, each visit reports to log file and console, summarizes successful and failed visits, logs total time
 * @param links array of links we want to visit
 */
async function visitSitesWinston(links:string[]){
    const browser = await chromium.launch();
    const context = await browser.newContext(devices['Desktop Chrome']);
    const page = await context.newPage();
    let response;
    let numOfOK = 0;
    let numOfErrors = 0;

    logger.log('info', `expected total number of links: ${totalNumberOfLinks}`)

    const sTotalTime = performance.now();

    for(let i = 0; i< links.length; i++){
        try{
            const stime = performance.now();
            response = await page.goto(links[i]);
            /*const popupPromise = page.waitForEvent('popup');
            await page.getByRole('button').click(); // Click triggers a popup.
            const popup = await popupPromise;
            await popup.waitForLoadState('domcontentloaded');*/
            await page.waitForLoadState('networkidle', {timeout: 30000});
            const ftime = performance.now();
            const elapsed_time = ftime - stime;

            if(response !== null){
                if(response.status() === 200  && response.url() !== 'https://www.profiq.com/job/junior-developer/'){
                    logger.log('info', chalk.green(formatConnectionMessage(i, links.length, response.status(), elapsed_time, response.url())));
                    numOfOK++;
                }
                else {
                    logger.log('error', (formatConnectionMessage(i, links.length, response.status(), elapsed_time, response.url())));
                    numOfErrors++;
                }
            }
            else{
                logger.log('error', chalk.red('response is null'));
                numOfErrors++;
            }
        } catch(error) {
            logger.log('error', `Error processing the request ${links[i]}, error: ${error}`);
                    numOfErrors++;
        }




    }
    const fTotalTime = performance.now()
    const elapsed_totalTime = fTotalTime - sTotalTime;


    logger.log('info', `Number of OK visits: ${numOfOK}   \nNumber of failed visits: ${numOfErrors}   \nTime to complete all visits: ${Math.floor(elapsed_totalTime/100)/10} s`);

    // Teardown
    await context.close();
    await browser.close();

}


export {
    visitSites,
    visitSitesWinston
}
