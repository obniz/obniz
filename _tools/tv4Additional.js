module.exports.defineError("UNIQUE_KEYS", 10001, "{uniqueKeys} are must be unique value.");

module.exports.defineKeyword("uniqueKeys", function (data, value, schema) {
  if (!Array.isArray(value)) {
    return null;
  }
  let targets = [];
  for (let key of value) {
    if (data[key] !== null && data[key] !== undefined) {
      targets.push(data[key]);
    }
  }
  let duplicated = targets.filter(function (x, i, self) {
    return self.indexOf(x) !== self.lastIndexOf(x);
  });
  if (duplicated.length > 0) {
    return {code: Obniz.tv4.errorCodes.UNIQUE_KEYS, message: {uniqueKeys:value.join(",")}};
  }
  return null;

});