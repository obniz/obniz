/**
 * @packageDocumentation
 * @module Parts.W5500
 */

// tslint:disable:max-classes-per-file
import Obniz from "../../../obniz";
import PeripheralIO from "../../../obniz/libs/io_peripherals/io";
import PeripheralSPI from "../../../obniz/libs/io_peripherals/spi";
import ObnizPartsInterface, { ObnizPartsInfo } from "../../../obniz/ObnizPartsInterface";

// ブロック選択ビット(BSB)
const BSB_COMMON = 0; // 00 共通レジスタ
const BSB_SOCKET_REGISTER = (socketId: number) => socketId * 4 + 1; // 01/05/09/13/17/21/25/29 ソケット0~7 レジスタ
const BSB_SOCKET_TX_BUFFER = (socketId: number) => socketId * 4 + 2; // 02/06/10/14/18/22/26/30 ソケット0~7 TXバッファ
const BSB_SOCKET_RX_BUFFER = (socketId: number) => socketId * 4 + 3; // 03/07/11/15/19/23/27/31 ソケット0~7 RXバッファ
// 04/08/12/16/20/24/28 予約済み

type SendMode = "Read" | "Write";

// 共通レジスタ                               先頭アドレス 使用アドレス数 読み書き 初期値 説明
const COMMON_MODE = 0x0000; // 1 RW 0x0000 モード Reset/_/WoL/PingBlock/PPPoE/_/ForceARP/_
const COMMON_GATEWAY_ADDRESS = 0x0001; // 4 RW 0x0000 デフォルトゲートウェイのIPv4アドレス
const COMMON_SOURCE_SUBNET_MASK = 0x0005; // 4 RW 0x0000 サブネットマスク
const COMMON_SOURCE_HARDWARE_ADDRESS = 0x0009; // 6 RW 0x0000 MACアドレス
const COMMON_SOURCE_IP_ADDRESS = 0x000f; // 4 RW 0x0000 LAN側のIPv4アドレス
const COMMON_INTERRUPT_LOW_LEVEL_TIMER = 0x0013; // 2 RW 0x0000 割り込みピンの変更間隔 -> 割り込みピン未接続につき使用不要
const COMMON_INTERRUPT = 0x0015; // 1 RW 0x0000 割り込み IPConflict/DestUnreach/PPPoEClose/MagicPacket/_/_/_/_
const COMMON_INTERRUPT_MASK = 0x0016; // 1 RW 0x0000 割り込みマスク(初期値より、初期設定時は割り込みなし)
const COMMON_SOCKET_INTERRUPT = 0x0017; // 1 RW 0x0000 ソケット割り込み -> 今回は未実装
const COMMON_SOCKET_INTERRUPT_MASK = 0x0018; // 1 RW 0x0000 ソケット割り込みマスク(初期値より、初期設定時はソケット割り込みなし)
const COMMON_RETRY_TIME = 0x0019; // 2 RW 0x07D0 再試行間隔(初期値: 100us*2000=200ms)
const COMMON_RETRY_COUNT = 0x001b; // 1 RW 0x0008 再試行回数(超えると各ソケットの割り込みのタイムアウトがtrueに)
const COMMON_PPP_LCP_REQUEST_TIMER = 0x001c; // 1 RW 0x0028 LinkControlプロトコルのechoリクエストを送っている時間(初期値: 40*25ms=1s)
const COMMON_PPP_LCP_MAGIC_NUMBER = 0x001d; // 1 RW 0x0000 LinkControlプロトコルのechoリクエストの4bytesマジックナンバーの1byte
const COMMON_PPP_DESTINATION_MAC_ADDRESS = 0x001e; // 6 RW 0x0000 PPPoEサーバーのMACアドレス
const COMMON_PPP_SESSION_IDENTIFICATION = 0x0024; // 2 RW 0x0000 PPPoEサーバーのセッションID
const COMMON_PPP_MAXIMUM_SEGMENT_SIZE = 0x0026; // 2 RW 0xFFFF PPPoEの最大受信ユニットサイズ
const COMMON_UNREACHABLE_IP_ADDRESS = 0x0028; // 4 R- 0x0000 宛先に到達できないときのIPv4アドレス
const COMMON_UNREACHABLE_PORT = 0x002c; // 2 R- 0x0000 宛先に到達できないときのポート番号
const COMMON_PHY_CONFIGURATION = 0x002e; // 1 RW 0b10111XXX 物理層の設定 Reset(1->0->1)/OperationMode/ConfigBit*3/Duplex/Speed/Link
// 0x002F~0x0038 予約済み
const COMMON_CHIP_VERSION = 0x0039; // 1 R- チップバージョン

// PHY_CONFIG 物理層の設定
// Reset  内部の物理層をリセット、このビットを0にした後、1に戻す必要がある
// OperationMode  1:次の3bitの設定を使用 0:ハードウェアピンの設定に従う
// ConfigBit  (ハードウェアピン、レジスタともに初期設定は111)
//   000  10BT 半二重 / 001  10BT 全二重
//   010 100BT 半二重 / 011 100BT 全二重
//   100 100BT 半二重 自動ネゴシエーションオン
//   110 電源オフモード
//   111 全て使用可能 自動ネゴシエーションオン
// Duplex  1:全二重 0:半二重
// Speed  1:100Mbps 0:10Mbps
// Link  1:接続中 0:未接続

// ソケットレジスタ                             先頭アドレス 使用アドレス数 読み書き 初期値 説明
const SOCKET_MODE = 0x0000; // 1 RW 0x0000 モード Multicast(UDP)·MACFilter(MACRAW)/BroadcastBlock(MACRAW·UDP)/
// NoDelayACK(TCP)·MulticastVer(UDP)·MulticastBlock(MACRAW)/UnicastBlock(UDP)·IPv6Block(MACRAW)/
// Protocol*4  0000:Closed · 0001:TCP · 0010:UDP · 0100:MACRAW
const SOCKET_COMMAND = 0x0001; // 1 RW 0x0000 コマンド  0x01:Open · 0x02:Listen(TCP) · 0x04:Connect(TCP) · 0x08:Disconnect(TCP) · 0x10:Close ·
// 0x20:Send · 0x21:SendMAC(UDP) · 0x22:SendKeep(UDP) · 0x40:Receive
const SOCKET_INTERRUPT = 0x0002; // 1 RCW1 0x00 割り込み _/_/_/SendOK/Timeout/Receive/Disconnect/Connected
const SOCKET_STATUS = 0x0003; // 1 R- 0x0000 状態 0x00:Closed · 0x13:Init(TCP) · 0x14:Listen(TCP) · 0x17:Established(TCP) · 0x1C:CloseWait(TCP) · 0x22:UDP · 0x32:MACRAW
// 一時的な状態(TCPのみ) 0x15:SynSent · 0x16:SynReceive · 0x18:FinWait · 0x1A:Closing · 0x1B:TimeWait · 0x1D:LastACK
const SOCKET_SOURCE_PORT = 0x0004; // 2 RW 0x0000 差出ポート
const SOCKET_DESTINATION_HARDWARE_ADDRESS = 0x0006; // 6 RW 0xFF~F 宛先ハードウェアアドレス(UDP/ARP) -> 今回は未使用
const SOCKET_DESTINATION_IP_ADDRESS = 0x000c; // 4 RW 0x0000 宛先IPアドレス(TCP/UDP)
const SOCKET_DESTINATION_PORT = 0x0010; // 2 RW 0x0000 宛先ポート(TCP/UDP)
const SOCKET_MAX_SEGMENT_SIZE = 0x0012; // 2 RW 最大セグメントサイズ(TCP?) -> 今回は未使用?
// 0x0014 予約済み
const SOCKET_IP_TYPE_OF_SERVICE = 0x0015; // 1 RW 0x0000 http://www.iana.org/assignments/ip-parameters(Openコマンドより前に設定)
const SOCKET_TTL = 0x0016; // 1 RW 0x0080 http://www.iana.org/assignments/ip-parameters(Openコマンドより前に設定)
// 0x0017~0x001D 予約済み
const SOCKET_RX_BUFFER_SIZE = 0x001e; // 1 RW 0x0000 受信バッファサイズ 0/1/2/4/8/16KB
const SOCKET_TX_BUFFER_SIZE = 0x001f; // 1 RW 0x0002 送信バッファサイズ 0/1/2/4/8/16KB
const SOCKET_TX_FREE_SIZE = 0x0020; // 2 R- 0x0800 TX空きサイズ
const SOCKET_TX_READ_POINTER = 0x0022; // 2 R- 0x0000 TX読込ポインタ
const SOCKET_TX_WRITE_POINTER = 0x0024; // 2 RW 0x0000 TX書込ポインタ
const SOCKET_RX_RECEIVE_SIZE = 0x0026; // 2 R- 0x0000 RX受信サイズ
const SOCLET_RX_READ_DATA_POINTER = 0x0028; // 2 RW 0x0000 RX読込ポインタ
const SOCKET_RX_WRITE_POINTER = 0x002a; // 2 R- 0x0000 RX書込ポインタ
const SOCKET_INTERRUPT_MASK = 0x002c; // 1 RW 0x00FF 割り込みマスク -> 変更しない
const SOCKET_FRAGMENT = 0x002d; // 2 RW 0x4000 IPヘッダーのフラグメント
const SOCKET_KEEP_ALIVE_TIMER = 0x002f; // 1 RW 0x0000 keep-aliveタイマー(TCP) 0x0A->50秒
// 0x0030~0xFFFF 予約済み

