/**
 * @packageDocumentation
 * @ignore
 */
import { JsonBinaryConverter } from './jsonBinaryConverter';
import { WSCommandAbstract } from './WSCommandAbstract';

export class WSCommandWiFi extends WSCommandAbstract {
  public module: number;
  public _CommandScan: number;

  constructor() {
    super();
    this.module = 14;

    this._CommandScan = 0;
  }

  public scan(params: any, index: any) {
    this.sendCommand(this._CommandScan, null);
  }

  public parseFromJson(json: any) {
    const module = json.wifi;
    if (module === undefined) {
      return;
    }

    const schemaData = [{ uri: '/request/wifi/scan', onValid: this.scan }];
    const res = this.validateCommandSchema(schemaData, module, 'wifi');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[network]unknown command`);
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: number, payload: Uint8Array) {
    switch (func) {
      case this._CommandScan: {
        enum ScanState {
          SCAN_SSID_LEN,
          SCAN_SSID,
          SCAN_MAC,
          SCAN_RSSI,
        }

        let mode: ScanState = ScanState.SCAN_SSID_LEN;
        let tmpIndex = 0;
        let ssid = '';
        let macAddress = '';
        let rssi = 0;
        const scanArray = [];
        for (let i = 0; i < payload.length; i++) {
          switch (mode) {
            case ScanState.SCAN_SSID_LEN:
              tmpIndex = payload[i];
              mode = ScanState.SCAN_SSID;
              break;
            case ScanState.SCAN_SSID:
              ssid += String.fromCharCode(payload[i]);
              tmpIndex--;
              if (tmpIndex === 0) {
                mode = ScanState.SCAN_MAC;
                tmpIndex = 0;
              }
              break;
            case ScanState.SCAN_MAC:
              macAddress += String.fromCharCode(payload[i]);
              tmpIndex++;
              if (tmpIndex === 12) {
                mode = ScanState.SCAN_RSSI;
              }
              break;
            case ScanState.SCAN_RSSI:
              rssi = JsonBinaryConverter.signedNumberFromBinary([payload[i]]);
              mode = ScanState.SCAN_SSID_LEN;
              scanArray.push({
                ssid,
                macAddress,
                rssi,
              });
              ssid = '';
              macAddress = '';
              rssi = 0;
              break;
          }
        }
        objToSend.wifi = {
          scan: scanArray,
        };
        break;
      }
    }
  }
}
