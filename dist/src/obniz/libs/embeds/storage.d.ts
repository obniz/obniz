/// <reference types="node" />
/// <reference types="node" />
import { Obniz } from '../../Obniz';
import { ComponentAbstract } from '../ComponentAbstact';
export declare class Storage extends ComponentAbstract {
    schemaBasePath(): string;
    protected _reset(): void;
    constructor(obniz: Obniz, info: {
        [k: string]: any;
    });
    save(fileName: string, data: number[]): void;
    savePluginLua(lua_script: string | number[] | Buffer): void;
    readWait(fileName: string): Promise<number[]>;
}
