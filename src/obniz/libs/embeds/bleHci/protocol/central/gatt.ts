/**
 * @packageDocumentation
 *
 * @ignore
 */
// let debug = require('debug')('att');
const debug: any = () => {};

/* eslint-disable no-unused-vars */

import events from "events";

/**
 * @ignore
 */
namespace ATT {
  export const OP_ERROR: any = 0x01;
  export const OP_MTU_REQ: any = 0x02;
  export const OP_MTU_RESP: any = 0x03;
  export const OP_FIND_INFO_REQ: any = 0x04;
  export const OP_FIND_INFO_RESP: any = 0x05;
  export const OP_READ_BY_TYPE_REQ: any = 0x08;
  export const OP_READ_BY_TYPE_RESP: any = 0x09;
  export const OP_READ_REQ: any = 0x0a;
  export const OP_READ_RESP: any = 0x0b;
  export const OP_READ_BLOB_REQ: any = 0x0c;
  export const OP_READ_BLOB_RESP: any = 0x0d;
  export const OP_READ_BY_GROUP_REQ: any = 0x10;
  export const OP_READ_BY_GROUP_RESP: any = 0x11;
  export const OP_WRITE_REQ: any = 0x12;
  export const OP_WRITE_RESP: any = 0x13;
  export const OP_PREPARE_WRITE_REQ: any = 0x16;
  export const OP_PREPARE_WRITE_RESP: any = 0x17;
  export const OP_EXECUTE_WRITE_REQ: any = 0x18;
  export const OP_EXECUTE_WRITE_RESP: any = 0x19;
  export const OP_HANDLE_NOTIFY: any = 0x1b;
  export const OP_HANDLE_IND: any = 0x1d;
  export const OP_HANDLE_CNF: any = 0x1e;
  export const OP_WRITE_CMD: any = 0x52;

  export const ECODE_SUCCESS: any = 0x00;
  export const ECODE_INVALID_HANDLE: any = 0x01;
  export const ECODE_READ_NOT_PERM: any = 0x02;
  export const ECODE_WRITE_NOT_PERM: any = 0x03;
  export const ECODE_INVALID_PDU: any = 0x04;
  export const ECODE_AUTHENTICATION: any = 0x05;
  export const ECODE_REQ_NOT_SUPP: any = 0x06;
  export const ECODE_INVALID_OFFSET: any = 0x07;
  export const ECODE_AUTHORIZATION: any = 0x08;
  export const ECODE_PREP_QUEUE_FULL: any = 0x09;
  export const ECODE_ATTR_NOT_FOUND: any = 0x0a;
  export const ECODE_ATTR_NOT_LONG: any = 0x0b;
  export const ECODE_INSUFF_ENCR_KEY_SIZE: any = 0x0c;
  export const ECODE_INVAL_ATTR_VALUE_LEN: any = 0x0d;
  export const ECODE_UNLIKELY: any = 0x0e;
  export const ECODE_INSUFF_ENC: any = 0x0f;
  export const ECODE_UNSUPP_GRP_TYPE: any = 0x10;
  export const ECODE_INSUFF_RESOURCES: any = 0x11;

  export const CID: any = 0x0004;
}

/**
 * @ignore
 */
namespace GATT {
  export const PRIM_SVC_UUID: any = 0x2800;
  export const INCLUDE_UUID: any = 0x2802;
  export const CHARAC_UUID: any = 0x2803;

  export const CLIENT_CHARAC_CFG_UUID: any = 0x2902;
  export const SERVER_CHARAC_CFG_UUID: any = 0x2903;
}
/* eslint-enable no-unused-vars */

/**
 * @ignore
 */
class Gatt extends events.EventEmitter {
  public _address: any;
  public _aclStream: any;
  public _services: any;
  public _characteristics: any;
  public _descriptors: any;
  public _currentCommand: any;
  public _commandQueue: any;
  public _mtu: any;
  public _security: any;
  public onAclStreamDataBinded: any;
  public onAclStreamEncryptBinded: any;
  public onAclStreamEncryptFailBinded: any;
  public onAclStreamEndBinded: any;

