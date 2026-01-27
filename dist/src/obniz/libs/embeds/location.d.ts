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
declare type ObnizLocationUpdateCallback = (result: ObnizGeoLocation) => void;
/**
 * GPS/GNSS Service
 *
 * @category Embeds
 */
export declare class Location extends ComponentAbstract {
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
    onupdate?: ObnizLocationUpdateCallback;
    constructor(obniz: any, info: any);
    protected _reset(): void;
    schemaBasePath(): string;
    start(): void;
}
export {};
