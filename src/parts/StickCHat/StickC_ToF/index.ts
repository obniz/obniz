
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";
import VL53L0X, {VL53L0XOptions} from "../../DistanceSensor/VL53L0X";

export interface StickC_ToFOptions extends VL53L0X {
}

export default class StickC_ToF extends VL53L0X {

    public static info(): ObnizPartsInfo {
        return {
            name: "StickC_ToF",
        };
    }
}
