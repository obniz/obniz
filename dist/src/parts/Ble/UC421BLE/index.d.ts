/**
 * @packageDocumentation
 * @module Parts.UC421BLE
 */
import { BleRemotePeripheral } from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import { ObnizPartsBleInterface, ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
/**
 * Options of UC421BLE.
 *
 * UC421BLEのオプション。
 */
export interface UC421BLEOptions {
}
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
declare const arrUserNoType: readonly [1, 2, 3, 4, 5];
declare const arrGuestUserNoType: readonly [99];
/**
 * User No.
 * Available value range: 1 ~ 5.
 * It's not possible to set the No manually. It's assigned by UC421BLE automatically.
 *
 * ユーザNo
 * 設定可能範囲: 1 ~ 5
 * 自分でNoを指定することはできず、ユーザNo取得関数(aquireNewUserNoWait)を実行した際に体組成計が空いているユーザNoを自動で設定する
 */
export declare type UserNo = typeof arrUserNoType[number];
/**
 * Guest user No.
 * The value is 99.
 *
 * ゲストユーザNo
 * 99で固定
 */
export declare type GuestUserNo = typeof arrGuestUserNoType[number];
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
    static info(): ObnizPartsBleInfo;
    /**
     * Judge if the peripheral is UC421BLE or not
     *
     * ペリフェラルがUC421BLEかどうかを確認する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns Judgement if the peripheral is UC421BLE or not ペリフェラルがUC421BLEかどうかの判定
     */
    static isDevice(peripheral: BleRemotePeripheral): boolean;
    /**
     * Extract a manufacturer specific data from an advertisement sent from UC421BLE.
     *
     * UC421BLEから送られたアドバタイズメントからmanufacturer specific dataを取得する
     *
     * @param peripheral instance of BleRemotePeripheral BleRemotePeripheralのインスタンス
     *
     * @returns manufacturer specific data
     */
    static getManufacturerSpecificDataFromAdv(peripheral: BleRemotePeripheral): UC421BLEManufacturerSpecificData;
    _peripheral: BleRemotePeripheral | null;
    ondisconnect?: (reason: any) => void;
    constructor(peripheral: BleRemotePeripheral);
    /**
     * Connect to the peripheral without a pairing
     *
     * ペアリングせずにペリフェラルに接続する
     */
    connectWait(): Promise<void>;
    /**
     * Do the pairing with the peripheral
     *
     * ペリフェラルとペアリングする
     *
     * @returns pairing key ペアリングキー
     */
    pairingWait(): Promise<string | null>;
    /**
     * Aquire a new user No
     *
     * 新規ユーザNoを取得
     *
     * @param cc cc is short for 'consent code' and used along with the user No when authorizing a user. It should be a range from 0 to 9999. ccは'consent code'の略でユーザ認証の際にuser Noと一緒に使う。0 ~ 9999で指定する。
     *
     * @returns user No ranging from 1 to 5. 1 ~ 5のユーザNo
     */
    aquireNewUserNoWait(cc: number): Promise<UserNo>;
    /**
     * Authorize a user
     *
     * ユーザ認証
     *
     * @param  userNo User No aquired from the aquireNewUserNoWait function. But when you authorizing a guest user, pass in 99. aquireNewUserNoWait関数で取得したユーザNo。ただしゲストユーザの認証を行う場合は99を指定。
     * @param cc cc that you have passed in as an argument when calling the aquireNewUserNoWait function. But when you authorizing a guest user, pass in 9999. aquireNewUserNoWait関数で引数に指定したcc。ただしゲストユーザの認証を行う際は9999を指定。
     *
     */
    authorizeUserWait(userNo: UserNo | GuestUserNo, cc: number): Promise<void>;
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
    updateUserInfoDataWait(userInfo: UC421BLEUserInfoData): Promise<void>;
    /**
     * Get a user info. To use this function, you first need to authorize a user by calling authorizeUserWait function.
     * Then you can get a personal info of the user.
     *
     * ユーザ情報取得。この関数を使うにはまずauthorizeUserWait関数でユーザ認証を行う必要がある。
     * 認証後、そのユーザのユーザ情報を取得できるようになる。
     *
     * @returns UC421BLEUserInfoData object. UC421BLEUserInfoDataオブジェクト。
     */
    getUserInfoDataWait(): Promise<UC421BLEUserInfoData>;
    /**
     * Get a list of measured weight data. To use this function, you first need to authorize a user by calling authorizeUserWait function.
     * After that, you can get the data attached to the user. If the multiple weight data are stored in memory, multiple data will be returned.
     *
     * 体重情報取得。この関数を使うにはまずauthorizeUserWait関数でユーザ認証を行う必要がある。
     * 認証後、そのユーザの体重データを取得できるようになる。データがメモリに複数保存されている場合はデータが複数返ってくる。
     *
     * @returns List of UC421BLEWeightResult object. UC421BLEWeightResultオブジェクトの配列。
     */
    getWeightDataWait(): Promise<UC421BLEWeightResult[]>;
    /**
     * Get a list of measured body composition data. To use this function, you first need to authorize a user by calling authorizeUserWait function.
     * After that, you can get the data attached to the user. If the multiple body composition data are stored in memory, multiple data will be returned.
     *
     * 体組成情報取得。この関数を使うにはまずauthorizeUserWait関数でユーザ認証を行う必要がある。
     * 認証後、そのユーザの体組成データを取得できるようになる。データがメモリに複数保存されている場合はデータが複数返ってくる。
     *
     * @returns List of UC421BLEBodyCompositionResult object. UC421BLEBodyCompositionResultオブジェクトの配列。
     */
    getBodyCompositionDataWait(): Promise<UC421BLEBodyCompositionResult[]>;
    /**
     * Change the runnning mode. By default it's 'measurement' mode, and if you want to do some setting, call this function with an argument 'setting' and go into 'setting' mode.
     * After 180 seconds passed since this function called, it gets back to its normal 'measurement' mode from 'setting' mode.
     *
     * 動作モード変更。デフォルトでは'measurement'(測定)モードだが、本体設定を行いたい時はこの関数を呼んで'setting'(設定)モードに変更する。
     * この関数を呼んでから180秒後に、通常の'measurement'(測定)モードに戻る。
     *
     * @param mode Target mode you want the peripheral to go into. 'measurement' or 'setting'. 変更したいモード。'measurement'または'setting'。
     */
    changeRunningModeWait(mode: 'measurement' | 'setting'): Promise<void>;
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
    setMedicalExamModeWait(mode: 'on' | 'off'): Promise<void>;
    /**
     * Get if the medical exam mode is on or off.
     *
     * 検診モード設定状況取得。
     *
     * @returns true for medical exam mode on and false for off
     */
    isMedicalExamModeOnWait(): Promise<boolean>;
    /**
     * Send disconnect request to peripheral.
     *
     * 切断要求をペリフェラルに送信。
     */
    disconnectWait(): Promise<void>;
    private _toCcArr;
    private _getAge;
    private _setTimeWait;
    private _getCurrentTimeServiceWait;
    private _getUserDataServiceWait;
    private _getWeightScaleServiceWait;
    private _getBodyCompositionServiceWait;
    private _getAAndDCustomServiceWait;
    private _getCurrentTimeCharWait;
    private _getUserControlPointCharWait;
    private _getFirstNameCharWait;
    private _getLastNameCharWait;
    private _getEmailCharWait;
    private _getBirthCharWait;
    private _getGenderCharWait;
    private _getHeightCharWait;
    private _getWeightScaleMeasurementCharWait;
    private _getBodyCompositionMeasurementCharWait;
    private _getAAndDCustomWriteReadCharWait;
    private _getAAndDCustomNotificationCharWait;
}
export {};
