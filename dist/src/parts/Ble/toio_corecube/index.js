"use strict";
/**
 * @packageDocumentation
 * @module Parts.Toio_CoreCube
 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
/** Toio_CoreCube management class Toio_CoreCubeを管理するクラス */
class Toio_CoreCube {
    constructor(peripheral) {
        this.peripheral = null;
        this.functionButtonPress = null;
        this.functionMotionChange = null;
        this.keys = [];
        this.requiredKeys = [];
        this._uuids = {
            serviceID: '10B20100-5B3B-4571-9508-CF3EFCD7BBAE',
            characteristicIDMotor: '10B20102-5B3B-4571-9508-CF3EFCD7BBAE',
            characteristicIDPos: '10B20101-5B3B-4571-9508-CF3EFCD7BBAE',
            characteristicIDMotion: '10B20106-5B3B-4571-9508-CF3EFCD7BBAE',
            characteristicIDButton: '10B20107-5B3B-4571-9508-CF3EFCD7BBAE',
            characteristicIDBattery: '10B20108-5B3B-4571-9508-CF3EFCD7BBAE',
        };
        this.timeout = 100;
        this._buttonCharacteristic = null;
        this._motionCharacteristic = null;
        this._positionCharacteristic = null;
        this._motorCharacteristic = null;
        this._batteryCharacteristic = null;
        if (peripheral && !Toio_CoreCube.isDevice(peripheral)) {
            throw new Error('peripheral is not Toio_CoreCube');
        }
        this.peripheral = peripheral;
    }
    static info() {
        return {
            name: 'toio_CoreCube',
        };
    }
    /**
     * Verify that the received peripheral is from the Toio_CoreCube
     *
     * 受け取ったPeripheralがToio_CoreCubeのものかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Whether it is the Toio_CoreCube
     *
     * Toio_CoreCubeかどうか
     */
    static isDevice(peripheral) {
        var _a;
        // if (peripheral.localName === 'toio Core Cube') {
        if (((_a = peripheral.localName) === null || _a === void 0 ? void 0 : _a.indexOf('toio Core Cube')) !== -1) {
            return true;
        }
        else {
            return false;
        }
    }
    wired(obniz) {
        // do nothing.
    }
    /**
     * Connect to the device
     *
     * デバイスに接続
     *
     * @param timeout (not used)
     *
     * @returns
     */
    async connectWait(timeout) {
        if (!this.peripheral) {
            throw new Error('Toio_CoreCube is not find.');
        }
        this.peripheral.ondisconnect = (reason) => {
            if (typeof this.ondisconnect === 'function') {
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
            if (typeof this.functionButtonPress === 'function') {
                this._buttonCharacteristic.registerNotify(this.functionButtonPress);
            }
        }
        if (this._buttonCharacteristic) {
            if (typeof this.functionMotionChange === 'function') {
                this._buttonCharacteristic.registerNotify(this.functionMotionChange);
            }
        }
        return 0;
    }
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    async disconnectWait() {
        var _a;
        await ((_a = this.peripheral) === null || _a === void 0 ? void 0 : _a.disconnectWait());
    }
    /**
     * Get the absolute position and angle of Toio_CoreCube
     *
     * (For more detail, please see https://toio.github.io/toio-spec/docs/ble_id )
     *
     * Toio_CoreCubeが存在している絶対位置や角度を取得
     *
     * (詳細は https://toio.github.io/toio-spec/docs/ble_id を参照してください。)
     *
     * @returns absolute position data 絶対位置データ
     *
     * ```
     * {
     *
     * posX: X coordinate value of the center of the cube キューブ中心のx座標 (Position ID),
     *
     * posY: Y coordinate value of the center of the cube キューブ中心のY座標 (Position ID),
     *
     * angle: angle value of the center of the cube キューブの角度 (Range 範囲: 0~360 deg),
     *
     * posSensorX: X coordinate value of the identification sensor 読み取りセンサーのX座標 (Position ID),
     *
     * posSensorY: Y coordinate value of the identification sensor 読み取りセンサーのY座標 (Position ID),
     *
     * posSensorAngle: angle value of the identification sensor 読み取りセンサーの角度 (Range 範囲: 0~360 deg)
     *
     * }
     * ```
     */
    async getPositionWait() {
        const readData = await this._positionCharacteristic.readWait();
        return {
            posX: (readData[2] << 8) | readData[1],
            posY: (readData[4] << 8) | readData[3],
            angle: (readData[6] << 8) | readData[5],
            posSensorX: (readData[8] << 8) | readData[7],
            posSensorY: (readData[10] << 8) | readData[9],
            posSensorAngle: (readData[12] << 8) | readData[11],
        };
    }
    /**
     * Get motion detection data from the Toio_CoreCube
     *
     * Toio_CoreCubeからのモーション検出データを取得
     *
     * @returns motion detection data モーション検出データ
     *
     * ```
     * {
     *
     * isHorizon: horizontal or not 水平かどうか,
     *
     * isCollision: detect collision or not 衝突検知したかどうか,
     *
     * isDoubletap: detect double tap or not ダブルタップ検出したかどうか,
     *
     * attitude: posture 姿勢
     *
     * (1: top faces upward 天面が上, 2: bottom faces upward 底面が上, 3: rear side faces upward 背面が上, 4: front side faces upward 正面が上. 5: right side faces upward 右側面が上, 6: left side faces upward 左側面が上)
     *
     * }
     * ```
     */
    async getMotionWait() {
        const readData = await this._motionCharacteristic.readWait();
        return {
            isHorizon: readData[1] === 1,
            isCollision: readData[2] === 1,
            isDoubletap: readData[3] === 1,
            attitude: readData[4],
        };
    }
    /**
     * Get button state from the Toio_CoreCube
     *
     * Toio_CoreCubeのボタンの状態を取得
     *
     * @returns Whether the button is pressed
     *
     * ボタンが押されたかどうか
     */
    async getButtonStateWait() {
        const readData = await this._buttonCharacteristic.readWait();
        if (readData[1] === 0x80) {
            return true;
        }
        else {
            return false;
        }
    }
    /**
     * Get the remaining battery power of the Toio_CoreCube
     *
     * Toio_CoreCubeのバッテリー残量を取得
     *
     * @returns remaining battery power バッテリー残量
     *
     * Range 範囲 0~100 (Unit 単位: 10 %)
     */
    async getBatteryStateWait() {
        const readData = await this._batteryCharacteristic.readWait();
        return readData[0];
    }
    /**
     * Turn the wheel to move the Toio_CoreCube
     *
     * タイヤを回してToio_CoreCubeを動かす
     *
     * @param _leftWheelPower left wheel power 左側のタイヤ出力 (Range 範囲: -255~255)
     *
     * a positive value rotates forward, a negative value rotates backward
     *
     * 正の値は前方、負の値は後方へ回転
     *
     * @param _rightWheelPower right wheel power 左側のタイヤ出力 (Range 範囲: -255~255)
     *
     * a positive value rotates forward, a negative value rotates backward
     *
     * 正の値は前方、負の値は後方へ回転
     */
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
    /**
     * Directs the Toio_CoreCube to the specified Position ID
     *
     * (For more detail, please see https://toio.github.io/toio-spec/en/docs/ble_motor/#motor-control-with-target-specified )
     *
     * Toio_CoreCubeを指定したPosition IDへ移動
     *
     * (詳細は https://toio.github.io/toio-spec/docs/ble_motor#%E7%9B%AE%E6%A8%99%E6%8C%87%E5%AE%9A%E4%BB%98%E3%81%8D%E3%83%A2%E3%83%BC%E3%82%BF%E3%83%BC%E5%88%B6%E5%BE%A1 を参照してください)
     *
     * @param timeoutSec timeout タイムアウト (Unit 単位: 1 sec)
     *
     * @param moveType method of movement 移動タイプ
     *
     * (0: move while rotating 回転しながら移動, 1: move while rotating without moving backwards 後退せず回転しながら移動, 2: move after rotating 回転してから移動)
     *
     * @param maxWheelPower maximum motor speed モーターの最大速度 (Range 範囲 10~255)
     *
     * @param wheelPowerType speed change type 速度変化タイプ
     *
     * (0: constant 速度一定, 1: gradual acceleration 徐々に加速, 2: gradual deceleration 徐々に減速, 3: accelerate to the midpoint and decelerate to the target point 中間地点まで加速し目標地点まで減速)
     *
     * @param targetPosX target point X coordinates 目標地点のX座標 ([Position ID](https://toio.github.io/toio-spec/docs/hardware_position_id))
     *
     * Range 範囲: 0~65535 (65535: same as for write operation 書き込み操作時と同じ)
     *
     * @param targetPosY target point Y coordinates 目標地点のY座標 ([Position ID](https://toio.github.io/toio-spec/docs/hardware_position_id))
     *
     * Range 範囲: 0~65535 (65535: same as for write operation 書き込み操作時と同じ)
     *
     * @param targetAngle angle of the cube at the target point 目標地点でのキューブの角度
     */
    async movePositionWait(timeoutSec = 5, moveType = 0, maxWheelPower = 30, wheelPowerType = 0, targetPosX = 0, targetPosY = 0, targetAngle = 0) {
        const parseNumber = (pos) => {
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
        const posXObj = parseNumber(targetPosX);
        const posYObj = parseNumber(targetPosY);
        const targetAngleObj = parseNumber(targetAngle);
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
