# Examples

obniz SDKのサンプル集。

これまで [docs.obniz.com](https://docs.obniz.com/ja/reference/common/) のリファレンス内に分散していたサンプルを、リポジトリ内で動く形に整理しています。

## Quick Reference

| 用途 | 場所 |
|------|------|
| ブラウザから obniz を触る | [`html/`](./html) |
| サーバ (Node.js / TypeScript) から obniz を触る | [`nodejs/peripherals/`](./nodejs/peripherals) |
| obniz の上で動くLuaプラグイン | [`nodejs/plugin/`](./nodejs/plugin) |
| ハードウェア固有 (iekilo1, iemicro1 など) | [`nodejs/hardwares/`](./nodejs/hardwares) |
| obnizクラウド・ホステッドアプリ | [`nodejs/app/`](./nodejs/app) |
| `setQueueMode` 等のシステム機能 | [`nodejs/system/`](./nodejs/system) |

## Node.js (TypeScript)

すべて TypeScript で書かれており、以下の環境変数を読みます:

| Env | Required | Note |
|-----|----------|------|
| `OBNIZ_ID` | ✅ | `0000-0000` 形式 |
| `OBNIZ_ACCESS_TOKEN` | optional | アクセストークンが発行されている場合のみ |

実行例:

```bash
export OBNIZ_ID=0000-0000
export OBNIZ_ACCESS_TOKEN=token_xxxxxxxx   # optional
npx ts-node examples/nodejs/peripherals/io/blink.ts
```

### Peripherals — ペリフェラル別サンプル

| Folder | Contents |
|--------|----------|
| [io](./nodejs/peripherals/io) | `output` / `input` / `blink` |
| [ad](./nodejs/peripherals/ad) | アナログ入力の streaming / one-shot |
| [pwm](./nodejs/peripherals/pwm) | LED フェード / サーボをPWMで直接駆動 |
| [i2c](./nodejs/peripherals/i2c) | マスタ書き込み・読み出し / バススキャン |
| [spi](./nodejs/peripherals/spi) | マスタ全二重転送 |
| [uart](./nodejs/peripherals/uart) | 送受信 (echo) |
| [display](./nodejs/peripherals/display) | テキスト / 図形 / QRコード |
| [switch](./nodejs/peripherals/switch) | onboard switchの状態監視 |
| [parts](./nodejs/peripherals/parts) | `obniz.wired(...)` で LED / Button / Servo / HC-SR04 / LM35DZ を駆動 |
| [ble](./nodejs/peripherals/ble) | BLE スキャン / アドバタイズ / MQTTブリッジ |

### その他

- [system](./nodejs/system) — boot reason, queue mode, タイムスタンプ
- [plugin](./nodejs/plugin) — obniz本体上で動くLuaプラグインをアップロード/操作する例
- [hardwares](./nodejs/hardwares) — iekilo1 / iemicro1 等のハードウェア固有サンプル
- [app](./nodejs/app) — ホステッドアプリAPIの利用例

## HTML

ブラウザから直接 obniz を操作するシンプルな単一ファイル例です。

| File | What it does |
|------|--------------|
| [01-hello-world.html](./html/01-hello-world.html) | テキスト入力をディスプレイに表示 |
| [02-led-button.html](./html/02-led-button.html) | 画面ボタンでLEDをON/OFF/Blink |
| [03-servo-slider.html](./html/03-servo-slider.html) | スライダーでサーボの角度を制御 |
| [04-onboard-switch.html](./html/04-onboard-switch.html) | onboard switchの状態をリアルタイム表示 |
| [05-temperature-monitor.html](./html/05-temperature-monitor.html) | LM35DZの値をグラフ表示 |

詳細は [`html/README.md`](./html/README.md) を参照。
