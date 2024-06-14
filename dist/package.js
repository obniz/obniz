module.exports = {
  "name": "obniz",
  "version": "3.30.1",
  "description": "obniz sdk for javascript",
  "main": "./dist/src/obniz/index.js",
  "types": "./dist/src/obniz/index.d.ts",
  "files": [
    "dist",
    "index.js",
    "obniz.js"
  ],
  "engines": {
    "node": ">=10.23.0"
  },
  "engineStrict": true,
  "scripts": {
    "test": "npm run tstest && npm run lint-test &&  nyc --reporter=text --reporter=html mocha --exit $NODE_DEBUG_OPTION  ./test/functiontest/index.js -b 1",
    "testOnlyNodejs": "NO_BROWSER_TEST=1 npm test",
    "buildAndtest": "npm run build && npm test",
    "tstest": "mocha --require espower-typescript/guess test/functiontest/**/*.ts",
    "tsExampleTest": "tsc --project ./test/functiontest",
    "realtest": "mocha --exit $NODE_DEBUG_OPTION ./test/realtest/index.js",
    "realtest-debug": "DEBUG=1 mocha $NODE_DEBUG_OPTION -b ./test/realtest/index.js",
    "local": "gulp --gulpfile devtools/_tools/server.js --cwd .",
    "watch": "tsc -w & webpack --watch --config ./devtools/webpack.config.js  ",
    "watch:debug": "tsc -w -p tsconfig.debug.json & webpack --watch --config ./devtools/webpack.config.js  ",
    "build": "npm run clean && npm run lint && gulp --gulpfile devtools/_tools/server.js --cwd . build ",
    "doc": "typedoc --includes ./src/ --exclude '**/*.json' --theme ./devtools/typedocTheme --stripInternal --readme none --out docs/obnizjs --excludePrivate --excludeProtected  --media ./docs/images",
    "build-ts": "npm run clean && npm run lint-ts && gulp --gulpfile devtools/_tools/server.js --cwd . build",
    "version": "npm run build && npm run doc && git add docs && git add obniz.js",
    "lint": "eslint --fix . --rulesdir devtools/eslint/rule --quiet",
    "lint-js": "eslint --fix './**/*.js' --rulesdir devtools/eslint/rule --quiet",
    "lint-ts": "eslint --fix 'src/**/*.ts' 'test/**/*.ts' --rulesdir devtools/eslint/rule  --quiet",
    "lint-test": "mocha $NODE_DEBUG_OPTION ./devtools/eslint/test/**/*.js",
    "precommit": "lint-staged && npm run build && git add obniz.js",
    "prepublishOnly": "npm run build",
    "code-quality": "docker run --rm -it -v $PWD:/data/project/ -p 8080:8080 jetbrains/qodana-js:2022.2-eap --show-report",
    "clean": "rimraf ./dist ./obniz.js ./obniz.d.ts",
    "prepare": "husky install"
  },
  "lint-staged": {
    "src/**/*.ts": [
      "eslint --fix  --rulesdir devtools/eslint/rule --quiet",
      "git add"
    ],
    "test/**/*.ts": [
      "eslint --fix  --rulesdir devtools/eslint/rule --quiet",
      "git add"
    ]
  },
  "keywords": [
    "obniz"
  ],
  "repository": "obniz/obniz",
  "author": "obniz Inc. <supportteam@obniz.com>",
  "homepage": "https://obniz.com/",
  "license": "SEE LICENSE IN LICENSE.txt",
  "devDependencies": {
    "@types/chai": "^4.2.7",
    "@types/chai-like": "^1.1.0",
    "@types/dialog-polyfill": "^0.5.0",
    "@types/eventemitter3": "^1.2.0",
    "@types/events": "^3.0.0",
    "@types/glob": "^7.1.1",
    "@types/js-yaml": "^3.12.1",
    "@types/minimatch": "^3.0.3",
    "@types/mocha": "^5.2.7",
    "@types/node": "^13.1.5",
    "@types/node-dir": "0.0.33",
    "@types/node-fetch": "^2.5.4",
    "@types/semver": "^6.2.0",
    "@types/sinon": "^7.5.1",
    "@types/webpack-env": "^1.15.0",
    "@types/window-or-global": "^1.0.0",
    "@typescript-eslint/eslint-plugin": "^5.36.1",
    "@typescript-eslint/eslint-plugin-tslint": "^5.36.1",
    "@typescript-eslint/parser": "^5.36.1",
    "chai": "^4.2.0",
    "chai-like": "^1.1.1",
    "child_process": "^1.0.2",
    "concat-with-sourcemaps": "^1.1.0",
    "dialog-polyfill": "^0.5.0",
    "ejs": "^2.6.2",
    "eslint": "^7.32.0",
    "eslint-config-prettier": "^3.6.0",
    "eslint-plugin-jasmine": "^2.10.1",
    "eslint-plugin-jsdoc": "^32.2.0",
    "eslint-plugin-prefer-arrow": "^1.2.3",
    "eslint-plugin-prettier": "^3.3.1",
    "eslint-plugin-rulesdir": "^0.2.0",
    "espower-typescript": "^9.0.2",
    "express": "^4.17.1",
    "get-port": "^4.0.0",
    "glob": "^7.1.3",
    "gulp": "^4.0.2",
    "gulp-concat": "^2.6.1",
    "gulp-ejs": "^3.2.0",
    "gulp-filter": "^5.1.0",
    "gulp-plumber": "^1.2.0",
    "gulp-rename": "^1.4.0",
    "gulp-sort": "^2.0.0",
    "gulp-sourcemaps": "^2.6.5",
    "gulp-typescript": "^6.0.0-alpha.1",
    "gulp-yaml": "^2.0.2",
    "husky": "^8.0.0",
    "json-loader": "^0.5.7",
    "lint-staged": "^9.4.1",
    "lodash": "^4.17.21",
    "mocha": "^5.2.0",
    "mocha-chrome": "^2.2.0",
    "mocha-directory": "^2.3.0",
    "mocha-sinon": "^2.1.0",
    "natives": "^1.1.6",
    "ncp": "^2.0.0",
    "node-notifier": "^5.3.0",
    "nyc": "^14.1.1",
    "path": "^0.12.7",
    "plugin-error": "^1.0.1",
    "power-assert": "^1.6.1",
    "prettier": "^2.2.1",
    "raw-loader": "^4.0.0",
    "rimraf": "^3.0.2",
    "sinon": "^7.5.0",
    "text-encoding": "^0.7.0",
    "through2": "^2.0.3",
    "typedoc": "^0.16.9",
    "typedoc-plugin-external-module-name": "^4.0.6",
    "typedoc-plugin-internal-external": "^2.1.1",
    "typescript": "^4.7.4",
    "vinyl": "^2.2.0",
    "webpack": "^4.34.0",
    "webpack-cli": "^3.3.4",
    "webpack-node-externals": "^1.7.2",
    "webpack-stream": "^5.2.1",
    "yaml-loader": "^0.5.0"
  },
  "dependencies": {
    "@9wick/serial-executor": "^1.0.0",
    "@types/tv4": "^1.2.29",
    "@types/ws": "^6.0.4",
    "binary-analyzer": "^1.0.0",
    "eventemitter3": "^3.1.2",
    "js-yaml": "^3.13.1",
    "moment": "^2.29.3",
    "node-fetch": "^2.3.0",
    "p-limit": "^3.1.0",
    "round-to": "^5.0.0",
    "semver": "^5.7.0",
    "strict-event-emitter": "^0.2.6",
    "tv4": "^1.3.0",
    "ws": "^6.1.4"
  },
  "bugs": {
    "url": "https://forum.obniz.com"
  },
  "private": false,
  "browser": {
    "fs": false,
    "ws": "./dist/src/obniz/libs/webpackReplace/ws",
    "canvas": "./dist/src/obniz/libs/webpackReplace/canvas",
    "./dist/src/obniz/libs/webpackReplace/require-context": "./dist/src/obniz/libs/webpackReplace/require-context-browser",
    "./dist/src/obniz/libs/webpackReplace/dialogPollyfill": "./dist/src/obniz/libs/webpackReplace/dialogPollyfill-browser"
  }
}
;