  constructor(address: any, aclStream: any) {
    super();
    this._address = address;
    this._aclStream = aclStream;

    this._services = {};
    this._characteristics = {};
    this._descriptors = {};

    this._currentCommand = null;
    this._commandQueue = [];

    this._mtu = 23;
    this._security = "low";

    this.onAclStreamDataBinded = this.onAclStreamData.bind(this);
    this.onAclStreamEncryptBinded = this.onAclStreamEncrypt.bind(this);
    this.onAclStreamEncryptFailBinded = this.onAclStreamEncryptFail.bind(this);
    this.onAclStreamEndBinded = this.onAclStreamEnd.bind(this);

    this._aclStream.on("data", this.onAclStreamDataBinded);
    this._aclStream.on("encrypt", this.onAclStreamEncryptBinded);
    this._aclStream.on("encryptFail", this.onAclStreamEncryptFailBinded);
    this._aclStream.on("end", this.onAclStreamEndBinded);
  }

  public onAclStreamData(cid: any, data?: any) {
    if (cid !== ATT.CID) {
      return;
    }

    if (
      this._currentCommand &&
      data.toString("hex") === this._currentCommand.buffer.toString("hex")
    ) {
      debug(this._address + ": echo ... echo ... echo ...");
    } else if (data[0] % 2 === 0) {
      if (process.env.NOBLE_MULTI_ROLE) {
        debug(
          this._address +
            ": multi-role flag in use, ignoring command meant for peripheral role.",
        );
      } else {
        const requestType: any = data[0];
        debug(
          this._address +
            ": replying with REQ_NOT_SUPP to 0x" +
            requestType.toString(16),
        );
        this.writeAtt(
          this.errorResponse(requestType, 0x0000, ATT.ECODE_REQ_NOT_SUPP),
        );
      }
    } else if (
      data[0] === ATT.OP_HANDLE_NOTIFY ||
      data[0] === ATT.OP_HANDLE_IND
    ) {
      const valueHandle: any = data.readUInt16LE(1);
      const valueData: any = data.slice(3);

      this.emit("handleNotify", this._address, valueHandle, valueData);

      if (data[0] === ATT.OP_HANDLE_IND) {
        this._queueCommand(this.handleConfirmation(), null, () => {
          this.emit("handleConfirmation", this._address, valueHandle);
        });
      }

      for (const serviceUuid in this._services) {
        for (const characteristicUuid in this._characteristics[serviceUuid]) {
          if (
            this._characteristics[serviceUuid][characteristicUuid]
              .valueHandle === valueHandle
          ) {
            this.emit(
              "notification",
              this._address,
              serviceUuid,
              characteristicUuid,
              valueData,
            );
          }
        }
      }
    } else if (!this._currentCommand) {
      debug(this._address + ": uh oh, no current command");
    } else {
      if (
        data[0] === ATT.OP_ERROR &&
        (data[4] === ATT.ECODE_AUTHENTICATION ||
          data[4] === ATT.ECODE_AUTHORIZATION ||
          data[4] === ATT.ECODE_INSUFF_ENC) &&
        this._security !== "medium"
      ) {
        this._aclStream.encrypt();
        return;
      }

      debug(this._address + ": read: " + data.toString("hex"));

      this._currentCommand.callback(data);

      this._currentCommand = null;

      while (this._commandQueue.length) {
        this._currentCommand = this._commandQueue.shift();

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

  public onAclStreamEncrypt(encrypt: any) {
    if (encrypt) {
      this._security = "medium";

      this.writeAtt(this._currentCommand.buffer);
    }
  }

  public onAclStreamEncryptFail() {}

  public onAclStreamEnd() {
    this._aclStream.removeListener("data", this.onAclStreamDataBinded);
    this._aclStream.removeListener("encrypt", this.onAclStreamEncryptBinded);
    this._aclStream.removeListener(
      "encryptFail",
      this.onAclStreamEncryptFailBinded,
    );
    this._aclStream.removeListener("end", this.onAclStreamEndBinded);
  }

  public writeAtt(data: any) {
    debug(this._address + ": write: " + data.toString("hex"));

    this._aclStream.write(ATT.CID, data);
  }

  public errorResponse(opcode: any, handle: any, status: any) {
    const buf: any = Buffer.alloc(5);

    buf.writeUInt8(ATT.OP_ERROR, 0);
    buf.writeUInt8(opcode, 1);
    buf.writeUInt16LE(handle, 2);
    buf.writeUInt8(status, 4);

    return buf;
  }

  public _queueCommand(buffer: any, callback: any, writeCallback?: any) {
    this._commandQueue.push({
      buffer,
      callback,
      writeCallback,
    });

    if (this._currentCommand === null) {
      while (this._commandQueue.length) {
        this._currentCommand = this._commandQueue.shift();

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

  public mtuRequest(mtu: any) {
    const buf: any = Buffer.alloc(3);

    buf.writeUInt8(ATT.OP_MTU_REQ, 0);
    buf.writeUInt16LE(mtu, 1);

    return buf;
  }

  public readByGroupRequest(startHandle: any, endHandle: any, groupUuid: any) {
    const buf: any = Buffer.alloc(7);

    buf.writeUInt8(ATT.OP_READ_BY_GROUP_REQ, 0);
    buf.writeUInt16LE(startHandle, 1);
    buf.writeUInt16LE(endHandle, 3);
    buf.writeUInt16LE(groupUuid, 5);

    return buf;
  }

  public readByTypeRequest(startHandle: any, endHandle: any, groupUuid: any) {
    const buf: any = Buffer.alloc(7);

    buf.writeUInt8(ATT.OP_READ_BY_TYPE_REQ, 0);
    buf.writeUInt16LE(startHandle, 1);
    buf.writeUInt16LE(endHandle, 3);
    buf.writeUInt16LE(groupUuid, 5);

    return buf;
  }

  public readRequest(handle: any) {
    const buf: any = Buffer.alloc(3);

    buf.writeUInt8(ATT.OP_READ_REQ, 0);
    buf.writeUInt16LE(handle, 1);

    return buf;
  }

  public readBlobRequest(handle: any, offset: any) {
    const buf: any = Buffer.alloc(5);

    buf.writeUInt8(ATT.OP_READ_BLOB_REQ, 0);
    buf.writeUInt16LE(handle, 1);
    buf.writeUInt16LE(offset, 3);

    return buf;
  }

  public findInfoRequest(startHandle: any, endHandle: any) {
    const buf: any = Buffer.alloc(5);

    buf.writeUInt8(ATT.OP_FIND_INFO_REQ, 0);
    buf.writeUInt16LE(startHandle, 1);
    buf.writeUInt16LE(endHandle, 3);

    return buf;
  }

  public writeRequest(handle: any, data: any, withoutResponse: any) {
    const buf: any = Buffer.alloc(3 + data.length);

    buf.writeUInt8(withoutResponse ? ATT.OP_WRITE_CMD : ATT.OP_WRITE_REQ, 0);
    buf.writeUInt16LE(handle, 1);

    for (let i = 0; i < data.length; i++) {
      buf.writeUInt8(data.readUInt8(i), i + 3);
    }

    return buf;
  }

  public prepareWriteRequest(handle: any, offset: any, data: any) {
    const buf: any = Buffer.alloc(5 + data.length);

    buf.writeUInt8(ATT.OP_PREPARE_WRITE_REQ, 0);
    buf.writeUInt16LE(handle, 1);
    buf.writeUInt16LE(offset, 3);

    for (let i = 0; i < data.length; i++) {
      buf.writeUInt8(data.readUInt8(i), i + 5);
    }

    return buf;
  }

  public executeWriteRequest(handle: any, cancelPreparedWrites?: any) {
    const buf: any = Buffer.alloc(2);

    buf.writeUInt8(ATT.OP_EXECUTE_WRITE_REQ, 0);
    buf.writeUInt8(cancelPreparedWrites ? 0 : 1, 1);

    return buf;
  }

  public handleConfirmation() {
    const buf: any = Buffer.alloc(1);

    buf.writeUInt8(ATT.OP_HANDLE_CNF, 0);

    return buf;
  }

  public exchangeMtu(mtu: any) {
    this._queueCommand(this.mtuRequest(mtu), (data: any) => {
      const opcode: any = data[0];

      if (opcode === ATT.OP_MTU_RESP) {
        const newMtu: any = data.readUInt16LE(1);

        debug(this._address + ": new MTU is " + newMtu);

        this._mtu = newMtu;
      }

      this.emit("mtu", this._address, this._mtu);
    });
  }

  public discoverServices(uuids: any) {
    const services: any = [];

    const callback: any = (data: any) => {
      const opcode: any = data[0];
      let i: any = 0;

      if (opcode === ATT.OP_READ_BY_GROUP_RESP) {
        const type: any = data[1];
        const num: any = (data.length - 2) / type;

        for (i = 0; i < num; i++) {
          services.push({
            startHandle: data.readUInt16LE(2 + i * type + 0),
            endHandle: data.readUInt16LE(2 + i * type + 2),
            uuid:
              type === 6
                ? data.readUInt16LE(2 + i * type + 4).toString(16)
                : data
                    .slice(2 + i * type + 4)
                    .slice(0, 16)
                    .toString("hex")
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(""),
          });
        }
      }

      if (
        opcode !== ATT.OP_READ_BY_GROUP_RESP ||
        services[services.length - 1].endHandle === 0xffff
      ) {
        const serviceUuids: any = [];
        for (i = 0; i < services.length; i++) {
          if (uuids.length === 0 || uuids.indexOf(services[i].uuid) !== -1) {
            serviceUuids.push(services[i].uuid);
          }

          this._services[services[i].uuid] = services[i];
        }
        this.emit("servicesDiscover", this._address, serviceUuids);
      } else {
        this._queueCommand(
          this.readByGroupRequest(
            services[services.length - 1].endHandle + 1,
            0xffff,
            GATT.PRIM_SVC_UUID,
          ),
          callback,
        );
      }
    };

    this._queueCommand(
      this.readByGroupRequest(0x0001, 0xffff, GATT.PRIM_SVC_UUID),
      callback,
    );
  }

  public discoverIncludedServices(serviceUuid: any, uuids: any) {
    const service: any = this._services[serviceUuid];
    const includedServices: any = [];

    const callback: any = (data: any) => {
      const opcode: any = data[0];
      let i: any = 0;

      if (opcode === ATT.OP_READ_BY_TYPE_RESP) {
        const type: any = data[1];
        const num: any = (data.length - 2) / type;

        for (i = 0; i < num; i++) {
          includedServices.push({
            endHandle: data.readUInt16LE(2 + i * type + 0),
            startHandle: data.readUInt16LE(2 + i * type + 2),
            uuid:
              type === 8
                ? data.readUInt16LE(2 + i * type + 6).toString(16)
                : data
                    .slice(2 + i * type + 6)
                    .slice(0, 16)
                    .toString("hex")
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(""),
          });
        }
      }

      if (
        opcode !== ATT.OP_READ_BY_TYPE_RESP ||
        includedServices[includedServices.length - 1].endHandle ===
          service.endHandle
      ) {
        const includedServiceUuids: any = [];

        for (i = 0; i < includedServices.length; i++) {
          if (
            uuids.length === 0 ||
            uuids.indexOf(includedServices[i].uuid) !== -1
          ) {
            includedServiceUuids.push(includedServices[i].uuid);
          }
        }

        this.emit(
          "includedServicesDiscover",
          this._address,
          service.uuid,
          includedServiceUuids,
        );
      } else {
        this._queueCommand(
          this.readByTypeRequest(
            includedServices[includedServices.length - 1].endHandle + 1,
            service.endHandle,
            GATT.INCLUDE_UUID,
          ),
          callback,
        );
      }
    };

    this._queueCommand(
      this.readByTypeRequest(
        service.startHandle,
        service.endHandle,
        GATT.INCLUDE_UUID,
      ),
      callback,
    );
  }

  public discoverCharacteristics(serviceUuid: any, characteristicUuids: any) {
    const service: any = this._services[serviceUuid];
    const characteristics: any = [];

    this._characteristics[serviceUuid] =
      this._characteristics[serviceUuid] || {};
    this._descriptors[serviceUuid] = this._descriptors[serviceUuid] || {};

    const callback: any = (data: any) => {
      const opcode: any = data[0];
      let i: any = 0;

      if (opcode === ATT.OP_READ_BY_TYPE_RESP) {
        const type: any = data[1];
        const num: any = (data.length - 2) / type;

        for (i = 0; i < num; i++) {
          characteristics.push({
            startHandle: data.readUInt16LE(2 + i * type + 0),
            properties: data.readUInt8(2 + i * type + 2),
            valueHandle: data.readUInt16LE(2 + i * type + 3),
            uuid:
              type === 7
                ? data.readUInt16LE(2 + i * type + 5).toString(16)
                : data
                    .slice(2 + i * type + 5)
                    .slice(0, 16)
                    .toString("hex")
                    .match(/.{1,2}/g)
                    .reverse()
                    .join(""),
          });
        }
      }

      if (
        opcode !== ATT.OP_READ_BY_TYPE_RESP ||
        characteristics[characteristics.length - 1].valueHandle ===
          service.endHandle
      ) {
        const characteristicsDiscovered: any = [];
        for (i = 0; i < characteristics.length; i++) {
          const properties: any = characteristics[i].properties;

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
            characteristic.properties.push("broadcast");
          }

          if (properties & 0x02) {
            characteristic.properties.push("read");
          }

          if (properties & 0x04) {
            characteristic.properties.push("writeWithoutResponse");
          }

          if (properties & 0x08) {
            characteristic.properties.push("write");
          }

          if (properties & 0x10) {
            characteristic.properties.push("notify");
          }

          if (properties & 0x20) {
            characteristic.properties.push("indicate");
          }

          if (properties & 0x40) {
            characteristic.properties.push("authenticatedSignedWrites");
          }

          if (properties & 0x80) {
            characteristic.properties.push("extendedProperties");
          }

          if (
            characteristicUuids.length === 0 ||
            characteristicUuids.indexOf(characteristic.uuid) !== -1
          ) {
            characteristicsDiscovered.push(characteristic);
          }
        }

        this.emit(
          "characteristicsDiscover",
          this._address,
          serviceUuid,
          characteristicsDiscovered,
        );
      } else {
        this._queueCommand(
          this.readByTypeRequest(
            characteristics[characteristics.length - 1].valueHandle + 1,
            service.endHandle,
            GATT.CHARAC_UUID,
          ),
          callback,
        );
      }
    };

    this._queueCommand(
      this.readByTypeRequest(
        service.startHandle,
        service.endHandle,
        GATT.CHARAC_UUID,
      ),
      callback,
    );
  }

  public read(serviceUuid: any, characteristicUuid: any) {
    if (
      !this._characteristics[serviceUuid] ||
      !this._characteristics[serviceUuid][characteristicUuid]
    ) {
      this.emit(
        "read",
        this._address,
        serviceUuid,
        characteristicUuid,
        Buffer.alloc(0),
        false,
      );
      return;
    }

    const characteristic: any = this._characteristics[serviceUuid][
      characteristicUuid
    ];

    let readData: any = Buffer.alloc(0);

    const callback: any = (data: any) => {
      const opcode: any = data[0];

      if (opcode === ATT.OP_READ_RESP || opcode === ATT.OP_READ_BLOB_RESP) {
        readData = Buffer.from(
          readData.toString("hex") + data.slice(1).toString("hex"),
          "hex",
        );

        if (data.length === this._mtu) {
          this._queueCommand(
            this.readBlobRequest(characteristic.valueHandle, readData.length),
            callback,
          );
        } else {
          this.emit(
            "read",
            this._address,
            serviceUuid,
            characteristicUuid,
            readData,
            true,
          );
        }
      } else if (opcode === ATT.OP_ERROR) {
        this.emit(
          "read",
          this._address,
          serviceUuid,
          characteristicUuid,
          Buffer.alloc(0),
          false,
        );
      } else {
        this.emit(
          "read",
          this._address,
          serviceUuid,
          characteristicUuid,
          readData,
          true,
        );
      }
    };

    this._queueCommand(this.readRequest(characteristic.valueHandle), callback);
  }

  public write(
    serviceUuid: any,
    characteristicUuid: any,
    data: any,
    withoutResponse: any,
  ) {
    if (
      !this._characteristics[serviceUuid] ||
      !this._characteristics[serviceUuid][characteristicUuid]
    ) {
      this.emit("write", this._address, serviceUuid, characteristicUuid, false);
      return;
    }

    const characteristic: any = this._characteristics[serviceUuid][
      characteristicUuid
    ];
    if (withoutResponse) {
      this._queueCommand(
        this.writeRequest(characteristic.valueHandle, data, true),
        null,
        () => {
          this.emit("write", this._address, serviceUuid, characteristicUuid);
        },
      );
    } else if (data.length + 3 > this._mtu) {
      return this.longWrite(
        serviceUuid,
        characteristicUuid,
        data,
        withoutResponse,
      );
    } else {
      this._queueCommand(
        this.writeRequest(characteristic.valueHandle, data, false),
        (_data: any) => {
          const opcode: any = _data[0];

          if (opcode === ATT.OP_WRITE_RESP || opcode === ATT.OP_ERROR) {
            this.emit(
              "write",
              this._address,
              serviceUuid,
              characteristicUuid,
              opcode === ATT.OP_WRITE_RESP,
            );
          }
        },
      );
    }
  }

  /* Perform a "long write" as described Bluetooth Spec section 4.9.4 "Write Long Characteristic Values" */
  public longWrite(
    serviceUuid: any,
    characteristicUuid: any,
    data: any,
    withoutResponse: any,
  ) {
    const characteristic: any = this._characteristics[serviceUuid][
      characteristicUuid
    ];
    const limit: any = this._mtu - 5;

    const prepareWriteCallback: any = (data_chunk: any) => {
      return (resp: any) => {
        const opcode: any = resp[0];

        if (opcode !== ATT.OP_PREPARE_WRITE_RESP) {
          debug(
            this._address +
              ": unexpected reply opcode %d (expecting ATT.OP_PREPARE_WRITE_RESP)",
            opcode,
          );
        } else {
          const expected_length: any = data_chunk.length + 5;

          if (resp.length !== expected_length) {
            /* the response should contain the data packet echoed back to the caller */
            debug(
              this._address +
                ": unexpected prepareWriteResponse length %d (expecting %d)",
              resp.length,
              expected_length,
            );
          }
        }
      };
    };

    /* split into prepare-write chunks and queue them */
    let offset: any = 0;

    while (offset < data.length) {
      const end: any = offset + limit;
      const chunk: any = data.slice(offset, end);
      this._queueCommand(
        this.prepareWriteRequest(characteristic.valueHandle, offset, chunk),
        prepareWriteCallback(chunk),
      );
      offset = end;
    }

    /* queue the execute command with a callback to emit the write signal when done */
    this._queueCommand(
      this.executeWriteRequest(characteristic.valueHandle),
      (resp: any) => {
        const opcode: any = resp[0];

        if (opcode === ATT.OP_EXECUTE_WRITE_RESP && !withoutResponse) {
          this.emit("write", this._address, serviceUuid, characteristicUuid);
        }
      },
    );
  }

  public broadcast(serviceUuid: any, characteristicUuid: any, broadcast: any) {
    const characteristic: any = this._characteristics[serviceUuid][
      characteristicUuid
    ];

    this._queueCommand(
      this.readByTypeRequest(
        characteristic.startHandle,
        characteristic.endHandle,
        GATT.SERVER_CHARAC_CFG_UUID,
      ),
      (data: any) => {
        const opcode: any = data[0];
        if (opcode === ATT.OP_READ_BY_TYPE_RESP) {
          // let type = data[1];
          const handle: any = data.readUInt16LE(2);
          let value: any = data.readUInt16LE(4);

          if (broadcast) {
            value |= 0x0001;
          } else {
            value &= 0xfffe;
          }

          const valueBuffer: any = Buffer.alloc(2);
          valueBuffer.writeUInt16LE(value, 0);

          this._queueCommand(
            this.writeRequest(handle, valueBuffer, false),
            (_data: any) => {
              const _opcode: any = _data[0];

              if (_opcode === ATT.OP_WRITE_RESP) {
                this.emit(
                  "broadcast",
                  this._address,
                  serviceUuid,
                  characteristicUuid,
                  broadcast,
                );
              }
            },
          );
        }
      },
    );
  }

  public notify(serviceUuid: any, characteristicUuid: any, notify: any) {
    const characteristic: any = this._characteristics[serviceUuid][
      characteristicUuid
    ];

    this._queueCommand(
      this.readByTypeRequest(
        characteristic.startHandle,
        characteristic.endHandle,
        GATT.CLIENT_CHARAC_CFG_UUID,
      ),
      (data: any) => {
        const opcode: any = data[0];
        if (opcode === ATT.OP_READ_BY_TYPE_RESP) {
          // let type = data[1];
          const handle: any = data.readUInt16LE(2);
          let value: any = data.readUInt16LE(4);

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

          this._queueCommand(
            this.writeRequest(handle, valueBuffer, false),
            (_data: any) => {
              const _opcode: any = _data[0];
              debug(
                "set notify write results: " + (_opcode === ATT.OP_WRITE_RESP),
              );
              // if (opcode === ATT.OP_WRITE_RESP) {
              this.emit(
                "notify",
                this._address,
                serviceUuid,
                characteristicUuid,
                notify,
              );
              // }
            },
          );
        }
      },
    );
  }

  public discoverDescriptors(serviceUuid: any, characteristicUuid: any) {
    const characteristic: any = this._characteristics[serviceUuid][
      characteristicUuid
    ];
    const descriptors: any = [];

    this._descriptors[serviceUuid][characteristicUuid] = {};

    const callback: any = (data: any) => {
      const opcode: any = data[0];
      let i: any = 0;

      if (opcode === ATT.OP_FIND_INFO_RESP) {
        const num: any = data[1];

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
        const descriptorUuids: any = [];
        for (i = 0; i < descriptors.length; i++) {
          descriptorUuids.push(descriptors[i].uuid);

          this._descriptors[serviceUuid][characteristicUuid][
            descriptors[i].uuid
          ] = descriptors[i];
        }

        this.emit(
          "descriptorsDiscover",
          this._address,
          serviceUuid,
          characteristicUuid,
          descriptorUuids,
        );
      } else {
        this._queueCommand(
          this.findInfoRequest(
            descriptors[descriptors.length - 1].handle + 1,
            characteristic.endHandle,
          ),
          callback,
        );
      }
    };

    this._queueCommand(
      this.findInfoRequest(
        characteristic.valueHandle + 1,
        characteristic.endHandle,
      ),
      callback,
    );
  }

  public readValue(
    serviceUuid: any,
    characteristicUuid: any,
    descriptorUuid: any,
  ) {
    if (
      !this._descriptors[serviceUuid] ||
      !this._descriptors[serviceUuid][characteristicUuid] ||
      !this._descriptors[serviceUuid][characteristicUuid][descriptorUuid]
    ) {
      this.emit(
        "valueRead",
        this._address,
        serviceUuid,
        characteristicUuid,
        descriptorUuid,
        Buffer.alloc(0),
        false,
      );
      return;
    }

    const descriptor: any = this._descriptors[serviceUuid][characteristicUuid][
      descriptorUuid
    ];

    this._queueCommand(this.readRequest(descriptor.handle), (data: any) => {
      const opcode: any = data[0];

      if (opcode === ATT.OP_READ_RESP || opcode === ATT.OP_ERROR) {
        this.emit(
          "valueRead",
          this._address,
          serviceUuid,
          characteristicUuid,
          descriptorUuid,
          data.slice(1),
          opcode === ATT.OP_READ_RESP,
        );
      }
    });
  }

  public writeValue(
    serviceUuid: any,
    characteristicUuid: any,
    descriptorUuid: any,
    data: any,
  ) {
    if (
      !this._descriptors[serviceUuid] ||
      !this._descriptors[serviceUuid][characteristicUuid] ||
      !this._descriptors[serviceUuid][characteristicUuid][descriptorUuid]
    ) {
      this.emit(
        "valueWrite",
        this._address,
        serviceUuid,
        characteristicUuid,
        descriptorUuid,
        false,
      );
      return;
    }

    const descriptor: any = this._descriptors[serviceUuid][characteristicUuid][
      descriptorUuid
    ];

    this._queueCommand(
      this.writeRequest(descriptor.handle, data, false),
      (_data: any) => {
        const opcode: any = _data[0];

        if (opcode === ATT.OP_WRITE_RESP || opcode === ATT.OP_ERROR) {
          this.emit(
            "valueWrite",
            this._address,
            serviceUuid,
            characteristicUuid,
            descriptorUuid,
            opcode === ATT.OP_WRITE_RESP,
          );
        }
      },
    );
  }

  public readHandle(handle: any) {
    this._queueCommand(this.readRequest(handle), (data: any) => {
      const opcode: any = data[0];

      if (opcode === ATT.OP_READ_RESP) {
        this.emit("handleRead", this._address, handle, data.slice(1));
      }
    });
  }

  public writeHandle(handle: any, data: any, withoutResponse: any) {
    if (withoutResponse) {
      this._queueCommand(this.writeRequest(handle, data, true), null, () => {
        this.emit("handleWrite", this._address, handle);
      });
    } else {
      this._queueCommand(
        this.writeRequest(handle, data, false),
        (_data: any) => {
          const opcode: any = _data[0];

          if (opcode === ATT.OP_WRITE_RESP) {
            this.emit("handleWrite", this._address, handle);
          }
        },
      );
    }
  }
}

export default Gatt;
