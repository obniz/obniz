/**
 * @packageDocumentation
 * @ignore
 */
export default function (source: any): any {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const self: any = this; // eslint-disable-line @typescript-eslint/no-this-alias
  if (self.cacheable) {
    self.cacheable();
  }
  try {
    const src: any = JSON.parse(source);
    const output: any = {};

    for (const key of Object.keys(src)) {
      if (key.startsWith('_')) {
        continue;
      }
      output[key] = src[key];
    }

    return JSON.stringify(output, undefined, '\t');
  } catch (err) {
    self.emitError(err);
    return null;
  }
}
