var Metalsmith = require("metalsmith");
var markdown = require("metalsmith-markdown");
var collections = require("metalsmith-collections");
var layouts = require("metalsmith-layouts");
var permalinks = require("metalsmith-permalinks");
var paths = require("metalsmith-paths");
var dateFormatter = require("metalsmith-date-formatter");
var sitemap = require("metalsmith-sitemap");
var alias = require("metalsmith-alias");
const { sortBy } = require("lodash");

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
      books: {
        pattern: "books/*.md",
        sortBy: "order",
        reverse: false,
      },
      games: {
        pattern: "games/*.md",
        sortBy: "order",
        revers: false,
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
  .use(
    permalinks({
      pattern: ":dir/:basename",
    }),
  )
  .use(alias({ netlify: false }))
  .use(
    sitemap({
      hostname: "https://ttpotm.com/",
      omitIndex: true,
    }),
  )
  .use(
    layouts({
      engine: "handlebars",
      helpers: {
        eq: function (a, b) {
          return a === b;
        },
      },
    }),
  )
  .build(function (err, files) {
    if (err) {
      throw err;
    }
  });
