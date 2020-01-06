// Type definitions for switch
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace ObnizSwitch {
  // ObnizSwitch.observers.<i>
  type ObserversI = ((value: any) => void);
}

/**
 *
 */
declare interface ObnizSwitch {

  /**
   *
   */
  observers: ObnizSwitch.ObserversI[];

  /**
   *
   * @param Obniz
   */
  new(Obniz: any): ObnizSwitch;

  /**
   *
   */
  _reset(): void;

  /**
   *
   * @param callback
   */
  addObserver(callback: () => void): void;

  /**
   *
   * @return
   */
  getWait(): /* ObnizSwitch.prototype.+Promise */ any;

  /**
   *
   * @param isPressed
   * @return
   */
  stateWait(isPressed: any): /* ObnizSwitch.prototype.+Promise */ any;

  /**
   *
   * @param obj
   */
  notified(obj: /* ObnizSwitch.prototype.+ObnizSwitch */ any): void;

  /**
   *
   */
  onChangeForStateWait(): void;
}

declare module "obnizSwitch" {

  export default obnizSwitch;    // es6 style module export
}
