"use strict";
/**
 * Obniz BLE are switches automatically. <br/>
 * obnizOS ver >= 3.0.0  : [[ObnizCore.Components.Ble.Hci | Hci]] <br/>
 * obnizOS ver < 3.0.0   : [[ObnizCore.Components.Ble.old | old]] <br/>
 * @packageDocumentation
 * @module ObnizCore.Components.Ble
 */
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizOldBLE = __importStar(require("./ble/ble"));
exports.ObnizOldBLE = ObnizOldBLE;
const ObnizHciBLE = __importStar(require("./bleHci/ble"));
exports.ObnizHciBLE = ObnizHciBLE;

//# sourceMappingURL=ble.js.map
