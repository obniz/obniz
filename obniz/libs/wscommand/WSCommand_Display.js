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

  clear() {
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
      result = new Uint8Array(new TextEncoder("utf-8").encode(data));
    }
    this.print(result);
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
      const buf = Buffer(text, 'utf8');
      stringarray = new Uint8Array(buf);
    } else if(TextEncoder){
      stringarray = new Uint8Array(new TextEncoder("utf-8").encode(data));
    }
    var combined = new Uint8Array(buf.length + stringarray.length);
    combined.set(buf, 0);
    combined.set(stringarray, 1);

    this.sendCommand(this._CommandSetPinName, combined);
  }
  
  parseFromJson(json) {
    var module = json["display"];
    if (typeof(module) != "object") {
      return;
    }
    if (module.clear) {
      this.clear();
    }
    if (typeof module.text == "string") {
      this.printText(module.text);
    } else if(module.text) {
      throw new Error("display: text must be string");
    }
    if (module.raw) {
      if (module.raw.length === 1024) {
        this.drawHorizonally(new Uint8Array(module.raw));
      } else {
        throw new Error("raw should 1024 byte");
      }
    }
    if (typeof module.qr == "object") {
      this.qr(module.qr.text, module.qr.correction);
    } else if(module.qr) {
      throw new Error("display: qr must be object");
    }
    
    if (typeof module.pin_assign === "object") {
      for(var i=0;i<12;i++){
        if(typeof (module.pin_assign[i]) === "object"){
          this.setPinName(i, module.pin_assign[i].module_name ||"?",module.pin_assign[i].pin_name ||"?" );
        }
      }
    }
  }
}