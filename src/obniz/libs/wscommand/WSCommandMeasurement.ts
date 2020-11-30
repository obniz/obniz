/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from "./WSCommand";

class WSCommandMeasurement extends WSCommand {
  public module: any;
  public _CommandMeasurementEcho: any;
  public sendCommand: any;
  public validateCommandSchema: any;
  public WSCommandNotFoundError: any;

  constructor() {
    super();
    this.module = 12;

    this._CommandMeasurementEcho = 0;
  }

  // Commands

  public echo(params: any) {
    const triggerIO: any = params.echo.io_pulse;
    const triggerPosNeg: any = params.echo.pulse === "negative" ? false : true;
    const triggerWidthUs: any = Math.floor(params.echo.pulse_width * 1000);
    const echoIO: any = params.echo.io_echo;
    const responseCount: any = params.echo.measure_edges;
    let timeoutUs: any = params.echo.timeout * 1000;
    timeoutUs = parseInt(timeoutUs);

    const buf: any = new Uint8Array(13);
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
    const module: any = json.measure;
    if (module === undefined) {
      return;
    }
    const schemaData: any = [{ uri: "/request/measure/echo", onValid: this.echo }];
    const res: any = this.validateCommandSchema(schemaData, module, "measure");

    if (res.valid === 0) {
      if (res.invalidButLike.length > 0) {
        throw new Error(res.invalidButLike[0].message);
      } else {
        throw new this.WSCommandNotFoundError(`[measure]unknown command`);
      }
    }
  }

  public notifyFromBinary(objToSend: any, func: any, payload: any) {
    if (func === this._CommandMeasurementEcho) {
      let index: any = 0;
      const count: any = parseInt(payload[index++]);
      const array: any = [];
      for (let i = 0; i < count; i++) {
        let timing: any;
        const edge: any = payload[index++] > 0 ? true : false;
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
