import { Obniz } from '../../Obniz';

export class MCP23S08_IO {
  public chip: any;
  public id: any;
  public direction: boolean;
  public value: boolean;

  constructor(chip: any, id: any) {
    this.chip = chip;
    this.id = id;
    this.value = false;
    this.direction = true; // true is input. false is output
  }

  public output(value: any) {
    this.chip.output(this.id, value);
  }

  public async outputWait(value: any) {
    await this.chip.outputWait(this.id, value);
  }

  public async inputWait(obniz: Obniz) {
    return await this.chip.inputWait(this.id);
  }
}
