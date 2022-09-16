/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/// <reference types="node" />
/// <reference types="node" />
export default class LinkingServiceNotification {
    SERVICE_ID: number;
    SERVICE_NAME: string;
    MESSAGE_NAME_MAP: {
        '00': string;
        '01': string;
        '02': string;
        '03': string;
        '04': string;
        '05': string;
        '06': string;
        '07': string;
    };
    private _WRITE_MESSAGE_ID_MAP;
    private _NOTIFY_CATEGORY_NAME_ID_MAP;
    private _device;
    setDeviceInfo(info: any): void;
    parsePayload(pnum: any, buf: any): any[];
    _parseParameter(pid: any, buf: any, notify_cateogory_id?: any): any;
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
    _parseGetStatus(buf: any): {
        name: string;
        statusCode: any;
        statusText: string;
    };
    _parseNotifyCategory(buf: any): {
        name: string;
        notifyCategory: {
            id: number;
            name: string;
        }[];
    };
    _parseNotifyCategoryID(buf: any): {
        name: string;
        notifyCategoryId: any;
        NotifyCategoryText: any;
    };
    _parseGetParameterID(buf: any): {
        name: string;
        getParameterId: any;
    };
    _parseGetParameterLength(buf: any): {
        name: string;
        getParameterLength: any;
    };
    _parseParameterIdList(buf: any, notify_cateogry_id: any): {
        name: string;
        parameterIdList: {
            id: number;
            name: string;
        }[];
    };
    _parseUniqueId(buf: any): {
        name: string;
        uniqueId: any;
    };
    _parseNotifyId(buf: any): {
        name: string;
        notifyId: any;
    };
    _parseNotificationOperation(buf: any): {
        name: string;
        notificationOperationCode: any;
        notificationOperationText: string;
    };
    _parseTittle(buf: any): {
        name: string;
        title: any;
    };
    _parseText(buf: any): {
        name: string;
        text: any;
    };
    _parseAppName(buf: any): {
        name: string;
        appName: any;
    };
    _parseAppNameLocal(buf: any): {
        name: string;
        appNameLocal: any;
    };
    _parseNotifyApp(buf: any): {
        name: string;
        notifyApp: any;
    };
    _parseRumblingSetting(buf: any): {
        name: string;
        rumblingSetting: {
            id: number;
            name: string;
        }[];
    };
    _parseVibrationPattern(buf: any): {
        name: string;
        vibrationPattern: string[];
    };
    _parseLedPattern(buf: any): {
        name: string;
        LedPattern: string[];
    };
    _parseSender(buf: any): {
        name: string;
        sender: any;
    };
    _parseSenderAddress(buf: any): {
        name: string;
        senderAddress: any;
    };
    _parseReceiveDate(buf: any): {
        name: string;
        receiveDate: Date;
    };
    _parseStartDate(buf: any): {
        name: string;
        startDate: Date;
    };
    _parseEndDate(buf: any): {
        name: string;
        endDate: Date;
    };
    _parseArea(buf: any): {
        name: string;
        area: any;
    };
    _parsePerson(buf: any): {
        name: string;
        person: any;
    };
    _parseMimeTypeForImage(buf: any): {
        name: string;
        mimeTypeForImage: any;
    };
    _parseMimeTypeForMedia(buf: any): {
        name: string;
        mimeTypeForMedia: any;
    };
    _parseImage(buf: any): {
        name: string;
        image: any;
    };
    _parseContents(buf: any, pid: any): {
        name: string;
        contents: any;
    };
    _parseMedia(buf: any): {
        name: string;
        media: any;
    };
    _parsePackage(buf: any): {
        name: string;
        package: any;
    };
    _parseClass(buf: any): {
        name: string;
        class: any;
    };
    _parseSharingInformation(buf: any): {
        name: string;
        sharingInformation: any;
    };
    _parseBeepPattern(buf: any): {
        name: string;
        beepPattern: string[];
    };
    createRequest(message_name: any, params: any): Buffer | null;
    _createPayload(message_name: any, params: any): any;
    _createPropertyBlockBuffer(pid: any, val_buf: any): Buffer;
    _createPayloadConfirmNotifyCategory(params: any): any;
    _createPayloadNotifyInformation(params: any): null;
    _createPayloadGetPdNotifyDetailDataResp(params: any): Buffer | null;
    _createPayloadStartPdApplicationResp(params: any): Buffer | null;
}
