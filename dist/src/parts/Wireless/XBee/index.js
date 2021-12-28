"use strict";
/**
 * @packageDocumentation
 * @module Parts.XBee
 */
Object.defineProperty(exports, "__esModule", { value: true });
class XBee {
    constructor() {
        this.displayIoNames = { tx: '<tx', rx: '>rx' };
        this.keys = ['tx', 'rx', 'gnd'];
        this.requiredKeys = ['tx', 'rx'];
    }
    static info() {
        return {
            name: 'XBee',
        };
    }
    wired(obniz) {
        this.uart = obniz.getFreeUart();
        this.currentCommand = null;
        this.commands = [];
        this.isAtMode = false;
        this.onFinishAtModeCallback = null;
        if (typeof this.params.gnd === 'number') {
            obniz.getIO(this.params.gnd).output(false);
        }
        this.uart.start({
            tx: this.params.tx,
            rx: this.params.rx,
            baud: 9600,
            drive: '3v',
        });
        this.uart.onreceive = (data, text) => {
            if (this.isAtMode) {
                this.onAtResultsRecieve(data, text);
            }
            else {
                if (typeof this.onreceive === 'function') {
                    this.onreceive(data, text);
                }
            }
        };
    }
    send(data) {
        if (this.isAtMode === false) {
            this.uart.send(data);
        }
        else {
            this.obniz.error(new Error('XBee is AT Command mode now. Wait for finish config.'));
        }
    }
    onAtResultsRecieve(data, text) {
        if (!this.isAtMode) {
            return;
        }
        const next = () => {
            this.currentCommand = null;
            this.sendCommand();
        };
        if (text === 'OK\r') {
            if (this.currentCommand === 'ATCN') {
                this.isAtMode = false;
                this.currentCommand = null;
                if (typeof this.onFinishAtModeCallback === 'function') {
                    this.onFinishAtModeCallback();
                    this.onFinishAtModeCallback = null;
                }
                return;
            }
            next();
        }
        else if (text === 'ERROR\r') {
            this.obniz.error(new Error('XBee config error : ' + this.currentCommand));
        }
        else {
            // response of at command.
            console.log('XBEE : no catch message', data);
            next();
        }
    }
    addCommand(command, value) {
        const str = command + (value ? ' ' + value : '');
        this.commands.push(str);
        if (this.isAtMode === true && this.currentCommand === null) {
            this.sendCommand();
        }
    }
    sendCommand() {
        if (this.isAtMode === true &&
            this.currentCommand === null &&
            this.commands.length > 0) {
            this.currentCommand = 'AT' + this.commands.shift();
            this.uart.send(this.currentCommand + '\r');
        }
    }
    enterAtMode() {
        if (this.currentCommand !== null) {
            return;
        }
        this.isAtMode = true;
        this.obniz.wait(1000);
        const command = '+++';
        this.currentCommand = command;
        this.uart.send(this.currentCommand);
        this.obniz.wait(1000);
    }
    exitAtMode() {
        this.addCommand('CN');
    }
    async configWait(config) {
        if (this.isAtMode) {
            throw new Error('Xbee : duplicate config setting');
        }
        return new Promise((resolve, reject) => {
            const standaloneKeys = {
                destination_address_high: 'DH',
                destination_address_low: 'DL',
                source_address: 'MY',
            };
            const highLowKeys = ['destination_address'];
            this.enterAtMode();
            for (const key in config) {
                if (key.length === 2) {
                    this.addCommand(key, config[key]);
                }
                else if (standaloneKeys[key]) {
                    this.addCommand(standaloneKeys[key], config[key]);
                }
                else if (highLowKeys.includes(key)) {
                    let high = config[key].slice(0, -8);
                    if (!high) {
                        high = '0';
                    }
                    const low = config[key].slice(-8);
                    this.addCommand(standaloneKeys[key + '_high'], high);
                    this.addCommand(standaloneKeys[key + '_low'], low);
                }
            }
            this.exitAtMode();
            this.onFinishAtModeCallback = () => {
                resolve();
            };
        });
    }
}
exports.default = XBee;
