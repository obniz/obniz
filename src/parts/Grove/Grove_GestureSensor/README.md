# Grove_GestureSensor

Library for  [Grove \- Gesture V1\.0](https://wiki.seeedstudio.com/Grove-Gesture_v1.0/)

![](image.jpg)

## wired(scl, sda {, vcc, gnd, grove})

Connect pins to an obniz Board.

| grove | cable | obniz |
|:--:|:--:|:--:|
| scl | - | scl |
| sda | - | sda |
| vcc | - | vcc |
| gnd | - | gnd |


```javascript
// Javascript Example
var gestureSensor = obniz.wired("Grove_GestureSensor", { gnd:0 , vcc:1 , sda:2 , scl:3 });
```
  
If the device has a grove interface, it can be connected with just the parameter {grove: obniz.grove0}.

```javascript
// Javascript Example
var gestureSensor = obniz.wired("Grove_GestureSensor", { grove: obniz.grove0 });
```

## onchange = function(value)

ジェスチャーの変化を文字列で受け取ります。

It called when the sensor of gesture changed.

```javascript
var gestureSensor = obniz.wired("Grove_GestureSensor", { gnd:0 , vcc:1 , sda:2 , scl:3 });
gestureSensor.onchange = function(state){
  if (state == gestureSensor.GESTURE_RIGHT) {
    console.log("GESTURE_RIGHT");
  } else if (state == gestureSensor.GESTURE_LEFT) {
    console.log("GESTURE_LEFT");
  } else if (state == gestureSensor.GESTURE_UP) {
    console.log("GESTURE_UP");
  } else if (state == gestureSensor.GESTURE_DOWN) {
    console.log("GESTURE_DOWN");
  } else if (state == gestureSensor.GESTURE_FORWARD) {
    console.log("GESTURE_FORWARD");
  } else if (state == gestureSensor.GESTURE_BACKWARD) {
    console.log("GESTURE_BACKWARD");
  } else if (state == gestureSensor.GESTURE_CLOCKWISE) {
    console.log("GESTURE_CLOCKWISE");
  } else if (state == gestureSensor.GESTURE_COUNT_CLOCKWISE) {
    console.log("GESTURE_COUNT_CLOCKWISE");
  } 
}
```

## About gesture values

This face of sensor can get the gesture value. A small black lens in the center recognizes the gesture.

![](image2.jpg)

The detail of information about gestures refers to [this video](https://www.youtube.com/watch?v=e3nf-b4W6TY).