const tv4 = require('tv4');

tv4.defineError('UNIQUE_KEYS', 10001, '{uniqueKeys} are must be unique value.');

tv4.defineKeyword('uniqueKeys', function(data, value, schema) {
  if (!Array.isArray(value)) {
    return null;
  }
  let targets = [];
  for (let key of value) {
    if (data[key] !== null && data[key] !== undefined) {
      targets.push(data[key]);
    }
  }
  let duplicated = targets.filter(function(x, i, self) {
    return self.indexOf(x) !== self.lastIndexOf(x);
  });
  if (duplicated.length > 0) {
    return {
      code: tv4.errorCodes.UNIQUE_KEYS,
      message: { uniqueKeys: value.join(',') },
    };
  }
  return null;
});

//todo

let wsSchema = [];
require.context = require('../webpackReplace/require-context');
if (require.context && require.context.setBaseDir) {
  require.context.setBaseDir(__dirname);
}
let context = require.context('../../../json_schema', true, /\.yml$/);
for (let path of context.keys()) {
  let oneSchema = context(path);
  wsSchema.push(oneSchema);
}

wsSchema.map(tv4.addSchema);

module.exports = tv4;
