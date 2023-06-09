# DR MARK
株式会社マーク電子製の点滴監視ツールです

自然滴下の医薬品注入に対する流量の測定、監視、記録を行えます。

流量異常や点滴の完了を通知できます。

![](./image.jpg)

## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、DR MARK かどうかを判定します

```javascript
// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
  
  }
};
await obniz.ble.scan.startWait();

```

## new DR_MARK(peripheral)

BLEで受信したアドバタイズ情報をもとに、インスタンスを作成します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
  }
};
await obniz.ble.scan.startWait();

```

## [await]connectWait()

デバイスに接続します。


```javascript
// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    device.ondisconnect = (reason) => {
      console.log(reason)
    }
    await device.connectWait();
    console.log("connected");
  }
};
await obniz.ble.scan.startWait();


```

## [await]disconnectWait()

センサから切断します

```javascript
// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};
await obniz.ble.scan.startWait();


```

## [await]getActionModeWait()

動作モード取得します。

- stop:停止中
- adjust: 設定中
- monitor: 計測中
- suspend: 一時停止
- finish: 点滴終了

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const mode = await device.getActionModeWait();
    console.log(mode);
  }
};
await obniz.ble.scan.startWait();

```

## [await]setActionModeWait()

動作モードを設定します。

- stop:停止中
- adjust: 設定中
- start:計測開始
- monitor: 計測中
- pause: 一時停止

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const humid = await device.setActionModeWait("start");
    console.log(humid);
  }
};
await obniz.ble.scan.startWait();

```

## [await]setConditionSettingWait(infusionDropCount: number, targetSumFlowRate: number, targetFlowRate: number, correctionFactor: number)

計測条件を設定します。

- infusionDropCount 輸液セットタイプ default 20滴
- targetSumFlowRate 設定量 (ml) default 500ml
- targetFlowRate 目標流量(ml/h) default 250ml/h
- correctionFactor 流量を補正する(-20% ～ 20%) default 0%

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.setConditionSettingWait(20,500,250,0);
  }
};
await obniz.ble.scan.startWait();

```

## [await]getConditionSettingWait()

計測条件を取得します。

データは`getConditionSettingWait`と同等です。

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const conditionSettingData = await device.getConditionSettingWait();
    console.log(conditionSettingData);
  }
};
await obniz.ble.scan.startWait();

```

## [await]setBaseSettingWait(effectiveInstantFlowRate: number, finishJudgmentSec: number, effectiveIntegratedFlowRate: number, powerOffSec: number)

基本的な設定を行います。

- effectiveInstantFlowRate 有効瞬時流量(%) 瞬時流量判定に使用 目標流量に対する瞬時流量の差分 default 30%
- finishJudgmentSec 輸液終了判定時間(秒後) 輸液終了判定（センサ信号無応答時間） default 60秒後
- effectiveIntegratedFlowRate 有効積算流量(%) 総積算流量を判定する ※計測中の流量異常判定無効区間を算出 default 10%
- powerOffSec 自動電源断時間(秒後) default 60秒後

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.setBaseSettingWait(30,60,10,60);
  }
};
await obniz.ble.scan.startWait();

```

## [await]getBaseSettingWait()

基本的設定を取得します。

データは`getBaseSettingWait`と同等です。

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const baseSettingData = await device.getBaseSettingWait();
    console.log(baseSettingData);
  }
};
await obniz.ble.scan.startWait();

```

## [await]setLedSettingWait(bright: boolean)

LEDの明るさ設定を行います。

true時に明るくになります。

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.setLedSettingWait(true);
  }
};
await obniz.ble.scan.startWait();

```

## データの取得方法について

計測実行中には定期的にBLEのアドバタイズがあります。

取得できる情報は同じですが、複数の読み取り方法があります。

- 1件のみ取得
- 複数件取得
- コールバック

取得できる情報は次の通りです。

