/**
 * @packageDocumentation
 * @ignore
 */
import { WSCommandAbstract } from './WSCommandAbstract';
export declare class WSCommandPlugin extends WSCommandAbstract {
    module: number;
    _CommandSend: number;
    _CommandReceive: number;
    _CommandFrame: number;
    _CommandExec: number;
    _CommandDirective: number;
    _CommandLuaError: number;
    _CommandCallRequest: number;
    _CommandCallResponse: number;
    _CommandCloudTransactionRequest: number;
    _CommandCloudTransactionResponse: number;
    send(params: any, index: any): void;
    exec_lua(json: {
        exec_lua: string;
    }): void;
    reload_lua(json: {
        reload: boolean;
    }): void;
    call_request(json: {
        call_request: {
            id: number;
            lua: string;
        };
    }): void;
    cloud_transaction_response(json: {
        cloud_transaction_response: {
            id: number;
            success: boolean;
            result: string;
        };
    }): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
