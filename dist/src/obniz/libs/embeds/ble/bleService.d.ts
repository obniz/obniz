import BleAttributeAbstract from "./bleAttributeAbstract";
declare class BleService extends BleAttributeAbstract {
    addCharacteristic: any;
    addChild: any;
    getCharacteristic: any;
    getChild: any;
    uuid: any;
    peripheral: any;
    constructor(obj: any);
    readonly parentName: string | null;
    readonly childrenName: string | null;
    readonly childrenClass: any;
    readonly advData: {
        flags: string[];
        serviceUuids: any[];
    };
    end(): void;
    notify(notifyName: any, params: any): void;
}
export default BleService;
