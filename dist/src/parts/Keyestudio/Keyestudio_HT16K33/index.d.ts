/**
 * @packageDocumentation
 * @module Parts.Keyestudio_HT16K33
 */
import Obniz from '../../../obniz';
import { ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
import MatrixLED_HT16K33, { MatrixLED_HT16K33Options } from '../../Display/MatrixLED_HT16K33';
export declare type Keyestudio_HT16K33Options = MatrixLED_HT16K33Options;
export default class Keyestudio_HT16K33 extends MatrixLED_HT16K33 {
    static info(): ObnizPartsInfo;
    private bitArray;
    wired(obniz: Obniz): void;
    draw(ctx: CanvasRenderingContext2D): void;
    dots(data: number[]): void;
}
