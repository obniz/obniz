import { MESH_js } from '.';
export class MESH_js_BU extends MESH_js {
  // event handler
  public onSinglePressed: (() => void) | null = null;
  public onLongPressed: (() => void) | null = null;
  public onDoublePressed: (() => void) | null = null;

  private readonly DATA_LENGTH: number = 4;
  private readonly MessageTypeID: number = 1;
  private readonly EventTypeID: number = 0;
  private readonly TYPE = { SINGLE: 1, LONG: 2, DOUBLE: 3 } as const;

  public notify(data: number[]): void {
    super.notify(data);
    if (data.length !== this.DATA_LENGTH) {
      return;
    }
    if (data[0] !== this.MessageTypeID) {
      return;
    }
    if (data[1] !== this.EventTypeID) {
      return;
    }
    switch (data[2]) {
      case this.TYPE.SINGLE:
        if (typeof this.onSinglePressed === 'function') {
          this.onSinglePressed();
        }
        break;
      case this.TYPE.LONG:
        if (typeof this.onLongPressed === 'function') {
          this.onLongPressed();
        }
        break;
      case this.TYPE.DOUBLE:
        if (typeof this.onDoublePressed === 'function') {
          this.onDoublePressed();
        }
        break;
      default:
        break;
    }
  }
}
