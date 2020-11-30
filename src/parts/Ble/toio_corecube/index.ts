/**
 * @packageDocumentation
 * @module Parts.Toio_CoreCube
 */

import Obniz from "../../../obniz";
import BleRemoteCharacteristic from "../../../obniz/libs/embeds/bleHci/bleRemoteCharacteristic";
import BleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface Toio_CoreCubeOptions {}

export default class Toio_CoreCube implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "toio_CoreCube",
    };
  }

  public static isDevice(peripheral: BleRemotePeripheral) {
    if (peripheral.localName === "toio Core Cube") {
      return true;
    } else {
      return false;
    }
  }

  public peripheral: BleRemotePeripheral | null = null;
  public functionButtonPress: ((value: number) => void) | null = null;
  public functionMotionChange: ((value: number) => void) | null = null;

  public ondisconnect?: (reason: any) => void;

  public keys: string[] = [];
  public requiredKeys: string[] = [];
  public ioKeys?: string[];
  public params: any;

  private _uuids = {
    serviceID: "10B20100-5B3B-4571-9508-CF3EFCD7BBAE",
    characteristicIDMotor: "10B20102-5B3B-4571-9508-CF3EFCD7BBAE",
    characteristicIDPos: "10B20101-5B3B-4571-9508-CF3EFCD7BBAE",
    characteristicIDMotion: "10B20106-5B3B-4571-9508-CF3EFCD7BBAE",
    characteristicIDButton: "10B20107-5B3B-4571-9508-CF3EFCD7BBAE",
    characteristicIDBattery: "10B20108-5B3B-4571-9508-CF3EFCD7BBAE",
  };

  private timeout: number = 100;
  private _buttonCharacteristic: BleRemoteCharacteristic | null = null;
  private _motionCharacteristic: BleRemoteCharacteristic | null = null;
  private _positionCharacteristic: BleRemoteCharacteristic | null = null;
  private _motorCharacteristic: BleRemoteCharacteristic | null = null;
  private _batteryCharacteristic: BleRemoteCharacteristic | null = null;

  constructor(peripheral: BleRemotePeripheral | null) {
    if (peripheral && !Toio_CoreCube.isDevice(peripheral)) {
      throw new Error("peripheral is not RS_Seek3");
    }
    this.peripheral = peripheral;
  }

  public wired(obniz: Obniz): void {}

  public async connectWait(timeout: number) {
    if (!this.peripheral) {
      throw new Error("RS_Seek3 is not find.");
    }
    this.peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === "function") {
        this.ondisconnect(reason);
      }
    };

    this.timeout = timeout;

    await this.peripheral.connectWait();

    this._buttonCharacteristic = this.peripheral
      .getService(this._uuids.serviceID)!
      .getCharacteristic(this._uuids.characteristicIDButton);
    this._motorCharacteristic = this.peripheral
      .getService(this._uuids.serviceID)!
      .getCharacteristic(this._uuids.characteristicIDMotor);
    this._motionCharacteristic = this.peripheral
      .getService(this._uuids.serviceID)!
      .getCharacteristic(this._uuids.characteristicIDMotion);
    this._positionCharacteristic = this.peripheral
      .getService(this._uuids.serviceID)!
      .getCharacteristic(this._uuids.characteristicIDPos);
    this._batteryCharacteristic = this.peripheral
      .getService(this._uuids.serviceID)!
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

  public async disconnectWait() {
    await this.peripheral?.disconnect();
  }

  public async getPositionWait() {
    const readData = await this._positionCharacteristic!.readWait();

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

  public async getMotionWait() {
    const readData = await this._motionCharacteristic!.readWait();

    return {
      // NOTE: toioの中心から見たポジション
      isHorizon: readData[1] === 1,
      isCollision: readData[2] === 1,
      isDoubletap: readData[3] === 1,
      atitude: readData[4],
    };
  }

  public async getButtonStateWait() {
    const readData = await this._buttonCharacteristic!.readWait();
    if (readData[1] === 0x80) {
      return true;
    } else {
      return false;
    }
  }

  public async getBatteryStateWait() {
    const readData = await this._batteryCharacteristic!.readWait();
    return readData[0];
  }

  public async moveAroundWait(_leftWheelPower: number = 0, _rightWheelPower: number = 0) {
    const constraintWheelPower = (wheelPower: number) => {
      // NOTE: Power is limited belong 0 to 255. And minus value is backward.
      if (wheelPower < -255) {
        wheelPower = -255;
      } else if (wheelPower > 255) {
        wheelPower = 255;
      }
      return wheelPower;
    };

    const numWheelDirection = (wheelPower: number) => {
      // NOTE: 1 is forward. and 2 is backward.
      if (wheelPower >= 0) {
        return 1;
      } else if (wheelPower < 0) {
        return 2;
      }
    };

    const leftWheelPower: number = constraintWheelPower(_leftWheelPower);
    const rightWheelPower: number = constraintWheelPower(_rightWheelPower);
    const leftWheelDirection = numWheelDirection(leftWheelPower);
    const rightWheelDirection = numWheelDirection(rightWheelPower);

    await this._motorCharacteristic!.writeWait([
      1,
      1,
      leftWheelDirection,
      Math.abs(leftWheelPower),
      2,
      rightWheelDirection,
      Math.abs(rightWheelPower),
    ]);
  }

  public async movePositionWait(
    timeoutSec: number = 5,
    moveType: number = 0,
    maxWheelPower: number = 30,
    wheelPowerType: number = 30,
    targetPosX: number = 0,
    targetPosY: number = 0,
    targetAngle: number = 0,
  ) {
    const parceNumber = (pos: number) => {
      // NOTE: Pos is must hove belong 0 to 65535.
      if (pos > 65535) {
        pos = 65535;
      } else if (pos < 0) {
        pos = 0;
      }

      const buffer = new ArrayBuffer(2);
      const dv = new DataView(buffer);
      dv.setUint16(0, pos);

      interface ValTrans {
        value1: number;
        value2: number;
      }

      const obj: ValTrans = {
        value1: dv.getUint8(0),
        value2: dv.getUint8(1),
      };

      return obj;
    };

    const posXObj = parceNumber(targetPosX);
    const posYObj = parceNumber(targetPosY);
    const targetAngleObj = parceNumber(targetAngle);

    await this._motorCharacteristic!.writeWait([
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
