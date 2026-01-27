"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MCP23S08_IO = void 0;
class MCP23S08_IO {
    constructor(chip, id) {
        this.chip = chip;
        this.id = id;
        this.value = false;
        this.direction = true; // true is input. false is output
    }
    output(value) {
        this.chip.output(this.id, value);
    }
    async outputWait(value) {
        await this.chip.outputWait(this.id, value);
    }
    async inputWait(obniz) {
        return await this.chip.inputWait(this.id);
    }
}
exports.MCP23S08_IO = MCP23S08_IO;