```typescript
{
  sequenceNumber: number; // シーケンス番号(1~0xFFFFFFFF)
  pulse: number; // 0.1ms 単位の周期データ(24bits)
  status: number; // 測定中のステータスデータ（8bits）
  error: {
    outRange: boolean; // 移動平均前のパルス周期が 288ms 以下
    changeSetting: boolean; // 中断モードで計測条件設定値を変更した
    overSumFlow: boolean; // 積算流量が設定量を超えている
    lowInstantFlow: boolean; // 流量が規定値より低い
    highInstantFlow: boolean; // 流量が規定値より高い
    shutdownBattery: boolean; // バッテリレベルが電源断レベルを下回った
    lowBattery: boolean; // バッテリレベルが低い
    isError: boolean; // エラーが発生しているかどうか
  };
  instantFlowRate: number; // 瞬時流量（ml / h）
  sumFlowRate: number; // 積算流量（ml）
  averageFlowRate: number; // 平均流量（ml / h）
  batteryVoltage: number; // 電圧値（mV）
}
```

## [await]getPulseDataWait(timeoutMs?: number)

一件のみ取得します。

タイムアウトを設定をしない場合5秒でタイムアウトが発生します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const pulseData = await device.getPulseDataWait();
    console.log(pulseData)
  }
};
await obniz.ble.scan.startWait();

```

## [await]startPulseDataWait()

複数件取得を開始します。

```stopPulseDataWait```を実行するまで取得し続けます。

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.startPulseDataWait();
    await obniz.wait(10000);
    const pulseDatas = await device.stopPulseDataWait();
    console.log(pulseDatas)
    
  }
};
await obniz.ble.scan.startWait();

```

## [await]stopPulseDataWait()

複数件取得の終了をします。

```startPulseDataWait```からこの関数までの期間のPulseデータを配列で返却します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.startPulseDataWait();
    await obniz.wait(10000);
    const pulseDatas = await device.stopPulseDataWait();
    console.log(pulseDatas)
    
  }
};
await obniz.ble.scan.startWait();

```

## [await]requestPulseDataWait(enable: boolean)

Pulseデータを定期的に配信するか設定します

trueを設定すると定期的に配信します。

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    device.onpulse = (pulseData) => {
      console.log(pulseData);
    };
    await device.connectWait();
    console.log("connected");
    await device.requestPulseDataWait(true);
    await obniz.wait(10000);
    await device.requestPulseDataWait(false);
  }
};
await obniz.ble.scan.startWait();

```

## [await]eraseFlashRomWait()

FlashROMを削除する

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const mode = await device.eraseFlashRomWait()
  }
};
await obniz.ble.scan.startWait();
```

## [await]getFlashRomInfoWait(timeOffsetMinute:時差を入れる)

FlashROMに保存されているデータ数を確認できる
最新の計測日時と最古の計測日時を確認できる

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const info = await device.getFlashRomInfoWait(0)
    console.log(info)
  }
};
await obniz.ble.scan.startWait();
```

## [await]getFlashRomSearchWait(startDate:検索開始日,endDate:検索終了日,timeOffsetMinute:時差を入れる)

FlashROMに保存されているデータ数を確認できる
指定時間にある計測履歴のIndexや個数を確認できます

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const info = await device.getFlashRomInfoWait(0)
    console.log(info)
    if(info.total != 0){
      const result = await device.getFlashRomSearchWait(info.endDate,info.endDate,0)
      console.log(result)
    }
  }
};
await obniz.ble.scan.startWait();
```


## [await]getFlashRomHistoryDataWait(index: number,timeOffsetMinute: number)

FlashROMに保存されている計測履歴を取得します。
終了モードの時にindexを0xFFFFでリクエストすると最新の結果を取得します。
それ以外の場合は、```getFlashRomSearchWait```で取得したIndexを元に取得できます。

```javascript

// Javascript Example
await obniz.ble.initWait();
const DR_MARK = Obniz.getPartsClass("DR_MARK");
obniz.ble.scan.onfind = async (peripheral) => {
  if (DR_MARK.isDevice(peripheral)) {
    console.log("find");
    const device = new DR_MARK(peripheral);
    await device.connectWait();
    console.log("connected");
    const mode = await device.getActionModeWait()
    if(mode === "finish"){
      const history = await device.getFlashRomSearchWait(0xffff,0);
      console.log(history)
    }
  }
};
await obniz.ble.scan.startWait();
```