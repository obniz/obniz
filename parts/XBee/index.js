/* global PartsRegistrate */

class XBee {

  constructor() {

  }

  wired(obniz, tx_obniz_to_xbee, rx_xbee_to_obniz) {
  
    this.obniz = obniz;
    this.uart = obniz.uart0;
    this.currentCommand = null;
    this.commands = [];
    this.isAtMode = false;
    this.onFinishAtModeCallback = null;
    
    obniz.getIO(tx_obniz_to_xbee).drive("3v");
    this.uart.start(tx_obniz_to_xbee, rx_xbee_to_obniz, 9600, null, 8);
    
    this.uart.onreceive = (function(data, text) {
      console.log("XBEE RECIEVE : " + text);
      if(this.isAtMode){
        this.onAtResultsRecieve(data, text);
      }else{
        if (typeof(this.onreceive) === "function") {
          this.onreceive(data, text);
        }
      }
    }).bind(this);
  }

  send( text) {
    if(this.isAtMode === false){
      this.uart.send(text);
      
    }else{
      obniz.error("XBee is AT Command mode now. Wait for finish config.");
    }
  }

  onAtResultsRecieve(data, text){
    if(!this.isAtMode){ return; }
    
    var next = function(){
      this.currentCommand  = null;
      this.sendCommand();
    }.bind(this);
    
    if(text === "OK\r"){
      if(this.currentCommand === "ATCN"){
        this.isAtMode = false;
        this.currentCommand  = null;
        if(typeof(this.onFinishAtModeCallback) === "function"){
          this.onFinishAtModeCallback();
          this.onFinishAtModeCallback = null;
        }
        return;
      }
      next();
    }else if(text === "ERROR\r"){
      this.obniz.error("XBee config error : " + this.currentCommand);
    }else{
      //response of at command.
      console.log("XBEE : no catch message", data);
      next();
    }
  }

  addCommand(command, value) {
    var str = command + (value ? " " + value : "");
    this.commands.push(str);
    if(this.isAtMode === true 
        && this.currentCommand === null){
      this.sendCommand();
    }
  }

  sendCommand() {
    if(this.isAtMode === true 
        && this.currentCommand === null
        && this.commands.length > 0){
      this.currentCommand = "AT" + this.commands.shift();
      this.uart.send(this.currentCommand + "\r");
    }
  }

  enterAtMode() {
    if(this.currentCommand !== null) return;
    this.isAtMode = true;
    this.obniz.freeze(1000);
    var command = "+++";
    this.currentCommand = command;
    this.uart.send(this.currentCommand);
    this.obniz.freeze(1000);
  }

  exitAtMode() {
    this.addCommand("CN");
  }

  async configWait(config) {
    if(this.isAtMode){ throw new Error("Xbee : duplicate config setting"); };
    return new Promise(function(resolve, reject){
      var standaloneKeys = {
        "destination_address_high" : "DH",
        "destination_address_low" : "DL",
        "source_address" : "MY",
      };
      var highLowKeys = [
        "destination_address",
      ];
      this.enterAtMode();
      for(var key in config){
          if(key.length === 2){
            this.addCommand(key,config[key]);
          }else if(standaloneKeys[key]){
            this.addCommand(standaloneKeys[key],config[key]);
          }else if(highLowKeys.includes(key)){
            var high = config[key].slice(0,-8); 
            if(!high){high="0";}
            var low = config[key].slice(-8);
  
            this.addCommand(standaloneKeys[key + "_high"], high);
            this.addCommand(standaloneKeys[key + "_low"],  low);
          }
      }
      this.exitAtMode();
      this.onFinishAtModeCallback = function(){
        resolve();
      };
    }.bind(this));
    
  }
}

if (PartsRegistrate) {
  PartsRegistrate("XBee", XBee);
}  