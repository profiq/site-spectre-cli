import exp from "constants";
import { BrowserContext, Page, chromium, devices } from "playwright-chromium";
import { formatConnectionMessage, newLogger, logger, printPrefix } from "./logger";
import chalk from "chalk";
import { totalNumberOfLinks } from "./sitemap-parsers";
import { configType } from "./types";
import chunk from "lodash.chunk";

const waitForLoadStateConfig = {
  document: {
    waitForLoadState: "domcontentloaded",
  },
  network: {
    waitForLoadState: "networkidle",
  },
};

let visitCounter = 0;

const visitSite = async (
  link: string,
  config: configType,
  context: BrowserContext,
  links: string[],
) => {
  const page = await context.newPage();
  let response;

  try {
    const stime = performance.now();
    if (config.excludeTags && config.excludeTags.some((element) => link.includes(element))) {
      if (config.debugMode) {
        printSite(link, links, "info");
      }
      return -1;
    } else {
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
          visitCounter++;
          const localCounter = visitCounter;
          if (!config.silentRun) {
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
          }
          page.close();
          return 0;
        } else {
          visitCounter++;
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
          if (config.debugMode) {
            logger.log("error", `error: ${await response.statusText()}`);
          }
          page.close();
          return 1;
        }
      } else {
        visitCounter++;
        logger.log("error", chalk.red("response is null"));
        page.close();
        return 1;
      }
    }
  } catch (error) {
    visitCounter++;
    logger.log("error", `Error processing the request ${link}, error: ${error}`);
    page.close();
    return 1;
  }
};

const printSite = (link: string, links: string[], level: string) => {
  visitCounter++;
  const localCounter = visitCounter;
  logger.log(level, `${localCounter}/${links.length} - ${link}`);
};

const visitConfigPrint = (config: configType) => {
  logger.log("info", "\n***************************\nConfiguration:");
  if (config.configFilePath) {
    logger.log(
      "info",
      printPrefix(
        `Using config file: ${config.configFilePath} | Command line options take priority over config file\n` +
          chalk.yellow(
            "   CAUTION: If using default values manually (E.g. -p 2), then they will NOT take priority over config file.",
          ),
      ),
    );
  }

  if (config.dryRun) {
    logger.log(
      "info",
      printPrefix(chalk.yellow("Dry run, will only print links without visiting.")),
    );
  }
  if (config.silentRun) {
    logger.log("info", printPrefix(chalk.yellow("Silent run, will only print errors")));
  }
  if (config.parallelBlockSize === 0 || config.parallelBlockSize === 1) {
    logger.log(
      "info",
      printPrefix("parallelism: off | Will visit links in non-parallel mode. Setup using -p."),
    );
  } else {
    logger.log(
      "info",
      printPrefix(
        `paralleism: ${config.parallelBlockSize} | Will visit with ${config.parallelBlockSize} requests. Setup using -p.`,
      ),
    );
  }
  logger.log(
    "info",
    printPrefix(
      `timeout: ${config.requestTimeout} ms | Time until request times out. Setup using -t.`,
    ),
  );
  if (config.utilizeWaitForLoadState) {
    logger.log(
      "info",
      printPrefix(
        `Wait for load state: on | Will wait for load state specified in next line. Disable using -w.`,
      ),
    );
    logger.log(
      "info",
      printPrefix(
        `Load state mode: ${config.pageLoadType} | Waits for specified option. Change using -l.`,
      ),
    );
  } else {
    logger.log(
      "info",
      printPrefix(`Wait for load state: off | Will not wait for load state. You used -w.`),
    );
  }

  if (config.sitesFilePath) {
    logger.log("info", printPrefix(`Using links from file: ${config.sitesFilePath}`));
  }
  if (config.excludeTags) {
    //If((tags ∩ link) != ∅')
    logger.log(
      "info",
      printPrefix(`Excluding links containing: ${JSON.stringify(config.excludeTags)}`),
    );
  }
  logger.log("info", "***************************\n");
};

/**
 * visits all our specified links, each visit reports to log file and console, summarizes successful and failed visits, logs total time
 * @param links array of links we want to visit
 */
async function visitSitesWinston(links: string[], config: configType) {
  const browser = await chromium.launch();
  const context = await browser.newContext(devices["Desktop Chrome"]);

  let numOfOK = 0;
  let numOfErrors = 0;
  let numOfSkips = 0;

  logger.log("info", `expected total number of links: ${totalNumberOfLinks}\n`);

  const sTotalTime = performance.now();

  const chunkedLinks = chunk(links, config.parallelBlockSize ? config.parallelBlockSize : 1);
  visitCounter = 0;

  if (config.dryRun) {
    for (const chunk of chunkedLinks) {
      const promisedVisitSites = chunk.map((link) => {
        printSite(link, links, "info");
      });
      await Promise.all(promisedVisitSites);
    }
  } else {
    for (const chunk of chunkedLinks) {
      const promisedVisitSites = chunk.map((link) => {
        return visitSite(link, config, context, links);
      });

      const results = await Promise.all(promisedVisitSites);

      for (const result of results) {
        if (result === 0) {
          numOfOK++;
        } else if (result === -1) {
          numOfSkips++;
        } else {
          numOfErrors++;
        }
      }
    }

    const fTotalTime = performance.now();
    const elapsed_totalTime = fTotalTime - sTotalTime;

    logger.log(
      "info",
      `\nNumber of OK visits: ${numOfOK}   \nNumber of skipped visits: ${numOfSkips}   \nNumber of failed visits: ${numOfErrors}   \nTime to complete all visits: ${
        Math.floor(elapsed_totalTime / 100) / 10
      } s`,
    );
  }

  // Teardown
  await context.close();
  await browser.close();
}

export { visitSitesWinston, visitConfigPrint };
