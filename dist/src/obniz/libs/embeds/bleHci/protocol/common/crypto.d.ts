/**
 * @packageDocumentation
 *
 * @ignore
 */
import crypto from 'crypto';
declare const _default: {
    r: () => Buffer;
    c1: (k: any, _r: any, pres: any, preq: any, iat: any, ia: any, rat: any, ra: any) => any;
    s1: (k: any, r1: any, r2: any) => Buffer;
    e: (key: Buffer, data: Buffer) => Buffer;
    f4: (U: any, V: any, X: any, Z: any) => Buffer;
    f5: (W: any, N1: any, N2: any, A1: any, A2: any) => Buffer[];
    f6: (W: any, N1: any, N2: any, R: any, IOcap: any, A1: any, A2: any) => Buffer;
    createECDHKey: () => {
        x: Buffer;
        y: Buffer;
        ecdh: crypto.ECDH;
    };
    randomBytes: typeof crypto.randomBytes;
    generateLtkEaEb: (ecdh: crypto.ECDH, peerPublicKey: {
        x: Buffer;
        y: Buffer;
    }, ia: Buffer, iat: Buffer, ra: Buffer, rat: Buffer, initRandomValue: Buffer, rspRandomValue: Buffer, userPasskey: number, maxKeySize: number, IOCapA: Buffer, IOCapB: Buffer) => {
        ltk: Buffer;
        Ea: Buffer;
        Eb: Buffer;
    };
};
export default _default;
