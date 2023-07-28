import { XMLParser } from "fast-xml-parser";
import { formatConnectionMessage, newLogger, logger } from './logger.js';
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
async function parseSitemap(url:string){
    const parser = new XMLParser();
    const data = await readSitemap(url);
    const parsedSitemapObject = await parser.parse(data);

    return parsedSitemapObject;
}

/**
 * opens each sitemap link and pushes website links into our final array of links
 * @param links array of sitemap links
 * @returns array of extracted links
 */
async function extractLinks(links:string[]){
    let expandedLinks: string[]= [];
    let tmpLinks:string[] = [];

    for(let i = 0; i < links.length; i++){
        let jObj = await parseSitemap(links[i]);
        tmpLinks = await objToArray(jObj);

        for(let j = 0; j< tmpLinks.length; j++){
            expandedLinks.push(tmpLinks[j]);
        }
        logger.log('info',`\nFound sitemap: ${links[i]}\nNumber of links in sitemap: ${tmpLinks.length}\n`)
        totalNumberOfLinks+= tmpLinks.length;
    }

    return expandedLinks;
}

/**
 * extracts the url links from the object and moves them into an array
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
 * extracts the url links from the object and moves them into an array
 * @param jObj fast-xml-parser object
 * @returns array of links
 */
async function objToArray(jObj:any):Promise<string[]>{
    let links : string[] = [];
    let tmpLinks : string[] = [];

    if(jObj.hasOwnProperty('sitemapindex')){
        for(let i = 0; i< jObj.sitemapindex.sitemap.length; i++){
            tmpLinks = await extractLinks([jObj.sitemapindex.sitemap[i].loc])
            // links.concat(tmpLinks) tohle byla ta chyba
            links = links.concat(tmpLinks);
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
        logger.log('error', ('xml doesnt have property sitemapindex or urlset (unsupported format)'));
        return [];
    }


}


/**
 * loads the links from our root xml sitemap,
 * we can either choose which sites from the root site it will load or load all the links by leaving second param empty
 * we call this function only once
 * @param url - url of our root xml sitemap
 * @param sites - array of xml site links we want to visit, optional
 * @returns array of all xml sitemap links we will visit
 */
async function linksToArray(url:string, sites:string[] = []){
    let links = [];

    if(sites.length){
            return extractLinks(sites);
    }
    let jObj = await parseSitemap(url);

    links = await objToArray(jObj);
    return links;
}

/**
 * old function, no longer used, similiar to linksToArray2
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
     totalNumberOfLinks


 }
