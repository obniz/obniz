/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/// <reference types="node" />
/// <reference types="node" />
export default class LinkingServiceSetting {
    SERVICE_ID: number;
    SERVICE_NAME: string;
    MESSAGE_NAME_MAP: any;
    private _WRITE_MESSAGE_ID_MAP;
    private _SETTING_NAME_TYPE_MAP;
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
    _parseSettingNameType(buf: any): {
        name: string;
        settingNameTypeCode: any;
        settingNameTypeText: string;
    };
    _parseAppName(buf: any): {
        name: string;
        appName: any;
    };
    _parseFileVer(buf: any): {
        name: string;
        fileVer: string;
    };
    _parseFileSize(buf: any): {
        name: string;
        fileSize: any;
    };
    _parseInstallConfirmStatus(buf: any): {
        name: string;
        installConfirmStatusCode: any;
        installConfirmStatusText: string;
    };
    _parseSettingInformationRequest(buf: any): {
        name: string;
        settingInformationRequestCode: any;
        settingInformationRequestName: string;
        settingInformationRequestData: ({
            settingCode: any;
            settingName: string;
            colorMax: any;
            colorNumber: any;
            patternMax: any;
            patternNumber: any;
            duration: any;
        } | {
            settingCode: any;
            settingName: string;
            patternMax: any;
            patternNumber: any;
            duration: any;
            colorMax?: undefined;
            colorNumber?: undefined;
        })[];
    };
    _parseSettingInformationData(buf: any): {
        name: string;
        settingInformationData: ({
            id: any;
            name: string;
            colorMax: any;
            colorNumber: any;
            patternMax: any;
            patternNumber: any;
            duration: any;
        } | {
            id: any;
            name: string;
            patternMax: any;
            patternNumber: any;
            duration: any;
            colorMax?: undefined;
            colorNumber?: undefined;
        })[];
    };
    _parseSettingNameData(buf: any): {
        name: string;
        settingNameData: any[];
    };
    createRequest(message_name: any, params: any): Buffer | null;
    _createPayload(message_name: any, params: any): Buffer | null;
    _createPropertyBlockBuffer(pid: any, val_buf: any): Buffer;
    _createPayloadGetAppVersion(params: any): Buffer | null;
    _createPayloadConfirmInstallApp(params: any): Buffer | null;
    _createPayloadGetSettingInformation(params: any): Buffer;
    _createPayloadGetSettingName(params: any): Buffer | null;
    _createPayloadSelectSettingInformation(params: any): Buffer | null;
}
