"use strict";
const BleLocalAttributeAbstract = require('./bleLocalAttributeAbstract');
const BleCharacteristic = require('./bleCharacteristic');
class BleService extends BleLocalAttributeAbstract {
    constructor(obj) {
        super(obj);
        this.addCharacteristic = this.addChild;
        this.getCharacteristic = this.getChild;
    }
    get parentName() {
        return 'peripheral';
    }
    get childrenName() {
        return 'characteristics';
    }
    get childrenClass() {
        return BleCharacteristic;
    }
    get characteristics() {
        return this.children;
    }
    get advData() {
        return {
            flags: ['general_discoverable_mode', 'br_edr_not_supported'],
            serviceUuids: [this.uuid],
        };
    }
    end() {
        this.peripheral.removeService(this.uuid);
    }
    emit(name, ...params) { }
    notify(notifyName, params) {
        //nothing
    }
}
module.exports = BleService;
