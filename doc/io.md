# Peripherals IO
General purpose IO
available io0 to io11

## output(value)
Make ioX to output mode and output ture or false.

```Javascript
// Example
obniz.io1.output(true); // io1 is 5V
```

## outputType(type)
Change output drive method.
By default, it is "push-pull".

1. push-pull
  - push-pull 5v mode. up to 1A available
2. push-pull3v
  - push-pull 3v mode. up to around 1mA. It's voltage will reduce by current.
3. open-drain
  - open-drain mode. It sink up to around 1mA.

You can change "push-pull3v" and "open-drain" while output.
But "push-pull" is not granted while output. You should change it to input onece.

```Javascript
// Example
obniz.io1.output(true); // output push-pull
obniz.io1.pullup();
obniz.io1.outputType("open-drain"); // changed immediately 
```

## pullup5v()
intenal pullup to 5v with weak resistor.
The state is one of them.

1. float (default) 
2. pullup
3. pullup5v
4. pulldown

```Javascript
// Example
obniz.io1.pullup5v();
obniz.io1.outputType("open-drain"); // output open-drain
```

## pullup()
intenal pullup to 3v with weak resistor.
The state is one of them.

1. float (default) 
2. pullup
3. pullup5v
4. pulldown

```Javascript
// Example
obniz.io1.pullup();
obniz.io1.outputType("open-drain"); // output open-drain
```
## pulldown()
intenal pulldown to GND with weak resistor.
The state is one of them.

1. float (default) 
2. pullup
3. pullup5v
4. pulldown

```Javascript
// Example
obniz.io1.pulldown();
obniz.io1.get();
```

## float()
no pull-up pull-down.
This is default state.
The state is one of them.

1. float (default) 
2. pullup
3. pullup5v
4. pulldown

```Javascript
// Example
obniz.io1.float();
var val = await obniz.io1.inputWait();
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
```Javascript
// Example
obniz.io.animation("animation-1", "loop", [
  {
    duration: 10,
    state: function(){
      obniz.io0.output(false)
      obniz.io1.output(true)
    }
  },{
    duration: 10,
    state: function(){
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