import { XMLParser } from "fast-xml-parser";
import { formatConnectionMessage, newLogger, logger } from "./logger";
import chalk from "chalk";
import { log } from "console";

let totalNumberOfLinks = 0;

/**
 * Reads data from website into string format
 * @param url url of website we want to read data from
 * @returns site data in string format
 */
const _readSitemap = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const data = await response.text();

  return data;
};

/**
 * Parses our xml from string format into an fast-xml-parser object
 * @param url url of website we want to read data from
 * @returns fast-xml-parser object with xml data from website
 */
const _parseSitemap = async (url: string) => {
  const parser = new XMLParser();
  const data = await _readSitemap(url);

  const parsedSitemapObject = await parser.parse(data);
  return parsedSitemapObject;
};

/**
 * Opens each sitemap link and pushes website links into our final array of links
 * @param links array of sitemap links
 * @returns array of extracted links
 */
const extractLinks = async (links: string[]): Promise<string[]> => {
  let expandedLinks: string[] = [];
  let tmpLinks: string[] = [];

  for (let i = 0; i < links.length; i++) {
    let parsedSitemapObject = await _parseSitemap(links[i]);
    tmpLinks = await _objToArray(parsedSitemapObject);

    for (let j = 0; j < tmpLinks.length; j++) {
      expandedLinks.push(tmpLinks[j]);
    }
    logger.log(
      "info",
      `Found sitemap: ${links[i]}\nNumber of links in sitemap: ${tmpLinks.length}\n`,
    );
    totalNumberOfLinks += tmpLinks.length;
  }

  return expandedLinks;
};

/**
 * Extracts the url links from the parsedSitemapObject and moves them into an array
 * @param parsedSitemapObject fast-xml-parser object
 * @returns array of links
 */
const _objToArray = async (parsedSitemapObject: any): Promise<string[]> => {
  let links: string[] = [];
  let tmpLinks: string[] = [];

  if (parsedSitemapObject.hasOwnProperty("sitemapindex")) {
    for (let i = 0; i < parsedSitemapObject.sitemapindex.sitemap.length; i++) {
      tmpLinks = await extractLinks([parsedSitemapObject.sitemapindex.sitemap[i].loc]);
      links = links.concat(tmpLinks);
    }
    return links;
  } else if (parsedSitemapObject.hasOwnProperty("urlset")) {
    for (let i = 0; i < parsedSitemapObject.urlset.url.length; i++) {
      links.push(parsedSitemapObject.urlset.url[i].loc);
    }
    return links;
  } else {
    logger.log("error", "xml doesnt have property sitemapindex or urlset (unsupported format)");
    return [];
  }
};

const splitLinks = (data: string) => {
  let tmpArray = data.split("\n");
  let finalArray: string[] = [];

  tmpArray.forEach((element) => {
    if (element.startsWith("http")) {
      finalArray.push(element);
    }
  });

  return finalArray;
};

/**
 * Reads all the url links from a .txt sitemap and seperates them into array of urls.
 * Same functionality as _objToArray but for .txt sitemaps
 * @param url link to the .txt sitemap
 * @returns array of links
 */
const _txtLinkToArray = async (url: string) => {
  try {
    const data = await _readSitemap(url);

    let tmpArray = data.split("\n");
    let finalArray: string[] = [];

    tmpArray.forEach((element) => {
      if (element.startsWith("http")) {
        finalArray.push(element);
        totalNumberOfLinks++;
      }
    });

    return finalArray;
  } catch (error) {
    logger.log("error", `Error reading links from .txt sitemap, error: ${error}`);
    return [];
  }
};

/**
 * Loads the links from our root xml sitemap,
 * we can either choose which sites from the root site it will load or load all the links by leaving second param empty.
 * Call this function only once
 * @param url - url of our root xml sitemap
 * @param sites - array of xml site links we want to visit, optional
 * @returns array of all xml sitemap links we will visit
 */
const linksToArray = async (url: string, sites: string[] = []): Promise<string[]> => {
  let links = [];

  if (sites.length) {
    logger.log("info", `reading from array of xml sites, num of links: ${sites.length}\n`);
    return extractLinks(sites);
  }

  if (url.endsWith(".txt")) {
    logger.log("info", "reading from txt sitemap\n");
    links = await _txtLinkToArray(url);
    return links;
  }

  let parsedSitemapObject = await _parseSitemap(url);

  logger.log("info", "reading from xml site\n");
  links = await _objToArray(parsedSitemapObject);
  return links;
};

export {
  linksToArray,
  totalNumberOfLinks,
  _readSitemap,
  _txtLinkToArray,
  _objToArray,
  _parseSitemap,
  splitLinks,
};
