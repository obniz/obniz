/**
 * @packageDocumentation
 *
 * @ignore
 */
import {
  ObnizBleAttError,
  ObnizBleGattHandleError,
  ObnizBleUnknownCharacteristicError,
  ObnizError,
} from '../../../../../ObnizError';
import BleHelper from '../../bleHelper';
import { UUID } from '../../bleTypes';
import { ATT } from '../common/att';
import { GattCommon } from '../common/gatt';
import { AclStream } from './acl-stream';

// var debug = require('debug')('gatt');
const debug: any = () => {
  // do nothing.
};

import EventEmitter from 'eventemitter3';

/* eslint-disable no-unused-vars */

/**
 * @ignore
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
namespace GATT {
  export const PRIM_SVC_UUID = 0x2800;
  export const INCLUDE_UUID = 0x2802;
  export const CHARAC_UUID = 0x2803;

  export const CLIENT_CHARAC_CFG_UUID = 0x2902;
  export const SERVER_CHARAC_CFG_UUID = 0x2903;
}

/* eslint-enable no-unused-vars */

export type HandleIndex = number;

interface GattServiceHandle {
  type: 'service';
  uuid: UUID;
  attribute: any;
  startHandle: HandleIndex;
  endHandle: HandleIndex;
}

interface GattIncludedServiceHandle {
  type: 'includedService';
  uuid: UUID;
  attribute: any;
  startHandle: HandleIndex;
  endHandle: HandleIndex;
}

interface GattCharacteristicHandle {
  type: 'characteristic';
  uuid: UUID;
  attribute: any;
  properties: any;
  secure: number;
  startHandle: HandleIndex;
  valueHandle: HandleIndex;
}

interface GattCharacteristicValueHandle {
  type: 'characteristicValue';
  handle: HandleIndex;
  value: any;
}

interface GattDescriptorHandle {
  type: 'descriptor';
  uuid: UUID;
  attribute: any;
  handle: HandleIndex;
  value: Buffer;
  properties: number;
  secure: number;
}

type GattHandle =
  | GattServiceHandle
  | GattIncludedServiceHandle
  | GattCharacteristicHandle
  | GattCharacteristicValueHandle
  | GattDescriptorHandle;

type GattEventTypes = 'mtuChange';
/**
 * @ignore
 */
export class GattPeripheral extends EventEmitter<GattEventTypes> {
  public maxMtu = 256;
  public _mtu = 23;
  public _preparedWriteRequest: any = null;
  public onAclStreamDataBinded: any;
  public onAclStreamEndBinded: any;
  public _handles: GattHandle[] = [];
  public _aclStream?: AclStream;
  public _lastIndicatedAttribute: any;
  private _gattCommon: GattCommon;

  constructor() {
    super();

    this._reset();
    this._gattCommon = new GattCommon();

    this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
    this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
  }

  /**
   * @ignore
   * @private
   */
  public _reset() {
    this.maxMtu = 256;
    this._mtu = 23;
    this._preparedWriteRequest = null;

    this.setServices([]);
    this.setAclStream(undefined);
  }

