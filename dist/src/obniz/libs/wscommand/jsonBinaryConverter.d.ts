/**
 * @packageDocumentation
 * @ignore
 */
export declare class JsonBinaryConverter {
    static convertFromBinaryToJson(schema: any, binary: any): any;
    static hexFromBinary(data: any, schema?: any): any;
    static uuidFromBinary(data: any): any;
    static signedNumberFromBinary(data: any): any;
    static numberFromBinary(data: any): any;
    static keyForVal(enumvals: any, val: any): string;
    static enumFromBinary(data: any, schema?: any): any;
    static dataArrayFromBinary(data: any): any;
    static createSendBuffer(schema: any, data: any): Uint8Array;
    static analyzeSchema(allData: any, schemaRow: any): any;
    static getProperty(object: any, path: any): any;
    static hexToBinary(data: any, schema?: any): any;
    static intToBinary(data: any): any;
    static charToBinary(data: any): any;
    static dataArrayToBinary(data: any): any;
    static uuidToBinary(data: any): any;
    static enumToBinary(data: any, schema?: any): any;
    static flagToBinary(data: any, schema?: any): any;
    static stringToBinary(data: any): Uint8Array;
}
