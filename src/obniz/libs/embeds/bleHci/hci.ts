/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
export default class ObnizBLEHci {
  public Obniz: any;

  constructor(Obniz: any) {
    this.Obniz = Obniz;
  }

  /**
   * Initialize BLE HCI module
   */
  public init() {
    this.Obniz.send({
      ble: {
        hci: {
          initialize: true,
        },
      },
    });
  }

  /**
   * Deinitalize BLE HCI module
   */
  public end() {
    this.Obniz.send({
      ble: {
        hci: null,
      },
    });
  }

  /**
   * write HCI command to HCI module
   * @param hciCommand
   */
  public write(hciCommand: number[]) {
    this.Obniz.send({
      ble: {
        hci: {
          write: hciCommand,
        },
      },
    });
  }

  /**
   * @ignore
   * @param obj
   */
  public notified(obj: any) {
    if (obj.read && obj.read.data) {
      this.onread(obj.read.data);
    }
  }

  /**
   * Callback on HCI command received.
   * @param data
   */
  public onread(data: any) {}
}