  public setServices(services: any) {
    // var deviceName = process.env.BLENO_DEVICE_NAME || os.hostname();

    // base services and characteristics
    const allServices: any[] = [].concat(services);

    this._handles = [];

    let handle = 0;

    for (let i = 0; i < allServices.length; i++) {
      const service = allServices[i];

      handle++;
      const serviceHandle = handle;

      const serviceHandleData = {
        type: 'service' as const,
        uuid: service.uuid,
        attribute: service,
        startHandle: serviceHandle,
        // endHandle filled in below
      };

      for (let j = 0; j < service.characteristics.length; j++) {
        const characteristic = service.characteristics[j];

        let properties = 0;
        let secure = 0;

        if (characteristic.properties.indexOf('read') !== -1) {
          properties |= 0x02;

          if (characteristic.secure.indexOf('read') !== -1) {
            secure |= 0x02;
          }
        }

        if (characteristic.properties.indexOf('writeWithoutResponse') !== -1) {
          properties |= 0x04;

          if (characteristic.secure.indexOf('writeWithoutResponse') !== -1) {
            secure |= 0x04;
          }
        }

        if (characteristic.properties.indexOf('write') !== -1) {
          properties |= 0x08;

          if (characteristic.secure.indexOf('write') !== -1) {
            secure |= 0x08;
          }
        }

        if (characteristic.properties.indexOf('notify') !== -1) {
          properties |= 0x10;

          if (characteristic.secure.indexOf('notify') !== -1) {
            secure |= 0x10;
          }
        }

        if (characteristic.properties.indexOf('indicate') !== -1) {
          properties |= 0x20;

          if (characteristic.secure.indexOf('indicate') !== -1) {
            secure |= 0x20;
          }
        }

        handle++;
        const characteristicHandle = handle;

        handle++;
        const characteristicValueHandle = handle;

        this._handles[characteristicHandle] = {
          type: 'characteristic',
          uuid: characteristic.uuid,
          properties,
          secure,
          attribute: characteristic,
          startHandle: characteristicHandle,
          valueHandle: characteristicValueHandle,
        };

        this._handles[characteristicValueHandle] = {
          type: 'characteristicValue',
          handle: characteristicValueHandle,
          value: characteristic.value,
        };

        const hasCCCD = characteristic.descriptors.find(
          (e: any) => e.uuid === '2902'
        );
        if (hasCCCD || properties & 0x30) {
          // notify or indicate
          // add client characteristic configuration descriptor

          handle++;
          const clientCharacteristicConfigurationDescriptorHandle = handle;
          this._handles[clientCharacteristicConfigurationDescriptorHandle] = {
            type: 'descriptor',
            handle: clientCharacteristicConfigurationDescriptorHandle,
            uuid: '2902',
            attribute: characteristic,
            properties: 0x02 | 0x04 | 0x08, // read/write
            secure: secure & 0x10 ? 0x02 | 0x04 | 0x08 : 0,
            value: Buffer.from([0x00, 0x00]),
          };
        }

        for (let k = 0; k < characteristic.descriptors.length; k++) {
          const descriptor = characteristic.descriptors[k];
          if (descriptor.uuid === '2902') {
            continue;
          }
          handle++;
          const descriptorHandle = handle;

          this._handles[descriptorHandle] = {
            type: 'descriptor',
            handle: descriptorHandle,
            uuid: descriptor.uuid,
            attribute: descriptor,
            properties: 0x02, // read only
            secure: 0x00,
            value: descriptor.value,
          };
        }
      }

      this._handles[serviceHandle] = {
        ...serviceHandleData,
        endHandle: handle,
      };
    }

    // const debugHandles = [];
    // for (let i = 0; i < this._handles.length; i++) {
    //   const anHandle = this._handles[i];

    //   debugHandles[i] = {};
    //   for (let key in anHandle) {
    //     if (Buffer.isBuffer(anHandle[key])) {
    //       debugHandles[i][key] = anHandle[key] ? "Buffer('" + anHandle[key].toString("hex") + "', 'hex')" : null;
    //     } else if (key !== "attribute") {
    //       debugHandles[i][key] = anHandle[key];
    //     }
    //   }
    // }

    // debug("handles = " + JSON.stringify(debugHandles, null, 2));
  }

  public setAclStream(aclStream: AclStream | undefined) {
    this._mtu = 23;
    this._preparedWriteRequest = null;

    if (this._aclStream) {
      this._aclStream.end();
      this._aclStream.removeListener('data', this.onAclStreamDataBinded);
      this._aclStream.removeListener('end', this.onAclStreamEndBinded);
    }
    this._aclStream = aclStream;
    if (this._aclStream) {
      this._aclStream.on('data', this.onAclStreamDataBinded);
      this._aclStream.on('end', this.onAclStreamEndBinded);
    }
  }

  public onAclStreamData(cid: number, data: Buffer) {
    if (cid !== ATT.CID) {
      return;
    }

    this.handleRequest(data);
  }

  public onAclStreamEnd() {
    this._aclStream!.removeListener('data', this.onAclStreamDataBinded);
    this._aclStream!.removeListener('end', this.onAclStreamEndBinded);

    for (let i = 0; i < this._handles.length; i++) {
      const targetHandle = this._handles[i];
      if (targetHandle && targetHandle.type === 'descriptor') {
        if (
          targetHandle.uuid === '2902' &&
          targetHandle.value.readUInt16LE(0) !== 0
        ) {
          targetHandle.value = Buffer.from([0x00, 0x00]);

          if (targetHandle.attribute && targetHandle.attribute.emit) {
            targetHandle.attribute.emit('unsubscribe');
          }
        }
      }
    }
  }

