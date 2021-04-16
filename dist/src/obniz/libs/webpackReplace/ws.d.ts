/**
 * @packageDocumentation
 * @ignore
 */
declare let ws: typeof WebSocket;
declare class CompatibleWebSocket extends ws {
    eventFunctionKetMap: {
        [key: string]: string;
    };
    constructor(url: string, protocols?: string | string[]);
    on(event: string, f: (...arg0: any) => void): void;
    removeAllListeners(event: string): void;
}
export default CompatibleWebSocket;
