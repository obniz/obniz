/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
import Obniz from '../../index';
export default class App {
    private Obniz;
    constructor(obniz: Obniz);
    /**
     * Recording App log on obniz Cloud.
     *
     * @param text log text
     * @returns none
     */
    log(text: unknown): void;
    /**
     * Recording App error log on obniz Cloud.
     *
     * @param text log text
     * @returns none
     */
    log_error(text: unknown): void;
    protected _log_level(level: 'info' | 'error', text: unknown): void;
    /**
     * Recording App log on obniz Cloud.
     *
     * @param text log text
     * @returns none
     */
    status(status: string, text: unknown): void;
    /**
     * @ignore
     * @private
     */
    _reset(): void;
    /**
     * @ignore
     * @param obj
     */
    notified(obj: unknown): void;
}
