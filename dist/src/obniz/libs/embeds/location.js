"use strict";
/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Location = void 0;
const ComponentAbstact_1 = require("../ComponentAbstact");
/**
 * GPS/GNSS Service
 *
 * @category Embeds
 */
class Location extends ComponentAbstact_1.ComponentAbstract {
    constructor(obniz, info) {
        super(obniz);
        this.on('/response/location/update', (obj) => {
            this.Obniz._runUserCreatedFunction(this.onupdate, obj);
        });
        this._reset();
    }
    _reset() {
        // No Need to reset
    }
    schemaBasePath() {
        return 'location';
    }
    start() {
        const obj = {
            location: {
                start: {},
            },
        };
        this.Obniz.send(obj);
    }
}
exports.Location = Location;
