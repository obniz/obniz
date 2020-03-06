/**
 * @packageDocumentation
 * @module Parts.Keyestudio_HT16K33
 */

import Obniz from "../../../obniz";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
import MatrixLED_HT16K33, { MatrixLED_HT16K33Options } from "../../Display/MatrixLED_HT16K33";

export interface Keyestudio_HT16K33Options extends MatrixLED_HT16K33Options {}

export default class Keyestudio_HT16K33 extends MatrixLED_HT16K33 {
  public static info(): ObnizPartsInfo {
    return {
      name: "Keyestudio_HT16K33",
    };
  }

  private bitArray: number[] = [7, 0, 1, 2, 3, 4, 5, 6];

  public wired(obniz: Obniz) {
    super.wired(obniz);
    super.init(8);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    const imageData = ctx.getImageData(0, 0, this.width, this.height);
    const data = imageData.data;
    for (let i = 0; i < this.height; i++) {
      this.vram[i] = 0;
      for (let j = 0; j < this.width; j++) {
        const pos = i * this.height * 4 + j * 4;
        const brightness = 0.34 * data[pos] + 0.5 * data[pos + 1] + 0.16 * data[pos + 2];
        if (brightness > 0x7f) {
          this.vram[i] |= 0x1 << this.bitArray[j];
        }
      }
    }
    super.writeVram();
  }

  public dots(data: number[]) {
    for (let i = 0; i < this.height; i++) {
      this.vram[i] = 0;
      for (let j: number = 0; j < this.width; j++) {
        if (data[i] & (1 << j)) {
          this.vram[i] |= 0x1 << this.bitArray[j];
        }
      }
    }
    super.writeVram();
  }
}
