import { _objToArray, _txtLinkToArray, _parseSitemap } from "../src/sitemap-parsers";

import {logger} from "../src/logger"


jest.mock("../src/logger", () => ({
  logger: {
    log: jest.fn(),
    // whenReady: jest.fn(() => Promise.resolve()),
  },
}));

describe("txtLinkToArray", () => {
  describe("Test the positivie scenarios", () => {

    beforeEach(() => {

    });

    afterEach(() => {
      //@ts-ignore
      global.fetch.mockClear();
    });

    it("tests correct txt sitemap input", async () => {
        //@ts-ignore
        global.fetch = jest.fn(() =>
        Promise.resolve({
          text: () =>
            Promise.resolve(
              "https://coh3stats.com/\nhttps://coh3stats.com/about\nhttps://coh3stats.com/leaderboards?race=american&type=1v1\n",
            )
        })
      );

      //console.log(await _txtLinkToArray("whateverurl"));
      const array = await _txtLinkToArray("");
      // TODO: "write a expect that it returns correctly the things"

      expect(array).toStrictEqual(["https://coh3stats.com/","https://coh3stats.com/about","https://coh3stats.com/leaderboards?race=american&type=1v1"]);
      //expect(global.fetch).toHaveBeenCalledWith("whateverurl");
    });

  });

  describe("Test the negative scenarios", () => {


    beforeEach(() => {

    });



    it("tests rejected url response", async () => {
      //@ts-ignore
      global.fetch = jest.fn(() =>
        Promise.resolve({
          text: () => Promise.reject("test"),
        }),
      );

      const result = await _txtLinkToArray("whateverurl");
      //expect(result.length).toBe(0);

      //expect(logger.log).toBeCalledTimes(1)
      expect(logger.log).toBeCalledWith("error", "Error reading links from .txt sitemap, error: test")

    });

    it("tests invalid url", async () => {
      //@ts-ignore
      global.fetch = jest.fn(() =>
        Promise.resolve({
          text: () => Promise.reject("fetch failed"),
        }),
      );

      const result = await _txtLinkToArray("");


      expect(logger.log).toBeCalledWith("error", "Error reading links from .txt sitemap, error: fetch failed")

    });

    afterEach(() => {
      //@ts-ignore
      global.fetch.mockClear();
    });
  });
});


/* WIP
describe("objToArray", () => {
  describe("Test the positivie scenarios", () => {

    beforeEach(() => {

    });

    afterEach(() => {
      //@ts-ignore
      global.fetch.mockClear();
    });
    /*
    it("tests correct xml sitemap with nested xml sitemaps input", async () => {
        //@ts-ignore
        global.fetch = jest.fn(() =>
        Promise.resolve({
          text: () =>
            Promise.resolve(
              "<?xml version=\"1.0\" encoding=\"UTF-8\"?><?xml-stylesheet type=\"text/xsl\" href=\"https://www.profiq.com/wp-sitemap-index.xsl\" ?><sitemapindex xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\"><sitemap><loc>https://www.profiq.com/wp-sitemap-posts-post-1.xml</loc></sitemap><sitemap><loc>https://www.profiq.com/wp-sitemap-posts-page-1.xml</loc></sitemap><sitemap><loc>https://www.profiq.com/wp-sitemap-posts-job-1.xml</loc></sitemap><sitemap><loc>https://www.profiq.com/wp-sitemap-taxonomies-category-1.xml</loc></sitemap><sitemap><loc>https://www.profiq.com/wp-sitemap-taxonomies-post_tag-1.xml</loc></sitemap><sitemap><loc>https://www.profiq.com/wp-sitemap-users-1.xml</loc></sitemap></sitemapindex>",
            )
        })
      );

      //console.log(await _txtLinkToArray("whateverurl"));
      const parsedSitemapObject = await _parseSitemap("");
      const array = await _objToArray(parsedSitemapObject);
      // TODO: "write a expect that it returns correctly the things"

      expect(array).toStrictEqual(["https://coh3stats.com/","https://coh3stats.com/about","https://coh3stats.com/leaderboards?race=american&type=1v1"]);
      //expect(global.fetch).toHaveBeenCalledWith("whateverurl");
    });

  });



});
*/
