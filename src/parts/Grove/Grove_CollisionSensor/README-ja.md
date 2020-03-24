# Grove_Collision_Sensor

Groveコネクタで利用できる衝突センサーです。衝突を検知、揺れている間は衝突による振動をキャッチします。

![](//あとでここに画像貼る)

## wired(obniz,  { [signal , vcc, gnd, grove ]});


name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | no |  &nbsp; | GPIO端子(4 pin of Grove)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC端子(2 pin of Grove)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(1 pin of Grove)
grove | `object` | no | &nbsp;  | 接続するデバイスにgroveがある場合に利用できます


```Javascript
// Javascript Example        
    //衝突のたびに通知
        //ピン設定
        let sensor=obniz.wired("Grove_Collision_sensor",{grove: obniz.grove0});
        
        //衝突まで待つ
        var collided = await sensor.isCollidedWait();

        //衝突が検知された場合
        sensor.onchange = async function(collided){
          
          //コンソール画面に出力
          console.log("衝突を検知しました");
          console.log("");
        };
      }

```

## [await] isCollidedWait()

衝突が発生しているかを確認します。

```Javascript
// Javascript Example
var sensor = obniz.wired("Grove_Button", {grove: obniz.grove0});
var collided = await sensor.isCollidedWait();
console.log("Collided = " + colided);
```


## onchange = function(collided){}

衝突が発生したら、callback関数を呼び出し、その中に書いてあるプログラムの動作をします。

```Javascript
// Javascript Example
        //ピン設定
        let sensor=obniz.wired("Grove_Collision_sensor",{grove: obniz.grove0});

        var collided = await sensor.isCollidedWait();

        sensor.onchange = function(collided){
        console.log("衝突を検知しました")
        console.log("");
           };

```

