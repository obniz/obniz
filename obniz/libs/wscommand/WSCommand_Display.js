class WSCommand_Display extends WSCommand {

  constructor(delegate) {
    super(delegate);
    this.module = 8;

    this._CommandClear                    = 0;
    this._CommandPrint                    = 1;
    this._CommandDrawCampusVerticalBytes  = 2;
    this._CommandDrawCampusHorizonalBytes = 3;
    this._CommandDrawIOState              = 4;
    this._CommandSetPinName               = 5;
  }

  // Commands

  clear(params) {
    this.sendCommand(this._CommandClear, null);
  }

  print(buf) {
    this.sendCommand(this._CommandPrint, buf);
  }
  
  printText(text) {
    var result;
    if (isNode) {
      const buf = Buffer(text, 'utf8');
      result = new Uint8Array(buf);
    } else if(TextEncoder){
      result = new Uint8Array(new TextEncoder("utf-8").encode(text));
    }
    this.print(result);
  }

  text(params){
    this.printText(params.text);
  }
  raw(params){
    this.drawHorizonally(new Uint8Array(params.raw));
  }
  
  pinName(params) {
    for (var i = 0; i < 12; i++) {
      if (typeof (params.pin_assign[i]) === "object") {
        this.setPinName(i, params.pin_assign[i].module_name || "?", params.pin_assign[i].pin_name || "?");
      }
    }

  }
  
  drawVertically(buf) {
    this.sendCommand(this._CommandDrawCampusVerticalBytes, buf);
  }

  drawHorizonally(buf) {
    this.sendCommand(this._CommandDrawCampusHorizonalBytes, buf);
  }
  
  drawIOState(val) {
    var buf = new Uint8Array([!val])
    this.sendCommand(this._CommandDrawIOState, buf);
  }
  
  
  setPinName(no, moduleName, pinName ) {
    var str = moduleName.slice(0,4) + " "+ pinName;
    str = str.slice(0,9);

    var buf = new Uint8Array(1);
    buf[0] = no; 

    var stringarray;
    if (isNode) {
      const buf = Buffer(str, 'utf8');
      stringarray = new Uint8Array(buf);
    } else if(TextEncoder){
      stringarray = new Uint8Array(new TextEncoder("utf-8").encode(str));
    }
    var combined = new Uint8Array(buf.length + stringarray.length);
    combined.set(buf, 0);
    combined.set(stringarray, 1);

    this.sendCommand(this._CommandSetPinName, combined);
  }
  
  parseFromJson(json) {
    var module = json["display"];
    if (module === undefined) {
      return;
    }

    let schemaData = [
      {uri : "/request/display/text",  onValid: this.text},
      {uri : "/request/display/clear", onValid: this.clear},
      {uri : "/request/display/raw", onValid: this.raw},
      {uri : "/request/display/pin_assign", onValid: this.pinName},
      {uri : "/request/display/qr"} // nothing to do 
    ];
    let res = this.validateCommandSchema(schemaData, module, "display" );

    if(res.valid === 0){
      if(res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      }else{
        throw new WSCommandNotFoundError(`[display]unknown command`);
      }
    }
  }
}