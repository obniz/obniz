/**
 * @packageDocumentation
 * @module Parts.Linking
 */
import { BleRemotePeripheral, BleConnectSetting } from '../../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
export default class LinkingDevice {
    PRIMARY_SERVICE_UUID: string;
    WRITE_CHARACTERRISTIC_UUID: string;
    INDICATE_CHARACTERRISTIC_UUID: string;
    info: any;
    advertisement: any;
    connected: boolean;
    onconnect: any;
    onconnectprogress: any;
    ondisconnect: any;
    onnotify: any;
    services: any;
    private _peripheral;
    private _service;
    private char_write;
    private char_indicate;
    private _div_packet_queue;
    private _LinkingService;
    private _onresponse;
    private _write_response_timeout;
    private _generic_access_service;
    constructor(peripheral: BleRemotePeripheral);
    /**
     * @deprecated
     * @param setting
     */
    connect(setting?: BleConnectSetting): Promise<void>;
    connectWait(setting?: BleConnectSetting): Promise<void>;
    _wait(msec: number): Promise<void>;
    _writeConfirmNotifyCategory(): Promise<unknown>;
    _writeGetSettingInformation(): Promise<unknown>;
    _writeGetSettingName(name: string): Promise<unknown>;
    _isFunction(o: any): boolean;
    _getServicesAndChars(): void;
    /**
     * @deprecated
     */
    _subscribeForIndicate(): Promise<void>;
    _subscribeForIndicateWait(): Promise<void>;
    _receivedPacket(buf: any): void;
    _isExecutedPacket(buf: any): boolean;
    _receivedIndicate(buf: any): void;
    /**
     * @deprecated
     */
    disconnect(): Promise<void>;
    disconnectWait(): Promise<void>;
    /**
     * @deprecated
     */
    _clean(): Promise<void>;
    _cleanWait(): Promise<void>;
    write(message_name: any, params?: any): Promise<unknown>;
    writeWait(message_name: any, params?: any): Promise<unknown>;
    _margeResponsePrameters(res: any): any;
    _initServices(): void;
    /**
     * @deprecated
     */
    _deviceNameGet(): Promise<any>;
    _deviceNameGetWait(): Promise<any>;
    /**
     * @deprecated
     * @param name
     */
    _deviceNameSet(name: string): Promise<void>;
    _deviceNameSetWait(name: string): Promise<void>;
    _ledTurnOn(color: any, pattern: any, duration: any): Promise<unknown>;
    _ledTurnOff(): Promise<unknown>;
    _vibrationTurnOn(pattern: any, duration: any): Promise<unknown>;
    _vibrationTurnOff(): Promise<unknown>;
    _createSensorServiceObject(sensor_type: any): {
        onnotify: null;
        start: () => Promise<unknown>;
        stop: () => Promise<unknown>;
        get: () => Promise<unknown>;
    };
    _setNotifySensorInfo(sensor_type: any, status: any): Promise<unknown>;
    _getSensorInfo(sensor_type: any): Promise<unknown>;
}
