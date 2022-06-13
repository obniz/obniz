/**
 * @packageDocumentation
 * @ignore
 */
export declare namespace ATT {
    const OP_ERROR = 1;
    const OP_MTU_REQ = 2;
    const OP_MTU_RESP = 3;
    const OP_FIND_INFO_REQ = 4;
    const OP_FIND_INFO_RESP = 5;
    const OP_FIND_BY_TYPE_REQ = 6;
    const OP_FIND_BY_TYPE_RESP = 7;
    const OP_READ_BY_TYPE_REQ = 8;
    const OP_READ_BY_TYPE_RESP = 9;
    const OP_READ_REQ = 10;
    const OP_READ_RESP = 11;
    const OP_READ_BLOB_REQ = 12;
    const OP_READ_BLOB_RESP = 13;
    const OP_READ_MULTI_REQ = 14;
    const OP_READ_MULTI_RESP = 15;
    const OP_READ_BY_GROUP_REQ = 16;
    const OP_READ_BY_GROUP_RESP = 17;
    const OP_WRITE_REQ = 18;
    const OP_WRITE_RESP = 19;
    const OP_PREPARE_WRITE_REQ = 22;
    const OP_PREPARE_WRITE_RESP = 23;
    const OP_EXECUTE_WRITE_REQ = 24;
    const OP_EXECUTE_WRITE_RESP = 25;
    const OP_HANDLE_NOTIFY = 27;
    const OP_HANDLE_IND = 29;
    const OP_HANDLE_CNF = 30;
    const OP_WRITE_CMD = 82;
    const OP_SIGNED_WRITE_CMD = 210;
    const ECODE_SUCCESS = 0;
    const ECODE_INVALID_HANDLE = 1;
    const ECODE_READ_NOT_PERM = 2;
    const ECODE_WRITE_NOT_PERM = 3;
    const ECODE_INVALID_PDU = 4;
    const ECODE_AUTHENTICATION = 5;
    const ECODE_REQ_NOT_SUPP = 6;
    const ECODE_INVALID_OFFSET = 7;
    const ECODE_AUTHORIZATION = 8;
    const ECODE_PREP_QUEUE_FULL = 9;
    const ECODE_ATTR_NOT_FOUND = 10;
    const ECODE_ATTR_NOT_LONG = 11;
    const ECODE_INSUFF_ENCR_KEY_SIZE = 12;
    const ECODE_INVAL_ATTR_VALUE_LEN = 13;
    const ECODE_UNLIKELY = 14;
    const ECODE_INSUFF_ENC = 15;
    const ECODE_UNSUPP_GRP_TYPE = 16;
    const ECODE_INSUFF_RESOURCES = 17;
    const CID = 4;
}
export declare const ATT_OP_READABLES: {
    [_: number]: string;
};
export declare const ATT_ECODE_READABLES: {
    [_: number]: string;
};
