
import ObnizPartsInterface, {ObnizPartsInfo} from "../../../obniz/ObnizPartsInterface";
import VL53L0X, {VL53L0XOptions} from "../../DistanceSensor/VL53L0X";

export interface M5StickC_ToFOptions extends VL53L0X {
}

export default class M5StickC_ToF extends VL53L0X {

    public static info(): ObnizPartsInfo {
        return {
            name: "M5StickC_ToF",
        };
    }
}
