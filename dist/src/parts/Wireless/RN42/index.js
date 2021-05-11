"use strict";
/**
 * @packageDocumentation
 * @module Parts.RN42
 */
Object.defineProperty(exports, "__esModule", { value: true });
class RN42 {
    constructor() {
        this.keys = ['tx', 'rx', 'gnd'];
        this.requiredKeys = ['tx', 'rx'];
    }
    static info() {
        return {
            name: 'RN42',
        };
    }
    wired(obniz) {
        if (obniz.isValidIO(this.params.gnd)) {
            obniz.getIO(this.params.gnd).output(false);
        }
        this.uart = obniz.getFreeUart();
        this.uart.start({
            tx: this.params.tx,
            rx: this.params.rx,
            baud: 115200,
            drive: '3v',
        });
        this.uart.onreceive = (data, text) => {
            // this is not perfect. separation is possible.
            if (text.indexOf('CONNECT') >= 0) {
                // console.log("connected");
            }
            else if (text.indexOf('DISCONNECT') >= 0) {
                // console.log("disconnected");
            }
            if (typeof this.onreceive === 'function') {
                this.onreceive(data, text);
            }
        };
    }
    send(data) {
        this.uart.send(data);
    }
    sendCommand(data) {
        this.uart.send(data + '\n');
        this.obniz.wait(100);
    }
    enterCommandMode() {
        this.send('$$$');
        this.obniz.wait(100);
    }
    config(json) {
        this.enterCommandMode();
        if (typeof json !== 'object') {
            // TODO: warning
            return;
        }
        // remove noize data
        this.sendCommand('');
        if (json.master_slave) {
            this.config_masterslave(json.master_slave);
        }
        if (json.auth) {
            this.config_auth(json.auth);
        }
        if (json.hid_flag) {
            this.config_HIDflag(json.hid_flag);
        }
        if (json.profile) {
            this.config_profile(json.profile);
        }
        if (json.power) {
            this.config_power(json.power);
        }
        if (json.display_name) {
            this.config_displayName(json.display_name);
        }
        this.config_reboot();
    }
    config_reboot() {
        this.sendCommand('R,1');
    }
    config_masterslave(mode) {
        let val = -1;
        if (typeof mode === 'number') {
            val = mode;
        }
        else if (typeof mode === 'string') {
            const modes = [
                'slave',
                'master',
                'trigger',
                'auto-connect-master',
                'auto-connect-dtr',
                'auto-connect-any',
                'pairing',
            ];
            for (let i = 0; i < modes.length; i++) {
                if (modes[i] === mode) {
                    val = i;
                    break;
                }
            }
        }
        if (val === -1) {
            // TODO: warning
            return;
        }
        this.sendCommand('SM,' + val);
    }
    config_displayName(name) {
        this.sendCommand('SN,' + name);
    }
    // // SH,0200 HID Flag register. Descriptor=keyboard
    config_HIDflag(flag) {
        this.sendCommand('SH,' + flag);
    }
    config_profile(mode) {
        let val = -1;
        if (typeof mode === 'number') {
            val = mode;
        }
        else if (typeof mode === 'string') {
            const modes = [
                'SPP',
                'DUN-DCE',
                'DUN-DTE',
                'MDM-SPP',
                'SPP-DUN-DCE',
                'APL',
                'HID',
            ];
            for (let i = 0; i < modes.length; i++) {
                if (modes[i] === mode) {
                    val = i;
                    break;
                }
            }
        }
        if (val === -1) {
            // TODO: warning
            return;
        }
        this.sendCommand('S~,' + val);
    }
    config_revert_localecho() {
        this.sendCommand('+');
    }
    config_auth(mode) {
        let val = -1;
        if (typeof mode === 'number') {
            val = mode;
        }
        else if (typeof mode === 'string') {
            const modes = ['open', 'ssp-keyboard', 'just-work', 'pincode'];
            for (let i = 0; i < modes.length; i++) {
                if (modes[i] === mode) {
                    val = i;
                    break;
                }
            }
        }
        if (val === -1) {
            // TODO: warning
            return;
        }
        this.sendCommand('SA,' + val);
    }
    config_power(dbm) {
        let val = '0010';
        if (16 > dbm && dbm >= 12) {
            val = '000C';
        }
        else if (12 > dbm && dbm >= 8) {
            val = '0008';
        }
        else if (8 > dbm && dbm >= 4) {
            val = '0004';
        }
        else if (4 > dbm && dbm >= 0) {
            val = '0000';
        }
        else if (0 > dbm && dbm >= -4) {
            val = 'FFFC';
        }
        else if (-4 > dbm && dbm >= -8) {
            val = 'FFF8';
        }
        else if (-8 > dbm) {
            val = 'FFF4';
        }
        this.sendCommand('SY,' + val);
    }
    config_get_setting() {
        this.sendCommand('D');
    }
    config_get_extendSetting() {
        this.sendCommand('E');
    }
}
exports.default = RN42;
