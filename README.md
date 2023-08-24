# Site Spectre CLI

This CLI utility can accept sitemap (xml,txt) of the web, crawl it. And then visit all the links listed with headless browser. Or you can use it to just get the list of all pages in the sitemap.

### Why?

If you are using CDN in front of your website which is heavily caching your web, you need to purge the CACHE when you do an update. This can be done uniquly by purging only specific assets / paths. But very often you just purge whole cache.
This might result in the first users coming to some parts of your web to have slow / slower response times. That's where Site Spectre comese in play! After you purge your website cache. You can use this CLI tool, to simply visit all the pages listed. It's done using headless browser which ensures also other assets (image, JavaScript requests) are triggered and put into your cache.

#### Use cases:

- Make sure all your webpages are "fired up" and ready in your cache
- Test all your webpages are responding with status code 200
- List all webpages in your sitemap

## Instalation

TODO

## Development

TODO

### Dev notes:

- Chalk is stuck on version 4, because v5 is ESM support only
- We don't want to use "modules" type. Commonjs rules!.
