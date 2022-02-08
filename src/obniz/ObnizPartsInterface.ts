/**
 * @packageDocumentation
 * @module ObnizCore
 */

import Obniz from './index';
import { PartsType } from './ObnizPartsList';

export interface ObnizPartsInfo {
  name: string;
  datasheet?: any;
}

export interface ObnizPartsProps {
  info(): ObnizPartsInfo;

  PartsName: PartsType;
}

export default abstract class ObnizPartsInterface {
  public static info: () => ObnizPartsInfo;

  public abstract keys: string[];
  public abstract requiredKeys: string[];
  public abstract ioKeys?: string[];
  public displayIoNames?: { [key: string]: string };
  public displayName?: string;

  public params: any;

  public abstract wired(obniz: Obniz, ...args: any[]): void;
}
