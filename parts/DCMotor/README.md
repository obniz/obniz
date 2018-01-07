# DCMotor
タミヤモーターやマブチモーターのような、<br>電池を繋いで回すような一般的なモーターです。プラスとマイナスはありませんが逆にすると逆に回転します。

## 接続
モーターから出ている２本の線をObnizにつなぎます。どちらをどこにつないでもOKですが、プログラムで「前」と書いて後ろに動いたらあとで配線を逆にすると良いです。モーターをObnizの1と2番に繋いだ場合は以下のようにします
```
var motor = Parts("DCMotor");
motor.wired(obniz, 1, 2);
```
## forward();
モーターを回転させます。

### Example
```
var motor = Parts("DCMotor");
motor.wired(obniz, 1, 2);

motor.forward();
```
## reverse();
モーターを逆に回転させます。
### Example
```
var motor = Parts("DCMotor");
motor.wired(obniz, 1, 2);

motor.reverse();
```
## stop();
モーターを停止させます。
### Example
```
var motor = Parts("DCMotor");
motor.wired(obniz, 1, 2);

motor.forward();
setTimeout(function(){
  motor.stop();
}, 1000);
```
## move(boolean)
directionに合わせて指定した方向にモーターを回転させます。rotateとreverseを引数を変えるだけでこの関数１つで扱えます。trueであれば正転。falseであれば逆に回転します。
### Example
```var motor = Parts("DCMotor");
motor.wired(obniz, 1, 2);

motor.move(true); // = motor.forward();
```
## power(float)
モーターのパワーを変更します。0~100で指定することが出来ます。
### Example
```Javascript
var motor = Parts("DCMotor");
motor.wired(obniz, 1, 2);

motor.power(3);
motor.move(true);
```