/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/// <reference types="node" />
/// <reference types="node" />
export default class LinkingServiceProperty {
    SERVICE_ID: number;
    SERVICE_NAME: string;
    MESSAGE_NAME_MAP: any;
    private _WRITE_MESSAGE_ID_MAP;
    private _device;
    setDeviceInfo(info: any): void;
    parsePayload(pnum: any, buf: any): any[];
    _parseParameter(pid: any, buf: any): any;
    _parseResultCode(buf: any): {
        name: string;
        resultCode: any;
        resultText: string;
    };
    _parseCancel(buf: any): {
        name: string;
        cancelCode: any;
        cancelText: string;
    };
    _parseServiceList(buf: any): {
        name: string;
        serviceList: {
            id: number;
            name: string;
        }[];
    };
    _parseDeviceId(buf: any): {
        name: string;
        deviceId: any;
    };
    _parseDeviceUid(buf: any): {
        name: string;
        deviceUid: any;
    };
    _parseDeviceCapability(buf: any): {
        name: string;
        deviceCapability: {
            id: number;
            name: string;
        }[];
    };
    _parseOriginalInformation(buf: any): {
        name: string;
        originalInformationCode: any;
        originalInformationName: string;
        originalInformationText: any;
    };
    _parseExSensorType(buf: any): {
        name: string;
        exSensorType: {
            id: number;
            name: string;
        }[];
    };
    createRequest(message_name: any, params: any): Buffer | null;
    _createPayload(message_name: any, params: any): any;
    _createPayloadGetDeviceInformation(params: any): any;
}
