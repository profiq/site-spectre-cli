import exp from "constants";
import { BrowserContext, Page, chromium, devices } from "playwright-chromium";
import { formatConnectionMessage, newLogger, logger } from "./logger";
import chalk from "chalk";
import { totalNumberOfLinks } from "./sitemap-parsers";
import { configType } from "./types";
import chunk from "lodash.chunk"

const waitForLoadStateConfig = {
  document: {
    waitForLoadState: "domcontentloaded",
  },
  network: {
    waitForLoadState: "networkidle",
  },
};

let visitCounter = 0;

const visitSite = async (link: string, config: configType, context: BrowserContext, links: string[] ) => {
  const page = await context.newPage();
  let response;

  try {
    const stime = performance.now();

    if (config.customHeaders) {
      await page.setExtraHTTPHeaders(config.customHeaders);
    }
    response = await page.goto(link, { timeout: config.requestTimeout });

    if (config.utilizeWaitForLoadState) {
      await page.waitForLoadState(
        waitForLoadStateConfig[config.pageLoadType].waitForLoadState as any,
        { timeout: config.requestTimeout },
      );
    }

    const ftime = performance.now();
    const elapsed_time = ftime - stime;

    if (response !== null) {
      if (
        response.status() ===
        200 /* && response.url() !== 'https://www.profiq.com/job/junior-developer/'*/
      ) {
        visitCounter++
        const localCounter = visitCounter;
        logger.log(
          "info",
          chalk.green(
            formatConnectionMessage(
              localCounter,
              links.length,
              response.status(),
              elapsed_time,
              response.url(),
            ),
          ),
        );
        page.close()
        return 0
      } else {
        visitCounter++
        const localCounter = visitCounter;
        logger.log(
          "error",
          formatConnectionMessage(
            localCounter,
            links.length,
            response.status(),
            elapsed_time,
            response.url(),
          ),
        );
        page.close()
        return 1
      }
    } else {
      visitCounter++
      logger.log("error", chalk.red("response is null"));
      page.close()
      return 1
    }
  } catch (error) {
    visitCounter++
    logger.log("error", `Error processing the request ${link}, error: ${error}`);
    page.close()
    return 1
  }


}



/**
 * visits all our specified links, each visit reports to log file and console, summarizes successful and failed visits, logs total time
 * @param links array of links we want to visit
 */
async function visitSitesWinston(links: string[], config: configType) {
  const browser = await chromium.launch();
  const context = await browser.newContext(devices["Desktop Chrome"]);

  let numOfOK = 0;
  let numOfErrors = 0;

  if(config.parallelBlockSize === 0 || config.parallelBlockSize ===1){
    logger.log("info", "visiting links in non-parallel mode");
  }
  else{
    logger.log("info", `visiting links in parallel mode, block size: ${config.parallelBlockSize}`);
  }
  logger.log("info", `expected total number of links: ${totalNumberOfLinks}\n`);

  const sTotalTime = performance.now();



  const chunkedLinks = chunk(links, (config.parallelBlockSize) ? config.parallelBlockSize : 1)
  visitCounter = 0;

  for(const chunk of chunkedLinks){

    const promisedVisitSites = chunk.map((link)=>{
      return visitSite(link, config, context, links)
    })

    const results = await Promise.all(promisedVisitSites)

    for(const result of results){
      if(result === 0){
        numOfOK++;
    } else {
        numOfErrors++;
    }
    }
  }

  const fTotalTime = performance.now();
  const elapsed_totalTime = fTotalTime - sTotalTime;

  logger.log(
    "info",
    `Number of OK visits: ${numOfOK}   \nNumber of failed visits: ${numOfErrors}   \nTime to complete all visits: ${
      Math.floor(elapsed_totalTime / 100) / 10
    } s`,
  );

  // Teardown
  await context.close();
  await browser.close();
}

export { visitSitesWinston, configType };