/** @hidden */
const sleep = (msec: number) => new Promise((resolve) => setTimeout(resolve, msec));
/** @hidden */
const byteString = (bytes: number[]) => bytes.map((n) => ("00" + n.toString(16).toUpperCase()).slice(-2)).join("");

/** W5500を管理するクラス */
export class W5500 implements ObnizPartsInterface {
  public static info(): ObnizPartsInfo {
    return {
      name: "W5500",
    };
  }

  public keys: string[];
  public requiredKeys: string[];
  public params: any;

  /** Obnizのインスタンス */
  protected obniz!: Obniz;
  /** PeripheralSPIのインスタンス */
  protected spi!: PeripheralSPI;
  /** リセットピンのインスタンス */
  protected resetPin!: PeripheralIO;
  /** チップセレクトピンのインスタンス */
  protected csPin!: PeripheralIO;
  /** 固定長通信するかどうか、チップセレクトピンが指定されていない場合、強制的にtrue */
  protected fdm: boolean = false;
  /** 割り込みをメッセージ別でキャッチするハンドラーを保持 */
  protected interruptHandlers: {
    [key in W5500.Interrupt]?:
      | ((ethernet: W5500) => Promise<void>)
      | ((ethernet: W5500, extra?: W5500.DestInfo) => Promise<void>);
  } = {};
  /** 割り込みを全てキャッチするハンドラーを保持 */
  protected allInterruptHandler?: (ethernet: W5500, msg: W5500.Interrupt, extra?: W5500.DestInfo) => Promise<void>;
  /** ソケットのインスタンスの配列 */
  protected socketList: W5500.Socket[] = [];
  /** SPIのステータス */
  protected spiStatus = false;
  /** 常に書き込み時に転送チェックを行わない */
  protected forceNoCheckWrite?: boolean;

  constructor() {
    this.keys = ["frequency", "reset", "mosi", "miso", "sclk", "cs"];
    this.requiredKeys = [];
  }

  public wired(obniz: Obniz) {
    this.obniz = obniz;

    this.params.frequency = this.params.frequency || 26000000;
    this.params.mosi = this.params.mosi || 23;
    this.params.miso = this.params.miso || 19;
    this.params.clk = this.params.clk || 18;
    this.params.drive = "3v";
    this.params.mode = "master";
    this.spi = this.params.spi || this.obniz.getSpiWithConfig(this.params);

    this.spiStatus = true;

    this.resetPin = this.obniz.getIO(this.params.reset || 12);
    this.csPin = this.obniz.getIO(this.params.cs || 33);
  }

  /**
   * W5500を初期化、共通設定の書き込み
   * @param option W5500の設定内容
   * @return 書き込み結果
   */
  public async init(option: W5500.Options) {
    // リセット
    await this.hardReset();

    // Fixed Length Data Mode の使用
    this.fdm = option.fdm === true;

    // SPIのセレクト
    this.csPin.drive("3v");
    this.csPin.output(!this.fdm);

    // モード設定
    let result = await this.setCommonMode(option);

    // ネットワークの初期化
    if (option.gatewayIP) {
      result = result && (await this.setGateway(option.gatewayIP));
    }
    if (option.subnetMask) {
      result = result && (await this.setSubnetMask(option.subnetMask));
    }
    if (option.macAddress) {
      result = result && (await this.setMacAddress(option.macAddress));
    }
    if (option.localIP) {
      result = result && (await this.setLocalIP(option.localIP));
    }

    // 割り込みマスクを全てオンに
    result = result && (await this.setInterruptMask(0xff));

    // その他設定
    if (option.retryTime) {
      result = result && (await this.setRetryTime(option.retryTime));
    }
    if (option.retryCount) {
      result = result && (await this.setRetryCount(option.retryCount));
    }
    if (option.linkControlProtocolRequestTimer) {
      result = result && (await this.setPPPLinkControlProtocolRequestTimer(option.linkControlProtocolRequestTimer));
    }
    if (option.linkControlProtocolMagicNumber) {
      result = result && (await this.setPPPLinkControlProtocolMagicNumber(option.linkControlProtocolMagicNumber));
    }
    if (option.pppoeDestMACAddress) {
      result = result && (await this.setPPPoEMacAddress(option.pppoeDestMACAddress));
    }
    if (option.pppoeSessionID) {
      result = result && (await this.setPPPoESessionID(option.pppoeSessionID));
    }
    if (option.pppoeMaxSegmentSize) {
      result = result && (await this.setPPPoEMaxSegmentSize(option.pppoeMaxSegmentSize));
    }
    if (option.phyConfig) {
      result = result && (await this.setPhysicalConfig(option.phyConfig));
    }

    this.forceNoCheckWrite = option.forceNoCheckWrite;

    // 割り込みハンドラー設定
    if (option.onIPConflictInterrupt) {
      this.setInterruptHandler("IPConflict", option.onIPConflictInterrupt);
    }
    if (option.onDestUnreachInterrupt) {
      this.setInterruptHandler("DestUnreach", option.onDestUnreachInterrupt);
    }
    if (option.onPPPoECloseInterrupt) {
      this.setInterruptHandler("PPPoEClose", option.onPPPoECloseInterrupt);
    }
    if (option.onMagicPacketInterrupt) {
      this.setInterruptHandler("MagicPacket", option.onMagicPacketInterrupt);
    }
    if (option.onAllInterrupt) {
      this.setAllInterruptHandler(option.onAllInterrupt);
    }

    return result;
  }

  /**
   * 各ソケットの終了処理をし、SPI通信を終了
   */
  public async finalize() {
    const funcList = this.socketList.filter((s) => s !== undefined).map((s) => s.finalize);
    for (const f in funcList) {
      await funcList[f]();
    }
    this.spi.end();
    this.spiStatus = false;
  }

