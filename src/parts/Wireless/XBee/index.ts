/**
 * @packageDocumentation
 * @module Parts.XBee
 */

import Obniz from "../../../obniz";
import PeripheralUART from "../../../obniz/libs/io_peripherals/uart";

import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

export interface XBeeOptions {
  tx: number;
  rx: number;
  gnd?: number;
}

export interface XBeeConfig {
  [key: string]: string;
}

export default class XBee implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "XBee",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  public displayIoNames = { tx: "<tx", rx: ">rx" };
  public currentCommand: any;
  public commands: any;
  public isAtMode: any;
  public onFinishAtModeCallback: any;
  public onreceive?: (data: any, text: string) => void;

  protected obniz!: Obniz;

  private uart!: PeripheralUART;

  constructor() {
    this.keys = ["tx", "rx", "gnd"];
    this.requiredKeys = ["tx", "rx"];
  }

  public wired(obniz: Obniz) {
    this.uart = obniz.getFreeUart();
    this.currentCommand = null;
    this.commands = [];
    this.isAtMode = false;
    this.onFinishAtModeCallback = null;

    if (typeof this.params.gnd === "number") {
      obniz.getIO(this.params.gnd).output(false);
    }

    this.uart.start({
      tx: this.params.tx,
      rx: this.params.rx,
      baud: 9600,
      drive: "3v",
    });

    this.uart.onreceive = (data: any, text: any) => {
      if (this.isAtMode) {
        this.onAtResultsRecieve(data, text);
      } else {
        if (typeof this.onreceive === "function") {
          this.onreceive(data, text);
        }
      }
    };
  }

  public send(data: any) {
    if (this.isAtMode === false) {
      this.uart.send(data);
    } else {
      this.obniz.error("XBee is AT Command mode now. Wait for finish config.");
    }
  }

  public onAtResultsRecieve(data: any, text: any) {
    if (!this.isAtMode) {
      return;
    }

    const next: any = () => {
      this.currentCommand = null;
      this.sendCommand();
    };

    if (text === "OK\r") {
      if (this.currentCommand === "ATCN") {
        this.isAtMode = false;
        this.currentCommand = null;
        if (typeof this.onFinishAtModeCallback === "function") {
          this.onFinishAtModeCallback();
          this.onFinishAtModeCallback = null;
        }
        return;
      }
      next();
    } else if (text === "ERROR\r") {
      this.obniz.error("XBee config error : " + this.currentCommand);
    } else {
      // response of at command.
      console.log("XBEE : no catch message", data);
      next();
    }
  }

  public addCommand(command: any, value?: any) {
    const str: any = command + (value ? " " + value : "");
    this.commands.push(str);
    if (this.isAtMode === true && this.currentCommand === null) {
      this.sendCommand();
    }
  }

  public sendCommand() {
    if (this.isAtMode === true && this.currentCommand === null && this.commands.length > 0) {
      this.currentCommand = "AT" + this.commands.shift();
      this.uart.send(this.currentCommand + "\r");
    }
  }

  public enterAtMode() {
    if (this.currentCommand !== null) {
      return;
    }
    this.isAtMode = true;
    this.obniz.wait(1000);
    const command: any = "+++";
    this.currentCommand = command;
    this.uart.send(this.currentCommand);
    this.obniz.wait(1000);
  }

  public exitAtMode() {
    this.addCommand("CN");
  }

  public async configWait(config: any) {
    if (this.isAtMode) {
      throw new Error("Xbee : duplicate config setting");
    }
    return new Promise((resolve, reject) => {
      const standaloneKeys: any = {
        destination_address_high: "DH",
        destination_address_low: "DL",
        source_address: "MY",
      };
      const highLowKeys: any = ["destination_address"];
      this.enterAtMode();
      for (const key in config) {
        if (key.length === 2) {
          this.addCommand(key, config[key]);
        } else if (standaloneKeys[key]) {
          this.addCommand(standaloneKeys[key], config[key]);
        } else if (highLowKeys.includes(key)) {
          let high: any = config[key].slice(0, -8);
          if (!high) {
            high = "0";
          }
          const low: any = config[key].slice(-8);

          this.addCommand(standaloneKeys[key + "_high"], high);
          this.addCommand(standaloneKeys[key + "_low"], low);
        }
      }
      this.exitAtMode();
      this.onFinishAtModeCallback = () => {
        resolve();
      };
    });
  }
}
