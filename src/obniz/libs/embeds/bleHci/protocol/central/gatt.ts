/**
 * @packageDocumentation
 *
 * @ignore
 */
 import BleCharacteristic from '../../bleCharacteristic';
 import { ATT, ATT_ECODE_READABLES, ATT_OP_READABLES } from '../common/att';
 import { GattCommon } from '../common/gatt';
 import GattPeripheral, { HandleIndex } from '../peripheral/gatt';
 import AclStream from './acl-stream';
 
 // let debug = require('debug')('att');
 const debug: any = () => {
   // do nothing.
 };
 
 /* eslint-disable no-unused-vars */
 
 import EventEmitter from 'eventemitter3';
 import {
   ObnizBleAttError,
   ObnizBleGattHandleError,
   ObnizBleOpError,
   ObnizBleUnknownCharacteristicError,
   ObnizBleUnknownDescriptorError,
   ObnizBleUnknownServiceError,
   ObnizError,
   ObnizTimeoutError,
 } from '../../../../../ObnizError';
 import BleHelper from '../../bleHelper';
 import BleRemoteService from '../../bleRemoteService';
 import { BleDeviceAddress, UUID } from '../../bleTypes';
 import { SmpEncryptOptions } from './smp';
 
 interface GattService {
   uuid: UUID;
   startHandle: number;
   endHandle: number;
 }
 
 interface GattCharacteristics {
   uuid: UUID;
   startHandle: number;
   properties: number;
   valueHandle: number;
   endHandle: number;
 }
 
 interface GattDescriptor {
   uuid: UUID;
   handle: number;
 }
 
 /**
  * @ignore
  */
 // eslint-disable-next-line @typescript-eslint/no-namespace
 namespace GATT {
   export const PRIM_SVC_UUID = 0x2800;
   export const SECONDARY_SVC_UUID = 0x2801;
   export const INCLUDE_UUID = 0x2802;
   export const CHARAC_UUID = 0x2803;
 
   export const CLIENT_CHARAC_CFG_UUID = 0x2902;
   export const SERVER_CHARAC_CFG_UUID = 0x2903;
 }
 
 /* eslint-enable no-unused-vars */
 
 type GattEventTypes =
   | 'notification'
   | 'handleConfirmation'
   | 'handleNotify'
   | 'end';
 
 interface CommandQueue {
   buffer: Buffer;
   callback?: () => void;
   writeCallback?: () => void;
 }
 
 /**
  * @ignore
  */
 class GattCentral extends EventEmitter<GattEventTypes> {
   public onAclStreamDataBinded: (cid: number, data: Buffer) => void;
   public onAclStreamEndBinded: () => void;
   private _address: BleDeviceAddress;
   private _aclStream: AclStream;
   private _services: { [key in UUID]: GattService } = {};
   private _characteristics: {
     [skey in UUID]: { [ckey in UUID]: GattCharacteristics };
   } = {};
   private _descriptors: {
     [skey in UUID]: { [ckey in UUID]: { [dkey in UUID]: GattDescriptor } };
   } = {};
   private _currentCommand: CommandQueue | null;
   private _commandQueue: CommandQueue[];
   private _mtu: number;
   private _security: 'low' | 'medium';
   private _commandPromises: Promise<any>[];
   private _gattCommon: GattCommon;
 
   private _remoteMtuRequest: null | number = null;
   private _gattPeripheral: GattPeripheral;
 
   constructor(address: BleDeviceAddress, aclStream: AclStream) {
     super();
 
     this._address = address;
     this._aclStream = aclStream;
 
     this._services = {};
     this._characteristics = {};
     this._descriptors = {};
 
     this._currentCommand = null;
     this._commandQueue = [];
     this._commandPromises = [];
 
     this._mtu = 23;
     this._security = 'low';
 
     this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
     this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);
 
     this._aclStream.on('data', this.onAclStreamDataBinded);
     this._aclStream.on('end', this.onAclStreamEndBinded);
 
     this._gattCommon = new GattCommon();
     this._gattPeripheral = new GattPeripheral();
     this._gattPeripheral.send = (data) => {
       this._execNoRespCommandWait(data).catch((e) => {
         // nothing to do
         console.error('_execNoRespCommandWait error', e);
       });
     };
   }
 
   public async encryptWait(options: SmpEncryptOptions): Promise<string> {
     const result = await this._serialPromiseQueueWait<string>(async () => {
       await this._aclStream.encryptWait(options);
       this._security = 'medium';
       return this._aclStream._smp.getKeys();
     });
     return result;
   }
 
   public setEncryptOption(options: SmpEncryptOptions) {
     this._aclStream.setEncryptOption(options);
   }
 
   public onEnd(reason: any) {
     this.emit('end', reason);
   }
 
   public async exchangeMtuWait(mtu: number | null) {
     this._aclStream
       .readWait(ATT.CID, ATT.OP_MTU_REQ)
       .catch((e) => {
         if (e instanceof ObnizTimeoutError) {
           return null;
         }
         throw e;
       })
       .then((mtuRequestData) => {
         // console.error('mtu request received');
         if (!mtuRequestData) {
           // throw timeout error and catched above
           return;
         }
         const requestMtu = mtuRequestData.readUInt16LE(1);
         // console.log(
         //   this._address + ': receive OP_MTU_REQ. new MTU is ' + requestMtu
         // );
         this._mtu = requestMtu;
         return this._execNoRespCommandWait(
           this._gattCommon.mtuResponse(this._mtu)
         );
       })
       .catch((e) => {
         // ignore timeout error
         console.error(e);
       });
 
     if (mtu === null) {
       debug(this._address + ': no exchange MTU : ' + this._mtu);
     } else {
       const data = await this._execCommandWait(
         this._gattCommon.mtuRequest(mtu),
         ATT.OP_MTU_RESP
       );
       const opcode = data[0];
       const newMtu = data.readUInt16LE(1);
       debug(this._address + ': new MTU is ' + newMtu);
       this._mtu = newMtu;
     }
 
     return this._mtu;
   }
 
   public async discoverServicesWait(uuids: UUID[]): Promise<UUID[]> {
     const pServices = await this.discoverPrimaryServicesWait(uuids);
     const sServices = await this.discoverSecondaryServicesWait(uuids);
     return [...pServices, ...sServices];
   }
 
   public async discoverPrimaryServicesWait(uuids: UUID[]): Promise<UUID[]> {
     const services: GattService[] = [];
     let startHandle = 0x0001;
 
     while (1) {
       const data = await this._execCommandWait(
         this._gattCommon.readByGroupRequest(
           startHandle,
           0xffff,
           GATT.PRIM_SVC_UUID
         ),
         [ATT.OP_READ_BY_GROUP_RESP, ATT.OP_ERROR]
       );
       const opcode = data[0];
       let i = 0;
       if (opcode === ATT.OP_READ_BY_GROUP_RESP) {
         const type = data[1];
         const num = (data.length - 2) / type;
 
         for (i = 0; i < num; i++) {
           services.push({
             startHandle: data.readUInt16LE(2 + i * type + 0),
             endHandle: data.readUInt16LE(2 + i * type + 2),
             uuid:
               type === 6
                 ? data.readUInt16LE(2 + i * type + 4).toString(16)
                 : BleHelper.buffer2reversedHex(
                     data.slice(2 + i * type + 4).slice(0, 16)
                   ),
           });
         }
       }
 
       if (
         opcode !== ATT.OP_READ_BY_GROUP_RESP ||
         services[services.length - 1].endHandle === 0xffff
       ) {
         const serviceUuids: string[] = [];
         for (i = 0; i < services.length; i++) {
           if (uuids.length === 0 || uuids.indexOf(services[i].uuid) !== -1) {
             serviceUuids.push(services[i].uuid);
           }
 
           this._services[services[i].uuid] = services[i];
         }
         return serviceUuids;
       }
       startHandle = services[services.length - 1].endHandle + 1;
     }
     throw new ObnizBleGattHandleError('unreachable code');
   }
 
   public async discoverSecondaryServicesWait(uuids: UUID[]): Promise<UUID[]> {
     const services: GattService[] = [];
     let startHandle = 0x0001;
 
     while (1) {
       const data = await this._execCommandWait(
         this._gattCommon.readByGroupRequest(
           startHandle,
           0xffff,
           GATT.SECONDARY_SVC_UUID
         ),
         [ATT.OP_READ_BY_GROUP_RESP, ATT.OP_ERROR]
       );
       const opcode = data[0];
       let i = 0;
       if (opcode === ATT.OP_READ_BY_GROUP_RESP) {
         const type = data[1];
         const num = (data.length - 2) / type;
 
         for (i = 0; i < num; i++) {
           services.push({
             startHandle: data.readUInt16LE(2 + i * type + 0),
             endHandle: data.readUInt16LE(2 + i * type + 2),
             uuid:
               type === 6
                 ? data.readUInt16LE(2 + i * type + 4).toString(16)
                 : BleHelper.buffer2reversedHex(
                     data.slice(2 + i * type + 4).slice(0, 16)
                   ),
           });
         }
       }
 
       if (
         opcode !== ATT.OP_READ_BY_GROUP_RESP ||
         services[services.length - 1].endHandle === 0xffff
       ) {
         const serviceUuids: string[] = [];
         for (i = 0; i < services.length; i++) {
           if (uuids.length === 0 || uuids.indexOf(services[i].uuid) !== -1) {
             serviceUuids.push(services[i].uuid);
           }
 
           this._services[services[i].uuid] = services[i];
         }
         return serviceUuids;
       }
       startHandle = services[services.length - 1].endHandle + 1;
     }
     throw new ObnizBleGattHandleError('unreachable code');
   }
 
   public async discoverIncludedServicesWait(serviceUuid: UUID, uuids: UUID[]) {
     const service = this.getService(serviceUuid);
     const includedServices: GattService[] = [];
     let startHandle = service.startHandle;
     while (1) {
       const data = await this._execCommandWait(
         this._gattCommon.readByTypeRequest(
           startHandle,
           service.endHandle,
           GATT.INCLUDE_UUID
         ),
         [ATT.OP_READ_BY_TYPE_RESP, ATT.OP_ERROR]
       );
       const opcode = data[0];
       let i = 0;
 
       if (opcode === ATT.OP_READ_BY_TYPE_RESP) {
         const type = data[1];
         const num = (data.length - 2) / type;
 
         for (i = 0; i < num; i++) {
           includedServices.push({
             endHandle: data.readUInt16LE(2 + i * type + 0),
             startHandle: data.readUInt16LE(2 + i * type + 2),
             uuid:
               type === 8
                 ? data.readUInt16LE(2 + i * type + 6).toString(16)
                 : BleHelper.buffer2reversedHex(
                     data.slice(2 + i * type + 6).slice(0, 16)
                   ),
           });
         }
       }
 
       if (
         opcode !== ATT.OP_READ_BY_TYPE_RESP ||
         includedServices[includedServices.length - 1].endHandle ===
           service.endHandle
       ) {
         const includedServiceUuids = [];
 
         for (i = 0; i < includedServices.length; i++) {
           if (
             uuids.length === 0 ||
             uuids.indexOf(includedServices[i].uuid) !== -1
           ) {
             includedServiceUuids.push(includedServices[i].uuid);
           }
         }
 
         return includedServiceUuids;
       }
       startHandle = includedServices[includedServices.length - 1].endHandle + 1;
     }
   }
 
   public async discoverCharacteristicsWait(
     serviceUuid: UUID,
     characteristicUuids: UUID[]
   ) {
     const service = this.getService(serviceUuid);
     const characteristics: GattCharacteristics[] = [];
 
     this._characteristics[serviceUuid] =
       this._characteristics[serviceUuid] || {};
     this._descriptors[serviceUuid] = this._descriptors[serviceUuid] || {};
     let startHandle = service.startHandle;
 
     while (1) {
       const data = await this._execCommandWait(
         this._gattCommon.readByTypeRequest(
           startHandle,
           service.endHandle,
           GATT.CHARAC_UUID
         ),
         [ATT.OP_READ_BY_TYPE_RESP, ATT.OP_ERROR]
       );
 
       const opcode = data[0];
       let i = 0;
 
       if (opcode === ATT.OP_READ_BY_TYPE_RESP) {
         const type = data[1];
         const num = (data.length - 2) / type;
 
         for (i = 0; i < num; i++) {
           characteristics.push({
             startHandle: data.readUInt16LE(2 + i * type + 0),
             endHandle: 0, // this is not defined before. but maybe required. (yukisato 2020/1/14)
             properties: data.readUInt8(2 + i * type + 2),
             valueHandle: data.readUInt16LE(2 + i * type + 3),
             uuid:
               type === 7
                 ? data.readUInt16LE(2 + i * type + 5).toString(16)
                 : BleHelper.buffer2reversedHex(
                     data.slice(2 + i * type + 5).slice(0, 16)
                   ),
           });
         }
       }
 
       if (
         opcode !== ATT.OP_READ_BY_TYPE_RESP ||
         characteristics[characteristics.length - 1].valueHandle ===
           service.endHandle
       ) {
         const characteristicsDiscovered = [];
         for (i = 0; i < characteristics.length; i++) {
           const properties = characteristics[i].properties;
 
           const characteristic: any = {
             properties: [],
             uuid: characteristics[i].uuid,
           };
 
           if (i !== 0) {
             characteristics[i - 1].endHandle =
               characteristics[i].startHandle - 1;
           }
 
           if (i === characteristics.length - 1) {
             characteristics[i].endHandle = service.endHandle;
           }
 
           this._characteristics[serviceUuid][characteristics[i].uuid] =
             characteristics[i];
 
           if (properties & 0x01) {
             characteristic.properties.push('broadcast');
           }
 
           if (properties & 0x02) {
             characteristic.properties.push('read');
           }
 
           if (properties & 0x04) {
             characteristic.properties.push('writeWithoutResponse');
           }
 
           if (properties & 0x08) {
             characteristic.properties.push('write');
           }
 
           if (properties & 0x10) {
             characteristic.properties.push('notify');
           }
 
           if (properties & 0x20) {
             characteristic.properties.push('indicate');
           }
 
           if (properties & 0x40) {
             characteristic.properties.push('authenticatedSignedWrites');
           }
 
           if (properties & 0x80) {
             characteristic.properties.push('extendedProperties');
           }
 
           if (
             characteristicUuids.length === 0 ||
             characteristicUuids.indexOf(characteristic.uuid) !== -1
           ) {
             characteristicsDiscovered.push(characteristic);
           }
         }
 
         return characteristicsDiscovered;
       }
       startHandle = characteristics[characteristics.length - 1].valueHandle + 1;
     }
     throw new ObnizBleGattHandleError('no reachable code');
   }
 
   public async readWait(
     serviceUuid: UUID,
     characteristicUuid: UUID
   ): Promise<Buffer> {
     const characteristic = this.getCharacteristic(
       serviceUuid,
       characteristicUuid
     );
 
     let readData = Buffer.alloc(0);
     while (1) {
       let data;
       if (readData.length === 0) {
         data = await this._execCommandWait(
           this._gattCommon.readRequest(characteristic.valueHandle),
           ATT.OP_READ_RESP
         );
       } else {
         data = await this._execCommandWait(
           this._gattCommon.readBlobRequest(
             characteristic.valueHandle,
             readData.length
           ),
           ATT.OP_READ_BLOB_RESP
         );
       }
       const opcode = data[0];
 
       readData = Buffer.from(
         readData.toString('hex') + data.slice(1).toString('hex'),
         'hex'
       );
 
       if (data.length === this._mtu) {
         // do nothing.
       } else {
         return readData;
       }
     }
     // never reach
     // eslint-disable-next-line no-unreachable
     return readData;
   }
 
   public async writeWait(
     serviceUuid: UUID,
     characteristicUuid: UUID,
     data: Buffer,
     withoutResponse: boolean
   ): Promise<void> {
     const characteristic = this.getCharacteristic(
       serviceUuid,
       characteristicUuid
     );
     if (withoutResponse) {
       await this._execNoRespCommandWait(
         this._gattCommon.writeRequest(characteristic.valueHandle, data, true)
       );
     } else if (data.length + 3 > this._mtu) {
       await this.longWriteWait(
         serviceUuid,
         characteristicUuid,
         data,
         withoutResponse
       );
     } else {
       await this._execCommandWait(
         this._gattCommon.writeRequest(characteristic.valueHandle, data, false),
         ATT.OP_WRITE_RESP
       );
     }
   }
 
   public async broadcastWait(
     serviceUuid: UUID,
     characteristicUuid: UUID,
     broadcast: boolean
   ) {
     const characteristic = this.getCharacteristic(
       serviceUuid,
       characteristicUuid
     );
 
     const data = await this._execCommandWait(
       this._gattCommon.readByTypeRequest(
         characteristic.startHandle,
         characteristic.endHandle,
         GATT.SERVER_CHARAC_CFG_UUID
       ),
       ATT.OP_READ_BY_TYPE_RESP
     );
 
     const opcode = data[0];
     // let type = data[1];
     const handle = data.readUInt16LE(2);
     let value = data.readUInt16LE(4);
 
     if (broadcast) {
       value |= 0x0001;
     } else {
       value &= 0xfffe;
     }
 
     const valueBuffer = Buffer.alloc(2);
     valueBuffer.writeUInt16LE(value, 0);
 
     const _data = await this._execCommandWait(
       this._gattCommon.writeRequest(handle, valueBuffer, false),
       ATT.OP_WRITE_RESP
     );
   }
 
   public async notifyWait(
     serviceUuid: UUID,
     characteristicUuid: UUID,
     notify: boolean
   ): Promise<void> {
     try {
       const characteristic = this.getCharacteristic(
         serviceUuid,
         characteristicUuid
       );
       const descriptor: any = this.getDescriptor(
         serviceUuid,
         characteristicUuid,
         '2902'
       );
       return await this.notifyByDescriptorWait(
         serviceUuid,
         characteristicUuid,
         notify
       );
     } catch (e) {
       debug(`failed to handle descriptor`);
     }
     return await this.notifyByHandleWait(
       serviceUuid,
       characteristicUuid,
       notify
     );
   }
 
   public async notifyByDescriptorWait(
     serviceUuid: UUID,
     characteristicUuid: UUID,
     notify: boolean
   ): Promise<void> {
     const characteristic = this.getCharacteristic(
       serviceUuid,
       characteristicUuid
     );
 
     let value = 0;
 
     const useNotify = characteristic.properties & 0x10;
     const useIndicate = characteristic.properties & 0x20;
 
     if (notify) {
       if (useNotify) {
         value |= 0x0001;
       } else if (useIndicate) {
         value |= 0x0002;
       }
     } else {
       if (useNotify) {
         value &= 0xfffe;
       } else if (useIndicate) {
         value &= 0xfffd;
       }
     }
 
     const valueBuffer = Buffer.alloc(2);
     valueBuffer.writeUInt16LE(value, 0);
 
     let _data = null;
 
     // if (handle) {
     //   _data = await this._execCommandWait(
     //     this._gattCommon.writeRequest(handle, valueBuffer, false),
     //     ATT.OP_WRITE_RESP
     //   );
     // } else {
     _data = await this.writeValueWait(
       serviceUuid,
       characteristicUuid,
       '2902',
       valueBuffer
     );
     // }
 
     const _opcode = _data && _data[0];
     debug('set notify write results: ' + (_opcode === ATT.OP_WRITE_RESP));
   }
 
   public async notifyByHandleWait(
     serviceUuid: any,
     characteristicUuid: any,
     notify: any
   ): Promise<void> {
     const characteristic: any = this.getCharacteristic(
       serviceUuid,
       characteristicUuid
     );
     // const descriptor: any = this.getDescriptor(serviceUuid, characteristicUuid, "2902");
 
     let value: any = null;
     let handle: any = null;
     try {
       value = await this.readValueWait(serviceUuid, characteristicUuid, '2902');
     } catch (e) {
       // retry
       const data = await this._execCommandWait(
         this._gattCommon.readByTypeRequest(
           characteristic.startHandle,
           characteristic.endHandle,
           GATT.CLIENT_CHARAC_CFG_UUID
         ),
         ATT.OP_READ_BY_TYPE_RESP
       );
 
       const opcode: any = data[0];
       // let type = data[1];
       handle = data.readUInt16LE(2);
       value = data.readUInt16LE(4);
     }
 
     const useNotify: any = characteristic.properties & 0x10;
     const useIndicate: any = characteristic.properties & 0x20;
 
     if (notify) {
       if (useNotify) {
         value |= 0x0001;
       } else if (useIndicate) {
         value |= 0x0002;
       }
     } else {
       if (useNotify) {
         value &= 0xfffe;
       } else if (useIndicate) {
         value &= 0xfffd;
       }
     }
 
     const valueBuffer: any = Buffer.alloc(2);
     valueBuffer.writeUInt16LE(value, 0);
 
     let _data = null;
 
     if (handle) {
       _data = await this._execCommandWait(
         this._gattCommon.writeRequest(handle, valueBuffer, false),
         ATT.OP_WRITE_RESP
       );
     } else {
       _data = await this.writeValueWait(
         serviceUuid,
         characteristicUuid,
         '2902',
         valueBuffer
       );
     }
 
     const _opcode: any = _data && _data[0];
     debug('set notify write results: ' + (_opcode === ATT.OP_WRITE_RESP));
   }
 
   public async discoverDescriptorsWait(
     serviceUuid: UUID,
     characteristicUuid: UUID
   ): Promise<UUID[]> {
     const characteristic = this.getCharacteristic(
       serviceUuid,
       characteristicUuid
     );
     const descriptors: GattDescriptor[] = [];
 
     this._descriptors[serviceUuid][characteristicUuid] = {};
     let startHandle = characteristic.valueHandle + 1;
     while (1) {
       const data = await this._execCommandWait(
         this._gattCommon.findInfoRequest(startHandle, characteristic.endHandle),
         [ATT.OP_FIND_INFO_RESP, ATT.OP_ERROR]
       );
 
       const opcode = data[0];
       let i = 0;
 
       if (opcode === ATT.OP_FIND_INFO_RESP) {
         const num = data[1];
 
         for (i = 0; i < num; i++) {
           descriptors.push({
             handle: data.readUInt16LE(2 + i * 4 + 0),
             uuid: data.readUInt16LE(2 + i * 4 + 2).toString(16),
           });
         }
       }
 
       if (
         opcode !== ATT.OP_FIND_INFO_RESP ||
         descriptors[descriptors.length - 1].handle === characteristic.endHandle
       ) {
         const descriptorUuids = [];
         for (i = 0; i < descriptors.length; i++) {
           descriptorUuids.push(descriptors[i].uuid);
 
           this._descriptors[serviceUuid][characteristicUuid][
             descriptors[i].uuid
           ] = descriptors[i];
         }
 
         return descriptorUuids;
       }
       startHandle = descriptors[descriptors.length - 1].handle + 1;
     }
 
     // never reach
     // eslint-disable-next-line no-unreachable
     return [];
   }
 
   public async readValueWait(
     serviceUuid: UUID,
     characteristicUuid: UUID,
     descriptorUuid: UUID
   ): Promise<Buffer> {
     const descriptor = this.getDescriptor(
       serviceUuid,
       characteristicUuid,
       descriptorUuid
     );
 
     const data = await this._execCommandWait(
       this._gattCommon.readRequest(descriptor.handle),
       ATT.OP_READ_RESP
     );
 
     return data.slice(1);
   }
 
   public async writeValueWait(
     serviceUuid: UUID,
     characteristicUuid: UUID,
     descriptorUuid: UUID,
     data: Buffer
   ): Promise<Buffer> {
     const descriptor = this.getDescriptor(
       serviceUuid,
       characteristicUuid,
       descriptorUuid
     );
 
     return await this._execCommandWait(
       this._gattCommon.writeRequest(descriptor.handle, data, false),
       ATT.OP_WRITE_RESP
     );
   }
 
   public async readHandleWait(handle: HandleIndex): Promise<Buffer> {
     const data = await this._execCommandWait(
       this._gattCommon.readRequest(handle),
       ATT.OP_READ_RESP
     );
     return data.slice(1);
   }
 
   public async writeHandleWait(
     handle: HandleIndex,
     data: Buffer,
     withoutResponse: boolean
   ) {
     if (withoutResponse) {
       await this._execNoRespCommandWait(
         this._gattCommon.writeRequest(handle, data, true)
       );
     } else {
       await this._execCommandWait(
         this._gattCommon.writeRequest(handle, data, false),
         ATT.OP_WRITE_RESP
       );
     }
   }
 
   private onAclStreamData(cid: number, data: Buffer) {
     if (cid !== ATT.CID) {
       return;
     }
     const requestType = data[0];
 
     // notify / indicate
     if (
       requestType === ATT.OP_HANDLE_NOTIFY ||
       requestType === ATT.OP_HANDLE_IND
     ) {
       const valueHandle = data.readUInt16LE(1);
       const valueData = data.slice(3);
 
       this.emit('handleNotify', this._address, valueHandle, valueData);
 
       if (data[0] === ATT.OP_HANDLE_IND) {
         // background
         this._execNoRespCommandWait(this._gattCommon.handleConfirmation()).then(
           () => {
             this.emit('handleConfirmation', this._address, valueHandle);
           }
         );
       }
 
       for (const serviceUuid in this._services) {
         for (const characteristicUuid in this._characteristics[serviceUuid]) {
           if (
             this._characteristics[serviceUuid][characteristicUuid]
               .valueHandle === valueHandle
           ) {
             this.emit(
               'notification',
               this._address,
               serviceUuid,
               characteristicUuid,
               valueData
             );
           }
         }
       }
     } else if (
       requestType === ATT.OP_FIND_INFO_REQ ||
       requestType === ATT.OP_FIND_BY_TYPE_REQ ||
       requestType === ATT.OP_READ_BY_TYPE_REQ ||
       requestType === ATT.OP_READ_REQ ||
       requestType === ATT.OP_READ_BLOB_REQ ||
       requestType === ATT.OP_READ_BY_GROUP_REQ ||
       requestType === ATT.OP_WRITE_REQ ||
       requestType === ATT.OP_WRITE_CMD ||
       requestType === ATT.OP_PREPARE_WRITE_REQ ||
       requestType === ATT.OP_EXECUTE_WRITE_REQ ||
       requestType === ATT.OP_HANDLE_CNF ||
       requestType === ATT.OP_READ_MULTI_REQ ||
       requestType === ATT.OP_SIGNED_WRITE_CMD
     ) {
       // console.error('_gattPeripheral.handleRequest', requestType);
       this._gattPeripheral.handleRequest(data);
     }
   }
 
   private onAclStreamEnd() {
     this._aclStream.removeListener('data', this.onAclStreamDataBinded);
     this._aclStream.removeListener('end', this.onAclStreamEndBinded);
   }
 
   private writeAtt(data: Buffer) {
     const opCode = data[0];
     const handle = data.length > 3 ? data.readUInt16LE(1) : 'none';
     debug(
       `ATT: opCode=${opCode}(${ATT_OP_READABLES[opCode]}) handle=${handle} address=` +
         this._address +
         ': write: ' +
         data.toString('hex')
     );
 
     this._aclStream.write(ATT.CID, data);
   }
 
   /* Perform a "long write" as described Bluetooth Spec section 4.9.4 "Write Long Characteristic Values" */
   private async longWriteWait(
     serviceUuid: UUID,
     characteristicUuid: UUID,
     data: Buffer,
     withoutResponse: boolean
   ) {
     const characteristic = this.getCharacteristic(
       serviceUuid,
       characteristicUuid
     );
     const limit = this._mtu - 5;
 
     /* split into prepare-write chunks and queue them */
     let offset = 0;
 
     while (offset < data.length) {
       const end = offset + limit;
       const chunk = data.slice(offset, end);
       const _resp = await this._execCommandWait(
         this._gattCommon.prepareWriteRequest(
           characteristic.valueHandle,
           offset,
           chunk
         ),
         ATT.OP_PREPARE_WRITE_RESP
       );
 
       const expected_length = chunk.length + 5;
 
       if (_resp.length !== expected_length) {
         /* the response should contain the data packet echoed back to the caller */
         throw new Error(
           `unexpected prepareWriteResponse length ${_resp.length} (expecting ${expected_length})`
         );
       }
 
       offset = end;
     }
 
     if (withoutResponse) {
       await this._execNoRespCommandWait(
         this._gattCommon.executeWriteRequest(characteristic.valueHandle)
       );
     } else {
       await this._execCommandWait(
         this._gattCommon.executeWriteRequest(characteristic.valueHandle),
         ATT.OP_EXECUTE_WRITE_RESP
       );
     }
    //  throw new ObnizBleOpError();
   }
 
   private getService(serviceUuid: UUID): GattService {
     if (!this._services[serviceUuid]) {
       throw new ObnizBleUnknownServiceError(this._address, serviceUuid);
     }
 
     return this._services[serviceUuid];
   }
 
   private getCharacteristic(serviceUuid: UUID, characteristicUuid: UUID) {
     if (
       !this._characteristics[serviceUuid] ||
       !this._characteristics[serviceUuid][characteristicUuid]
     ) {
       throw new ObnizBleUnknownCharacteristicError(
         this._address,
         serviceUuid,
         characteristicUuid
       );
     }
 
     return this._characteristics[serviceUuid][characteristicUuid];
   }
 
   private getDescriptor(
     serviceUuid: UUID,
     characteristicUuid: UUID,
     descriptorUuid: UUID
   ) {
     if (
       !this._descriptors[serviceUuid] ||
       !this._descriptors[serviceUuid][characteristicUuid] ||
       !this._descriptors[serviceUuid][characteristicUuid][descriptorUuid]
     ) {
       throw new ObnizBleUnknownDescriptorError(
         this._address,
         serviceUuid,
         characteristicUuid,
         descriptorUuid
       );
     }
 
     return this._descriptors[serviceUuid][characteristicUuid][descriptorUuid];
   }
 
   private _queueCommand(buffer: Buffer, callback: any, writeCallback?: any) {
     this._commandQueue.push({
       buffer,
       callback,
       writeCallback,
     });
 
     this._runQueueCommand();
   }
 
   private _runQueueCommand() {
     if (this._currentCommand === null) {
       while (this._commandQueue.length) {
         this._currentCommand = this._commandQueue.shift() as CommandQueue;
 
         this.writeAtt(this._currentCommand.buffer);
         if (this._currentCommand.callback) {
           break;
         } else if (this._currentCommand.writeCallback) {
           this._currentCommand.writeCallback();
           this._currentCommand = null;
         }
       }
     }
   }
 
   private _serialPromiseQueueWait<T>(func: () => Promise<T>): Promise<T> {
     const onfinish = () => {
       this._commandPromises = this._commandPromises.filter(
         (e) => e !== resultPromise
       );
       if (disconnectReject) {
         this.off('end', disconnectReject);
       }
     };
 
     let disconnectReject: null | EventEmitter.ListenerFn = null;
     const doPromise = Promise.all(this._commandPromises)
       .catch((error) => {
         // nothing
       })
       .then(() => {
         return func();
       })
       .catch((reason) => {
         throw reason;
       })
       .then(
         (result: T) => {
           onfinish();
           return Promise.resolve(result);
         },
         (error) => {
           onfinish();
           return Promise.reject(error);
         }
       );
     const disconnectPromise = new Promise((resolve, reject) => {
       disconnectReject = (reason: any) => {
         onfinish();
         reject(reason);
       };
       this.on('end', disconnectReject);
     });
     const resultPromise = Promise.race([doPromise, disconnectPromise]);
     this._commandPromises.push(resultPromise);
     return resultPromise as Promise<T>;
   }
 
   private _execCommandWait(
     buffer: Buffer,
     waitOpcode: number | number[]
   ): Promise<Buffer> {
     const waitOpcodes: number[] = Array.isArray(waitOpcode)
       ? waitOpcode
       : [waitOpcode];
     let errorHandle = true;
     if (!waitOpcodes.includes(ATT.OP_ERROR)) {
       waitOpcodes.push(ATT.OP_ERROR);
       errorHandle = false;
     }
     return this._serialPromiseQueueWait<Buffer>(async () => {
       while (1) {
         this.writeAtt(buffer);
         const promises = [];
         for (const code of waitOpcodes) {
           promises.push(this._aclStream.readWait(ATT.CID, code));
         }
         debug(`ATT: wait for opcode=${waitOpcodes}`);
         const data: Buffer = await Promise.race(promises);
         const opCode = data.readUInt8(0);
         debug(`ATT: received opCode=${opCode}(${ATT_OP_READABLES[opCode]})`);
         if (opCode === ATT.OP_ERROR) {
           const errCode = data[4];
           if (
             (errCode === ATT.ECODE_AUTHENTICATION ||
               errCode === ATT.ECODE_AUTHORIZATION ||
               errCode === ATT.ECODE_INSUFF_ENC) &&
             this._security !== 'medium'
           ) {
             // retry after encrypt
             debug(`ATT: going to encrypt and try it later.`);
             await this._aclStream.encryptWait();
             continue;
           }
           if (errorHandle) {
             return data;
           }
           const requestOpCode = data.readUInt8(1);
           const attributeHandle = data.readUInt16LE(2);
 
           throw new ObnizBleAttError(
             errCode,
             `errorCode=${errCode}(${ATT_ECODE_READABLES[errCode]}) for request_opcode=${requestOpCode}(${ATT_OP_READABLES[requestOpCode]}) atributeHandle=${attributeHandle} `
           );
         }
         return data;
       }
 
       // unreachable here
       // eslint-disable-next-line no-unreachable
       return Buffer.from([]);
     });
   }
 
   private _execNoRespCommandWait(buffer: Buffer): Promise<void> {
     return this._serialPromiseQueueWait(async () => {
       this.writeAtt(buffer);
     });
   }
 }
 
 export default GattCentral;