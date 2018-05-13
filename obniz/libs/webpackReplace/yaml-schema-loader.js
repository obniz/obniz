let yaml = require('js-yaml');

module.exports = function(source) {
  this.cacheable && this.cacheable();
  try {
    let src = yaml.safeLoad(source);
    let excludeKeys = ['example', 'description'];

    let res = filter(src, excludeKeys);
    // console.log("src",src);
    // console.log("res",res);
    return JSON.stringify(res, undefined, '\t');
  } catch (err) {
    this.emitError(err);
    return null;
  }
};

function filter(target, excludeKeys) {
  if (typeof target !== 'object') {
    return target;
  }
  if (target === null) {
    return target;
  }
  if (Array.isArray(target)) {
    let newArr = [];
    for (let key in target) {
      if (!excludeKeys.includes(key)) {
        newArr[key] = filter(target[key], excludeKeys);
      }
    }
    return target;
  }
  let newObj = {};
  for (let key in target) {
    if (!excludeKeys.includes(key)) {
      newObj[key] = filter(target[key], excludeKeys);
    }
  }
  return newObj;
}
