/**
 * @packageDocumentation
 * @module Parts.W5500
 */
import Obniz from '../../../obniz';
import { PeripheralIO } from '../../../obniz/libs/io_peripherals/io';
import { PeripheralSPI } from '../../../obniz/libs/io_peripherals/spi';
import { ObnizPartsInterface, ObnizPartsInfo } from '../../../obniz/ObnizPartsInterface';
/** W5500 type definitions and constants W5500の型定義や定数 */
export declare namespace W5500Parts {
    /** Pin assignment and SPI options ピンアサインとSPIオプション */
    interface WiredOptions {
        /** Reset pin number (initial value: 12) リセットピン番号 (初期値: 12) */
        reset?: number;
        /** SPI MOSI pin number (initial value: 23) SPIのMOSIピン番号 (初期値: 23) */
        mosi?: number;
        /** SPI MISO pin number (initial value: 19) SPIのMISOピン番号 (初期値: 19) */
        miso?: number;
        /** SPI CLK pin number (initial value: 18) SPIのCLKピン番号 (初期値: 18) */
        clk?: number;
        /** SPI CS pin number (initial value: 33) SPIのCSピン番号 (初期値: 33) */
        cs?: number;
        /**
         * SPI clock frequency (initial value: 20000000(26Mhz))
         *
         * SPIのクロック周波数(初期値: 20000000(26Mhz))
         */
        frequency?: number;
    }
    /** W5500 config W5500の設定内容 */
    interface Config {
        /** Wait for Wake on LAN WakeOnLANを待ち受ける */
        wol?: boolean;
        /** Do not respond to ping pingを応答しない */
        pingBlock?: boolean;
        /** Use PPPoE PPPoEを使用する */
        pppoe?: boolean;
        /**
         * Always send an ARP request when sending data
         *
         * データを送信した時は必ずARPリクエストを送信する
         */
        forceArp?: boolean;
        /**
         * Uses fixed data length (maximum 4 bytes) communication, automatically turned on when CS pin is not specified
         *
         * 固定データ長(最大4bytes)通信を使用する、CSピン指定がない場合自動的にオン
         */
        fdm?: boolean;
        /** IPv4 address of default gateway デフォルトゲートウェイのIPv4アドレス */
        gatewayIP: string;
        /** Subnet mask サブネットマスク */
        subnetMask: string;
        /** MAC address MACアドレス */
        macAddress: string;
        /** Local IPv4 address ローカルIPv4アドレス */
        localIP: string;
        /** Retry interval 再試行間隔 */
        retryTime?: number;
        /** Retry count 再試行回数 */
        retryCount?: number;
        /**
         * Time to send echo request for Link Control Protocol
         *
         * LinkControlプロトコルのechoリクエストを送っている時間
         */
        linkControlProtocolRequestTimer?: number;
        /**
         * 1 byte of the 4 bytes magic number of the Link Control protocol echo request
         *
         * LinkControlプロトコルのechoリクエストの4bytesマジックナンバーの1byte
         */
        linkControlProtocolMagicNumber?: number;
        /** MAC address of PPPoE server PPPoEサーバーのMACアドレス */
        pppoeDestMACAddress?: string;
        /** Session ID of PPPoE Server PPPoEサーバーのセッションID */
        pppoeSessionID?: number;
        /** Maximum receiving unit size of PPPoE PPPoEの最大受信ユニットサイズ */
        pppoeMaxSegmentSize?: number;
        /** Physical layer settings 物理層の設定 */
        phyConfig?: PhysicalLayerOptions;
        /** Do not always check transfer when writing 常に書き込み時に転送チェックを行わない */
        forceNoCheckWrite?: boolean;
        /** Event handler for interrupt "IPConflict" 割り込み「IPConflict」のイベントハンドラー */
        onIPConflictInterrupt?: (ethernet: W5500) => Promise<void>;
        /** Event handler for interrupt "DestUnreach" 割り込み「DestUnreach」のイベントハンドラー */
        onDestUnreachInterrupt?: (ethernet: W5500, extra?: W5500Parts.DestInfo) => Promise<void>;
        /** Event handler for interrupt "PPPoEClose" 割り込み「PPPoEClose」のイベントハンドラー */
        onPPPoECloseInterrupt?: (ethernet: W5500) => Promise<void>;
        /** Event handler for interrupt "MagicPacket" 割り込み「MagicPacket」のイベントハンドラー */
        onMagicPacketInterrupt?: (ethernet: W5500) => Promise<void>;
        /** Event handler for all interrupts */
        onAllInterrupt?: (ethernet: W5500, name: W5500Parts.Interrupt, extra?: W5500Parts.DestInfo) => Promise<void>;
    }
    /** Link speed 接続速度(Mbps)(10/100) */
    type LinkSpeed = 10 | 100;
    /** Physical layer status 物理層のステータス */
    interface PhysicalLayerStatus {
        /** Whether it is full duplex 全二重かどうか */
        duplex: boolean;
        /** Link speed 接続速度 (Mbps) (10/100) */
        speed: LinkSpeed;
        /** Whether the connection is established 接続が確立されているかどうか */
        link: boolean;
    }
    /** Physical layer settings 物理層の設定内容 */
    interface PhysicalLayerOptions {
        /** Physical layer reset 物理層のリセット */
        reset?: boolean;
        /** Auto negotiation 自動ネゴシエーション */
        autoNegotiation?: boolean;
        /** Link speed 接続速度 (Mbps) (10/100) */
        speed?: LinkSpeed;
        /** Whether it is full duplex 全二重かどうか */
        duplex?: boolean;
        /** Whether to turn off the power 電源オフにするかどうか */
        powerOff?: boolean;
    }
    /** Interrupt type 割り込みの種類 */
    type Interrupt = 'IPConflict' | 'DestUnreach' | 'PPPoEClose' | 'MagicPacket';
    /** Flags corresponding to interrupts 割り込みに対応するフラグ */
    const InterruptFlags: {
        [key in Interrupt]: number;
    };
    /** Connection destination information 接続先情報 */
    class DestInfo {
        /** IPv4 address IPv4アドレス */
        readonly ip: string;
        /** Port number ポート番号 */
        readonly port: number;
        /** Address アドレス (Ex. 123.234.0.1:12345) */
        readonly address: string;
        constructor(ip: string, port: number);
    }
}
/** W5500 management class W5500を管理するクラス */
export declare class W5500 implements ObnizPartsInterface {
    static info(): ObnizPartsInfo;
    keys: string[];
    requiredKeys: string[];
    params: any;
    /** Instance of Obniz Obnizのインスタンス */
    protected obniz: Obniz;
    /** Instance of PeripheralSPI PeripheralSPIのインスタンス */
    protected spi: PeripheralSPI;
    /** Instance of reset pin リセットピンのインスタンス */
    protected resetPin: PeripheralIO;
    /** Instance of chip select pin チップセレクトピンのインスタンス */
    protected csPin: PeripheralIO;
    /**
     * Whether to communicate with a fixed length, forces true if no chip select pin is specified
     *
     * 固定長通信するかどうか、チップセレクトピンが指定されていない場合、強制的にtrue
     */
    protected fdm: boolean;
    /**
     * Holds a handler that catches interrupts by message
     *
     * 割り込みをメッセージ別でキャッチするハンドラーを保持
     */
    protected interruptHandlers: {
        [key in W5500Parts.Interrupt]?: ((ethernet: W5500) => Promise<void>) | ((ethernet: W5500, extra?: W5500Parts.DestInfo) => Promise<void>);
    };
    /**
     * Holds a handler that catches all interrupts
     *
     * 割り込みを全てキャッチするハンドラーを保持
     */
    protected allInterruptHandler?: (ethernet: W5500, msg: W5500Parts.Interrupt, extra?: W5500Parts.DestInfo) => Promise<void>;
    /** Array of socket instances ソケットのインスタンスの配列 */
    protected socketList: W5500Socket[];
    /** SPI status SPIのステータス */
    protected spiStatus: boolean;
    /**
     * Do not always check transfer when writing
     *
     * 常に書き込み時に転送チェックを行わない
     */
    protected forceNoCheckWrite: boolean;
    constructor();
    wired(obniz: Obniz): void;
    /**
     * Initialize W5500 and write common settings
     *
     * W5500を初期化、共通設定の書き込み
     *
     * @param config W5500 config W5500の設定内容
     * @return Write result 書き込み結果
     */
    initWait(config: W5500Parts.Config): Promise<boolean>;
    /**
     * Terminates each socket and terminates SPI communication
     *
     * 各ソケットの終了処理をし、SPI通信を終了
     */
    finalizeWait(): Promise<void>;
    /**
     * Set a handler to catch a specific interrupt
     *
     * Run checkInterruptWait() regularly to actually catch
     *
     * 特定の割り込みをキャッチするハンドラーを設定
     *
     * 実際にキャッチするにはcheckInterrupt()を定期的に実行
     *
     * @param name Name of the interrupt to get 取得する割り込みの名前 (IPConflict | DestUnreach | PPPoEClose | MagicPacket)
     * @param handler Callback function, extra is only when name=DestUnreach
     *
     * コールバック関数、extraはname=DestUnreachのときのみ
     */
    setInterruptHandler(name: W5500Parts.Interrupt, handler: ((ethernet: W5500) => Promise<void>) | ((ethernet: W5500, extra?: W5500Parts.DestInfo) => Promise<void>)): void;
    /**
     * Set handler to catch all interrupts
     *
     * Run checkInterruptWait() regularly to actually catch
     *
     * 全ての割り込みをキャッチするハンドラーを設定
     *
     * 実際にキャッチするにはcheckInterrupt()を定期的に実行
     *
     * @param handler Callback function, name is the name of the interrupt received, extra is only when name=DestUnreach
     *
     * コールバック関数、nameには受け取った割り込み名が入ります、extraはname=DestUnreachのときのみ
     */
    setAllInterruptHandler(handler: (ethernet: W5500, name: W5500Parts.Interrupt, extra?: W5500Parts.DestInfo) => Promise<void>): void;
    /**
     * Wait until the connection with the router is established
     *
     * ルーターとの接続が確立されるまで待機
     *
     * @return Physical layer status 物理層のステータス
     */
    waitLinkUpWait(): Promise<W5500Parts.PhysicalLayerStatus>;
    /**
     * Get an instance of W5500Socket, generate if necessary
     *
     * W5500Socketのインスタンスを取得、必要ならば生成
     *
     * @param socketId Socket ID (0\~7) ソケットID (0\~7)
     * @return Instance of W5500Socket W5500Socketのインスタンス
     */
    getSocket(socketId: number): W5500Socket;
    /**
     * Create an instance of W5500Socket in the frame of the unused socket
     *
     * 使っていないソケットの枠にW5500Socketのインスタンスを生成
     *
     * @return Instance of W5500Socket W5500Socketのインスタンス
     */
    getNewSocket(): W5500Socket | null;
    /**
     * Whether SPI is available
     *
     * SPIが利用可能かどうか
     *
     * @return SPI status SPIのステータス
     */
    getSpiStatus(): boolean;
    /**
     * Reset W5500 in hardware
     *
     * W5500をハードウェア的にリセット
     */
    hardResetWait(): Promise<void>;
    /**
     * Set mode モードを設定
     *
     * @param config WakeOnLAN(WoL), PingBlock, PPPoE and ForceARP
     * @return Write result 書き込み結果
     */
    setModeWait(config: W5500Parts.Config): Promise<boolean>;
    /**
     * Set IPv4 address of default gateway
     *
     * デフォルトゲートウェイのIPv4アドレスを設定
     *
     * @param ip IPv4 address IPv4アドレス
     * @return Write result 書き込み結果
     */
    setGatewayWait(ip: string): Promise<boolean>;
    /**
     * Set subnet mask サブネットマスクを設定
     *
     * @param mask Subnet mask サブネットマスク
     * @return Write result 書き込み結果
     */
    setSubnetMask(mask: string): Promise<boolean>;
    /**
     * Set MAC address MACアドレスを設定
     *
     * @param mac MAC address MACアドレス
     * @return Write result 書き込み結果
     */
    setMacAddressWait(mac: string): Promise<boolean>;
    /**
     * Set local IPv4 address ローカルIPv4アドレスを設定
     *
     * @param ip IPv4 address IPv4アドレス
     * @return Write result 書き込み結果
     */
    setLocalIPWait(ip: string): Promise<boolean>;
    /**
     * Check for interrupts (doesn't work properly with VDM)
     *
     * Also check socket interrupts
     *
     * If there is an interrupt, call the preset handler
     *
     * 割り込みをチェック(VDMの時、正常に動作しません)
     *
     * ソケットの割り込みもチェックします
     *
     * 割り込みがあった場合、事前に設定されたhandlerを呼び出します
     *
     * @param disableAllSocketCheck When it's true, do not call checkInterruptWait() for all sockets
     *
     * trueの時、全ソケットのcheckInterrupt()呼び出しを行いません
     * @return Then whether you can check for interrupts
     *
     * 次に割り込みをチェックできるかどうか
     */
    checkInterruptWait(disableAllSocketCheck?: boolean): Promise<boolean>;
    /**
     * Set interrupt mask 割り込みマスクを設定
     *
     * @param mask Mask マスク
     * @return Write result 書き込み結果
     */
    setInterruptMaskWaut(mask: number): Promise<boolean>;
    /**
     * Set retry interval (Initial value: 200ms) 再試行間隔を設定 (初期値: 200ms)
     *
     * @param time Retry interval (in 0.2ms increments) 再試行間隔 (0.2ms刻み) (0\~6553.5ms)
     * @return Write result 書き込み結果
     */
    setRetryTimeWait(time: number): Promise<boolean>;
    /**
     * Set retry count (Initial value: 8 times) 再試行回数を設定 (初期値: 8回)
     *
     * @param count retry count 再試行回数 (0\~255)
     * @return Write result 書き込み結果
     */
    setRetryCountWait(count: number): Promise<boolean>;
    /**
     * Set time to send echo request for Link Control Protocol
     *
     * LinkControlプロトコルのechoリクエストを送っている時間を設定
     *
     * @param time time (in 25ms increments) 時間 (25ms刻み) (0\~6375ms)
     * @return Write result 書き込み結果
     */
    setPPPLinkControlProtocolRequestTimerWait(time: number): Promise<boolean>;
    /**
     * Set 1 byte of the 4 bytes magic number of the Link Control protocol echo request
     *
     * LinkControlプロトコルのechoリクエストの4bytesマジックナンバーの1byteを設定
     *
     * @param num Magic number マジックナンバー
     * @return Write result 書き込み結果
     */
    setPPPLinkControlProtocolMagicNumberWait(num: number): Promise<boolean>;
    /**
     * Set MAC address of PPPoE server PPPoEサーバーのMACアドレスを設定
     *
     * @param mac MAC address MACアドレス
     * @return Write result 書き込み結果
     */
    setPPPoEMacAddressWait(mac: string): Promise<boolean>;
    /**
     * Set session ID of PPPoE server PPPoEサーバーのセッションIDを設定
     *
     * @param id Session ID セッションID
     * @return Write result 書き込み結果
     */
    setPPPoESessionIDWait(id: number): Promise<boolean>;
    /**
     * Set maximum receiving unit size of PPPoE PPPoEの最大受信ユニットサイズを設定
     *
     * @param size Unit size ユニットサイズ
     * @return Write result 書き込み結果
     */
    setPPPoEMaxSegmentSizeWait(size: number): Promise<boolean>;
    /**
     * Get the IPv4 address when the destination could not be reached
     *
     * 宛先に到達できなかった時のIPv4アドレスを取得
     *
     * @return IPv4 address IPv4アドレス
     */
    getUnreachableIP(): Promise<string>;
    /**
     * Get the port number when the destination could not be reached
     *
     * 宛先に到達できなかった時のポート番号を取得
     *
     * @return Port number ポート番号
     */
    getUnreachablePort(): Promise<number>;
    /**
     * Get physical layer status 物理層のステータス取得
     *
     * @return Physical layer status 物理層のステータス
     */
    getPhysicalStatusWait(): Promise<W5500Parts.PhysicalLayerStatus>;
    /**
     * Set physical layer config 物理層の設定
     *
     * @param config Physical layer config 物理層の設定内容
     * @return Write result 書き込み結果
     */
    setPhysicalConfigWait(config: W5500Parts.PhysicalLayerOptions): Promise<boolean>;
    /**
     * Get chip version チップバージョンの取得
     *
     * @return Chip version チップバージョン
     */
    getVersion(): Promise<number>;
    /**
     * Write after validating the IPv4 address of the character string
     *
     * 文字列のIPv4アドレスをバリデーションチェックしてから書き込み
     *
     * @param address Start address of write destination 書き込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @param ip IPv4 address IPv4アドレス
     * @return Write result 書き込み結果
     * @hidden
     */
    ipWriteWait(address: number, bsb: number, ip: string): Promise<boolean>;
    /**
     * Write after validating the MAC address of the character string
     *
     * 文字列のMACアドレスをバリデーションチェックしてから書き込み
     *
     * @param address Start address of write destination 書き込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @param mac MAC address MACアドレス
     * @return Write result 書き込み結果
     * @hidden
     */
    macWriteWait(address: number, bsb: number, mac: string): Promise<boolean>;
    /**
     * Writing large data
     *
     * Used when the length is larger than 4 in FDM
     *
     * Used when the length is greater than 1021 for VDM
     *
     * 大きいデータの書き込み
     *
     * FDMのとき、長さが4より大きいときに使用
     *
     * VDMのとき、長さが1021より大きいときに使用
     *
     * @param address Start address of write destination 書き込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @param data Raw byte data Raw byte data バイト列データ
     * @param noWait Do not use spi.writeWait() when writing data データ書き込み時、spi.writeWait()を使用しない
     * @return Write result 書き込み結果
     * @hidden
     */
    bigWriteWait(address: number, bsb: number, data: number[], noWait?: boolean): Promise<boolean>;
    /**
     * Writing a value to the area for one address
     *
     * 1アドレス分の領域への値の書き込み
     *
     * @param address Start address of write destination 書き込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @param num Value 値 (0\~255)
     * @return Write result 書き込み結果
     * @hidden
     */
    numWriteWait(address: number, bsb: number, num: number): Promise<boolean>;
    /**
     * Writing a value to the area for two addresses
     *
     * 2アドレス分の領域への値の書き込み
     *
     * @param address Start address of write destination 書き込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @param num Value 値 (0\~65535)
     * @return Write result 書き込み結果
     * @hidden
     */
    num2WriteWait(address: number, bsb: number, num: number): Promise<boolean>;
    /**
     * Read IPv4 address data IPv4アドレスデータの読み込み
     *
     * @param address Start address of read destination 読み込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @return IPv4 address IPv4アドレス
     * @hidden
     */
    ipReadWait(address: number, bsb: number): Promise<string>;
    /**
     * Reading large data
     *
     * Used when the length is larger than 4 in FDM
     *
     * Used when the length is greater than 1021 for VDM
     *
     * 大きいデータの読み込み
     *
     * FDMのとき、長さが4より大きいときに使用
     *
     * VDMのとき、長さが1021より大きいときに使用
     *
     * @param address Start address of read destination 読み込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @param length Data length (byte length) データの長さ (バイト長)
     * @return Read data 読み込みデータ
     * @hidden
     */
    bigReadWait(address: number, bsb: number, length: number): Promise<number[]>;
    /**
     * Reading values from the area for one address
     *
     * 1アドレス分の領域からの値の読み込み
     *
     * @param address Start address of read destination 読み込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @return Value 値 (0\~255)
     * @hidden
     */
    numReadWait(address: number, bsb: number): Promise<number>;
    /**
     * Reading values from the area for two addresses
     *
     * 2アドレス分の領域からの値の読み込み
     *
     * @param address Start address of read destination 読み込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @return Value 値 (0\~65535)
     * @hidden
     */
    num2ReadWait(address: number, bsb: number): Promise<number>;
    /**
     * Validate and write the address based on the definition
     *
     * アドレスを定義に基づいてバリデーションチェックして書き込み
     *
     * @param address Start address of write destination 書き込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @param val String of the address to write 書き込むアドレスの文字列
     * @param name Type name of the address アドレスの種類名
     * @param example Sample string of the address, for errors アドレスのサンプル文字列、エラー用
     * @param splitVal Address split character アドレスの分割文字
     * @param length Length when the address is divided by the split character アドレスを分割文字で分割した時の長さ
     * @param radix Description format of numbers in the address (N-ary) アドレス内の数字の記述形式 (N進数)
     * @hidden
     */
    private addressWriteWait;
    /**
     * Writing normal data
     *
     * For FDM, the length is up to 4
     *
     * For VDM, the length is up to 1021
     *
     * 通常データの書き込み
     *
     * FDMのとき、長さは4まで
     *
     * VDMのとき、長さは1021まで
     *
     * @param address Start address of write destination 書き込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @param data Raw byte data バイト列データ
     * @param noWait Do not use spi.writeWait() when writing data データ書き込み時、spi.writeWait()を使用しない
     * @return Write result 書き込み結果
     * @hidden
     */
    private writeWait;
    /**
     * Reading normal data
     *
     * 通常データの読み込み
     *
     * @param address Start address of read destination 読み込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @param length Data length (byte length) データの長さ (バイト長)
     * @return Read data 読み込みデータ
     * @hidden
     */
    private readWait;
    /**
     * 読み書き共通のメソッド、返却されたデータを検証
     *
     * Common read / write method, verify returned data
     *
     * @param address Start address of operation destination 操作先の先頭アドレス (0x0000\~0xFFFF)
     * @param bsb Block select bit ブロック選択ビット (0b00000\~0b11111)
     * @param mode Read or write 読み込みか書き込みか (Read|Write)
     * @param data Raw byte data バイト列データ (0xFF\*1\~4(FDM), \*1\~1021(VDM))
     * @param noWait Do not use spi.writeWait for communication 通信にspi.writeWaitを使用しない
     * @return Write: Write result  Read: Read data
     *
     * 書込: 書き込み結果  読込: 読み込みデータ
     * @hidden
     */
    private sendWait;
}
/** W5500 socket definitions and constants W5500のソケットの定義や定数 */
export declare namespace W5500SocketParts {
    /** Socket config ソケットの設定内容 */
    interface Config {
        /** Protocol to use 使用プロトコル (TCPClient/TCPServer/UDP/null) */
        protocol: Protocol;
        /**
         * Use multicast (UDP Only) (Set Before Open Command)
         *
         * マルチキャストの使用(UDPのみ)(Openコマンドの前で設定)
         */
        multicast?: boolean;
        /**
         * Do not receive broadcast packets (UDP only)
         *
         * ブロードキャストされたパケットを受信しない(UDPのみ)
         */
        broardcastBlock?: boolean;
        /**
         * Send an ACK immediately when data is received (TCP only)
         *
         * データを受信したときにACKをすぐに送信する(TCPのみ)
         */
        noDelayACK?: boolean;
        /**
         * Use IGMPv1 for multicast (UDP only)
         *
         * マルチキャストでIGMPv1を使う(UDPのみ)
         */
        multicastVer1?: boolean;
        /**
         * Do not receive unicast packets (UDP only)
         *
         * ユニキャストされたパケットを受信しない(UDPのみ)
         */
        unicastBlock?: boolean;
        /** Source port number 接続元ポート番号 */
        sourcePort?: number;
        /** Connection destination IPv4 address 接続先IPv4アドレス */
        destIP?: string;
        /** Connection destination port number 接続先ポート番号 */
        destPort?: number;
        /** Maximum segment size (TCP only) 最大セグメントサイズ (TCPのみ) (0\~65535) */
        maxSegmentSize?: number;
        /** IP service type IPサービスタイプ (1byte) */
        ipType?: number;
        /** TTL (0\~65535) */
        ttl?: number;
        /**
         * Receive buffer size (KB) only to the power of 2, up to 16
         *
         * 受信バッファサイズ(KB) 2の累乗のみ、16まで
         */
        rxBufferSize?: BufferSize;
        /**
         * Send buffer size (KB) only to the power of 2, up to 16
         *
         * 送信バッファサイズ(KB) 2の累乗のみ、16まで
         */
        txBufferSize?: BufferSize;
        /** IP header fragment IPヘッダーのフラグメント (0x0000\~0xFFFF) */
        ipFragment?: number;
        /**
         * keep-alive transmission interval (sec) (TCP only) (0\~1275)
         *
         * keep-alive 送信間隔(秒)(TCPのみ)(0\~1275)
         */
        keepAliveTimer?: number;
        /**
         * Treat received data as string (UTF-8)
         *
         * 受信データを文字列(UTF-8)として扱う
         */
        stringMode?: boolean;
        /** Event handler for interrupt "SendOK" 割り込み「SendOK」のイベントハンドラー */
        onSendOKInterrupt?: (socket: W5500Socket) => Promise<void>;
        /** Event handler for interrupt "Timeout" 割り込み「Timeout」のイベントハンドラー */
        onTimeoutInterrupt?: (socket: W5500Socket) => Promise<void>;
        /** Event handler for interrupt "ReceiveData" 割り込み「ReceiveData」のイベントハンドラー */
        onReceiveDataInterrupt?: (socket: W5500Socket, extra?: number[] | string | W5500Parts.DestInfo) => Promise<void>;
        /** Event handler for interrupt "Disconnect" 割り込み「Disconnect」のイベントハンドラー */
        onDisconnectInterrupt?: (socket: W5500Socket) => Promise<void>;
        /** Event handler for interrupt "ConnectSuccess" 割り込み「ConnectSuccess」のイベントハンドラー */
        onConnectSuccessInterrupt?: (socket: W5500Socket, extra?: number[] | string | W5500Parts.DestInfo) => Promise<void>;
        /** Event handler for all interrupts 全ての割り込みのイベントハンドラー */
        onAllInterrupt?: (socket: W5500Socket, name: W5500SocketParts.Interrupt, extra?: number[] | string | W5500Parts.DestInfo) => Promise<void>;
    }
    /** Socket available protocol ソケットの使用可能プロトコル */
    type Protocol = 'TCPClient' | 'TCPServer' | 'UDP' | null;
    /** Buffer size バッファサイズ */
    type BufferSize = 0 | 1 | 2 | 4 | 8 | 16;
    /** Socket available commands ソケットの使用可能コマンド */
    type Command = 'Open' | 'Listen' | 'Connect' | 'Disconnect' | 'Close' | 'Send' | 'SendMAC' | 'SendKeep' | 'Receive';
    /**
     * Value corresponding to socket command
     *
     * ソケットのコマンドに対応する値
     */
    const CommandCodes: {
        [key in Command]: number;
    };
    /** Socket status ソケットのステータス */
    type Status = 'Closed' | 'Init' | 'Listen' | 'SynSent' | 'SynReceive' | 'Established' | 'FinWait' | 'Closing' | 'TimeWait' | 'CloseWait' | 'LastACK' | 'UDP' | 'MACRAW';
    /**
     * Value corresponding to socket status
     *
     * ソケットのステータスに対応する値
     */
    const StatusCodes: {
        [key in Status]: number;
    };
    /** Socket interrupt ソケットの割り込み */
    type Interrupt = 'SendOK' | 'Timeout' | 'ReceiveData' | 'Disconnect' | 'ConnectSuccess';
    /**
     * Flags corresponding to socket interrupts
     *
     * ソケットの割り込みに対応するフラグ
     */
    const InterruptFlags: {
        [key in Interrupt]: number;
    };
}
/**
 * Class that performs and manages socket communication
 *
 * ソケット通信を行い管理するクラス
 */
