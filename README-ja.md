<div align="center">
  <h1>⚡ obniz.js</h1>
  <p><strong>IoTハードウェア制御のための TypeScript SDK</strong></p>
  <p>わずか数行の TypeScript で、Node.js からリアルワールドのハードウェアを制御</p>

  <p>
    <a href="https://www.npmjs.com/package/obniz"><img src="https://img.shields.io/npm/v/obniz.svg?style=flat-square&logo=npm" alt="npm version"></a>
    <a href="https://www.npmjs.com/package/obniz"><img src="https://img.shields.io/npm/dm/obniz.svg?style=flat-square&logo=npm" alt="npm downloads"></a>
    <a href="https://github.com/obniz/obniz/actions/workflows/node.js.yml"><img src="https://img.shields.io/github/actions/workflow/status/obniz/obniz/node.js.yml?style=flat-square&logo=github" alt="Build Status"></a>
    <a href="https://github.com/obniz/obniz/blob/master/LICENSE.txt"><img src="https://img.shields.io/npm/l/obniz.svg?style=flat-square" alt="License"></a>
    <a href="https://github.com/obniz/obniz"><img src="https://img.shields.io/github/stars/obniz/obniz?style=flat-square&logo=github" alt="GitHub Stars"></a>
  </p>

  <p>
    <a href="./README.md">English</a> •
    <a href="https://docs.obniz.io/ja/guides/">ドキュメント</a> •
    <a href="https://obniz.github.io/obniz/obnizjs/index.html">APIリファレンス</a> •
    <a href="./examples">サンプル</a> •
    <a href="https://obniz.com/ja/">ウェブサイト</a>
  </p>
</div>

---

## ✨ 特徴

- 🚀 **TypeScript ファースト** — TypeScript で構築され、完全な型定義を含む
- 🔌 **ハードウェア抽象化** — GPIO、PWM、I2C、SPI、UART などを制御
- 📦 **パーツライブラリ** — 100以上の事前構築コンポーネント（センサー、モーター、ディスプレイ）
- 🖥️ **サーバーサイド** — Node.js バックエンドアプリケーションに最適
- ☁️ **クラウド接続** — WebSocket 経由でデバイスをリモート制御
- ⚡ **リアルタイム** — インターネット経由の低遅延ハードウェア制御

## 🚀 クイックスタート

### インストール

```bash
npm install obniz
```

### Hello World

わずか数行の TypeScript でハードウェアを制御：

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  // メッセージを表示
  obniz.display.print("Hello, World!");
  
  // LED を制御
  const led = obniz.wired("LED", { anode: 0, cathode: 1 });
  led.blink();
};
```

### 実行

```bash
npx ts-node index.ts
```

## 📖 使用例

<details>
<summary><b>🔌 基本的なハードウェア制御</b></summary>

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  // メッセージを表示
  obniz.display.print("hello!");
  
  // スイッチイベント処理
  obniz.switch.onchange = (state: string): void => {
    console.log(`スイッチ状態: ${state}`);
  };

  // サーボモーター制御
  const servo = obniz.wired("ServoMotor", { gnd: 0, vcc: 1, signal: 2 });
  servo.angle(90);
  
  // UART 通信
  const uart = obniz.getFreeUart();
  uart.start({ tx: 5, rx: 6, baud: 9600 });
  uart.send("Hello from TypeScript!");

  // GPIO 制御
  obniz.io7.drive("5v");
  obniz.io7.output(true);
  obniz.io8.pull("3v");
  obniz.io8.drive("open-drain");
  obniz.io8.output(false);
};
```

</details>

<details>
<summary><b>🎚️ サーボモーター制御</b></summary>

```typescript
import Obniz from 'obniz';
import * as readline from 'readline';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  const servo = obniz.wired("ServoMotor", { gnd: 0, vcc: 1, signal: 2 });
  
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  rl.on('line', (input: string): void => {
    const angle = parseInt(input, 10);
    if (angle >= 0 && angle <= 180) {
      servo.angle(angle);
      console.log(`サーボ角度を設定: ${angle}`);
    }
  });

  console.log('角度を入力してください (0-180):');
};
```

</details>

<details>
<summary><b>☁️ クラウドサービス連携</b></summary>

```typescript
import Obniz from 'obniz';
import { Dropbox } from 'dropbox';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  const dbx = new Dropbox({ accessToken: '<YOUR ACCESS TOKEN>' });
  const button = obniz.wired("Button", { signal: 0, gnd: 1 });
  
  button.onchange = async (pressed: boolean): Promise<void> => {
    if (pressed) {
      await dbx.filesUpload({
        path: '/obniz.txt', 
        contents: `[ボタンが押されました]\n${new Date().toISOString()}`, 
        mode: { '.tag': 'overwrite' }
      });
      console.log('Dropbox にデータをアップロードしました');
    }
  };
};
```

</details>

<details>
<summary><b>🔗 マルチデバイス制御</b></summary>

```typescript
import { App, AppInstanceType, Worker } from 'obniz-app-sdk'
import Obniz from 'obniz';

class MyWorker extends Worker {

  async onObnizConnect(obniz){
    console.log(`obniz ${obniz.id} が接続されました`);
    await obniz.ble!.initWait();
  }

  async onObnizLoop(obniz){
    if (!obniz.ble!.isInitialized) return;
    const peripherals = await obniz.ble.scan.startAllWait(null, {
      duration : 20
    });
    console.log(`obniz ${obniz.id} によって検出された BLE デバイス数=${peripherals.length}`)
  }

}

const app = new App({
  appToken: process.env.APPTOKEN,
  workerClass: MyWorker,
  instanceType: AppInstanceType.Master,
  obnizClass: Obniz
})

app.start();
```

