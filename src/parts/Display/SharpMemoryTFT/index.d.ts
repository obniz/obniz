import { DisplayCommon } from '../../../obniz/libs/embeds/display_common';
export interface SharpMemoryTFTOptions {
  vcc?: number;
  gnd?: number;
  vcc_a?: number;
  gnd_a?: number;
  sclk: number;
  mosi: number;
  cs: number;
  disp?: number;
  extcomin?: number;
  extmode?: number;
  width: number;
  height: number;
}

export interface SharpMemoryTFT extends DisplayCommon {}
