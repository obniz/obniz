# toio コア キューブ
toio コア キューブとは、株式会社ソニー・インタラクティブエンタテインメント製の
32 mm幅のシンプルなロボットです。

(本パーツライブラリは下記リンクで公開されているtoioの技術仕様を元にした非公式な実装です。)

https://toio.github.io/toio-spec/

# License
See [LICENSE.txt](LICENSE.txt).


![](./image.jpg)

## isDevice(peripheral)

BLEで受信したアドバタイズ情報をもとに、toio コアキューブかどうかを判定します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const Toio_CoreCube = Obniz.getPartsClass("toio_CoreCube");
obniz.ble.scan.onfind = async (peripheral) => {
  if (Toio_CoreCube.isDevice(peripheral)) {
    console.log("find");
  }
};
await obniz.ble.scan.startWait();

```

## new Toio_CoreCube(peripheral)

BLEで受信したアドバタイズ情報をもとに、インスタンスを作成します。

```javascript
// Javascript Example

await obniz.ble.initWait();
const Toio_CoreCube = Obniz.getPartsClass("toio_CoreCube");
obniz.ble.scan.onfind = async (peripheral) => {
  if (Toio_CoreCube.isDevice(peripheral)) {
    console.log("find");
    const device = new Toio_CoreCube(peripheral);
  }
};
await obniz.ble.scan.startWait();

```


## [await]connectWait()
デバイスに接続します。


```javascript
// Javascript Example

