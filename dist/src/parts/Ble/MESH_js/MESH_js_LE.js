"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const _1 = require(".");
class MESH_js_LE extends _1.MESH_js {
    parseLightupCommand(red, green, blue, time, cycle_on, cycle_off, pattern) {
        if (red < 0 || 127 < red) {
            this.errorOutOfRange('red (' + red + ') must be 0 ~ 127.');
            return [];
        }
        if (green < 0 || 127 < green) {
            this.errorOutOfRange('green (' + green + ') must be 0 ~ 127.');
            return [];
        }
        if (blue < 0 || 127 < blue) {
            this.errorOutOfRange('blue (' + blue + ') must be 0 ~ 127.');
            return [];
        }
        if (time < 0 || 65535 < time) {
            this.errorOutOfRange('time (' + time + ') must be 0 ~ 65,535.');
            return [];
        }
        if (cycle_on < 0 || 65535 < cycle_on) {
            this.errorOutOfRange('cycle_on (' + cycle_on + ') must be 0 ~ 65,535.');
            return [];
        }
        if (cycle_off < 0 || 65535 < cycle_off) {
            this.errorOutOfRange('cycle_off (' + cycle_off + ') must be 0 ~ 65,535.');
            return [];
        }
        const MessageTypeID = 1;
        const EventTypeID = 0;
        const FIXED = 0;
        const data = [
            MessageTypeID,
            EventTypeID,
            red,
            FIXED,
            green,
            FIXED,
            blue,
            time % 256,
            Math.floor(time / 256),
            cycle_on % 256,
            Math.floor(cycle_on / 256),
            cycle_off % 256,
            Math.floor(cycle_off / 256),
            pattern,
        ];
        data.push(this.checkSum(data));
        return data;
    }
}
exports.MESH_js_LE = MESH_js_LE;
MESH_js_LE.Pattern = { BLICK: 1, FUWA: 2 };
