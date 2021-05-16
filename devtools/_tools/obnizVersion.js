const through = require('through2');
const PluginError = require('plugin-error');
const PLUGIN_NAME = 'obnizVersion';

module.exports = () => {
  /**
   * @this {Transform}
   */
  const transform = function (file, encoding, callback) {
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
      const contents = String(file.contents);

      const packageJson = JSON.parse(contents);
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