  public send(data: Buffer) {
    debug('send: ' + data.toString('hex'));
    if (!this._aclStream) {
      throw new Error('_aclStream is not found');
    }
    this._aclStream.write(ATT.CID, data);
  }

  public handleRequest(request: Buffer) {
    debug('handing request: ' + request.toString('hex'));

    const requestType = request[0];
    let response = null;

    switch (requestType) {
      case ATT.OP_MTU_REQ:
        response = this.handleMtuRequest(request);
        break;

      case ATT.OP_FIND_INFO_REQ:
        response = this.handleFindInfoRequest(request);
        break;

      case ATT.OP_FIND_BY_TYPE_REQ:
        response = this.handleFindByTypeRequest(request);
        break;

      case ATT.OP_READ_BY_TYPE_REQ:
        response = this.handleReadByTypeRequest(request);
        break;

      case ATT.OP_READ_REQ:
      case ATT.OP_READ_BLOB_REQ:
        response = this.handleReadOrReadBlobRequest(request);
        break;

      case ATT.OP_READ_BY_GROUP_REQ:
        response = this.handleReadByGroupRequest(request);
        break;

      case ATT.OP_WRITE_REQ:
      case ATT.OP_WRITE_CMD:
        response = this.handleWriteRequestOrCommand(request);
        break;

      case ATT.OP_PREPARE_WRITE_REQ:
        response = this.handlePrepareWriteRequest(request);
        break;

      case ATT.OP_EXECUTE_WRITE_REQ:
        response = this.handleExecuteWriteRequest(request);
        break;

      case ATT.OP_HANDLE_CNF:
        response = this.handleConfirmation(request);
        break;

      default:
      case ATT.OP_READ_MULTI_REQ:
      case ATT.OP_SIGNED_WRITE_CMD:
        response = this._gattCommon.errorResponse(
          requestType,
          0x0000,
          ATT.ECODE_REQ_NOT_SUPP
        );
        break;
    }

    if (response) {
      debug('response: ' + response.toString('hex'));

      this.send(response);
    }
  }

  public handleMtuRequest(request: Buffer) {
    let mtu = request.readUInt16LE(1);

    if (mtu < 23) {
      mtu = 23;
    } else if (mtu > this.maxMtu) {
      mtu = this.maxMtu;
    }

    this._mtu = mtu;

    this.emit('mtuChange', this._mtu);

    const response = Buffer.alloc(3);

    response.writeUInt8(ATT.OP_MTU_RESP, 0);
    response.writeUInt16LE(mtu, 1);

    return response;
  }

  public handleFindInfoRequest(request: Buffer) {
    let response = null;

    const startHandle = request.readUInt16LE(1);
    const endHandle = request.readUInt16LE(3);

    const infos = [];
    let uuid = null;

    for (let i = startHandle; i <= endHandle; i++) {
      const handle = this._handles[i];

      if (!handle) {
        break;
      }

      uuid = null;

      if ('service' === handle.type) {
        uuid = '2800';
      } else if ('includedService' === handle.type) {
        uuid = '2802';
      } else if ('characteristic' === handle.type) {
        uuid = '2803';
      } else if ('characteristicValue' === handle.type) {
        const targetHandle = this._handles[i - 1];
        if (!targetHandle || targetHandle.type !== 'characteristic') {
          throw new ObnizBleGattHandleError('cannot find target handle');
        }
        uuid = targetHandle.uuid;
      } else if ('descriptor' === handle.type) {
        uuid = handle.uuid;
      }

      if (uuid) {
        infos.push({
          handle: i,
          uuid,
        });
      }
    }

    if (infos.length) {
      const uuidSize = infos[0].uuid.length / 2;
      let numInfo = 1;

      for (let i = 1; i < infos.length; i++) {
        if (infos[0].uuid.length !== infos[i].uuid.length) {
          break;
        }
        numInfo++;
      }

      const lengthPerInfo = uuidSize === 2 ? 4 : 18;
      const maxInfo = Math.floor((this._mtu - 2) / lengthPerInfo);
      numInfo = Math.min(numInfo, maxInfo);

      response = Buffer.alloc(2 + numInfo * lengthPerInfo);

      response[0] = ATT.OP_FIND_INFO_RESP;
      response[1] = uuidSize === 2 ? 0x01 : 0x2;

      for (let i = 0; i < numInfo; i++) {
        const info = infos[i];

        response.writeUInt16LE(info.handle, 2 + i * lengthPerInfo);

        uuid = BleHelper.hex2reversedBuffer(info.uuid);
        for (let j = 0; j < uuid.length; j++) {
          response[2 + i * lengthPerInfo + 2 + j] = uuid[j];
        }
      }
    } else {
      response = this._gattCommon.errorResponse(
        ATT.OP_FIND_INFO_REQ,
        startHandle,
        ATT.ECODE_ATTR_NOT_FOUND
      );
    }

    return response;
  }

