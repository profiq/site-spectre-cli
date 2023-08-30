# Site Spectre CLI

CLI utility which accepts link to sitemap (xml,txt) of the web, crawls it. And then visits all the links listed with headless browser. Or you can use it to just get the list of all pages in the sitemap.

### Why?

If you are using CDN in front of your website which is heavily caching your web, you need to purge the CACHE when you do an update. This can be done uniquly by purging only specific assets / paths. But very often you just purge whole cache.
This might result in the first users coming to some parts of your web to have slow / slower response times. That's where Site Spectre comese in play! After you purge your website cache. You can use this CLI tool, to simply visit all the pages listed. It's done using headless browser which ensures also other assets (image, JavaScript requests) are triggered and put into your cache.

#### Use cases:

- Make sure all your webpages are "fired up" and ready in your cache
- Test all your webpages are responding with status code 200
- List all webpages in your sitemap

## Instalation

TODO

## Usage

You can modify the CLI config in 2 ways:

### Command line commands

See available options via --help (-h doesn't work idk why)

If using npm command, need to seperate additional commands using "--" (npm run start -- yourUrl -t 2000 -p 8). _Asi neni potreba psat, ze?_

### Config file

Edit the visitConfig.json file with your desired options and use it in the command line (-c visitConfig.json). You don't need to specify all the options if you want to use default options.

Command line commands will take priority over your config file. However they will **_NOT take priority_** if trying to use default values in command line (e.g. -p 2), in this case the config file would take priority. _(no way to check if option has been called or not, if there is a default value for the option)_

Additional info regarding options:

#### Page load type

If using the network option you may run into long visits, more info [here](https://playwright.dev/docs/api/class-page#page-wait-for-load-state).

#### Custom headers

TODO

#### Input file

You can list multiple different sitemaps, each on a new line in a txt file.

## Development

TODO

### Dev notes:

- Chalk is stuck on version 4, because v5 is ESM support only
- We don't want to use "modules" type. Commonjs rules!.
