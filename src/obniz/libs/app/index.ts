/**
 * @packageDocumentation
 * @module ObnizCore.Components
 */

import Obniz from '../../index';

export default class App {
  private Obniz: Obniz;

  constructor(obniz: Obniz) {
    this.Obniz = obniz;
  }

  /**
   * Recording App log on obniz Cloud.
   *
   * @param text log text
   * @returns none
   */
  public log(text: unknown): void {
    return this._log_level('info', text);
  }

  /**
   * Recording App error log on obniz Cloud.
   *
   * @param text log text
   * @returns none
   */
  public log_error(text: unknown): void {
    return this._log_level('error', text);
  }

  protected _log_level(level: 'info' | 'error', text: unknown): void {
    let _text;
    if (typeof text === 'string') {
      _text = text;
    } else if (typeof text === 'number') {
      _text = `${text}`;
    } else if (typeof text === 'object') {
      if (text) {
        _text = JSON.stringify(text);
      } else {
        _text = `null`;
      }
    }
    this.Obniz.send({
      app: {
        log: {
          level,
          text: _text,
        },
      },
    });
  }

  /**
   * Recording App log on obniz Cloud.
   *
   * @param text log text
   * @returns none
   */
  public status(status: string, text: unknown): void {
    let _text;
    if (typeof text === 'string') {
      _text = text;
    } else if (typeof text === 'number') {
      _text = `${text}`;
    } else if (typeof text === 'object') {
      if (text) {
        _text = JSON.stringify(text);
      } else {
        _text = `null`;
      }
    }
    this.Obniz.send({
      app: {
        status: {
          status,
          text: _text,
        },
      },
    });
  }

  /**
   * @ignore
   * @private
   */
  public _reset(): void {
    // do nothing.
  }

  /**
   * @ignore
   * @param obj
   */
  public notified(obj: unknown): void {
    // do nothing.
  }
}
