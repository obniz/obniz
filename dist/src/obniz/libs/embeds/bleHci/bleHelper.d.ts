/// <reference types="node" />
declare const BleHelper: {
    uuidFilter(uuid: string): string;
    toCamelCase(str: string): string;
    toSnakeCase(str: string): string;
    buffer2reversedHex(buf: Buffer, sepalator?: string): string;
    hex2reversedBuffer(address: string, sepalator?: string): Buffer;
    reverseHexString(str: string, separator?: string): string;
};
export default BleHelper;
