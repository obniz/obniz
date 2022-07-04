"use strict";
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
const ObnizPartsBleAbstract_1 = require("../../../../obniz/ObnizPartsBleAbstract");
const MESH_parse_1 = require("../../MESH_parse");
class MESH extends ObnizPartsBleAbstract_1.ObnizPartsBleConnectable {
    constructor() {
        super(...arguments);
        this._parser = new MESH_parse_1.MESH_parse();
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
    }
    static isMESHblock(peripheral) {
        if (!peripheral.localName) {
            return false;
        }
        return peripheral.localName.indexOf(this.localName) !== -1;
    }
    /**
     * Connect to the services of a device
     *
     * デバイスのサービスに接続
     */
    async connectWait() {
        // await super.connectWait();
        await this.peripheral.connectWait();
        this._indicateCharacteristic = this._getCharacteristic(this._UUIDS.characteristicIndicate);
        this._notifyCharacteristic = this._getCharacteristic(this._UUIDS.characteristicNotify);
        this._writeCharacteristic = this._getCharacteristic(this._UUIDS.characteristicWrite);
        this._writeWOCharacteristic = this._getCharacteristic(this._UUIDS.characteristicWriteWO);
        if (!this._indicateCharacteristic) {
            return;
        }
        if (typeof this.wirteFeatureWait !== 'function') {
            return;
        }
        await this._indicateCharacteristic.registerNotify((data) => {
            console.log('data : ' + data);
        });
        console.log('connect');
    }
    _getCharacteristic(uuid) {
        return this.peripheral
            .getService(this._UUIDS.serviceId)
            .getCharacteristic(uuid);
    }
    async wirteFeatureWait(data) {
        console.log('register notify : ' + data);
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
            .writeWait(this._parser.parseFeature(), true)
            .then((resp) => {
            console.log('response: ' + resp);
        });
    }
}
exports.MESH = MESH;
MESH.localName = 'MESH-100';
