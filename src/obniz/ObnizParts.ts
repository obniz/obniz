/**
 * @packageDocumentation
 * @module ObnizCore
 */

import BleRemotePeripheral from './libs/embeds/bleHci/bleRemotePeripheral';
import ObnizUtil from './libs/utils/util';
import { Obniz } from './Obniz';
import ObnizConnection from './ObnizConnection';
import { ObnizOptions } from './ObnizOptions';
import {
  ObnizPartsBle,
  ObnizPartsBleMode,
  ObnizPartsBleProps,
} from './ObnizPartsBleAbstract';
import ObnizPartsInterface from './ObnizPartsInterface';
import { PartsList, PartsType } from './ObnizPartsList';
import PartsClass = Obniz.PartsClass;
import Parts = Obniz.Parts;

/**
 * @ignore
 */
const _parts: {
  [key: string]: PartsClass<any>;
} = {};

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
      _parts[arg0.info().name] = arg0;
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
  public static getPartsClass<K extends PartsType>(name: K): PartsClass<K> {
    if (!_parts[name]) {
      throw new Error(`unknown parts [${name}]`);
    }
    return _parts[name];
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
  ): Parts<K> {
    if (this.connectionState !== 'connected') {
      throw new Error('obniz.wired can only be used after connection');
    }
    const TargetPartsClass = ObnizParts.getPartsClass(partsName);
    if (!TargetPartsClass) {
      throw new Error('No such a parts [' + partsName + '] found');
    }
    const parts = new (TargetPartsClass as any)();
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
    parts.obniz = this;
    parts.wired(...args);
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
    return parts as Parts<K>;
  }

  public static getBleParts(
    peripheral: BleRemotePeripheral
  ): ObnizPartsBle<unknown> | null {
    const result = Object.entries(_parts)
      .filter(
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ([, p]: [string, any]) =>
          p.AvailableBleMode !== undefined &&
          typeof p.getDeviceMode === 'function'
      )
      .map(([n, p]) => [
        n,
        (p as typeof ObnizPartsBle).getDeviceMode(peripheral),
      ])
      .filter(([, m]) => m !== null)
      // Hiring with long library names
      .sort(([na], [nb]) => (nb ?? '').length - (na ?? '').length);

    if (result.length === 0 || !result[0][0] || !result[0][1]) {
      return null;
    }
    const [name, mode] = result[0];

    const parts = new (_parts[name] as ObnizPartsBleProps)(
      peripheral,
      mode as ObnizPartsBleMode
    );
    return parts;
  }
}
