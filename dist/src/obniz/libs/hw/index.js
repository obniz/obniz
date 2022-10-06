"use strict";
/**
 * @packageDocumentation
 * @ignore
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.HW = void 0;
class HW {
    static getDefinitionFor(hw) {
        if (hw === 'obnizb1') {
            return require('./obnizb1.json');
        }
        else if (hw === 'obnizb2') {
            return require('./obnizb2.json');
        }
        else if (hw === 'esp32w') {
            return require('./esp32w.json');
        }
        else if (hw === 'esp32p') {
            return require('./esp32p.json');
        }
        else if (hw === 'm5stickc') {
            return require('./m5stickc.json');
        }
        else if (hw === 'm5stack_basic') {
            return require('./m5stack_basic.json');
        }
        else if (hw === 'encored') {
            return require('./encored.json');
        }
        else if (hw === 'encored_lte') {
            return require('./encored_lte.json');
        }
        else if (hw === 'cc3235mod') {
            return require('./cc3235mod.json');
        }
        else if (hw === 'esp32c3') {
            return require('./esp32c3.json');
        }
        else if (hw === 'blewifi_gw2') {
            return require('./blewifi_gw2.json');
        }
        else if (hw === 'blelte_gw2') {
            return require('./blelte_gw2.json');
        }
        else {
            // default
            return require('./esp32w.json');
        }
    }
}
exports.HW = HW;
