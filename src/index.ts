import {     linksToArray  } from './sitemap-parsers.js';   
import { visitSites, visitSitesWinston } from './playwright-functions.js'; 
import yargs from "yargs";

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

let sites:string[] = [
//'https://www.profiq.com/wp-sitemap-posts-post-1.xml',
// 'https://www.profiq.com/wp-sitemap-posts-page-1.xml',
 //'https://www.profiq.com/wp-sitemap-posts-job-1.xml'
];


let linksToVisit = [];



linksToVisit = await linksToArray( 'https://www.profiq.com/wp-sitemap.xml', sites);


visitSitesWinston(linksToVisit);