  public handleFindByTypeRequest(request: any) {
    let response = null;

    const startHandle = request.readUInt16LE(1);
    const endHandle = request.readUInt16LE(3);
    const uuid = BleHelper.buffer2reversedHex(request.slice(5, 7));
    const value = BleHelper.buffer2reversedHex(request.slice(7));

    const handles = [];
    let handle: any;

    for (let i = startHandle; i <= endHandle; i++) {
      handle = this._handles[i];

      if (!handle) {
        break;
      }

      if (
        '2800' === uuid &&
        handle.type === 'service' &&
        handle.uuid === value
      ) {
        handles.push({
          start: handle.startHandle,
          end: handle.endHandle,
        });
      }
    }

    if (handles.length) {
      const lengthPerHandle = 4;
      let numHandles = handles.length;
      const maxHandles = Math.floor((this._mtu - 1) / lengthPerHandle);

      numHandles = Math.min(numHandles, maxHandles);

      response = Buffer.alloc(1 + numHandles * lengthPerHandle);

      response[0] = ATT.OP_FIND_BY_TYPE_RESP;

      for (let i = 0; i < numHandles; i++) {
        handle = handles[i];

        response.writeUInt16LE(handle.start, 1 + i * lengthPerHandle);
        response.writeUInt16LE(handle.end, 1 + i * lengthPerHandle + 2);
      }
    } else {
      response = this._gattCommon.errorResponse(
        ATT.OP_FIND_BY_TYPE_REQ,
        startHandle,
        ATT.ECODE_ATTR_NOT_FOUND
      );
    }

    return response;
  }

  public handleReadByGroupRequest(request: any) {
    let response = null;

    const startHandle = request.readUInt16LE(1);
    const endHandle = request.readUInt16LE(3);
    const uuid = BleHelper.buffer2reversedHex(request.slice(5));

    debug(
      'read by group: startHandle = 0x' +
        startHandle.toString(16) +
        ', endHandle = 0x' +
        endHandle.toString(16) +
        ', uuid = 0x' +
        uuid
    );

    if ('2800' === uuid || '2802' === uuid) {
      const services: (GattServiceHandle | GattIncludedServiceHandle)[] = [];
      const type = '2800' === uuid ? 'service' : 'includedService';

      for (let i = startHandle; i <= endHandle; i++) {
        const handle = this._handles[i];

        if (!handle) {
          break;
        }

        if (handle.type === type) {
          services.push(handle);
        }
      }

      if (services.length) {
        const uuidSize = services[0].uuid.length / 2;
        let numServices = 1;

        for (let i = 1; i < services.length; i++) {
          if (services[0].uuid.length !== services[i].uuid.length) {
            break;
          }
          numServices++;
        }

        const lengthPerService = uuidSize === 2 ? 6 : 20;
        const maxServices = Math.floor((this._mtu - 2) / lengthPerService);
        numServices = Math.min(numServices, maxServices);

        response = Buffer.alloc(2 + numServices * lengthPerService);

        response[0] = ATT.OP_READ_BY_GROUP_RESP;
        response[1] = lengthPerService;

        for (let i = 0; i < numServices; i++) {
          const service = services[i];

          response.writeUInt16LE(service.startHandle, 2 + i * lengthPerService);
          response.writeUInt16LE(
            service.endHandle,
            2 + i * lengthPerService + 2
          );

          const serviceUuid = BleHelper.hex2reversedBuffer(service.uuid);
          for (let j = 0; j < serviceUuid.length; j++) {
            response[2 + i * lengthPerService + 4 + j] = serviceUuid[j];
          }
        }
      } else {
        response = this._gattCommon.errorResponse(
          ATT.OP_READ_BY_GROUP_REQ,
          startHandle,
          ATT.ECODE_ATTR_NOT_FOUND
        );
      }
    } else {
      response = this._gattCommon.errorResponse(
        ATT.OP_READ_BY_GROUP_REQ,
        startHandle,
        ATT.ECODE_UNSUPP_GRP_TYPE
      );
    }

    return response;
  }

