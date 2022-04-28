/**
 * @packageDocumentation
 * @module Parts.UC421BLE
 */
import BleRemotePeripheral from '../../../obniz/libs/embeds/bleHci/bleRemotePeripheral';
import ObnizPartsBleInterface, { ObnizPartsBleInfo } from '../../../obniz/ObnizPartsBleInterface';
export interface UC421BLEOptions {
}
/**
 * UC421BLEから送られてくる体重データ
 */
export interface UC421BLEWeightResult {
    /**
     * 身長(cm)
     * 設定可能範囲 90 ~ 220
     * 該当ユーザに対して身長が設定されていない場合はこの項目は存在しない
     */
    height?: number;
    /**
     * 体重(kg/lb)
     * デフォルトはkg
     * 測定エラーの時はnull
     */
    weight?: {
        unit: 'kg' | 'lb';
        value: number;
    } | null;
    /**
     * BMI
     * 該当ユーザに対して身長が設定されていない場合はこの項目は存在しない
     */
    bmi?: number;
    /**
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
 * UC421BLEから送られてくる体組成データ
 * この値を取得するには事前に該当ユーザに対して身長、性別、年齢を登録しておく必要がある
 */
export interface UC421BLEBodyCompositionResult {
    /**
     * 体脂肪率(%)
     * 測定エラーの時はnull
     */
    bodyFatPercentage?: number | null;
    /**
     * 基礎代謝(kj)
     * 測定エラーの時はnull
     */
    basalMetabolismKj?: number | null;
    /**
     * 筋肉量(kg/lb)
     * デフォルトはkg
     * 測定エラーの時はnull
     */
    muscleMass?: {
        unit: 'kg' | 'lb';
        value: number;
    } | null;
    /**
     * 水分量(kg/lb)
     * デフォルトはkg
     * 測定エラーの時はnull
     */
    bodyWaterMass?: {
        unit: 'kg' | 'lb';
        value: number;
    } | null;
    /**
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
 * ユーザNo
 * 設定可能範囲: 1 ~ 5
 * 自分でNoを指定することはできず、ユーザNo取得関数(aquireNewUserNoWait)を実行した際に体組成計が空いているユーザNoを自動で設定する
 */
export declare type UserNo = typeof arrUserNoType[number];
/**
 * ゲストユーザNo
 * 99で固定
 */
export declare type GuestUserNo = typeof arrGuestUserNoType[number];
/**
 * UC421BLEに登録するユーザ情報
 * 設定を行う際はユーザNoを指定して、それに紐づける形で登録を行う
 * ユーザ情報の誕生日、性別、身長を利用して体組成データを生成する
 */
export interface UC421BLEUserInfoData {
    /**
     * メールアドレス(UTF-8)
     * 設定可能範囲: 1 ~ 16バイト
     */
    email?: string;
    /**
     * 名前(UTF-8)
     * 設定可能範囲: 1 ~ 20バイト
     */
    firstName?: string;
    /**
     * 苗字(UTF-8)
     * 設定可能範囲: 1 ~ 20バイト
     */
    lastName?: string;
    /**
     * 誕生日
     * 設定可能範囲: 年齢換算時 5 ~ 99歳
     */
    birth?: {
        year: number;
        month: number;
        day: number;
    };
    /**
     * 性別
     * 'unspecified'を設定すると体組成データが取得できない
     */
    gender?: 'male' | 'female' | 'unspecified';
    /**
     * 身長(cm)
     * 設定可能範囲: 90 ~ 220
     */
    height?: number;
}
/**
 * UC421BLEのAdvertisementに含まれるManufacturerSpecificData
 */
export interface UC421BLEManufacturerSpecificData {
    /**
     * 会社コード
     * 105(A&D Engineering Inc.)で固定
     */
    companyCode: number;
    /**
     * 動作モード関連情報
     */
    opMode: {
        /**
         * 動作モード
         * measurementWithApp: アプリ有り測定モード（デフォルト）
         * measurementWithoutApp: アプリ無し測定モード（アプリ無し測定でユーザNo確定後60秒のみ）
         */
        runningMode: 'measurementWithApp' | 'measurementWithoutApp';
        /**
         * 検診モードフラグ
         * 検診モードは測定情報がメモリに保存されない
         * アプリ有り測定とアプリ無し測定があり、アプリ無し測定の場合は体重データのみ取得できる
         * ユーザはゲストユーザ固定(No:99, CC:9999)
         */
        isMedicalExamModeOn: boolean;
        /**
         * 時刻設定フラグ
         */
        isTimeSet: boolean;
        /**
         * ユーザ1の測定データが保存されているかどうか
         * 体重データ、体組成データのいずれかが保存されていればtrue
         */
        hasMemoryForUser1: boolean;
        /**
         * ユーザ2の測定データが保存されているかどうか
         * 体重データ、体組成データのいずれかが保存されていればtrue
         */
        hasMemoryForUser2: boolean;
        /**
         * ユーザ3の測定データが保存されているかどうか
         * 体重データ、体組成データのいずれかが保存されていればtrue
         */
        hasMemoryForUser3: boolean;
        /**
         * ユーザ4の測定データが保存されているかどうか
         * 体重データ、体組成データのいずれかが保存されていればtrue
         */
        hasMemoryForUser4: boolean;
        /**
         * ユーザ5の測定データが保存されているかどうか
         * 体重データ、体組成データのいずれかが保存されていればtrue
         */
        hasMemoryForUser5: boolean;
        /**
         * 新規ユーザの空きがあるかどうか
         * ※ ユーザデータは最大5人分まで保存できる
         */
        haveSeatsForNewUser: boolean;
    };
    /**
     * アプリ有り測定モード（デフォルト）の時は固定で255
     * アプリ無し測定モード（アプリ無し測定でユーザNo確定後60秒のみ）の時は確定したユーザID（一般ユーザ: 1~5, ゲストユーザ:99）
     */
    id: number;
}
/**
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
    static isDevice(peripheral: BleRemotePeripheral): boolean | "" | null;
    /**
     * Extract a manufacturer specific data from an advertisement sent from UC421BLE
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
    updateUserInfoDataWait(userInfo: UC421BLEUserInfoData): Promise<void>;
    getUserInfoDataWait(): Promise<UC421BLEUserInfoData>;
    getWeightDataWait(): Promise<UC421BLEWeightResult[]>;
    getBodyCompositionDataWait(): Promise<UC421BLEBodyCompositionResult[]>;
    changeRunningModeWait(mode: 'measurement' | 'setting'): Promise<void>;
    setMedicalExamModeWait(mode: 'on' | 'off'): Promise<void>;
    isMedicalExamModeOnWait(): Promise<boolean>;
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
