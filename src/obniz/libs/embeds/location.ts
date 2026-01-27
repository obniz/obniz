/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import { ComponentAbstract } from '../ComponentAbstact';

interface ObnizGeoLocation {
  latitude: number;
  longitude: number;
  altitude: number;
  accuracy: number;
  speed: number;
}

type ObnizLocationUpdateCallback = (result: ObnizGeoLocation) => void;

/**
 * GPS/GNSS Service
 *
 * @category Embeds
 */
export class Location extends ComponentAbstract {
  /**
   * Simple Example
   *
   * ```javascript
   * // Javascript Example
   * obniz.location.start();
   * obniz.location.onupdate = function(metrix) {
   *   console.log(metrix)
   * }
   * ```
   */
  public onupdate?: ObnizLocationUpdateCallback;

  constructor(obniz: any, info: any) {
    super(obniz);
    this.on('/response/location/update', (obj) => {
      this.Obniz._runUserCreatedFunction(this.onupdate, obj);
    });

    this._reset();
  }

  protected _reset(): void {
    // No Need to reset
  }

  public schemaBasePath(): string {
    return 'location';
  }

  public start() {
    const obj = {
      location: {
        start: {},
      },
    };
    this.Obniz.send(obj);
  }
}
