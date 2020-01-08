export = JsonBinaryConverter;
declare class JsonBinaryConverter {
    static convertFromBinaryToJson(schema: any, binary: any): {};
    static hexFromBinary(data: any, schema: any): string;
    static uuidFromBinary(data: any): string | null;
    static signedNumberFromBinary(data: any): number;
    static numberFromBinary(data: any): number;
    static keyForVal(enumvals: any, val: any): string;
    static enumFromBinary(data: any, schema: any): number;
    static dataArrayFromBinary(data: any): any[];
    static createSendBuffer(schema: any, data: any): Uint8Array;
    static analyzeSchema(allData: any, schemaRow: any): any;
    static getProperty(object: any, path: any): any;
    static hexToBinary(data: any, schema: any): number[];
    static intToBinary(data: any): number[];
    static charToBinary(data: any): number[];
    static dataArrayToBinary(data: any): any;
    static uuidToBinary(data: any): number[];
    static enumToBinary(data: any, schema: any): any[];
    static flagToBinary(data: any, schema: any): number[];
    static stringToBinary(data: any): Uint8Array;
}
