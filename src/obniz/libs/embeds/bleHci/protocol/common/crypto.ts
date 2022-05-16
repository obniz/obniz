/**
 * @packageDocumentation
 *
 * @ignore
 */
import crypto, { CipherKey } from 'crypto';

/**
 * @ignore
 */
const r = () => {
  return crypto.randomBytes(16);
};

/**
 * @ignore
 */
const c1 = (
  k: any,
  _r: any,
  pres: any,
  preq: any,
  iat: any,
  ia: any,
  rat: any,
  ra: any
) => {
  const p1: any = Buffer.concat([iat, rat, preq, pres]);

  const p2: any = Buffer.concat([ra, ia, Buffer.from('00000000', 'hex')]);

  let res: any = xor(_r, p1);
  res = e(k, res);
  res = xor(res, p2);
  res = e(k, res);

  return res;
};

const s1 = (k: any, r1: any, r2: any) => {
  return e(k, Buffer.concat([r2.slice(0, 8), r1.slice(0, 8)]));
};

const e = (key: Buffer, data: Buffer) => {
  key = swap(key);
  data = swap(data);

  const cipher: any = crypto.createCipheriv('aes-128-ecb', key, '');
  cipher.setAutoPadding(false);

  return swap(Buffer.concat([cipher.update(data), cipher.final()]));
};

const xor = (b1: Buffer, b2: Buffer) => {
  const result = Buffer.alloc(b1.length);

  for (let i = 0; i < b1.length; i++) {
    result[i] = b1[i] ^ b2[i];
  }

  return result;
};

const swap = (input: Buffer) => {
  const output = Buffer.alloc(input.length);

  for (let i = 0; i < output.length; i++) {
    output[i] = input[input.length - i - 1];
  }

  return output;
};

const emptyBuffer = Buffer.alloc(0);
const AESCMAC = (key: CipherKey, message: any) => {
  const zero = Buffer.alloc(16);
  const aes = crypto.createCipheriv('AES-128-ECB', key, emptyBuffer);
  const L = aes.update(zero);
  if (leftShift128(L)) {
    L[15] ^= 0x87;
  }
  let flag = true;
  if (message.length === 0 || message.length % 16 !== 0) {
    if (leftShift128(L)) {
      L[15] ^= 0x87;
    }
    flag = false;
  }

  let X = zero;
  const n = (message.length + 15) >>> 4;
  let processed = 0;
  for (let i = 0; i < n - 1; i++) {
    X = aes.update(xor(X, message.slice(processed, processed + 16)));
    processed += 16;
  }
  const last = Buffer.alloc(16);
  message.copy(last, 0, processed);
  if (!flag) {
    last[message.length % 16] = 0x80;
  }
  return aes.update(xor(xor(X, L), last));
};

const leftShift128 = (v: any) => {
  let carry = 0;
  for (let i = 15; i >= 0; --i) {
    const nextCarry = v[i] >> 7;
    v[i] = (v[i] << 1) | carry;
    carry = nextCarry;
  }
  return carry;
};

const f4 = (U: any, V: any, X: any, Z: any) => {
  return AESCMAC(
    Buffer.from(X).reverse(),
    Buffer.concat([Buffer.from([Z]), V, U]).reverse()
  ).reverse();
};
const f5 = (W: any, N1: any, N2: any, A1: any, A2: any) => {
  const SALT = Buffer.from('6C888391AAF5A53860370BDB5A6083BE', 'hex');
  const T = AESCMAC(SALT, Buffer.from(W).reverse());
  const v = Buffer.concat([
    Buffer.from('btle', 'utf8'),
    Buffer.from(N1).reverse(),
    Buffer.from(N2).reverse(),
    Buffer.from(A1).reverse(),
    Buffer.from(A2).reverse(),
    Buffer.from([1, 0]),
  ]);
  const macKey = AESCMAC(T, Buffer.concat([Buffer.from([0]), v])).reverse();
  const ltk = AESCMAC(T, Buffer.concat([Buffer.from([1]), v])).reverse();
  return [macKey, ltk];
};
const f6 = (W: any, N1: any, N2: any, R: any, IOcap: any, A1: any, A2: any) => {
  return AESCMAC(
    Buffer.from(W).reverse(),
    Buffer.concat([A2, A1, IOcap, R, N2, N1]).reverse()
  ).reverse();
};
const g2 = (U: any, V: any, X: any, Y: any) => {
  return AESCMAC(
    Buffer.from(X).reverse(),
    Buffer.concat([Y, V, U]).reverse()
  ).readUInt32BE(12);
};
const createECDHKey = () => {
  const ecdh = crypto.createECDH('prime256v1');
  ecdh.generateKeys();
  return {
    x: ecdh.getPublicKey().slice(1, 33).reverse(),
    y: ecdh.getPublicKey().slice(33, 65).reverse(),
    ecdh,
  };
};

const generateLtkEaEb = (
  ecdh: crypto.ECDH,
  peerPublicKey: { x: Buffer; y: Buffer },
  ia: Buffer,
  iat: Buffer,
  ra: Buffer,
  rat: Buffer,
  initRandomValue: Buffer,
  rspRandomValue: Buffer,
  userPasskey: number,
  maxKeySize: number,
  IOCapA: Buffer,
  IOCapB: Buffer
) => {
  const userPasskeyBuffer = Buffer.alloc(16);
  userPasskeyBuffer.writeUInt32LE(userPasskey, 0);

  let sharedSecret = null;
  const buf = Buffer.alloc(65);
  buf[0] = 0x04;
  for (let i = 0; i < 32; i++) {
    buf[1 + i] = peerPublicKey.x[31 - i];
    buf[33 + i] = peerPublicKey.y[31 - i];
  }
  sharedSecret = ecdh.computeSecret(buf).reverse();

  const A = Buffer.concat([ia, iat]);
  const B = Buffer.concat([ra, rat]);
  const keys = f5(sharedSecret, initRandomValue, rspRandomValue, A, B);
  const macKey = keys[0];
  const ltk = keys[1].slice(0, maxKeySize);
  const Ea = f6(
    macKey,
    initRandomValue,
    rspRandomValue,
    userPasskeyBuffer,
    IOCapA,
    A,
    B
  );
  const Eb = f6(
    macKey,
    rspRandomValue,
    initRandomValue,
    userPasskeyBuffer,
    IOCapB,
    B,
    A
  );
  return { ltk, Ea, Eb };
};

export default {
  r,
  c1,
  s1,
  e,
  f4,
  f5,
  f6,
  createECDHKey,
  randomBytes: crypto.randomBytes,
  generateLtkEaEb,
};
