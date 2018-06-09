# Peripherals IO
General purpose IO
available on each io (io0 to io11)

#### Feature
##### output
Each IO can output digital value.

Drive methods are below.

Type | Voltage | max A | max Freq | Details
:---: | :---: | :---: | :---: | ---
push-pull | `5v` | <=1A | <=250khz(recommend) | Default. Overcurrent protection
push-pull | `3v` | <=1mA(recommend) | <=80Mhz | over current detection when using io.output().
open-drain | `<=5v` | <=1mA(recommend) | <=80Mhz | 

Each methods can be configured independently.
Not only for io.output(), but also UART SPI can choose methods.

##### input

Only one input method.

3v input with 5v tolerant. So, CMOS level.


Type | Level | max Freq | Detail
:---: | :---: | :---: | :---: | ---
digital-in | `3v(5v tolerant)` | <=80Mhz | 

##### internal weak pull-up/pull-dow

Pull up down can bec configured independently.

Type is one of four state.

Type | Pull to | Detail
:---: | :---: | :---:
floating |  | Default
pull-up | `5v` | 
pull-up | `3v` | 
pull-down | `gnd` | 


## output(value)
Make ioX to output mode and output.

```Javascript
// Javascript Example
obniz.io1.output(true); // io1 is 5v
obniz.io2.output(1); //  io2 is 5v
obniz.io3.drive("3v");
obniz.io3.output(1); // io3 is around 3v.
```

## drive(type)
Change output drive method.
By default, it is push-pull 5v with motor driver(up to 1A).

1. "5v"
  - push-pull 5v mode. up to 1A available
2. "3v"
  - push-pull 3v mode. up to around 1mA. It's voltage will reduce by current.
3. "open-drain"
  - open-drain mode. It sink up to around 1mA.

```Javascript
// Javascript Example
obniz.io1.output(true); // output push-pull 5v
obniz.io1.pull("5v");
obniz.io1.drive("open-drain"); // changed immediately 
```

## pull(pullType)
enable/disable internal weak pull up/down resistors.

1. null (default) 
2. "5v"  pull up to 5v
3. "3v"  pull up to 3v
4. "0v"  pull down to gnd

```Javascript
// Javascript Example
obniz.io0.pull(null);
obniz.io1.pull("3v");
obniz.io1.drive("open-drain"); // output open-drain
```

## input(callback)
Make ioX to input mode.
and callback function will be called when io changed it's input value.
```Javascript
// Javascript Example
obniz.io0.input(function(value){
  console.log("changed to " + value);
});
```
## [await] inputWait
Make ioX to input mode.
And This will return current input value.
It will pause process.
```Javascript
// Javascript Example
var value = await obniz.io0.inputWait();
console.log(value);
```

## io.animation(name, status, array of animations)
io animation is hardware acceleration for serial sequence change of io.
now "loop" animation is available.
it loop io changes regarding json array.
io and pwm json commands only.
duration is how long does it state consist. It ms. 1 to 429426 ms (around 1 hour).
state is function which has io directives.

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

It will generate signals like

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
