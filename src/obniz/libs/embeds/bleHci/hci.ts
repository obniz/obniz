/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
export default class ObnizBLEHci {
  public Obniz: any;

  constructor(Obniz: any) {
    this.Obniz = Obniz;
  }

  public write(hciCommand: any) {
    this.Obniz.send({
      ble: {
        hci: {
          write: hciCommand,
        },
      },
    });
  }

  public notified(obj: any) {
    if (obj.read && obj.read.data) {
      this.onread(obj.read.data);
    }
  }

  public onread(data: any) {
  }
}
