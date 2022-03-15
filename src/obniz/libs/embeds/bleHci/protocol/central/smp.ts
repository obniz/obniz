/**
 * @packageDocumentation
 *
 * @ignore
 */

import EventEmitter from 'eventemitter3';

import { ObnizBlePairingRejectByRemoteError } from '../../../../../ObnizError';
import BleHelper from '../../bleHelper';
import { BleDeviceAddress, BleDeviceAddressType } from '../../bleTypes';
import AclStream from './acl-stream';
import crypto from './crypto';

/**
 * @ignore
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace SMP {
  export const CID = 0x0006;
  export const PAIRING_REQUEST = 0x01;
  export const PAIRING_RESPONSE = 0x02;
  export const PAIRING_CONFIRM = 0x03;
  export const PAIRING_RANDOM = 0x04;
  export const PAIRING_FAILED = 0x05;
  export const ENCRYPT_INFO = 0x06;
  export const MASTER_IDENT = 0x07;
  export const IDENTITY_INFORMATION = 0x08;
  export const IDENTITY_ADDRESS_INFORMATION = 0x09;
  export const SIGNING_INFORMATION = 0x0a;
  export const PAIRING_PUBLIC_KEY = 0x0c;
  export const PAIRING_DHKEY_CHECK = 0x0d;
  export const SMP_SECURITY_REQUEST = 0x0b;
}

type BondingType = 'NoBonding' | 'Bonding';

/**
 * @ignore
 */
type SmpEventTypes = 'masterIdent' | 'ltk' | 'fail' | 'end';

/**
 * @ignore
 */
type SmpIoCapability =
  | 'displayOnly'
  | 'displayYesNo'
  | 'keyboardOnly'
  | 'keyboardDisplay'
  | 'noInputNoOutput';

/**
 * @ignore
 */
export interface SmpEncryptOptions {
  /**
   * Stored pairing keys
   */
  keys?: string;

  secureConnection?: boolean;

  /**
   * Callback function that call on pairing passkey required.
   */
  passkeyCallback?: () => Promise<number>;

  /**
   * Callback function that call on pairing passkey required.
   */
  onPairedCallback?: (keys: string) => void;

  /**
   * Callback function that call on pairing failed internal.
   * Some pairing error may caused internally when peripheral request regardless central side request.
   */
  onPairingFailed?: (e: Error) => void;
}

/**
 * @ignore
 */
class Smp extends EventEmitter<SmpEventTypes> {
  private _aclStream: AclStream;
  private _iat: Buffer;
  private _ia: Buffer;
  private _rat: Buffer;
  private _ra: Buffer;
  private onAclStreamDataBinded: any;
  private onAclStreamEndBinded: any;
  private _preq: Buffer | null = null;
  private _pres: Buffer | null = null;
  private _tk: Buffer | null = null;
  private _r: Buffer | null = null;
  private _rand: Buffer | null = null;
  private _ediv: Buffer | null = null;
  private _pcnf: Buffer | null = null;
  private _stk: Buffer | null = null;
  private _ltk: Buffer | null = null;
  private _options?: SmpEncryptOptions = undefined;

  constructor(
    aclStream: AclStream,
    localAddressType: BleDeviceAddressType,
    localAddress: BleDeviceAddress,
    remoteAddressType: BleDeviceAddressType,
    remoteAddress: BleDeviceAddress
  ) {
    super();
    this._aclStream = aclStream;

    this._iat = Buffer.from([localAddressType === 'random' ? 0x01 : 0x00]);
    this._ia = BleHelper.hex2reversedBuffer(localAddress, ':');
    this._rat = Buffer.from([remoteAddressType === 'random' ? 0x01 : 0x00]);
    this._ra = BleHelper.hex2reversedBuffer(remoteAddress, ':');

    this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
    this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);

