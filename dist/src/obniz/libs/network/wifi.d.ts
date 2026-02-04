/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
import { ComponentAbstract } from '../ComponentAbstact';
export declare class WiFi extends ComponentAbstract {
    constructor(obniz: Obniz, id: number);
    /**
     * Scan WiFi
     *
     * ```javascript
     * // Javascript Example
     * console.log(await obniz.wifi.scanWait());
     * ```
     *
     */
    scanWait(): Promise<any>;
    /**
     *
     * ```javascript
     * // Javascript Example
     * obniz.wifi.end();
     * ```
     */
    end(): void;
    schemaBasePath(): string;
    protected _reset(): void;
}
