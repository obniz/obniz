/**
 * @packageDocumentation
 * @module Parts.abstract.services
 */

import BleRemoteService from "../../../../obniz/libs/embeds/bleHci/bleRemoteService";

export default class BleGenericAccess {
  private _service: BleRemoteService;

  constructor(service: BleRemoteService) {
    this._service = service;
  }

  public async getDeviceNameWait(): Promise<string | null> {
    const char = this._service.getCharacteristic("2A00");
    if (!char) {
      return null;
    }
    return await char.readTextWait();
  }
}
