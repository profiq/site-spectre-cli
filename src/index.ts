import { linksToArray, _readSitemap } from "./sitemap-parsers";
import { configType, visitSitesWinston } from "./link-visit";
import yargs from "yargs";
import { Interface } from "readline";

/*
const argv = yargs
  .option('name', {
    alias: 'n',
    describe: 'Your name',
    type: 'string',
    demandOption: true, // The option is required
  })
  .option('greeting', {
    alias: 'g',
    describe: 'A greeting message',
    type: 'string',
    default: 'Hello',
  })
  .argv;

// Access the parsed arguments and options
//@ts-ignore
const name = argv.name as string;
//@ts-ignore
const greeting = argv.greeting as string;

  console.log(`Hello, ${name}! You are ${greeting} years old.`);

  */

let sites: string[] = [
  "https://www.profiq.com/wp-sitemap-posts-post-1.xml",
  "https://www.profiq.com/wp-sitemap-posts-page-1.xml",
  "https://www.profiq.com/wp-sitemap-posts-job-1.xml",

  //"https://movingfast.tech/post-sitemap.xml"
];

const config: configType = {
  pageLoadType: "document",
  requestTimeout: 5000,
  utilizeWaitForLoadState: true,
  // TODO custom playwrigth headers || add to both fetch and playwright
  // custom headesr --> array
  parallelBlockSize: 5,
  customHeaders: {},
};

const profiq = "https://www.profiq.com/wp-sitemap.xml";
const sitetxt1 = "https://www.advancedhtml.co.uk/sitemap.txt";
const sitetxt2 = "https://www.coh3stats.com/sitemap.txt";

const runMain = async () => {
  const linksToVisit = await linksToArray(profiq, sites);

  //console.log(linksToVisit);

  await visitSitesWinston(linksToVisit, config);
  //const tmp = await _readSitemap('https://www.advancedhtml.co.uk/sitemap.txt');
  //console.log(tmp.split(/\n/));
};

runMain().then(() => {});
