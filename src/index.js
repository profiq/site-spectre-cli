"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//import {     linksToArray  } from './sitemap-parsers.js';
//import { visitSites, visitSitesWinston } from './playwright-functions.js';
var yargs_1 = require("yargs");
var options = yargs_1.default
  .option("name", {
    describe: "Your name",
    demandOption: true,
    type: "string", // Specifies the type of the argument (string in this case)
  })
  .option("age", {
    describe: "Your age",
    demandOption: true,
    type: "number", // Specifies the type of the argument (number in this case)
  }).argv;
var name = options.name;
var age = options.age;
console.log("Hello, ".concat(name, "! You are ").concat(age, " years old."));
var sites = [
  //'https://www.profiq.com/wp-sitemap-posts-post-1.xml',
  // 'https://www.profiq.com/wp-sitemap-posts-page-1.xml',
  "https://www.profiq.com/wp-sitemap-posts-job-1.xml",
];
var linksToVisit = [];
//linksToVisit = await linksToArray(options.link, sites);
//visitSitesWinston(linksToVisit);
