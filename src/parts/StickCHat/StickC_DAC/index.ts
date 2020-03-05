
import MCP4725, {MCP4725Options} from "../../DAConverter/MCP4725";

import {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";

export interface StickC_DACOptions extends MCP4725Options {
}

export default class StickC_DAC extends MCP4725 {

    public static info(): ObnizPartsInfo {
        return {
            name: "StickC_DAC",
        };
    }
}