  /**
   * 特定の割り込みをキャッチするハンドラーを設定
   * 実際にキャッチするにはcheckInterrupt()を定期的に実行
   * @param name 取得する割り込みの名前 (IPConflict | DestUnreach | PPPoEClose | MagicPacket)
   * @param handler コールバック関数、extraはname=DestUnreachのときのみ
   */
  public setInterruptHandler(
    name: W5500.Interrupt,
    handler: ((ethernet: W5500) => Promise<void>) | ((ethernet: W5500, extra?: W5500.DestInfo) => Promise<void>),
  ) {
    this.interruptHandlers[name] = handler;
  }

  /**
   * 全ての割り込みをキャッチするハンドラーを設定
   * 実際にキャッチするにはcheckInterrupt()を定期的に実行
   * @param handler コールバック関数、nameには受け取った割り込み名が入ります、extraはname=DestUnreachのときのみ
   */
  public setAllInterruptHandler(
    handler: (ethernet: W5500, name: W5500.Interrupt, extra?: W5500.DestInfo) => Promise<void>,
  ) {
    this.allInterruptHandler = handler;
  }

  /**
   * ルーターとの接続が確立されるまで待機
   * @return 物理層のステータス
   */
  public async waitLinkUp() {
    let phy;
    while (true) {
      phy = await this.getPhysicalConfig();
      if (phy.link) {
        break;
      }
      await sleep(20);
    }
    return phy;
  }

  /**
   * W5500.Socketのインスタンスを取得、必要ならば生成
   * @param socketId ソケットID、0~7
   * @return W5500.Socketのインスタンス
   */
  public getSocket(socketId: number) {
    if (socketId < 0 || socketId > 7) {
      throw new Error("Socket id must take a value between 0 and 7.");
    }
    if (!this.socketList[socketId]) {
      this.socketList[socketId] = new W5500.Socket(socketId, this);
    }
    return this.socketList[socketId];
  }

  /**
   * 使っていないソケットの枠にW5500.Socketのインスタンスを生成
   * @return W5500.Socketのインスタンス
   */
  public getNewSocket() {
    let id = 0;
    while (this.socketList[id] !== undefined) {
      id++;
    }
    if (id > 7) {
      return null;
    } else {
      return (this.socketList[id] = new W5500.Socket(id, this));
    }
  }

  /**
   * SPIが利用可能かどうか
   * @return SPIのステータス
   */
  public getSpiStatus() {
    return this.spiStatus;
  }

  /**
   * W5500をハードウェア的にリセット
   */
  public async hardReset() {
    this.resetPin.drive("3v");
    this.resetPin.output(false);
    await sleep(10); // > 500ns
    this.resetPin.output(true);
    await sleep(100);
  }

  /**
   * 共通レジスタのモードを設定
   * @param option WakeOnLAN(wol), PingBlock, PPPoE, ForceARPの項目のみ
   * @return 書き込み結果
   */
  public setCommonMode(option: W5500.Options) {
    return this.numWrite(
      COMMON_MODE,
      BSB_COMMON,
      0b00100000 * (option.wol === true ? 1 : 0) +
        0b00010000 * (option.pingBlock === true ? 1 : 0) +
        0b00001000 * (option.pppoe === true ? 1 : 0) +
        0b00000010 * (option.forceArp === true ? 1 : 0),
    );
  }

  /**
   * デフォルトゲートウェイのIPv4アドレスを設定
   * @param ip IPアドレス
   * @return 書き込み結果
   */
  public setGateway(ip: string) {
    return this.ipWrite(COMMON_GATEWAY_ADDRESS, BSB_COMMON, ip);
  }

  /**
   * サブネットマスクを設定
   * @param mask サブネットマスク
   * @return 書き込み結果
   */
  public setSubnetMask(mask: string) {
    return this.ipWrite(COMMON_SOURCE_SUBNET_MASK, BSB_COMMON, mask);
  }

  /**
   * MACアドレスを設定
   * @param mac MACアドレス
   * @return 書き込み結果
   */
  public setMacAddress(mac: string) {
    return this.macWrite(COMMON_SOURCE_HARDWARE_ADDRESS, BSB_COMMON, mac);
  }

  /**
   * LAN側のIPv4アドレスを設定
   * @param ip IPアドレス
   * @return 書き込み結果
   */
  public setLocalIP(ip: string) {
    return this.ipWrite(COMMON_SOURCE_IP_ADDRESS, BSB_COMMON, ip);
  }

  /**
   * 割り込みをチェック(VDMの時、正常に動作しません)
   * ソケットの割り込みもチェックします
   * 割り込みがあった場合、事前に設定されたhandlerを呼び出します
   * @param disableAllSocketCheck trueの時、全ソケットのcheckInterrupt呼び出しを同時に行いません
   * @return 常にtrue
   */
  public async checkInterrupt(disableAllSocketCheck?: boolean) {
    if (!this.spiStatus) {
      return false;
    }

    const interrupt = await this.numRead(COMMON_INTERRUPT, BSB_COMMON);
    if (interrupt !== 0) {
      await this.numWrite(COMMON_INTERRUPT, BSB_COMMON, interrupt);
    } // リセット

    const msgList = Object.keys(W5500.InterruptFlags).filter(
      (msg) => (interrupt & W5500.InterruptFlags[msg as W5500.Interrupt]) !== 0,
    );
    const extra =
      msgList.indexOf("DestUnreach") >= 0
        ? new W5500.DestInfo(await this.getUnreachableIP(), await this.getUnreachablePort())
        : undefined;

    if (disableAllSocketCheck !== false) {
      const funcList = this.socketList
        .filter((s) => s !== undefined && s.getProtocol() !== null)
        .map((s) => s.checkInterrupt);
      for (const f in funcList) {
        await funcList[f]();
      }
      // return funcList.length > 0;
    }
    // else
    // return true;

    for (const m in msgList) {
      const msg = msgList[m] as W5500.Interrupt;
      console.info(`Found Interrupt: ${msg}` + msg === "DestUnreach" ? ` address=${extra?.address}` : "");
      const handler = this.interruptHandlers[msg];
      if (handler !== undefined) {
        await handler(this, extra);
      }
      if (this.allInterruptHandler !== undefined) {
        await this.allInterruptHandler(this, msg, msg === "DestUnreach" ? extra : undefined);
      }
    }

    return this.spiStatus;
  }

  /**
   * 割り込みマスクを設定
   * @param mask マスク
   * @return 書き込み結果
   */
  public setInterruptMask(mask: number) {
    return this.numWrite(COMMON_INTERRUPT_MASK, BSB_COMMON, mask);
  }

  /**
   * 再試行間隔を設定(初期値: 200ms)
   * @param time 再試行間隔(0.2ms刻み)(0~6553.5)(ms)
   * @return 書き込み結果
   */
  public setRetryTime(time: number) {
    return this.num2Write(COMMON_RETRY_TIME, BSB_COMMON, time * 10);
  }

  /**
   * 再試行回数を設定(初期値: 8回)
   * @param count 再試行回数(0~255)
   * @return 書き込み結果
   */
  public setRetryCount(count: number) {
    return this.numWrite(COMMON_RETRY_COUNT, BSB_COMMON, count);
  }

  /**
   * LinkControlプロトコルのechoリクエストを送っている時間を設定
   * @param timer 時間(25ms刻み)(0~6375)(ms)
   * @return 書き込み結果
   */
  public setPPPLinkControlProtocolRequestTimer(timer: number) {
    return this.numWrite(COMMON_PPP_LCP_REQUEST_TIMER, BSB_COMMON, timer / 25);
  }

  /**
   * LinkControlプロトコルのechoリクエストの4bytesマジックナンバーの1byteを設定
   * @param num マジックナンバー
   * @return 書き込み結果
   */
  public setPPPLinkControlProtocolMagicNumber(num: number) {
    return this.numWrite(COMMON_PPP_LCP_MAGIC_NUMBER, BSB_COMMON, num);
  }

