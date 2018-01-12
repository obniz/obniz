RN42 = function() {

};

RN42.prototype.wired = function(obniz, tx_obniz_to_rn42, rx_obniz_from_rn42, gnd) {
  this.obniz = obniz;

  if(typeof(gnd) == "number") {
    obniz.getIO(gnd).output(false);
  }

  this.uart = obniz.uart0;

  obniz.getIO(tx_obniz_to_rn42).outputType("push-pull3v");
  this.uart.start(tx_obniz_to_rn42, rx_obniz_from_rn42, 9600);
  var self = this;
  this.uart.onreceive = function(data, text) {
    // this is not perfect. separation is possible.
    if (text.indexOf("CONNECT") >= 0) {
      console.log("connected");
    } else if(text.indexOf("DISCONNECT") >= 0) {
      console.log("disconnected");
    }
    if (typeof(self.onreceive) == "function") {
      self.onreceive(data, text);
    }
  }
}

RN42.prototype.send = function(data) {
  this.uart.send(data);
}

RN42.prototype.enterCommandModeWait = async function() {
  this.send('$$$');
  await this.obniz.wait(500);
}

/* configration is under construction */
    // // SM,0 Slave
    // // SH,0200 HID Flag register. Descriptor=keyboard
    // // SA,2 no pin code
    // // SY,FFF4  power -5dbm
    // // SI,0050 inqury scna interval
    // // SJ,0050 pagescan interval
    // // SW,00A0 sniff interval 100ms
    // // SO,I show connection state start with 'I'
RN42.prototype.configWait = async function(json) {
  await this.enterCommandModeWait();
  if (typeof(json) !== "object") {
    // TODO: warning
    return;
  }
  if (json.profile) {
    this.config_profile(json.profile);
  }
  if (json.name) {
    this.config_deviceName(json.name);
  }
  this.config_reboot();
}

RN42.prototype.config_reboot = async function() {
  this.send('R,1');
}

RN42.prototype.config_deviceName = async function(name) {
  this.send('SN,'+name);
}

RN42.prototype.config_profile = async function(id) {
  if (id==="HID") {
    id = 6;
  }
  this.send('S~,'+id);
}
/* configration is under construction */

// Module functions

if (PartsRegistrate) {
  PartsRegistrate("RN42", RN42);
}