await obniz.ble.initWait();
const Toio_CoreCube = Obniz.getPartsClass("toio_CoreCube");
obniz.ble.scan.onfind = async (peripheral) => {
  if (Toio_CoreCube.isDevice(peripheral)) {
    console.log("find");
    const device = new Toio_CoreCube(peripheral);
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
センサから切断します。

```javascript
// Javascript Example
await obniz.ble.initWait();
const Toio_CoreCube = Obniz.getPartsClass("toio_CoreCube");
obniz.ble.scan.onfind = async (peripheral) => {
  if (Toio_CoreCube.isDevice(peripheral)) {
    console.log("find");
    const device = new Toio_CoreCube(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.disconnectWait();
    console.log("disconnected");
  }
};
await obniz.ble.scan.startWait();

```




## [await]getPositionWait
toio コア キューブが存在している絶対位置(toio ID)を取得します。

詳細は[toio コア キューブ仕様のPosition ID](https://toio.github.io/toio-spec/docs/ble_id)を参照してください。


```javascript
// Javascript Example
await obniz.ble.initWait();
const Toio_CoreCube = Obniz.getPartsClass("toio_CoreCube");
obniz.ble.scan.onfind = async (peripheral) => {
  if (Toio_CoreCube.isDevice(peripheral)) {
    console.log("find");
    const device = new Toio_CoreCube(peripheral);
    await device.connectWait();
    console.log("connected");
    const data = await device.getPositionWait();
    console.log(data);
  }
};
await obniz.ble.scan.startWait();

```

出力形式は次のとおりです。

```

{
  posX : 709, // キューブの中心のX座標値
  posY : 383,  // キューブの中心のY座標値
  angle : 306,// キューブの角度
  posSensorX : 700, // 読み取りセンサーの X 座標値
  posSensorY : 386, // 読み取りセンサーの Y 座標値
  posSensorAngle : 306,//読み取りセンサーの角度	
}
```


## [await]getMotionWait
toio コア キューブが6軸検出システムによって検出した状態情報を取得します。

詳細は[toio コア キューブ仕様の読み出し操作](https://toio.github.io/toio-spec/docs/ble_sensor#%E8%AA%AD%E3%81%BF%E5%87%BA%E3%81%97%E6%93%8D%E4%BD%9C
)を参照してください。

```javascript
// Javascript Example
await obniz.ble.initWait();
const Toio_CoreCube = Obniz.getPartsClass("toio_CoreCube");
obniz.ble.scan.onfind = async (peripheral) => {
  if (Toio_CoreCube.isDevice(peripheral)) {
    console.log("find");
    const device = new Toio_CoreCube(peripheral);
    await device.connectWait();
    console.log("connected");
    const data = await device.getMotionWait();
    console.log(data);
  }
};
await obniz.ble.scan.startWait();

```

出力形式は次のとおりです。

atitudeは[toio コア キューブ仕様の姿勢検出](https://toio.github.io/toio-spec/docs/ble_sensor#%E5%A7%BF%E5%8B%A2%E6%A4%9C%E5%87%BA)を参照してください。

```

{
  isHorizon : false, // 水平検出(true:水平/false:水平ではない)
  isCollision : false,  // 衝突検出(true:衝突/false:衝突なし)
  isDoubletap : false,// ダブルタップ検出(true:ダブルタップされた/false:ダブルタップなし)
  atitude : 3, // 上述リンク参照
}
```


## [await]getBatteryStateWait
toio コア キューブのバッテリー値を取得します。

バッテリー残量は10刻みで取得されます。


```javascript
// Javascript Example
await obniz.ble.initWait();
const Toio_CoreCube = Obniz.getPartsClass("toio_CoreCube");
obniz.ble.scan.onfind = async (peripheral) => {
  if (Toio_CoreCube.isDevice(peripheral)) {
    console.log("find");
    const device = new Toio_CoreCube(peripheral);
    await device.connectWait();
    console.log("connected");
    const batteryEquip = await device.getBatteryStateWait();
    console.log(batteryEquip);//0~100[%]
  }
};
await obniz.ble.scan.startWait();

```

## [await]getButtonStateWait
toio コア キューブのボタン押下の有無を取得します。


```javascript
// Javascript Example
await obniz.ble.initWait();
const Toio_CoreCube = Obniz.getPartsClass("toio_CoreCube");
obniz.ble.scan.onfind = async (peripheral) => {
  if (Toio_CoreCube.isDevice(peripheral)) {
    console.log("find");
    const device = new Toio_CoreCube(peripheral);
    await device.connectWait();
    console.log("connected");
    const isButtonPush = await device.getButtonStateWait();
    console.log(isButtonPush);//true:押下された/false:押下されてない
  }
};
await obniz.ble.scan.startWait();

```

## [await]moveAround(_leftWheelPower,_rightWheelPower)
toio コア キューブのモータをPosition IDと無関係に動かします。

引数の左から順に、タイヤ(左)、タイヤ(右)の出力となっており、それぞれ-255～255
までの値を受け付けます。

（正の値が入ると前方へ、負の値が入ると後方へまわります。
また、0が入るか引数に値が渡されなければ該当のタイヤが静止します。)

```javascript
// Javascript Example
await obniz.ble.initWait();
const Toio_CoreCube = Obniz.getPartsClass("toio_CoreCube");
obniz.ble.scan.onfind = async (peripheral) => {
  if (Toio_CoreCube.isDevice(peripheral)) {
    console.log("find");
    const device = new Toio_CoreCube(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.moveAroundWait(100, 255);
  }
};
await obniz.ble.scan.startWait();

```

## [await]movePositionWait(timeoutSec,moveType, maxWheelPower, wheelPowerType,targetPosX, targetPosY, targetAngle)
toio コア キューブを指定したPosition IDに向かわせます。
引数と挙動は[toio コア キューブ仕様の目標指定付きモーター制御](https://toio.github.io/toio-spec/docs/ble_motor#%E7%9B%AE%E6%A8%99%E6%8C%87%E5%AE%9A%E4%BB%98%E3%81%8D%E3%83%A2%E3%83%BC%E3%82%BF%E3%83%BC%E5%88%B6%E5%BE%A1
)と対応しています。

引数の形式は次のとおりです。

```

{
  timeoutSec:5, //タイムアウト時間
  moveType:0, //移動タイプ
  maxWheelPower:80, //モーターの最大速度指示値
  wheelPowerType:0, //モーターの速度変化タイプ
  targetPosX:700, //目標地点のX座標値(toio ID)
  targetPosY:386, //目標地点のY座標値(toio ID)
  targetAngle:90, //目標地点でのキューブの角度Θ[度]
}
```


```javascript
// Javascript Example
await obniz.ble.initWait();
const Toio_CoreCube = Obniz.getPartsClass("toio_CoreCube");
obniz.ble.scan.onfind = async (peripheral) => {
  if (Toio_CoreCube.isDevice(peripheral)) {
    console.log("find");
    const device = new Toio_CoreCube(peripheral);
    await device.connectWait();
    console.log("connected");
    await device.movePositionWait(5, 0, 80, 0, 700, 386, 90);
  }
};
await obniz.ble.scan.startWait();

```

"toio"は、株式会社ソニー・インタラクティブエンタテインメントの登録商標または商標です。
