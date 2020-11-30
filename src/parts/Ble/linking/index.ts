/**
 * @packageDocumentation
 * @module Parts.Linking
 */

/* ------------------------------------------------------------------
 * node-linking - linking.js
 *
 * Copyright (c) 2017-2019, Futomi Hatano, All rights reserved.
 * Released under the MIT license
 * Date: 2019-10-24
 * ---------------------------------------------------------------- */

import Obniz from "../../../obniz";
import bleRemotePeripheral from "../../../obniz/libs/embeds/bleHci/bleRemotePeripheral";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

import LinkingAdvertising from "./modules/advertising";
import LinkingDevice from "./modules/device";

export interface LinkingOptions {}

export default class Linking {
  public static info(): ObnizPartsInfo {
    return {
      name: "Linking",
    };
  }

  public onadvertisement: any;
  public ondiscover: any;
  public PRIMARY_SERVICE_UUID_LIST = ["b3b3690150d34044808d50835b13a6cd", "fe4e"];
  public _discover_status: any;
  public _discover_wait: any;
  public _discover_timer: any;
  public _peripherals: any;
  public initialized = false;

  public keys: string[];
  public requiredKeys: string[];
  public periperal: bleRemotePeripheral | null;
  public obniz!: Obniz;

  public get LinkingAdvertising() {
    return LinkingAdvertising;
  }

  public get LinkingDevice() {
    return LinkingDevice;
  }

  constructor(params: any) {
    this.keys = [];
    this.requiredKeys = [];
    this.periperal = null;

    this.onadvertisement = null;
    this.ondiscover = null;

    // Private properties
    this._discover_status = false;
    this._discover_wait = 3000; // ms
    this._discover_timer = null;
    this._peripherals = {};
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
  }

  public async init() {
    await this.obniz.ble!.initWait();
    this.initialized = true;
  }

  public discover(p: any): Promise<any[]> {
    this._checkInitialized();

    let duration = 5000;
    let name_filter = "";
    let id_filter = "";
    let quick = false;
    if (p && typeof p === "object") {
      if ("duration" in p && typeof p.duration === "number") {
        duration = p.duration;
        if (duration < 1000) {
          duration = 1000;
        }
      }
      if ("nameFilter" in p && typeof (p.nameFilter === "string")) {
        name_filter = p.nameFilter;
      }
      if ("idFilter" in p && typeof (p.idFilter === "string")) {
        id_filter = p.idFilter;
      }
      if ("quick" in p && typeof (p.quick === "boolean")) {
        quick = p.quick;
      }
    }

    return new Promise((resolve, reject) => {
      let timer: any = null;
      const finishDiscovery = () => {
        if (timer) {
          clearTimeout(timer);
        }
        this.stopScan();
        const device_list = [];
        for (const addr in this._peripherals) {
          device_list.push(this._peripherals[addr]);
        }
        resolve(device_list);
      };
      this._peripherals = {};
      this.obniz.ble!.scan.onfind = (peripheral: bleRemotePeripheral) => {
        const dev = this._discoveredDevice(peripheral, name_filter, id_filter);
        if (quick && dev) {
          finishDiscovery();
          return;
        }
      };
      this._scanDevices();
      this._discover_status = true;
      timer = setTimeout(() => {
        finishDiscovery();
      }, duration);
    });
  }

  public _checkInitialized() {
    if (this.initialized === false) {
      throw new Error("The `init()` method has not been called yet.");
      return;
    }
    if (this._discover_status === true) {
      throw new Error("The `discover()` or the `startScan()` method is in progress.");
      return;
    }
  }

  public _discoveredDevice(peripheral: bleRemotePeripheral, name_filter: any, id_filter: any) {
    if (!peripheral.localName) {
      return null;
    }
    // if (!peripheral.id) {
    //   return null;
    // }
    if (name_filter && peripheral.localName.indexOf(name_filter) !== 0) {
      return null;
    }
    // if (id_filter && peripheral.id.indexOf(id_filter) !== 0) {
    //   return null;
    // }
    const addr = peripheral.address;
    if (this._peripherals[addr]) {
      return null;
    }
    const device = new LinkingDevice(peripheral);
    if (this.ondiscover && typeof this.ondiscover === "function") {
      this.ondiscover(device);
    }
    this._peripherals[addr] = device;
    return device;
  }

  public _scanDevices() {
    this.obniz.ble!.scan.onfinish = () => {
      // console.log("scan timeout!")
      this._discover_status = false;
    };
    // var target = {
    //   uuids: this.PRIMARY_SERVICE_UUID_LIST
    // };
    this.obniz.ble!.scan.startWait();
    this._discover_status = true;
  }

  public stopScan() {
    if (this._discover_status === true) {
      this._discover_status = false;
      if (this._discover_timer !== null) {
        clearTimeout(this._discover_timer);
        this._discover_timer = null;
      }
      this.obniz.ble!.scan.endWait();
    }
  }

  public startScan(p: any) {
    this._checkInitialized();
    let name_filter = "";
    let id_filter = "";
    if (p && typeof p === "object") {
      if ("nameFilter" in p && typeof (p.nameFilter === "string")) {
        name_filter = p.nameFilter;
      }
      if ("idFilter" in p && typeof (p.idFilter === "string")) {
        id_filter = p.idFilter;
      }
    }

    this.obniz.ble!.scan.onfind = (peripheral: bleRemotePeripheral) => {
      if (!peripheral.localName) {
        return;
      }
      if (name_filter && peripheral.localName.indexOf(name_filter) !== 0) {
        return;
      }
      // TODO
      // if (id_filter && peripheral.id.indexOf(id_filter) !== 0) {
      //   return;
      // }
      if (typeof this.onadvertisement === "function") {
        const parsed = LinkingAdvertising.parse(peripheral);
        if (parsed) {
          this.onadvertisement(parsed);
        }
      }
    };

    this._scanDevices();
  }
}
