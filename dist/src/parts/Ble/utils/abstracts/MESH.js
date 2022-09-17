"use strict";
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.MeshRequestId = exports.MESH = void 0;
const ObnizPartsBleAbstract_1 = require("../../../../obniz/ObnizPartsBleAbstract");
const Base_1 = require("./MESHjs/block/Base");
class MESH extends ObnizPartsBleAbstract_1.ObnizPartsBleConnectable {
    /**
     * Create new instance of MESH
     *
     * @param peripheral
     */
    constructor(peripheral) {
        super(peripheral, 'Connectable');
        // Event Handler
        this.onBatteryLevel = null;
        this.onStatusButtonPressed = null;
        this.onWriteResponse = null;
        this.TIMEOUT_MSEC = 5000;
        this.meshBlock = new Base_1.Base();
        this.requestId = new MeshRequestId();
        this.indicateCharacteristic_ = null;
        this.notifyCharacteristic_ = null;
        this.writeCharacteristic_ = null;
        this.writeWOResponseCharacteristic_ = null;
    }
    /**
     * Check MESH block
     *
     * @param peripheral
     * @param opt_serialnumber
     * @returns
     */
    static isMESHblock(peripheral, opt_serialnumber = '') {
        return Base_1.Base.isMESHblock(peripheral.localName, opt_serialnumber);
    }
    /**
     * Connect to the services of MESH
     *
     * @returns
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
        this.meshBlock.checkVersion();
    }
    /**
     * Control statusbar LED
     *
     * @param power
     * @param red
     * @param green
     * @param blue
     */
    setStatusbarLed(power, red, green, blue) {
        const command = this.meshBlock.createStatusbarLedCommand(power, red, green, blue);
        this.writeWOResponse(command);
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
    /**
     * defaultId
     *
     * @returns
     */
    defaultId() {
        return this.DEFAULT_ID_;
    }
    /**
     * next
     *
     * @returns
     */
    next() {
        this.currentId_ = (this.currentId_ % this.MAX_ID_) + 1;
        return this.currentId_;
    }
    /**
     * isDefaultId
     *
     * @param id
     * @returns
     */
    isDefaultId(id) {
        return id === this.DEFAULT_ID_;
    }
    /**
     * isReceived
     *
     * @param id
     * @returns
     */
    isReceived(id) {
        const _index = this.pool_.findIndex((element) => element === id);
        if (_index === -1) {
            return false;
        }
        this.pool_.splice(_index, 1);
        return true;
        // return id === this.receivedId_;
    }
    /**
     * received
     *
     * @param id
     */
    received(id) {
        this.pool_.push(id);
        // this.receivedId_ = id;
    }
}
exports.MeshRequestId = MeshRequestId;
