/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
export declare class WiFi {
    private Obniz;
    private connectObservers;
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
    /**
     * @ignore
     * @param obj
     */
    notified(obj: any): void;
    private _reset;
    private _addConnectObserver;
}
