import { linksToArray, _readSitemap, _parseSitemap } from "./sitemap-parsers";
import { visitConfigPrint, visitSitesWinston } from "./link-visit";
import yargs, { option } from "yargs";
import { Interface } from "readline";
import { Command, Option } from "commander";
import packageJSON from "../package.json";
import { logger } from "./logger";
import {
  checkConfigFile,
  createConfig,
  defaultParallel,
  defaultTimeout,
  sitesInput,
} from "./cli-inputs";
import chalk from "chalk";
import { configType } from "./types";
import { existsSync, readFileSync } from "fs";

const program = new Command();

program
  .version(packageJSON.version)
  .description("Visits all links in xml/txt sitemap")
  .argument("<url>", "Url of sitemap we want to visit")
  .option(
    "-p, --parallel <value>",
    "Number of concurrent threads visiting the target domain.",
    defaultParallel.toString(),
  )
  .option(
    "-t, --request-timeout <value>",
    "Number of ms until the requests wait for finish.",
    defaultTimeout.toString(),
  )
  //.option('-l, --page-load-type <value>', 'Type of wait until the page is loaded. Either document or network. Use network with extra caution.', 'document')
  .addOption(
    new Option(
      "-l, --page-load-type <value>",
      "Type of wait until the page is loaded. Use network with extra caution.",
    )
      .choices(["document", "network"])
      .default("document"),
  )
  .option("-w, --no-wait-page-load", "Disable waiting for page to be loaded.")
  .option("-h, --custom-headers", "Pass a custom header.") //
  .option("-d, --debug", "Sets the prinout level to debug.") //
  .option("-D, --dry", "Just prints the links it would visit without visiting.")
  .option("-s, --silent", "Log only errors.")
  .option(
    "-c, --config-file <filePath>",
    "JSON config file, if you specify any other parameters, they override the config file.",
  )
  .option("-f, --input-file <filePath>", "Txt file with 1 sitemap link on each line."),
  program.parse(process.argv);

const options = program.opts();

const config = createConfig(options);

checkConfigFile(config, options);

let sites: string[] = [
  // "https://www.profiq.com/wp-sitemap-posts-post-1.xml",
  // "https://www.profiq.com/wp-sitemap-posts-page-1.xml",
  // "https://www.profiq.com/wp-sitemap-posts-job-1.xml",
  //"https://movingfast.tech/post-sitemap.xml"
];

visitConfigPrint(config);

/*
const runMain = async () => {


  const linksToVisit = await linksToArray(program.args[0], sitesInput(options.inputFile));

  //console.log(await _parseSitemap("https://steamcharts.com/app/730"));

  await visitSitesWinston(linksToVisit, config);
  //const tmp = await _readSitemap('https://www.advancedhtml.co.uk/sitemap.txt');
  //console.log(tmp.split(/\n/));
};
runMain().then(() => {});

*/
