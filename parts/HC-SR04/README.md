# HC-SR04
Ultrasonic Distance Measurement Unit.

Sample Program on CodePen

<p data-height="300" data-theme-id="32184" data-slug-hash="MrXrgV" data-default-tab="js,result" data-user="obniz" data-embed-version="2" data-pen-title="Parts: HC-SR04" class="codepen">See the Pen <a href="https://codepen.io/obniz/pen/MrXrgV/">Parts: HC-SR04</a> by obniz (<a href="https://codepen.io/obniz">@obniz</a>) on <a href="https://codepen.io">CodePen</a>.</p>
<script async src="https://production-assets.codepen.io/assets/embed/ei.js"></script>

## wired(obniz, vcc_io, triger_io, echo_io, gnd_io)

```javascript
  // Example
  var hcsr04 = obniz.wired("HC-SR04", 3,2,1,0);
  hcsr04.measure(function( distance ){
    $("#print").text("distance " + distance + " mm")
  })
```

## measure(callback(distance))
measure distance.
default return unit is "mm". change by calling .unit()
```javascript
  var hcsr04 = obniz.wired("HC-SR04", 3,2,1,0);
  $("#do").click(function(){
    hcsr04.measure(function( distance ){
      $("#print").text("distance " + distance + " mm")
    })
  })
```

## unit(unit)
change unit

1. "mm"(default)
2. "inch"

are available

```javascript
  var hcsr04 = obniz.wired("HC-SR04", 3,2,1,0);
  hcsr04.unit("inch")
  $("#do").click(function(){
    hcsr04.measure(function( distance ){
      $("#print").text("distance " + distance + " inch")
    })
  })
```