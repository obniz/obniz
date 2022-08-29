/**
 * @packageDocumentation
 * @ignore
 */
import JsonBinaryConverter from './jsonBinaryConverter';
import WSCommand from './WSCommand';
import WSCommandBleHci from './WSCommandBleHci';

class WSCommandBle extends WSCommand {
  public module: number;
  public uuidLength: number;
  public _CommandSetAdvData: number;
  public _CommandSetScanRespData: number;
  public _CommandStartAdv: number;
  public _CommandStopAdv: number;
  public _CommandScan: number;
  public _CommandStartScan: number;
  public _CommandStopScan: number;
  public _CommandScanResults: number;
  public _CommandConnect: number;
  public _CommandServices: number;
  public _CommandCharacteristics: number;
  public _CommandWriteCharacteristics: number;
  public _CommandReadCharacteristics: number;
  public _CommandRegisterNotifyCharacteristic: number;
  public _CommandUnregisterNotifyCharacteristic: number;
  public _CommandDescriptors: number;
  public _CommandWriteDescriptor: number;
  public _CommandReadDescriptor: number;
  public _CommandNotifyCharacteristic: number;
  public _CommandSetDeviceName: number;
  public _CommandServerStartPeripheral: number;
  public _CommandServerNotifyConnect: number;
  public _CommandServerAddService: number;
  public _CommandServerAddCharacteristic: number;
  public _CommandServerAddDescriptor: number;
  public _CommandServerWriteCharavteristicValue: number;
  public _CommandServerReadCharavteristicValue: number;
  public _CommandServerNotifyWriteCharavteristicValue: number;
  public _CommandServerNotifyReadCharavteristicValue: number;
  public _CommandServerWriteDescriptorValue: number;
  public _CommandServerReadDescriptorValue: number;
  public _CommandServerNotifyWriteDescriptorValue: number;
  public _CommandServerNotifyReadDescriptorValue: number;
  public _CommandServerNotifyCharavteristic: number;
  public _CommandServerStartStopService: number;
  public _CommandSecuritySetAuth: number;
  public _CommandSecuritySetEncryptionLevel: number;
  public _CommandSecuritySetEnableKeyTypes: number;
  public _CommandSecuritySetKeyMaxSize: number;
  public _CommandSecuritySetIOCapability: number;
  public _CommandSecurityClearBondingDevices: number;

  public _CommandScanResultsDevice: any;
  public _CommandScanResultsDeviceAddress: any;
  public _CommandScanResultsEvet: any;
  public _CommandScanResultsBleEvent: any;
  public _CommandCharacteristicsProperties: any;
  public _commandResults: any;
  public _securityAuthValues: any;
  public _securityEncryotionLevels: any;
  public _securityKeyTypes: any;
  public hciCommand: any;

  private _funcList: {
    [key: number]: (objToSend: any, payload?: any) => void;
  };

