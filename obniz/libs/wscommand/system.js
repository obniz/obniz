class WSCommand_System extends WSCommand {

  constructor() {
    super();
    this.module = 0;

    this._CommandReboot         = 0
    this._CommandUpdateFirmware = 1
    this._CommandReset          = 2
    this._CommandSelfCheck      = 3
    this._CommandWait           = 4
    this._CommandResetOnDisconnect = 5
  }

  // Commands

  reboot() {
    this.sendCommand(this._CommandReboot, null);
  }

  update_firmware(firmware) {
    this.sendCommand(this._CommandUpdateFirmware, firmware);
  }

  reset() {
    this.sendCommand(this._CommandReset, null);
  }

  selfCheck() {
    this.sendCommand(this._CommandSelfCheck, null);
  }

  wait(msec) {
    msec = parseInt(msec);
    if(isNaN(msec)) {
      return;
    }
    var buf = new Uint8Array(2);
    buf[0] = msec >> 8;
    buf[1] = msec
    this.sendCommand(this._CommandWait, buf);
  }

  resetOnDisconnect(mustReset) {
    var buf = new Uint8Array(1);
    buf[0] = mustReset ? 1 : 0;
    this.sendCommand(this._CommandResetOnDisconnect, buf);
  }

  parseFromJson(json) {
    var module = json["system"];
    if (typeof(module) == "object") {
      if (module.reboot) {
        this.reboot();
      }
      if (module.reset) {
        this.reset();
      }
      if (module.self_check) {
        this.selfCheck();
      }
      if (typeof module.wait === "number") {
        this.wait(module.wait);
      }
      if (typeof(module.keep_working_at_offline) === "boolean") {
        this.resetOnDisconnect(!module.keep_working_at_offline);
      }
    }
  }

  notifyFromBinary(objToSend, module, func, payload) {

  }
}
