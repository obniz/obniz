class WSCommand_Switch extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 9;

    this._CommandNotifyValue  = 0
    this._CommandOnece        = 1
  }

  // Commands

  onece() {
    var buf = new Uint8Array(0);
    this.sendCommand(this._CommandOnece, buf);
  }

  parseFromJson(json) {
    var module = json["switch"];
    if (typeof(module) === "string") {
      if (module === "get") {
        this.onece();
      } else {
        throw new Error("switch: unknown command:"+module)
      }
    }
  }
  
  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandNotifyValue && payload.byteLength == 1) {
      var state = parseInt(payload[0]);
      var states = [
        "none",
        "push",
        "left",
        "right"
      ]
      objToSend["switch"] = {
        state: states[state]
      };
      objToSend["switch"].action = "get"
    } else {
      super.notifyFromBinary(objToSend, func, payload)
    }
  }
}