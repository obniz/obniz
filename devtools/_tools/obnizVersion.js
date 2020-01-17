let through = require('through2');
let PluginError = require('gulp-util').PluginError;
let PLUGIN_NAME = 'obnizVersion';

module.exports = function() {
  /**
   * @this {Transform}
   */
  let transform = function(file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit(
        'error',
        new PluginError(PLUGIN_NAME, 'Streams not supported!')
      );
      return callback();
    }

    if (file.isBuffer()) {
      let contents = String(file.contents);

      let packageJson = JSON.parse(contents);
      let output = '';
      if (packageJson.version) {
        output = `var _obniz_js_version = "${packageJson.version}";\n`;
      }

      file.contents = Buffer.from(output);

      return callback(null, file);
    }

    this.push(file);
    callback();
  };

  return through.obj(transform);
};