  constructor() {
    super();
    this.module = 11;

    this.uuidLength = 16 + 2;

    this._CommandSetAdvData = 0;
    this._CommandSetScanRespData = 1;
    this._CommandStartAdv = 2;
    this._CommandStopAdv = 3;
    this._CommandScan = 4;
    this._CommandStartScan = 4;
    this._CommandStopScan = 5;
    this._CommandScanResults = 6;
    this._CommandConnect = 7;
    this._CommandServices = 8;
    this._CommandCharacteristics = 9;
    this._CommandWriteCharacteristics = 10;
    this._CommandReadCharacteristics = 11;
    this._CommandRegisterNotifyCharacteristic = 12;
    this._CommandUnregisterNotifyCharacteristic = 13;
    this._CommandDescriptors = 14;
    this._CommandWriteDescriptor = 15;
    this._CommandReadDescriptor = 16;
    this._CommandNotifyCharacteristic = 17;

    this._CommandSetDeviceName = 19;
    this._CommandServerStartPeripheral = 20;
    this._CommandServerNotifyConnect = 21;
    this._CommandServerAddService = 22;
    this._CommandServerAddCharacteristic = 23;
    this._CommandServerAddDescriptor = 24;
    this._CommandServerWriteCharavteristicValue = 25;
    this._CommandServerReadCharavteristicValue = 26;
    this._CommandServerNotifyWriteCharavteristicValue = 27;
    this._CommandServerNotifyReadCharavteristicValue = 28;
    this._CommandServerWriteDescriptorValue = 29;
    this._CommandServerReadDescriptorValue = 30;
    this._CommandServerNotifyWriteDescriptorValue = 31;
    this._CommandServerNotifyReadDescriptorValue = 32;
    this._CommandServerNotifyCharavteristic = 33;
    this._CommandServerStartStopService = 34;

    this._CommandSecuritySetAuth = 35;
    this._CommandSecuritySetEncryptionLevel = 36;
    this._CommandSecuritySetEnableKeyTypes = 37;
    this._CommandSecuritySetKeyMaxSize = 38;
    this._CommandSecuritySetIOCapability = 39;
    this._CommandSecurityClearBondingDevices = 40;

    this._CommandScanResultsDevice = {
      breder: 0x01,
      ble: 0x02,
      dumo: 0x03,
    };

    /// BLE device address type
    this._CommandScanResultsDeviceAddress = {
      public: 0x00,
      random: 0x01,
      rpa_public: 0x02,
      rpa_random: 0x03,
    };

    this._CommandScanResultsEvet = {
      inquiry_result: 0 /* !< Inquiry result for a peer device. */,
      inquiry_complete: 1 /* !< Inquiry complete. */,
      discovery_result: 2 /* !< Discovery result for a peer device. */,
      discovery_ble_result: 3 /* !< Discovery result for BLE GATT based service on a peer device. */,
      discovery_cmoplete: 4 /* !< Discovery complete. */,
      discovery_di_cmoplete: 5 /* !< Discovery complete. */,
      cancelled: 6 /* !< Search cancelled */,
    };

    this._CommandScanResultsBleEvent = {
      connectable_advertisemnt: 0x00 /* !< Connectable undirected advertising (ADV_IND) */,
      connectable_directed_advertisemnt: 0x01 /* !< Connectable directed advertising (ADV_DIRECT_IND) */,
      scannable_advertising: 0x02 /* !< Scannable undirected advertising (ADV_SCAN_IND) */,
      non_connectable_advertising: 0x03 /* !< Non connectable undirected advertising (ADV_NONCONN_IND) */,
      scan_response: 0x04 /* !< Scan Response (SCAN_RSP) */,
    };

    this._CommandCharacteristicsProperties = {
      broadcast: 0x01,
      read: 0x02,
      write_without_response: 0x04,
      write: 0x08,
      notify: 0x10,
      indicate: 0x20,
      auth: 0x40,
      extended_properties: 0x80,
    };

    this._commandResults = {
      success: 0,
      failed: 1,
    };

    this._securityAuthValues = {
      0x01: 'bonding',
      0x04: 'mitm',
      0x08: 'secure_connection',
    };
    this._securityEncryotionLevels = {
      none: 0x01,
      encryption: 0x02,
      mitm: 0x03,
    };

    this._securityKeyTypes = {
      0x01: 'ltk',
      0x02: 'irk',
      0x04: 'csrk',
    };

    this.hciCommand = new WSCommandBleHci(this);

    const funcList: {
      [key: number]: (objToSend: any, payload?: any) => void;
    } = {};
    funcList[this._CommandScanResults] = this.notifyFromBinaryScanResponse.bind(
      this
    );
    funcList[this._CommandConnect] = this.notifyFromBinaryConnect.bind(this);
    funcList[this._CommandServices] = this.notifyFromBinaryServices.bind(this);
    funcList[
      this._CommandCharacteristics
    ] = this.notifyFromBinaryChacateristics.bind(this);
    funcList[
      this._CommandWriteCharacteristics
    ] = this.notifyFromBinaryWriteChacateristics.bind(this);
    funcList[
      this._CommandReadCharacteristics
    ] = this.notifyFromBinaryReadChacateristics.bind(this);
    funcList[
      this._CommandRegisterNotifyCharacteristic
    ] = this.notifyFromBinaryRegisterNotifyChacateristic.bind(this);
    funcList[
      this._CommandUnregisterNotifyCharacteristic
    ] = this.notifyFromBinaryUnregisterNotifyChacateristic.bind(this);
    funcList[
      this._CommandNotifyCharacteristic
    ] = this.notifyFromBinaryNotifyChacateristic.bind(this);
    funcList[this._CommandDescriptors] = this.notifyFromBinaryDescriptors.bind(
      this
    );
    funcList[
      this._CommandWriteDescriptor
    ] = this.notifyFromBinaryWriteDescriptor.bind(this);
    funcList[
      this._CommandReadDescriptor
    ] = this.notifyFromBinaryReadDescriptor.bind(this);

    funcList[
      this._CommandServerNotifyConnect
    ] = this.notifyFromBinaryServerConnectionState.bind(this);
    funcList[
      this._CommandServerReadCharavteristicValue
    ] = this.notifyFromBinaryServerReadCharavteristicValue.bind(this);
    funcList[
      this._CommandServerWriteCharavteristicValue
    ] = this.notifyFromBinaryServerWriteCharavteristicValue.bind(this);
    funcList[
      this._CommandServerNotifyReadCharavteristicValue
    ] = this.notifyFromBinaryServerNotifyReadCharavteristicValue.bind(this);
    funcList[
      this._CommandServerNotifyWriteCharavteristicValue
    ] = this.notifyFromBinaryServerNotifyWriteCharavteristicValue.bind(this);
    funcList[
      this._CommandServerReadDescriptorValue
    ] = this.notifyFromBinaryServerReadDescriptorValue.bind(this);
    funcList[
      this._CommandServerWriteDescriptorValue
    ] = this.notifyFromBinaryServerWriteDescriptorValue.bind(this);
    funcList[
      this._CommandServerNotifyReadDescriptorValue
    ] = this.notifyFromBinaryServerNotifyReadDescriptorValue.bind(this);
    funcList[
      this._CommandServerNotifyWriteDescriptorValue
    ] = this.notifyFromBinaryServerNotifyWriteDescriptorValue.bind(this);

    funcList[this.COMMAND_FUNC_ID_ERROR] = this.notifyFromBinaryError.bind(
      this
    );

    Object.assign(funcList, this.hciCommand.notifyFunctionList());
    this._funcList = funcList;
  }

