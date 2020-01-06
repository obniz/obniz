// dtsmake -e -S "es6" -s *.js -M ble -n ble
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

function camelCase(str) {
  str = str.charAt(0).toLowerCase() + str.slice(1);
  return str.replace(/[-_](.)/g, function(match, group1) {
    return group1.toUpperCase();
  });
}

function snakeCase(str) {
  let camel = camelCase(str);
  return camel.replace(/[A-Z]/g, function(s) {
    return '_' + s.charAt(0).toLowerCase();
  });
}

function pascalCase(str) {
  let camel = camelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

(async function() {
  const relativePath = '/src/obniz/libs/embeds/ble/';
  const root_directory = __dirname + relativePath;

  let file_list = fs.readdirSync(root_directory);

  //build
  _.chain(file_list)
    .filter(function(file) {
      return file.match(/.*\.js$/);
    })
    .each(function(file) {
      let fullpath = relativePath + file;
      let isExistDtsFile = false;
      let dtsFilePath = fullpath.replace('.js', '.d.ts');
      try {
        if (fs.existsSync(dtsFilePath)) {
          isExistDtsFile = true;
          return;
        }
      } catch (err) {
        isExistDtsFile = false;
      }

      let moduleName = path.basename(file, path.extname(file));
      let command = `cd ${root_directory} && dtsmake -e -S "es6" -s ${file} -M ${moduleName} -n ${moduleName}`;
      const result = execSync(command).toString();
      console.log(result);
    });

  //refresh
  file_list = fs.readdirSync(root_directory);
})();