</details>

<details>
<summary><b>🌡️ 温度監視</b></summary>

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  const tempSensor = obniz.wired("LM35DZ", { gnd: 0, output: 1, vcc: 2 });
  
  setInterval(async (): Promise<void> => {
    const temp = await tempSensor.getWait();
    console.log(`温度: ${temp.toFixed(1)}°C`);
    obniz.display.clear();
    obniz.display.print(`${temp.toFixed(1)} C`);
  }, 1000);
};
```

</details>

<details>
<summary><b>📡 Express.js API サーバー</b></summary>

```typescript
import Obniz from 'obniz';
import express, { Request, Response } from 'express';

const app = express();
const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

let led: ReturnType<typeof obniz.wired<"LED">> | null = null;

obniz.onconnect = async (): Promise<void> => {
  led = obniz.wired("LED", { anode: 0, cathode: 1 });
  console.log('obniz が接続されました');
};

app.get('/led/on', (req: Request, res: Response): void => {
  if (led) {
    led.on();
    res.json({ status: 'LED がオンになりました' });
  } else {
    res.status(503).json({ error: 'デバイスが接続されていません' });
  }
});

app.get('/led/off', (req: Request, res: Response): void => {
  if (led) {
    led.off();
    res.json({ status: 'LED がオフになりました' });
  } else {
    res.status(503).json({ error: 'デバイスが接続されていません' });
  }
});

app.listen(3000, (): void => {
  console.log('サーバーが起動しました: http://localhost:3000');
});
```

</details>

## 🔧 コア機能

### 接続ライフサイクル

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  // 接続成功時に呼ばれる
  obniz.display.print("接続しました!");
};

obniz.onloop = async (): Promise<void> => {
  // 接続中に継続的に呼ばれる
};

obniz.onclose = async (): Promise<void> => {
  // 接続が切断された時に呼ばれる
  console.log('接続が切断されました');
};
```

### GPIO と周辺機器

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000", { access_token: "token_xxxxxxxxxxxxxxxx" });

obniz.onconnect = async (): Promise<void> => {
  // デジタル I/O
  obniz.io0.drive("5v");
  obniz.io0.output(true);
  
  // アナログ入力
  obniz.ad3.start((voltage: number): void => {
    console.log(`電圧: ${voltage}V`);
  });

  // PWM
  const pwm = obniz.getFreePwm();
  pwm.start({ io: 4 });
  pwm.freq(1000);
  pwm.duty(50);

  // UART
  const uart = obniz.getFreeUart();
  uart.start({ tx: 5, rx: 6, baud: 9600 });
  uart.send("Hello");
};
```

## 🧩 パーツライブラリ

100以上の事前構築コンポーネントがすぐに使えます。[ライブラリ全体を見る →](https://obniz.com/sdk/parts/)

| カテゴリ | 例 |
|----------|----------|
| 💡 **LED とディスプレイ** | LED、OLED、LCD、7セグメント |
| 🔊 **センサー** | 温度、湿度、距離、モーション |
| ⚙️ **モーター** | サーボ、DC モーター、ステッピング |
| 📡 **通信** | Bluetooth、GPS、RFID |

**例: 距離センサー (HC-SR04)**

```typescript
import Obniz from 'obniz';

const obniz = new Obniz("0000-0000");

obniz.onconnect = async (): Promise<void> => {
  const hcsr04 = obniz.wired("HC-SR04", { gnd: 0, echo: 1, trigger: 2, vcc: 3 });
  hcsr04.unit("inch");
  
  hcsr04.measure((distance: number): void => {
    console.log(`距離: ${distance} インチ`);
  });
};
```

## 📚 ドキュメント

| リソース | 説明 |
|----------|-------------|
| [📖 ガイド](https://docs.obniz.io/ja/guides/) | ステップバイステップのチュートリアル |
| [📘 APIリファレンス](https://obniz.github.io/obniz/obnizjs/index.html) | 完全なクラスドキュメント |
| [🔌 パーツライブラリ](https://obniz.com/sdk/parts/) | コンポーネントドキュメント |
| [💻 サンプル](./examples) | サンプルプロジェクト |

## 🛠️ 必要環境

- **Node.js**: 10.23.0 以上
- **TypeScript**: 4.0 以上（推奨）

## 🤝 コントリビューション

コントリビューションを歓迎します！詳細については[コントリビューションガイド](./devtools/docs/README.md)をご覧ください。

1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/amazing-feature`)
3. 変更をコミット (`git commit -m 'Add amazing feature'`)
4. ブランチにプッシュ (`git push origin feature/amazing-feature`)
5. プルリクエストを開く

## 📄 ライセンス

このプロジェクトは MIT ライセンスの下でライセンスされています - 詳細については [LICENSE.txt](./LICENSE.txt) ファイルを参照してください。

## 🔗 リンク

- [obniz ウェブサイト](https://obniz.com/ja/)
- [obniz デバイス](https://iot.obniz.com/product-comparison)

---

<div align="center">
  <p><a href="https://obniz.com/">obniz</a> チームが ❤️ を込めて作成</p>
  <p>
    <a href="https://twitter.com/obniz_jp">Twitter</a> •
    <a href="https://github.com/obniz">GitHub</a>
  </p>
</div>
