/**
 * @packageDocumentation
 * @module ObnizCore.Components.Ble.Hci
 */
import BleAttributeAbstract from "./bleAttributeAbstract";
/**
 * @category Use as Peripheral
 */
export default class BleLocalAttributeAbstract extends BleAttributeAbstract {
    RESULT_SUCCESS: any;
    RESULT_INVALID_OFFSET: any;
    RESULT_ATTR_NOT_LONG: any;
    RESULT_INVALID_ATTRIBUTE_LENGTH: any;
    RESULT_UNLIKELY_ERROR: any;
    uuid: any;
    childrenName: any;
    children: any;
    data: any;
    parentName: any;
    characteristic: any;
    service: any;
    notifyFromServer: any;
    constructor(params: any);
    toBufferObj(): any;
    emit(name: any, ...params: any): boolean;
    _onReadRequest(offset: any, callback?: any): void;
    _onWriteRequest(data: any, offset?: any, withoutResponse?: any, callback?: any): void;
    write(dataArray: any): void;
    read(): void;
}
