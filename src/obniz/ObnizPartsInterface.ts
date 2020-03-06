/**
 * @packageDocumentation
 * @module ObnizCore
 */

import Obniz from "./index";

export interface ObnizPartsInfo {
  name: string;
  datasheet?: any;
}

export default abstract class ObnizPartsInterface {
  public static info: () => ObnizPartsInfo;

  public abstract keys: string[];
  public abstract requiredKeys: string[];
  public abstract ioKeys?: string[];
  public params: any;

  public abstract wired(obniz: Obniz): void;
}
