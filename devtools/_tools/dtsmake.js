// dtsmake -e -S "es6" -s *.js -M ble -n ble
const _ = require('underscore');
const fs = require('fs');
const path = require('path');
const execSync = require('child_process').execSync;

const camelCase = (str) => {
  str = str.charAt(0).toLowerCase() + str.slice(1);
  return str.replace(/[-_](.)/g, (match, group1) => {
    return group1.toUpperCase();
  });
};

// eslint-disable-next-line no-unused-vars
const snakeCase = (str) => {
  const camel = camelCase(str);
  return camel.replace(/[A-Z]/g, (s) => {
    return '_' + s.charAt(0).toLowerCase();
  });
};

// eslint-disable-next-line no-unused-vars
const pascalCase = (str) => {
  const camel = camelCase(str);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

const relativePath = './src/';

const createDtsOnDirWait = async (relativePath) => {
  const root_directory = path.resolve(__dirname, '../../', relativePath);

  let file_list = fs.readdirSync(root_directory);

  // build
  _.chain(file_list)
    .filter((file) => {
      return file.match(/.*\.js$/);
    })
    .each((file) => {
      const fullpath = path.resolve(__dirname, '../../', relativePath, file);
      const dtsFilePath = fullpath.replace('.js', '.d.ts');
      try {
        if (fs.existsSync(dtsFilePath)) {
          return;
        }
      } catch (err) {
        // nothing
      }

      const moduleName = path.basename(file, path.extname(file));
      const command = `cd ${root_directory} && dtsmake -e -S "es6" -s ${file} -M ${moduleName} -n ${moduleName}`;
      const result = execSync(command).toString();
      console.log(result);
    });

  // refresh
  file_list = fs.readdirSync(root_directory);

  // Recurse on directories
  _.chain(file_list)
    .filter((file) => {
      const file_path = path.resolve(root_directory, file);
      return fs.lstatSync(file_path).isDirectory();
    })
    .each((file) => {
      const file_path = path.resolve(root_directory, file);
      createDtsOnDirWait(file_path);
    });
};

createDtsOnDirWait(relativePath);