  /**
   * PPPoEサーバーのMACアドレスを設定
   * @param mac MACアドレス
   * @return 書き込み結果
   */
  public setPPPoEMacAddress(mac: string) {
    return this.macWrite(COMMON_PPP_DESTINATION_MAC_ADDRESS, BSB_COMMON, mac);
  }

  /**
   * PPPoEサーバーのセッションIDを設定
   * @param id セッションID
   * @return 書き込み結果
   */
  public setPPPoESessionID(id: number) {
    return this.num2Write(COMMON_PPP_SESSION_IDENTIFICATION, BSB_COMMON, id);
  }

  /**
   * PPPoEの最大受信ユニットサイズを設定
   * @param size ユニットサイズ
   * @return 書き込み結果
   */
  public setPPPoEMaxSegmentSize(size: number) {
    return this.num2Write(COMMON_PPP_MAXIMUM_SEGMENT_SIZE, BSB_COMMON, size);
  }

  /**
   * 到達できなかった時のIPアドレスを取得
   * @return IPv4アドレス
   */
  public getUnreachableIP() {
    return this.ipRead(COMMON_UNREACHABLE_IP_ADDRESS, BSB_COMMON);
  }

  /**
   * 到達できなかった時のポート番号を取得
   * @return ポート番号
   */
  public getUnreachablePort() {
    return this.num2Read(COMMON_UNREACHABLE_PORT, BSB_COMMON);
  }

  /**
   * 物理層のステータス取得
   * @return 物理層のステータス
   */
  public async getPhysicalConfig(): Promise<W5500.PhysicalLayerStatus> {
    const result = await this.numRead(COMMON_PHY_CONFIGURATION, BSB_COMMON);
    return {
      duplex: (result & 0b100) !== 0,
      speed: (result & 0b010) !== 0 ? 100 : 10,
      link: (result & 0b001) !== 0,
    };
  }

