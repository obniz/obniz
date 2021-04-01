/**
 * @packageDocumentation
 * @module Parts.M5StickC_DAC
 */
import MCP4725, { MCP4725Options } from "../../DAConverter/MCP4725";
import Obniz from "../../../obniz";
import { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";
export interface M5StickC_DACOptions extends MCP4725Options {
}
export default class M5StickC_DAC extends MCP4725 {
    static info(): ObnizPartsInfo;
    wired(obniz: Obniz): void;
}
