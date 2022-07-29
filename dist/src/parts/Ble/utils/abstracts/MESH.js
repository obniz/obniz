"use strict";
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../../obniz/ObnizPartsBleAbstract");
const MeshJs_1 = require("../../MESH_js/MeshJs");
class MESH extends ObnizPartsBleAbstract_1.ObnizPartsBleConnectable {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onBatteryNotify = null;
        this.onStatusButtonNotify = null;
        this.onResponseWrite = null;
        this.meshBlock = new MeshJs_1.MeshJs();
        this.indicateCharacteristic_ = null;
        this.notifyCharacteristic_ = null;
        this.writeCharacteristic_ = null;
        this.writeWOResponseCharacteristic_ = null;
    }
    /**
     *
     * @param peripheral
     * @returns
     */
    static isMESHblock(peripheral) {
        const _name = peripheral.localName;
        if (!_name) {
            return false;
        }
        if (_name.length !== MESH.LOCAL_NAME_LENGTH_) {
            return false;
        }
        return this._isMESHblock(_name);
    }
    /**
     *
     * @param peripheral
     * @param serialnumber
     * @returns
     */
    static sameSerialNumberBlock(peripheral, serialnumber) {
        var _a;
        if (!this.isMESHblock(peripheral)) {
            return false;
        }
        return ((_a = peripheral.localName) === null || _a === void 0 ? void 0 : _a.indexOf(serialnumber)) !== -1;
    }
    /**
     * Connect to the services of a MESH
     */
    async connectWait() {
        this.prepareConnect();
        await this.peripheral.connectWait();
        this.indicateCharacteristic_ = this.getCharacteristic_(this.meshBlock.UUIDS.CHARACTERISTICS.INDICATE);
        this.notifyCharacteristic_ = this.getCharacteristic_(this.meshBlock.UUIDS.CHARACTERISTICS.NOTIFY);
        this.writeCharacteristic_ = this.getCharacteristic_(this.meshBlock.UUIDS.CHARACTERISTICS.WRITE);
        this.writeWOResponseCharacteristic_ = this.getCharacteristic_(this.meshBlock.UUIDS.CHARACTERISTICS.WRITE_WO_RESPONSE);
        if (!this.indicateCharacteristic_) {
            return;
        }
        this.indicateCharacteristic_.registerNotify((data) => {
            this.meshBlock.indicate(data);
        });
        if (!this.notifyCharacteristic_) {
            return;
        }
        await this.notifyCharacteristic_.registerNotifyWait((data) => {
            this.meshBlock.notify(data);
        });
        await this.writeWait(this.meshBlock.featureCommand);
    }
    static _isMESHblock(name) {
        return name.indexOf(MESH.PREFIX) === 0;
    }
    prepareConnect() {
        this.meshBlock.onBattery = (battery) => {
            if (typeof this.onBatteryNotify !== 'function') {
                return;
            }
            this.onBatteryNotify(battery);
        };
        this.meshBlock.onStatusButtonPressed = () => {
            if (typeof this.onStatusButtonNotify !== 'function') {
                return;
            }
            this.onStatusButtonNotify();
        };
    }
    async writeWait(data) {
        if (!this.writeCharacteristic_) {
            return;
        }
        await this.writeCharacteristic_.writeWait(data, true).then((resp) => {
            if (typeof this.onResponseWrite !== 'function') {
                return;
            }
            this.onResponseWrite(resp);
        });
    }
    writeWOResponse(data) {
        if (!this.writeWOResponseCharacteristic_) {
            return;
        }
        this.writeWOResponseCharacteristic_.writeWait(data, true);
    }
    getCharacteristic_(uuid) {
        return this.peripheral
            .getService(this.meshBlock.UUIDS.SERVICE_ID)
            .getCharacteristic(uuid);
    }
}
exports.MESH = MESH;
// Constant Values
MESH.AvailableBleMode = 'Connectable';
MESH.LOCAL_NAME_LENGTH_ = 17;
MESH.PREFIX = 'MESH-100';
