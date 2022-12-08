/**
 * @packageDocumentation
 * @module ObnizApp
 */
export declare class ObnizApp {
    /**
     * Determine obniz.js is running on obniz Cloud or not.
     */
    static isCloudRunning(): boolean;
    /**
     * request object on obniz Cloud execution for webhook call.
     *
     * ```javascript
     * // JavaScript example
     * const req = Obniz.App.req();
     * console.log(req.query);
     * console.log(req.body);
     * ```
     *
     */
    static req(): any;
    /**
     * done call for obniz Cloud execution.
     * Pass arguemnt for update cloud execution status.
     *
     * ```javascript
     * // JavaScript example
     * Obniz.App.done({
     *   status: 'success',  // 'success' | 'error'
     *   text: 'ex. Door Opened'
     * });
     * ```
     *
     */
    static done(arg: {
        status: 'success' | 'error';
        text: string;
    }): void;
    /**
     * Configration by user for This App. Only Available for BrowserApp
     */
    static configs(): any;
}
