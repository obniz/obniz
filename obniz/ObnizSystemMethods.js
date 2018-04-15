const ObnizComponents = require('./ObnizComponents')

module.exports = class ObnizSystemMethods extends ObnizComponents {

  constructor(id, options) {
    super(id, options)
  }

  wait(msec) {
    if (msec < 0) {
      msec = 0;
    } else if (msec > 60 * 1000) {
      msec = 60 * 1000;
    }
    this.send({ system: { wait: msec } });
    return new Promise(resolve => setTimeout(resolve, msec));
  }

  reset() { this.send({ system: { reset: true } }); this._prepareComponents(); }
  reboot() { this.send({ system: { reboot: true } }); this._prepareComponents(); }
  selfCheck() { this.send({ system: { self_check: true } }); }
  keepWorkingAtOffline(working) { this.send({ system: { keep_working_at_offline: working } }); }
  resetOnDisconnect(reset) { this.send({ ws: { reset_obniz_on_ws_disconnection: reset } }); }

  pingWait(unixtime, rand){
    unixtime = unixtime || new Date().getTime();
    let upper = Math.floor( unixtime / Math.pow(2,32));
    let lower = unixtime - upper * Math.pow(2,32);
    rand = rand || Math.floor(Math.random() * Math.pow(2,4));
    let buf = [];


    buf.push((upper >>> 8*3) & 0xFF);
    buf.push((upper >>> 8*2) & 0xFF);
    buf.push((upper >>> 8*1) & 0xFF);
    buf.push((upper >>> 8*0) & 0xFF);
    buf.push((lower >>> 8*3) & 0xFF);
    buf.push((lower >>> 8*2) & 0xFF);
    buf.push((lower >>> 8*1) & 0xFF);
    buf.push((lower >>> 8*0) & 0xFF);
    buf.push((rand >>> 8*3) & 0xFF);
    buf.push((rand >>> 8*2) & 0xFF);
    buf.push((rand >>> 8*1) & 0xFF);
    buf.push((rand >>> 8*0) & 0xFF);
    this.send({ system: { ping: {key : buf } }});

    return new Promise((resolve)=>{
      let callback = (systemObj) => {
        for(let i =0;i<buf.length;i++){
          if(buf[i] !== systemObj.pong.key[i]){
            return;
          }
        }
        this.removePongObserver(callback);
        let upper = ((systemObj.pong.key[0] << 8 * 3) >>> 0)
            + ((systemObj.pong.key[1] << 8 * 2) >>> 0)
            + ((systemObj.pong.key[2] << 8 * 1) >>> 0)
            + ((systemObj.pong.key[3] << 8 * 0) >>> 0);
        let lower = ((systemObj.pong.key[4] << 8 * 3) >>> 0)
            + ((systemObj.pong.key[5] << 8 * 2) >>> 0)
            + ((systemObj.pong.key[6] << 8 * 1) >>> 0)
            + ((systemObj.pong.key[7] << 8 * 0) >>> 0);
        let obnizJsPingUnixtime = upper * Math.pow(2, 32) + lower;
        let obnizJsPongUnixtime = new Date().getTime();
        let allTime = obnizJsPongUnixtime- obnizJsPingUnixtime;
        let timeJs2server = systemObj.pong.pingServerTime - obnizJsPingUnixtime;
        let timeServer2Obniz = systemObj.pong.obnizTime - systemObj.pong.pingServerTime ;
        let timeObniz2Server = systemObj.pong.pongServerTime- systemObj.pong.obnizTime ;
        let timeServer2Js = obnizJsPongUnixtime - systemObj.pong.pongServerTime ;
        let str = `ping ${allTime}ms (js --[${timeJs2server}ms]--> server --[${timeServer2Obniz}ms]--> obniz --[${timeObniz2Server}ms]--> server --[${timeServer2Js}ms]--> js)`;
        // let str = `ping,${obnizJsPingUnixtime},${systemObj.pong.pingServerTime},${systemObj.pong.obnizTime},${systemObj.pong.pongServerTime}`;


        this.print_debug(str);
        resolve(str);
      };
      this.addPongObserver(callback);
    });
  }
}