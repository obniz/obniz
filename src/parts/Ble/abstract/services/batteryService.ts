/**
 * @packageDocumentation
 * @module Parts.abstract.services
 */

import BleRemoteService from "../../../../obniz/libs/embeds/bleHci/bleRemoteService";

export default class BleBatteryService {
  private _service: BleRemoteService;

  constructor(service: BleRemoteService) {
    this._service = service;
  }

  public async getBatteryLevel(): Promise<number | null> {
    const char = this._service.getCharacteristic("2A19");
    if (!char) {
      return null;
    }
    return await char.readNumberWait();
  }
}
