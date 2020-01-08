export = BleLocalAttributeAbstract;
declare const BleLocalAttributeAbstract_base: any;
declare class BleLocalAttributeAbstract extends BleLocalAttributeAbstract_base {
    [x: string]: any;
    constructor(params: any);
    RESULT_SUCCESS: number;
    RESULT_INVALID_OFFSET: number;
    RESULT_ATTR_NOT_LONG: number;
    RESULT_INVALID_ATTRIBUTE_LENGTH: number;
    RESULT_UNLIKELY_ERROR: number;
    toBufferObj(): {
        uuid: any;
    };
    emit(name: any, ...params: any[]): boolean;
    _onReadRequest(offset: any, callback: any): void;
    _onWriteRequest(data: any, offset: any, withoutResponse: any, callback: any): void;
    data: any;
    write(dataArray: any): void;
    read(): void;
}
