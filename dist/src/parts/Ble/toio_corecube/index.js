"use strict";
/**
 * @packageDocumentation
 * @module Parts.Toio_CoreCube
 */
Object.defineProperty(exports, "__esModule", { value: true });
class Toio_CoreCube {
    constructor(peripheral) {
        this.peripheral = null;
        this.functionButtonPress = null;
        this.functionMotionChange = null;
        this.keys = [];
        this.requiredKeys = [];
        this._uuids = {
            serviceID: "10B20100-5B3B-4571-9508-CF3EFCD7BBAE",
            characteristicIDMotor: "10B20102-5B3B-4571-9508-CF3EFCD7BBAE",
            characteristicIDPos: "10B20101-5B3B-4571-9508-CF3EFCD7BBAE",
            characteristicIDMotion: "10B20106-5B3B-4571-9508-CF3EFCD7BBAE",
            characteristicIDButton: "10B20107-5B3B-4571-9508-CF3EFCD7BBAE",
            characteristicIDBattery: "10B20108-5B3B-4571-9508-CF3EFCD7BBAE",
        };
        this.timeout = 100;
        this._buttonCharacteristic = null;
        this._motionCharacteristic = null;
        this._positionCharacteristic = null;
        this._motorCharacteristic = null;
        this._batteryCharacteristic = null;
        if (peripheral && !Toio_CoreCube.isDevice(peripheral)) {
            throw new Error("peripheral is not RS_Seek3");
        }
        this.peripheral = peripheral;
    }
    static info() {
        return {
            name: "toio_CoreCube",
        };
    }
    static isDevice(peripheral) {
        if (peripheral.localName === "toio Core Cube") {
            return true;
        }
        else {
            return false;
        }
    }
    wired(obniz) { }
    async connectWait(timeout) {
        if (!this.peripheral) {
            throw new Error("RS_Seek3 is not find.");
        }
        this.peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === "function") {
                this.ondisconnect(reason);
            }
        };
        this.timeout = timeout;
        await this.peripheral.connectWait();
        this._buttonCharacteristic = this.peripheral
            .getService(this._uuids.serviceID)
            .getCharacteristic(this._uuids.characteristicIDButton);
        this._motorCharacteristic = this.peripheral
            .getService(this._uuids.serviceID)
            .getCharacteristic(this._uuids.characteristicIDMotor);
        this._motionCharacteristic = this.peripheral
            .getService(this._uuids.serviceID)
            .getCharacteristic(this._uuids.characteristicIDMotion);
        this._positionCharacteristic = this.peripheral
            .getService(this._uuids.serviceID)
            .getCharacteristic(this._uuids.characteristicIDPos);
        this._batteryCharacteristic = this.peripheral
            .getService(this._uuids.serviceID)
            .getCharacteristic(this._uuids.characteristicIDBattery);
        if (this._buttonCharacteristic) {
            if (typeof this.functionButtonPress === "function") {
                this._buttonCharacteristic.registerNotify(this.functionButtonPress);
            }
        }
        if (this._buttonCharacteristic) {
            if (typeof this.functionMotionChange === "function") {
                this._buttonCharacteristic.registerNotify(this.functionMotionChange);
            }
        }
        return 0;
    }
    async disconnectWait() {
        var _a;
        await ((_a = this.peripheral) === null || _a === void 0 ? void 0 : _a.disconnect());
    }
    async getPositionWait() {
        const readData = await this._positionCharacteristic.readWait();
        return {
            // NOTE: toioの中心から見たポジション
            posX: (readData[2] << 8) | readData[1],
            posY: (readData[4] << 8) | readData[3],
            angle: (readData[6] << 8) | readData[5],
            posSensorX: (readData[8] << 8) | readData[7],
            posSensorY: (readData[10] << 8) | readData[9],
            posSensorAngle: (readData[12] << 8) | readData[11],
        };
    }
    async getMotionWait() {
        const readData = await this._motionCharacteristic.readWait();
        return {
            // NOTE: toioの中心から見たポジション
            isHorizon: readData[1] === 1,
            isCollision: readData[2] === 1,
            isDoubletap: readData[3] === 1,
            atitude: readData[4],
        };
    }
    async getButtonStateWait() {
        const readData = await this._buttonCharacteristic.readWait();
        if (readData[1] === 0x80) {
            return true;
        }
        else {
            return false;
        }
    }
    async getBatteryStateWait() {
        const readData = await this._batteryCharacteristic.readWait();
        return readData[0];
    }
    async moveAroundWait(_leftWheelPower = 0, _rightWheelPower = 0) {
        const constraintWheelPower = (wheelPower) => {
            // NOTE: Power is limited belong 0 to 255. And minus value is backward.
            if (wheelPower < -255) {
                wheelPower = -255;
            }
            else if (wheelPower > 255) {
                wheelPower = 255;
            }
            return wheelPower;
        };
        const numWheelDirection = (wheelPower) => {
            // NOTE: 1 is forward. and 2 is backward.
            if (wheelPower >= 0) {
                return 1;
            }
            else if (wheelPower < 0) {
                return 2;
            }
        };
        const leftWheelPower = constraintWheelPower(_leftWheelPower);
        const rightWheelPower = constraintWheelPower(_rightWheelPower);
        const leftWheelDirection = numWheelDirection(leftWheelPower);
        const rightWheelDirection = numWheelDirection(rightWheelPower);
        await this._motorCharacteristic.writeWait([
            1,
            1,
            leftWheelDirection,
            Math.abs(leftWheelPower),
            2,
            rightWheelDirection,
            Math.abs(rightWheelPower),
        ]);
    }
    async movePositionWait(timeoutSec = 5, moveType = 0, maxWheelPower = 30, wheelPowerType = 30, targetPosX = 0, targetPosY = 0, targetAngle = 0) {
        const parceNumber = (pos) => {
            // NOTE: Pos is must hove belong 0 to 65535.
            if (pos > 65535) {
                pos = 65535;
            }
            else if (pos < 0) {
                pos = 0;
            }
            const buffer = new ArrayBuffer(2);
            const dv = new DataView(buffer);
            dv.setUint16(0, pos);
            const obj = {
                value1: dv.getUint8(0),
                value2: dv.getUint8(1),
            };
            return obj;
        };
        const posXObj = parceNumber(targetPosX);
        const posYObj = parceNumber(targetPosY);
        const targetAngleObj = parceNumber(targetAngle);
        await this._motorCharacteristic.writeWait([
            0x03,
            0x00,
            timeoutSec,
            moveType,
            maxWheelPower,
            wheelPowerType,
            0x00,
            posXObj.value2,
            posXObj.value1,
            posYObj.value2,
            posYObj.value1,
            targetAngleObj.value2,
            targetAngleObj.value1,
        ]);
    }
}
exports.default = Toio_CoreCube;
