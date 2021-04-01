/**
 * @packageDocumentation
 * @module Parts.Toio_CoreCube
 */
import Obniz from "../../../obniz";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface Toio_CoreCubeOptions {
}
export default class Toio_CoreCube implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
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
    connectWait(timeout: number): Promise<number>;
    disconnectWait(): Promise<void>;
    getPositionWait(): Promise<{
        posX: number;
        posY: number;
        angle: number;
        posSensorX: number;
        posSensorY: number;
        posSensorAngle: number;
    }>;
    getMotionWait(): Promise<{
        isHorizon: boolean;
        isCollision: boolean;
        isDoubletap: boolean;
        atitude: number;
    }>;
    getButtonStateWait(): Promise<boolean>;
    getBatteryStateWait(): Promise<number>;
    moveAroundWait(_leftWheelPower?: number, _rightWheelPower?: number): Promise<void>;
    movePositionWait(timeoutSec?: number, moveType?: number, maxWheelPower?: number, wheelPowerType?: number, targetPosX?: number, targetPosY?: number, targetAngle?: number): Promise<void>;
}
