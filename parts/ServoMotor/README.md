# ServoMotor

How to use Servo Motor.

## 接続方法

Connect three feet to Obniz. They are gnd, vcc and signal, respectively, and the placement is different depending on the type of motor. 
If you connectgnd, vcc and signal to Obniz 0, 1, 2 respectively, do as follows.

```Javascript
var servo = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});
```
## angle(float)
Change the motor angle.
angle : 0 - 180 degree
### Example
```Javascript
var servo = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});

servo.angle(90.0); // half position
```

## on();
Turn on the power.
When you call wired function, it automatically turn on.

### Example
```Javascript
var servo = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});

servo.position(50.0); // half position
servo.off();
servo.on();
```

## off();
Turn off the power.
When you call wired function, it automatically turn on.

### Example
```Javascript
var servo = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});

servo.position(50.0); // half position
servo.off();
servo.on();
```