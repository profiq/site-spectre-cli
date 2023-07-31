import { XMLParser } from "fast-xml-parser";
import { formatConnectionMessage, newLogger, logger } from './logger';
import chalk from 'chalk';

let totalNumberOfLinks = 0;

/**
 * Reads data from website into string format
 * @param url url of website we want to read data from
 * @returns site data in string format
 */
const readSitemap = async (url: string): Promise<string> => {

  const response =  await fetch(url)
  const data = await response.text()

  return data;

}

/**
 * Parses our xml from string format into an fast-xml-parser object
 * @param url url of website we want to read data from
 * @returns fast-xml-parser object with xml data from website
 */
const parseSitemap = async (url:string) =>{
  const parser = new XMLParser();
  const data = await readSitemap(url);

  try{
    const parsedSitemapObject = await parser.parse(data);
    return parsedSitemapObject;
  }

  catch(error){
    logger.log('error', `Error parsing xml data to fast-xml-parser object, url: ${url}, error: ${error}`);
  }
}

/**
 * Opens each sitemap link and pushes website links into our final array of links
 * @param links array of sitemap links
 * @returns array of extracted links
 */
const extractLinks = async (links:string[]): Promise<string[]> =>{
    let expandedLinks: string[]= [];
    let tmpLinks:string[] = [];



    for(let i = 0; i < links.length; i++){
        let parsedSitemapObject = await parseSitemap(links[i]);
        tmpLinks = await objToArray(parsedSitemapObject);

        for(let j = 0; j< tmpLinks.length; j++){
            expandedLinks.push(tmpLinks[j]);
        }
        logger.log('info',`\nFound sitemap: ${links[i]}\nNumber of links in sitemap: ${tmpLinks.length}\n`)
        totalNumberOfLinks+= tmpLinks.length;
    }

    return expandedLinks;
}

/**
 * Extracts the url links from the object and moves them into an array
 * @param jObj fast-xml-parser object
 * @returns array of links
 */
async function objToArray2(jObj:any):Promise<string[]>{
    let links : string[] = []

    if(jObj.hasOwnProperty('sitemapindex')){
        for(let i = 0; i< jObj.sitemapindex.sitemap.length; i++){

            links.concat(await extractLinks([jObj.sitemapindex.sitemap[i].loc]));
            // links.push();
        }
        return links;
    }
    else if(jObj.hasOwnProperty('urlset')) {
        for(let i = 0; i< jObj.urlset.url.length; i++){
            links.push(jObj.urlset.url[i].loc);
        }
        return links;
    }
    else{
        logger.log('error', chalk.red('xml doesnt have property sitemapindex or urlset'));
        return [];
    }


}

/**
 * Extracts the url links from the parsedSitemapObject and moves them into an array
 * @param parsedSitemapObject fast-xml-parser object
 * @returns array of links
 */
const objToArray = async (parsedSitemapObject:any):Promise<string[]> =>{
    let links : string[] = [];
    let tmpLinks : string[] = [];

    if(parsedSitemapObject.hasOwnProperty('sitemapindex')){
        for(let i = 0; i< parsedSitemapObject.sitemapindex.sitemap.length; i++){
            tmpLinks = await extractLinks([parsedSitemapObject.sitemapindex.sitemap[i].loc])
            links = links.concat(tmpLinks);
        }
        return links;
    }
    else if(parsedSitemapObject.hasOwnProperty('urlset')) {
        for(let i = 0; i< parsedSitemapObject.urlset.url.length; i++){
            links.push(parsedSitemapObject.urlset.url[i].loc);
        }
        return links;
    }
    else{
        logger.log('error', ('xml doesnt have property sitemapindex or urlset (unsupported format)'));
        return [];
    }


}

/**
 * Reads all the url links from a .txt sitemap and seperates them into array of urls.
 * Same functionality as objToArray but for .txt sitemaps
 * @param url link to the .txt sitemap
 * @returns array of links
 */
const txtLinkToArray = async (url:string) => {

  try{
    const data = await readSitemap(url);
    let tmpArray = data.split('\n');
    let finalArray:string[] = [];

    tmpArray.forEach(element => {
      if(element.startsWith('http')){
        finalArray.push(element);
        totalNumberOfLinks++;
      }
    });

    return finalArray;
  }
  catch(error){
    logger.log('error', `Error reading links from .txt sitemap ${error}`);
    return [];
  }
}

/**
 * Loads the links from our root xml sitemap,
 * we can either choose which sites from the root site it will load or load all the links by leaving second param empty.
 * Call this function only once
 * @param url - url of our root xml sitemap
 * @param sites - array of xml site links we want to visit, optional
 * @returns array of all xml sitemap links we will visit
 */
const linksToArray = async (url:string, sites:string[] = []): Promise<string[]> =>{
    let links = [];

    if(url.endsWith('.txt')){
      links = await txtLinkToArray(url);
      return links;
    }

    if(sites.length){
            return extractLinks(sites);
    }
    let parsedSitemapObject = await parseSitemap(url);

    links = await objToArray(parsedSitemapObject);
    return links;
}

/**
 * Old function, no longer used, similiar to linksToArray
 * @param url
 * @returns
 */
async function linksToArrayOld(url:string){
    let jObj = await parseSitemap(url);
    let links = [];

    for(let i = 0; i< jObj.sitemapindex.sitemap.length; i++){
        links[i] = jObj.sitemapindex.sitemap[i].loc;
    }
    return links;
}

 export {
     linksToArray,
     totalNumberOfLinks,
     readSitemap


 }
