/**
 * @packageDocumentation
 * @module Parts.Linking
 */
export default class LinkingService {
    _services: any;
    _write_message_name_map: any;
    _device_info: any;
    setDeviceInfo(device_info: any): void;
    parseResponse(buf: any): {
        buffer: any;
        serviceId: any;
        serviceName: any;
        messageId: any;
        messageName: any;
        parameters: any;
    } | null;
    createRequest(message_name: any, params: any): any;
    isSupportedWriteMessageName(message_name: any): boolean;
}
