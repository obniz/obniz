class WSCommand_System extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 0;

    this._CommandReboot         = 0
    
    this._CommandReset          = 2
    this._CommandSelfCheck      = 3
    this._CommandWait           = 4
    this._CommandResetOnDisconnect = 5
  }

  // Commands

  reboot() {
    this.sendCommand(this._CommandReboot, null);
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
      throw new Error("invalid wait time");
    }
    var buf = new Uint8Array([msec >> 8, msec]);
    this.sendCommand(this._CommandWait, buf);
  }

  resetOnDisconnect(mustReset) {
    var buf = new Uint8Array([mustReset ? 1 : 0]);
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
}
