"use strict";
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../../obniz/ObnizPartsBleAbstract");
const MESH_js_1 = require("../../MESH_js");
class MESH extends ObnizPartsBleAbstract_1.ObnizPartsBleConnectable {
    constructor() {
        super(...arguments);
        this._mesh = new MESH_js_1.MESH_js();
        this._UUIDS = {
            serviceId: '72C90001-57A9-4D40-B746-534E22EC9F9E',
            characteristicIndicate: '72c90005-57a9-4d40-b746-534e22ec9f9e',
            characteristicNotify: '72c90003-57a9-4d40-b746-534e22ec9f9e',
            characteristicWrite: '72c90004-57a9-4d40-b746-534e22ec9f9e',
            characteristicWriteWO: '72c90002-57a9-4d40-b746-534e22ec9f9e',
        };
        this._indicateCharacteristic = null;
        this._notifyCharacteristic = null;
        this._writeCharacteristic = null;
        this._writeWOCharacteristic = null;
        // event handler
        this.onBatteryNotify = null;
        this.onStatusButtonNotify = null;
        // public setBatteryNotify(func: (val: number) => void) {
        //   console.log(typeof this.onBatteryNotify + '::: before');
        //   this.onBatteryNotify = (val) => {
        //     func(val);
        //   };
        //   console.log(typeof this.onBatteryNotify + '::: after');
        // }
    }
    static isMESHblock(peripheral) {
        if (!peripheral.localName) {
            return false;
        }
        return this._isMESHblock(peripheral.localName);
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH._LocalName) !== -1;
    }
    /**
     * Connect to the services of a device
     *
     * デバイスのサービスに接続
     */
    async connectWait() {
        var _a;
        // await super.connectWait();
        this.prepareConnect();
        await this.peripheral.connectWait();
        this._indicateCharacteristic = this._getCharacteristic(this._UUIDS.characteristicIndicate);
        this._notifyCharacteristic = this._getCharacteristic(this._UUIDS.characteristicNotify);
        this._writeCharacteristic = this._getCharacteristic(this._UUIDS.characteristicWrite);
        this._writeWOCharacteristic = this._getCharacteristic(this._UUIDS.characteristicWriteWO);
        if (!this._indicateCharacteristic) {
            return;
        }
        await this._indicateCharacteristic.registerNotify((data) => {
            console.log('data : ' + data);
        });
        await ((_a = this._notifyCharacteristic) === null || _a === void 0 ? void 0 : _a.registerNotifyWait((data) => {
            this._notify(data);
        }));
        console.log('connect');
        await this.wirteFeatureWait();
    }
    _notify(data) {
        console.log('Notify : ' + data);
    }
    prepareConnect() {
        this._mesh.onBattery = (battery) => {
            if (typeof this.onBatteryNotify !== 'function') {
                return;
            }
            this.onBatteryNotify(battery);
        };
        this._mesh.onStatusButtonPressed = () => {
            if (typeof this.onStatusButtonNotify !== 'function') {
                return;
            }
            this.onStatusButtonNotify();
        };
    }
    _getCharacteristic(uuid) {
        return this.peripheral
            .getService(this._UUIDS.serviceId)
            .getCharacteristic(uuid);
    }
    async wirteFeatureWait() {
        try {
            if (!this._writeCharacteristic) {
                return;
            }
            if (this._writeCharacteristic === null) {
                return;
            }
        }
        catch (error) {
            console.log(error);
            return;
        }
        await this._writeCharacteristic
            .writeWait(this._mesh.feature(), true)
            .then((resp) => {
            console.log('response: ' + resp);
        });
    }
}
exports.MESH = MESH;
MESH._LocalName = 'MESH-100';
