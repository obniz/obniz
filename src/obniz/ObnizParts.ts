import ObnizUtil from "./libs/utils/util";
import ObnizConnection from "./ObnizConnection";
import {WiredNameMap, WiredNameOptionsMap} from "./ObnizPartsList";

const _parts: any = {};

export default class ObnizParts extends ObnizConnection {

  public static _parts(): any {
    return _parts;
  }

  public static PartsRegistrate(arg0: any, arg1?: any) {
    if (
      arg0 &&
      typeof arg0.info === "function" &&
      typeof arg0.info().name === "string"
    ) {
      _parts[arg0.info().name] = arg0;
    } else if (typeof arg0 === "string" && typeof arg1 === "object") {
      _parts[arg0] = arg1;
    }
  }

  public static Parts(name: any): any {
    if (!_parts[name]) {
      throw new Error(`unknown parts [${name}]`);
    }
    return new _parts[name]();
  }

  constructor(id: any, options?: any) {
    super(id, options);
  }

  public isValidIO(io: any): boolean {
    return typeof io === "number" && (this as any)["io" + io] !== null;
  }

  public wired<K extends keyof WiredNameMap>(partsname: K, options?: WiredNameOptionsMap[K]): WiredNameMap[K] {
    const parts: any = ObnizParts.Parts(partsname);
    if (!parts) {
      throw new Error("No such a parts [" + partsname + "] found");
    }
    const args: any = Array.from(arguments);
    args.shift();
    args.unshift(this);
    if (parts.keys) {
      if (parts.requiredKeys) {
        const err: any = ObnizUtil._requiredKeys(args[1], parts.requiredKeys);
        if (err) {
          throw new Error(
            partsname + " wired param '" + err + "' required, but not found ",
          );
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
