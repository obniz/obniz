var through = require('through2');
var PluginError = require('gulp-util').PluginError;
var PLUGIN_NAME = 'obnizVersion';

module.exports = function() {
  /**
   * @this {Transform}
   */
  var transform = function(file, encoding, callback) {
    if (file.isNull()) {
      this.push(file);
      return callback(null, file);
    }

    if (file.isStream()) {
      this.emit('error', new PluginError(PLUGIN_NAME, 'Streams not supported!'));
      return callback();
    }

    // プラグインの処理本体
    if (file.isBuffer()) {
      // ファイルの内容をcontentsに読み込み
      var contents = String(file.contents);

      let packageJson = JSON.parse(contents);
      let output = "";
      if(packageJson.version) {
        output = `var _obniz_js_version = "${packageJson.version}";\n`
      }

      // 編集した内容を出力
      file.contents = new Buffer(output);

      // 処理の完了を通知
      return callback(null, file);
    }

    this.push(file);
    callback();
  };

  return through.obj(transform);
};
