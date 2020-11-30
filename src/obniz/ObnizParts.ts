/**
 * @packageDocumentation
 * @module ObnizCore
 */

import ObnizUtil from "./libs/utils/util";
import ObnizConnection from "./ObnizConnection";
import { ObnizOptions } from "./ObnizOptions";
import ObnizPartsInterface from "./ObnizPartsInterface";
import { WiredNameMap, WiredNameOptionsMap } from "./ObnizPartsList";

/**
 * @ignore
 */
const _parts: any = {};

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
   * @param arg0 Parts class
   */
  public static PartsRegistrate(arg0: typeof ObnizPartsInterface, arg1?: any) {
    if (arg0 && typeof arg0.info === "function" && typeof arg0.info().name === "string") {
      _parts[arg0.info().name] = arg0;
    } else if (typeof arg0 === "string" && typeof arg1 === "object") {
      _parts[arg0] = arg1;
    }
  }

  /**
   * Get parts class.
   * @param string
   * @constructor
   */
  public static getPartsClass<K extends keyof WiredNameMap>(name: K): any {
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
   * @param io
   */
  public isValidIO(io: any): boolean {
    return typeof io === "number" && (this as any)["io" + io] !== null;
  }

  /**
   * Check the param is valid ad pin no.
   * @param io
   */
  public isValidAD(ad: any): boolean {
    return typeof ad === "number" && (this as any)["ad" + ad] !== null;
  }

  /**
   * Setup Parts of parts library
   *
   * @param partsname
   * @param options
   */
  public wired<K extends keyof WiredNameMap>(partsname: K, options?: WiredNameOptionsMap[K]): WiredNameMap[K] {
    const Parts: any = ObnizParts.getPartsClass(partsname);
    if (!Parts) {
      throw new Error("No such a parts [" + partsname + "] found");
    }
    const parts = new Parts();
    const args: any = Array.from(arguments);
    args.shift();
    args.unshift(this);
    if (!args[1]) {
      args[1] = {};
    }
    if (parts.keys) {
      if (parts.requiredKeys) {
        const err: any = ObnizUtil._requiredKeys(args[1], parts.requiredKeys);
        if (err) {
          throw new Error(partsname + " wired param '" + err + "' required, but not found ");
        }
      }
      parts.params = ObnizUtil._keyFilter(args[1], parts.keys);
    }
    parts.obniz = this;
    parts.wired.apply(parts, args);
    if (parts.keys || parts.ioKeys) {
      const keys: any = parts.ioKeys || parts.keys;
      const displayPartsName: any = parts.displayName || partsname;
      const ioNames: any = {};
      for (const index in keys) {
        let pinName: any = keys[index];
        const io: any = args[1][pinName];
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
}
