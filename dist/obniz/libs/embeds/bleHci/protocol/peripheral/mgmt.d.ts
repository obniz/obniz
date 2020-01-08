export = Mgmt;
declare class Mgmt {
    construcotr(hciProtocol: any): void;
    _ltkInfos: any[] | undefined;
    _hci: any;
    nSocketData(data: any): void;
    nSocketError(error: any): void;
    ddLongTermKey(address: any, addressType: any, authenticated: any, master: any, ediv: any, rand: any, key: any): void;
    learLongTermKeys(): void;
    oadLongTermKeys(): void;
    rite(opcode: any, index: any, data: any): void;
}
