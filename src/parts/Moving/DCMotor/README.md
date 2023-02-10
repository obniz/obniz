# DCMotor

Common Brushed DC Motor which moves when connected to +/- and reverse when connected to other side.

⚠When connecting the DCMotor to the obnizBoard/obnizBoard1Y, do not connect the obnizBoard/obnizBoard1Y power supply to a PC or similar. The PC may be damaged by noise, etc.
For obnizBoard1Y, supply a stable power source from the power supply pin on the right side of pin 11.

![](image.jpg)

## wire({forward, back})

connect two wire to an obniz Board and set io number to forward,back.
If you connect to io 0 and 1, then write a program like a below.

![photo of DCMotor](wired.png)

```javascript
// Javascript Example
var motor = obniz.wired("DCMotor",  {forward:0, back:1});
motor.power(50);
motor.forward();

```
## forward()

start moving forward.


```javascript
// Javascript Example
var motor = obniz.wired("DCMotor", {forward:0, back:1});

motor.forward();
```
## reverse()

start moving to back.


```javascript
// Javascript Example
var motor = obniz.wired("DCMotor", {forward:0, back:1});

motor.reverse();
```

## stop()

stop a motor.


```javascript
// Javascript Example
var motor = obniz.wired("DCMotor", {forward:0, back:1});

motor.forward();
setTimeout(function(){
  motor.stop();
}, 1000);
```
## move(boolean)

move a motor regard provided value.


```javascript
// Javascript Example
var motor = obniz.wired("DCMotor", {forward:0, back:1});

motor.move(true); // = motor.forward();
```
## power(float)
set a motor power.

default is 30.

power must be within 0~100.

```javascript
// Javascript Example
var motor = obniz.wired("DCMotor", {forward:0, back:1});

motor.power(80);
motor.move(true);
```
