"use strict";
/**
 * @packageDocumentation
 * @module Parts.Keyestudio_HT16K33
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const MatrixLED_HT16K33_1 = __importDefault(require("../../Display/MatrixLED_HT16K33"));
class Keyestudio_HT16K33 extends MatrixLED_HT16K33_1.default {
    constructor() {
        super(...arguments);
        this.bitArray = [7, 0, 1, 2, 3, 4, 5, 6];
    }
    static info() {
        return {
            name: 'Keyestudio_HT16K33',
        };
    }
    wired(obniz) {
        super.wired(obniz);
        super.init(8);
    }
    draw(ctx) {
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
    dots(data) {
        for (let i = 0; i < this.height; i++) {
            this.vram[i] = 0;
            for (let j = 0; j < this.width; j++) {
                if (data[i] & (1 << j)) {
                    this.vram[i] |= 0x1 << this.bitArray[j];
                }
            }
        }
        super.writeVram();
    }
}
exports.default = Keyestudio_HT16K33;
