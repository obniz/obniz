import { BleAdvertisementData, BleScanResponseData, UUID } from "./bleTypes";
/**
 * @category Use as Peripheral
 */
export default class BleAdvertisementBuilder {
    protected rows: {
        [key: number]: number[];
    };
    constructor(json: BleAdvertisementData | BleScanResponseData);
    setRow(type: number, data: number[]): void;
    getRow(type: number): number[];
    build(): number[];
    setStringData(type: number, string: string): void;
    setShortenedLocalName(name: string): void;
    setCompleteLocalName(name: string): void;
    setManufacturerSpecificData(companyCode: number, data: number[]): void;
    setUuid(uuid: UUID): void;
    convertUuid(uuid: UUID): any;
    setIbeaconData(uuid: UUID, major: number, minor: number, txPower: number): void;
    setLeLimitedDiscoverableModeFlag(): void;
    setLeGeneralDiscoverableModeFlag(): void;
    setBrEdrNotSupportedFlag(): void;
    setLeBrEdrControllerFlag(): void;
    setLeBrEdrHostFlag(): void;
    protected extendEvalJson(json: BleAdvertisementData): void;
    protected setFlags(flag: number): void;
}
