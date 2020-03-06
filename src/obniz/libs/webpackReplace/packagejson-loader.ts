/**
 * @packageDocumentation
 * @ignore
 */
export default function(source: any): any {
  // @ts-ignore
  const self: any = this;
  if (self.cacheable) {
    self.cacheable();
  }
  try {
    const src: any = JSON.parse(source);
    const output: any = {};

    for (const key of Object.keys(src)) {
      if (key.startsWith("_")) {
        continue;
      }
      output[key] = src[key];
    }

    return JSON.stringify(output, undefined, "\t");
  } catch (err) {
    (self as any).emitError(err);
    return null;
  }
}
