class ObnizBLEHci {
  constructor(Obniz) {
    this.Obniz = Obniz;
  }

  write(hciCommand) {
    this.Obniz.send({
      ble: {
        hci: {
          write: hciCommand,
        },
      },
    });
  }

  notified(obj) {
    if (obj.read && obj.read.data) {
      this.onread(obj.read.data);
    }
  }

  onread() {}
}

module.exports = ObnizBLEHci;