  /* CENTRAL   */

  public centralScanStart(params: any) {
    const schema: any = [
      { path: 'scan.duration', length: 4, type: 'int', default: 30 },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandStartScan, buf);
  }

  public centralScanStop(params: any) {
    this.sendCommand(this._CommandStopScan, null);
  }

  public centralConnect(params: any) {
    const schema: any = [
      {
        path: 'connect.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      { path: null, length: 1, type: 'char', default: false }, // const val
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandConnect, buf);
  }

  public centralDisconnect(params: any) {
    const schema: any = [
      {
        path: 'disconnect.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      { path: null, length: 1, type: 'char', default: true }, // const val
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandConnect, buf);
  }

  public centralServiceGet(params: any) {
    const schema: any = [
      {
        path: 'get_services.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServices, buf);
  }

  public centralCharacteristicGet(params: any) {
    const schema: any = [
      {
        path: 'get_characteristics.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'get_characteristics.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandCharacteristics, buf);
  }

  public centralCharacteristicRead(params: any) {
    const schema: any = [
      {
        path: 'read_characteristic.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'read_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'read_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandReadCharacteristics, buf);
  }

  public centralCharacteristicWrite(params: any) {
    const schema: any = [
      {
        path: 'write_characteristic.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'write_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'write_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'write_characteristic.needResponse',
        length: 1,
        type: 'char',
        default: 1,
      },
      { path: 'write_characteristic.data', length: null, type: 'dataArray' },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandWriteCharacteristics, buf);
  }

  public centralCharacteristicRegisterNotify(params: any) {
    const schema: any = [
      {
        path: 'register_notify_characteristic.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'register_notify_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'register_notify_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandRegisterNotifyCharacteristic, buf);
  }

  public centralCharacteristicUnregisterNotify(params: any) {
    const schema: any = [
      {
        path: 'unregister_notify_characteristic.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'unregister_notify_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'unregister_notify_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandUnregisterNotifyCharacteristic, buf);
  }

  public centralDescriptorGet(params: any) {
    const schema: any = [
      {
        path: 'get_descriptors.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'get_descriptors.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'get_descriptors.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandDescriptors, buf);
  }

  public centralDescriptorRead(params: any) {
    const schema: any = [
      {
        path: 'read_descriptor.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'read_descriptor.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'read_descriptor.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'read_descriptor.descriptor_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandReadDescriptor, buf);
  }

  public centralDescriptorWrite(params: any) {
    const schema: any = [
      {
        path: 'write_descriptor.address',
        length: 6,
        type: 'hex',
        required: true,
        endianness: 'little',
      },
      {
        path: 'write_descriptor.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'write_descriptor.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'write_descriptor.descriptor_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'write_descriptor.needResponse',
        length: 1,
        type: 'char',
        default: 1,
      },
      { path: 'write_descriptor.data', length: null, type: 'dataArray' },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandWriteDescriptor, buf);
  }

  /* PERIPHERAL   */

  public peripheralAdvertisementStart(params: any) {
    this.sendCommand(
      this._CommandSetAdvData,
      new Uint8Array(params.advertisement.adv_data)
    );

    if (params.advertisement.scan_resp) {
      this.sendCommand(
        this._CommandSetScanRespData,
        new Uint8Array(params.advertisement.scan_resp)
      );
    }

    this.sendCommand(this._CommandStartAdv, null);
  }

  public peripheralAdvertisementStop(params: any) {
    this.sendCommand(this._CommandStopAdv, null);
  }

  public peripheralServiceStart(params: any) {
    const val: any = params.peripheral;
    const propFlags: any = {
      0x01: 'broadcast',
      0x02: 'read',
      0x04: 'write_without_response',
      0x08: 'write',
      0x10: 'notify',
      0x20: 'indiate',
      0x40: 'auth',
      0x80: 'ext_prop',
    };

    const permissionFlags: any = {
      0x001: 'read',
      0x002: 'read_encrypted',
      0x004: 'read_encrypted_mitm',
      0x010: 'write',
      0x020: 'write_encrypted',
      0x040: 'write_encrypted_mitm',
      0x080: 'write_signed',
      0x100: 'write_signed_mitm',
    };
    const schema: any = {
      service: {
        command: this._CommandServerAddService,
        schema: [{ path: 'uuid', length: 18, type: 'uuid', required: true }],
      },
      characteristic: {
        command: this._CommandServerAddCharacteristic,
        schema: [
          { path: 'service_uuid', length: 18, type: 'uuid', required: true },
          { path: 'uuid', length: 18, type: 'uuid', required: true },
          {
            path: 'permissions',
            length: 2,
            type: 'flag',
            default: ['write', 'read'],
            flags: permissionFlags,
          },
          {
            path: 'properties',
            length: 1,
            type: 'flag',
            default: ['write', 'read'],
            flags: propFlags,
          },
          { path: 'data', type: 'dataArray' },
        ],
      },
      descriptor: {
        command: this._CommandServerAddDescriptor,
        schema: [
          { path: 'service_uuid', length: 18, type: 'uuid', required: true },
          {
            path: 'characteristic_uuid',
            length: 18,
            type: 'uuid',
            required: true,
          },
          { path: 'uuid', length: 18, type: 'uuid', required: true },
          {
            path: 'permissions',
            length: 2,
            type: 'flag',
            default: ['write', 'read'],
            flags: permissionFlags,
          },
          { path: 'data', type: 'dataArray' },
        ],
      },
      startService: {
        command: this._CommandServerStartStopService,
        schema: [
          { path: 'uuid', length: 18, type: 'uuid', required: true },
          { path: null, length: 1, type: 'char', default: 0 }, // const val
        ],
      },
    };

    const sendBufs: any = [];
    const startServiceBufs: any = [];
    let buf: any;
    for (const serviceIndex in val.services) {
      const service: any = val.services[serviceIndex];
      buf = JsonBinaryConverter.createSendBuffer(
        schema.service.schema,
        service
      );
      if (buf.length === 0) {
        return;
      }
      sendBufs.push({ command: schema.service.command, buffer: buf });

      buf = JsonBinaryConverter.createSendBuffer(
        schema.startService.schema,
        service
      );
      startServiceBufs.push({
        command: schema.startService.command,
        buffer: buf,
      });

      for (const charaIndex in service.characteristics) {
        const chara: any = service.characteristics[charaIndex];
        chara.service_uuid = service.uuid;
        buf = JsonBinaryConverter.createSendBuffer(
          schema.characteristic.schema,
          chara
        );
        if (buf.length === 0) {
          return;
        }
        sendBufs.push({
          command: schema.characteristic.command,
          buffer: buf,
        });

        for (const descIndex in chara.descriptors) {
          const desc: any = chara.descriptors[descIndex];
          desc.service_uuid = service.uuid;
          desc.characteristic_uuid = chara.uuid;
          buf = JsonBinaryConverter.createSendBuffer(
            schema.descriptor.schema,
            desc
          );
          if (buf.length === 0) {
            return;
          }
          sendBufs.push({ command: schema.descriptor.command, buffer: buf });
        }
      }
    }
    for (const index in sendBufs) {
      this.sendCommand(sendBufs[index].command, sendBufs[index].buffer);
    }
    for (const index in startServiceBufs) {
      this.sendCommand(
        startServiceBufs[index].command,
        startServiceBufs[index].buffer
      );
    }
  }

  public peripheralServiceStop(params: any) {
    const schema: any = [
      {
        path: 'peripheral.stop_service.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      { path: null, length: 1, type: 'char', default: 1 }, // const val
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerStartStopService, buf);
  }

  public peripheralServiceStopAll() {
    this.sendCommand(this._CommandServerStartPeripheral, new Uint8Array([1]));
  }

  public peripheralCharacteristicRead(params: any) {
    const schema: any = [
      {
        path: 'peripheral.read_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.read_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerReadCharavteristicValue, buf);
  }

  public peripheralCharacteristicWrite(params: any) {
    const schema: any = [
      {
        path: 'peripheral.write_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.write_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      { path: 'peripheral.write_characteristic.data', type: 'dataArray' },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerWriteCharavteristicValue, buf);
  }

  public peripheralCharacteristicNotify(params: any) {
    const schema: any = [
      {
        path: 'peripheral.notify_characteristic.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.notify_characteristic.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerNotifyCharavteristic, buf);
  }

  public peripheralDescriptorRead(params: any) {
    const schema: any = [
      {
        path: 'peripheral.read_descriptor.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.read_descriptor.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.read_descriptor.descriptor_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerReadDescriptorValue, buf);
  }

  public peripheralDescriptorWrite(params: any) {
    const schema: any = [
      {
        path: 'peripheral.write_descriptor.service_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.write_descriptor.characteristic_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      {
        path: 'peripheral.write_descriptor.descriptor_uuid',
        length: 18,
        type: 'uuid',
        required: true,
      },
      { path: 'peripheral.write_descriptor.data', type: 'dataArray' },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandServerWriteDescriptorValue, buf);
  }

  public securityAuth(params: any) {
    const schema: any = [
      {
        path: 'security.auth',
        type: 'flag',
        length: 1,
        required: true,
        flags: this._securityAuthValues,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandSecuritySetAuth, buf);
  }

  public securityIndicateLevel(params: any) {
    const schema: any = [
      {
        path: 'security.indicate_security_level',
        type: 'char',
        length: 1,
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandSecuritySetEncryptionLevel, buf);
  }

  public securityKeyType(params: any) {
    const schema: any = [
      {
        path: 'security.key.type',
        type: 'flag',
        length: 1,
        required: true,
        flags: this._securityKeyTypes,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandSecuritySetEnableKeyTypes, buf);
  }

  public securityKeySize(params: any) {
    const schema: any = [
      {
        path: 'security.key.max_size',
        type: 'char',
        length: 1,
        required: true,
      },
    ];
    const buf: any = JsonBinaryConverter.createSendBuffer(schema, params);
    this.sendCommand(this._CommandSecuritySetKeyMaxSize, buf);
  }

  public clearBondingDevicesList(params: any) {
    const buf: any = new Uint8Array([]); // noting to send
    this.sendCommand(this._CommandSecurityClearBondingDevices, buf);
  }

  public parseFromJson(json: any) {
    const module: any = json.ble;
    if (module === undefined) {
      return;
    }
    const schemaData: any = [
      {
        uri: '/request/ble/central/scan_start',
        onValid: this.centralScanStart,
      },
      { uri: '/request/ble/central/scan_stop', onValid: this.centralScanStop },
      { uri: '/request/ble/central/connect', onValid: this.centralConnect },
      {
        uri: '/request/ble/central/disconnect',
        onValid: this.centralDisconnect,
      },
      {
        uri: '/request/ble/central/service_get',
        onValid: this.centralServiceGet,
      },
      {
        uri: '/request/ble/central/characteristic_get',
        onValid: this.centralCharacteristicGet,
      },
      {
        uri: '/request/ble/central/characteristic_read',
        onValid: this.centralCharacteristicRead,
      },
      {
        uri: '/request/ble/central/characteristic_write',
        onValid: this.centralCharacteristicWrite,
      },
      {
        uri: '/request/ble/central/characteristic_register_notify',
        onValid: this.centralCharacteristicRegisterNotify,
      },
      {
        uri: '/request/ble/central/characteristic_unregister_notify',
        onValid: this.centralCharacteristicUnregisterNotify,
      },
      {
        uri: '/request/ble/central/descriptor_get',
        onValid: this.centralDescriptorGet,
      },
      {
        uri: '/request/ble/central/descriptor_read',
        onValid: this.centralDescriptorRead,
      },
      {
        uri: '/request/ble/central/descriptor_write',
        onValid: this.centralDescriptorWrite,
      },
      {
        uri: '/request/ble/peripheral/advertisement_start',
        onValid: this.peripheralAdvertisementStart,
      },
      {
        uri: '/request/ble/peripheral/advertisement_stop',
        onValid: this.peripheralAdvertisementStop,
      },
      {
        uri: '/request/ble/peripheral/service_start',
        onValid: this.peripheralServiceStart,
      },
      {
        uri: '/request/ble/peripheral/service_stop',
        onValid: this.peripheralServiceStop,
      },
      {
        uri: '/request/ble/peripheral/service_stop_all',
        onValid: this.peripheralServiceStopAll,
      },
      {
        uri: '/request/ble/peripheral/characteristic_read',
        onValid: this.peripheralCharacteristicRead,
      },
      {
        uri: '/request/ble/peripheral/characteristic_write',
        onValid: this.peripheralCharacteristicWrite,
      },
      {
        uri: '/request/ble/peripheral/characteristic_notify',
        onValid: this.peripheralCharacteristicNotify,
      },
      {
        uri: '/request/ble/peripheral/descriptor_read',
        onValid: this.peripheralDescriptorRead,
      },
      {
        uri: '/request/ble/peripheral/descriptor_write',
        onValid: this.peripheralDescriptorWrite,
      },
      {
        uri: '/request/ble/security/auth',
        onValid: this.securityAuth,
      },
      {
        uri: '/request/ble/security/indicate_security_level',
        onValid: this.securityIndicateLevel,
      },
      {
        uri: '/request/ble/security/key_type',
        onValid: this.securityKeyType,
      },
      {
        uri: '/request/ble/security/key_max_size',
        onValid: this.securityKeySize,
      },
      {
        uri: '/request/ble/security/devices_clear',
        onValid: this.clearBondingDevicesList,
      },
    ];

    schemaData.push(...this.hciCommand.schemaData());
    const res = this.validateCommandSchema(schemaData, module, 'ble');
    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[ble]unknown command`);
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: number, payload: Uint8Array) {
    if (this._funcList[func]) {
      this._funcList[func](objToSend, payload);
    }
  }

  public notifyFromBinaryScanResponse(objToSend: any, payload?: any) {
    if (payload.byteLength > 1) {
      const schema: any = [
        {
          name: 'event_type',
          type: 'enum',
          length: 1,
          enum: this._CommandScanResultsEvet,
        },
        { name: 'address', type: 'hex', length: 6, endianness: 'little' },
        {
          name: 'device_type',
          type: 'enum',
          length: 1,
          enum: this._CommandScanResultsDevice,
        },
        {
          name: 'address_type',
          type: 'enum',
          length: 1,
          enum: this._CommandScanResultsDeviceAddress,
        },
        {
          name: 'ble_event_type',
          type: 'enum',
          length: 1,
          enum: this._CommandScanResultsBleEvent,
        },
        { name: 'rssi', type: 'signed number', length: 4 },
        { name: 'adv_data', type: 'dataArray', length: 31 * 2 },
        { name: 'flag', type: 'number', length: 4 },
        { name: 'num_response', type: 'number', length: 4 },
        { name: 'advertise_length', type: 'number', length: 1 },
        { name: 'scan_response_length', type: 'number', length: 1 },
      ];

      const results: any = JsonBinaryConverter.convertFromBinaryToJson(
        schema,
        payload
      );

      results.scan_resp = results.adv_data.slice(
        results.advertise_length,
        results.advertise_length + results.scan_response_length
      );
      results.adv_data = results.adv_data.slice(0, results.advertise_length);

      delete results.num_response;
      delete results.advertise_length;
      delete results.scan_response_length;
      delete results.advertise_data;

      if (results.event_type === 'inquiry_result') {
        delete results.event_type;
        this._addRowForPath(objToSend, 'ble.scan_result', results);
      } else if (results.event_type === 'inquiry_complete') {
        this._addRowForPath(objToSend, 'ble.scan_result_finish', true);
      }
    }
  }

  public notifyFromBinaryConnect(objToSend: any, payload?: any) {
    if (payload.length === 7) {
      const schema: any = [
        { name: 'address', type: 'hex', length: 6, endianness: 'little' },
        {
          name: 'status',
          type: 'enum',
          length: 1,
          enum: { connected: 0, disconnected: 1 },
        },
      ];

      const results: any = JsonBinaryConverter.convertFromBinaryToJson(
        schema,
        payload
      );
      this._addRowForPath(objToSend, 'ble.status_update', results);
    }
  }

  public notifyFromBinaryServices(objToSend: any, payload?: any) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );

    if (results.service_uuid !== null) {
      this._addRowForPath(objToSend, 'ble.get_service_result', results);
    } else {
      delete results.service_uuid;
      this._addRowForPath(objToSend, 'ble.get_service_result_finish', results);
    }
  }

  public notifyFromBinaryChacateristics(objToSend: any, payload?: any) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      {
        name: 'properties',
        type: 'enum',
        length: 1,
        enum: this._CommandCharacteristicsProperties,
        flags: true,
      },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );

    if (results.characteristic_uuid !== null) {
      this._addRowForPath(objToSend, 'ble.get_characteristic_result', results);
    } else {
      delete results.characteristic_uuid;
      delete results.properties;
      this._addRowForPath(
        objToSend,
        'ble.get_characteristic_result_finish',
        results
      );
    }
  }

  public notifyFromBinaryReadChacateristics(objToSend: any, payload?: any) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
      { name: 'data', type: 'dataArray', length: null },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.result =
      results.result === this._commandResults.success ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.read_characteristic_result', results);
  }

  public notifyFromBinaryWriteChacateristics(objToSend: any, payload?: any) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.result =
      results.result === this._commandResults.success ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.write_characteristic_result', results);
  }

  public notifyFromBinaryRegisterNotifyChacateristic(
    objToSend: any,
    payload?: any
  ) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.result =
      results.result === this._commandResults.success ? 'success' : 'failed';
    this._addRowForPath(
      objToSend,
      'ble.register_notify_characteristic_result',
      results
    );
  }

  public notifyFromBinaryUnregisterNotifyChacateristic(
    objToSend: any,
    payload?: any
  ) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.result =
      results.result === this._commandResults.success ? 'success' : 'failed';
    this._addRowForPath(
      objToSend,
      'ble.unregister_notify_characteristic_result',
      results
    );
  }

  public notifyFromBinaryNotifyChacateristic(objToSend: any, payload?: any) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'is_notify', type: 'int', length: 1 },
      { name: 'data', type: 'dataArray', length: null },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.is_notify = results.is_notify === 1;
    this._addRowForPath(objToSend, 'ble.notify_characteristic', results);
  }

  public notifyFromBinaryDescriptors(objToSend: any, payload?: any) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );

    if (results.descriptor_uuid !== null) {
      this._addRowForPath(objToSend, 'ble.get_descriptor_result', results);
    } else {
      delete results.descriptor_uuid;
      this._addRowForPath(
        objToSend,
        'ble.get_descriptor_result_finish',
        results
      );
    }
  }

  public notifyFromBinaryReadDescriptor(objToSend: any, payload?: any) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
      { name: 'data', type: 'dataArray', length: null },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.result =
      results.result === this._commandResults.success ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.read_descriptor_result', results);
  }

  public notifyFromBinaryWriteDescriptor(objToSend: any, payload?: any) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.result =
      results.result === this._commandResults.success ? 'success' : 'failed';
    this._addRowForPath(objToSend, 'ble.write_descriptor_result', results);
  }

  public notifyFromBinaryServerConnectionState(objToSend: any, payload?: any) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      {
        name: 'status',
        type: 'enum',
        length: 1,
        enum: { connected: 1, disconnected: 0 },
      },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    this._addRowForPath(objToSend, 'ble.peripheral.connection_status', results);
  }

  public notifyFromBinaryServerWriteCharavteristicValue(
    objToSend: any,
    payload?: any
  ) {
    const schema: any = [
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.result =
      results.result === this._commandResults.success ? 'success' : 'failed';
    this._addRowForPath(
      objToSend,
      'ble.peripheral.write_characteristic_result',
      results
    );
  }

  public notifyFromBinaryServerReadCharavteristicValue(
    objToSend: any,
    payload?: any
  ) {
    const schema: any = [
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'data', type: 'dataArray', length: null },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.result = 'success'; // always success
    this._addRowForPath(
      objToSend,
      'ble.peripheral.read_characteristic_result',
      results
    );
  }

  public notifyFromBinaryServerNotifyReadCharavteristicValue(
    objToSend: any,
    payload?: any
  ) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    this._addRowForPath(
      objToSend,
      'ble.peripheral.notify_read_characteristic',
      results
    );
  }

  public notifyFromBinaryServerNotifyWriteCharavteristicValue(
    objToSend: any,
    payload?: any
  ) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'data', type: 'dataArray', length: null },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    this._addRowForPath(
      objToSend,
      'ble.peripheral.notify_write_characteristic',
      results
    );
  }

  public notifyFromBinaryServerReadDescriptorValue(
    objToSend: any,
    payload?: any
  ) {
    const schema: any = [
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'data', type: 'dataArray', length: null },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.result = 'success'; // always success
    this._addRowForPath(
      objToSend,
      'ble.peripheral.read_descriptor_result',
      results
    );
  }

  public notifyFromBinaryServerWriteDescriptorValue(
    objToSend: any,
    payload?: any
  ) {
    const schema: any = [
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'result', type: 'int', length: 1 },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    results.result =
      results.result === this._commandResults.success ? 'success' : 'failed';
    this._addRowForPath(
      objToSend,
      'ble.peripheral.write_descriptor_result',
      results
    );
  }

  public notifyFromBinaryServerNotifyReadDescriptorValue(
    objToSend: any,
    payload?: any
  ) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    this._addRowForPath(
      objToSend,
      'ble.peripheral.notify_read_descriptor',
      results
    );
  }

  public notifyFromBinaryServerNotifyWriteDescriptorValue(
    objToSend: any,
    payload?: any
  ) {
    const schema: any = [
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'data', type: 'dataArray', length: null },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );
    this._addRowForPath(
      objToSend,
      'ble.peripheral.notify_write_descriptor',
      results
    );
  }

  public notifyFromBinaryError(objToSend: any, payload?: any) {
    const schema: any = [
      { name: 'module_error_code', type: 'char', length: 1 },
      { name: 'error_code', type: 'char', length: 1 },
      { name: 'function_code', type: 'char', length: 1 },
      { name: 'address', type: 'hex', length: 6, endianness: 'little' },
      { name: 'service_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'characteristic_uuid', type: 'uuid', length: this.uuidLength },
      { name: 'descriptor_uuid', type: 'uuid', length: this.uuidLength },
    ];

    const results: any = JsonBinaryConverter.convertFromBinaryToJson(
      schema,
      payload
    );

    const errorMessage: any = {
      0x00: 'no error',
      0x01: 'device not connected',
      0x02: 'service not found',
      0x03: 'charavteristic not found',
      0x04: 'descriptor not found',
      0x05: 'no permission',
      0x06: 'device not found',
      0x07: 'ble is busy',
      0x08: 'service already running',
      0x09: 'security param are already set',
      0xff: 'error',
    };

    const functionMessage: any = {
      0: 'on setting advertisement data',
      1: 'on setting scan response data',
      2: 'on starting advertisement',
      3: 'on stopping advertisement',
      4: 'on starting scan',
      5: 'on stoping scan',
      6: '',
      7: 'on connecting device',
      8: 'on getting services',
      9: 'on getting characteristic',
      10: 'on writing characteristic',
      11: 'on reading characteristic',
      14: 'on getting descriptor',
      15: 'on writing descriptor',
      16: 'on reading descriptor',
      20: 'on start pheripheral',
      21: 'on notify connect',
      22: 'on adding service',
      23: 'on adding characteristic',
      24: 'on adding descriptor',
      25: 'on writing characteristic',
      26: 'on reading characteristic',
      27: 'on writing characteristic from remote',
      28: 'on reading characteristic from remote',
      29: 'on writing descriptor',
      30: 'on reading descriptor',
      31: 'on writing descriptor from remote',
      32: 'on reading descriptor from remote',
      33: 'on notify characteristic',
      34: 'on start/stop service',
      35: 'on set security auth param',
      36: 'on set security encryption level param',
      37: 'on set security key type param',
      38: 'on set security key size param',
      39: 'on set security io capability',
      40: 'on clear bonding devices list',
    };

    results.message =
      errorMessage[results.error_code] +
      ' ' +
      functionMessage[results.function_code];

    this.envelopError(objToSend, 'ble', results);
  }

  public _addRowForPath(sendObj: any, path: any, row: any) {
    const keys: any = path.split('.');
    let target: any = sendObj;
    for (let index = 0; index < keys.length - 1; index++) {
      target[keys[index]] = target[keys[index]] || {};
      target = target[keys[index]];
    }
    target[keys[keys.length - 1]] = row;
  }
}

export default WSCommandBle;
