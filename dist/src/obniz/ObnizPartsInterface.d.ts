import Obniz = require("./index");
export interface ObnizPartsInfo {
    name: string;
}
export default abstract class ObnizPartsInterface {
    static info: (() => ObnizPartsInfo);
    abstract keys: string[];
    abstract requiredKeys: string[];
    abstract wired(obniz: Obniz): void;
}
