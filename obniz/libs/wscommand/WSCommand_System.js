class WSCommand_System extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 0;

    this._CommandReboot         = 0
    
    this._CommandReset          = 2
    this._CommandSelfCheck      = 3
    this._CommandWait           = 4
    this._CommandResetOnDisconnect = 5

    this._CommandVCC            = 9
  }

  // Commands

  reboot(params) {
    this.sendCommand(this._CommandReboot, null);
  }

  reset(params) {
    this.sendCommand(this._CommandReset, null);
  }

  selfCheck(params) {
    this.sendCommand(this._CommandSelfCheck, null);
  }

  wait(params) {
    let msec = params.wait;
    var buf = new Uint8Array([msec >> 8, msec]);
    this.sendCommand(this._CommandWait, buf);
  }
  keepWorkingAtOffline(params){
    this.resetOnDisconnect(!params.keep_working_at_offline);

  }
  resetOnDisconnect(mustReset) {
    var buf = new Uint8Array([mustReset ? 1 : 0]);
    this.sendCommand(this._CommandResetOnDisconnect, buf);
  }

  parseFromJson(json) {
    var module = json["system"];
    if(module === undefined){
      return;
    }

    let schemaData = [
      {uri : "/request/system/reboot",               onValid: this.reboot},
      {uri : "/request/system/reset",                onValid: this.reset},
      {uri : "/request/system/wait",                 onValid: this.wait},
      {uri : "/request/system/selfCheck",            onValid: this.selfCheck},
      {uri : "/request/system/keepWorkingAtOffline", onValid: this.keepWorkingAtOffline},
      {uri : "/request/system/ping"},
    ];
    let res = this.validateCommandSchema(schemaData, module, "system");

    if(res.valid === 0){
      if(res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      }else{
        throw new WSCommandNotFoundError(`[system]unknown command`);
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    switch(func) {
      case this._CommandVCC:
        if (payload.byteLength === 3) {
          let value = (payload[1] << 8) + payload[2];
          value = value / 100.0;
          this.envelopWarning(objToSend, 'debug', { message: `Low Voltage ${value}v. connect obniz to more powerful USB.` })
        }
        break;

      default:
        super.notifyFromBinary(objToSend, func, payload);
        break;
    }
  }
}
