/**
 * @packageDocumentation
 * @ignore
 */
const yaml: any = require("js-yaml");

export default (source: any) => {
  // @ts-ignore
  const self: any = this;
  if (self.cacheable) {
    self.cacheable();
  }
  try {
    const src: any = yaml.safeLoad(source);
    const excludeKeys: any = ["example", "description"];

    const res: any = filter(src, excludeKeys);
    // console.log("src",src);
    // console.log("res",res);
    return JSON.stringify(res, undefined, "\t");
  } catch (err) {
    self.emitError(err);
    return null;
  }
};

function filter(target: any, excludeKeys: any) {
  if (typeof target !== "object") {
    return target;
  }
  if (target === null) {
    return target;
  }
  if (Array.isArray(target)) {
    const newArr: any = [];
    for (const key in target) {
      if (!excludeKeys.includes(key)) {
        newArr[key] = filter(target[key], excludeKeys);
      }
    }
    return target;
  }
  const newObj: any = {};
  for (const key in target) {
    if (!excludeKeys.includes(key)) {
      newObj[key] = filter(target[key], excludeKeys);
    }
  }
  return newObj;
}
