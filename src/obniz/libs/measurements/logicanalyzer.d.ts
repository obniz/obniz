// Type definitions for logicanalyzer
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped

/**
 *
 */
declare interface LogicAnalyzer {

  /**
   *
   * @param obniz
   */
  new(obniz: any): LogicAnalyzer;

  /**
   *
   */
  _reset(): void;

  /**
   *
   * @param params
   */
  start(params: any): void;

  /**
   *
   */
  end(): void;

  /**
   *
   * @param obj
   */
  notified(obj: any): void;
}

declare module "logicanalyzer" {

  export default logicanalyzer;    // es6 style module export
}
