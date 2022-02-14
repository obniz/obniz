"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
class App {
    constructor(obniz) {
        this.Obniz = obniz;
    }
    /**
     * Recording App log on obniz Cloud.
     *
     * @param text log text
     * @returns none
     */
    log(text) {
        return this._log_level('info', text);
    }
    /**
     * Recording App error log on obniz Cloud.
     *
     * @param text log text
     * @returns none
     */
    log_error(text) {
        return this._log_level('error', text);
    }
    _log_level(level, text) {
        let _text;
        if (typeof text === 'string') {
            _text = text;
        }
        else if (typeof text === 'number') {
            _text = `${text}`;
        }
        else if (typeof text === 'object') {
            if (text) {
                _text = JSON.stringify(text);
            }
            else {
                _text = `null`;
            }
        }
        this.Obniz.send({
            app: {
                log: {
                    level,
                    text: _text,
                },
            },
        });
    }
    /**
     * Recording App log on obniz Cloud.
     *
     * @param text log text
     * @returns none
     */
    status(status, text) {
        let _text;
        if (typeof text === 'string') {
            _text = text;
        }
        else if (typeof text === 'number') {
            _text = `${text}`;
        }
        else if (typeof text === 'object') {
            if (text) {
                _text = JSON.stringify(text);
            }
            else {
                _text = `null`;
            }
        }
        this.Obniz.send({
            app: {
                status: {
                    status,
                    text: _text,
                },
            },
        });
    }
    /**
     * @ignore
     * @private
     */
    _reset() {
        // do nothing.
    }
    /**
     * @ignore
     * @param obj
     */
    notified(obj) {
        // do nothing.
    }
}
exports.default = App;
//# sourceMappingURL=index.js.map