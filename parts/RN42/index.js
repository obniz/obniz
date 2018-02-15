var RN42 = function() {
  this.keys = ["tx", "rx", "gnd"];
  this.requiredKeys = ["tx", "rx"];
};

RN42.prototype.wired = function(obniz) {
  if(obniz.isValidIO(this.params.gnd)) {
    obniz.getIO(this.params.gnd).output(false);
  }

  this.uart = obniz.getFreeUart();

  obniz.getIO(this.params.tx).drive("3v");
  this.uart.start({tx:this.params.tx, rx:this.params.rx, baud:115200});
  var self = this;
  this.uart.onreceive = function(data, text) {
    // this is not perfect. separation is possible.
    if (text.indexOf("CONNECT") >= 0) {
      console.log("connected");
    } else if(text.indexOf("DISCONNECT") >= 0) {
      console.log("disconnected");
    }
    if (typeof(self.onreceive) === "function") {
      self.onreceive(data, text);
    }
  };
};

RN42.prototype.send = function(data) {
  this.uart.send(data);
};

RN42.prototype.sendCommand = function(data) {
  this.uart.send(data+'\n');
  this.obniz.freeze(100);
};

RN42.prototype.enterCommandMode = function() {
  this.send('$$$');
  this.obniz.freeze(100);
};

RN42.prototype.config = function(json) {
  this.enterCommandMode();
  if (typeof(json) !== "object") {
    // TODO: warning
    return;
  }
  // remove noize data
  this.sendCommand("");

  if (json.master_slave) {
    this.config_masterslave(json.master_slave);
  }
  if (json.auth) {
    this.config_auth(json.auth);
  }
  if (json.hid_flag) {
    this.config_HIDflag(json.hid_flag);
  }
  if (json.profile) {
    this.config_profile(json.profile);
  }
  if (json.power) {
    this.config_power(json.power);
  }
  if (json.display_name) {
    this.config_displayName(json.display_name);
  }
  this.config_reboot();
};

RN42.prototype.config_reboot = function() {
  this.sendCommand('R,1');
};

RN42.prototype.config_masterslave = function(mode) {
  var val = -1;
  if (typeof(mode) === "number") {
    val = mode;
  } else if (typeof(mode) === "string") {
    var modes = ["slave", "master", "trigger", "auto-connect-master", "auto-connect-dtr", "auto-connect-any", "pairing"];
    for (var i=0; i<modes.length; i++) {
      if (modes[i] === mode) {
        val = i;
        break;
      }
    }
  }
  if (val === -1) {
    // TODO: warning
    return;
  }
  this.sendCommand('SM,'+val);
};

RN42.prototype.config_displayName = function(name) {
  this.sendCommand('SN,'+name);
};

    // // SH,0200 HID Flag register. Descriptor=keyboard
RN42.prototype.config_HIDflag = function(flag) {
  this.sendCommand('SH,'+flag);
};

RN42.prototype.config_profile = function(mode) {
  var val = -1;
  if (typeof(mode) === "number") {
    val = mode;
  } else if (typeof(mode) === "string") {
    var modes = ["SPP", "DUN-DCE", "DUN-DTE", "MDM-SPP", "SPP-DUN-DCE", "APL", "HID"];
    for (var i=0; i<modes.length; i++) {
      if (modes[i] === mode) {
        val = i;
        break;
      }
    }
  }
  if (val === -1) {
    // TODO: warning
    return;
  }
  this.sendCommand('S~,'+val);
};

RN42.prototype.config_revert_localecho = function() {
  this.sendCommand('+');
};

RN42.prototype.config_auth = function(mode) {
  var val = -1;
  if (typeof(mode) === "number") {
    val = mode;
  } else if (typeof(mode) === "string") {
    var modes = ["open", "ssp-keyboard", "just-work", "pincode"];
    for (var i=0; i<modes.length; i++) {
      if (modes[i] === mode) {
        val = i;
        break;
      }
    }
  }
  if (val === -1) {
    // TODO: warning
    return;
  }
  this.sendCommand('SA,'+val);
};

RN42.prototype.config_power = function(dbm) {
  
  var val = "0010";
  if (16 > dbm && dbm >= 12) {
    val = "000C";
  } else if (12 > dbm && dbm >= 8) {
    val = "0008";
  } else if (8 > dbm && dbm >= 4) {
    val = "0004";
  } else if (4 > dbm && dbm >= 0) {
    val = "0000";
  } else if (0 > dbm && dbm >= -4) {
    val = "FFFC";
  } else if (-4 > dbm && dbm >= -8) {
    val = "FFF8";
  } else if (-8 > dbm) {
    val = "FFF4";
  }

  this.sendCommand('SY,'+val);
};

RN42.prototype.config_get_setting = function() {
  this.sendCommand('D');
};

RN42.prototype.config_get_extendSetting = function() {
  this.sendCommand('E');
};

// Module functions

if (PartsRegistrate) {
  PartsRegistrate("RN42", RN42);
}