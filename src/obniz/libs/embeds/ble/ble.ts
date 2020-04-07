/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.old
 */

import { ComponentAbstract } from "../../ComponentAbstact";
import BleAdvertisement from "./bleAdvertisement";
import BleCharacteristic from "./bleCharacteristic";
import BleDescriptor from "./bleDescriptor";
import BlePeripheral from "./blePeripheral";
import BleRemotePeripheral from "./bleRemotePeripheral";
import BleScan from "./bleScan";
import BleSecurity from "./bleSecurity";
import BleService from "./bleService";

/**
 * Deprecated class.
 * Please update obnizOS >= 3.0.0 and use [[ObnizCore.Components.Ble.Hci]]
 */
export default class ObnizBLE extends ComponentAbstract {
  public static _dataArray2uuidHex(data: any, reverse: any) {
    let uuid: any = [];
    for (let i = 0; i < data.length; i++) {
      uuid.push(("00" + data[i].toString(16).toLowerCase()).slice(-2));
    }
    if (reverse) {
      uuid = uuid.reverse();
    }
    let str: any = uuid.join("");
    if (uuid.length >= 16) {
      str =
        str.slice(0, 8) +
        "-" +
        str.slice(8, 12) +
        "-" +
        str.slice(12, 16) +
        "-" +
        str.slice(16, 20) +
        "-" +
        str.slice(20);
    }
    return str;
  }

  public remotePeripherals: any;
  public service: any;
  public characteristic: any;
  public descriptor: any;
  public peripheral: any;
  public scanTarget: any;
  public advertisement: any;
  public scan: any;
  public security: any;

  constructor(obniz: any) {
    super(obniz);
    this.remotePeripherals = [];

    this.service = BleService;
    this.characteristic = BleCharacteristic;
    this.descriptor = BleDescriptor;
    this.peripheral = new BlePeripheral(obniz);

    this.scanTarget = null;

    this.advertisement = new BleAdvertisement(obniz);
    this.scan = new BleScan(obniz);
    this.security = new BleSecurity(obniz);

    this._scanCallbackBind();
    this._centralCallbackBind();
    this._peripheralCallbackBind();

    this._errorCallbackBind();
    this._reset();
  }

  // dummy
  public async initWait() {}

  public _reset() {}

  public directConnect(uuid: any, addressType: any) {
    throw new Error("directConnect cannot use obnizOS < 3.0.0. Please update obnizOS");
  }

  public async directConnectWait(uuid: any, addressType: any) {
    throw new Error("directConnectWait cannot use obnizOS < 3.0.0. Please update obnizOS");
  }

  public findPeripheral(address: any) {
    for (const key in this.remotePeripherals) {
      if (this.remotePeripherals[key].address === address) {
        return this.remotePeripherals[key];
      }
    }
    return null;
  }

  public schemaBasePath(): string {
    return "ble";
  }

  private _scanCallbackBind() {
    this.on("/response/ble/central/scan", (obj) => {
      let val: any = this.findPeripheral(obj.scan_result.address);
      if (!val) {
        val = new BleRemotePeripheral(this.Obniz, obj.scan_result.address);
        this.remotePeripherals.push(val);
      }
      val.discoverdOnRemote = true;
      val.setParams(obj.scan_result);

      this.scan.notifyFromServer("onfind", val);
    });

    this.on("/response/ble/central/scan_finish", (obj) => {
      this.scan.notifyFromServer("onfinish");
    });
  }

  private _centralCallbackBind() {
    const callback = (obj: any) => {
      const remotePeripheralCallbackFunc: any = (val: any, func: any, type: any) => {
        let target: any = null;
        if (val === undefined) {
          return;
        }
        const p: any = this.findPeripheral(val.address);
        if (!p) {
          return;
        }
        if (type === "peripheral") {
          target = p;
        } else if (type === "service") {
          target = p.findService(val);
        } else if (type === "characteristic") {
          target = p.findCharacteristic(val);
        } else if (type === "descriptor") {
          target = p.findDescriptor(val);
        }
        if (!target) {
          return;
        }
        func(val, target);
      };

      const paramList: any = {
        status_update: { name: "statusupdate", obj: "peripheral" },
        get_service_result: { name: "discover", obj: "peripheral" },
        get_service_result_finish: {
          name: "discoverfinished",
          obj: "peripheral",
        },
        get_characteristic_result: { name: "discover", obj: "service" },
        get_characteristic_result_finish: {
          name: "discoverfinished",
          obj: "service",
        },
        write_characteristic_result: { name: "onwrite", obj: "characteristic" },
        read_characteristic_result: { name: "onread", obj: "characteristic" },
        register_notify_characteristic_result: {
          name: "onregisternotify",
          obj: "characteristic",
        },
        // for typo
        register_nofity_characteristic_result: {
          name: "onregisternotify",
          obj: "characteristic",
        },
        unregister_notify_characteristic_result: {
          name: "onunregisternotify",
          obj: "characteristic",
        },
        // for typo
        unregister_nofity_characteristic_result: {
          name: "onunregisternotify",
          obj: "characteristic",
        },
        notify_characteristic: { name: "onnotify", obj: "characteristic" },
        // for typo
        nofity_characteristic: { name: "onnotify", obj: "characteristic" },
        get_descriptor_result: { name: "discover", obj: "characteristic" },
        get_descriptor_result_finish: {
          name: "discoverfinished",
          obj: "characteristic",
        },
        write_descriptor_result: { name: "onwrite", obj: "descriptor" },
        read_descriptor_result: { name: "onread", obj: "descriptor" },
      };

      for (const paramListKey in paramList) {
        remotePeripheralCallbackFunc(
          obj[paramListKey],
          (val: any, bleobj: any) => {
            bleobj.notifyFromServer(paramList[paramListKey].name, val);
          },
          paramList[paramListKey].obj,
        );
      }
    };
    this.on("/response/ble/central/status_update", callback);
    this.on("/response/ble/central/service_get", callback);
    this.on("/response/ble/central/service_get_finish", callback);
    this.on("/response/ble/central/characteristic_get", callback);
    this.on("/response/ble/central/characteristic_get_finish", callback);
    this.on("/response/ble/central/characteristic_write", callback);
    this.on("/response/ble/central/characteristic_read", callback);
    this.on("/response/ble/central/characteristic_register_notify", callback);
    this.on("/response/ble/central/characteristic_notify", callback);
    this.on("/response/ble/central/characteristic_notify", callback);
    this.on("/response/ble/central/descriptor_get", callback);
    this.on("/response/ble/central/descriptor_get_finish", callback);
    this.on("/response/ble/central/descriptor_write", callback);
    this.on("/response/ble/central/descriptor_read", callback);
  }

