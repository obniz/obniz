// Type definitions for bleHciProtocolCentralCrypto
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
// c1.!0

// xor.!ret

/**
 *
 */
declare interface Ret {
}

/**
 *
 */
declare function r(): void;

/**
 *
 * @param k
 * @param r
 * @param pres
 * @param preq
 * @param iat
 * @param ia
 * @param rat
 * @param ra
 * @return
 */
declare function c1(k: any, r: any, pres: any, preq: any, iat: any, ia: any, rat: any, ra: any): /* xor.!ret */ any;

/**
 *
 * @param k
 * @param r1
 * @param r2
 * @return
 */
declare function s1(k: any, r1: any, r2: any): /* c1.!0 */ any;

/**
 *
 * @param key
 * @param data
 * @return
 */
declare function e(key: /* c1.!0 */ any, data: /* xor.!ret */ any): /* c1.!0 */ any;

/**
 *
 * @param b1
 * @param b2
 * @return
 */
declare function xor(b1: /* xor.!ret */ any, b2: any): Ret;

/**
 *
 * @param input
 * @return
 */
declare function swap(input: /* xor.!ret */ any): /* c1.!0 */ any;

declare module "bleHciProtocolCentralCrypto" {

  export default bleHciProtocolCentralCrypto;    // es6 style module export
}
