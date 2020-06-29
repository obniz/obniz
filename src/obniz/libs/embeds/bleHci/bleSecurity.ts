/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import EventEmitter from "eventemitter3";

/**
 * Deprecated class
 */
export default class BleSecurity {
  protected Obniz: any;
  protected emitter: EventEmitter;

  constructor(Obniz: any) {
    this.Obniz = Obniz;
    this.emitter = new EventEmitter();
  }

  /**
   * Deprecated function
   * @param mode
   * @param level
   */
  public setModeLevel(mode: any, level: any) {
    throw new Error("setModeLevel is deprecated method");
  }

  /**
   * Deprecated function
   * @param introducedVersion
   * @param functionName
   */
  public checkIntroducedFirmware(introducedVersion: any, functionName: any) {
    throw new Error("checkIntroducedFirmware is deprecated method");
  }

  /**
   * Deprecated function
   * @param authTypes
   */
  public setAuth(authTypes: any) {
    throw new Error("setAuth is deprecated method");
  }

  /**
   * Deprecated function
   * @param level
   */
  public setIndicateSecurityLevel(level: any) {
    throw new Error("setIndicateSecurityLevel is deprecated method");
  }

  /**
   * Deprecated function
   * @param keyTypes
   */
  public setEnableKeyTypes(keyTypes: any) {
    throw new Error("setEnableKeyTypes is deprecated method");
  }

  /**
   * Deprecated function
   * @param size
   */
  public setKeyMaxSize(size: any) {
    throw new Error("setKeyMaxSize is deprecated method");
  }

  /**
   * Deprecated function
   */
  public clearBondingDevicesList() {
    throw new Error("clearBondingDevicesList is deprecated method");
  }

  /**
   * @ignore
   * @param params
   */
  public onerror(params: any) {} // dummy

  /**
   * @ignore
   * @param notifyName
   * @param params
   */
  public notifyFromServer(notifyName: any, params: any) {
    switch (notifyName) {
      case "onerror": {
        this.Obniz._runUserCreatedFunction(this.onerror, params);
        break;
      }
    }
  }
}
