interface ObnizTestUtil {
  log: any;
  isNode: any;
  createServer: any;
  createObniz: any;
  setupNotConnectedYetObnizPromise: any;
  setupObnizPromise: any;
  releaseObnizPromise: any;
  waitForWebsocketCall: any;
  receiveJson: any;
  isValidCommandRequestJson: any;
  isValidCommandResponseJson: any;
  obnizAssert: any;
  browser: any;
  ejs: any;
  needBrowserTest: any;
  checkJsonToBinary: any;
  checkBinaryToJson: any;
  closeAndReconnectObnizWait: any;
}

declare const testUtil: ObnizTestUtil;

export = testUtil;
