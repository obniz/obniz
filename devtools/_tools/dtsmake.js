// dtsmake -e -S "es6" -s *.js -M ble -n ble
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

function camelCase(str) {
  str = str.charAt(0).toLowerCase() + str.slice(1);
  return str.replace(/[-_](.)/g, function (match, group1) {
    return group1.toUpperCase();
  });
}

// eslint-disable-next-line no-unused-vars
function snakeCase(str) {
  let camel = camelCase(str);
  return camel.replace(/[A-Z]/g, function (s) {
    return '_' + s.charAt(0).toLowerCase();
  });
}

// eslint-disable-next-line no-unused-vars
function pascalCase(str) {
  let camel = camelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
}

const relativePath = './src/';

async function createDtsOnDirWait(relativePath) {
  const root_directory = path.resolve(__dirname, '../../', relativePath);

  let file_list = fs.readdirSync(root_directory);

  //build
  _.chain(file_list)
    .filter(function (file) {
      return file.match(/.*\.js$/);
    })
    .each(function (file) {
      let fullpath = path.resolve(__dirname, '../../', relativePath, file);
      let dtsFilePath = fullpath.replace('.js', '.d.ts');
      try {
        if (fs.existsSync(dtsFilePath)) {
          return;
        }
      } catch (err) {
        //nothing
      }

      let moduleName = path.basename(file, path.extname(file));
      let command = `cd ${root_directory} && dtsmake -e -S "es6" -s ${file} -M ${moduleName} -n ${moduleName}`;
      const result = execSync(command).toString();
      console.log(result);
    });

  //refresh
  file_list = fs.readdirSync(root_directory);

  // Recurse on directories
  _.chain(file_list)
    .filter(function (file) {
      let file_path = path.resolve(root_directory, file);
      return fs.lstatSync(file_path).isDirectory();
    })
    .each(function (file) {
      let file_path = path.resolve(root_directory, file);
      createDtsOnDirWait(file_path);
    });
}

createDtsOnDirWait(relativePath);
