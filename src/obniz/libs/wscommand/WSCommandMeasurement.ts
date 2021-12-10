/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';

class WSCommandMeasurement extends WSCommand {
  public module: number;
  public _CommandMeasurementEcho: number;

  constructor() {
    super();
    this.module = 12;

    this._CommandMeasurementEcho = 0;
  }

  // Commands

  public echo(params: any) {
    const triggerIO = params.echo.io_pulse;
    const triggerPosNeg = params.echo.pulse === 'negative' ? false : true;
    const triggerWidthUs = Math.floor(params.echo.pulse_width * 1000);
    const echoIO = params.echo.io_echo;
    const responseCount = params.echo.measure_edges;
    let timeoutUs = params.echo.timeout * 1000;
    timeoutUs = Math.floor(timeoutUs);

    const buf = new Uint8Array(13);
    buf[0] = 0;
    buf[1] = triggerIO;
    buf[2] = triggerPosNeg ? 1 : 0;
    buf[3] = triggerWidthUs >> (8 * 3);
    buf[4] = triggerWidthUs >> (8 * 2);
    buf[5] = triggerWidthUs >> 8;
    buf[6] = triggerWidthUs;
    buf[7] = echoIO;
    buf[8] = responseCount;
    buf[9] = timeoutUs >> (8 * 3);
    buf[10] = timeoutUs >> (8 * 2);
    buf[11] = timeoutUs >> 8;
    buf[12] = timeoutUs;
    this.sendCommand(this._CommandMeasurementEcho, buf);
  }

  public parseFromJson(json: any) {
    const module = json.measure;
    if (module === undefined) {
      return;
    }
    const schemaData = [{ uri: '/request/measure/echo', onValid: this.echo }];
    const res = this.validateCommandSchema(schemaData, module, 'measure');

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[measure]unknown command`);
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: number, payload: Uint8Array) {
    if (func === this._CommandMeasurementEcho) {
      let index = 0;
      const count = payload[index++];
      const array = [];
      for (let i = 0; i < count; i++) {
        let timing;
        const edge = payload[index++] > 0 ? true : false;
        timing = payload[index++] << (8 * 3);
        timing += payload[index++] << (8 * 2);
        timing += payload[index++] << 8;
        timing += payload[index++];
        timing = timing / 1000;
        array.push({
          edge,
          timing,
        });
      }
      objToSend.measure = {
        echo: array,
      };
    } else {
      super.notifyFromBinary(objToSend, func, payload);
    }
  }
}

export default WSCommandMeasurement;
