/**
 * @packageDocumentation
 * @module Parts.Linking
 */
export default class LinkingServiceOperation {
    SERVICE_ID: number;
    SERVICE_NAME: string;
    MESSAGE_NAME_MAP: any;
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
    _parseButtonId(buf: any): {
        name: string;
        buttonId: any;
        buttonName: string;
    };
}
