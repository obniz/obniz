// Type definitions for directive
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace Directive.prototype {
  // Directive.prototype.addObserver.!1
  type AddObserver1 = ((value: any) => void);
}
declare namespace Directive.prototype {
  // Directive.prototype.animation.!2
  type Animation2 = any[];
}
declare namespace Directive.prototype {
  // Directive.prototype.notified.!0

  /**
   *
   */
  interface Notified0 {

    /**
     *
     */
    animation: {

      /**
       *
       */
      name: string;

      /**
       *
       */
      status: string;

      /**
       *
       */
      states: any;
    };
  }
}
declare namespace Directive.prototype.Notified0.animation {
  // Directive.prototype.notified.!0.animation.states.<i>

  /**
   *
   */
  interface StatesI {
  }
}

/**
 *
 */
declare interface Directive {

  /**
   *
   * @param Obniz
   * @param id
   */
  new(Obniz: any, id: any): Directive;

  /**
   *
   */
  _reset(): void;

  /**
   *
   * @param name
   * @param resolve
   * @param reject
   */
  addObserver(name: string, resolve: Directive.prototype.AddObserver1, reject: () => void): void;

  /**
   *
   * @param name
   * @param status
   * @param array
   * @param repeat
   */
  animation(name: string, status: string, array: Directive.prototype.Animation2, repeat: any): void;

  /**
   *
   * @param array
   * @param repeat
   * @return
   */
  repeatWait(array: any, repeat: any): /* Directive.prototype.+Promise */ any;

  /**
   *
   * @param obj
   */
  notified(obj: Directive.prototype.Notified0): void;
}

declare module "directive" {

  export default directive;    // es6 style module export
}
