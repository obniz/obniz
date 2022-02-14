/**
 * @ignore
 */
// eslint-disable-next-line @typescript-eslint/no-namespace
export namespace ATT {
  export const OP_ERROR = 0x01;
  export const OP_MTU_REQ = 0x02;
  export const OP_MTU_RESP = 0x03;
  export const OP_FIND_INFO_REQ = 0x04;
  export const OP_FIND_INFO_RESP = 0x05;
  export const OP_FIND_BY_TYPE_REQ = 0x06;
  export const OP_FIND_BY_TYPE_RESP = 0x07;
  export const OP_READ_BY_TYPE_REQ = 0x08;
  export const OP_READ_BY_TYPE_RESP = 0x09;
  export const OP_READ_REQ = 0x0a;
  export const OP_READ_RESP = 0x0b;
  export const OP_READ_BLOB_REQ = 0x0c;
  export const OP_READ_BLOB_RESP = 0x0d;
  export const OP_READ_MULTI_REQ = 0x0e;
  export const OP_READ_MULTI_RESP = 0x0f;
  export const OP_READ_BY_GROUP_REQ = 0x10;
  export const OP_READ_BY_GROUP_RESP = 0x11;
  export const OP_WRITE_REQ = 0x12;
  export const OP_WRITE_RESP = 0x13;
  export const OP_PREPARE_WRITE_REQ = 0x16;
  export const OP_PREPARE_WRITE_RESP = 0x17;
  export const OP_EXECUTE_WRITE_REQ = 0x18;
  export const OP_EXECUTE_WRITE_RESP = 0x19;
  export const OP_HANDLE_NOTIFY = 0x1b;
  export const OP_HANDLE_IND = 0x1d;
  export const OP_HANDLE_CNF = 0x1e;
  export const OP_WRITE_CMD = 0x52;
  export const OP_SIGNED_WRITE_CMD = 0xd2;

  export const ECODE_SUCCESS = 0x00;
  export const ECODE_INVALID_HANDLE = 0x01;
  export const ECODE_READ_NOT_PERM = 0x02;
  export const ECODE_WRITE_NOT_PERM = 0x03;
  export const ECODE_INVALID_PDU = 0x04;
  export const ECODE_AUTHENTICATION = 0x05;
  export const ECODE_REQ_NOT_SUPP = 0x06;
  export const ECODE_INVALID_OFFSET = 0x07;
  export const ECODE_AUTHORIZATION = 0x08;
  export const ECODE_PREP_QUEUE_FULL = 0x09;
  export const ECODE_ATTR_NOT_FOUND = 0x0a;
  export const ECODE_ATTR_NOT_LONG = 0x0b;
  export const ECODE_INSUFF_ENCR_KEY_SIZE = 0x0c;
  export const ECODE_INVAL_ATTR_VALUE_LEN = 0x0d;
  export const ECODE_UNLIKELY = 0x0e;
  export const ECODE_INSUFF_ENC = 0x0f;
  export const ECODE_UNSUPP_GRP_TYPE = 0x10;
  export const ECODE_INSUFF_RESOURCES = 0x11;

  export const CID = 0x0004;
}

export const ATT_OP_READABLES: { [_: number]: string } = {
  0x01: 'OP_ERROR',
  0x02: 'OP_MTU_REQ',
  0x03: 'OP_MTU_RESP',
  0x04: 'OP_FIND_INFO_REQ',
  0x05: 'OP_FIND_INFO_RESP',
  0x08: 'OP_READ_BY_TYPE_REQ',
  0x09: 'OP_READ_BY_TYPE_RESP',
  0x0a: 'OP_READ_REQ',
  0x0b: 'OP_READ_RESP',
  0x0c: 'OP_READ_BLOB_REQ',
  0x0d: 'OP_READ_BLOB_RESP',
  0x10: 'OP_READ_BY_GROUP_REQ',
  0x11: 'OP_READ_BY_GROUP_RESP',
  0x12: 'OP_WRITE_REQ',
  0x13: 'OP_WRITE_RESP',
  0x16: 'OP_PREPARE_WRITE_REQ',
  0x17: 'OP_PREPARE_WRITE_RESP',
  0x18: 'OP_EXECUTE_WRITE_REQ',
  0x19: 'OP_EXECUTE_WRITE_RESP',
  0x1b: 'OP_HANDLE_NOTIFY',
  0x1d: 'OP_HANDLE_IND',
  0x1e: 'OP_HANDLE_CNF',
  0x52: 'OP_WRITE_CMD',
};

export const ATT_ECODE_READABLES: { [_: number]: string } = {
  0x00: 'ECODE_SUCCESS',
  0x01: 'ECODE_INVALID_HANDLE',
  0x02: 'ECODE_READ_NOT_PERM',
  0x03: 'ECODE_WRITE_NOT_PERM',
  0x04: 'ECODE_INVALID_PDU',
  0x05: 'ECODE_AUTHENTICATION',
  0x06: 'ECODE_REQ_NOT_SUPP',
  0x07: 'ECODE_INVALID_OFFSET',
  0x08: 'ECODE_AUTHORIZATION',
  0x09: 'ECODE_PREP_QUEUE_FULL',
  0x0a: 'ECODE_ATTR_NOT_FOUND',
  0x0b: 'ECODE_ATTR_NOT_LONG',
  0x0c: 'ECODE_INSUFF_ENCR_KEY_SIZE',
  0x0d: 'ECODE_INVAL_ATTR_VALUE_LEN',
  0x0e: 'ECODE_UNLIKELY',
  0x0f: 'ECODE_INSUFF_ENC',
  0x10: 'ECODE_UNSUPP_GRP_TYPE',
  0x11: 'ECODE_INSUFF_RESOURCES',
};
