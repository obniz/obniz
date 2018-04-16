

const emitter = require("eventemitter3");
class BleScan {
  constructor(Obniz) {
    this.scanTarget  = null;
    this.Obniz = Obniz;
    this.emitter = new emitter();

    this.scanedPeripherals = [];
  }


  start(target,  settings) {
    var obj = {};
    obj["ble"] = {};
    obj["ble"]["scan"] = {
  //    "targetUuid" : settings && settings.targetUuid ? settings.targetUuid : null,
  //    "interval" : settings && settings.interval ? settings.interval : 30,
      "duration" : settings && settings.duration ? settings.duration : 30
      
    };

    this.scanTarget = target;
    if(this.scanTarget && this.scanTarget.uuids && Array.isArray(this.scanTarget.uuids)){
      this.scanTarget.uuids = this.scanTarget.uuids.map((elm)=>{ return elm.toLowerCase() ;});
    }
    this.scanedPeripherals = [];
    this.Obniz.send(obj);
    return;
  }

  startWait(target, settings) {
    return new Promise.race([
      new Promise((resolve)=>{
        this.emitter.once("onfind",(param)=>{
          resolve(param);
        });
      }),
      new Promise((resolve)=>{
        this.emitter.once("onfinish",(param)=>{
          resolve(null);
        });

        this.start(target, settings);
      })
    ]);

  }

  end() {
    var obj = {};
    obj["ble"] = {};
    obj["ble"]["scan"] = null;
    this.Obniz.send(obj);
  }

  isTarget(peripheral){
    if(this.scanTarget && this.scanTarget.localName && peripheral.localName() !== this.scanTarget.localName){
      return false;
    }
    if(this.scanTarget && this.scanTarget.uuids){
      let uuids = peripheral.advertisementServiceUuids();
      for(let uuid of this.scanTarget.uuids){
        if(!uuids.includes(uuid)){
          return false;
        }
      }
    }
    return true;
  }


  onfinish(){} //dummy
  onfind(){} //dummy

  notifyFromServer(notifyName, params){
    switch(notifyName){
      case "onfind" : {
        if(this.isTarget(params)) {
          this.scanedPeripherals.push(params);
          this.emitter.emit(notifyName, params);
          this.onfind(params);
        }
        break;
      }
      case "onfinish" : {
        this.emitter.emit(notifyName, this.scanedPeripherals);
        this.onfinish(this.scanedPeripherals);
        break;
      }
    }



  }
}


module.exports = BleScan;