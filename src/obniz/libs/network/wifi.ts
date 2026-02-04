/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import semver from 'semver';
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';

export class WiFi extends ComponentAbstract {
  constructor(obniz: Obniz, id: number) {
    super(obniz);
    this._reset();
  }

  /**
   * Scan WiFi
   *
   * ```javascript
   * // Javascript Example
   * console.log(await obniz.wifi.scanWait());
   * ```
   *
   */
  public async scanWait(): Promise<any> {
    if (semver.lt(this.Obniz.firmware_ver!, '3.3.0')) {
      throw new Error(`Please update obniz firmware >= 3.3.0`);
    }

    const obj = { wifi: { scan: true } };
    const json = await this.sendAndReceiveJsonWait(obj, '/response/wifi/scan');
    return json.scan;
  }

  /**
   *
   * ```javascript
   * // Javascript Example
   * obniz.wifi.end();
   * ```
   */
  public end() {
    this._reset();
  }

  public schemaBasePath(): string {
    return 'wifi';
  }

  protected _reset() {
    // no-op
  }
}
