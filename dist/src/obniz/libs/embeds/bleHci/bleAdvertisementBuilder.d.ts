declare class BleAdvertisementBuilder {
    Obniz: any;
    rows: any;
    constructor(Obniz: any, json: any);
    setRow(type: any, data: any): void;
    getRow(type: any): any;
    build(): any;
    setStringData(type: any, string: any): void;
    setShortenedLocalName(name: any): void;
    setCompleteLocalName(name: any): void;
    setManufacturerSpecificData(companyCode: any, data: any): void;
    setUuid(uuid: any): void;
    convertUuid(uuid: any): any;
    setIbeaconData(uuid: any, major: any, minor: any, txPower: any): void;
    extendEvalJson(json: any): void;
    setFlags(flag: any): void;
    setLeLimitedDiscoverableModeFlag(): void;
    setLeGeneralDiscoverableModeFlag(): void;
    setBrEdrNotSupportedFlag(): void;
    setLeBrEdrControllerFlag(): void;
    setLeBrEdrHostFlag(): void;
}
export default BleAdvertisementBuilder;
