/**
 * @packageDocumentation
 * @module Parts.UC421BLE
 */
/* eslint rulesdir/non-ascii: 0 */

import { EventEmitter } from 'eventemitter3';
import moment from 'moment';
import { BleRemoteService, BleRemoteCharacteristic } from '../../../obniz';
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import {
  ObnizPartsBleInterface,
  ObnizPartsBleInfo,
} from '../../../obniz/ObnizPartsBleInterface';
import roundTo from 'round-to';

/**
 * Options of UC421BLE.
 *
 * UC421BLEのオプション。
 */
export interface UC421BLEOptions {}

/**
 * Weight data sent from UC421BLE.
 *
 * UC421BLEから送られてくる体重データ。
 */
export interface UC421BLEWeightResult {
  /**
   * Height(cm).
   * Available value range: 90 ~ 220.
   * If no value is set for the user, this property does not exist.
   *
   * 身長(cm)
   * 設定可能範囲 90 ~ 220
   * 該当ユーザに対して身長が設定されていない場合はこの項目は存在しない
   */
  height?: number;

  /**
   * Weight(kg/lb).
   * It defaults to 'kg'.
   * If the measurement failed, this property will be null.
   *
   * 体重(kg/lb)
   * デフォルトはkg
   * 測定エラーの時はnull
   */
  weight?: {
    unit: 'kg' | 'lb';
    value: number;
  } | null;

  /**
   * BMI.
   * If the height for the user is not set, this property does not exist.
   *
   * BMI
   * 該当ユーザに対して身長が設定されていない場合はこの項目は存在しない
   */
  bmi?: number;

  /**
   * TimeStamp.
   * If the timeStamp is not set, this property does not exist.(In obniz.js setting of timeStamp is automatically done when connecting to UC421BLE)
   * When measuring both weight and body composition data, the timeStamp of weight data and body composition data will be the same.
   *
   * タイムスタンプ
   * タイムスタンプが設定されていない場合はこの項目は存在しない（obniz.jsでは毎接続時に自動でタイムスタンプ設定を行なっている）
   * 体重と体組成の両方を測定した場合は、体重データと体組成データのタイムスタンプが同じになる
   */
  timestamp?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
}

/**
 * Body composition data sent from UC421BLE.
 * To get this data, you first need to set a height, gender and age for the user.
 *
 * UC421BLEから送られてくる体組成データ
 * この値を取得するには事前に該当ユーザに対して身長、性別、年齢を登録しておく必要がある
 */
export interface UC421BLEBodyCompositionResult {
  /**
   * Body fat percentage(%).
   * If the measurement failed, this property will be null.
   *
   * 体脂肪率(%)
   * 測定エラーの時はnull
   */
  bodyFatPercentage?: number | null;

  /**
   * Basal metabolism(kj).
   * If the measurement failed, this property will be null.
   *
   * 基礎代謝(kj)
   * 測定エラーの時はnull
   */
  basalMetabolismKj?: number | null;

  /**
   * Mascle mass(kg/lb).
   * It defaults to kg.
   * If the measurement failed, this property will be null.
   *
   * 筋肉量(kg/lb)
   * デフォルトはkg
   * 測定エラーの時はnull
   */
  muscleMass?: {
    unit: 'kg' | 'lb';
    value: number;
  } | null;

  /**
   * Body water mass(kg/lb).
   * It defaults to kg.
   * If the measurement failed, this property will be null.
   *
   * 水分量(kg/lb)
   * デフォルトはkg
   * 測定エラーの時はnull
   */
  bodyWaterMass?: {
    unit: 'kg' | 'lb';
    value: number;
  } | null;

  /**
   * TimeStamp.
   * If the timeStamp is not set, this property does not exist.(In obniz.js setting of timeStamp is automatically done when connecting to UC421BLE)
   * When measuring both weight and body composition data, the timeStamp of weight data and body composition data will be the same.
   *
   * タイムスタンプ
   * タイムスタンプが設定されていない場合はこの項目は存在しない（obniz.jsでは毎接続時に自動でタイムスタンプ設定を行なっている）
   * 体重と体組成の両方を測定した場合は、体重データと体組成データのタイムスタンプが同じになる
   */
  timestamp?: {
    year: number;
    month: number;
    day: number;
    hour: number;
    minute: number;
    second: number;
  };
}

const arrUserNoType = [1, 2, 3, 4, 5] as const;
const arrGuestUserNoType = [99] as const;

/**
 * User No.
 * Available value range: 1 ~ 5.
 * It's not possible to set the No manually. It's assigned by UC421BLE automatically.
 *
 * ユーザNo
 * 設定可能範囲: 1 ~ 5
 * 自分でNoを指定することはできず、ユーザNo取得関数(aquireNewUserNoWait)を実行した際に体組成計が空いているユーザNoを自動で設定する
 */
export type UserNo = typeof arrUserNoType[number];

/**
 * Guest user No.
 * The value is 99.
 *
 * ゲストユーザNo
 * 99で固定
 */
export type GuestUserNo = typeof arrGuestUserNoType[number];

/**
 * User information attached to each user No.
 * This includes birthday, gender and height which are used to calculate body composition data.
 *
 * UC421BLEに登録するユーザ情報
 * 設定を行う際はユーザNoを指定して、それに紐づける形で登録を行う
 * ユーザ情報の誕生日、性別、身長を利用して体組成データを生成する
 */
export interface UC421BLEUserInfoData {
  /**
   * Email address(UTF-8)
   * Available value range: 1 ~ 16 bytes.
   *
   * メールアドレス(UTF-8)
   * 設定可能範囲: 1 ~ 16バイト
   */
  email?: string;

  /**
   * First name(UTF-8)
   * Available value range: 1 ~ 20 bytes.
   *
   * 名前(UTF-8)
   * 設定可能範囲: 1 ~ 20バイト
   */
  firstName?: string;

  /**
   * Last name(UTF-8)
   * Available value range: 1 ~ 20 bytes.
   *
   * 苗字(UTF-8)
   * 設定可能範囲: 1 ~ 20バイト
   */
  lastName?: string;

  /**
   * Birthday
   * Available value range: 5 ~ 99 years old.
   *
   * 誕生日
   * 設定可能範囲: 年齢換算時 5 ~ 99歳
   */
  birth?: {
    year: number;
    month: number;
    day: number;
  };

  /**
   * Gender
   * 'unspecified' is not recommended to set because body composition data can not be retrieved with it.
   *
   * 性別
   * 'unspecified'を設定すると体組成データが取得できない
   */
  gender?: 'male' | 'female' | 'unspecified';

