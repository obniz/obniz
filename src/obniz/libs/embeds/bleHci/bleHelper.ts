/**
 * @packageDocumentation
 * @ignore
 */
import {
  BleDeviceAddress,
  BleDeviceAddressReversed,
  BleDeviceAddressReversedBuffer,
  BleDeviceAddressUUID,
  BleDeviceColonSeparatedAddress,
  BleUUIDBuffer,
  UUID,
} from './bleTypes';

export class BleHelper {
  uuidFilter(uuid: string | UUID): UUID {
    return uuid.toLowerCase().replace(/[^0-9abcdef]/g, '');
  }

  deviceAddressFilter(
    deviceAddress: string | BleDeviceAddress
  ): BleDeviceAddress {
    return deviceAddress
      .toLowerCase()
      .replace(/[^0-9abcdef]/g, '') as BleDeviceAddress;
  }

  toCamelCase(str: string): string {
    str = str.charAt(0).toLowerCase() + str.slice(1);
    return str.replace(/[-_](.)/g, (match: any, group1: any) => {
      return group1.toUpperCase();
    });
  }

  toSnakeCase(str: string): string {
    const camel: any = this.toCamelCase(str);
    return camel.replace(/[A-Z]/g, (s: any) => {
      return '_' + s.charAt(0).toLowerCase();
    });
  }

  buffer2reversedHex(buf: BleDeviceAddressReversedBuffer): BleDeviceAddress {
    const deviceAddress = this.reverseHexString(
      buf.toString('hex') as BleDeviceAddressReversed
    );
    return deviceAddress;
  }

  hex2reversedBuffer<
    T extends BleDeviceColonSeparatedAddress | BleDeviceAddress | UUID
  >(
    address: T
  ): T extends UUID ? BleUUIDBuffer : BleDeviceAddressReversedBuffer {
    if (!address.includes(':')) {
      //  T extends  BleDeviceAddress | UUID
      const dAddress = address as BleDeviceAddress;
      return Buffer.from(this.reverseHexString(dAddress), 'hex') as any;
    }

    // T extends BleDeviceColonSeparatedAddress
    return Buffer.from(address.split(':').reverse().join(''), 'hex') as any;
  }

  /**
   * hex stringをreverseする。
   *
   * ex)
   * 123456789012 -> 129078563412
   *
   * @param str
   * @param separator
   */
  reverseHexString<T extends BleDeviceAddress | BleDeviceAddressReversed>(
    str: T
  ): T extends BleDeviceAddress ? BleDeviceAddressReversed : BleDeviceAddress {
    // 40msec (100000 times)
    // return str
    //   .match(/.{1,2}/g)!
    //   .reverse()
    //   .join("");

    // 30msec (100000 times)
    // const parts = [];
    // for (let i = 0; i < str.length; i += 2) {
    //   parts.push(str.slice(i, i + 2));
    // }
    // return parts.reverse().join("");

    // 13msec (100000 times)
    let result = '';
    const len = str.length + (str.length % 2);
    for (let i = len; i > 0; i -= 2) {
      result += str.slice(i - 2, i);
    }
    return result as T extends BleDeviceAddress
      ? BleDeviceAddressReversed
      : BleDeviceAddress;
  }

  addColon(str: BleDeviceAddress): BleDeviceColonSeparatedAddress {
    const parts = [];
    for (let i = 0; i < str.length; i += 2) {
      parts.push(str.slice(i, i + 2));
    }
    return parts.join(':') as BleDeviceColonSeparatedAddress;
  }
}

export default new BleHelper();
