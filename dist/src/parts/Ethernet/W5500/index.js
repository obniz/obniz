"use strict";
/* eslint-disable @typescript-eslint/no-namespace */
/**
 * @packageDocumentation
 * @module Parts.W5500
 */
/* eslint max-classes-per-file: 0 */
/* eslint rulesdir/non-ascii: 0 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.W5500Socket = exports.W5500SocketParts = exports.W5500 = exports.W5500Parts = void 0;
// Block select bit (BSB)
// ブロック選択ビット(BSB)
/** 00 Common register 共通レジスタ */
const BSB_COMMON = 0;
/**
 * 01/05/09/13/17/21/25/29 Socket 0\~7 register ソケット 0\~7 レジスタ
 *
 * @param socketId ソケットID
 */
const BSB_SOCKET_REGISTER = (socketId) => socketId * 4 + 1;
/**
 * 02/06/10/14/18/22/26/30 Socket 0\~7 TX buffer ソケット 0\~7 TXバッファ
 *
 * @param socketId ソケットID
 */
const BSB_SOCKET_TX_BUFFER = (socketId) => socketId * 4 + 2;
/**
 * 03/07/11/15/19/23/27/31 Socket 0\~7 RX buffer ソケット 0\~7 RXバッファ
 *
 * @param socketId ソケットID
 */
const BSB_SOCKET_RX_BUFFER = (socketId) => socketId * 4 + 3;
// Common register  NumberOfAddressesUsed Read&Write InitialValue Description
// 共通レジスタ  使用アドレス数 読み書き 初期値 説明
/** 1byte RW 0x00 Mode モード Reset/\_/WoL/PingBlock/PPPoE/\_/ForceARP/\_ */
const COMMON_MODE = 0x0000;
/** 4bytes RW 0x00000000 IPv4 address of default gateway デフォルトゲートウェイのIPv4アドレス */
const COMMON_GATEWAY_ADDRESS = 0x0001;
/** 4bytes RW 0x00000000 Subnet mask サブネットマスク */
const COMMON_SOURCE_SUBNET_MASK = 0x0005;
/** 6bytes RW 0x000000000000 MAC address MACアドレス */
const COMMON_SOURCE_HARDWARE_ADDRESS = 0x0009;
/** 4bytes RW 0x00000000 Local IPv4 address ローカルIPv4アドレス */
const COMMON_SOURCE_IP_ADDRESS = 0x000f;
/**
 * 2byte RW 0x0000
 *
 * Interrupt pin change interval -> Not required because the interrupt pin is not connected
 *
 * 割り込みピンの変更間隔 -> 割り込みピン未接続につき使用不要
 */
const COMMON_INTERRUPT_LOW_LEVEL_TIMER = 0x0013;
/** 1byte RW 0x00 Interrupt 割り込み IPConflict/DestUnreach/PPPoEClose/MagicPacket/\_/\_/\_/\_ */
const COMMON_INTERRUPT = 0x0015;
/**
 * 1byte RW 0x00
 *
 * Interrupt mask (Depending on the initial value, there is no interrupt at the time of initial setting)
 *
 * 割り込みマスク(初期値より、初期設定時は割り込みなし)
 */
const COMMON_INTERRUPT_MASK = 0x0016;
/**
 * 1byte RW 0x00
 *
 * Socket interrupt -> Not implemented this time
 *
 * ソケット割り込み -> 今回は未実装
 */
const COMMON_SOCKET_INTERRUPT = 0x0017;
/**
 * 1byte RW 0x00
 *
 * Socket interrupt mask (Depending on the initial value, there is no socket interrupt at the time of initial setting)
 *
 * ソケット割り込みマスク(初期値より、初期設定時はソケット割り込みなし)
 */
const COMMON_SOCKET_INTERRUPT_MASK = 0x0018;
/**
 * 2bytes RW 0x07D0
 *
 * Retry interval (Initial value: 100us\*2000=200ms)
 *
 * 再試行間隔(初期値: 100us\*2000=200ms)
 */
const COMMON_RETRY_TIME = 0x0019;
/**
 * 1byte RW 0x08
 *
 * Retry count (If exceeded, the Interrupt timeout for each Socket will be true)
 *
 * 再試行回数(超えると各ソケットの割り込みのタイムアウトがtrueに)
 */
const COMMON_RETRY_COUNT = 0x001b;
/**
 * 1byte RW 0x28
 *
 * Time to send echo request for Link Control Protocol (Initial value: 40\*25ms=1s)
 *
 * LinkControlプロトコルのechoリクエストを送っている時間(初期値: 40\*25ms=1s)
 */
const COMMON_PPP_LCP_REQUEST_TIMER = 0x001c;
/**
 * 1byte RW 0x00
 *
 * 1 byte of the 4 bytes magic number of the Link Control protocol echo request
 *
 * LinkControlプロトコルのechoリクエストの4bytesマジックナンバーの1byte
 */
const COMMON_PPP_LCP_MAGIC_NUMBER = 0x001d;
/** 6bytes RW 0x000000000000 MAC address of PPPoE server PPPoEサーバーのMACアドレス */
const COMMON_PPP_DESTINATION_MAC_ADDRESS = 0x001e;
/** 2bytes RW 0x0000 Session ID of PPPoE server PPPoEサーバーのセッションID */
const COMMON_PPP_SESSION_IDENTIFICATION = 0x0024;
/** 2bytes RW 0xFFFF Maximum receiving unit size of PPPoE PPPoEの最大受信ユニットサイズ */
const COMMON_PPP_MAXIMUM_SEGMENT_SIZE = 0x0026;
/**
 * 4bytes R- 0x00000000
 *
 * IPv4 address when the destination cannot be reached
 *
 * 宛先に到達できないときのIPv4アドレス
 */
const COMMON_UNREACHABLE_IP_ADDRESS = 0x0028;
/**
 * 2bytes R- 0x0000
 *
 * Port number when the destination cannot be reached
 *
 * 宛先に到達できないときのポート番号
 */
const COMMON_UNREACHABLE_PORT = 0x002c;
/**
 * 1byte RW 0b10111XXX Physical layer settings 物理層の設定
 *
 * Reset(1->0->1)/OperationMode/ConfigBit\*3/Duplex/Speed/Link
 *
 * - Reset
 *
 * Reset the internal physical layer, need to set this bit to 0 and then back to 1
 *
 * 内部の物理層をリセット、このビットを0にした後、1に戻す必要がある
 *
 * - OperationMode
 *
 * 1: Use the following 3-bit settings 次の3bitの設定を使用
 *
 * 0: Follow the hardware pin settings ハードウェアピンの設定に従う
 *
 * - ConfigBit
 *
 * The default setting for both hardware pins and registers is 111
 *
 * ハードウェアピン、レジスタともに初期設定は111
 *
 * - 000  10BT Half duplex 半二重 / 001  10BT Full duplex 全二重
 * - 010 100BT Half duplex 半二重 / 011 100BT Full duplex 全二重
 * - 100 100BT Half duplex enable auto negotiation 半二重 自動ネゴシエーションオン
 * - 110 Power Off Mode 電源オフモード
 * - 111 All available & Enable auto negotiation 全て使用可能 自動ネゴシエーションオン
 *
 * - Duplex  1: Full duplex 全二重 0: Half duplex 半二重
 * - Speed  1: 100Mbps 0: 10Mbps
 * - Link  1: Connected 接続済み 0: Disconnected 未接続
 */
