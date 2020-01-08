export = WSCommandBle;
declare const WSCommandBle_base: typeof import("./WSCommand").default;
declare class WSCommandBle extends WSCommandBle_base {
    uuidLength: number;
    _CommandSetAdvData: number;
    _CommandSetScanRespData: number;
    _CommandStartAdv: number;
    _CommandStopAdv: number;
    _CommandScan: number;
    _CommandStartScan: number;
    _CommandStopScan: number;
    _CommandScanResults: number;
    _CommandConnect: number;
    _CommandServices: number;
    _CommandCharacteristics: number;
    _CommandWriteCharacteristics: number;
    _CommandReadCharacteristics: number;
    _CommandRegisterNotifyCharacteristic: number;
    _CommandUnregisterNotifyCharacteristic: number;
    _CommandDescriptors: number;
    _CommandWriteDescriptor: number;
    _CommandReadDescriptor: number;
    _CommandNotifyCharacteristic: number;
    _CommandSetDeviceName: number;
    _CommandServerStartPeripheral: number;
    _CommandServerNotifyConnect: number;
    _CommandServerAddService: number;
    _CommandServerAddCharacteristic: number;
    _CommandServerAddDescriptor: number;
    _CommandServerWriteCharavteristicValue: number;
    _CommandServerReadCharavteristicValue: number;
    _CommandServerNotifyWriteCharavteristicValue: number;
    _CommandServerNotifyReadCharavteristicValue: number;
    _CommandServerWriteDescriptorValue: number;
    _CommandServerReadDescriptorValue: number;
    _CommandServerNotifyWriteDescriptorValue: number;
    _CommandServerNotifyReadDescriptorValue: number;
    _CommandServerNotifyCharavteristic: number;
    _CommandServerStartStopService: number;
    _CommandSecuritySetAuth: number;
    _CommandSecuritySetEncryptionLevel: number;
    _CommandSecuritySetEnableKeyTypes: number;
    _CommandSecuritySetKeyMaxSize: number;
    _CommandSecuritySetIOCapability: number;
    _CommandSecurityClearBondingDevices: number;
    _CommandScanResultsDevice: {
        breder: number;
        ble: number;
        dumo: number;
    };
    _CommandScanResultsDeviceAddress: {
        public: number;
        random: number;
        rpa_public: number;
        rpa_random: number;
    };
    _CommandScanResultsEvet: {
        inquiry_result: number; /*!< Inquiry result for a peer device. */
        inquiry_complete: number; /*!< Inquiry complete. */
        discovery_result: number; /*!< Discovery result for a peer device. */
        discovery_ble_result: number; /*!< Discovery result for BLE GATT based service on a peer device. */
        discovery_cmoplete: number; /*!< Discovery complete. */
        discovery_di_cmoplete: number; /*!< Discovery complete. */
        cancelled: number; /*!< Search cancelled */
    };
    _CommandScanResultsBleEvent: {
        connectable_advertisemnt: number; /*!< Connectable undirected advertising (ADV_IND) */
        connectable_directed_advertisemnt: number; /*!< Connectable directed advertising (ADV_DIRECT_IND) */
        scannable_advertising: number; /*!< Scannable undirected advertising (ADV_SCAN_IND) */
        non_connectable_advertising: number; /*!< Non connectable undirected advertising (ADV_NONCONN_IND) */
        scan_response: number; /*!< Scan Response (SCAN_RSP) */
    };
    _CommandCharacteristicsProperties: {
        broadcast: number;
        read: number;
        write_without_response: number;
        write: number;
        notify: number;
        indicate: number;
        auth: number;
        extended_properties: number;
    };
    _commandResults: {
        success: number;
        failed: number;
    };
    _securityAuthValues: {
        0x01: string;
        0x04: string;
        0x08: string;
    };
    _securityEncryotionLevels: {
        none: number;
        encryption: number;
        mitm: number;
    };
    _securityKeyTypes: {
        0x01: string;
        0x02: string;
        0x04: string;
    };
    hciCommand: any;
    centralScanStart(params: any): void;
    centralScanStop(params: any): void;
    centralConnect(params: any): void;
    centralDisconnect(params: any): void;
    centralServiceGet(params: any): void;
    centralCharacteristicGet(params: any): void;
    centralCharacteristicRead(params: any): void;
    centralCharacteristicWrite(params: any): void;
    centralCharacteristicRegisterNotify(params: any): void;
    centralCharacteristicUnregisterNotify(params: any): void;
    centralDescriptorGet(params: any): void;
    centralDescriptorRead(params: any): void;
    centralDescriptorWrite(params: any): void;
    peripheralAdvertisementStart(params: any): void;
    peripheralAdvertisementStop(params: any): void;
    peripheralServiceStart(params: any): void;
    peripheralServiceStop(params: any): void;
    peripheralServiceStopAll(): void;
    peripheralCharacteristicRead(params: any): void;
    peripheralCharacteristicWrite(params: any): void;
    peripheralCharacteristicNotify(params: any): void;
    peripheralDescriptorRead(params: any): void;
    peripheralDescriptorWrite(params: any): void;
    securityAuth(params: any): void;
    securityIndicateLevel(params: any): void;
    securityKeyType(params: any): void;
    securityKeySize(params: any): void;
    clearBondingDevicesList(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: any, payload: any): void;
    notifyFromBinaryScanResponse(objToSend: any, payload: any): void;
    notifyFromBinaryConnect(objToSend: any, payload: any): void;
    notifyFromBinaryServices(objToSend: any, payload: any): void;
    notifyFromBinaryChacateristics(objToSend: any, payload: any): void;
    notifyFromBinaryReadChacateristics(objToSend: any, payload: any): void;
    notifyFromBinaryWriteChacateristics(objToSend: any, payload: any): void;
    notifyFromBinaryRegisterNotifyChacateristic(objToSend: any, payload: any): void;
    notifyFromBinaryUnregisterNotifyChacateristic(objToSend: any, payload: any): void;
    notifyFromBinaryNotifyChacateristic(objToSend: any, payload: any): void;
    notifyFromBinaryDescriptors(objToSend: any, payload: any): void;
    notifyFromBinaryReadDescriptor(objToSend: any, payload: any): void;
    notifyFromBinaryWriteDescriptor(objToSend: any, payload: any): void;
    notifyFromBinaryServerConnectionState(objToSend: any, payload: any): void;
    notifyFromBinaryServerWriteCharavteristicValue(objToSend: any, payload: any): void;
    notifyFromBinaryServerReadCharavteristicValue(objToSend: any, payload: any): void;
    notifyFromBinaryServerNotifyReadCharavteristicValue(objToSend: any, payload: any): void;
    notifyFromBinaryServerNotifyWriteCharavteristicValue(objToSend: any, payload: any): void;
    notifyFromBinaryServerReadDescriptorValue(objToSend: any, payload: any): void;
    notifyFromBinaryServerWriteDescriptorValue(objToSend: any, payload: any): void;
    notifyFromBinaryServerNotifyReadDescriptorValue(objToSend: any, payload: any): void;
    notifyFromBinaryServerNotifyWriteDescriptorValue(objToSend: any, payload: any): void;
    notifyFromBinaryError(objToSend: any, payload: any): void;
    _addRowForPath(sendObj: any, path: any, row: any): void;
}
