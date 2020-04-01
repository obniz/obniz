// tslint:disable:max-classes-per-file

export class ObnizError extends Error {
  constructor(public code: number, e?: string) {
    super(e);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype); // for ES3, ES5
  }
}

export class ObnizOfflineError extends ObnizError {
  constructor() {
    super(1, "obniz is not online.");
  }
}

export class ObnizTimeoutError extends ObnizError {
  constructor() {
    super(2, "Receive data timeout.");
  }
}

export class ObnizI2cError extends ObnizError {
  constructor() {
    super(3, "I2C error.");
  }
}

export class ObnizI2cWarning extends ObnizError {
  constructor() {
    super(4, "I2C error.");
  }
}

export class ObnizBleUnknownPeripheralError extends ObnizError {
  constructor(public peripheralUuid: string) {
    super(5, "unknown peripheral :" + peripheralUuid);
  }
}

export class ObnizBleUnknownServiceError extends ObnizError {
  constructor(public peripheralUuid: string, public serviceUuid: string) {
    super(5, "unknown service.  peripheral :" + peripheralUuid + " service :" + serviceUuid);
  }
}

export class ObnizBleUnknownCharacteristicError extends ObnizError {
  constructor(public peripheralUuid: string, public serviceUuid: string, public characteristicUuid: string) {
    super(
      5,
      "unknown characteristic.  peripheral :" +
        peripheralUuid +
        " service :" +
        serviceUuid +
        " characteristic :" +
        characteristicUuid,
    );
  }
}

export class ObnizBleUnknownDescriptorError extends ObnizError {
  constructor(
    public peripheralUuid: string,
    public serviceUuid: string,
    public characteristicUuid: string,
    public descriptorUuid: string,
  ) {
    super(
      5,
      "unknown descriptor.  peripheral :" +
        peripheralUuid +
        " service :" +
        serviceUuid +
        " characteristic :" +
        characteristicUuid +
        " descriptor :" +
        descriptorUuid,
    );
  }
}

export class ObnizBleOpError extends ObnizError {
  constructor() {
    super(5, "BLE operation error");
  }
}
