/**
 * @ignore
 */
export default class Mgmt {
    _ltkInfos: any;
    _hci: any;
    loadLongTermKeys: any;
    write: any;
    constructor(hciProtocol: any);
    nSocketData(data: any): void;
    nSocketError(error: any): void;
    ddLongTermKey(address: any, addressType: any, authenticated: any, master: any, ediv: any, rand: any, key: any): void;
    learLongTermKeys(): void;
    oadLongTermKeys(): void;
    rite(opcode: any, index: any, data: any): void;
}
