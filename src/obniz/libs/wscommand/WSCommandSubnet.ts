/**
 * @packageDocumentation
 * @ignore
 */
import WSCommand from './WSCommand';

class WSCommandSubnet extends WSCommand.CommandClasses.WSCommandSystem {
  module = 16;

  _CommandRequestAllSubnet = 0;
  _CommandSendAddr = 1;
  _CommandSend = 2;
  _CommandFromAddr = 3;
  _CommandRecv = 4;
  _CommandRequestJoin = 5;

  currentFromAddr: null | string = null;
  delegate?: {
    onSubnetTableReceived: (subnetNodes: string[]) => void;
    onDataReceivedFromSubnet: (fromAddr: string, payload: Uint8Array) => void;
  };

  // Commands

  requestAllSubnet() {
    const buf = new Uint8Array([]);
    this.sendCommand(this._CommandRequestAllSubnet, buf);
  }

  sendToNode(targetMacAddr: string, data: Uint8Array) {
    let addr;
    try {
      addr = Buffer.from(targetMacAddr, 'hex');
    } catch (e) {
      console.error(e);
      return;
    }
    this.sendCommand(this._CommandSendAddr, new Uint8Array(addr));
    this.sendCommand(this._CommandSend, new Uint8Array(data));
  }

  sendToNodeBufAddr(bufAddr: Buffer, data: Uint8Array) {
    this.sendCommand(this._CommandSendAddr, new Uint8Array(bufAddr));
    this.sendCommand(this._CommandSend, new Uint8Array(data));
  }

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  parseFromJson() {}

  notifyFromBinary(
    objToSend: { [x: string]: any },
    func: number,
    payload: Uint8Array
  ) {
    switch (func) {
      case this._CommandRequestAllSubnet: {
        const subnetNodes: string[] = [];
        for (let i = 0; i < payload.length; i += 6) {
          subnetNodes.push(
            Buffer.from(payload.slice(i, i + 6)).toString('hex')
          );
        }
        this.delegate?.onSubnetTableReceived(subnetNodes);
        break;
      }
      case this._CommandFromAddr:
        this.currentFromAddr = Buffer.from(payload).toString('hex');
        break;
      case this._CommandRecv:
        if (this.currentFromAddr) {
          this.delegate?.onDataReceivedFromSubnet(
            this.currentFromAddr,
            payload
          );
        }
        break;
      case this._CommandRequestJoin: {
        const requestObj = Buffer.from(payload).toString();
        console.log(requestObj);
        break;
      }
      default:
        super.notifyFromBinary(objToSend, func, payload);
        break;
    }
  }

  /**
   * 参加要求フレームを送るように指示
   *
   */
  sendRequestConnectToNode(targetMacAddr: string) {
    this.sendToNode(
      targetMacAddr,
      WSCommand.framed(
        this.module,
        this._CommandRequestJoin,
        new Uint8Array([])
      )
    ); // send request
  }

  /**
   * Onlineになったことを通知。authorizeとは関係なく、http request を読みその返り値として返す
   *
   */
  sendOnline(targetMacAddr: string) {
    // system commandの16を送信。OSはwebsocket handshakeが終わったとして次の処理に進む
    this.sendToNode(
      targetMacAddr,
      WSCommand.framed(0, 16, new Uint8Array([1]))
    ); // make target online recognized
  }

  // 再起動を指示
  sendRebootToNode(targetMacAddr: string) {
    const framed = WSCommand.framed(0, 0, new Uint8Array([]));
    this.sendToNode(targetMacAddr, framed);
  }

  parsedRequestString(reqHeader: string) {
    const lines = reqHeader.split('\r\n');
    const ret: {
      obniz_id: null | string;
      headers: { [key: string]: string };
    } = {
      obniz_id: null,
      headers: {},
    };
    if (lines.length < 2) {
      throw new Error('invalid format');
    }
    let pathinfo = lines.shift();
    pathinfo = pathinfo?.replace('GET /endpoints/', '');
    pathinfo = pathinfo?.replace('/ws HTTP/1.1', '');
    ret.obniz_id = pathinfo ?? null;

    for (const line of lines) {
      const splitted = line.split(': ');
      if (splitted.length !== 2) {
        break;
      }
      ret.headers[splitted[0].toLowerCase()] = splitted[1];
    }
    return ret;
  }

  isWSRoomOnlyCommand() {
    return true;
  }
}

export default WSCommandSubnet;