    this._aclStream.on('data', this.onAclStreamDataBinded);
    this._aclStream.on('end', this.onAclStreamEndBinded);
  }

  public debugHandler: any = (...param: any[]) => {
    // do nothing.
    console.log(...param);
  };

  public async pairingWithKeyWait(key: string) {
    this.debug(`Pairing using keys ${key}`);
    this.setKeys(key);
    if (!this._ltk || !this._rand || !this._ediv) {
      throw new Error('invalid keys');
    }
    console.log(this.parsePairingReqRsp(this._pres!));

    const encResult = await this._aclStream.onSmpLtkWait(
      this._ltk,
      this._rand,
      this._ediv
    );
    return encResult;
  }

  public setPairingOption(options: SmpEncryptOptions) {
    this._options = options;
  }

  public async pairingWait(options?: SmpEncryptOptions) {
    this._options = { ...this._options, ...options };
    if (this._options && this._options.keys) {
      const result = await this.pairingWithKeyWait(this._options.keys);

      if (this._options && this._options.onPairedCallback) {
        this._options.onPairedCallback(this.getKeys());
      }
      return result;
    }
    // phase 1 : Pairing Feature Exchange
    this.debug(`Going to Pairing`);
    await this.sendPairingRequestWait();
    this.debug(`Waiting Pairing Response`);
    const pairingResponse = await this._readWait(SMP.PAIRING_RESPONSE);
    this.debug(`Receive  Pairing Response ${pairingResponse.toString('hex')}`);
    this._pres = pairingResponse;

    if (this.isSecureConnectionMode()) {
      // phase2 : (after receive PAIRING_RESPONSE)
      await this.handlePairingResponseSecureConnectionWait();

      console.log('paired');
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('awaited paired');
    } else {
      // phase2 : (after receive PAIRING_RESPONSE)
      await this.handlePairingResponseLegacyPairingWait();
      this.debug(`Waiting Pairing Confirm`);
      const confirm = await this._readWait(SMP.PAIRING_CONFIRM, 60 * 1000); // 60sec timeout
      this.handlePairingConfirm(confirm);

      // phase3 : Transport Specific Key Distribution
      this.debug(`Waiting Pairing Random`);
      const random = await this._readWait(SMP.PAIRING_RANDOM);
      const encResultPromise = this.handlePairingRandomWait(random);
      this.debug(`Got Pairing Encryption Result`);

      const encInfoPromise = this._readWait(SMP.ENCRYPT_INFO);
      const masterIdentPromise = this._readWait(SMP.MASTER_IDENT);
      await Promise.all([encResultPromise, encInfoPromise, masterIdentPromise]);
      const encResult = await encResultPromise;
      const encInfo = await encInfoPromise;
      const masterIdent = await masterIdentPromise;
      this.handleEncryptInfo(encInfo);
      this.handleMasterIdent(masterIdent);
      if (encResult === 0) {
        throw new Error('Encrypt failed');
      }
    }

    if (this._options && this._options.onPairedCallback) {
      this._options.onPairedCallback(this.getKeys());
    }
  }

  public onAclStreamData(cid: number, data: Buffer) {
    if (cid !== SMP.CID) {
      return;
    }

    const code = data.readUInt8(0);
    if (SMP.PAIRING_FAILED === code) {
      this.handlePairingFailed(data);
    } else if (SMP.SMP_SECURITY_REQUEST === code) {
      this.handleSecurityRequest(data);
    }
    // console.warn("SMP: " + code);
  }

  public onAclStreamEnd() {
    this._aclStream.removeListener('data', this.onAclStreamDataBinded);
    this._aclStream.removeListener('end', this.onAclStreamEndBinded);

    this.emit('end');
  }

  public async handlePairingResponseLegacyPairingWait() {
    if (this.isPasskeyMode()) {
      let passkeyNumber = 0;
      passkeyNumber = await this._options!.passkeyCallback!();
      this.debug(`PassKey=${passkeyNumber}`);
      const passkey = new Array(16);
      for (let i = 0; i < 3; i++) {
        passkey[i] = (passkeyNumber >> (i * 8)) & 0xff;
      }

      this._tk = Buffer.from(passkey);
    } else {
      this._tk = Buffer.from('00000000000000000000000000000000', 'hex');
    }

    this._r = crypto.r();

    this.write(
      Buffer.concat([
        Buffer.from([SMP.PAIRING_CONFIRM]),
        crypto.c1(
          this._tk,
          this._r,
          this._pres,
          this._preq,
          this._iat,
          this._ia,
          this._rat,
          this._ra
        ),
      ])
    );
  }

  public async handlePairingResponseSecureConnectionWait() {
    // TODO: check peer device support sc.

    // const passkeyBit = new Array<boolean>(20);
    // for (let i = 0; i < 20; i++) {
    //   passkeyBit[i] = (passkeyNumber >> i) & 0x1 ? true : false;
    // }

    const ecdh = crypto.createECDHKey();

    const remoteKeyPromise = this._readWait(SMP.PAIRING_PUBLIC_KEY);

    this.write(
      Buffer.concat([Buffer.from([SMP.PAIRING_PUBLIC_KEY]), ecdh.x, ecdh.y])
    );

    const remoteKey = await remoteKeyPromise;

    const peerPublicKey = {
      x: remoteKey.slice(1, 33),
      y: remoteKey.slice(33, 65),
    };
    this.debug('got remote public key');

    const passkeyNumber = this.isPasskeyMode()
      ? await this._options!.passkeyCallback!()
      : 0;

    this.debug(`PassKey=${passkeyNumber}`);

    const rspConfirmBuffers = [];
    const rspRandomBuffers = [];
    const initRandomValue = crypto.randomBytes(16);
    for (
      let passkeyBitCounter = 0;
      passkeyBitCounter < 20;
      passkeyBitCounter++
    ) {
      console.log('here' + passkeyBitCounter);
      const initConfirmValue = crypto.f4(
        ecdh.x,
        peerPublicKey.x,
        initRandomValue,
        ((passkeyNumber >> passkeyBitCounter) & 1) | 0x80
      );

      const remoteConfirmPromise = this._readWait(SMP.PAIRING_CONFIRM);
      this.write(
        Buffer.concat([Buffer.from([SMP.PAIRING_CONFIRM]), initConfirmValue])
      );
      console.log('write confirm' + passkeyBitCounter);
      const buf = await remoteConfirmPromise;
      console.log('get confirm' + passkeyBitCounter);
      rspConfirmBuffers.push(buf.slice(1));

      const remoteRamdomPromise = this._readWait(SMP.PAIRING_RANDOM);
      this.write(
        Buffer.concat([Buffer.from([SMP.PAIRING_RANDOM]), initRandomValue])
      );
      console.log('write random' + passkeyBitCounter);
      const buf2 = await remoteRamdomPromise;
      console.log('get random' + passkeyBitCounter);

      rspRandomBuffers.push(buf2.slice(1));

      console.log('finish' + passkeyBitCounter);
    }

    const res = crypto.generateLtkEaEb(
      ecdh.ecdh,
      peerPublicKey,
      this._ia,
      this._iat,
      this._ra,
      this._rat,
      initRandomValue,
      rspRandomBuffers[rspRandomBuffers.length - 1],
      passkeyNumber,
      0x10, // max key size
      this._preq ? this._preq.slice(1, 4) : Buffer.alloc(3),
      this._pres ? this._pres.slice(1, 4) : Buffer.alloc(3)
    );
    const remoteDhkeyPromise = this._readWait(SMP.PAIRING_DHKEY_CHECK);

    this.write(Buffer.concat([Buffer.from([SMP.PAIRING_DHKEY_CHECK]), res.Ea]));
    const buf3 = await remoteDhkeyPromise;
    const Eb = buf3.slice(1);
    console.log('got dhkey');

    const irkPromise = this._readWait(SMP.IDENTITY_INFORMATION);
    const bdAddrPromise = this._readWait(SMP.IDENTITY_ADDRESS_INFORMATION);

    this._ltk = res.ltk;
    this.emit('ltk', this._ltk);
    await this._aclStream.onSmpStkWait(this._ltk);

    const irkBuf = await irkPromise;
    const bdAddrBuf = await bdAddrPromise;

    // we dont have irk, so zero padding
    this.write(
      Buffer.concat([Buffer.from([SMP.IDENTITY_INFORMATION]), Buffer.alloc(16)])
    );
    this.write(
      Buffer.concat([
        Buffer.from([SMP.IDENTITY_ADDRESS_INFORMATION]),
        this._iat,
        this._ia,
      ])
    );
    this._rand = Buffer.alloc(8);
    this._ediv = Buffer.alloc(2);
    return res.ltk;
  }

  public handlePairingConfirm(data: Buffer) {
    this._pcnf = data;

    this.write(
      Buffer.concat([
        Buffer.from([SMP.PAIRING_RANDOM]),
        this._r ?? Buffer.alloc(0),
      ])
    );
  }

  public async handlePairingRandomWait(data: any) {
    const r: any = data.slice(1);
    let encResult = null;
    const pcnf: any = Buffer.concat([
      Buffer.from([SMP.PAIRING_CONFIRM]),
      crypto.c1(
        this._tk,
        r,
        this._pres,
        this._preq,
        this._iat,
        this._ia,
        this._rat,
        this._ra
      ),
    ]);

    if (this._pcnf && this._pcnf.toString('hex') === pcnf.toString('hex')) {
      if (this._stk !== null) {
        console.error('second stk');
      }
      this._stk = crypto.s1(this._tk, r, this._r);

      // this.emit("stk", this._stk);
      encResult = await this._aclStream.onSmpStkWait(this._stk);
    } else {
      this.write(Buffer.from([SMP.PAIRING_RANDOM, SMP.PAIRING_CONFIRM]));

      this.emit('fail', 0);
      throw new Error('Encryption pcnf error');
    }
    return encResult;
  }

  public handlePairingFailed(data: Buffer) {
    this.emit('fail', data.readUInt8(1));
  }

  public handleEncryptInfo(data: any) {
    this._ltk = data.slice(1);
    this.emit('ltk', this._ltk);
  }

  public handleMasterIdent(data: any) {
    const ediv: any = data.slice(1, 3);
    const rand: any = data.slice(3);

    this._ediv = ediv;
    this._rand = rand;
    this.emit('masterIdent', ediv, rand);
  }

  public write(data: any) {
    this._aclStream.write(SMP.CID, data);
  }

  public handleSecurityRequest(data: any) {
    this.pairingWait()
      .then(() => {
        // do nothing.
      })
      .catch((e) => {
        if (this._options && this._options.onPairingFailed) {
          this._options.onPairingFailed(e);
        } else {
          throw e;
        }
      });
  }

  public setKeys(keyStringBase64: string) {
    const keyString = Buffer.from(keyStringBase64, 'base64').toString('ascii');
    this.debug(`restored keys ${keyString}`);
    const keys = JSON.parse(keyString);
    this._stk = keys.stk ? Buffer.from(keys.stk, 'hex') : null;
    this._preq = keys.preq ? Buffer.from(keys.preq, 'hex') : null;
    this._pres = keys.pres ? Buffer.from(keys.pres, 'hex') : null;
    this._tk = keys.tk ? Buffer.from(keys.tk, 'hex') : null;
    this._r = keys.r ? Buffer.from(keys.r, 'hex') : null;
    this._pcnf = keys.pcnf ? Buffer.from(keys.pcnf, 'hex') : null;
    this._ltk = keys.ltk ? Buffer.from(keys.ltk, 'hex') : null;
    this._ediv = keys.ediv ? Buffer.from(keys.ediv, 'hex') : null;
    this._rand = keys.rand ? Buffer.from(keys.rand, 'hex') : null;
  }

  public getKeys() {
    const keys = {
      stk: this._stk ? this._stk.toString('hex') : null,
      preq: this._preq ? this._preq.toString('hex') : null,
      pres: this._pres ? this._pres.toString('hex') : null,
      tk: this._tk ? this._tk.toString('hex') : null,
      r: this._r ? this._r.toString('hex') : null,
      pcnf: this._pcnf ? this._pcnf.toString('hex') : null,
      ltk: this._ltk ? this._ltk.toString('hex') : null,
      ediv: this._ediv ? this._ediv.toString('hex') : null,
      rand: this._rand ? this._rand.toString('hex') : null,
    };
    const jsonString = JSON.stringify(keys);
    const keyString = Buffer.from(jsonString, 'ascii').toString('base64');
    return keyString;
  }

  private _generateAuthenticationRequirementsFlags(params: {
    bonding: BondingType;
    mitm: boolean;
    secureConnection: boolean;
    keypress: boolean;
    ct2: boolean;
  }) {
    let result = 0x00;
    if (params.bonding === 'Bonding') {
      result |= 0x01;
    }
    if (params.mitm) {
      result |= 0x04;
    }
    if (params.secureConnection) {
      result |= 0x08;
    }
    if (params.keypress) {
      result |= 0x10;
    }
    if (params.ct2) {
      result |= 0x20;
    }

    return result;
  }

  private async sendPairingRequestWait() {
    if (this.isPasskeyMode()) {
      this.debug(`pair capable passkey`);
      this._preq = Buffer.from([
        SMP.PAIRING_REQUEST,
        0x02, // IO capability: Keyboard
        0x00, // OOB data: Authentication data not present
        this._generateAuthenticationRequirementsFlags({
          bonding: 'Bonding',
          mitm: true,
          ct2: false,
          keypress: false,
          secureConnection: this.isSecureConnectionMode(),
        }), // Authentication requirement: Bonding - MITM
        0x10, // Max encryption key size
        0x02, // Initiator key distribution: <none>  central ->  peripheral
        0x02, // Responder key distribution: EncKey   peripheral -> central
      ]);
    } else {
      this.debug(`pair No Input and No Output`);
      this._preq = Buffer.from([
        SMP.PAIRING_REQUEST,
        0x03, // IO capability: NoInputNoOutput
        0x00, // OOB data: Authentication data not present
        this._generateAuthenticationRequirementsFlags({
          bonding: 'Bonding',
          mitm: false,
          ct2: false,
          keypress: false,
          secureConnection: this.isSecureConnectionMode(),
        }), // Authentication requirement: Bonding - No MITM
        0x10, // Max encryption key size
        0x00, // Initiator key distribution: <none>
        0x01, // Responder key distribution: EncKey
      ]);
    }
    this.write(this._preq);
  }

  private isPasskeyMode() {
    if (this._options && this._options.passkeyCallback) {
      return true;
    }
    return false;
  }

  private isSecureConnectionMode() {
    if (this._options && this._options.secureConnection) {
      return true;
    }
    return false;
  }

  private _readWait(flag: number, timeout?: number): Promise<Buffer> {
    return Promise.race([
      this._aclStream.readWait(SMP.CID, flag, timeout),
      this._pairingFailReject(),
    ]);
  }

  private _pairingFailReject(): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      this.on('fail', (reason) => {
        reject(new ObnizBlePairingRejectByRemoteError(reason));
      });
    });
  }

  private debug(text: any) {
    console.log(`SMP: ${text}`);
  }

  private parsePairingReqRsp(data: Buffer) {
    return {
      ioCap: this.value2ioCapability(data[1]),
      bondingFlags: ((data[3] & 3) === 0
        ? 'NoBonding'
        : 'Bonding') as BondingType,
      mitm: (data[3] & 4) !== 0,
      sc: (data[3] & 8) !== 0,
      keypress: (data[3] & 16) !== 0,
      maxKeySize: data[4],
      initKeyDistr: {
        encKey: (data[5] & 1) !== 0,
        idKey: (data[5] & 2) !== 0,
      },
      rspKeyDistr: {
        encKey: (data[6] & 1) !== 0,
        idKey: (data[6] & 2) !== 0,
      },
    };
  }

  private ioCapability2value(capability: SmpIoCapability): number {
    switch (capability) {
      case 'displayOnly':
        return 0x00;
      case 'displayYesNo':
        return 0x01;
      case 'keyboardDisplay':
        return 0x04;
      case 'keyboardOnly':
        return 0x02;
    }
    return 0x03;
  }
  private value2ioCapability(value: number): SmpIoCapability {
    const map: { [key: number]: SmpIoCapability } = {
      0x00: 'displayOnly',
      0x01: 'displayYesNo',
      0x02: 'keyboardOnly',
      0x03: 'noInputNoOutput',
      0x04: 'keyboardDisplay',
    };
    if (map[value]) {
      return map[value];
    }
    throw new Error('unknown value');
  }
}

export default Smp;
