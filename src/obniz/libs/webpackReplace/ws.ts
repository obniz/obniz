/**
 * @packageDocumentation
 * @ignore
 */
// load from webpack

let ws: any;

if (typeof WebSocket !== 'undefined') {
  ws = WebSocket;
} else if (typeof MozWebSocket !== 'undefined') {
  ws = MozWebSocket; // eslint-disable-line
} else {
  ws = window.WebSocket || window.MozWebSocket;
}

class CompatibleWebSocket extends ws {
  eventFunctionKetMap: { [key: string]: string } = {
    open: 'onopen',
    message: 'onmessage',
    close: 'onclose',
    error: 'onerror',
  };

  constructor(...arg0: any) {
    super(...arg0);
    this.binaryType = 'arraybuffer';
  }

  on(event: string, f: (...arg0: any) => void) {
    const functionName = this.eventFunctionKetMap[event];
    if (functionName) {
      this[functionName] = f;
    }
  }

  removeAllListeners(event: string) {
    const functionName = this.eventFunctionKetMap[event];
    if (functionName) {
      this[functionName] = null;
    }
  }
}

export default CompatibleWebSocket;