const COMMON_PHY_CONFIGURATION = 0x002e;
/* 0x002F~0x0038 Reserved 予約済み */
/** 1byte R- 0x04 Chip Version チップバージョン */
const COMMON_CHIP_VERSION = 0x0039;
// Socket register  NumberOfAddressesUsed Read&Write InitialValue Description
// ソケットレジスタ  使用アドレス数 読み書き 初期値 説明
/**
 * 1byte RW 0x00 Mode モード
 *
 * Multicast(UDP)·MACFilter(MACRAW)/BroadcastBlock(MACRAW·UDP)/
 *
 * NoDelayACK(TCP)·MulticastVer(UDP)·MulticastBlock(MACRAW)/UnicastBlock(UDP)·IPv6Block(MACRAW)/
 *
 * Protocol\*4  0000: Closed · 0001: TCP · 0010: UDP · 0100: MACRAW
 */
const SOCKET_MODE = 0x0000;
/**
 * 1byte RW 0x00 Command コマンド
 *
 * 0x01: Open · 0x02: Listen(TCP) · 0x04: Connect(TCP) · 0x08: Disconnect(TCP) · 0x10: Close · 0x20: Send · 0x21: SendMAC(UDP) · 0x22: SendKeep(UDP) · 0x40: Receive
 */
const SOCKET_COMMAND = 0x0001;
/** 1byte RCW1 0x00 Interrupt 割り込み \_/\_/\_/SendOK/Timeout/Receive/Disconnect/Connected */
const SOCKET_INTERRUPT = 0x0002;
/**
 * 1byte R- 0x00 Status 状態
 *
 * 0x00: Closed · 0x13: Init(TCP) · 0x14: Listen(TCP) · 0x17: Established(TCP) · 0x1C: CloseWait(TCP) · 0x22: UDP · 0x32: MACRAW
 *
 * Temporary Status (Only TCP) 一時的な状態(TCPのみ)
 *
 * 0x15: SynSent · 0x16: SynReceive · 0x18: FinWait · 0x1A: Closing · 0x1B: TimeWait · 0x1D: LastACK
 */
const SOCKET_STATUS = 0x0003;
/** 2bytes RW 0x0000 Source port 差出ポート */
const SOCKET_SOURCE_PORT = 0x0004;
/**
 * 6bytes RW 0xFFFFFFFFFFFF
 *
 * Destination hardware address (UDP/ARP) -> Not used this time
 *
 * 宛先ハードウェアアドレス(UDP/ARP) -> 今回は未使用
 */
const SOCKET_DESTINATION_HARDWARE_ADDRESS = 0x0006;
/** 4 RW 0x00000000 Destination IPv4 address 宛先IPv4アドレス (TCP/UDP) */
const SOCKET_DESTINATION_IP_ADDRESS = 0x000c;
/** 2 RW 0x0000 Destination port 宛先ポート (TCP/UDP) */
const SOCKET_DESTINATION_PORT = 0x0010;
/**
 * 2bytes RW 0x0000
 *
 * Maximum segment size (TCP?) -> Not used this time?
 *
 * 最大セグメントサイズ(TCP?) -> 今回は未使用?
 */
const SOCKET_MAX_SEGMENT_SIZE = 0x0012;
/* 0x0014 Reserved 予約済み */
/**
 * 1byte RW 0x00
 *
 * Set before the Open command Openコマンドより前に設定
 *
 * [http://www.iana.org/assignments/ip-parameters](http://www.iana.org/assignments/ip-parameters)
 */
const SOCKET_IP_TYPE_OF_SERVICE = 0x0015;
/**
 * 1byte RW 0x00
 *
 * Set before the Open command Openコマンドより前に設定
 *
 * [http://www.iana.org/assignments/ip-parameters](http://www.iana.org/assignments/ip-parameters)
 */
const SOCKET_TTL = 0x0016;
/* 0x0017~0x001D Reserved 予約済み */
/** 1byte RW 0x00 RX buffer size RXバッファサイズ 0/1/2/4/8/16KB */
const SOCKET_RX_BUFFER_SIZE = 0x001e;
/** 1byte RW 0x02 TX buffer size TXバッファサイズ 0/1/2/4/8/16KB */
const SOCKET_TX_BUFFER_SIZE = 0x001f;
/** 2bytes R- 0x0800 TX free size TX空きサイズ */
const SOCKET_TX_FREE_SIZE = 0x0020;
/** 2bytes R- 0x0000 TX read pointer TX読込ポインタ */
const SOCKET_TX_READ_POINTER = 0x0022;
/** 2bytes RW 0x0000 TX write pointer TX書込ポインタ */
const SOCKET_TX_WRITE_POINTER = 0x0024;
/** 2bytes R- 0x0000 RX receive size RX受信サイズ */
const SOCKET_RX_RECEIVE_SIZE = 0x0026;
/** 2bytes RW 0x0000 RX read pointer RX読込ポインタ */
const SOCLET_RX_READ_DATA_POINTER = 0x0028;
/** 2bytes R- 0x0000 RX write pointer RX書込ポインタ */
const SOCKET_RX_WRITE_POINTER = 0x002a;
/**
 * 1byte RW 0xFF
 *
 * Interrupt mask -> Not going to change
 *
 * 割り込みマスク -> 変更しない
 */
