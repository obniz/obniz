/**
 * @packageDocumentation
 * @ignore
 */
declare let ws: any;
declare class CompatibleWebSocket extends ws {
    eventFunctionKetMap: {
        [key: string]: string;
    };
    constructor(...arg0: any);
    on(event: string, f: (...arg0: any) => void): void;
    removeAllListeners(event: string): void;
}
export default CompatibleWebSocket;