  public handleReadByTypeRequest(request: Buffer) {
    let response = null;
    const requestType = request[0];

    const startHandle = request.readUInt16LE(1);
    const endHandle = request.readUInt16LE(3);
    const uuid = BleHelper.buffer2reversedHex(request.slice(5));

    debug(
      'read by type: startHandle = 0x' +
        startHandle.toString(16) +
        ', endHandle = 0x' +
        endHandle.toString(16) +
        ', uuid = 0x' +
        uuid
    );

    if ('2803' === uuid) {
      const characteristics = [];

      for (let i = startHandle; i <= endHandle; i++) {
        const handle = this._handles[i];

        if (!handle) {
          break;
        }

        if (handle.type === 'characteristic') {
          characteristics.push(handle);
        }
      }

      if (characteristics.length) {
        const uuidSize = characteristics[0].uuid.length / 2;
        let numCharacteristics = 1;

        for (let i = 1; i < characteristics.length; i++) {
          if (
            characteristics[0].uuid.length !== characteristics[i].uuid.length
          ) {
            break;
          }
          numCharacteristics++;
        }

        const lengthPerCharacteristic = uuidSize === 2 ? 7 : 21;
        const maxCharacteristics = Math.floor(
          (this._mtu - 2) / lengthPerCharacteristic
        );
        numCharacteristics = Math.min(numCharacteristics, maxCharacteristics);

        response = Buffer.alloc(
          2 + numCharacteristics * lengthPerCharacteristic
        );

        response[0] = ATT.OP_READ_BY_TYPE_RESP;
        response[1] = lengthPerCharacteristic;

        for (let i = 0; i < numCharacteristics; i++) {
          const characteristic = characteristics[i];

          response.writeUInt16LE(
            characteristic.startHandle,
            2 + i * lengthPerCharacteristic
          );
          response.writeUInt8(
            characteristic.properties,
            2 + i * lengthPerCharacteristic + 2
          );
          response.writeUInt16LE(
            characteristic.valueHandle,
            2 + i * lengthPerCharacteristic + 3
          );

          const characteristicUuid = BleHelper.hex2reversedBuffer(
            characteristic.uuid
          );
          for (let j = 0; j < characteristicUuid.length; j++) {
            response[2 + i * lengthPerCharacteristic + 5 + j] =
              characteristicUuid[j];
          }
        }
      } else {
        response = this._gattCommon.errorResponse(
          ATT.OP_READ_BY_TYPE_REQ,
          startHandle,
          ATT.ECODE_ATTR_NOT_FOUND
        );
      }
    } else {
      let handleAttribute = null;
      let valueHandle = null;
      let secure = false;

      for (let i = startHandle; i <= endHandle; i++) {
        const handle = this._handles[i];

        if (!handle) {
          break;
        }

        if (handle.type === 'characteristic' && handle.uuid === uuid) {
          handleAttribute = handle.attribute;
          valueHandle = handle.valueHandle;
          secure = (handle.secure & 0x02) !== 0;
          break;
        } else if (handle.type === 'descriptor' && handle.uuid === uuid) {
          valueHandle = i;
          secure = (handle.secure & 0x02) !== 0;
          break;
        }
      }

      if (secure && !(this._aclStream && this._aclStream.encrypted)) {
        response = this._gattCommon.errorResponse(
          ATT.OP_READ_BY_TYPE_REQ,
          startHandle,
          ATT.ECODE_AUTHENTICATION
        );
      } else if (valueHandle) {
        const callback: any = ((_valueHandle: any) => {
          return (result: any, _data: any) => {
            let callbackResponse = null;

            if (ATT.ECODE_SUCCESS === result) {
              const dataLength = Math.min(_data.length, this._mtu - 4);
              callbackResponse = Buffer.alloc(4 + dataLength);

              callbackResponse[0] = ATT.OP_READ_BY_TYPE_RESP;
              callbackResponse[1] = dataLength + 2;
              callbackResponse.writeUInt16LE(_valueHandle, 2);
              for (let i = 0; i < dataLength; i++) {
                callbackResponse[4 + i] = _data[i];
              }
            } else {
              callbackResponse = this._gattCommon.errorResponse(
                requestType,
                _valueHandle,
                result
              );
            }

            debug('read by type response: ' + callbackResponse.toString('hex'));

            this.send(callbackResponse);
          };
        })(valueHandle);

        const targetHandle = this._handles[valueHandle];
        if (!targetHandle || targetHandle.type !== 'characteristicValue') {
          throw new ObnizBleGattHandleError(
            'unknown characteristicValue handle'
          );
        }
        const data = targetHandle.value;

        if (data) {
          callback(ATT.ECODE_SUCCESS, data);
        } else if (handleAttribute) {
          handleAttribute.emit('readRequest', 0, callback);
        } else {
          callback(ATT.ECODE_UNLIKELY);
        }
      } else {
        response = this._gattCommon.errorResponse(
          ATT.OP_READ_BY_TYPE_REQ,
          startHandle,
          ATT.ECODE_ATTR_NOT_FOUND
        );
      }
    }

    return response;
  }

