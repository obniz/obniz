// Type definitions for measure
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace ObnizMeasure.prototype {
  // ObnizMeasure.prototype.notified.!0

  /**
   *
   */
  interface Notified0 {

    /**
     *
     */
    echo: /*no type*/{};
  }
}

/**
 *
 */
declare interface ObnizMeasure {

  /**
   *
   * @param obniz
   */
  new(obniz: any): ObnizMeasure;

  /**
   *
   */
  _reset(): void;

  /**
   *
   * @param params
   */
  echo(params: any): void;

  /**
   *
   * @param obj
   */
  notified(obj: ObnizMeasure.prototype.Notified0): void;
}

declare module "measure" {

  export default measure;    // es6 style module export
}
