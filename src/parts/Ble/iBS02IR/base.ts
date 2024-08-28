/**
 * @packageDocumentation
 * @module Parts.iBS02IR
 */
/* eslint rulesdir/non-ascii: 0 */

export interface iBS02IROptions {}

/**
 * advertisement data from iBS02IR
 *
 * iBS02IRからのadvertisementデータ
 */
export interface iBS02IR_Data {
  /** battery 電源電圧 (Unit 単位: 0.01 V) */
  battery: number;
  /** IR proximity sensor responded or not 赤外線近接センサが反応したかどうか */
  event: boolean;
}