  public handleReadOrReadBlobRequest(request: Buffer) {
    let response = null;

    const requestType = request[0];
    const valueHandle = request.readUInt16LE(1);
    const offset =
      requestType === ATT.OP_READ_BLOB_REQ ? request.readUInt16LE(3) : 0;

    const handle = this._handles[valueHandle];

    if (handle) {
      let result = null;
      let data = null;

      const callback = ((_requestType: any, _valueHandle: any) => {
        return (_result: any, _data: any) => {
          let callbackResponse = null;

          if (ATT.ECODE_SUCCESS === _result) {
            const dataLength = Math.min(_data.length, this._mtu - 1);
            callbackResponse = Buffer.alloc(1 + dataLength);

            callbackResponse[0] =
              _requestType === ATT.OP_READ_BLOB_REQ
                ? ATT.OP_READ_BLOB_RESP
                : ATT.OP_READ_RESP;
            for (let i = 0; i < dataLength; i++) {
              callbackResponse[1 + i] = _data[i];
            }
          } else {
            callbackResponse = this._gattCommon.errorResponse(
              _requestType,
              _valueHandle,
              _result
            );
          }

          debug('read response: ' + callbackResponse.toString('hex'));

          this.send(callbackResponse);
        };
      })(requestType, valueHandle);

      if (handle.type === 'service' || handle.type === 'includedService') {
        result = ATT.ECODE_SUCCESS;
        data = BleHelper.hex2reversedBuffer(handle.uuid);
      } else if (handle.type === 'characteristic') {
        const uuid = BleHelper.hex2reversedBuffer(handle.uuid);

        result = ATT.ECODE_SUCCESS;
        data = Buffer.alloc(3 + uuid.length);
        data.writeUInt8(handle.properties, 0);
        data.writeUInt16LE(handle.valueHandle, 1);

        for (let i = 0; i < uuid.length; i++) {
          data[i + 3] = uuid[i];
        }
      } else if (
        handle.type === 'characteristicValue' ||
        handle.type === 'descriptor'
      ) {
        const targetHandle =
          handle.type === 'descriptor'
            ? handle
            : (this._handles[valueHandle - 1] as GattCharacteristicHandle);
        const handleProperties = targetHandle.properties;
        const handleSecure = targetHandle.secure;
        const handleAttribute = targetHandle.attribute;

        if (handleProperties & 0x02) {
          if (
            handleSecure & 0x02 &&
            !(this._aclStream && this._aclStream.encrypted)
          ) {
            result = ATT.ECODE_AUTHENTICATION;
          } else {
            data = handle.value;

            if (data) {
              result = ATT.ECODE_SUCCESS;
            } else {
              handleAttribute.emit('readRequest', offset, callback);
            }
          }
        } else {
          result = ATT.ECODE_READ_NOT_PERM; // non-readable
        }
      }

      if (data && typeof data === 'string') {
        data = Buffer.from(data);
      }

      if (result === ATT.ECODE_SUCCESS && data && offset) {
        if (data.length < offset) {
          result = ATT.ECODE_INVALID_OFFSET;
          data = null;
        } else {
          data = data.slice(offset);
        }
      }

      if (result !== null) {
        callback(result, data);
      }
    } else {
      response = this._gattCommon.errorResponse(
        requestType,
        valueHandle,
        ATT.ECODE_INVALID_HANDLE
      );
    }

    return response;
  }

