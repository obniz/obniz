/**
 * @packageDocumentation
 * @ignore
 */
import tv4 = require('tv4');
import { ValidationError } from 'tv4';

tv4.defineError('UNIQUE_KEYS', 10001, '{uniqueKeys} are must be unique value.');

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
tv4.defineKeyword('uniqueKeys', ((
  data: any,
  value: any,
  schema: tv4.JsonSchema
): string | ValidationError | null => {
  // tslint:disable-line
  if (!Array.isArray(value)) {
    return null;
  }
  const targets = [];
  for (const key of value) {
    if (data[key] !== null && data[key] !== undefined) {
      targets.push(data[key]);
    }
  }
  const duplicated = targets.filter((x: any, i: any, self: any) => {
    return self.indexOf(x) !== self.lastIndexOf(x);
  });
  if (duplicated.length > 0) {
    return {
      code: tv4.errorCodes.UNIQUE_KEYS,
      message: { uniqueKeys: value.join(',') },
    };
  }
  return null;
}) as any);

const wsSchema = [];
import replaceContext from '../webpackReplace/require-context';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
require.context = replaceContext;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (require.context && require.context.setBaseDir) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  require.context.setBaseDir(__dirname);
}
const context = require.context('../../../json_schema', true, /\.yml$/);
for (const path of context.keys()) {
  const oneSchema = context(path);
  wsSchema.push(oneSchema);
}

wsSchema.map(tv4.addSchema);

export default tv4;
