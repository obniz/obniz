let events = require("events");
let util = require("util");

let Smp = require("./smp");

let AclStream = function(
    hci,
    handle,
    localAddressType,
    localAddress,
    remoteAddressType,
    remoteAddress,
) {
  this._hci = hci;
  this._handle = handle;
  this.encypted = false;

  this._smp = new Smp(
      this,
      localAddressType,
      localAddress,
      remoteAddressType,
      remoteAddress,
      this._hci,
  );
};

util.inherits(AclStream, events.EventEmitter);

AclStream.prototype.write = function(cid, data) {
  this._hci.queueAclDataPkt(this._handle, cid, data);
};

AclStream.prototype.push = function(cid, data) {
  if (data) {
    this.emit("data", cid, data);
  } else {
    this.emit("end");
  }
};

AclStream.prototype.pushEncrypt = function(encrypt) {
  this.encrypted = encrypt ? true : false;

  this.emit("encryptChange", this.encrypted);
};

AclStream.prototype.pushLtkNegReply = function() {
  this.emit("ltkNegReply");
};

module.exports = AclStream;