  public handleWriteRequestOrCommand(request: Buffer) {
    let response = null;

    const requestType = request[0];
    const withoutResponse = requestType === ATT.OP_WRITE_CMD;
    const valueHandle = request.readUInt16LE(1);
    const data = request.slice(3);
    const offset = 0;

    let handle = this._handles[valueHandle];

    if (handle) {
      if (handle.type === 'characteristicValue') {
        handle = this._handles[valueHandle - 1];
      }
      if (handle.type !== 'characteristic' && handle.type !== 'descriptor') {
        throw new ObnizBleGattHandleError('Request handle type is not valid');
      }

      const handleProperties = handle.properties;
      const handleSecure = handle.secure;

      if (
        handleProperties &&
        (withoutResponse ? handleProperties & 0x04 : handleProperties & 0x08)
      ) {
        const callback = ((
          _requestType: number,
          _valueHandle: HandleIndex,
          _withoutResponse: boolean
        ) => {
          return (result: any) => {
            if (!_withoutResponse) {
              let callbackResponse = null;

              if (ATT.ECODE_SUCCESS === result) {
                callbackResponse = Buffer.from([ATT.OP_WRITE_RESP]);
              } else {
                callbackResponse = this._gattCommon.errorResponse(
                  _requestType,
                  _valueHandle,
                  result
                );
              }

              debug('write response: ' + callbackResponse.toString('hex'));

              this.send(callbackResponse);
            }
          };
        })(requestType, valueHandle, withoutResponse);

        if (
          handleSecure & (withoutResponse ? 0x04 : 0x08) &&
          !(this._aclStream && this._aclStream.encrypted)
        ) {
          response = this._gattCommon.errorResponse(
            requestType,
            valueHandle,
            ATT.ECODE_AUTHENTICATION
          );
        } else if (handle.type === 'descriptor' && handle.uuid === '2902') {
          let result = null;

          if (data.length !== 2) {
            result = ATT.ECODE_INVAL_ATTR_VALUE_LEN;
          } else {
            const value = data.readUInt16LE(0);
            const handleAttribute = handle.attribute;

            handle.value = data;

            if (value & 0x0003) {
              const updateValueCallback = ((
                _valueHandle: any,
                _attribute: any
              ) => {
                return (_data: any) => {
                  const dataLength = Math.min(_data.length, this._mtu - 3);
                  const useNotify =
                    _attribute.properties.indexOf('notify') !== -1;
                  const useIndicate =
                    _attribute.properties.indexOf('indicate') !== -1;
                  let i: any;

                  if (useNotify) {
                    const notifyMessage = Buffer.alloc(3 + dataLength);

                    notifyMessage.writeUInt8(ATT.OP_HANDLE_NOTIFY, 0);
                    notifyMessage.writeUInt16LE(_valueHandle, 1);

                    for (i = 0; i < dataLength; i++) {
                      notifyMessage[3 + i] = _data[i];
                    }

                    debug('notify message: ' + notifyMessage.toString('hex'));
                    this.send(notifyMessage);

                    _attribute.emit('notify');
                  } else if (useIndicate) {
                    const indicateMessage = Buffer.alloc(3 + dataLength);

                    indicateMessage.writeUInt8(ATT.OP_HANDLE_IND, 0);
                    indicateMessage.writeUInt16LE(_valueHandle, 1);

                    for (i = 0; i < dataLength; i++) {
                      indicateMessage[3 + i] = _data[i];
                    }

                    this._lastIndicatedAttribute = _attribute;

                    debug(
                      'indicate message: ' + indicateMessage.toString('hex')
                    );
                    this.send(indicateMessage);
                  }
                };
              })(valueHandle - 1, handleAttribute);

              if (handleAttribute.emit) {
                handleAttribute.emit(
                  'subscribe',
                  this._mtu - 3,
                  updateValueCallback
                );
              }
            } else {
              handleAttribute.emit('unsubscribe');
            }

            result = ATT.ECODE_SUCCESS;
          }

          callback(result);
        } else {
          handle.attribute.emit(
            'writeRequest',
            data,
            offset,
            withoutResponse,
            callback
          );
        }
      } else {
        response = this._gattCommon.errorResponse(
          requestType,
          valueHandle,
          ATT.ECODE_WRITE_NOT_PERM
        );
      }
    } else {
      response = this._gattCommon.errorResponse(
        requestType,
        valueHandle,
        ATT.ECODE_INVALID_HANDLE
      );
    }

    return response;
  }

