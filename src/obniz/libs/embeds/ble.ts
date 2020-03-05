/**
 * Obniz BLE are switches automatically. <br/>
 * obnizOS ver >= 3.0.0  : [[ObnizCore.Components.Ble.Hci | Hci]] <br/>
 * obnizOS ver < 3.0.0   : [[ObnizCore.Components.Ble.old | old]] <br/>
 * @packageDocumentation
 * @module ObnizCore.Components.Ble
 */

import * as ObnizOldBLE from "./ble/ble";
import * as ObnizHciBLE from "./bleHci/ble";

export {ObnizOldBLE, ObnizHciBLE};
