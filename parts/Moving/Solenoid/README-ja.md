# Solenoid

ソレノイドは金属のピストン付きのコイルです。

![](./image.jpg)

<div class="embed-responsive embed-responsive-4by3 iframe_outer" >
<iframe class="embed-responsive-item iframe_inner" src="https://www.youtube.com/embed/6BeLaH5HkVw" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>
</div>

ソレノイドは電力を消費しますので、使うときは注意してください。
obniz Boardに直接繋げられるのは小さなものだけです。
抵抗値が5オーム以上である必要があります。

## obniz.wired("Solenoid", {signal, [, gnd]})

ソレノイドからでている2本の線をobniz Boardにつなぎます。
通常極性はありません。


![](./wired.png)

```Javascript
// Javascript Example
var solenoid = obniz.wired('Solenoid', {gnd:0, signal:1});
solenoid.click();
```

## on()
ソレノイドをオンにします。
電流が流れ始めますから、ソレノイドは熱を持ち始めます。注意してください。

```Javascript
// Javascript Example
var solenoid = obniz.wired('Solenoid', {gnd:0, signal:1});
solenoid.on();
```

## off()
ソレノイドをオフにします。

```Javascript
// Javascript Example
var solenoid = obniz.wired('Solenoid', {gnd:0, signal:1});
solenoid.on();
await obniz.wait(1000);
solenoid.off();
```

## click(msec);
クリックのように オン->待つ(msec)->オフ　と動きます。
msecの指定ががない場合は100msecとなります。

```Javascript
// Javascript Example
var solenoid = obniz.wired('Solenoid', {gnd:0, signal:1});
solenoid.click();
```

## doubleClick(msec);
2度クリックします。

```Javascript
// Javascript Example
var solenoid = obniz.wired('Solenoid', {gnd:0, signal:1});
solenoid.doubleClick();
```