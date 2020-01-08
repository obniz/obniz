// Type definitions for WSCommandI2C
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
import {extendConfigurationFile} from "tslint/lib/configuration";
import WSCommand from "./WSCommand";

declare namespace WSCommandI2C.prototype {
  // WSCommandI2C.prototype.notifyFromBinary.!0

  /**
   *
   */
  interface NotifyFromBinary0 {
  }
}

/**
 *
 */
export default class WSCommandI2C extends WSCommand {
  public module: number;

  /**
   *
   */
  public new(): WSCommandI2C;

  /**
   * Commands
   * @param params
   * @param module
   */
  public initMaster(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  public initSlave(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  public deinit(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  public write(params: any, module: any): void;

  /**
   *
   * @param params
   * @param module
   */
  public read(params: any, module: any): void;

  /**
   *
   * @param json
   */
  public parseFromJson(json: any): void;

  /**
   *
   * @param objToSend
   * @param func
   * @param payload
   */
  public notifyFromBinary(objToSend: WSCommandI2C.prototype.NotifyFromBinary0, func: any, payload: any): void;
}
