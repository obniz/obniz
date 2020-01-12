import BleLocalAttributeAbstract from "./bleLocalAttributeAbstract";
declare class BleService extends BleLocalAttributeAbstract {
    addCharacteristic: any;
    addChild: any;
    getCharacteristic: any;
    getChild: any;
    children: any;
    uuid: any;
    peripheral: any;
    constructor(obj: any);
    readonly parentName: string | null;
    readonly childrenName: string | null;
    readonly childrenClass: any;
    readonly characteristics: any;
    readonly advData: {
        flags: string[];
        serviceUuids: any[];
    };
    end(): void;
    emit(name: any, ...params: any): any;
    notify(notifyName: any, params: any): void;
}
export default BleService;