const SOCKET_INTERRUPT_MASK = 0x002c;
/** 2bytes RW 0x4000 Fragment of IP header IPヘッダーのフラグメント */
const SOCKET_FRAGMENT = 0x002d;
/** 1byte RW 0x0000 keep-alive Timer keep-aliveタイマー (TCP) (Ex. 0x0A->50s) */
const SOCKET_KEEP_ALIVE_TIMER = 0x002f;
/* 0x0030~0xFFFF Reserved 予約済み */
/** Wait Xms Xミリ秒待つ @hidden */
const sleep = (msec) => new Promise((resolve) => setTimeout(resolve, msec));
/** [43, 227, 213] => '2BE3D5' @hidden */
const byteString = (bytes) => bytes.map((n) => ('00' + n.toString(16).toUpperCase()).slice(-2)).join('');
/** W5500 type definitions and constants W5500の型定義や定数 */
var W5500Parts;
(function (W5500Parts) {
    /** Flags corresponding to interrupts 割り込みに対応するフラグ */
    W5500Parts.InterruptFlags = {
        IPConflict: 0b10000000,
        DestUnreach: 0b01000000,
        PPPoEClose: 0b00100000,
        MagicPacket: 0b00010000,
    };
    /** Connection destination information 接続先情報 */
    class DestInfo {
        constructor(ip, port) {
            this.ip = ip;
            this.port = port;
            this.address = `${ip}:${port}`;
        }
    }
    W5500Parts.DestInfo = DestInfo;
})(W5500Parts = exports.W5500Parts || (exports.W5500Parts = {}));
/** W5500 management class W5500を管理するクラス */
class W5500 {
    constructor() {
        /**
         * Whether to communicate with a fixed length, forces true if no chip select pin is specified
         *
         * 固定長通信するかどうか、チップセレクトピンが指定されていない場合、強制的にtrue
         */
        this.fdm = false;
        /**
         * Holds a handler that catches interrupts by message
         *
         * 割り込みをメッセージ別でキャッチするハンドラーを保持
         */
        this.interruptHandlers = {};
        /** Array of socket instances ソケットのインスタンスの配列 */
        this.socketList = [];
        /** SPI status SPIのステータス */
        this.spiStatus = false;
        /**
         * Do not always check transfer when writing
         *
         * 常に書き込み時に転送チェックを行わない
         */
        this.forceNoCheckWrite = false;
        this.keys = ['frequency', 'reset', 'mosi', 'miso', 'sclk', 'cs'];
        this.requiredKeys = [];
    }
    static info() {
        return {
            name: 'W5500',
        };
    }
    wired(obniz) {
        this.obniz = obniz;
        // W5500 may accept up to 26 Mhz. But it may fail on some devices. Reduce it when spi error occures. Increase it when no spi error occures and want to improve speed.
        this.params.frequency = this.params.frequency || 20 * 1000 * 1000;
        this.params.mosi = this.params.mosi || 23;
        this.params.miso = this.params.miso || 19;
        this.params.clk = this.params.clk || 18;
        this.params.drive = '3v';
        this.params.mode = 'master';
        this.spi = this.params.spi || this.obniz.getSpiWithConfig(this.params);
        this.spiStatus = true;
        this.resetPin = this.obniz.getIO(this.params.reset || 12);
        this.csPin = this.obniz.getIO(this.params.cs || 33);
    }
    /**
     * Initialize W5500 and write common settings
     *
     * W5500を初期化、共通設定の書き込み
     *
     * @param config W5500 config W5500の設定内容
     * @return Write result 書き込み結果
     */
    async initWait(config) {
        // Reset リセット
        await this.hardResetWait();
        // Use fixed length data mode 固定長通信の使用
        this.fdm = config.fdm === true;
        // SPI chip select SPIのセレクト
        this.csPin.drive('3v');
        this.csPin.output(!this.fdm);
        // Mode setting モード設定
        let result = await this.setModeWait(config);
        // Network initialization ネットワークの初期化
        if (config.gatewayIP) {
            result = result && (await this.setGatewayWait(config.gatewayIP));
        }
        if (config.subnetMask) {
            result = result && (await this.setSubnetMask(config.subnetMask));
        }
        if (config.macAddress) {
            result = result && (await this.setMacAddressWait(config.macAddress));
        }
        if (config.localIP) {
            result = result && (await this.setLocalIPWait(config.localIP));
        }
        // Turn on all interrupt masks 割り込みマスクを全てオンに
        result = result && (await this.setInterruptMaskWaut(0xff));
        // Other settings その他設定
        if (config.retryTime) {
            result = result && (await this.setRetryTimeWait(config.retryTime));
        }
        if (config.retryCount) {
            result = result && (await this.setRetryCountWait(config.retryCount));
        }
        if (config.linkControlProtocolRequestTimer) {
            result =
                result &&
                    (await this.setPPPLinkControlProtocolRequestTimerWait(config.linkControlProtocolRequestTimer));
        }
        if (config.linkControlProtocolMagicNumber) {
            result =
                result &&
                    (await this.setPPPLinkControlProtocolMagicNumberWait(config.linkControlProtocolMagicNumber));
        }
        if (config.pppoeDestMACAddress) {
            result =
                result &&
                    (await this.setPPPoEMacAddressWait(config.pppoeDestMACAddress));
        }
        if (config.pppoeSessionID) {
            result =
                result && (await this.setPPPoESessionIDWait(config.pppoeSessionID));
        }
        if (config.pppoeMaxSegmentSize) {
            result =
                result &&
                    (await this.setPPPoEMaxSegmentSizeWait(config.pppoeMaxSegmentSize));
        }
        if (config.phyConfig) {
            result = result && (await this.setPhysicalConfigWait(config.phyConfig));
        }
        this.forceNoCheckWrite = config.forceNoCheckWrite === true;
        // Interrupt handlers 割り込みハンドラー設定
        if (config.onIPConflictInterrupt) {
            this.setInterruptHandler('IPConflict', config.onIPConflictInterrupt);
        }
        if (config.onDestUnreachInterrupt) {
            this.setInterruptHandler('DestUnreach', config.onDestUnreachInterrupt);
        }
        if (config.onPPPoECloseInterrupt) {
            this.setInterruptHandler('PPPoEClose', config.onPPPoECloseInterrupt);
        }
        if (config.onMagicPacketInterrupt) {
            this.setInterruptHandler('MagicPacket', config.onMagicPacketInterrupt);
        }
        if (config.onAllInterrupt) {
            this.setAllInterruptHandler(config.onAllInterrupt);
        }
        return result;
    }
    /**
     * Terminates each socket and terminates SPI communication
     *
     * 各ソケットの終了処理をし、SPI通信を終了
     */
    async finalizeWait() {
        for (const socket of this.socketList) {
            if (socket !== undefined) {
                await socket.finalizeWait();
            }
        }
        this.spi.end();
        this.spiStatus = false;
    }
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
    setInterruptHandler(name, handler) {
        this.interruptHandlers[name] = handler;
    }
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
    setAllInterruptHandler(handler) {
        this.allInterruptHandler = handler;
    }
    /**
     * Wait until the connection with the router is established
     *
     * ルーターとの接続が確立されるまで待機
     *
     * @return Physical layer status 物理層のステータス
     */
    async waitLinkUpWait() {
        let phy;
        while (true) {
            phy = await this.getPhysicalStatusWait();
            if (phy.link) {
                break;
            }
            await sleep(20);
        }
        return phy;
    }
    /**
     * Get an instance of W5500Socket, generate if necessary
     *
     * W5500Socketのインスタンスを取得、必要ならば生成
     *
     * @param socketId Socket ID (0\~7) ソケットID (0\~7)
     * @return Instance of W5500Socket W5500Socketのインスタンス
     */
    getSocket(socketId) {
        if (socketId < 0 || socketId > 7) {
            throw new Error('Socket id must take a value between 0 and 7.');
        }
        if (!this.socketList[socketId]) {
            this.socketList[socketId] = new W5500Socket(socketId, this);
        }
        return this.socketList[socketId];
    }
    /**
     * Create an instance of W5500Socket in the frame of the unused socket
     *
     * 使っていないソケットの枠にW5500Socketのインスタンスを生成
     *
     * @return Instance of W5500Socket W5500Socketのインスタンス
     */
    getNewSocket() {
        let id = 0;
        while (this.socketList[id] !== undefined) {
            id++;
        }
        if (id > 7) {
            return null;
        }
        else {
            return (this.socketList[id] = new W5500Socket(id, this));
        }
    }
    /**
     * Whether SPI is available
     *
     * SPIが利用可能かどうか
     *
     * @return SPI status SPIのステータス
     */
    getSpiStatus() {
        return this.spiStatus;
    }
    /**
     * Reset W5500 in hardware
     *
     * W5500をハードウェア的にリセット
     */
    async hardResetWait() {
        this.resetPin.drive('3v');
        this.resetPin.output(false);
        await sleep(10); // > 500ns
        this.resetPin.output(true);
        await sleep(100);
    }
    /**
     * Set mode モードを設定
     *
     * @param config WakeOnLAN(WoL), PingBlock, PPPoE and ForceARP
     * @return Write result 書き込み結果
     */
    setModeWait(config) {
        return this.numWriteWait(COMMON_MODE, BSB_COMMON, 0b00100000 * (config.wol === true ? 1 : 0) +
            0b00010000 * (config.pingBlock === true ? 1 : 0) +
            0b00001000 * (config.pppoe === true ? 1 : 0) +
            0b00000010 * (config.forceArp === true ? 1 : 0));
    }
    /**
     * Set IPv4 address of default gateway
     *
     * デフォルトゲートウェイのIPv4アドレスを設定
     *
     * @param ip IPv4 address IPv4アドレス
     * @return Write result 書き込み結果
     */
    setGatewayWait(ip) {
        return this.ipWriteWait(COMMON_GATEWAY_ADDRESS, BSB_COMMON, ip);
    }
    /**
     * Set subnet mask サブネットマスクを設定
     *
     * @param mask Subnet mask サブネットマスク
     * @return Write result 書き込み結果
     */
    setSubnetMask(mask) {
        return this.ipWriteWait(COMMON_SOURCE_SUBNET_MASK, BSB_COMMON, mask);
    }
    /**
     * Set MAC address MACアドレスを設定
     *
     * @param mac MAC address MACアドレス
     * @return Write result 書き込み結果
     */
    setMacAddressWait(mac) {
        return this.macWriteWait(COMMON_SOURCE_HARDWARE_ADDRESS, BSB_COMMON, mac);
    }
    /**
     * Set local IPv4 address ローカルIPv4アドレスを設定
     *
     * @param ip IPv4 address IPv4アドレス
     * @return Write result 書き込み結果
     */
    setLocalIPWait(ip) {
        return this.ipWriteWait(COMMON_SOURCE_IP_ADDRESS, BSB_COMMON, ip);
    }
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
    async checkInterruptWait(disableAllSocketCheck) {
        if (!this.spiStatus) {
            return false;
        }
        const interrupt = await this.numReadWait(COMMON_INTERRUPT, BSB_COMMON);
        if (interrupt !== 0) {
            // リセット
            await this.numWriteWait(COMMON_INTERRUPT, BSB_COMMON, interrupt);
        }
        const msgList = Object.keys(W5500Parts.InterruptFlags).filter((msg) => (interrupt & W5500Parts.InterruptFlags[msg]) !==
            0);
        const extra = msgList.indexOf('DestUnreach') >= 0
            ? new W5500Parts.DestInfo(await this.getUnreachableIP(), await this.getUnreachablePort())
            : undefined;
        if (disableAllSocketCheck !== false) {
            for (const socket of this.socketList) {
                if (socket !== undefined && socket.getProtocol() !== null) {
                    await socket.checkInterruptWait();
                }
            }
        }
        for (const m in msgList) {
            const msg = msgList[m];
            // console.info(`Found Interrupt: ${msg}` + msg === "DestUnreach" ? ` address=${extra?.address}` : "");
            const handler = this.interruptHandlers[msg];
            if (handler !== undefined) {
                await handler(this, extra);
            }
            if (this.allInterruptHandler !== undefined) {
                await this.allInterruptHandler(this, msg, msg === 'DestUnreach' ? extra : undefined);
            }
        }
        return this.spiStatus;
    }
    /**
     * Set interrupt mask 割り込みマスクを設定
     *
     * @param mask Mask マスク
     * @return Write result 書き込み結果
     */
    setInterruptMaskWaut(mask) {
        return this.numWriteWait(COMMON_INTERRUPT_MASK, BSB_COMMON, mask);
    }
    /**
     * Set retry interval (Initial value: 200ms) 再試行間隔を設定 (初期値: 200ms)
     *
     * @param time Retry interval (in 0.2ms increments) 再試行間隔 (0.2ms刻み) (0\~6553.5ms)
     * @return Write result 書き込み結果
     */
    setRetryTimeWait(time) {
        return this.num2WriteWait(COMMON_RETRY_TIME, BSB_COMMON, time * 10);
    }
    /**
     * Set retry count (Initial value: 8 times) 再試行回数を設定 (初期値: 8回)
     *
     * @param count retry count 再試行回数 (0\~255)
     * @return Write result 書き込み結果
     */
    setRetryCountWait(count) {
        return this.numWriteWait(COMMON_RETRY_COUNT, BSB_COMMON, count);
    }
    /**
     * Set time to send echo request for Link Control Protocol
     *
     * LinkControlプロトコルのechoリクエストを送っている時間を設定
     *
     * @param time time (in 25ms increments) 時間 (25ms刻み) (0\~6375ms)
     * @return Write result 書き込み結果
     */
    setPPPLinkControlProtocolRequestTimerWait(time) {
        return this.numWriteWait(COMMON_PPP_LCP_REQUEST_TIMER, BSB_COMMON, time / 25);
    }
    /**
     * Set 1 byte of the 4 bytes magic number of the Link Control protocol echo request
     *
     * LinkControlプロトコルのechoリクエストの4bytesマジックナンバーの1byteを設定
     *
     * @param num Magic number マジックナンバー
     * @return Write result 書き込み結果
     */
    setPPPLinkControlProtocolMagicNumberWait(num) {
        return this.numWriteWait(COMMON_PPP_LCP_MAGIC_NUMBER, BSB_COMMON, num);
    }
    /**
     * Set MAC address of PPPoE server PPPoEサーバーのMACアドレスを設定
     *
     * @param mac MAC address MACアドレス
     * @return Write result 書き込み結果
     */
    setPPPoEMacAddressWait(mac) {
        return this.macWriteWait(COMMON_PPP_DESTINATION_MAC_ADDRESS, BSB_COMMON, mac);
    }
    /**
     * Set session ID of PPPoE server PPPoEサーバーのセッションIDを設定
     *
     * @param id Session ID セッションID
     * @return Write result 書き込み結果
     */
    setPPPoESessionIDWait(id) {
        return this.num2WriteWait(COMMON_PPP_SESSION_IDENTIFICATION, BSB_COMMON, id);
    }
    /**
     * Set maximum receiving unit size of PPPoE PPPoEの最大受信ユニットサイズを設定
     *
     * @param size Unit size ユニットサイズ
     * @return Write result 書き込み結果
     */
    setPPPoEMaxSegmentSizeWait(size) {
        return this.num2WriteWait(COMMON_PPP_MAXIMUM_SEGMENT_SIZE, BSB_COMMON, size);
    }
    /**
     * Get the IPv4 address when the destination could not be reached
     *
     * 宛先に到達できなかった時のIPv4アドレスを取得
     *
     * @return IPv4 address IPv4アドレス
     */
    getUnreachableIP() {
        return this.ipReadWait(COMMON_UNREACHABLE_IP_ADDRESS, BSB_COMMON);
    }
    /**
     * Get the port number when the destination could not be reached
     *
     * 宛先に到達できなかった時のポート番号を取得
     *
     * @return Port number ポート番号
     */
    getUnreachablePort() {
        return this.num2ReadWait(COMMON_UNREACHABLE_PORT, BSB_COMMON);
    }
    /**
     * Get physical layer status 物理層のステータス取得
     *
     * @return Physical layer status 物理層のステータス
     */
    async getPhysicalStatusWait() {
        const result = await this.numReadWait(COMMON_PHY_CONFIGURATION, BSB_COMMON);
        return {
            duplex: (result & 0b100) !== 0,
            speed: (result & 0b010) !== 0 ? 100 : 10,
            link: (result & 0b001) !== 0,
        };
    }
    /**
     * Set physical layer config 物理層の設定
     *
     * @param config Physical layer config 物理層の設定内容
     * @return Write result 書き込み結果
     */
    async setPhysicalConfigWait(config) {
        if (config.reset) {
            await this.numWriteWait(COMMON_PHY_CONFIGURATION, BSB_COMMON, 0);
            await sleep(500);
        }
        let value = 0b11111000;
        if (config.autoNegotiation === false) {
            value &= 0b11011000;
        } // 1bit目を0に
        if (config.speed === 10) {
            value &= 0b11001000;
        } // 1,2bit目を0に
        if (config.duplex === false) {
            value &= 0b11110000;
        } // 3bit目を0に
        if (config.powerOff === true) {
            value = 0b11110000;
        }
        return await this.numWriteWait(COMMON_PHY_CONFIGURATION, BSB_COMMON, value);
    }
    /**
     * Get chip version チップバージョンの取得
     *
     * @return Chip version チップバージョン
     */
    getVersion() {
        return this.numReadWait(COMMON_CHIP_VERSION, BSB_COMMON);
    }
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
    ipWriteWait(address, bsb, ip) {
        return this.addressWriteWait(address, bsb, ip, 'IP Address', '123.234.0.1', '.', 4, 10);
    }
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
    macWriteWait(address, bsb, mac) {
        return this.addressWriteWait(address, bsb, mac, 'MAC Address', '12:34:56:78:90:AB', ':', 6, 16);
    }
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
    async bigWriteWait(address, bsb, data, noWait) {
        const maxLength = this.fdm ? 4 : 1021; // FDM(4) / VDM(1024-3)
        let result = true;
        for (let i = 0; i < data.length; i += maxLength) {
            const size = i + maxLength <= data.length ? maxLength : data.length - i;
            result =
                result &&
                    (await this.writeWait(address + i, bsb, data.slice(i, i + size), noWait));
        }
        return result;
    }
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
    numWriteWait(address, bsb, num) {
        return this.writeWait(address, bsb, [num]);
    }
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
    num2WriteWait(address, bsb, num) {
        return this.writeWait(address, bsb, [(num & 0xff00) >> 8, num & 0xff]);
    }
    /**
     * Read IPv4 address data IPv4アドレスデータの読み込み
     *
     * @param address Start address of read destination 読み込み先の先頭アドレス
     * @param bsb Block select bit ブロック選択ビット
     * @return IPv4 address IPv4アドレス
     * @hidden
     */
    async ipReadWait(address, bsb) {
        return (await this.readWait(address, bsb, 4)).join('.');
    }
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
    async bigReadWait(address, bsb, length) {
        const maxLength = this.fdm ? 4 : 1021; // FDM(4) / VDM(1024-3)
        let data = [];
        for (let i = 0; i < length; i += maxLength) {
            const size = i + maxLength <= length ? maxLength : length - i;
            data = data.concat(await this.readWait(address + i, bsb, size));
        }
        return data;
    }
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
    async numReadWait(address, bsb) {
        const result = await this.readWait(address, bsb, 1);
        return result[0];
    }
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
    async num2ReadWait(address, bsb) {
        const result = await this.readWait(address, bsb, 2);
        return (result[0] << 8) + result[1];
    }
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
    async addressWriteWait(address, bsb, val, name, example, splitVal, length, radix) {
        if (typeof val !== 'string') {
            throw new Error(`Given ${name} must be string.`);
        }
        const valList = val.split(splitVal).map((addr) => parseInt(addr, radix));
        if (valList.filter((addr) => typeof addr === 'number').length !== length) {
            throw new Error(`${name} format must be '${example}'.`);
        }
        if (length > 4 && this.fdm) {
            return await this.bigWriteWait(address, bsb, valList);
        }
        else {
            return await this.writeWait(address, bsb, valList);
        }
        // const func = length > 4 && this.fdm ? this.bigWriteWait : this.writeWait;
        // return func(address, bsb, valList);
    }
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
    async writeWait(address, bsb, data, noWait) {
        if (!Array.isArray(data)) {
            throw new Error('Given data must be array.');
        }
        if (data.length === 3 && this.fdm) {
            data[3] = 0;
        }
        if (data.length === 0) {
            throw new Error('Given data is empty.');
        }
        if (data.length > 4 && this.fdm) {
            throw new Error('Given data length must be 1, 2 or 4.');
        }
        if (data.length > 1021 && !this.fdm) {
            throw new Error('Given data length must be 1021 or less.');
        }
        if (data.filter((addr) => 0x00 <= addr && addr <= 0xff).length !== data.length) {
            throw new Error('Given data field must take a value between 0(0x00) and 255(0xFF).');
        }
        if (this.forceNoCheckWrite === true && noWait === undefined) {
            noWait = true;
        }
        const result = await this.sendWait(address, bsb, 'Write', data, noWait);
        if (typeof result === 'object') {
            throw new Error('Unexpected Result');
        }
        else {
            return result;
        }
    }
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
    async readWait(address, bsb, length) {
        const result = await this.sendWait(address, bsb, 'Read', Array(length).fill(0));
        if (typeof result === 'boolean') {
            throw new Error('Unexpected Result');
        }
        else {
            return result;
        }
    }
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
    async sendWait(address, bsb, mode, data, noWait) {
        const write = [
            (address & 0xff00) >> 8,
            address & 0x00ff,
            (bsb << 3) +
                (mode === 'Write' ? 0b0100 : 0b0000) +
                (this.fdm ? (data.length < 4 ? data.length : 0b11) : 0),
            ...data,
        ];
        if (!this.fdm && this.csPin) {
            this.csPin.output(true);
            this.csPin.output(false);
        }
        const result = noWait === true ? this.spi.write(write) : await this.spi.writeWait(write);
        if (!this.fdm && this.csPin) {
            this.csPin.output(true);
            this.csPin.output(false);
        }
        if (typeof result === 'undefined') {
            return true;
        }
        if (result[0] === 1 && result[1] === 2 && result[2] === 3) {
            return mode === 'Write' ? true : result.slice(3);
        }
        else {
            throw new Error(`${mode} Error\n address: 0x${('0000' + address.toString(16).toUpperCase()).slice(-4)}  bsb: ${bsb}\n send: 0x${byteString(write)}\n receive: 0x${byteString(result)}\n`);
        }
    }
}
exports.W5500 = W5500;
/** W5500 socket definitions and constants W5500のソケットの定義や定数 */
var W5500SocketParts;
(function (W5500SocketParts) {
    /**
     * Value corresponding to socket command
     *
     * ソケットのコマンドに対応する値
     */
    W5500SocketParts.CommandCodes = {
        Open: 0x01,
        Listen: 0x02,
        Connect: 0x04,
        Disconnect: 0x08,
        Close: 0x10,
        Send: 0x20,
        SendMAC: 0x21,
        SendKeep: 0x22,
        Receive: 0x40,
    };
    /**
     * Value corresponding to socket status
     *
     * ソケットのステータスに対応する値
     */
    W5500SocketParts.StatusCodes = {
        Closed: 0x00,
        Init: 0x13,
        Listen: 0x14,
        SynSent: 0x15,
        SynReceive: 0x16,
        Established: 0x17,
        FinWait: 0x18,
        Closing: 0x1a,
        TimeWait: 0x1b,
        CloseWait: 0x1c,
        LastACK: 0x1d,
        UDP: 0x22,
        MACRAW: 0x32,
    };
    /**
     * Flags corresponding to socket interrupts
     *
     * ソケットの割り込みに対応するフラグ
     */
    W5500SocketParts.InterruptFlags = {
        SendOK: 0b10000,
        Timeout: 0b01000,
        ReceiveData: 0b00100,
        Disconnect: 0b00010,
        ConnectSuccess: 0b00001,
    };
})(W5500SocketParts = exports.W5500SocketParts || (exports.W5500SocketParts = {}));
/**
 * Class that performs and manages socket communication
 *
 * ソケット通信を行い管理するクラス
 */