  /**
   * Height(cm).
   * Available value range: 90 ~ 220.
   *
   * 身長(cm)
   * 設定可能範囲: 90 ~ 220
   */
  height?: number;
}

/**
 * Manufacturer specific data contained in an advertisement of UC421BLE.
 *
 * UC421BLEのAdvertisementに含まれるManufacturerSpecificData
 */
export interface UC421BLEManufacturerSpecificData {
  /**
   * Company code.
   * The value is 105(A&D Engineering Inc.).
   *
   * 会社コード
   * 105(A&D Engineering Inc.)で固定
   */
  companyCode: number;

  /**
   * Running mode related information.
   *
   * 動作モード関連情報
   */
  opMode: {
    /**
     * Running mode.
     * measurementWithApp: mode of measuring with app(default).
     * measurementWithoutApp: mode of measuring without app(only 60 seconds after measuring without the app).
     *
     * 動作モード
     * measurementWithApp: アプリ有り測定モード（デフォルト）
     * measurementWithoutApp: アプリ無し測定モード（アプリ無し測定でユーザNo確定後60秒のみ）
     */
    runningMode: 'measurementWithApp' | 'measurementWithoutApp';

    /**
     * Flag of medical exam mode.
     * When this mode is on, measurement information is not saved in memory.
     * This supports 'measurement with app' mode and 'measurement without app' mode.
     * 'measurement without app' mode can only retrieve weight data(not body composition data since no user information is provided).
     * The user to authorize is a guest user(No:99, CC:9999).
     *
     * 検診モードフラグ
     * 検診モードは測定情報がメモリに保存されない
     * アプリ有り測定とアプリ無し測定があり、アプリ無し測定の場合は体重データのみ取得できる
     * ユーザはゲストユーザ固定(No:99, CC:9999)
     */
    isMedicalExamModeOn: boolean;

    /**
     * Flag of whether or not the time is set.
     *
     * 時刻設定フラグ
     */
    isTimeSet: boolean;

    /**
     * Flag of whether or not the measurement data of user 1 is saved in memory.
     * This will be true if either weight or body composition data is stored in memory.
     *
     * ユーザ1の測定データが保存されているかどうか
     * 体重データ、体組成データのいずれかが保存されていればtrue
     */
    hasMemoryForUser1: boolean;

    /**
     * Flag of whether or not the measurement data of user 2 is saved in memory.
     * This will be true if either weight or body composition data is stored in memory.
     *
     * ユーザ2の測定データが保存されているかどうか
     * 体重データ、体組成データのいずれかが保存されていればtrue
     */
    hasMemoryForUser2: boolean;

    /**
     * Flag of whether or not the measurement data of user 3 is saved in memory.
     * This will be true if either weight or body composition data is stored in memory.
     *
     * ユーザ3の測定データが保存されているかどうか
     * 体重データ、体組成データのいずれかが保存されていればtrue
     */
    hasMemoryForUser3: boolean;

    /**
     * Flag of whether or not the measurement data of user 4 is saved in memory.
     * This will be true if either weight or body composition data is stored in memory.
     *
     * ユーザ4の測定データが保存されているかどうか
     * 体重データ、体組成データのいずれかが保存されていればtrue
     */
    hasMemoryForUser4: boolean;

    /**
     * Flag of whether or not the measurement data of user 5 is saved in memory.
     * This will be true if either weight or body composition data is stored in memory.
     *
     * ユーザ5の測定データが保存されているかどうか
     * 体重データ、体組成データのいずれかが保存されていればtrue
     */
    hasMemoryForUser5: boolean;

    /**
     * Flag of whether or not there exists available seats for a new user.
     * Maximum number is 5.
     *
     * 新規ユーザの空きがあるかどうか
     * ※ ユーザデータは最大5人分まで保存できる
     */
    haveSeatsForNewUser: boolean;
  };

  /**
   * If the runnning mode is 'measurementWithApp', this will be 255.
   * If it's  'measurementWithoutApp', this will be the user No(normal user: 1~5, guest user: 99).
   *
   * アプリ有り測定モード（デフォルト）の時は固定で255
   * アプリ無し測定モード（アプリ無し測定でユーザNo確定後60秒のみ）の時は確定したユーザID（一般ユーザ: 1~5, ゲストユーザ:99）
   */
  id: number;
}

/**
 * Class for managing UC421BLE.
 *
 * UC421BLEを管理するクラス
 */
export default class UC421BLE implements ObnizPartsBleInterface {
  public static info(): ObnizPartsBleInfo {
    return {
      name: 'UC421BLE',
    };
  }

  /**
   * Judge if the peripheral is UC421BLE or not
   *
   * ペリフェラルがUC421BLEかどうかを確認する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns Judgement if the peripheral is UC421BLE or not ペリフェラルがUC421BLEかどうかの判定
   */
  public static isDevice(peripheral: BleRemotePeripheral): boolean {
    if (!peripheral.localName) return false;
    return peripheral.localName.startsWith('UC-421BLE_');
  }

  /**
   * Extract a manufacturer specific data from an advertisement sent from UC421BLE.
   *
   * UC421BLEから送られたアドバタイズメントからmanufacturer specific dataを取得する
   *
   * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
   *
   * @returns manufacturer specific data
   */
  public static getManufacturerSpecificDataFromAdv(
    peripheral: BleRemotePeripheral
  ): UC421BLEManufacturerSpecificData {
    if (!this.isDevice(peripheral))
      throw new Error('Peripheral is not UC-421BLE');
    const manufacturerSpecificData = peripheral.manufacturerSpecificData!;

    let offset = 0;

    const buf = Buffer.from(manufacturerSpecificData);
    const companyCode = buf.readUInt16LE(offset);

    const byteLenCompanyCode = 2;
    offset += byteLenCompanyCode;

    const opMode = buf.readUInt16LE(offset);
    const bit0 = 0b000000001;
    const bit1 = 0b000000010;
    const bit2 = 0b000000100;
    const bit3 = 0b000001000;
    const bit4 = 0b000010000;
    const bit5 = 0b000100000;
    const bit6 = 0b001000000;
    const bit7 = 0b010000000;
    const bit8 = 0b100000000;

    const runningMode: UC421BLEManufacturerSpecificData['opMode']['runningMode'] =
      opMode & bit0 ? 'measurementWithoutApp' : 'measurementWithApp';
    const isMedicalExamModeOn = opMode & bit1 ? true : false;
    const isTimeSet = opMode & bit2 ? true : false;
    const hasMemoryForUser1 = opMode & bit3 ? true : false;
    const hasMemoryForUser2 = opMode & bit4 ? true : false;
    const hasMemoryForUser3 = opMode & bit5 ? true : false;
    const hasMemoryForUser4 = opMode & bit6 ? true : false;
    const hasMemoryForUser5 = opMode & bit7 ? true : false;
    const haveSeatsForNewUser = opMode & bit8 ? true : false;

    const byteLenOpMode = 2;
    offset += byteLenOpMode;

    const id = buf.readUInt8(offset);

    return {
      companyCode,
      opMode: {
        runningMode,
        isMedicalExamModeOn,
        isTimeSet,
        hasMemoryForUser1,
        hasMemoryForUser2,
        hasMemoryForUser3,
        hasMemoryForUser4,
        hasMemoryForUser5,
        haveSeatsForNewUser,
      },
      id,
    };
  }

