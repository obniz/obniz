import Obniz = require("./index");

export interface ObnizPartsInfo {
  name: string;
}

export default abstract class ObnizPartsInterface {
  public static info: (() => ObnizPartsInfo);

  public abstract keys: string[];
  public abstract requiredKeys: string[];

  public abstract wired(obniz: Obniz): void;
}
