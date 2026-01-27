/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import { ComponentAbstract } from '../ComponentAbstact';

enum MotionType {
  None = 'none',
  Moving = 'moving',
}

interface Acceleration {
  r: number;
  t: number;
  p: number;
}

interface MotionRecognition {
  motion: MotionType;
  possibility: number;
}

type ObnizTemperatureUpdateCallback = (temperature: number) => void;
type ObnizAccelerationUpdateCallback = (
  r: number,
  t: number,
  p: number
) => void;

type ObnizRecognitionUpdateCallback = (
  motion: MotionType,
  possibility: number
) => void;

/**
 * GPS/GNSS Service
 *
 * @category Embeds
 */
export class Motion extends ComponentAbstract {
  /**
   * Simple Example
   *
   * ```javascript
   * // Javascript Example
   * obniz.motion.onTemperatureUpdate = function(temp) {
   *   console.log(temp)
   * }
   * obniz.motion.onAccelerationUpdate = function(r,t,p) {
   *   console.log(r,t,p)
   * }
   * obniz.motion.onRecognitionUpdate = function(motion, possibility) {
   *   console.log(motion, possibility)
   * }
   * obniz.motion.start();
   * ```
   */
  public onTemperatureUpdate?: ObnizTemperatureUpdateCallback;
  public onAccelerationUpdate?: ObnizAccelerationUpdateCallback;
  public onRecognitionUpdate?: ObnizRecognitionUpdateCallback;

  constructor(obniz: any, info: any) {
    super(obniz);
    this.on('/response/motion/temperature', (obj) => {
      this.Obniz._runUserCreatedFunction(
        this.onTemperatureUpdate,
        obj.temperature
      );
    });
    this.on('/response/motion/acceleration', (obj) => {
      this.Obniz._runUserCreatedFunction(
        this.onAccelerationUpdate,
        obj.acceleration.r,
        obj.acceleration.t,
        obj.acceleration.p
      );
    });
    this.on('/response/motion/recognition', (obj) => {
      this.Obniz._runUserCreatedFunction(
        this.onRecognitionUpdate,
        obj.recognition.motion,
        obj.recognition.possibility
      );
    });

    this._reset();
  }

  protected _reset(): void {
    // No Need to reset
  }

  public schemaBasePath(): string {
    return 'motion';
  }

  public start(
    temp_sensitivity = 0,
    acceleration_sensitivity = 0,
    recognition_sensitivity = 0
  ) {
    const motion: any = {};
    if (temp_sensitivity > 0) {
      motion.temperature = {
        mode: 'sensitive',
        sensitivity: temp_sensitivity,
      };
    }
    if (acceleration_sensitivity > 0) {
      motion.acceleration = {
        mode: 'sensitive',
        sensitivity: acceleration_sensitivity,
      };
    }
    if (recognition_sensitivity > 0) {
      motion.recognition = {
        mode: 'sensitive',
        sensitivity: recognition_sensitivity,
      };
    }

    const obj = {
      motion,
    };
    this.Obniz.send(obj);
  }

  /**
   * One shot getting
   *
   * ```javascript
   * var value = obniz.motion.getTemperatureWait();
   * // 25.0
   * ```
   *
   * @return temperature in degree Celsius
   *
   */
  public async getTemperatureWait(): Promise<number> {
    const obj: any = {};
    obj.motion = {
      temperature: {
        mode: 'oneshot',
        sensitivity: 1,
      },
    };
    const data = await this.sendAndReceiveJsonWait(
      obj,
      '/response/motion/temperature'
    );
    return data.temperature;
  }

  /**
   * One shot getting
   *
   * ```javascript
   * var value = obniz.motion.getAccelerationWait();
   * // { r: 0.1, theta: 90, phi: 90 }
   * ```
   *
   * @return acceleration
   *
   */
  public async getAccelerationWait(): Promise<Acceleration> {
    const obj: any = {};
    obj.motion = {
      acceleration: {
        mode: 'oneshot',
        sensitivity: 1,
      },
    };
    const data = await this.sendAndReceiveJsonWait(
      obj,
      '/response/motion/acceleration'
    );
    return data.acceleration;
  }

  /**
   * One shot getting
   *
   * ```javascript
   * var value = obniz.motion.getRecognitionWait();
   * // { motion: 'moving', possibility: 0.5 }
   * ```
   *
   * @return recognition
   *
   */
  public async getRecognitionWait(): Promise<MotionRecognition> {
    const obj: any = {};
    obj.motion = {
      recognition: {
        mode: 'oneshot',
        sensitivity: 1,
      },
    };
    const data = await this.sendAndReceiveJsonWait(
      obj,
      '/response/motion/recognition'
    );
    return data.recognition;
  }
}
