/**
 * @packageDocumentation
 * @module Parts.Toio_CoreCube
 */
import Obniz from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
export interface Toio_CoreCubeOptions {
}
/** Toio_CoreCube management class Toio_CoreCubeを管理するクラス */
export default class Toio_CoreCube implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
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
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    peripheral: BleRemotePeripheral | null;
    functionButtonPress: ((value: number) => void) | null;
    functionMotionChange: ((value: number) => void) | null;
    ondisconnect?: (reason: any) => void;
    keys: string[];
    requiredKeys: string[];
    ioKeys?: string[];
    params: any;
    private _uuids;
    private timeout;
    private _buttonCharacteristic;
    private _motionCharacteristic;
    private _positionCharacteristic;
    private _motorCharacteristic;
    private _batteryCharacteristic;
    constructor(peripheral: BleRemotePeripheral | null);
    wired(obniz: Obniz): void;
    /**
     * Connect to the device
     *
     * デバイスに接続
     *
     * @param timeout (not used)
     *
     * @returns
     */
    connectWait(timeout: number): Promise<number>;
    /**
     * Disconnect from the sensor
     *
     * センサから切断
     */
    disconnectWait(): Promise<void>;
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
    getPositionWait(): Promise<{
        posX: number;
        posY: number;
        angle: number;
        posSensorX: number;
        posSensorY: number;
        posSensorAngle: number;
    }>;
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
    getMotionWait(): Promise<{
        isHorizon: boolean;
        isCollision: boolean;
        isDoubletap: boolean;
        attitude: number;
    }>;
    /**
     * Get button state from the Toio_CoreCube
     *
     * Toio_CoreCubeのボタンの状態を取得
     *
     * @returns Whether the button is pressed
     *
     * ボタンが押されたかどうか
     */
    getButtonStateWait(): Promise<boolean>;
    /**
     * Get the remaining battery power of the Toio_CoreCube
     *
     * Toio_CoreCubeのバッテリー残量を取得
     *
     * @returns remaining battery power バッテリー残量
     *
     * Range 範囲 0~100 (Unit 単位: 10 %)
     */
    getBatteryStateWait(): Promise<number>;
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
    moveAroundWait(_leftWheelPower?: number, _rightWheelPower?: number): Promise<void>;
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
    movePositionWait(timeoutSec?: number, moveType?: number, maxWheelPower?: number, wheelPowerType?: number, targetPosX?: number, targetPosY?: number, targetAngle?: number): Promise<void>;
}
