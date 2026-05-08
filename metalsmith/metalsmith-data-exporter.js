var debug = require("debug")("metalsmith-data-exporter");
var fs = require("fs");
var path = require("path");

/**
 * Expose `plugin`.
 */

module.exports = plugin;

/**
 * Metalsmith plugin that exports the data as a JSON.
 *
 * @param {Object} options
 *   @property {String} pattern
 *   @property {String or Function} date
 * @return {Function}
 */

function plugin(options) {
  var filteredKeys = ["stats", "mode", "collection", "previous", "next"];

  return function (files, metalsmith, done) {
    var output = [];
    Object.keys(files).forEach(function (key) {
      var file = files[key];
      if (!file[options.requiredKey]) return;

      var exportable = {};
      Object.keys(file).forEach(function (k) {
        if (filteredKeys.indexOf(k) > -1 || !file[k]) return;
        exportable[k] = file[k].toString();
      });

      output.push(exportable);
    });

    var dir = path.dirname(options.file);
    if (dir && !fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFile(options.file, JSON.stringify(output), "utf8", done);
  };
}
