import { processSitemap } from "./sitemap-parsers";
import { visitConfigPrint, visitSitesWinston } from "./link-visit";
import { Command, Option } from "commander";
import packageJSON from "../package.json";
import {
  checkConfigFile,
  createConfig,
  defaultParallel,
  defaultTimeout,
  sitesInput,
} from "./cli-inputs";

const program = new Command();

program
  .version(packageJSON.version)
  .description("Visits all links in xml/txt sitemap")
  .argument("<url>", "Url of sitemap we want to visit")
  .option(
    "-p, --parallel <value>",
    "Number of concurrent threads visiting the target domain.",
    defaultParallel,
  )
  .option(
    "-t, --request-timeout <value>",
    "Number of ms until the requests wait for finish.",
    defaultTimeout,
  )
  .addOption(
    new Option(
      "-l, --page-load-type <value>",
      "Type of wait until the page is loaded. Use network with extra caution.",
    )
      .choices(["document", "network"])
      .default("document"),
  )
  .option("-w, --no-wait-page-load", "Disable waiting for page to be loaded.")
  .option("-h, --custom-headers", "Pass a custom header.")
  .option("-d, --debug", "Sets the prinout level to debug.")
  .option("-D, --dry", "Just prints the links it would visit without visiting.")
  .option("-s, --silent", "Log only errors.")
  .option("-e, --exclude <pattern>", "Regex expression for links that should be excluded.")
  .option(
    "-c, --config-file <filePath>",
    "JSON config file, if you specify any other parameters, they take priority over the config file.",
  )
  .option("-f, --input-file <filePath>", "Txt file with 1 sitemap link on each line."),
  program.parse(process.argv);

const options = program.opts();

const config = createConfig(options);

const regexPattern = new RegExp(options.exclude);
config.excludePattern = regexPattern;

checkConfigFile(config, options);

let sites: string[] = [
  // "https://www.profiq.com/wp-sitemap.xml",
  // "https://www.profiq.com/wp-sitemap-posts-post-1.xml",
  // "https://www.profiq.com/wp-sitemap-posts-page-1.xml",
  // "https://www.profiq.com/wp-sitemap-posts-job-1.xml",
  // "https://movingfast.tech/post-sitemap.xml",
  // "https://www.advancedhtml.co.uk/sitemap.txt"
];

// node dist/src/index.js https://movingfast.tech/post-sitemap.xml -e "*/cs*"

visitConfigPrint(config);

const runMain = async () => {
  const linksToVisit = await processSitemap(
    program.args[0],
    sitesInput(options.inputFile),
    config,
  );

  await visitSitesWinston(linksToVisit, config);
};
runMain().then(() => {});