  /**
   * 物理層の設定
   * @param config 物理層の設定内容
   * @return 書き込み結果
   */
  public async setPhysicalConfig(config: W5500.PhysicalLayerOptions) {
    if (config.reset) {
      await this.numWrite(COMMON_PHY_CONFIGURATION, BSB_COMMON, 0);
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
    if (config.powerDown === true) {
      value = 0b11110000;
    }
    return await this.numWrite(COMMON_PHY_CONFIGURATION, BSB_COMMON, value);
  }

  /**
   * チップバージョンの取得
   * @return チップバージョン
   */
  public getVersion() {
    return this.numRead(COMMON_CHIP_VERSION, BSB_COMMON);
  }

  /**
   * 文字列のIPアドレスをバリデーションチェックしてから書き込みます
   * @param address 書き込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @param ip IPv4アドレス
   * @return 書き込み結果
   * @internal
   * @hidden
   */
  public ipWrite(address: number, bsb: number, ip: string) {
    return this.addressWrite(address, bsb, ip, "IP Address", "123.234.0.1", ".", 4, 10);
  }

  /**
   * 文字列のMACアドレスをバリデーションチェックしてから書き込みます
   * @param address 書き込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @param ip MACアドレス
   * @return 書き込み結果
   * @internal
   * @hidden
   */
  public macWrite(address: number, bsb: number, mac: string) {
    return this.addressWrite(address, bsb, mac, "MAC Address", "12:34:56:78:90:AB", ":", 6, 16);
  }

  /**
   * 大きいデータの書き込み
   * FDMのとき、長さが4より大きいときに使用
   * VDMのとき、長さが1021より大きいときに使用
   * @param address 書き込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @param data バイト列データ
   * @param noWait データ書き込み時、spi.writeWaitを使用しない
   * @return 書き込み結果
   * @internal
   * @hidden
   */
  public async bigWrite(address: number, bsb: number, data: number[], noWait?: boolean) {
    const maxLength = this.fdm ? 4 : 1021; // FDM(4) / VDM(1024-3)
    let result = true;
    for (let i = 0; i < data.length; i += maxLength) {
      const size = i + maxLength <= data.length ? maxLength : data.length - i;
      result = result && (await this.write(address + i, bsb, data.slice(i, i + size), noWait));
    }
    return result;
  }

  /**
   * 1アドレス分の領域への値の書き込み
   * @param address 書き込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @param num 値(0~255)
   * @return 書き込み結果
   * @internal
   * @hidden
   */
  public numWrite(address: number, bsb: number, num: number) {
    return this.write(address, bsb, [num]);
  }

  /**
   * 2アドレス分の領域への値の書き込み
   * @param address 書き込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @param num 値(0~65535)
   * @return 書き込み結果
   * @internal
   * @hidden
   */
  public num2Write(address: number, bsb: number, num: number) {
    return this.write(address, bsb, [(num & 0xff00) >> 8, num & 0xff]);
  }

  /**
   * IPアドレスデータの読み込み
   * @param address 読み込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @return IPv4アドレス
   * @internal
   * @hidden
   */
  public async ipRead(address: number, bsb: number) {
    return (await this.read(address, bsb, 4)).join(".");
  }

  /**
   * 大きいデータの読み込み
   * FDMのとき、長さが4より大きいときに使用
   * VDMのとき、長さが1021より大きいときに使用
   * @param address 読み込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @param length データの長さ(アドレス長)
   * @return 読み込みデータ
   * @internal
   * @hidden
   */
  public async bigRead(address: number, bsb: number, length: number) {
    const maxLength = this.fdm ? 4 : 1021; // FDM(4) / VDM(1024-3)
    let data: number[] = [];
    for (let i = 0; i < length; i += maxLength) {
      const size = i + maxLength <= length ? maxLength : length - i;
      data = data.concat(await this.read(address + i, bsb, size));
    }
    return data;
  }

  /**
   * 1アドレス分の領域からの値の読み込み
   * @param address 読み込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @return 値(0~255)
   * @internal
   * @hidden
   */
  public async numRead(address: number, bsb: number) {
    const result = await this.read(address, bsb, 1);
    return result[0];
  }

  /**
   * 2アドレス分の領域からの値の読み込み
   * @param address 読み込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @return 値(0~65535)
   * @internal
   * @hidden
   */
  public async num2Read(address: number, bsb: number) {
    const result = await this.read(address, bsb, 2);
    return (result[0] << 8) + result[1];
  }

  /**
   * アドレス系を定義に基づいてバリデーションチェックして書き込み
   * @param address 書き込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @param val 書き込むアドレスの文字列
   * @param name アドレスの種類名
   * @param example アドレスのサンプル文字列、エラー用
   * @param splitVal アドレスの分割文字
   * @param length アドレスを分割文字で分割した時の長さ
   * @param radix アドレス内の数字の記述方法(n進数)
   * @internal
   * @hidden
   */
  private addressWrite(
    address: number,
    bsb: number,
    val: string,
    name: string,
    example: string,
    splitVal: string,
    length: number,
    radix: number,
  ) {
    if (typeof val !== "string") {
      throw new Error(`Given ${name} must be string.`);
    }
    const valList = val.split(splitVal).map((addr) => parseInt(addr, radix));
    if (valList.filter((addr) => typeof addr === "number").length !== length) {
      throw new Error(`${name} format must be '${example}'.`);
    }
    const func = length > 4 && this.fdm ? this.bigWrite : this.write;
    return func(address, bsb, valList);
  }

  /**
   * 通常データの書き込み
   * FDMのとき、長さは4まで
   * VDMのとき、長さは1021まで
   * @param address 書き込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @param data バイト列データ
   * @param noWait データ書き込み時、spi.writeWaitを使用しない
   * @return 書き込み結果
   * @internal
   * @hidden
   */
  private async write(address: number, bsb: number, data: number[], noWait?: boolean) {
    if (!Array.isArray(data)) {
      throw new Error("Given data must be array.");
    }
    if (data.length === 3 && this.fdm) {
      data[3] = 0;
    }
    if (data.length === 0) {
      throw new Error("Given data is empty.");
    }
    if (data.length > 4 && this.fdm) {
      throw new Error("Given data length must be 1, 2 or 4.");
    }
    if (data.length > 1021 && !this.fdm) {
      throw new Error("Given data length must be 1021 or less.");
    }
    if (data.filter((addr) => 0x00 <= addr && addr <= 0xff).length !== data.length) {
      throw new Error("Given data field must take a value between 0(0x00) and 255(0xFF).");
    }
    if (this.forceNoCheckWrite === true && noWait === undefined) {
      noWait = true;
    }
    const result = await this.send(address, bsb, "Write", data, noWait);
    if (typeof result === "object") {
      throw new Error("Unexpected Result");
    } else {
      return result;
    }
  }

  /**
   * 大きいデータの読み込み
   * FDMのとき、長さは4まで
   * VDMのとき、長さは1021まで
   * @param address 読み込み先の先頭アドレス
   * @param bsb ブロック選択ビット
   * @param length データの長さ(アドレス長)
   * @return 読み込みデータ
   * @internal
   * @hidden
   */
  private async read(address: number, bsb: number, length: number) {
    const result = await this.send(address, bsb, "Read", Array(length).fill(0));
    if (typeof result === "boolean") {
      throw new Error("Unexpected Result");
    } else {
      return result;
    }
  }

  /**
   * 読み書き共通のメソッド、返却されたデータを検証
   * @param address 操作先の先頭アドレス(0x0000~0xFFFF)
   * @param bsb ブロック選択ビット(0b00000~0b11111)
   * @param mode 読み込みか書き込みか(Read|Write)
   * @param data バイト列データ(0xFF*1~4(FDM), *1~1021(VDM))
   * @param noWait データ書き込み時、spi.writeWaitを使用しない
   * @return 書込:書き込み結果 読込:読み込みデータ
   * @internal
   * @hidden
   */
  private async send(address: number, bsb: number, mode: SendMode, data: number[], noWait?: boolean) {
    const write = [
      (address & 0xff00) >> 8,
      address & 0x00ff,
      (bsb << 3) + (mode === "Write" ? 0b0100 : 0b0000) + (this.fdm ? (data.length < 4 ? data.length : 0b11) : 0),
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

    if (typeof result === "undefined") {
      return true;
    }
    if (result[0] === 1 && result[1] === 2 && result[2] === 3) {
      return mode === "Write" ? true : result.slice(3);
    } else {
      throw new Error(
        `${mode} Error\n address: 0x${("0000" + address.toString(16).toUpperCase()).slice(
          -4,
        )}  bsb: ${bsb}\n send: 0x${byteString(write)}\n receive: 0x${byteString(result)}\n`,
      );
    }
  }
}

export namespace W5500 {
  /** ピンアサインとSPIオプション */
  export interface WiredOptions {
    /** リセットピン番号(初期値: 12) */
    reset?: number;
    /** SPIのMOSIピン番号(初期値: 23) */
    mosi?: number;
    /** SPIのMISOピン番号(初期値: 19) */
    miso?: number;
    /** SPIのCLKピン番号(初期値: 18) */
    clk?: number;
    /** SPIのCSピン番号(初期値: 33) */
    cs?: number;
    /** SPIのクロック周波数(初期値: 26000000(26Mhz)) */
    frequency?: number;
  }

  /** W5500の設定内容 */
  export interface Options {
    /** WakeOnLANを待ち受ける */
    wol?: boolean;
    /** pingを返答しない */
    pingBlock?: boolean;
    /** PPPoEを使用する */
    pppoe?: boolean;
    /** データを送信した時は必ずARPリクエストを送信する */
    forceArp?: boolean;
    /** 固定データ長(最大4Byte)通信を使用する、csピン指定がない場合自動的にオン */
    fdm?: boolean;
    /** デフォルトゲートウェイのIPv4アドレス */
    gatewayIP: string;
    /** サブネットマスク */
    subnetMask: string;
    /** MACアドレス */
    macAddress: string;
    /** LAN側のIPv4アドレス */
    localIP: string;
    /** 再試行間隔 */
    retryTime?: number;
    /** 再試行回数 */
    retryCount?: number;
    /** LinkControlプロトコルのechoリクエストを送っている時間 */
    linkControlProtocolRequestTimer?: number;
    /** LinkControlプロトコルのechoリクエストの4bytesマジックナンバーの1byte */
    linkControlProtocolMagicNumber?: number;
    /** PPPoEサーバーのMACアドレス */
    pppoeDestMACAddress?: string;
    /** PPPoEサーバーのセッションID */
    pppoeSessionID?: number;
    /** PPPoEの最大受信ユニットサイズ */
    pppoeMaxSegmentSize?: number;
    /** 物理層の設定 */
    phyConfig?: PhysicalLayerOptions;
    /** 常に書き込み時に転送チェックを行わない */
    forceNoCheckWrite?: boolean;

    /** 割り込み「IPConflict」のイベントハンドラー */
    onIPConflictInterrupt?: (ethernet: W5500) => Promise<void>;
    /** 割り込み「DestUnreach」のイベントハンドラー */
    onDestUnreachInterrupt?: (ethernet: W5500, extra?: W5500.DestInfo) => Promise<void>;
    /** 割り込み「PPPoEClose」のイベントハンドラー */
    onPPPoECloseInterrupt?: (ethernet: W5500) => Promise<void>;
    /** 割り込み「MagicPacket」のイベントハンドラー */
    onMagicPacketInterrupt?: (ethernet: W5500) => Promise<void>;
    /** 全ての割り込みのイベントハンドラー */
    onAllInterrupt?: (ethernet: W5500, name: W5500.Interrupt, extra?: W5500.DestInfo) => Promise<void>;
  }

  /** 接続速度(Mbps)(10/100) */
  export type LinkSpeed = 10 | 100;

  /** 物理層のステータス */
  export interface PhysicalLayerStatus {
    /** 全二重かどうか */
    duplex: boolean;
    /** 接続速度(Mbps)(10/100) */
    speed: LinkSpeed;
    /** 接続が確立されているかどうか */
    link: boolean;
  }

  /** 物理層の設定内容 */
  export interface PhysicalLayerOptions {
    /** 物理層のリセット */
    reset?: boolean;
    /** 自動ネゴシエーション */
    autoNegotiation?: boolean;
    /** 接続速度(Mbps)(10/100) */
    speed?: LinkSpeed;
    /** 全二重かどうか */
    duplex?: boolean;
    /** 電源オフにするかどうか */
    powerDown?: boolean;
  }

  /** 割り込みの種類 */
  export type Interrupt = "IPConflict" | "DestUnreach" | "PPPoEClose" | "MagicPacket";

  /** 割り込みと対応するフラグ */
  export const InterruptFlags: { [key in Interrupt]: number } = {
    IPConflict: 0b10000000,
    DestUnreach: 0b01000000,
    PPPoEClose: 0b00100000,
    MagicPacket: 0b00010000,
  } as const;

  /** 接続先情報 */
  export class DestInfo {
    /** IPv4アドレス */
    public readonly ip: string;
    /** ポート番号 */
    public readonly port: number;
    /** アドレス(123.234.0.1:12345形式) */
    public readonly address: string;

    constructor(ip: string, port: number) {
      this.ip = ip;
      this.port = port;
      this.address = `${ip}:${port}`;
    }
  }

  /** ソケット通信を行い管理するクラス */
  export class Socket {
    /** ソケットID */
    public readonly id: number;
    /** 受信データを文字列(UTF-8のみ)として処理 */
    public stringMode = false;
    /** 現在のプロトコル */
    protected protocol: Socket.Protocol = null;
    /** W5500のインスタンス */
    protected ethernet: W5500;
    /** 割り込みをメッセージ別でキャッチするハンドラーを保持 */
    protected interruptHandlers: {
      [key in Socket.Interrupt]?:
        | ((socket: Socket) => Promise<void>)
        | ((socket: Socket, extra?: number[] | string | W5500.DestInfo) => Promise<void>);
    } = {};
    /** 割り込みを全てキャッチするハンドラーを保持 */
    protected allInterruptHandler?: (
      socket: Socket,
      msg: Socket.Interrupt,
      extra?: number[] | string | W5500.DestInfo,
    ) => Promise<void>;
    /** バイト列 -> UTF-8 */
    protected readonly TextDecode: (
      input?: ArrayBufferView | ArrayBuffer | undefined,
      options?: TextDecodeOptions | undefined,
    ) => string;
    /** UTF-8 -> バイト列 */
    protected readonly TextEncode: (input?: string | undefined) => Uint8Array;
    /** データ読み込みのアドレスを保持 */
    protected rxReadDataPointer = 0;

    constructor(id: number, ethernet: W5500) {
      this.id = id;
      this.ethernet = ethernet;
      this.TextDecode = new TextDecoder().decode;
      this.TextEncode = new TextEncoder().encode;
    }

    /**
     * ソケット設定の書き込みをし、ソケットをオープンに(TCPの場合はConnect/Listenも実行)
     * @param option ソケット設定
     * @return 書き込み結果
     */
    public async init(option: Socket.Options) {
      // モード設定
      let result = await this.setMode(option);

      // 基本設定
      if (option.sourcePort) {
        result = result && (await this.setSourcePort(option.sourcePort));
      }
      if (option.destIP) {
        result = result && (await this.setDestIP(option.destIP));
      }
      if (option.destPort) {
        result = result && (await this.setDestPort(option.destPort));
      }
      if (option.ipType) {
        result = result && (await this.setIPTypeOfService(option.ipType));
      }
      if (option.ttl) {
        result = result && (await this.setTTL(option.ttl));
      }
      if (option.rxBufferSize) {
        result = result && (await this.setRXBufferSize(option.rxBufferSize));
      }
      if (option.txBufferSize) {
        result = result && (await this.setTXBufferSize(option.txBufferSize));
      }

      // ソケットのオープン
      result = result && (await this.sendCommand("Open"));
      if (this.protocol === "TCPClient") {
        result && (await this.sendCommand("Connect"));
      }
      if (this.protocol === "TCPServer") {
        result && (await this.sendCommand("Listen"));
      }

      // 事前にrxReadDataPointerの値を記憶
      this.rxReadDataPointer = await this.getRXReadDataPointer();

      // 割り込みハンドラー設定
      if (option.onSendOKtInterrupt) {
        this.setInterruptHandler("SendOK", option.onSendOKtInterrupt);
      }
      if (option.onTimeoutInterrupt) {
        this.setInterruptHandler("Timeout", option.onTimeoutInterrupt);
      }
      if (option.onReceiveDataInterrupt) {
        this.setInterruptHandler("ReceiveData", option.onReceiveDataInterrupt);
      }
      if (option.onDisconnectInterrupt) {
        this.setInterruptHandler("Disconnect", option.onDisconnectInterrupt);
      }
      if (option.onConnectSuccessInterrupt) {
        this.setInterruptHandler("ConnectSuccess", option.onConnectSuccessInterrupt);
      }
      if (option.onAllInterrupt) {
        this.setAllInterruptHandler(option.onAllInterrupt);
      }

      return result;
    }

    /**
     * ソケットの終了処理
     */
    public async finalize() {
      switch (this.protocol) {
        case "TCPClient":
          await this.sendCommand("Disconnect");
          while ((await this.getStatus()) !== "Closed") {}
          break;
        case "TCPServer":
          await this.sendCommand("Disconnect");
        case "UDP":
          await this.sendCommand("Close");
          break;
      }
      this.protocol = null;
    }

    /**
     * データを送信
     * @param data 送信データまたは文字列
     * @return 書き込み結果
     */
    public sendData(data: number[] | string) {
      return this.sendDataBase(data);
    }

    /**
     * データを送信、書き込みチェックなし
     * @param data 送信データまたは文字列
     * @return 書き込み結果
     */
    public sendDataFast(data: number[] | string) {
      return this.sendDataBase(data, true);
    }

    /**
     * 受信されたデータを読取
     * @return 受信データまたは文字列
     */
    public async receiveData() {
      const rxRecieveSize = await this.getRXReceiveSize();
      // const rxReadDataPointer = await this.getRXReadDataPointer();
      const data = await this.ethernet.bigRead(this.rxReadDataPointer, BSB_SOCKET_RX_BUFFER(this.id), rxRecieveSize);
      this.rxReadDataPointer += rxRecieveSize;
      await this.setRXReadDataPointer(this.rxReadDataPointer + rxRecieveSize);
      await this.sendCommand("Receive");
      return this.stringMode ? new TextDecoder().decode(Uint8Array.from(data)) : data;
    }

    /**
     * 特定の割り込みをキャッチするハンドラーを設定
     * 実際にキャッチするにはcheckInterrupt()を定期的に実行
     * @param name 取得する割り込みの名前 (SendOK | Timeout | ReceiveData | Disconnect | ConnectSuccess)
     * @param handler コールバック関数、extraはname=ReceiveDataの時とname=ConnectSuccessかつprotocol=TCPServerの時のみ
     */
    public setInterruptHandler(
      name: Socket.Interrupt,
      handler:
        | ((socket: Socket) => Promise<void>)
        | ((socket: Socket, extra?: number[] | string | W5500.DestInfo) => Promise<void>),
    ) {
      return (this.interruptHandlers[name] = handler);
    }

    /**
     * 全ての割り込みをキャッチするハンドラーを設定
     * 実際にキャッチするにはcheckInterrupt()を定期的に実行
     * @param handler コールバック関数、nameには受け取った割り込み名が入ります、extraはname=ReceiveDataの時とname=ConnectSuccessかつprotocol=TCPServerの時のみ
     */
    public setAllInterruptHandler(
      handler: (socket: Socket, name: Socket.Interrupt, extra?: number[] | string | W5500.DestInfo) => Promise<void>,
    ) {
      return (this.allInterruptHandler = handler);
    }

    /**
     * 現在の設定済みプロトコルを取得
     * @return プロトコル
     */
    public getProtocol() {
      return this.protocol;
    }

    /**
     * ソケットレジスタのモードを設定
     * @param option ソケット設定
     * @return 書き込み結果
     */
    public setMode(option: Socket.Options) {
      this.protocol = option.protocol;
      this.stringMode = option.stringMode || false;
      return this.ethernet.numWrite(
        SOCKET_MODE,
        BSB_SOCKET_REGISTER(this.id),
        option.protocol === null
          ? 0
          : 0b10000000 * (option.multicast === true && option.protocol === "UDP" ? 1 : 0) +
              0b01000000 * (option.broardcastBlock === true && option.protocol === "UDP" ? 1 : 0) +
              0b00100000 * (option.noDelayACK === true && option.protocol.indexOf("TCP") >= 0 ? 1 : 0) +
              0b00100000 * (option.multicastVer1 === true && option.protocol === "UDP" ? 1 : 0) +
              0b00010000 * (option.unicastBlock === true && option.protocol === "UDP" ? 1 : 0) +
              0b00000001 * (option.protocol.indexOf("TCP") >= 0 ? 1 : 0) +
              0b00000010 * (option.protocol === "UDP" ? 1 : 0),
      );
    }

    /**
     * ソケットにコマンドを送信
     * @param command コマンド
     * @return 書き込み結果
     */
    public async sendCommand(command: Socket.Command) {
      const code = Socket.CommandCodes[command];
      if (!code) {
        throw new Error(`Unknown Command '${command}'.`);
      }
      if (this.protocol === null) {
        throw new Error("Must set Socket Mode before send the command.");
      }
      if (this.protocol.indexOf("TCP") >= 0 && 0x20 < code && code < 0x30) {
        throw new Error(`'${command}' command is only available in UDP mode.`);
      }
      if (this.protocol === "UDP" && 0x01 < code && code < 0x10) {
        throw new Error(`'${command}' command is only available in TCP mode.`);
      }
      return await this.ethernet.numWrite(SOCKET_COMMAND, BSB_SOCKET_REGISTER(this.id), code);
    }

    /**
     * 割り込みをチェック
     * 割り込みがあった場合、事前に設定されたhandlerを呼び出します
     * @return 常にtrue
     */
    public async checkInterrupt() {
      if (!this.ethernet.getSpiStatus()) {
        return;
      }
      const interrupt = await this.ethernet.numRead(SOCKET_INTERRUPT, BSB_SOCKET_REGISTER(this.id));
      if (interrupt === 0) {
        return this.protocol !== null;
      } else {
        await this.ethernet.numWrite(SOCKET_INTERRUPT, BSB_SOCKET_REGISTER(this.id), interrupt);
      } // リセット

      const msgList = Object.keys(Socket.InterruptFlags).filter(
        (msg) => (interrupt & Socket.InterruptFlags[msg as Socket.Interrupt]) !== 0,
      );
      for (const m in msgList) {
        const msg = msgList[m] as Socket.Interrupt;
        const handler = this.interruptHandlers[msg];
        if (msg === "Timeout") {
          this.protocol = null;
        }
        console.info(`Found Interrupt on Socket ${this.id}: ${msg}\n`);

        if (handler === undefined && this.allInterruptHandler === undefined) {
          continue;
        }

        let extra;
        if (msg === "ReceiveData") {
          extra = await this.receiveData();
        }
        if (msg === "ConnectSuccess" && this.protocol === "TCPServer") {
          extra = new W5500.DestInfo(await this.getDestIP(), await this.getDestPort());
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
     * ソケットのステータスを取得
     * @return ステータス
     */
    public async getStatus(): Promise<Socket.Status | "UNKNOWN"> {
      const status = await this.ethernet.numRead(SOCKET_STATUS, BSB_SOCKET_REGISTER(this.id));
      const index = Object.values(Socket.StatusCodes).indexOf(status);
      return index < 0 ? "UNKNOWN" : (Object.keys(Socket.StatusCodes)[index] as Socket.Status);
    }

    /**
     * 本体側で使用するポートを設定
     * @param port ポート番号
     * @return 書き込み結果
     */
    public setSourcePort(port: number) {
      return this.ethernet.num2Write(SOCKET_SOURCE_PORT, BSB_SOCKET_REGISTER(this.id), port);
    }

    /**
     * 接続先のMACアドレスを設定(UDPで必要な場合のみ)
     * @param mac MACアドレス
     * @return 書き込み結果
     */
    public setDestMacAddress(mac: string) {
      return this.ethernet.macWrite(SOCKET_DESTINATION_HARDWARE_ADDRESS, BSB_SOCKET_REGISTER(this.id), mac);
    }

    /**
     * 接続先のIPアドレスを設定
     * @param ip IPv4アドレス
     * @return 書き込み結果
     */
    public setDestIP(ip: string) {
      return this.ethernet.ipWrite(SOCKET_DESTINATION_IP_ADDRESS, BSB_SOCKET_REGISTER(this.id), ip);
    }

    /**
     * 接続元のIPアドレスを取得(TCPサーバーのときのみ)
     * @return IPv4アドレス
     */
    public getDestIP() {
      return this.ethernet.ipRead(SOCKET_DESTINATION_IP_ADDRESS, BSB_SOCKET_REGISTER(this.id));
    }

    /**
     * 接続先のポート番号を設定
     * @param port ポート番号
     * @return 書き込み結果
     */
    public setDestPort(port: number) {
      return this.ethernet.num2Write(SOCKET_DESTINATION_PORT, BSB_SOCKET_REGISTER(this.id), port);
    }

    /**
     * 接続元のポート番号を取得(TCPサーバーのときのみ)
     * @return ポート番号
     */
    public getDestPort() {
      return this.ethernet.num2Read(SOCKET_DESTINATION_PORT, BSB_SOCKET_REGISTER(this.id));
    }

    /**
     * 最大セグメントサイズを設定(TCPで必要な場合のみ)
     * @param size 最大セグメントサイズ
     * @return 書き込み結果
     */
    public setMaxSegmentSize(size: number) {
      return this.ethernet.num2Write(SOCKET_MAX_SEGMENT_SIZE, BSB_SOCKET_REGISTER(this.id), size);
    }

    /**
     * IPサービスタイプを設定
     * @param type IPサービスタイプ(1byte)
     * @return 書き込み結果
     */
    public setIPTypeOfService(type: number) {
      return this.ethernet.numWrite(SOCKET_IP_TYPE_OF_SERVICE, BSB_SOCKET_REGISTER(this.id), type);
    }

    /**
     * TTLを設定
     * @param ttl TTL(0~65535)
     * @return 書き込み結果
     */
    public setTTL(ttl: number) {
      return this.ethernet.numWrite(SOCKET_TTL, BSB_SOCKET_REGISTER(this.id), ttl);
    }

    /**
     * バッファサイズを設定
     * @param size バッファサイズ(KB)
     * @param address 書き込み先の先頭アドレス
     * @return 書き込み結果
     * @internal
     * @hidden
     */
    public setBufferSize(size: Socket.BufferSize, address: number) {
      if ([0, 1, 2, 4, 8, 16].indexOf(size) < 0) {
        throw new Error("Given buffer size must be 0, 1, 2, 4, 8 or 16.");
      }
      return this.ethernet.numWrite(address, BSB_SOCKET_REGISTER(this.id), size);
    }

    /**
     * 受信バッファサイズを設定
     * @param size バッファサイズ(KB) 2の累乗のみ、16まで
     * @return 書き込み結果
     */
    public setRXBufferSize(size: Socket.BufferSize) {
      return this.setBufferSize(size, SOCKET_RX_BUFFER_SIZE);
    }

    /**
     * 送信バッファサイズを設定
     * @param size バッファサイズ(KB) 2の累乗のみ、16まで
     * @return 書き込み結果
     */
    public setTXBufferSize(size: Socket.BufferSize) {
      return this.setBufferSize(size, SOCKET_TX_BUFFER_SIZE);
    }

    /**
     * 送信バッファの空きサイズを取得
     * @return 空きサイズ
     */
    public getTXFreeSize() {
      return this.ethernet.num2Read(SOCKET_TX_FREE_SIZE, BSB_SOCKET_REGISTER(this.id));
    }

    /**
     * 送信バッファの書き込み開始アドレスを取得
     * @return アドレス
     */
    public getTXReadPointer() {
      return this.ethernet.num2Read(SOCKET_TX_READ_POINTER, BSB_SOCKET_REGISTER(this.id));
    }

    /**
     * 送信バッファの次の書き込み開始アドレスを設定
     * @param pointer アドレス
     * @return 書き込み結果
     */
    public setTXWritePointer(pointer: number) {
      return this.ethernet.num2Write(SOCKET_TX_WRITE_POINTER, BSB_SOCKET_REGISTER(this.id), pointer);
    }

    /**
     * 受信データの長さを取得
     * @return 長さ
     */
    public getRXReceiveSize() {
      return this.ethernet.num2Read(SOCKET_RX_RECEIVE_SIZE, BSB_SOCKET_REGISTER(this.id));
    }

    /**
     * 受信バッファの読み込み開始アドレスを取得
     * @return アドレス
     */
    public getRXReadDataPointer() {
      return this.ethernet.num2Read(SOCLET_RX_READ_DATA_POINTER, BSB_SOCKET_REGISTER(this.id));
    }

    /**
     * 受信バッファの次の読み込み開始アドレスを設定
     * @param pointer アドレス
     * @return 書き込み結果
     */
    public setRXReadDataPointer(pointer: number) {
      return this.ethernet.num2Write(SOCLET_RX_READ_DATA_POINTER, BSB_SOCKET_REGISTER(this.id), pointer);
    }

    /**
     * 受信バッファの書き込み開始アドレスを取得
     * @return アドレス
     */
    public getRXWritePointer() {
      return this.ethernet.num2Read(SOCKET_RX_WRITE_POINTER, BSB_SOCKET_REGISTER(this.id));
    }

    /**
     * IPヘッダーのフラグメントを設定
     * @param fragment IPヘッダーのフラグメント(0x0000~0xFFFF)
     * @return 書き込み結果
     */
    public setFragment(fragment: number) {
      return this.ethernet.num2Write(SOCKET_FRAGMENT, BSB_SOCKET_REGISTER(this.id), fragment);
    }

    /**
     * keep-aliveの送信間隔を設定(TCPで必要な場合のみ)
     * @param timer keep-alive 送信間隔(秒)(0~1275)
     * @return 書き込み結果
     */
    public setKeepAliveTimer(timer: number) {
      return this.ethernet.numWrite(SOCKET_KEEP_ALIVE_TIMER, BSB_SOCKET_REGISTER(this.id), timer / 5);
    }

    /**
     * データを送信
     * @param data 送信データまたは文字列
     * @param noWait データ書き込み時、spi.writeWaitを使用しない
     * @internal
     * @hidden
     */
    protected async sendDataBase(data: number[] | string, noWait?: boolean) {
      const d = typeof data === "string" ? Array.from(new TextEncoder().encode(data)) : data;
      const txReadPointer = await this.getTXReadPointer();
      const result = await this.ethernet.bigWrite(txReadPointer, BSB_SOCKET_TX_BUFFER(this.id), d, noWait);
      await this.setTXWritePointer(txReadPointer + d.length);
      await this.sendCommand("Send");
      return result;
    }
  }

  export namespace Socket {
    /** プロトコル */
    export type Protocol = "TCPServer" | "TCPClient" | "UDP" | null;

    /** バッファサイズ */
    export type BufferSize = 0 | 1 | 2 | 4 | 8 | 16;

    /** ソケットの設定内容 */
    export interface Options {
      /** 使用プロトコル(TCPClient/TCPServer/UDP/null) */
      protocol: Protocol;
      /** マルチキャストの使用(UDPのみ)(Openコマンドの前で設定) */
      multicast?: boolean;
      /** ブロードキャストされたパケットを受信しない(UDPのみ) */
      broardcastBlock?: boolean;
      /** データを受信したときにACKをすぐに送信する(TCPのみ) */
      noDelayACK?: boolean;
      /** マルチキャストでIGMPv1を使う(UDPのみ) */
      multicastVer1?: boolean;
      /** ユニキャストされたパケットを受信しない(UDPのみ) */
      unicastBlock?: boolean;
      /** 使用ポート番号 */
      sourcePort?: number;
      /** 接続先IPv4アドレス */
      destIP?: string;
      /** 接続先ポート番号 */
      destPort?: number;
      /** 最大セグメントサイズ(TCPのみ)(0~65535) */
      maxSegmentSize?: number;
      /** IPサービスタイプ(1byte) */
      ipType?: number;
      /** TTL(0~65535) */
      ttl?: number;
      /** 受信バッファサイズ(KB) 2の累乗のみ、16まで */
      rxBufferSize?: BufferSize;
      /** 送信バッファサイズ(KB) 2の累乗のみ、16まで */
      txBufferSize?: BufferSize;
      /** IPヘッダーのフラグメント(0x0000~0xFFFF) */
      ipFragment?: number;
      /** keep-alive 送信間隔(秒)(TCPのみ)(0~1275) */
      keepAliveTimer?: number;
      /** 受信データを文字列(UTF-8)として扱う */
      stringMode?: boolean;

      /** 割り込み「SendOK」のイベントハンドラー */
      onSendOKtInterrupt?: (socket: Socket) => Promise<void>;
      /** 割り込み「Timeout」のイベントハンドラー */
      onTimeoutInterrupt?: (socket: Socket, extra?: number[] | string | W5500.DestInfo) => Promise<void>;
      /** 割り込み「ReceiveData」のイベントハンドラー */
      onReceiveDataInterrupt?: (socket: Socket) => Promise<void>;
      /** 割り込み「Disconnect」のイベントハンドラー */
      onDisconnectInterrupt?: (socket: Socket) => Promise<void>;
      /** 割り込み「ConnectSuccess」のイベントハンドラー */
      onConnectSuccessInterrupt?: (socket: Socket, extra?: number[] | string | W5500.DestInfo) => Promise<void>;
      /** 全ての割り込みのイベントハンドラー */
      onAllInterrupt?: (
        socket: Socket,
        name: Socket.Interrupt,
        extra?: number[] | string | W5500.DestInfo,
      ) => Promise<void>;
    }

    /** ソケットの使用可能コマンド */
    export type Command =
      | "Open"
      | "Listen"
      | "Connect"
      | "Disconnect"
      | "Close"
      | "Send"
      | "SendMAC"
      | "SendKeep"
      | "Receive";

    /** ソケットのコマンドに対応する値 */
    export const CommandCodes: { [key in Command]: number } = {
      Open: 0x01,
      Listen: 0x02,
      Connect: 0x04,
      Disconnect: 0x08,
      Close: 0x10,
      Send: 0x20,
      SendMAC: 0x21,
      SendKeep: 0x22,
      Receive: 0x40,
    } as const;

    /** ソケットのステータス */
    export type Status =
      | "Closed"
      | "Init"
      | "Listen"
      | "SynSent"
      | "SynReceive"
      | "Established"
      | "FinWait"
      | "Closing"
      | "TimeWait"
      | "CloseWait"
      | "LastACK"
      | "UDP"
      | "MACRAW";

    /** ソケットのステータスに対応する値 */
    export const StatusCodes: { [key in Status]: number } = {
      Closed: 0x00,
      Init: 0x13,
      Listen: 0x14,
      SynSent: 0x15, // 一時的
      SynReceive: 0x16, // 一時的
      Established: 0x17,
      FinWait: 0x18, // 一時的
      Closing: 0x1a, // 一時的
      TimeWait: 0x1b, // 一時的
      CloseWait: 0x1c,
      LastACK: 0x1d,
      UDP: 0x22,
      MACRAW: 0x32,
    } as const;

    /** ソケットの割り込み */
    export type Interrupt = "SendOK" | "Timeout" | "ReceiveData" | "Disconnect" | "ConnectSuccess";

    /** ソケットの割り込みに対応するフラグ */
    export const InterruptFlags: { [key in Interrupt]: number } = {
      SendOK: 0b10000,
      Timeout: 0b01000,
      ReceiveData: 0b00100,
      Disconnect: 0b00010,
      ConnectSuccess: 0b00001,
    } as const;
  }
}

export default W5500;
