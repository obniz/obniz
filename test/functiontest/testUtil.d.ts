/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import * as Chai from "chai";
import Obniz = require( "../../obniz");

declare global {
  export namespace Chai {
    interface Assertion {
      obniz(): void;
      finished(): void;
      json(): void;
      send(expected: object): void;
      sendBinary(expected: number[]): void;
      error(expected?: string): void;
      like(obj: object): void;
    }
  }
}

type mocha = object;

// tslint:disable-next-line:no-namespace
declare namespace TestUtil {
  interface TestUtil {
    isNode: boolean;
    log(obj: any): void;
    createServer(port: number, velify?: boolean): any; // return WSServer
    createObniz(port: number, obnizId: string | number, options?: any): Obniz;
    setupNotConnectedYetObnizPromise(obj: mocha, done: () => void, options?: any): void;
    setupObnizPromise(obj: mocha, done: () => void,  options?: any): void;
    releaseObnizePromise(obj: mocha, done: () => void): Promise<void>;
    waitForWebsocketCall(obj: mocha, n: number): void;
    receiveJson(obniz: Obniz, jsonVal: object): void;
    isValidCommandRequestJson(jsonVal: object): {valid: boolean};
    isValidCommandResponseJson(jsonVal: object): {valid: boolean};
    obnizAssert(chai: Chai.ChaiStatic, utils: any): void;
    browser(url: string): Promise<object>; // return stats obj
    ejs(url: string, param?: object): Promise<object>; // return stats obj
    needBrowserTest(): boolean;
    checkJsonToBinary(requestJson: string|object, binary: string|number[], self: mocha): void;
    checkBinaryToJson(responseBinaryString: string, expectedJson: object, self: mocha): void;
  }
}

declare const testUtil: TestUtil.TestUtil;
export = testUtil;
