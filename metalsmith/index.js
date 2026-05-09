var Metalsmith = require("metalsmith");
var markdown = require("metalsmith-markdown");
var collections = require("metalsmith-collections");
var layouts = require("metalsmith-layouts");
var permalinks = require("metalsmith-permalinks");
var paths = require("metalsmith-paths");
var dateFormatter = require("metalsmith-date-formatter");
var sitemap = require("metalsmith-sitemap");
var dataexporter = require("./metalsmith-data-exporter");
var alias = require("metalsmith-alias");

Metalsmith(__dirname)
  .metadata({
    generator: "Metalsmith",
    url: "https://ttpotm.com/",
  })
  .source("./src")
  .destination("../dist")
  .clean(false)
  .use(
    collections({
      creations: {
        pattern: "creations/*.md",
        sortBy: "date",
        reverse: true,
      },
      tokiNasinNasa: {
        pattern: "creations/tokinasinnasa/*.md",
        sortBy: "title",
        reverse: false,
      },
    }),
  )
  .use(
    dateFormatter({
      dates: [
        {
          key: "date",
          format: "MMMM YYYY",
        },
        {
          key: "start-date",
          format: "MMMM YYYY",
        },
      ],
    }),
  )
  .use(paths())
  .use(
    markdown({
      smartypants: true,
      mangle: true,
    }),
  )
  .use(permalinks())
  .use(alias({ netlify: false }))
  .use(
    sitemap({
      hostname: "https://ttpotm.com/",
      omitIndex: true,
    }),
  )
  .use(
    dataexporter({
      file: "./dist/api/allfiles.json",
      requiredKey: "tag",
    }),
  )
  .use(
    layouts({
      engine: "handlebars",
    }),
  )
  .build(function (err, files) {
    if (err) {
      throw err;
    }
  });
