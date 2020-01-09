const ObnizConnection: any = require("./ObnizConnection");
const ObnizUtil: any = require("./libs/utils/util");

let _parts: any = {};

module.exports = class ObnizParts extends ObnizConnection {

  public static _parts() {
    return _parts;
  }

  public static PartsRegistrate(arg0: any, arg1: any) {
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

  public static Parts(name: any) {
    if (!_parts[name]) {
      throw new Error(`unknown parts [${name}]`);
    }
    return new _parts[name]();
  }

  constructor(id, options) {
    super(id, options);
  }

  public wired(partsname: any) {
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
      for (const index: any in keys) {
        let pinName: any = keys[index];
        const io: any = args[1][pinName];
        if (this.isValidIO(io)) {
          if (parts.displayIoNames && parts.displayIoNames[pinName]) {
            pinName = parts.displayIoNames[pinName];
          }
          ioNames[io] = pinName;
        }
      }
      this.display.setPinNames(displayPartsName, ioNames);
    }
    return parts;
  }
};
