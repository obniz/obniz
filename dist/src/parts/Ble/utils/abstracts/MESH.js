"use strict";
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../../obniz/ObnizPartsBleAbstract");
const MESH_js_1 = require("../../MESH_js");
class MESH extends ObnizPartsBleAbstract_1.ObnizPartsBleConnectable {
    constructor() {
        super(...arguments);
        // event handler
        this.onBatteryNotify = null;
        this.onStatusButtonNotify = null;
        this.onResponseWrite = null;
        this._mesh = new MESH_js_1.MESH_js();
        this._indicateCharacteristic = null;
        this._notifyCharacteristic = null;
        this._writeCharacteristic = null;
        this._writeWOResponseCharacteristic = null;
    }
    static isMESHblock(peripheral) {
        const _name = peripheral.localName;
        if (!_name) {
            return false;
        }
        if (_name.length !== MESH.LOCAL_NAME_LENGTH) {
            return false;
        }
        return this._isMESHblock(_name);
    }
    static sameSirialNumberBlock(peripheral, sirialnumber) {
        var _a;
        if (!this.isMESHblock(peripheral)) {
            return false;
        }
        return ((_a = peripheral.localName) === null || _a === void 0 ? void 0 : _a.indexOf(sirialnumber)) !== -1;
    }
    /**
     * Connect to the services of a MESH
     */
    async connectWait() {
        this.prepareConnect();
        await this.peripheral.connectWait();
        this._indicateCharacteristic = this._getCharacteristic(this._mesh.UUIDS.characteristics.Indicate);
        this._notifyCharacteristic = this._getCharacteristic(this._mesh.UUIDS.characteristics.Notify);
        this._writeCharacteristic = this._getCharacteristic(this._mesh.UUIDS.characteristics.Write);
        this._writeWOResponseCharacteristic = this._getCharacteristic(this._mesh.UUIDS.characteristics.WriteWOResponse);
        if (!this._indicateCharacteristic) {
            return;
        }
        this._indicateCharacteristic.registerNotify((data) => {
            this._mesh.indicate(data);
        });
        if (!this._notifyCharacteristic) {
            return;
        }
        await this._notifyCharacteristic.registerNotifyWait((data) => {
            this._mesh.notify(data);
        });
        console.log('connect');
        await this._writeFeatureWait();
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH._LocalName) === 0;
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
    async writeWait(data) {
        if (!this._writeCharacteristic) {
            return;
        }
        await this._writeCharacteristic.writeWait(data, true).then((resp) => {
            if (typeof this.onResponseWrite !== 'function') {
                return;
            }
            this.onResponseWrite(resp);
        });
    }
    writeWOResponse(data) {
        if (!this._writeWOResponseCharacteristic) {
            return;
        }
        this._writeWOResponseCharacteristic.writeWait(data, true);
    }
    _getCharacteristic(uuid) {
        return this.peripheral
            .getService(this._mesh.UUIDS.serviceId)
            .getCharacteristic(uuid);
    }
    async _writeFeatureWait() {
        await this.writeWait(this._mesh.feature);
    }
}
exports.MESH = MESH;
MESH.AvailableBleMode = 'Connectable';
MESH._LocalName = 'MESH-100';
MESH.LOCAL_NAME_LENGTH = 17;
