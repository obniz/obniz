class WSCommand_AD extends WSCommand {
  
  constructor(delegate) {
    super(delegate);
    this.module = 7;

    this._CommandInitNormalInterval     = 0
    this._CommandDeinit       = 1
    this._CommandNotifyValue  = 2
    this._CommandDoOnece      = 3
  }

  // Commands


  get(params, no){
    var buf = new Uint8Array([no]);
    this.sendCommand(params.stream ? this._CommandInitNormalInterval : this._CommandDoOnece, buf);

  }

  deinit(params, no) {
    var buf = new Uint8Array([no]);
    this.sendCommand(this._CommandDeinit, buf);
  }



  parseFromJson(json) {
    for (var i=0; i<12;i++) {
      var module = json["ad"+i];
      if (module === undefined) {
        continue;
      }

      let schemaData = [
        {uri : "/request/ad/deinit",         onValid: this.deinit},
        {uri : "/request/ad/get",          onValid: this.get},
      ];
      let res = this.validateCommandSchema(schemaData, module, "ad"+i, i);

      if(res.valid === 0){
        if(res.invalidButLike.length > 0) {
          throw new Error(res.invalidButLike[0].message);
        }else{
          throw new WSCommandNotFoundError(`[ad${i}]unknown command`);
        }
      }
    }
  }

  notifyFromBinary(objToSend, func, payload) {
    if (func === this._CommandNotifyValue) {
      for (var i=0; i<payload.byteLength; i+=3) {
        var value = (payload[i+1] << 8) + payload[i+2];
        value = value / 100.0;
        objToSend["ad"+payload[i]] = value;
      }
    } else {
      super.notifyFromBinary(objToSend, func, payload)
    }
  }
}
