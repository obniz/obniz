// Type definitions for jsonBinaryConverter
// Project: [LIBRARY_URL_HERE]
// Definitions by: [YOUR_NAME_HERE] <[YOUR_URL_HERE]>
// Definitions: https://github.com/borisyankov/DefinitelyTyped
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.convertFromBinaryToJson.!ret

  /**
   *
   */
  interface ConvertFromBinaryToJsonRet {
  }
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.enumFromBinary.!ret
  type EnumFromBinaryRet = string[];
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.dataArrayFromBinary.!ret
  type DataArrayFromBinaryRet = any[];
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.getProperty.!1
  type GetProperty1 = any[];
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.hexToBinary.!ret
  type HexToBinaryRet = number[];
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.intToBinary.!ret
  type IntToBinaryRet = number[];
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.charToBinary.!ret
  type CharToBinaryRet = number[];
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.dataArrayToBinary.!0
  type DataArrayToBinary0 = any[];
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.uuidToBinary.!ret
  type UuidToBinaryRet = number[];
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.enumToBinary.!1

  /**
   *
   */
  interface EnumToBinary1 {
  }
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.enumToBinary.!ret
  type EnumToBinaryRet = any[];
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.flagToBinary.!0
  type FlagToBinary0 = any[];
}
declare namespace JsonBinaryConverter {
  // JsonBinaryConverter.flagToBinary.!ret
  type FlagToBinaryRet = number[];
}

/**
 *
 */
declare type JsonBinaryConverter = new () => JsonBinaryConverter;

/**
 *
 */
declare namespace JsonBinaryConverter {

  /**
   *
   * @param schema
   * @param binary
   * @return
   */
  function convertFromBinaryToJson(schema: any, binary: any): JsonBinaryConverter.ConvertFromBinaryToJsonRet;

  /**
   *
   * @param data
   * @param schema
   * @return
   */
  function hexFromBinary(data: any, schema: any): string;

  /**
   *
   * @param data
   * @return
   */
  function uuidFromBinary(data: any): string;

  /**
   *
   * @param data
   * @return
   */
  function signedNumberFromBinary(data: any): number;

  /**
   *
   * @param data
   * @return
   */
  function numberFromBinary(data: any): number;

  /**
   *
   * @param enumvals
   * @param val
   * @return
   */
  function keyForVal(enumvals: any, val: any): string;

  /**
   *
   * @param data
   * @param schema
   * @return
   */
  function enumFromBinary(data: any, schema: any): JsonBinaryConverter.EnumFromBinaryRet;

  /**
   *
   * @param data
   * @return
   */
  function dataArrayFromBinary(data: any): JsonBinaryConverter.DataArrayFromBinaryRet;

  /**
   *
   * @param schema
   * @param data
   * @return
   */
  function createSendBuffer(schema: any, data: any): Float32Array;

  /**
   *
   * @param allData
   * @param schemaRow
   */
  function analyzeSchema(allData: any, schemaRow: any): void;

  /**
   *
   * @param object
   * @param path
   * @return
   */
  function getProperty(object: any, path: any): any;

  /**
   *
   * @param data
   * @param schema
   * @return
   */
  function hexToBinary(data: any, schema: any): JsonBinaryConverter.HexToBinaryRet;

  /**
   *
   * @param data
   * @return
   */
  function intToBinary(data: any): JsonBinaryConverter.IntToBinaryRet;

  /**
   *
   * @param data
   * @return
   */
  function charToBinary(data: any): JsonBinaryConverter.CharToBinaryRet;

  /**
   *
   * @param data
   * @return
   */
  function dataArrayToBinary(data: any): any[];

  /**
   *
   * @param data
   * @return
   */
  function uuidToBinary(data: any): JsonBinaryConverter.UuidToBinaryRet;

  /**
   *
   * @param data
   * @param schema
   * @return
   */
  function enumToBinary(data: any, schema: any): JsonBinaryConverter.EnumToBinaryRet;

  /**
   *
   * @param data
   * @param schema
   * @return
   */
  function flagToBinary(data: any, schema: any): JsonBinaryConverter.FlagToBinaryRet;

  /**
   *
   * @param data
   * @return
   */
  function stringToBinary(data: any): Float32Array;
}

declare module "jsonBinaryConverter" {

  export default jsonBinaryConverter;    // es6 style module export
}
