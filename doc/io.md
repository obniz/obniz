# Peripherals IO
General purpose IO
This is available on each io (io0 to io11)

#### Feature
##### output
Each IO can put out digital values.

Drive methods can be selected from the three below.

Type | Voltage | max A | max Freq | Details
:---: | :---: | :---: | :---: | ---
push-pull | `5v` | <=1A | <=250khz(recommend) | Default. Overcurrent protection
push-pull | `3v` | <=1mA(recommend) | <=80Mhz | over current detection when using io.output().
open-drain | `<=5v` | <=1mA(recommend) | <=80Mhz | 

Each method can be configured independently for each IO.
Not only for io.output(), but also for UART and SPI you can choose your preferred drive method.

##### input

There is only one input method.

3v input with 5v tolerant, so the threshold value is CMOS level.


Type | Level | max Freq | Detail
:---: | :---: | :---: | :---:
digital-in | `3v(5v tolerant)` | <=80Mhz |  

##### internal weak pull-up/pull-dow

Pull up and down can be configured independently for each IO.

There are four types as below.

Type | Pull to | Detail
:---: | :---: | :---:
floating | &nbsp; | Default
pull-up | `5v` | 
pull-up | `3v` | 
pull-down | `gnd` | 


## output(value)
Make ioX to output mode and put out 1 or 0.

```Javascript
// Javascript Example
obniz.io1.output(true); // io1 is 5v
obniz.io2.output(1); //  io2 is 5v
obniz.io3.drive("3v");
obniz.io3.output(1); // io3 is around 3v.
```

## drive(type)
This allows you to change output drive method.
By default, it is set as push-pull 5v with motor driver(up to 1A).

1. "5v"
  - Push-pull 5v mode. Up to 1A available
2. "3v"
  - Push-pull 3v mode. Up to around 1mA. Its voltage will reduce as more current flows.
3. "Open-drain"
  - Open-drain mode. It sinks up to around 1mA.

```Javascript
// Javascript Example
obniz.io0.output(true); // output push-pull 5v

obniz.io1.drive("3v");
obniz.io1.output(true); // output push-pull 3v

obniz.io2.pull("5v");
obniz.io2.drive("open-drain");
obniz.io2.output(true); // output open-drain with 5v pull-up
```

## pull(pullType)
This enables/disables internal weak pull up/down resistors.

1. null (default) 
2. "5v"  pull up to 5v
3. "3v"  pull up to 3v
4. "0v"  pull down to gnd

```Javascript
// Javascript Example
obniz.io0.pull("3v");
obniz.io0.drive("open-drain"); // output open-drain
obniz.io0.output(false);
```

## input(callback)
Make ioX to input mode.
Callback function will be called when io changes its input value.
```Javascript
// Javascript Example
obniz.io0.input(function(value){
  console.log("changed to " + value);
});
```

## [await] inputWait
Make ioX to input mode.
And this will return the current input value.
It pauses the process until the value is returned.
```Javascript
// Javascript Example
var value = await obniz.io0.inputWait();
console.log(value);
```

## end()
This ends output/input on ioX.
This function is effective only when using ioX.output() or ioX.input().
This won't be called when AD/UART/etc are used.
Pull-up down also will not affected.

```Javascript
// Javascript Example
obniz.io0.output(true)
obniz.io0.end();
```

## io.animation(name, status, array of animations)
io animation is used when you wish to accelerate the serial sequence change of io.
"Loop" animation can be used.
io changes repeatedly in a sequential manner according to json array.
io and pwm json commands can only be used.


Key | Type | Default | Required | Description
--- | --- | --- | --- | ---
name | string | - | Required | name of animation
status | string | - | Required | status of animation
animations | array | - | Optional | instructions. This is optional when status is `pause``resume`.
repeat | number | undefined | Optional | The number of repeat count of animation. If not specified, it repeat endless.

### about status

status | Description
--- | --- |
`'loop'` | loop animation. It start immidiately.
`'registrate'` | Loop animation. Just registration.
`'pause'` | Pause current runnning animation.
`'resume'` | Resume paused or jsut registrated animation.

### about animation

duration means how long this state lasts, and you can set it between ms. 1 to 429426 ms (around 1 hour).
state is a function which has io directives.

```Javascript
// Javascript Example
obniz.io.animation("animation-1", "loop", [
  {
    duration: 10,
    state: function(index){ // index = 0
      obniz.io0.output(false)
      obniz.io1.output(true)
    }
  },{
    duration: 10,
    state: function(index){ // index = 1
      obniz.io0.output(true)
      obniz.io1.output(false)
    }
  }
])
```

It will generate signals like below

![](./images/ioanimation.png)

Remove animation
```Javascript
// Example
obniz.io.animation("animation-1", "loop")
```

Pause animation
```Javascript
// Example
obniz.io.animation("animation-1", "pause")
```

Resume paused animation
```Javascript
// Example
obniz.io.animation("animation-1", "resume")
```

## [await] io.repeatWait(animations, repeat)

It start io aniomation with limited repeat count. And It wait until done.


Key | Type | Default | Required | Description
--- | --- | --- | --- | ---
animations | array | - | Required | instructions.
repeat | number | - | Required | The number of repeat count of animation.

```Javascript
// Javascript Example
await obniz.io.repeatWait([
  {
    duration: 1000,
    state: function(index){
      obniz.io0.output(true)
    }
  },{
    duration: 1000,
    state: function(index){
      obniz.io0.output(false)
    }
  }
], 4)
```