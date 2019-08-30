# Solenoid

Solenoid is a coil with pistone.

![](./image.jpg)

<div class="embed-responsive embed-responsive-4by3 iframe_outer" >
<iframe class="embed-responsive-item iframe_inner" src="https://www.youtube.com/embed/6BeLaH5HkVw" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

Solenoid consume much energy.
You can connect only Tiny Solenoid directly to an obniz Board.
It's resistance should be more than 5 Ohm.

## obniz.wired("Solenoid", {signal, [, gnd]})

Connect two wires to an obniz Board.
Most solenoids has no polarity.

![](./wired.png)

```Javascript
// Javascript Example
var solenoid = obniz.wired('Solenoid', {gnd:0, signal:1});
solenoid.click();
```

## on()
Turning on a solenoid.
Be careful! Your solenoid will start be heated.

```Javascript
// Javascript Example
var solenoid = obniz.wired('Solenoid', {gnd:0, signal:1});
solenoid.on();
```

## off()
Turn off a solenoid

```Javascript
// Javascript Example
var solenoid = obniz.wired('Solenoid', {gnd:0, signal:1});
solenoid.on();
await obniz.wait(1000);
solenoid.off();
```

## click(msec);
It works on->wait->off.
msec is optional. default is 100msec.

```Javascript
// Javascript Example
var solenoid = obniz.wired('Solenoid', {gnd:0, signal:1});
solenoid.click();
```

## doubleClick(msec);
It click twice.

```Javascript
// Javascript Example
var solenoid = obniz.wired('Solenoid', {gnd:0, signal:1});
solenoid.doubleClick();
```