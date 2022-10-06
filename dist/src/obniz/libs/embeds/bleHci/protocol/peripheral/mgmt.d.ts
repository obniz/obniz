/**
 * @packageDocumentation
 *
 * @ignore
 */
import { Hci } from '../hci';
/**
 * @ignore
 */
export declare class Mgmt {
    _ltkInfos: any;
    _hci: Hci;
    loadLongTermKeys: any;
    write: any;
    constructor(hciProtocol: any);
    nSocketData(data: any): void;
    nSocketError(error: any): void;
    ddLongTermKey(address: any, addressType: any, authenticated: any, master: any, ediv: any, rand: any, key: any): void;
    learLongTermKeys(): void;
    oadLongTermKeys(): void;
}
