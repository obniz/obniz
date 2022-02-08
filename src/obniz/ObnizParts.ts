/**
 * @packageDocumentation
 * @module ObnizCore
 */

import BleRemotePeripheral from './libs/embeds/bleHci/bleRemotePeripheral';
import ObnizUtil from './libs/utils/util';
import ObnizConnection from './ObnizConnection';
import { ObnizOptions } from './ObnizOptions';
import {
  ObnizPartsBle,
  ObnizPartsBleMode,
  ObnizPartsBleProps,
} from './ObnizPartsBleAbstract';
import ObnizPartsInterface from './ObnizPartsInterface';
import { PartsList, PartsType } from './ObnizPartsList';

export interface PartsConstructor<P extends PartsType> {
  new (): PartsList[P]['class'];
}

/**
 * @ignore
 */
const _parts: { [key: string]: PartsConstructor<any> } = {};

export interface Triaxial {
  x: number;
  y: number;
  z: number;
}

export default abstract class ObnizParts extends ObnizConnection {
  /**
   * @ignore
   * @private
   */
  public static _parts(): any {
    return _parts;
  }

  /**
   * Register Parts class
   *
   * @param arg0 Parts class
   * @param arg1 param for parts
   */
  public static PartsRegistrate(arg0: typeof ObnizPartsInterface, arg1?: any) {
    if (
      arg0 &&
      typeof arg0.info === 'function' &&
      typeof arg0.info().name === 'string'
    ) {
      _parts[arg0.info().name as string] = arg0 as any;
    } else if (typeof arg0 === 'string' && typeof arg1 === 'object') {
      _parts[arg0] = arg1;
    }
  }

  /**
   * Get parts class.
   *
   * @param name string
   * @constructor
   */
  public static getPartsClass<K extends PartsType>(
    name: K
  ): PartsConstructor<K> {
    if (!_parts[name]) {
      throw new Error(`unknown parts [${name}]`);
    }
    return _parts[name] as any;
  }

  constructor(id: string, options?: ObnizOptions) {
    super(id, options);
  }

  /**
   * Check the param is valid io pin no.
   *
   * @param io
   */
  public isValidIO(io: any): boolean {
    return typeof io === 'number' && (this as any)['io' + io] !== null;
  }

  /**
   * Check the param is valid ad pin no.
   *
   * @param ad
   */
  public isValidAD(ad: any): boolean {
    return typeof ad === 'number' && (this as any)['ad' + ad] !== null;
  }

  /**
   * Setup Parts of parts library
   *
   * @param partsName
   * @param options
   */
  public wired<K extends keyof PartsList>(
    partsName: K,
    options?: PartsList[K]['options']
  ): PartsList[K]['class'] {
    if (this.connectionState !== 'connected') {
      throw new Error('obniz.wired can only be used after connection');
    }
    const Parts = ObnizParts.getPartsClass(partsName);
    if (!Parts) {
      throw new Error('No such a parts [' + partsName + '] found');
    }
    const parts = new Parts();
    // eslint-disable-next-line prefer-rest-params
    const args = Array.from(arguments);
    args.shift();
    args.unshift(this);
    if (!args[1]) {
      args[1] = {};
    }
    if (parts.keys) {
      if (parts.requiredKeys) {
        const err = ObnizUtil._requiredKeys(args[1], parts.requiredKeys);
        if (err) {
          throw new Error(
            partsName + " wired param '" + err + "' required, but not found "
          );
        }
      }
      parts.params = ObnizUtil._keyFilter(args[1], parts.keys);
    }
    (parts as any).obniz = this;
    (parts.wired as any)(...args);
    if (parts.keys || parts.ioKeys) {
      const keys = parts.ioKeys || parts.keys;
      const displayPartsName = parts.displayName || partsName;
      const ioNames: any = {};
      for (const index in keys) {
        let pinName = keys[index];
        const io = args[1][pinName];
        if (this.isValidIO(io)) {
          if (parts.displayIoNames && parts.displayIoNames[pinName]) {
            pinName = parts.displayIoNames[pinName];
          }
          ioNames[io] = pinName;
        }
      }
      const display = (this as any).display;
      if (display) {
        display.setPinNames(displayPartsName, ioNames);
      }
    }
    return parts;
  }

  public static getBleParts(
    peripheral: BleRemotePeripheral
  ): ObnizPartsBle<any> | null {
    const result = Object.entries(_parts)
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ([, p]: [string, any]) =>
          p.AvailableBleMode !== undefined &&
          typeof p.getDeviceMode === 'function'
      )
      .map(([n, p]) => [
        n,
        ((p as any) as typeof ObnizPartsBle).getDeviceMode(peripheral),
      ])
      .filter(([, m]) => m !== null)
      // Hiring with long library names
      .sort(([na], [nb]) => (nb ?? '').length - (na ?? '').length);

    if (result.length === 0 || !result[0][0] || !result[0][1]) {
      return null;
    }
    const [name, mode] = result[0];

    const parts = new ((_parts[name] as any) as ObnizPartsBleProps)(
      peripheral,
      mode as ObnizPartsBleMode
    );
    return parts;
  }
}
