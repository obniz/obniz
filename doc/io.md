# Peripherals IO
General purpose IO
available io0 to io11

## output(value)
Make ioX to output mode and output ture or false.

```Javascript
// Example
obniz.io1.output(true); // io1 is 5V
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

You can change "5v" "3v" and "open-drain" while output.
But "3v" is not granted while output. You should change it to input onece.

```Javascript
// Example
obniz.io1.output(true); // output push-pull 5v
obniz.io1.pull("5v");
obniz.io1.drive("open-drain"); // changed immediately 
```

## pull(pulltype)
enable/disable internal pull up/down resistors.

1. null (default) 
2. "5v"  pull up to 5v
3. "3v"  pull up to 3v
4. "0v"  pull down to gnd

```Javascript
// Example
obniz.io0.pull(null);
obniz.io1.pull("3v");
obniz.io1.drive("open-drain"); // output open-drain
```

## input(callback)
Make ioX to input mode.
and callback function will be called when io changed it's input value.
```Javascript
// Example
obniz.io0.input(function(value){
  console.log("changed to " + value);
});
```
## [await] inputWait
Make ioX to input mode.
And This will return current input value.
It will pause process.
```Javascript
// Example
var value = await obniz.io0.inputWait();
console.log(value);
```

## io.animation(name, status, array of animations)
io animation is hardware acceleration for serial sequence change of io.
now "loop" animation is avaiable.
it loop io changes regarding json array.
io and pwm json commands only.
duration is how long does it state consist. It msec. 1 to 429426 msec (around 1 hour).
state is function which has io directives.

```Javascript
// Example
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

Pause animation
```Javascript
// Example
obniz.io.animation("animation-1", "pause")
```

Resume animation
```Javascript
// Example
obniz.io.animation("animation-1", "resume")
```