  public handlePrepareWriteRequest(request: Buffer) {
    let response = null;

    const requestType = request[0];
    const valueHandle = request.readUInt16LE(1);
    const offset = request.readUInt16LE(3);
    const data = request.slice(5);

    let handle = this._handles[valueHandle];

    if (handle) {
      if (handle.type === 'characteristicValue') {
        handle = this._handles[valueHandle - 1] as GattCharacteristicHandle;

        const handleProperties = handle.properties;
        const handleSecure = handle.secure;

        if (handleProperties && handleProperties & 0x08) {
          if (
            handleSecure & 0x08 &&
            !(this._aclStream && this._aclStream.encrypted)
          ) {
            response = this._gattCommon.errorResponse(
              requestType,
              valueHandle,
              ATT.ECODE_AUTHENTICATION
            );
          } else if (this._preparedWriteRequest) {
            if (this._preparedWriteRequest.handle !== handle) {
              response = this._gattCommon.errorResponse(
                requestType,
                valueHandle,
                ATT.ECODE_UNLIKELY
              );
            } else if (
              offset ===
              this._preparedWriteRequest.offset +
                this._preparedWriteRequest.data.length
            ) {
              this._preparedWriteRequest.data = Buffer.concat([
                this._preparedWriteRequest.data,
                data,
              ]);

              response = Buffer.alloc(request.length);
              request.copy(response);
              response[0] = ATT.OP_PREPARE_WRITE_RESP;
            } else {
              response = this._gattCommon.errorResponse(
                requestType,
                valueHandle,
                ATT.ECODE_INVALID_OFFSET
              );
            }
          } else {
            this._preparedWriteRequest = {
              handle,
              valueHandle,
              offset,
              data,
            };

            response = Buffer.alloc(request.length);
            request.copy(response);
            response[0] = ATT.OP_PREPARE_WRITE_RESP;
          }
        } else {
          response = this._gattCommon.errorResponse(
            requestType,
            valueHandle,
            ATT.ECODE_WRITE_NOT_PERM
          );
        }
      } else {
        response = this._gattCommon.errorResponse(
          requestType,
          valueHandle,
          ATT.ECODE_ATTR_NOT_LONG
        );
      }
    } else {
      response = this._gattCommon.errorResponse(
        requestType,
        valueHandle,
        ATT.ECODE_INVALID_HANDLE
      );
    }

    return response;
  }

  public handleExecuteWriteRequest(request: Buffer) {
    let response = null;

    const requestType = request[0];
    const flag = request[1];

    if (this._preparedWriteRequest) {
      if (flag === 0x00) {
        response = Buffer.from([ATT.OP_EXECUTE_WRITE_RESP]);
      } else if (flag === 0x01) {
        const callback = ((_requestType: number, _valueHandle: HandleIndex) => {
          return (result: number) => {
            let callbackResponse = null;

            if (ATT.ECODE_SUCCESS === result) {
              callbackResponse = Buffer.from([ATT.OP_EXECUTE_WRITE_RESP]);
            } else {
              callbackResponse = this._gattCommon.errorResponse(
                _requestType,
                _valueHandle,
                result
              );
            }

            debug(
              'execute write response: ' + callbackResponse.toString('hex')
            );

            this.send(callbackResponse);
          };
        })(requestType, this._preparedWriteRequest.valueHandle);

        this._preparedWriteRequest.handle.attribute.emit(
          'writeRequest',
          this._preparedWriteRequest.data,
          this._preparedWriteRequest.offset,
          false,
          callback
        );
      } else {
        response = this._gattCommon.errorResponse(
          requestType,
          0x0000,
          ATT.ECODE_UNLIKELY
        );
      }

      this._preparedWriteRequest = null;
    } else {
      response = this._gattCommon.errorResponse(
        requestType,
        0x0000,
        ATT.ECODE_UNLIKELY
      );
    }

    return response;
  }

  public handleConfirmation(request: Buffer) {
    if (this._lastIndicatedAttribute) {
      if (this._lastIndicatedAttribute.emit) {
        this._lastIndicatedAttribute.emit('indicate');
      }

      this._lastIndicatedAttribute = null;
    }
  }
}