class W5500Socket {
    constructor(id, ethernet) {
        /**
         * Treat received data as string (UTF-8)
         *
         * 受信データを文字列(UTF-8)として扱う
         */
        this.stringMode = false;
        /** Current protocol 現在のプロトコル */
        this.protocol = null;
        /**
         * Holds a handler that catches interrupts by message
         *
         * 割り込みをメッセージ別でキャッチするハンドラーを保持
         */
        this.interruptHandlers = {};
        /** Hold data read address データ読み込みのアドレスを保持 */
        this.rxReadDataPointer = 0;
        this.id = id;
        this.ethernet = ethernet;
    }
    /**
     * Write the socket settings and open the socket (Connect / Listen is also executed for TCP)
     *
     * ソケット設定の書き込みをし、ソケットをOpenに(TCPの時はConnect/Listenも実行)
     *
     * @param config Socket config ソケットの設定内容
     * @return Write result 書き込み結果
     */
    async initWait(config) {
        // モード設定
        let result = await this.setModeWait(config);
        // 基本設定
        if (config.sourcePort) {
            result = result && (await this.setSourcePortWait(config.sourcePort));
        }
        if (config.destIP) {
            result = result && (await this.setDestIPWait(config.destIP));
        }
        if (config.destPort) {
            result = result && (await this.setDestPortWait(config.destPort));
        }
        if (config.ipType) {
            result = result && (await this.setIPTypeOfServiceWait(config.ipType));
        }
        if (config.ttl) {
            result = result && (await this.setTTLWait(config.ttl));
        }
        if (config.rxBufferSize) {
            result = result && (await this.setRXBufferSizeWait(config.rxBufferSize));
        }
        if (config.txBufferSize) {
            result = result && (await this.setTXBufferSizeWait(config.txBufferSize));
        }
        // Open socket ソケットのオープン
        result = result && (await this.sendCommandWait('Open'));
        if (this.protocol === 'TCPClient') {
            result = result && (await this.sendCommandWait('Connect'));
        }
        if (this.protocol === 'TCPServer') {
            result = result && (await this.sendCommandWait('Listen'));
        }
        // Remember the value of rxReadDataPointer in advance
        // 事前にrxReadDataPointerの値を記憶
        this.rxReadDataPointer = await this.getRXReadDataPointerWait();
        // Interrupt handler settings 割り込みハンドラー設定
        if (config.onSendOKInterrupt) {
            this.setInterruptHandler('SendOK', config.onSendOKInterrupt);
        }
        if (config.onTimeoutInterrupt) {
            this.setInterruptHandler('Timeout', config.onTimeoutInterrupt);
        }
        if (config.onReceiveDataInterrupt) {
            this.setInterruptHandler('ReceiveData', config.onReceiveDataInterrupt);
        }
        if (config.onDisconnectInterrupt) {
            this.setInterruptHandler('Disconnect', config.onDisconnectInterrupt);
        }
        if (config.onConnectSuccessInterrupt) {
            this.setInterruptHandler('ConnectSuccess', config.onConnectSuccessInterrupt);
        }
        if (config.onAllInterrupt) {
            this.setAllInterruptHandler(config.onAllInterrupt);
        }
        return result;
    }
    /**
     * Socket termination process ソケットの終了処理
     */
    async finalizeWait() {
        switch (this.protocol) {
            case 'TCPClient':
                await this.sendCommandWait('Disconnect');
                while ((await this.getStatusWait()) !== 'Closed')
                    ;
                break;
            case 'TCPServer':
                await this.sendCommandWait('Disconnect');
                await this.sendCommandWait('Close');
                break;
            case 'UDP':
                await this.sendCommandWait('Close');
                break;
        }
        this.protocol = null;
    }
    /**
     * Send data データを送信
     *
     * @param data Raw byte data or string to send 送信するバイトデータまたは文字列
     * @return Write result 書き込み結果
     */
    sendDataWait(data) {
        return this.sendDataBaseWait(data);
    }
    /**
     * Send data, no write check データを送信、書き込みチェックなし
     *
     * @param data Raw byte data or string to send 送信するバイトデータまたは文字列
     * @return Write result 書き込み結果
     */
    sendDataFastWait(data) {
        return this.sendDataBaseWait(data, true);
    }
    /**
     * Read the received data 受信されたデータを読取
     *
     * @return Raw byte data or string to receive 受信データまたは文字列
     */
    async receiveDataWait() {
        const rxRecieveSize = await this.getRXReceiveSizeWait();
        // const rxReadDataPointer = await this.getRXReadDataPointerWait();
        const data = await this.ethernet.bigReadWait(this.rxReadDataPointer, BSB_SOCKET_RX_BUFFER(this.id), rxRecieveSize);
        this.rxReadDataPointer += rxRecieveSize;
        await this.setRXReadDataPointerWait(this.rxReadDataPointer);
        await this.sendCommandWait('Receive');
        return this.stringMode
            ? new TextDecoder().decode(Uint8Array.from(data))
            : data;
    }
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
    setInterruptHandler(name, handler) {
        return (this.interruptHandlers[name] = handler);
    }
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
    setAllInterruptHandler(handler) {
        return (this.allInterruptHandler = handler);
    }
    /**
     * Get the current protocol 現在のプロトコルを取得
     *
     * @return Protocol プロトコル
     */
    getProtocol() {
        return this.protocol;
    }
    /**
     * Set mode モードを設定
     *
     * @param config Multicast, BroardcastBlock, NoDelayACK, MulticastVer1, UnicastBlock and Protocol
     * @return Write result 書き込み結果
     */
    setModeWait(config) {
        this.protocol = config.protocol;
        this.stringMode = config.stringMode || false;
        return this.ethernet.numWriteWait(SOCKET_MODE, BSB_SOCKET_REGISTER(this.id), config.protocol === null
            ? 0
            : 0b10000000 *
                (config.multicast === true && config.protocol === 'UDP' ? 1 : 0) +
                0b01000000 *
                    (config.broardcastBlock === true && config.protocol === 'UDP'
                        ? 1
                        : 0) +
                0b00100000 *
                    (config.noDelayACK === true && config.protocol.indexOf('TCP') >= 0
                        ? 1
                        : 0) +
                0b00100000 *
                    (config.multicastVer1 === true && config.protocol === 'UDP'
                        ? 1
                        : 0) +
                0b00010000 *
                    (config.unicastBlock === true && config.protocol === 'UDP'
                        ? 1
                        : 0) +
                0b00000001 * (config.protocol.indexOf('TCP') >= 0 ? 1 : 0) +
                0b00000010 * (config.protocol === 'UDP' ? 1 : 0));
    }
    /**
     * Send command コマンドを送信
     *
     * @param command Command コマンド
     * @return Write result 書き込み結果
     */
    async sendCommandWait(command) {
        const code = W5500SocketParts.CommandCodes[command];
        if (!code) {
            throw new Error(`Unknown Command '${command}'.`);
        }
        if (this.protocol === null) {
            throw new Error('Must set Socket Mode before send the command.');
        }
        if (this.protocol.indexOf('TCP') >= 0 && 0x20 < code && code < 0x30) {
            throw new Error(`'${command}' command is only available in UDP mode.`);
        }
        if (this.protocol === 'UDP' && 0x01 < code && code < 0x10) {
            throw new Error(`'${command}' command is only available in TCP mode.`);
        }
        return await this.ethernet.numWriteWait(SOCKET_COMMAND, BSB_SOCKET_REGISTER(this.id), code);
    }
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
    async checkInterruptWait() {
        if (!this.ethernet.getSpiStatus()) {
            return;
        }
        const interrupt = await this.ethernet.numReadWait(SOCKET_INTERRUPT, BSB_SOCKET_REGISTER(this.id));
        if (interrupt === 0) {
            return this.protocol !== null;
        }
        else {
            await this.ethernet.numWriteWait(SOCKET_INTERRUPT, BSB_SOCKET_REGISTER(this.id), interrupt);
        } // リセット
        const msgList = Object.keys(W5500SocketParts.InterruptFlags).filter((msg) => (interrupt &
            W5500SocketParts.InterruptFlags[msg]) !==
            0);
        for (const m in msgList) {
            const msg = msgList[m];
            const handler = this.interruptHandlers[msg];
            if (msg === 'Timeout') {
                this.protocol = null;
            }
            console.info(`Found Interrupt on Socket ${this.id}: ${msg}\n`);
            if (handler === undefined && this.allInterruptHandler === undefined) {
                continue;
            }
            let extra;
            if (msg === 'ReceiveData') {
                extra = await this.receiveDataWait();
            }
            if (msg === 'ConnectSuccess' && this.protocol === 'TCPServer') {
                extra = new W5500Parts.DestInfo(await this.getDestIPWait(), await this.getDestPortWait());
            }
            if (handler !== undefined) {
                await handler(this, extra);
            }
            if (this.allInterruptHandler !== undefined) {
                await this.allInterruptHandler(this, msg, extra);
            }
            return true;
        }
        return this.protocol !== null && this.ethernet.getSpiStatus();
    }
    /**
     * Get Status ステータスを取得
     *
     * @return Status ステータス
     */
    async getStatusWait() {
        const status = await this.ethernet.numReadWait(SOCKET_STATUS, BSB_SOCKET_REGISTER(this.id));
        const index = Object.values(W5500SocketParts.StatusCodes).indexOf(status);
        return index < 0
            ? 'UNKNOWN'
            : Object.keys(W5500SocketParts.StatusCodes)[index];
    }
    /**
     * Set the connection source port 接続元ポートを設定
     *
     * @param port Port number ポート番号
     * @return Write result 書き込み結果
     */
    setSourcePortWait(port) {
        return this.ethernet.num2WriteWait(SOCKET_SOURCE_PORT, BSB_SOCKET_REGISTER(this.id), port);
    }
    /**
     * Set the MAC address of the connection destination (only if required by UDP)
     *
     * 接続先のMACアドレスを設定(UDPで必要な場合のみ)
     *
     * @param mac MAC address MACアドレス
     * @return Write result 書き込み結果
     */
    setDestMacAddressWait(mac) {
        return this.ethernet.macWriteWait(SOCKET_DESTINATION_HARDWARE_ADDRESS, BSB_SOCKET_REGISTER(this.id), mac);
    }
    /**
     * Set the IPv4 address of the connection destination
     *
     * 接続先のIPv4アドレスを設定
     *
     * @param ip IPv4 address IPv4アドレス
     * @return Write result 書き込み結果
     */
    setDestIPWait(ip) {
        return this.ethernet.ipWriteWait(SOCKET_DESTINATION_IP_ADDRESS, BSB_SOCKET_REGISTER(this.id), ip);
    }
    /**
     * Get the IPv4 address of the connection source (only for TCP server)
     *
     * 接続元のIPv4アドレスを取得(TCPサーバーのときのみ)
     *
     * @return IPv4 address IPv4アドレス
     */
    getDestIPWait() {
        return this.ethernet.ipReadWait(SOCKET_DESTINATION_IP_ADDRESS, BSB_SOCKET_REGISTER(this.id));
    }
    /**
     * Set the port number of the connection destination
     *
     * 接続先のポート番号を設定
     *
     * @param port Port number ポート番号
     * @return Write result 書き込み結果
     */
    setDestPortWait(port) {
        return this.ethernet.num2WriteWait(SOCKET_DESTINATION_PORT, BSB_SOCKET_REGISTER(this.id), port);
    }
    /**
     * Get the port number of the connection source (only for TCP server)
     *
     * 接続元のポート番号を取得(TCPサーバーのときのみ)
     *
     * @return Port number ポート番号
     */
    getDestPortWait() {
        return this.ethernet.num2ReadWait(SOCKET_DESTINATION_PORT, BSB_SOCKET_REGISTER(this.id));
    }
    /**
     * Set maximum segment size (only if required by TCP)
     *
     * 最大セグメントサイズを設定(TCPで必要な場合のみ)
     *
     * @param size 最大セグメントサイズ
     * @return Write result 書き込み結果
     */
    setMaxSegmentSizeWait(size) {
        return this.ethernet.num2WriteWait(SOCKET_MAX_SEGMENT_SIZE, BSB_SOCKET_REGISTER(this.id), size);
    }
    /**
     * Set IP service type IPサービスタイプを設定
     *
     * @param type IP service type IPサービスタイプ (1byte)
     * @return Write result 書き込み結果
     */
    setIPTypeOfServiceWait(type) {
        return this.ethernet.numWriteWait(SOCKET_IP_TYPE_OF_SERVICE, BSB_SOCKET_REGISTER(this.id), type);
    }
    /**
     * Set TTL TTLを設定
     *
     * @param ttl TTL (0\~65535)
     * @return Write result 書き込み結果
     */
    setTTLWait(ttl) {
        return this.ethernet.numWriteWait(SOCKET_TTL, BSB_SOCKET_REGISTER(this.id), ttl);
    }
    /**
     * Set buffer size バッファサイズを設定
     *
     * @param size Buffer size バッファサイズ(KB)
     * @param address Start address of write destination 書き込み先の先頭アドレス
     * @return Write result 書き込み結果
     * @hidden
     */
    setBufferSizeWait(size, address) {
        if ([0, 1, 2, 4, 8, 16].indexOf(size) < 0) {
            throw new Error('Given buffer size must be 0, 1, 2, 4, 8 or 16.');
        }
        return this.ethernet.numWriteWait(address, BSB_SOCKET_REGISTER(this.id), size);
    }
    /**
     * Set receive buffer size 受信バッファサイズを設定
     *
     * @param size Buffer size (KB) only to the power of 2, up to 16
     *
     * バッファサイズ(KB) 2の累乗のみ、16まで
     * @return Write result 書き込み結果
     */
    setRXBufferSizeWait(size) {
        return this.setBufferSizeWait(size, SOCKET_RX_BUFFER_SIZE);
    }
    /**
     * Set send buffer size 送信バッファサイズを設定
     *
     * @param size Buffer size (KB) only to the power of 2, up to 16
     *
     * バッファサイズ(KB) 2の累乗のみ、16まで
     * @return Write result 書き込み結果
     */
    setTXBufferSizeWait(size) {
        return this.setBufferSizeWait(size, SOCKET_TX_BUFFER_SIZE);
    }
    /**
     * Get free size of send buffer 送信バッファの空きサイズを取得
     *
     * @return Free size 空きサイズ
     */
    getTXFreeSizeWait() {
        return this.ethernet.num2ReadWait(SOCKET_TX_FREE_SIZE, BSB_SOCKET_REGISTER(this.id));
    }
    /**
     * Get the write start address of the send buffer
     *
     * 送信バッファの書き込み開始アドレスを取得
     *
     * @return Address アドレス
     */
    getTXReadPointerWait() {
        return this.ethernet.num2ReadWait(SOCKET_TX_READ_POINTER, BSB_SOCKET_REGISTER(this.id));
    }
    /**
     * Set the next write start address of the send buffer
     *
     * 送信バッファの次の書き込み開始アドレスを設定
     *
     * @param pointer Address アドレス
     * @return Write result 書き込み結果
     */
    setTXWritePointerWait(pointer) {
        return this.ethernet.num2WriteWait(SOCKET_TX_WRITE_POINTER, BSB_SOCKET_REGISTER(this.id), pointer);
    }
    /**
     * Get the length of received data 受信データの長さを取得
     *
     * @return Length 長さ
     */
    getRXReceiveSizeWait() {
        return this.ethernet.num2ReadWait(SOCKET_RX_RECEIVE_SIZE, BSB_SOCKET_REGISTER(this.id));
    }
    /**
     * Get the read start address of the receive buffer
     *
     * 受信バッファの読み込み開始アドレスを取得
     *
     * @return Address アドレス
     */
    getRXReadDataPointerWait() {
        return this.ethernet.num2ReadWait(SOCLET_RX_READ_DATA_POINTER, BSB_SOCKET_REGISTER(this.id));
    }
    /**
     * Set the next read start address of the receive buffer
     *
     * 受信バッファの次の読み込み開始アドレスを設定
     *
     * @param pointer Address アドレス
     * @return Write result 書き込み結果
     */
    setRXReadDataPointerWait(pointer) {
        return this.ethernet.num2WriteWait(SOCLET_RX_READ_DATA_POINTER, BSB_SOCKET_REGISTER(this.id), pointer);
    }
    /**
     * Get the write start address of the receive buffer
     *
     * 受信バッファの書き込み開始アドレスを取得
     *
     * @return Address アドレス
     */
    getRXWritePointerWait() {
        return this.ethernet.num2ReadWait(SOCKET_RX_WRITE_POINTER, BSB_SOCKET_REGISTER(this.id));
    }
    /**
     * Set IP header fragment IPヘッダーのフラグメントを設定
     *
     * @param fragment IP header fragment IPヘッダーのフラグメント (0x0000\~0xFFFF)
     * @return Write result 書き込み結果
     */
    setFragmentWait(fragment) {
        return this.ethernet.num2WriteWait(SOCKET_FRAGMENT, BSB_SOCKET_REGISTER(this.id), fragment);
    }
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
    setKeepAliveTimerWait(time) {
        return this.ethernet.numWriteWait(SOCKET_KEEP_ALIVE_TIMER, BSB_SOCKET_REGISTER(this.id), time / 5);
    }
    /**
     * Send data データを送信
     *
     * @param data Raw byte data to send or string 送信するバイトデータまたは文字列
     * @param noWait Do not use spi.writeWait() when writing data
     *
     * データ書き込み時、spi.writeWait()を使用しない
     * @hidden
     */
    async sendDataBaseWait(data, noWait) {
        const d = typeof data === 'string'
            ? Array.from(new TextEncoder().encode(data))
            : data;
        const txReadPointer = await this.getTXReadPointerWait();
        const result = await this.ethernet.bigWriteWait(txReadPointer, BSB_SOCKET_TX_BUFFER(this.id), d, noWait);
        await this.setTXWritePointerWait(txReadPointer + d.length);
        await this.sendCommandWait('Send');
        return result;
    }
}
exports.W5500Socket = W5500Socket;
exports.default = W5500;
