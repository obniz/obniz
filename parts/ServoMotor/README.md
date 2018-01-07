# ServoMotor
ラジコン用に使われている角度を指定して動かすモーターです。グルグル回るわけでなく、指定した角度をキープするように動きます。

## 接続方法
３本の足をObnizにつなぎます。それぞれプラス、信号、マイナスとなっていて、モーターの種類により配置が違います。マイナス、プラス、信号、をそれぞれ Obnizの1, 2, 3につないだ場合は以下のようにします。
```Javascript
var servo = Parts("ServoMotor");
servo.wired(obniz, 1, 2, 3);
```
## angle(float)
角度を0~180により指定します。
### Example
```Javascript
var servo = Parts("ServoMotor");
servo.wired(obniz, 1, 2, 3);

servo.angle(90.0); // half position
```
## on();
サーボモーターの電源を入れます。wiredを呼んだ段階で電源は入っています。offにした後に再度onにしたい時に呼んでください
### Example
```Javascript
var servo = Parts("ServoMotor");
servo.wired(obniz, 1, 2, 3);

servo.position(50.0); // half position
servo.off();
servo.on();
```
## off();
サーボモーターの電源を切ります。信号の供給も停止します。保持力がなくなりますから、モーターに負荷がかかっている場合はoffにすることで勝手に回転します。
### Example
```Javascript
var servo = Parts("ServoMotor");
servo.wired(obniz, 1, 2, 3);

servo.position(50.0); // half position
servo.off();
servo.on();
```