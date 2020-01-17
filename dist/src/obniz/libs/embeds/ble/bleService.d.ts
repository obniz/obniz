import BleAttributeAbstract from "./bleAttributeAbstract";
declare class BleService extends BleAttributeAbstract {
    addCharacteristic: any;
    addChild: any;
    getCharacteristic: any;
    getChild: any;
    uuid: any;
    peripheral: any;
    constructor(obj: any);
    get parentName(): string | null;
    get childrenName(): string | null;
    get childrenClass(): any;
    get advData(): {
        flags: string[];
        serviceUuids: any[];
    };
    end(): void;
    notify(notifyName: any, params: any): void;
}
export default BleService;
