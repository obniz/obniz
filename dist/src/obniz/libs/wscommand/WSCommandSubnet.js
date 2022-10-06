"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WSCommandSubnet = void 0;
/**
 * @packageDocumentation
 * @ignore
 */
const WSCommand_1 = require("./WSCommand");
class WSCommandSubnet extends WSCommand_1.WSCommand.CommandClasses.WSCommandSystem {
    constructor() {
        super(...arguments);
        this.module = 16;
        this._CommandRequestAllSubnet = 0;
        this._CommandSendAddr = 1;
        this._CommandSend = 2;
        this._CommandFromAddr = 3;
        this._CommandRecv = 4;
        this._CommandRequestJoin = 5;
        this.currentFromAddr = null;
    }
    // Commands
    requestAllSubnet() {
        const buf = new Uint8Array([]);
        this.sendCommand(this._CommandRequestAllSubnet, buf);
    }
    sendToNode(targetMacAddr, data) {
        let addr;
        try {
            addr = Buffer.from(targetMacAddr, 'hex');
        }
        catch (e) {
            console.error(e);
            return;
        }
        this.sendCommand(this._CommandSendAddr, new Uint8Array(addr));
        this.sendCommand(this._CommandSend, new Uint8Array(data));
    }
    sendToNodeBufAddr(bufAddr, data) {
        this.sendCommand(this._CommandSendAddr, new Uint8Array(bufAddr));
        this.sendCommand(this._CommandSend, new Uint8Array(data));
    }
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    parseFromJson() { }
    notifyFromBinary(objToSend, func, payload) {
        var _a, _b;
        switch (func) {
            case this._CommandRequestAllSubnet: {
                const subnetNodes = [];
                for (let i = 0; i < payload.length; i += 6) {
                    subnetNodes.push(Buffer.from(payload.slice(i, i + 6)).toString('hex'));
                }
                (_a = this.delegate) === null || _a === void 0 ? void 0 : _a.onSubnetTableReceived(subnetNodes);
                break;
            }
            case this._CommandFromAddr:
                this.currentFromAddr = Buffer.from(payload).toString('hex');
                break;
            case this._CommandRecv:
                if (this.currentFromAddr) {
                    (_b = this.delegate) === null || _b === void 0 ? void 0 : _b.onDataReceivedFromSubnet(this.currentFromAddr, payload);
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
    sendRequestConnectToNode(targetMacAddr) {
        this.sendToNode(targetMacAddr, WSCommand_1.WSCommand.framed(this.module, this._CommandRequestJoin, new Uint8Array([]))); // send request
    }
    /**
     * Onlineになったことを通知。authorizeとは関係なく、http request を読みその返り値として返す
     *
     */
    sendOnline(targetMacAddr) {
        // system commandの16を送信。OSはwebsocket handshakeが終わったとして次の処理に進む
        this.sendToNode(targetMacAddr, WSCommand_1.WSCommand.framed(0, 16, new Uint8Array([1]))); // make target online recognized
    }
    // 再起動を指示
    sendRebootToNode(targetMacAddr) {
        const framed = WSCommand_1.WSCommand.framed(0, 0, new Uint8Array([]));
        this.sendToNode(targetMacAddr, framed);
    }
    parsedRequestString(reqHeader) {
        const lines = reqHeader.split('\r\n');
        const ret = {
            obniz_id: null,
            headers: {},
        };
        if (lines.length < 2) {
            throw new Error('invalid format');
        }
        let pathinfo = lines.shift();
        pathinfo = pathinfo === null || pathinfo === void 0 ? void 0 : pathinfo.replace('GET /endpoints/', '');
        pathinfo = pathinfo === null || pathinfo === void 0 ? void 0 : pathinfo.replace('/ws HTTP/1.1', '');
        ret.obniz_id = pathinfo !== null && pathinfo !== void 0 ? pathinfo : null;
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
exports.WSCommandSubnet = WSCommandSubnet;
