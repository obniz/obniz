import ObnizConnection from "./ObnizConnection";
import { WiredNameMap, WiredNameOptionsMap } from "./ObnizPartsList";
export default class ObnizParts extends ObnizConnection {
    static _parts(): any;
    static PartsRegistrate(arg0: any, arg1?: any): void;
    static Parts(name: any): any;
    constructor(id: any, options?: any);
    isValidIO(io: any): boolean;
    wired<K extends keyof WiredNameMap>(partsname: K, options?: WiredNameOptionsMap[K]): WiredNameMap[K];
}
