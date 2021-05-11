"use strict";
/**
 * @packageDocumentation
 * @module Parts.IRModule
 */
Object.defineProperty(exports, "__esModule", { value: true });
class IRModule {
    constructor() {
        this.keys = ['recv', 'vcc', 'send', 'gnd'];
        this.requiredKeys = ['recv', 'send'];
    }
    static info() {
        return {
            name: 'IRModule',
        };
    }
    get dataSymbolLength() {
        return this.sensor.dataSymbolLength;
    }
    set dataSymbolLength(x) {
        this.sensor.dataSymbolLength = x;
        this.led.dataSymbolLength = x;
    }
    wired(obniz) {
        this.obniz = obniz;
        obniz.setVccGnd(this.params.vcc, this.params.gnd, '5v');
        if (!obniz.isValidIO(this.params.recv)) {
            throw new Error('recv is not valid io');
        }
        if (!obniz.isValidIO(this.params.send)) {
            throw new Error('send is not valid io');
        }
        this.sensor = obniz.wired('IRSensor', {
            output: this.params.recv,
        });
        this.setGetterSetter('sensor', 'duration');
        this.setGetterSetter('sensor', 'dataInverted');
        this.setGetterSetter('sensor', 'cutTail');
        this.setGetterSetter('sensor', 'output_pullup');
        this.setGetterSetter('sensor', 'ondetect');
        this.led = obniz.wired('InfraredLED', {
            anode: this.params.send,
        });
    }
    // link
    send(arr) {
        this.led.send(arr);
    }
    start(callback) {
        this.sensor.start(callback);
    }
    setGetterSetter(partsName, varName) {
        Object.defineProperty(this, varName, {
            get() {
                return this[partsName][varName];
            },
            set(x) {
                this[partsName][varName] = x;
            },
        });
    }
}
exports.default = IRModule;
