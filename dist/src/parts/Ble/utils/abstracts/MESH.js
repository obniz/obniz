"use strict";
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../../obniz/ObnizPartsBleAbstract");
const MeshJs_1 = require("../../MESH_js/MeshJs");
class MESH extends ObnizPartsBleAbstract_1.ObnizPartsBleConnectable {
    constructor() {
        super(...arguments);
        // Event Handler
        this.onBatteryLevel = null;
        this.onStatusButtonPressed = null;
        this.onWriteResponse = null;
        this.meshBlock = new MeshJs_1.MeshJs();
        this.requestId = new MeshRequestId();
        this.indicateCharacteristic_ = null;
        this.notifyCharacteristic_ = null;
        this.writeCharacteristic_ = null;
        this.writeWOResponseCharacteristic_ = null;
    }
    /**
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral, opt_serialnumber = '') {
        const _name = peripheral.localName;
        if (!_name) {
            return false;
        }
        if (_name.length !== MESH.LOCAL_NAME_LENGTH_) {
            return false;
        }
        if (opt_serialnumber !== '' && _name.indexOf(opt_serialnumber) === -1) {
            return false;
        }
        return this._isMESHblock(_name);
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
        this.meshBlock.onBatteryLevel = (battery) => {
            if (typeof this.onBatteryLevel !== 'function') {
                return;
            }
            this.onBatteryLevel(battery);
        };
        this.meshBlock.onStatusButtonPressed = () => {
            if (typeof this.onStatusButtonPressed !== 'function') {
                return;
            }
            this.onStatusButtonPressed();
        };
    }
    async writeWait(data) {
        if (!this.writeCharacteristic_) {
            return;
        }
        await this.writeCharacteristic_.writeWait(data, true).then((resp) => {
            if (typeof this.onWriteResponse !== 'function') {
                return;
            }
            this.onWriteResponse(resp);
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
class MeshRequestId {
    constructor() {
        this.MAX_ID_ = 255;
        this.DEFAULT_ID_ = 0;
        this.pool_ = [];
        this.currentId_ = this.DEFAULT_ID_;
    }
    // private receivedId_: number = this.DEFAULT_ID_;
    defaultId() {
        return this.DEFAULT_ID_;
    }
    next() {
        this.currentId_ = (this.currentId_ % this.MAX_ID_) + 1;
        // console.log('send ' + this.currentId_);
        return this.currentId_;
    }
    isDefaultId(id) {
        return id === this.DEFAULT_ID_;
    }
    isReceived(id) {
        const _index = this.pool_.findIndex((element) => element === id);
        if (_index === -1) {
            return false;
        }
        this.pool_.splice(_index, 1);
        return true;
        // return id === this.receivedId_;
    }
    received(id) {
        this.pool_.push(id);
        // console.log(this.pool_);
        // this.receivedId_ = id;
    }
}
exports.MeshRequestId = MeshRequestId;
