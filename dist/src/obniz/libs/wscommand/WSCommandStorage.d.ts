import WSCommand from './WSCommand';
export default class WSCommandStorage extends WSCommand {
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
}