  private _peripheralCallbackBind() {
    const callback = (obj: any) => {
      const callbackFunc: any = (val: any, func: any, type: any) => {
        let target: any = null;
        if (val === undefined) {
          return;
        }
        if (type === "peripheral") {
          target = this.peripheral;
        } else if (type === "service") {
          target = this.peripheral.getService(val);
        } else if (type === "characteristic") {
          target = this.peripheral.findCharacteristic(val);
        } else if (type === "descriptor") {
          target = this.peripheral.findDescriptor(val);
        }
        if (!target) {
          return;
        }
        func(val, target);
      };

      if (obj.peripheral) {
        callbackFunc(
          obj.peripheral.connection_status,
          (val: any) => {
            this.peripheral.onconnectionupdates(val);
          },
          "peripheral",
        );

        const centralParamList: any = {
          read_characteristic_result: { name: "onread", obj: "characteristic" },
          write_characteristic_result: { name: "onwrite", obj: "characteristic" },
          notify_read_characteristic: {
            name: "onreadfromremote",
            obj: "characteristic",
          },
          notify_write_characteristic: {
            name: "onwritefromremote",
            obj: "characteristic",
          },
          read_descriptor_result: { name: "onread", obj: "descriptor" },
          write_descriptor_result: { name: "onwrite", obj: "descriptor" },
          notify_read_descriptor: { name: "onreadfromremote", obj: "descriptor" },
          notify_write_descriptor: {
            name: "onwritefromremote",
            obj: "descriptor",
          },
        };

        for (const key in centralParamList) {
          callbackFunc(
            obj.peripheral[key],
            (val: any, bleobj: any) => {
              bleobj.notifyFromServer(centralParamList[key].name, val);
            },
            centralParamList[key].obj,
          );
        }
      }
    };

    this.on("/response/ble/peripheral/status", callback);
    this.on("/response/ble/peripheral/characteristic_read", callback);
    this.on("/response/ble/peripheral/characteristic_write", callback);
    this.on("/response/ble/peripheral/characteristic_notify_read", callback);
    this.on("/response/ble/peripheral/characteristic_notify_write", callback);
    this.on("/response/ble/peripheral/descriptor_read", callback);
    this.on("/response/ble/peripheral/descriptor_write", callback);
    this.on("/response/ble/peripheral/descriptor_notify_read", callback);
    this.on("/response/ble/peripheral/descriptor_notify_write", callback);
  }

  private _errorCallbackBind() {
    this.on("/response/ble/error", (obj) => {
      const params: any = obj.error;
      let handled: any = false;
      let peripheral: any;
      let target: any;
      if (!params.address) {
        peripheral = this.peripheral;
      } else {
        peripheral = this.findPeripheral(params.address);
      }

      if (peripheral) {
        if (params.service_uuid && params.characteristic_uuid && params.descriptor_uuid) {
          target = peripheral.findDescriptor(params);
        } else if (params.service_uuid && params.characteristic_uuid) {
          target = peripheral.findCharacteristic(params);
        } else if (params.service_uuid) {
          target = peripheral.findService(params);
        }
        if (target) {
          target.notifyFromServer("onerror", params);
          handled = true;
        } else {
          peripheral.onerror(params);
          handled = true;
        }
      }

      if ([35, 36, 37, 38, 39].includes(params.function_code)) {
        this.security.onerror(params);
        handled = true;
      }
      if (!handled) {
        this.Obniz.error(
          `ble ${params.message} service=${params.service_uuid} characteristic_uuid=${params.characteristic_uuid} descriptor_uuid=${params.descriptor_uuid}`,
        );
      }
    });
  }
}