export declare class W5500Socket {
    /** Socket ID ソケットID */
    readonly id: number;
    /**
     * Treat received data as string (UTF-8)
     *
     * 受信データを文字列(UTF-8)として扱う
     */
    stringMode: boolean;
    /** Current protocol 現在のプロトコル */
    protected protocol: W5500SocketParts.Protocol;
    /** Instance of W5500 W5500のインスタンス */
    protected ethernet: W5500;
    /**
     * Holds a handler that catches interrupts by message
     *
     * 割り込みをメッセージ別でキャッチするハンドラーを保持
     */
    protected interruptHandlers: {
        [key in W5500SocketParts.Interrupt]?: ((socket: W5500Socket) => Promise<void>) | ((socket: W5500Socket, extra?: number[] | string | W5500Parts.DestInfo) => Promise<void>);
    };
    /**
     * Holds a handler that catches all interrupts
     *
     * 割り込みを全てキャッチするハンドラーを保持
     */
    protected allInterruptHandler?: (socket: W5500Socket, msg: W5500SocketParts.Interrupt, extra?: number[] | string | W5500Parts.DestInfo) => Promise<void>;
    /** Hold data read address データ読み込みのアドレスを保持 */
    protected rxReadDataPointer: number;
    constructor(id: number, ethernet: W5500);
    /**
     * Write the socket settings and open the socket (Connect / Listen is also executed for TCP)
     *
     * ソケット設定の書き込みをし、ソケットをOpenに(TCPの時はConnect/Listenも実行)
     *
     * @param config Socket config ソケットの設定内容
     * @return Write result 書き込み結果
     */
    initWait(config: W5500SocketParts.Config): Promise<boolean>;
    /**
     * Socket termination process ソケットの終了処理
     */
    finalizeWait(): Promise<void>;
    /**
     * Send data データを送信
     *
     * @param data Raw byte data or string to send 送信するバイトデータまたは文字列
     * @return Write result 書き込み結果
     */
    sendDataWait(data: number[] | string): Promise<boolean>;
    /**
     * Send data, no write check データを送信、書き込みチェックなし
     *
     * @param data Raw byte data or string to send 送信するバイトデータまたは文字列
     * @return Write result 書き込み結果
     */
    sendDataFastWait(data: number[] | string): Promise<boolean>;
    /**
     * Read the received data 受信されたデータを読取
     *
     * @return Raw byte data or string to receive 受信データまたは文字列
     */
    receiveDataWait(): Promise<string | number[]>;
    /**
     * Set a handler to catch a specific interrupt
     *
     * Run checkInterruptWait() regularly to actually catch
     *
     * 特定の割り込みをキャッチするハンドラーを設定
     *
     * 実際にキャッチするにはcheckInterrupt()を定期的に実行
     *
     * @param name The name of the interrupt to get 取得する割り込みの名前 (SendOK | Timeout | ReceiveData | Disconnect | ConnectSuccess)
     * @param handler Callback function, extra is only when name=ReceiveData and when name=ConnectSuccess and protocol=TCPServer
     *
     * コールバック関数、extraはname=ReceiveDataの時とname=ConnectSuccessかつprotocol=TCPServerの時のみ
     */
    setInterruptHandler(name: W5500SocketParts.Interrupt, handler: ((socket: W5500Socket) => Promise<void>) | ((socket: W5500Socket, extra?: number[] | string | W5500Parts.DestInfo) => Promise<void>)): ((socket: W5500Socket) => Promise<void>) | ((socket: W5500Socket, extra?: number[] | string | W5500Parts.DestInfo) => Promise<void>);
    /**
     * Set a handler to catch all interrupts
     *
     * Run checkInterruptWait() regularly to actually catch
     *
     * 全ての割り込みをキャッチするハンドラーを設定
     *
     * 実際にキャッチするにはcheckInterrupt()を定期的に実行
     *
     * @param handler Callback function, name is the type of interrupt, extra is only when name=ReceiveData and when name=ConnectSuccess and protocol=TCPServer
     *
     * コールバック関数、nameは割り込みの種類、extraはname=ReceiveDataの時とname=ConnectSuccessかつprotocol=TCPServerの時のみ
     */
    setAllInterruptHandler(handler: (socket: W5500Socket, name: W5500SocketParts.Interrupt, extra?: number[] | string | W5500Parts.DestInfo) => Promise<void>): (socket: W5500Socket, name: W5500SocketParts.Interrupt, extra?: number[] | string | W5500Parts.DestInfo) => Promise<void>;
    /**
     * Get the current protocol 現在のプロトコルを取得
     *
     * @return Protocol プロトコル
     */
    getProtocol(): W5500SocketParts.Protocol;
    /**
     * Set mode モードを設定
     *
     * @param config Multicast, BroardcastBlock, NoDelayACK, MulticastVer1, UnicastBlock and Protocol
     * @return Write result 書き込み結果
     */
    setModeWait(config: W5500SocketParts.Config): Promise<boolean>;
    /**
     * Send command コマンドを送信
     *
     * @param command Command コマンド
     * @return Write result 書き込み結果
     */
    sendCommandWait(command: W5500SocketParts.Command): Promise<boolean>;
    /**
     * Check for interrupts
     *
     * If there is an interrupt, call the preset handler
     *
     * 割り込みをチェック
     *
     * 割り込みがあった場合、事前に設定されたhandlerを呼び出します
     *
     * @return Then whether you can check for interrupts
     *
     * 次に割り込みをチェックできるかどうか
     */
    checkInterruptWait(): Promise<boolean | undefined>;
    /**
     * Get Status ステータスを取得
     *
     * @return Status ステータス
     */
    getStatusWait(): Promise<W5500SocketParts.Status | 'UNKNOWN'>;
    /**
     * Set the connection source port 接続元ポートを設定
     *
     * @param port Port number ポート番号
     * @return Write result 書き込み結果
     */
    setSourcePortWait(port: number): Promise<boolean>;
    /**
     * Set the MAC address of the connection destination (only if required by UDP)
     *
     * 接続先のMACアドレスを設定(UDPで必要な場合のみ)
     *
     * @param mac MAC address MACアドレス
     * @return Write result 書き込み結果
     */
    setDestMacAddressWait(mac: string): Promise<boolean>;
    /**
     * Set the IPv4 address of the connection destination
     *
     * 接続先のIPv4アドレスを設定
     *
     * @param ip IPv4 address IPv4アドレス
     * @return Write result 書き込み結果
     */
    setDestIPWait(ip: string): Promise<boolean>;
    /**
     * Get the IPv4 address of the connection source (only for TCP server)
     *
     * 接続元のIPv4アドレスを取得(TCPサーバーのときのみ)
     *
     * @return IPv4 address IPv4アドレス
     */
    getDestIPWait(): Promise<string>;
    /**
     * Set the port number of the connection destination
     *
     * 接続先のポート番号を設定
     *
     * @param port Port number ポート番号
     * @return Write result 書き込み結果
     */
    setDestPortWait(port: number): Promise<boolean>;
    /**
     * Get the port number of the connection source (only for TCP server)
     *
     * 接続元のポート番号を取得(TCPサーバーのときのみ)
     *
     * @return Port number ポート番号
     */
    getDestPortWait(): Promise<number>;
    /**
     * Set maximum segment size (only if required by TCP)
     *
     * 最大セグメントサイズを設定(TCPで必要な場合のみ)
     *
     * @param size 最大セグメントサイズ
     * @return Write result 書き込み結果
     */
    setMaxSegmentSizeWait(size: number): Promise<boolean>;
    /**
     * Set IP service type IPサービスタイプを設定
     *
     * @param type IP service type IPサービスタイプ (1byte)
     * @return Write result 書き込み結果
     */
    setIPTypeOfServiceWait(type: number): Promise<boolean>;
    /**
     * Set TTL TTLを設定
     *
     * @param ttl TTL (0\~65535)
     * @return Write result 書き込み結果
     */
    setTTLWait(ttl: number): Promise<boolean>;
    /**
     * Set buffer size バッファサイズを設定
     *
     * @param size Buffer size バッファサイズ(KB)
     * @param address Start address of write destination 書き込み先の先頭アドレス
     * @return Write result 書き込み結果
     * @hidden
     */
    setBufferSizeWait(size: W5500SocketParts.BufferSize, address: number): Promise<boolean>;
    /**
     * Set receive buffer size 受信バッファサイズを設定
     *
     * @param size Buffer size (KB) only to the power of 2, up to 16
     *
     * バッファサイズ(KB) 2の累乗のみ、16まで
     * @return Write result 書き込み結果
     */
    setRXBufferSizeWait(size: W5500SocketParts.BufferSize): Promise<boolean>;
    /**
     * Set send buffer size 送信バッファサイズを設定
     *
     * @param size Buffer size (KB) only to the power of 2, up to 16
     *
     * バッファサイズ(KB) 2の累乗のみ、16まで
     * @return Write result 書き込み結果
     */
    setTXBufferSizeWait(size: W5500SocketParts.BufferSize): Promise<boolean>;
    /**
     * Get free size of send buffer 送信バッファの空きサイズを取得
     *
     * @return Free size 空きサイズ
     */
    getTXFreeSizeWait(): Promise<number>;
    /**
     * Get the write start address of the send buffer
     *
     * 送信バッファの書き込み開始アドレスを取得
     *
     * @return Address アドレス
     */
    getTXReadPointerWait(): Promise<number>;
    /**
     * Set the next write start address of the send buffer
     *
     * 送信バッファの次の書き込み開始アドレスを設定
     *
     * @param pointer Address アドレス
     * @return Write result 書き込み結果
     */
    setTXWritePointerWait(pointer: number): Promise<boolean>;
    /**
     * Get the length of received data 受信データの長さを取得
     *
     * @return Length 長さ
     */
    getRXReceiveSizeWait(): Promise<number>;
    /**
     * Get the read start address of the receive buffer
     *
     * 受信バッファの読み込み開始アドレスを取得
     *
     * @return Address アドレス
     */
    getRXReadDataPointerWait(): Promise<number>;
    /**
     * Set the next read start address of the receive buffer
     *
     * 受信バッファの次の読み込み開始アドレスを設定
     *
     * @param pointer Address アドレス
     * @return Write result 書き込み結果
     */
    setRXReadDataPointerWait(pointer: number): Promise<boolean>;
    /**
     * Get the write start address of the receive buffer
     *
     * 受信バッファの書き込み開始アドレスを取得
     *
     * @return Address アドレス
     */
    getRXWritePointerWait(): Promise<number>;
    /**
     * Set IP header fragment IPヘッダーのフラグメントを設定
     *
     * @param fragment IP header fragment IPヘッダーのフラグメント (0x0000\~0xFFFF)
     * @return Write result 書き込み結果
     */
    setFragmentWait(fragment: number): Promise<boolean>;
    /**
     * Set keep-alive transmission interval (only if TCP requires)
     *
     * keep-aliveの送信間隔を設定(TCPで必要な場合のみ)
     *
     * @param time keep-alive transmission interval (sec) (0\~1275)
     *
     * keep-alive 送信間隔(秒)(0\~1275)
     * @return Write result 書き込み結果
     */
    setKeepAliveTimerWait(time: number): Promise<boolean>;
    /**
     * Send data データを送信
     *
     * @param data Raw byte data to send or string 送信するバイトデータまたは文字列
     * @param noWait Do not use spi.writeWait() when writing data
     *
     * データ書き込み時、spi.writeWait()を使用しない
     * @hidden
     */
    protected sendDataBaseWait(data: number[] | string, noWait?: boolean): Promise<boolean>;
}
export default W5500;
