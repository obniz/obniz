/**
 * @packageDocumentation
 *
 * @ignore
 */
import crypto from "crypto";
/**
 * @ignore
 */
function r() {
  return crypto.randomBytes(16);
}
/**
 * @ignore
 */
function c1(k: any, _r: any, pres: any, preq: any, iat: any, ia: any, rat: any, ra: any) {
  const p1: any = Buffer.concat([iat, rat, preq, pres]);

  const p2: any = Buffer.concat([ra, ia, Buffer.from("00000000", "hex")]);

  let res: any = xor(_r, p1);
  res = e(k, res);
  res = xor(res, p2);
  res = e(k, res);

  return res;
}

function s1(k: any, r1: any, r2: any) {
  return e(k, Buffer.concat([r2.slice(0, 8), r1.slice(0, 8)]));
}

function e(key: any, data: any) {
  key = swap(key);
  data = swap(data);

  const cipher: any = crypto.createCipheriv("aes-128-ecb", key, "");
  cipher.setAutoPadding(false);

  return swap(Buffer.concat([cipher.update(data), cipher.final()]));
}

function xor(b1: any, b2: any) {
  const result: any = Buffer.alloc(b1.length);

  for (let i = 0; i < b1.length; i++) {
    result[i] = b1[i] ^ b2[i];
  }

  return result;
}

function swap(input: any) {
  const output: any = Buffer.alloc(input.length);

  for (let i = 0; i < output.length; i++) {
    output[i] = input[input.length - i - 1];
  }

  return output;
}

export default {
  r,
  c1,
  s1,
  e,
};