  public _peripheral: BleRemotePeripheral | null;
  public ondisconnect?: (reason: any) => void;

  constructor(peripheral: BleRemotePeripheral) {
    if (!peripheral || !UC421BLE.isDevice(peripheral)) {
      throw new Error('peripheral is not UC421BLE');
    }
    this._peripheral = peripheral;
  }

  /**
   * Connect to the peripheral without a pairing
   *
   * ペアリングせずにペリフェラルに接続する
   */
  public async connectWait(): Promise<void> {
    if (!this._peripheral) {
      throw new Error('UC421BLE not found');
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === 'function') {
        this.ondisconnect(reason);
      }
    };
    await this._peripheral.connectWait();

    await this._setTimeWait();
  }

  /**
   * Do the pairing with the peripheral
   *
   * ペリフェラルとペアリングする
   *
   * @returns pairing key ペアリングキー
   */
  public async pairingWait(): Promise<string | null> {
    if (!this._peripheral) {
      throw new Error('UC421BLE not found');
    }
    this._peripheral.ondisconnect = (reason: any) => {
      if (typeof this.ondisconnect === 'function') {
        this.ondisconnect(reason);
      }
    };
    let key: string | null = null;
    await this._peripheral.connectWait({
      pairingOption: {
        onPairedCallback: (pairingKey) => {
          key = pairingKey;
        },
      },
    });

    await this._setTimeWait();

    return key;
  }

  /**
   * Aquire a new user No
   *
   * 新規ユーザNoを取得
   *
   * @param cc cc is short for 'consent code' and used along with the user No when authorizing a user. It should be a range from 0 to 9999. ccは'consent code'の略でユーザ認証の際にuser Noと一緒に使う。0 ~ 9999で指定する。
   *
   * @returns user No ranging from 1 to 5. 1 ~ 5のユーザNo
   */
  public async aquireNewUserNoWait(cc: number): Promise<UserNo> {
    const ccArr = this._toCcArr(cc);

    let no: UserNo | null = null;

    const opcodeRegister = 0x01;
    const opcodeResponse = 0x20;
    const responseValueSuccess = 0x01;
    const responseValueErrorInvalidParameter = 0x03;
    const responseValueErrorOperationFailed = 0x04;

    const _analyzeData = (data: number[]) => {
      const opcode = data[0];
      const requestedOpcode = data[1];
      const responseValue = data[2];

      if (opcode === opcodeResponse && requestedOpcode === opcodeRegister) {
        if (responseValue === responseValueSuccess) {
          const responseParameter = data[3] as UserNo;
          no = responseParameter;
        } else {
          switch (responseValue) {
            case responseValueErrorInvalidParameter:
              throw new Error('cc is too long or payload too big.');
            case responseValueErrorOperationFailed:
              throw new Error('All user No. are already used.');
            default:
              throw new Error('Unkonw response value.');
          }
        }
      }
    };

    const userControlPointChar = await this._getUserControlPointCharWait();
    await userControlPointChar.registerNotifyWait(_analyzeData);

    await userControlPointChar.writeWait([opcodeRegister, ...ccArr]);
    if (!no) throw new Error('Failed to register new user.');
    return no;
  }

  /**
   * Authorize a user
   *
   * ユーザ認証
   *
   * @param  userNo User No aquired from the aquireNewUserNoWait function. But when you authorizing a guest user, pass in 99. aquireNewUserNoWait関数で取得したユーザNo。ただしゲストユーザの認証を行う場合は99を指定。
   * @param cc cc that you have passed in as an argument when calling the aquireNewUserNoWait function. But when you authorizing a guest user, pass in 9999. aquireNewUserNoWait関数で引数に指定したcc。ただしゲストユーザの認証を行う際は9999を指定。
   *
   */
  public async authorizeUserWait(
    userNo: UserNo | GuestUserNo,
    cc: number
  ): Promise<void> {
    let authorized = false;

    const validUserNo = [...arrUserNoType, ...arrGuestUserNoType];
    if (!validUserNo.includes(userNo))
      throw new Error(
        'UserNo must be 1-5 for a normal user or 99 for a guest user.'
      );
    const ccArr = this._toCcArr(cc);

    const opcodeAuthorize = 0x02;
    const opcodeResponse = 0x20;
    const responseValueSuccess = 0x01;
    const responseValueErrorPayloadTooLong = 0x03;
    const responseValueErrorFailedThreeTimes = 0x04;
    const responseValueErrorCcMismatch = 0x05;

    const evtEmitter = new EventEmitter();
    const waitNotification = new Promise((res, rej) =>
      evtEmitter.on('notified', res)
    );

    const _analyzeData = (data: number[]) => {
      const opcode = data[0];
      const requestedOpcode = data[1];
      const responseValue = data[2];

      if (opcode === opcodeResponse && requestedOpcode === opcodeAuthorize) {
        if (responseValue === responseValueSuccess) {
          authorized = true;
          evtEmitter.emit('notified');
        } else {
          switch (responseValue) {
            case responseValueErrorPayloadTooLong:
              throw new Error('Requested data is too long.');
            case responseValueErrorFailedThreeTimes:
              throw new Error('Failed authorization three times in a row.');
            case responseValueErrorCcMismatch:
              throw new Error('Given cc mismatches to one of given user no.');
            default:
              throw new Error('Unknown response value.');
          }
        }
      }
    };

    const userControlPointChar = await this._getUserControlPointCharWait();
    await userControlPointChar.registerNotifyWait(_analyzeData);

    await userControlPointChar.writeWait([opcodeAuthorize, userNo, ...ccArr]);

    await waitNotification;
    if (!authorized) throw new Error('Authorization failed.');
  }

  /**
   * Update a user info. After aquiring a new user No, it's recommended to register an initial user info attached to it.
   * To use this function, you first need to authorize a user by calling authorizeUserWait function.
   * After that, you can update a personal info of the user.
   *
   * ユーザ情報更新。新規ユーザNoを取得した後は、この関数でユーザ情報を登録することを推奨。
   * この関数を使うにはまずauthorizeUserWait関数を使ってユーザ認証を行う必要がある。
   * 認証後、そのユーザのユーザ情報を更新できるようになる。
   *
   * @param  userInfo UC421BLEUserInfoData object. UC421BLEUserInfoDataオブジェクト
   *
   */
  public async updateUserInfoDataWait(
    userInfo: UC421BLEUserInfoData
  ): Promise<void> {
    const updateFunctions: (() => Promise<void>)[] = [];

    if (userInfo.firstName !== undefined) {
      const buf = Buffer.from(userInfo.firstName, 'utf-8');
      if (buf.length > 20 || buf.length === 0)
        throw new Error(
          'The byte length of firstName should be a range from 1 to 20.'
        );

      const updateFirstName = async () => {
        const firstNameChar = await this._getFirstNameCharWait();
        await firstNameChar.writeWait(buf);
      };
      updateFunctions.push(updateFirstName);
    }
    if (userInfo.lastName !== undefined) {
      const buf = Buffer.from(userInfo.lastName, 'utf-8');
      if (buf.length > 20 || buf.length === 0)
        throw new Error(
          'The byte length of lastName should be a range from 1 to 20.'
        );

      const updateLastName = async () => {
        const lastNameChar = await this._getLastNameCharWait();
        await lastNameChar.writeWait(buf);
      };
      updateFunctions.push(updateLastName);
    }
    if (userInfo.email !== undefined) {
      const buf = Buffer.from(userInfo.email, 'utf-8');
      if (buf.length > 16 || buf.length === 0)
        throw new Error(
          'The byte length of email should be a range from 1 to 16.'
        );

      const updateEmail = async () => {
        const emailChar = await this._getEmailCharWait();
        await emailChar.writeWait(buf);
      };
      updateFunctions.push(updateEmail);
    }
    if (userInfo.birth !== undefined) {
      const { year, month, day } = userInfo.birth;
      const age = this._getAge(year, month, day);
      if (age < 5 || age > 99)
        throw new Error('Age must be within a range from 5 to 99.');

      // 1977, 1, 2 -> [0xB9, 0x07, 0x01, 0x02]
      const buf = Buffer.alloc(4);
      buf.writeUInt16LE(year, 0);
      buf.writeUInt8(month, 2);
      buf.writeUInt8(day, 3);
      const arr = Array.from(buf);

      const updateBirth = async () => {
        const birthChar = await this._getBirthCharWait();
        await birthChar.writeWait(arr);
      };
      updateFunctions.push(updateBirth);
    }
    if (userInfo.gender !== undefined) {
      const arr = new Array(1);
      switch (userInfo.gender) {
        case 'male':
          arr[0] = 0x00;
          break;
        case 'female':
          arr[0] = 0x01;
          break;
        case 'unspecified':
          // NOTE: The peripheral won't mesure the body composition data in this case.
          arr[0] = 0x02;
          break;
        default:
          throw new Error('Unknown gender.');
      }
      const updateGender = async () => {
        const genderChar = await this._getGenderCharWait();
        await genderChar.writeWait(arr);
      };
      updateFunctions.push(updateGender);
    }
    if (userInfo.height !== undefined) {
      const height = userInfo.height;
      if (height < 90 || height > 220)
        throw new Error('Height must be within a range from 90 to 220.');

      // Acceptable value ranges from 90 to 220.
      const buf = Buffer.alloc(2);
      buf.writeUInt16LE(height, 0);
      const arr = Array.from(buf);

      const updateHeight = async () => {
        const heightChar = await this._getHeightCharWait();
        await heightChar.writeWait(arr);
      };
      updateFunctions.push(updateHeight);
    }

    // update the info
    for (const updateFunc of updateFunctions) {
      await updateFunc();
    }
  }

  /**
   * Get a user info. To use this function, you first need to authorize a user by calling authorizeUserWait function.
   * Then you can get a personal info of the user.
   *
   * ユーザ情報取得。この関数を使うにはまずauthorizeUserWait関数でユーザ認証を行う必要がある。
   * 認証後、そのユーザのユーザ情報を取得できるようになる。
   *
   * @returns UC421BLEUserInfoData object. UC421BLEUserInfoDataオブジェクト。
   */
  public async getUserInfoDataWait(): Promise<UC421BLEUserInfoData> {
    const firstNameChar = await this._getFirstNameCharWait();
    const lastNameChar = await this._getLastNameCharWait();
    const emailChar = await this._getEmailCharWait();
    const birthChar = await this._getBirthCharWait();
    const heightChar = await this._getHeightCharWait();
    const genderChar = await this._getGenderCharWait();

    const firstNameBytes = await firstNameChar.readWait();
    const lastNameBytes = await lastNameChar.readWait();
    const emailBytes = await emailChar.readWait();
    const birthBytes = await birthChar.readWait();
    const heightBytes = await heightChar.readWait();
    const genderBytes = await genderChar.readWait();

    const firstName = String.fromCharCode(...firstNameBytes);
    const lastName = String.fromCharCode(...lastNameBytes);
    const email = String.fromCharCode(...emailBytes);

    const bufBirth = Buffer.from(birthBytes);
    const birth = {
      year: bufBirth.readUInt16LE(0),
      month: bufBirth.readUInt8(2),
      day: bufBirth.readUInt8(3),
    };
    const bHeight = Buffer.from(heightBytes);
    const height = bHeight.readInt16LE(0);

    let gender: 'male' | 'female' | 'unspecified' = 'unspecified';
    switch (genderBytes[0]) {
      case 0x00:
        gender = 'male';
        break;
      case 0x01:
        gender = 'female';
        break;
    }

    const userInfo: UC421BLEUserInfoData = {
      firstName,
      lastName,
      email,
      birth,
      height,
      gender,
    };
    return userInfo;
  }

  /**
   * Get a list of measured weight data. To use this function, you first need to authorize a user by calling authorizeUserWait function.
   * After that, you can get the data attached to the user. If the multiple weight data are stored in memory, multiple data will be returned.
   *
   * 体重情報取得。この関数を使うにはまずauthorizeUserWait関数でユーザ認証を行う必要がある。
   * 認証後、そのユーザの体重データを取得できるようになる。データがメモリに複数保存されている場合はデータが複数返ってくる。
   *
   * @returns List of UC421BLEWeightResult object. UC421BLEWeightResultオブジェクトの配列。
   */
  public async getWeightDataWait(): Promise<UC421BLEWeightResult[]> {
    const results: UC421BLEWeightResult[] = [];

    const weightScaleChar = await this._getWeightScaleMeasurementCharWait();

    const evtEmitter = new EventEmitter();
    const waitGettingAllData = new Promise<UC421BLEWeightResult[]>((res, rej) =>
      evtEmitter.on('noDataFor500ms', async () => {
        // NOTE: We assume that all data has been notified if 500 ms passed with no data notified.
        await weightScaleChar.unregisterNotifyWait();
        res(results);
      })
    );

    const startGettingAllData = async () => {
      const _analyzeData = (data: number[]): UC421BLEWeightResult => {
        const result: UC421BLEWeightResult = {};

        const buf = Buffer.from(data);
        let offset = 0;

        // flags
        const flags = buf.readUInt8(offset);
        const bit0 = 0b00000001;
        const bit1 = 0b00000010;
        const bit2 = 0b00000100;
        const bit3 = 0b00001000;
        const measurementUnit = flags & bit0 ? 'lb' : 'kg';
        const timeStampPresent = flags & bit1 ? true : false;
        const userIdPresent = flags & bit2 ? true : false;
        const bmiAndHeightPresent = flags & bit3 ? true : false;
        const byteLenFlags = 1;
        offset += byteLenFlags;

        const errorValue = Buffer.from([0xff, 0xff]).readUInt16LE(0);

        // get weight
        const resolutionWeight = measurementUnit === 'kg' ? 0.005 : 0.01;
        const weightInt = buf.readUInt16LE(offset);
        if (weightInt === errorValue) {
          result.weight = null;
        } else {
          const weightFloat = roundTo(weightInt * resolutionWeight, 3);
          result.weight = { unit: measurementUnit, value: weightFloat };
        }
        const byteLenWeight = 2;
        offset += byteLenWeight;

        // get ts
        if (timeStampPresent) {
          const year = buf.readUInt16LE(offset);
          const byteLenYear = 2;
          offset += byteLenYear;

          const month = buf.readUInt8(offset);
          const byteLenMonth = 1;
          offset += byteLenMonth;

          const day = buf.readUInt8(offset);
          const byteLenDay = 1;
          offset += byteLenDay;

          const hour = buf.readUInt8(offset);
          const byteLenHour = 1;
          offset += byteLenHour;

          const minute = buf.readUInt8(offset);
          const byteLenMinute = 1;
          offset += byteLenMinute;

          const second = buf.readUInt8(offset);
          const byteLenSecond = 1;
          offset += byteLenSecond;

          result.timestamp = {
            year,
            month,
            day,
            hour,
            minute,
            second,
          };
        }
        if (userIdPresent) {
          // Do nothing about user id.
          const byteLenUserId = 1;
          offset += byteLenUserId;
        }
        // get bmi
        if (bmiAndHeightPresent) {
          const resolutionBmi = 0.1;
          const bmiMass = buf.readUInt16LE(offset);
          const bmi = roundTo(bmiMass * resolutionBmi, 1);
          const byteLenBmi = 2;
          offset += byteLenBmi;

          const resolutionHeight = 0.1;
          const heightMass = buf.readUInt16LE(offset);
          const height = roundTo(heightMass * resolutionHeight, 1);
          const byteLenHeight = 2;
          offset += byteLenHeight;

          result.bmi = bmi;
          result.height = height;
        }
        return result;
      };

      let timeout = setTimeout(() => evtEmitter.emit('noDataFor500ms'), 500);
      const resetTimeout = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => evtEmitter.emit('noDataFor500ms'), 500);
      };

      await weightScaleChar.registerNotifyWait((data: number[]) => {
        resetTimeout();
        results.push(_analyzeData(data));
      });
    };

    await startGettingAllData();

    return await waitGettingAllData;
  }

  /**
   * Get a list of measured body composition data. To use this function, you first need to authorize a user by calling authorizeUserWait function.
   * After that, you can get the data attached to the user. If the multiple body composition data are stored in memory, multiple data will be returned.
   *
   * 体組成情報取得。この関数を使うにはまずauthorizeUserWait関数でユーザ認証を行う必要がある。
   * 認証後、そのユーザの体組成データを取得できるようになる。データがメモリに複数保存されている場合はデータが複数返ってくる。
   *
   * @returns List of UC421BLEBodyCompositionResult object. UC421BLEBodyCompositionResultオブジェクトの配列。
   */
  public async getBodyCompositionDataWait(): Promise<
    UC421BLEBodyCompositionResult[]
  > {
    const results: UC421BLEBodyCompositionResult[] = [];

    const bodyCompositionChar = await this._getBodyCompositionMeasurementCharWait();

    const evtEmitter = new EventEmitter();
    const waitGettingAllData = new Promise<UC421BLEBodyCompositionResult[]>(
      (res, rej) =>
        evtEmitter.on('noDataFor500ms', async () => {
          await bodyCompositionChar.unregisterNotifyWait();
          res(results);
        })
    );

    const startGettingAllData = async () => {
      const _analyzeData = (data: number[]): UC421BLEBodyCompositionResult => {
        const result: UC421BLEBodyCompositionResult = {};

        const buf = Buffer.from(data);
        let offset = 0;

        // flags
        const flags = buf.readUInt16LE(offset);
        // add a leading 0 to make it more readable
        const bit00 = 0b0000000000000001;
        const bit01 = 0b0000000000000010;
        const bit02 = 0b0000000000000100;
        const bit03 = 0b0000000000001000;
        const bit04 = 0b0000000000010000;
        const bit05 = 0b0000000000100000;
        const bit06 = 0b0000000001000000;
        const bit07 = 0b0000000010000000;
        const bit08 = 0b0000000100000000;
        const bit09 = 0b0000001000000000;
        const bit10 = 0b0000010000000000;
        const bit11 = 0b0000100000000000;
        const bit12 = 0b0001000000000000;

        // some flags are not used but write them to make it more readable
        const measurementUnit = flags & bit00 ? 'lb' : 'kg';
        const timeStampPresent = flags & bit01 ? true : false;
        const userIdPresent = flags & bit02 ? true : false;
        const basalMetabolismPresent = flags & bit03 ? true : false;
        const musclePercentagePresent = flags & bit04 ? true : false; // not used
        const mascleMassPresent = flags & bit05 ? true : false;
        const fatFreeMassPresent = flags & bit06 ? true : false; // not used
        const softLeanMassPresent = flags & bit07 ? true : false; // not used
        const bodyWaterMassPresent = flags & bit08 ? true : false;
        const impedancePresent = flags & bit09 ? true : false; // not used
        const weightPresent = flags & bit10 ? true : false; // not used
        const heightPresent = flags & bit11 ? true : false; // not used
        const multiplePacketPresent = flags & bit12 ? true : false; // not used
        const byteLenFlags = 2;
        offset += byteLenFlags;

        const errorValue = Buffer.from([0xff, 0xff]).readUInt16LE(0);

        // body fat percentage
        const resolutionBodyFatPercentage = 0.1;
        const bodyFatPercentageInt = buf.readUInt16LE(offset);
        if (bodyFatPercentageInt === errorValue) {
          result.bodyFatPercentage = null;
        } else {
          const bodyFatPercentageFloat =
            bodyFatPercentageInt * resolutionBodyFatPercentage;
          result.bodyFatPercentage = bodyFatPercentageFloat;
        }
        const byteLenBodyFatPercentage = 2;
        offset += byteLenBodyFatPercentage;

        // ts
        if (timeStampPresent) {
          const year = buf.readUInt16LE(offset);
          const byteLenYear = 2;
          offset += byteLenYear;

          const month = buf.readUInt8(offset);
          const byteLenMonth = 1;
          offset += byteLenMonth;

          const day = buf.readUInt8(offset);
          const byteLenDay = 1;
          offset += byteLenDay;

          const hour = buf.readUInt8(offset);
          const byteLenHour = 1;
          offset += byteLenHour;

          const minute = buf.readUInt8(offset);
          const byteLenMinute = 1;
          offset += byteLenMinute;

          const second = buf.readUInt8(offset);
          const byteLenSecond = 1;
          offset += byteLenSecond;

          result.timestamp = {
            year,
            month,
            day,
            hour,
            minute,
            second,
          };
        }

        if (userIdPresent) {
          // Do nothing about user id.
          const byteLenUserId = 1;
          offset += byteLenUserId;
        }

        // basal metabolism
        if (basalMetabolismPresent) {
          const basalMetabolismInt = buf.readUInt16LE(offset); // resolution is 1
          if (basalMetabolismInt === errorValue) {
            result.basalMetabolismKj = null;
          } else {
            result.basalMetabolismKj = basalMetabolismInt;
          }
          const byteLenBasalMetabolism = 2;
          offset += byteLenBasalMetabolism;
        }

        // mascle mass
        if (mascleMassPresent) {
          const resolutionMascleMass = measurementUnit === 'kg' ? 0.005 : 0.01;
          const mascleMassInt = buf.readUInt16LE(offset);
          if (mascleMassInt === errorValue) {
            result.muscleMass = null;
          } else {
            const mascleMassFloat = roundTo(
              mascleMassInt * resolutionMascleMass,
              3
            );
            result.muscleMass = {
              unit: measurementUnit,
              value: mascleMassFloat,
            };
          }
          const byteLenMascleMass = 2;
          offset += byteLenMascleMass;
        }

        // body water mass
        if (bodyWaterMassPresent) {
          const resolutionBodyWaterMass =
            measurementUnit === 'kg' ? 0.005 : 0.01;
          const bodyWaterMassInt = buf.readUInt16LE(offset);
          if (bodyWaterMassInt === errorValue) {
            result.bodyWaterMass = null;
          } else {
            const bodyWaterMassFloat = roundTo(
              bodyWaterMassInt * resolutionBodyWaterMass,
              3
            );
            result.bodyWaterMass = {
              unit: measurementUnit,
              value: bodyWaterMassFloat,
            };
          }
          const byteLenBodyWaterMass = 2;
          offset += byteLenBodyWaterMass;
        }

        return result;
      };

      let timeout = setTimeout(() => evtEmitter.emit('noDataFor500ms'), 500);
      const resetTimeout = () => {
        clearTimeout(timeout);
        timeout = setTimeout(() => evtEmitter.emit('noDataFor500ms'), 500);
      };

      await bodyCompositionChar.registerNotifyWait((data: number[]) => {
        resetTimeout();
        results.push(_analyzeData(data));
      });
    };

    await startGettingAllData();
    return await waitGettingAllData;
  }

  /**
   * Change the runnning mode. By default it's 'measurement' mode, and if you want to do some setting, call this function with an argument 'setting' and go into 'setting' mode.
   * After 180 seconds passed since this function called, it gets back to its normal 'measurement' mode from 'setting' mode.
   *
   * 動作モード変更。デフォルトでは'measurement'(測定)モードだが、本体設定を行いたい時はこの関数を呼んで'setting'(設定)モードに変更する。
   * この関数を呼んでから180秒後に、通常の'measurement'(測定)モードに戻る。
   *
   * @param mode Target mode you want the peripheral to go into. 'measurement' or 'setting'. 変更したいモード。'measurement'または'setting'。
   */
  public async changeRunningModeWait(
    mode: 'measurement' | 'setting'
  ): Promise<void> {
    const runningMode = {
      measurement: 0x02,
      setting: 0x03,
    };
    if (!runningMode[mode]) throw new Error('Unknown mode passed in.');

    const aAndDCustomNotificationChar = await this._getAAndDCustomNotificationCharWait();
    const aAndDCustomWriteReadChar = await this._getAAndDCustomWriteReadCharWait();

    const cmdDirectionPeriToObniz = 0x00;
    const cmdDirectionObnizToPeri = 0x01;
    const cmd = 0x05;
    const cmdId = 0x0a;

    const evtEmitter = new EventEmitter();
    const waitNotification = new Promise((res, rej) =>
      evtEmitter.on('notified', res)
    );

    const _analyzeData = (data: number[]) => {
      const lenNotifiedCmd = 0x04;
      const resultOk = 0x00;
      const cmdOk = [
        lenNotifiedCmd,
        cmdDirectionPeriToObniz,
        cmd,
        cmdId,
        resultOk,
      ];

      if (
        data.length === cmdOk.length &&
        data[0] === lenNotifiedCmd &&
        data[1] === cmdDirectionPeriToObniz &&
        data[2] === cmd &&
        data[3] === cmdId
      ) {
        if (data[4] === resultOk) {
          evtEmitter.emit('notified');
        } else {
          throw new Error('Failed to change running mode.');
        }
      }
    };
    await aAndDCustomNotificationChar.registerNotifyWait(_analyzeData);

    const lenWriteCmd = 0x04;
    await aAndDCustomWriteReadChar.writeWait([
      lenWriteCmd,
      cmdDirectionObnizToPeri,
      cmd,
      cmdId,
      runningMode[mode],
    ]);

    await waitNotification;
  }

  /**
   * Set medical exam mode. To use this function, you first need to have the peripheral go into 'setting' mode by calling changeRunningModeWait function.
   * Medical exam mode does not require normal users(No: 1 ~ 5 and cc: 0 ~ 9999), it only uses a guest user(No: 99 and cc: 9999) and no data is saved in memory.
   * This mode supports two situations. 'measurementWithApp' and 'measurementWithoutApp' both indicated in an advertisement.
   * Currently, obniz.js only supports the 'measurementWithoutApp' situation, so you can only get the weight data with this mode.
   *
   * 検診モード設定。この関数を使うには、まずchangeRunningModeWait関数を呼んで動作モードを'setting'にする必要がある。
   * 検診モードは通常のユーザではなくゲストユーザを使用し、測定値はメモリに保存されない。
   * このモードは2つのシチュエーションに対応している。（'アプリ有り計測'と'アプリ無し計測'。アドバタイズメントの中で確認できる）
   * obniz.jsでは現在'アプリ無し計測'のみ対応しており、この場合は体重データのみ取得可能。
   *
   * @param mode 'on' or 'off'
   */
  public async setMedicalExamModeWait(mode: 'on' | 'off'): Promise<void> {
    // NOTE: We have to go into 'setting' mode before configuring this mode.
    if (!(mode === 'on' || mode === 'off'))
      throw new Error("mode should be either 'on' or 'off'");

    const aAndDCustomNotificationChar = await this._getAAndDCustomNotificationCharWait();
    const aAndDCustomWriteReadChar = await this._getAAndDCustomWriteReadCharWait();

    const cmdDirectionPeriToObniz = 0x00;
    const cmdDirectionObnizToPeri = 0x01;
    const cmd = 0x05;
    const cmdId = 0x28;
    const cmdOff = 0x00;
    const cmdOn = 0x01;

    const evtEmitter = new EventEmitter();
    const waitNotification = new Promise((res, rej) =>
      evtEmitter.on('notified', res)
    );

    const _analyzeData = (data: number[]) => {
      const lenNotifiedCmd = 0x04;
      const resultOk = 0x00;
      const cmdOk = [
        lenNotifiedCmd,
        cmdDirectionPeriToObniz,
        cmd,
        cmdId,
        resultOk,
      ];

      if (
        data.length === cmdOk.length &&
        data[0] === lenNotifiedCmd &&
        data[1] === cmdDirectionPeriToObniz &&
        data[2] === cmd &&
        data[3] === cmdId
      ) {
        if (data[4] === resultOk) {
          evtEmitter.emit('notified');
        } else {
          throw new Error('Failed to set medical exam mode.');
        }
      }
    };

    await aAndDCustomNotificationChar.registerNotifyWait(_analyzeData);

    const lenWriteCmd = 0x04;
    await aAndDCustomWriteReadChar.writeWait([
      lenWriteCmd,
      cmdDirectionObnizToPeri,
      cmd,
      cmdId,
      mode === 'on' ? cmdOn : cmdOff,
    ]);

    await waitNotification;
  }

  /**
   * Get if the medical exam mode is on or off.
   *
   * 検診モード設定状況取得。
   *
   * @returns true for medical exam mode on and false for off
   */
  public async isMedicalExamModeOnWait(): Promise<boolean> {
    const aAndDCustomWriteReadChar = await this._getAAndDCustomWriteReadCharWait();
    const aAndDCustomNotificationChar = await this._getAAndDCustomNotificationCharWait();

    const evtEmitter = new EventEmitter();
    const waitNotification = new Promise((res, rej) =>
      evtEmitter.on('notified', res)
    );

    let isMedicalExamModeOn = false;
    const _analyzeData = (data: number[]) => {
      isMedicalExamModeOn = data[4] === 0x01 ? true : false;
      evtEmitter.emit('notified');
    };
    await aAndDCustomNotificationChar.registerNotifyWait(_analyzeData);

    await aAndDCustomWriteReadChar.writeWait([0x03, 0x01, 0x05, 0x29]);

    await waitNotification;

    return isMedicalExamModeOn;
  }

  /**
   * Send disconnect request to peripheral.
   *
   * 切断要求をペリフェラルに送信。
   */
  public async disconnectWait(): Promise<void> {
    await this._peripheral!.disconnectWait();
  }

  /*
    PRIVSTE METHODS
  */

  // utils

  private _toCcArr(cc: number): number[] {
    if (cc < 0 || cc > 9999) {
      throw new Error('cc must be within the range from 0000 to 9999.');
    }
    const buf = Buffer.alloc(2);
    buf.writeUInt16LE(cc, 0);
    const ccArr = Array.from(buf);
    return ccArr;
  }

  private _getAge(year: number, month: number, day: number): number {
    // NOTE: Add leading zeros if needed.
    const yearStr = year.toString().padStart(4, '0');
    const monthStr = month.toString().padStart(2, '0');
    const dayStr = day.toString().padStart(2, '0');

    const birthdayStr = `${yearStr}-${monthStr}-${dayStr}`;
    const ageYears = moment().diff(birthdayStr, 'years');
    if (Number.isNaN(ageYears)) throw new Error('Invalid birthday recieved.');
    return ageYears;
  }

  private async _setTimeWait(): Promise<void> {
    const currentTimeChar = await this._getCurrentTimeCharWait();

    const year = new Date().getFullYear();
    const month = new Date().getMonth() + 1;
    const day = new Date().getDate();
    const hour = new Date().getHours();
    const minute = new Date().getMinutes();
    const second = new Date().getSeconds();
    const dayOfWeek = 0x00; // fixed
    const secondFraction = 0x00; // fixed
    const adjustReason = 0b00000000; // 8 bits. Don't know the purpose of this param... No explanations about this on doc:(

    const byteLenYear = 2;
    const byteLenMonth = 1;
    const byteLenDay = 1;
    const byteLenHour = 1;
    const byteLenMinute = 1;
    const byteLenSecond = 1;
    const byteLenDayOfWeek = 1;
    const byteLenSecondFraction = 1;
    const byteLenAdjustReason = 1;

    const buf = Buffer.alloc(
      byteLenYear +
        byteLenMonth +
        byteLenDay +
        byteLenHour +
        byteLenMinute +
        byteLenSecond +
        byteLenDayOfWeek +
        byteLenSecondFraction +
        byteLenAdjustReason
    );

    let offset = 0;
    buf.writeUInt16LE(year, offset);
    offset += byteLenYear;
    buf.writeUInt8(month, offset);
    offset += byteLenMonth;
    buf.writeUInt8(day, offset);
    offset += byteLenDay;
    buf.writeUInt8(hour, offset);
    offset += byteLenHour;
    buf.writeUInt8(minute, offset);
    offset += byteLenMinute;
    buf.writeUInt8(second, offset);
    offset += byteLenSecond;
    buf.writeUInt8(dayOfWeek, offset);
    offset += byteLenDayOfWeek;
    buf.writeUInt8(secondFraction, offset);
    offset += byteLenSecondFraction;
    buf.writeUInt8(adjustReason, offset);
    offset += byteLenAdjustReason;

    const arrCurrentTime = Array.from(buf);

    await currentTimeChar.writeWait(arrCurrentTime);
  }

  // services

  private async _getCurrentTimeServiceWait(): Promise<BleRemoteService> {
    const currentTimeService = this._peripheral!.getService('1805');
    if (!currentTimeService)
      throw new Error('Failed to get CurrentTimeService.');
    return currentTimeService;
  }

  private async _getUserDataServiceWait(): Promise<BleRemoteService> {
    const userDataService = this._peripheral!.getService('181C');
    if (!userDataService) throw new Error('Failed to get UserDataService.');
    return userDataService;
  }

  private async _getWeightScaleServiceWait(): Promise<BleRemoteService> {
    const weightScaleService = this._peripheral!.getService('181D');
    if (!weightScaleService)
      throw new Error('Failed to get WeightScaleService.');
    return weightScaleService;
  }

  private async _getBodyCompositionServiceWait(): Promise<BleRemoteService> {
    const bodyCompositionService = this._peripheral!.getService('181B');
    if (!bodyCompositionService)
      throw new Error('Failed to get BodyCompositionService.');
    return bodyCompositionService;
  }

  private async _getAAndDCustomServiceWait(): Promise<BleRemoteService> {
    const aAndDCustomService = this._peripheral!.getService(
      '11127000-B364-11E4-AB27-0800200C9A66'
    );
    if (!aAndDCustomService)
      throw new Error('Failed to get AAndDCustomService.');
    return aAndDCustomService;
  }

  // charactaristics

  private async _getCurrentTimeCharWait(): Promise<BleRemoteCharacteristic> {
    const currentTimeService = await this._getCurrentTimeServiceWait();
    const currentTimeChar = currentTimeService.getCharacteristic('2A2B');
    if (!currentTimeChar)
      throw new Error('Failed to get CurrentTime charactaristic.');
    return currentTimeChar;
  }

  private async _getUserControlPointCharWait(): Promise<BleRemoteCharacteristic> {
    const userDataService = await this._getUserDataServiceWait();
    const userControlPointChar = userDataService.getCharacteristic('2A9F');
    if (!userControlPointChar)
      throw new Error('Failed to get UserControlPoint charactaristic.');
    return userControlPointChar;
  }

  private async _getFirstNameCharWait(): Promise<BleRemoteCharacteristic> {
    const userDataService = await this._getUserDataServiceWait();
    const fistNameChar = userDataService.getCharacteristic('2A8A');
    if (!fistNameChar)
      throw new Error('Failed to get FirstName charactaristic.');
    return fistNameChar;
  }

  private async _getLastNameCharWait(): Promise<BleRemoteCharacteristic> {
    const userDataService = await this._getUserDataServiceWait();
    const lastNameChar = userDataService.getCharacteristic('2A90');
    if (!lastNameChar)
      throw new Error('Failed to get LastName charactaristic.');
    return lastNameChar;
  }

  private async _getEmailCharWait(): Promise<BleRemoteCharacteristic> {
    const userDataService = await this._getUserDataServiceWait();
    const emailChar = userDataService.getCharacteristic('2A87');
    if (!emailChar) throw new Error('Failed to get Email charactaristic.');
    return emailChar;
  }

  private async _getBirthCharWait(): Promise<BleRemoteCharacteristic> {
    const userDataService = await this._getUserDataServiceWait();
    const birthChar = userDataService.getCharacteristic('2A85');
    if (!birthChar) throw new Error('Failed to get Birth charactaristic.');
    return birthChar;
  }

  private async _getGenderCharWait(): Promise<BleRemoteCharacteristic> {
    const userDataService = await this._getUserDataServiceWait();
    const genderChar = userDataService.getCharacteristic('2A8C');
    if (!genderChar) throw new Error('Failed to get Gender charactaristic.');
    return genderChar;
  }

  private async _getHeightCharWait(): Promise<BleRemoteCharacteristic> {
    const userDataService = await this._getUserDataServiceWait();
    const heightChar = userDataService.getCharacteristic('2A8E');
    if (!heightChar) throw new Error('Failed to get Height charactaristic.');
    return heightChar;
  }

  private async _getWeightScaleMeasurementCharWait(): Promise<BleRemoteCharacteristic> {
    const weightScaleService = await this._getWeightScaleServiceWait();
    const weightScaleMeasurementChar = weightScaleService.getCharacteristic(
      '2A9D'
    );
    if (!weightScaleMeasurementChar)
      throw new Error('Failed to get Weight Measurement charactaristic.');
    return weightScaleMeasurementChar;
  }

  private async _getBodyCompositionMeasurementCharWait(): Promise<BleRemoteCharacteristic> {
    const bodyCompositionService = await this._getBodyCompositionServiceWait();
    const bodyCompositionMeasurementChar = bodyCompositionService.getCharacteristic(
      '2A9C'
    );
    if (!bodyCompositionMeasurementChar)
      throw new Error(
        'Failed to get Body Composition Measurement charactaristic.'
      );
    return bodyCompositionMeasurementChar;
  }

  private async _getAAndDCustomWriteReadCharWait(): Promise<BleRemoteCharacteristic> {
    const aAndDCustomService = await this._getAAndDCustomServiceWait();
    const aAndDCustomWriteReadChar = aAndDCustomService.getCharacteristic(
      '11127001-B364-11E4-AB27-0800200C9A66'
    );
    if (!aAndDCustomWriteReadChar)
      throw new Error('Failed to get A&D Custom Read Write charactaristic.');
    return aAndDCustomWriteReadChar;
  }

  private async _getAAndDCustomNotificationCharWait(): Promise<BleRemoteCharacteristic> {
    const aAndDCustomService = await this._getAAndDCustomServiceWait();
    const aAndDCustomNotificationChar = aAndDCustomService.getCharacteristic(
      '11127002-B364-11E4-AB27-0800200C9A66'
    );
    if (!aAndDCustomNotificationChar)
      throw new Error('Failed to get A&D Custom Notification charactaristic.');
    return aAndDCustomNotificationChar;
  }
}
