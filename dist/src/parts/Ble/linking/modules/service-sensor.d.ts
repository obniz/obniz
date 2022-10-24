/**
 * @packageDocumentation
 * @module Parts.Linking
 */
/// <reference types="node" />
/// <reference types="node" />
export default class LinkingServiceSensor {
    SERVICE_ID: number;
    SERVICE_NAME: string;
    MESSAGE_NAME_MAP: any;
    private _WRITE_MESSAGE_ID_MAP;
    private _device;
    setDeviceInfo(info: any): void;
    parsePayload(pnum: any, buf: any): any[];
    _parseParameter(pid: any, buf: any, sensor_type: any): any;
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
    _parseSensorType(buf: any): {
        name: string;
        sensorTypeCode: any;
        sensorTypeText: string;
    };
    _parseStatus(buf: any): {
        name: string;
        statusCode: any;
        statusText: string;
    };
    _parseX_value(buf: any): {
        name: string;
        xValue: any;
    };
    _parseY_value(buf: any): {
        name: string;
        yValue: any;
    };
    _parseZ_value(buf: any): {
        name: string;
        zValue: any;
    };
    _parseX_threshold(buf: any): {
        name: string;
        xThreshold: any;
    };
    _parseY_threshold(buf: any): {
        name: string;
        yThreshold: any;
    };
    _parseZ_threshold(buf: any): {
        name: string;
        zThreshold: any;
    };
    _parseOriginalData(buf: any, sensor_type: any): {
        chargeRequired: boolean;
        chargeLevel: number;
        temperature?: undefined;
        humidity?: undefined;
        pressure?: undefined;
        openingStatus?: undefined;
        openingCount?: undefined;
        humanDetectionResponse?: undefined;
        humanDetectionCount?: undefined;
        moveResponse?: undefined;
        moveCount?: undefined;
        illuminance?: undefined;
    } | {
        temperature: number;
        chargeRequired?: undefined;
        chargeLevel?: undefined;
        humidity?: undefined;
        pressure?: undefined;
        openingStatus?: undefined;
        openingCount?: undefined;
        humanDetectionResponse?: undefined;
        humanDetectionCount?: undefined;
        moveResponse?: undefined;
        moveCount?: undefined;
        illuminance?: undefined;
    } | {
        humidity: number;
        chargeRequired?: undefined;
        chargeLevel?: undefined;
        temperature?: undefined;
        pressure?: undefined;
        openingStatus?: undefined;
        openingCount?: undefined;
        humanDetectionResponse?: undefined;
        humanDetectionCount?: undefined;
        moveResponse?: undefined;
        moveCount?: undefined;
        illuminance?: undefined;
    } | {
        pressure: any;
        chargeRequired?: undefined;
        chargeLevel?: undefined;
        temperature?: undefined;
        humidity?: undefined;
        openingStatus?: undefined;
        openingCount?: undefined;
        humanDetectionResponse?: undefined;
        humanDetectionCount?: undefined;
        moveResponse?: undefined;
        moveCount?: undefined;
        illuminance?: undefined;
    } | {
        openingStatus: boolean;
        openingCount: number;
        chargeRequired?: undefined;
        chargeLevel?: undefined;
        temperature?: undefined;
        humidity?: undefined;
        pressure?: undefined;
        humanDetectionResponse?: undefined;
        humanDetectionCount?: undefined;
        moveResponse?: undefined;
        moveCount?: undefined;
        illuminance?: undefined;
    } | {
        humanDetectionResponse: boolean;
        humanDetectionCount: number;
        chargeRequired?: undefined;
        chargeLevel?: undefined;
        temperature?: undefined;
        humidity?: undefined;
        pressure?: undefined;
        openingStatus?: undefined;
        openingCount?: undefined;
        moveResponse?: undefined;
        moveCount?: undefined;
        illuminance?: undefined;
    } | {
        moveResponse: boolean;
        moveCount: number;
        chargeRequired?: undefined;
        chargeLevel?: undefined;
        temperature?: undefined;
        humidity?: undefined;
        pressure?: undefined;
        openingStatus?: undefined;
        openingCount?: undefined;
        humanDetectionResponse?: undefined;
        humanDetectionCount?: undefined;
        illuminance?: undefined;
    } | {
        illuminance: any;
        chargeRequired?: undefined;
        chargeLevel?: undefined;
        temperature?: undefined;
        humidity?: undefined;
        pressure?: undefined;
        openingStatus?: undefined;
        openingCount?: undefined;
        humanDetectionResponse?: undefined;
        humanDetectionCount?: undefined;
        moveResponse?: undefined;
        moveCount?: undefined;
    } | {
        chargeRequired?: undefined;
        chargeLevel?: undefined;
        temperature?: undefined;
        humidity?: undefined;
        pressure?: undefined;
        openingStatus?: undefined;
        openingCount?: undefined;
        humanDetectionResponse?: undefined;
        humanDetectionCount?: undefined;
        moveResponse?: undefined;
        moveCount?: undefined;
        illuminance?: undefined;
    };
    createRequest(message_name: any, params: any): Buffer | null;
    _createPayload(message_name: any, params: any): Buffer | null;
    _createPropertyBlockBuffer(pid: any, val_buf: any): Buffer;
    _createPayloadGetSensorInfo(params: any): Buffer | null;
    _createPayloadSetNotifySensorInfo(params: any): Buffer | null;
}
