export = BleCharacteristic;
declare const BleCharacteristic_base: any;
declare class BleCharacteristic extends BleCharacteristic_base {
    [x: string]: any;
    constructor(obj: any);
    _maxValueSize: any;
    _updateValueCallback: any;
    addDescriptor: any;
    getDescriptor: any;
    properties: any;
    permissions: any;
    get parentName(): string;
    get childrenClass(): any;
    get childrenName(): string;
    get descriptors(): any;
    toJSON(): any;
    toBufferObj(): any;
    addProperty(param: any): void;
    removeProperty(param: any): void;
    addPermission(param: any): void;
    removePermission(param: any): void;
    emit(name: any, ...params: any[]): any;
    _onSubscribe(maxValueSize: any, updateValueCallback: any): void;
    _onUnsubscribe(): void;
    _onNotify(): void;
    _onIndicate(): void;
    notify(): void;
}
