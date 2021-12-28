/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';
declare class WSCommandMeasurement extends WSCommand {
    module: number;
    _CommandMeasurementEcho: number;
    constructor();
    echo(params: any): void;
    parseFromJson(json: any): void;
    notifyFromBinary(objToSend: any, func: number, payload: Uint8Array): void;
}
export default WSCommandMeasurement;
