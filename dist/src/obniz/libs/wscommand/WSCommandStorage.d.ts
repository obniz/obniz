import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandStorage extends WSCommandAbstract {
    module: number;
    _CommandSave: number;
    _CommandRead: number;
    save(json: {
        save: {
            fileName: string;
            data: Uint8Array;
        };
    }): void;
    read(json: {
        read: {
            fileName: string;
        };
    }): void;
    parseFromJson(json: {
        [k: string]: unknown;
    }): void;
    notifyFromBinary(objToSend: {
        [key: string]: any;
    }, func: number, payload: Uint8Array): void;
}
