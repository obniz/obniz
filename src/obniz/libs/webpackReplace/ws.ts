/**
 * @packageDocumentation
 * @ignore
 */
// load from webpack

let ws: typeof WebSocket;

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

  constructor(url: string, protocols?: string | string[]) {
    super(url, protocols);
    this.binaryType = 'arraybuffer';
  }

  on(event: string, f: (...arg0: any) => void) {
    if (event === 'open') {
      this.onopen = (_: Event) => {
        f();
      };
    } else if (event === 'message') {
      this.onmessage = (me: MessageEvent) => {
        f(me.data);
      };
    } else if (event === 'close') {
      this.onclose = (ce: CloseEvent) => {
        f(ce.code);
      };
    } else if (event === 'error') {
      this.onerror = (e: Event) => {
        f(e);
      };
    }
  }

  removeAllListeners(event: string) {
    const functionName = this.eventFunctionKetMap[event];
    if (functionName) {
      (this as any)[functionName] = null;
    }
  }
}

export default CompatibleWebSocket;
