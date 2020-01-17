import Obniz from "../../../obniz";
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface OMRON_2JCIEOptions { }
class OMRON_2JCIE implements ObnizPartsInterface {

  public static info(): ObnizPartsInfo {
    return {
      name: "2JCIE",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public periperal: any;
  public obniz!: Obniz;

  constructor() {
    this.keys = [];
    this.requiredKeys = [];
    this.periperal = null;
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;
  }

  public async findWait() {
    const target: any = {
      localName: "Env",
    };

    this.periperal = await this.obniz.ble!.scan.startOneWait(target);

    return this.periperal;
  }

  public omron_uuid(uuid: any) {
    return `0C4C${uuid}-7700-46F4-AA96D5E974E32A54`;
  }

  public async connectWait() {
    if (!this.periperal) {
      await this.findWait();
    }
    if (!this.periperal) {
      throw new Error("2JCIE not found");
    }
    if (!this.periperal.connected) {
      await this.periperal.connectWait();
    }
  }

  public async disconnectWait() {
    if (this.periperal && this.periperal.connected) {
      this.periperal.disconnectWait();
    }
  }

  public signedNumberFromBinary(data: any) {
    // little adian
    let val: any = data[data.length - 1] & 0x7f;
    for (let i = data.length - 2; i >= 0; i--) {
      val = val * 256 + data[i];
    }
    if ((data[data.length - 1] & 0x80) !== 0) {
      val = val - Math.pow(2, data.length * 8 - 1);
    }
    return val;
  }

  public unsignedNumberFromBinary(data: any) {
    // little adian
    let val: any = data[data.length - 1];
    for (let i = data.length - 2; i >= 0; i--) {
      val = val * 256 + data[i];
    }
    return val;
  }

  public async getLatestData() {
    await this.connectWait();

    const c: any = this.periperal
      .getService(this.omron_uuid("3000"))
      .getCharacteristic(this.omron_uuid("3001"));
    const data: any = await c.readWait();
    const json: any = {
      row_number: data[0],
      temperature: this.signedNumberFromBinary(data.slice(1, 3)) * 0.01,
      relative_humidity: this.signedNumberFromBinary(data.slice(3, 5)) * 0.01,
      light: this.signedNumberFromBinary(data.slice(5, 7)) * 1,
      uv_index: this.signedNumberFromBinary(data.slice(7, 9)) * 0.01,
      barometric_pressure: this.signedNumberFromBinary(data.slice(9, 11)) * 0.1,
      soud_noise: this.signedNumberFromBinary(data.slice(11, 13)) * 0.01,
      discomfort_index: this.signedNumberFromBinary(data.slice(13, 15)) * 0.01,
      heatstroke_risk_factor:
        this.signedNumberFromBinary(data.slice(15, 17)) * 0.01,
      battery_voltage:
        this.unsignedNumberFromBinary(data.slice(17, 19)) * 0.001,
    };

    return json;
  }
}

export default OMRON_2JCIE;
