/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

import Obniz = require( "../obniz")
import * as Chai from "chai";

declare global {
  export namespace Chai {
    interface Assertion {
      obniz;
      send(expected:object);
      sendBinary(expected:Array<number>);
      finished;
      error(expected?:string);
      json;
      like(obj:object);
    }
  }
}

type mocha = object;

declare namespace TestUtil {
  interface TestUtil {
    log(obj:any);
    isNode: Boolean;
    createServer(port:number, velify?:boolean):any, //return WSServer
    createObniz(port:number, obnizId: string | number, options?: any): Obniz;
    setupNotConnectedYetObnizPromise(obj:mocha, done:()=>void, options?: any);
    setupObnizPromise(obj:mocha, done:()=>void,  options?: any) ;
    releaseObnizePromise(obj:mocha, done:()=>void) : Promise<void>;
    waitForWebsocketCall(obj:mocha, n:number);
    receiveJson(obniz:Obniz, jsonVal:object);
    isValidCommandRequestJson(jsonVal:object):{valid:boolean};
    isValidCommandResponseJson(jsonVal:object):{valid:boolean};
    obnizAssert(chai:Chai.ChaiStatic, utils:any);
    browser(url:string):Promise<object>; //return stats obj
    ejs(url:string, param?:object):Promise<object>; //return stats obj
    needBrowserTest():boolean;
    checkJsonToBinary(requestJson:string|object, binary:string|Array<number>, self:mocha);
    checkBinaryToJson(responseBinaryString:string, expectedJson:object, self:mocha);
  }
}


declare const testUtil: TestUtil.TestUtil;
export = testUtil;
