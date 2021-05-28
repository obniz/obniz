/**
 * @packageDocumentation
 * @module Parts.Linking
 */
export default class LinkingAdvertising {
    static parse(peripheral: any): {
        id: any;
        uuid: any;
        address: any;
        localName: any;
        serviceUuids: any;
        txPowerLevel: number;
        rssi: any;
        distance: number;
        companyId: number;
        companyName: string;
        version: number;
        vendorId: number;
        individualNumber: number;
        beaconDataList: any[];
    } | null;
    static _parseBeaconServiceData(buf: any): any;
}
