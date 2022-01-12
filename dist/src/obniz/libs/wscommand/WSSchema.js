"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ajvMultiple = exports.ajv = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const tv4 = require("tv4");
const ajv_draft_04_1 = __importDefault(require("ajv-draft-04"));
const ajv = new ajv_draft_04_1.default({ strict: false });
exports.ajv = ajv;
const ajvMultiple = new ajv_draft_04_1.default({ allErrors: true, strict: false });
exports.ajvMultiple = ajvMultiple;
const uniqueKeysKeywordDef = {
    keyword: 'uniqueKeys',
    schemaType: 'array',
    $data: true,
    validate: (sch, data) => {
        if (!Array.isArray(sch)) {
            return true;
        }
        const targets = [];
        for (const key of sch) {
            if (data[key] !== null && data[key] !== undefined) {
                targets.push(data[key]);
            }
        }
        const duplicated = targets.filter((x, i, self) => {
            return self.indexOf(x) !== self.lastIndexOf(x);
        });
        if (duplicated.length > 0) {
            return false;
        }
        return true;
    },
    error: {
        message: (cxt) => {
            return `${cxt.schema} are must be unique value.`;
        },
    },
};
ajv.addKeyword(uniqueKeysKeywordDef);
ajvMultiple.addKeyword(uniqueKeysKeywordDef);
tv4.defineError('UNIQUE_KEYS', 10001, '{uniqueKeys} are must be unique value.');
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
tv4.defineKeyword('uniqueKeys', ((data, value, schema) => {
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
    const duplicated = targets.filter((x, i, self) => {
        return self.indexOf(x) !== self.lastIndexOf(x);
    });
    if (duplicated.length > 0) {
        return {
            code: tv4.errorCodes.UNIQUE_KEYS,
            message: { uniqueKeys: value.join(',') },
        };
    }
    return null;
}));
const wsSchema = [];
const require_context_1 = __importDefault(require("../webpackReplace/require-context"));
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
require.context = require_context_1.default;
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
ajv.addSchema(wsSchema);
ajvMultiple.addSchema(wsSchema);
exports.default = tv4;
