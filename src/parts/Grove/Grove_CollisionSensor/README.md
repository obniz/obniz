# Grove_Collision_Sensor

This is a collision sensor available with Grove connectors. 
It detects the collision and catches the vibration caused by the collision while it is shaking.

![](//あとでここに画像貼る)

## wired(obniz,  { [signal , vcc, gnd, grove ]});


name | type | required | default | description
--- | --- | --- | --- | ---
signal | `number(obniz Board io)` | no |  &nbsp; | GPIO端子(4 pin of Grove)
vcc | `number(obniz Board io)` | no |  &nbsp; | VCC端子(2 pin of Grove)
gnd | `number(obniz Board io)` | no |  &nbsp; | GND端子(1 pin of Grove)
grove | `object` | no | &nbsp;  | Available if the device to be connected has GROVE.

```Javascript
// Javascript Example        
    //Notification of each collision
        //Pin Setting
        let sensor=obniz.wired("Grove_Collision_sensor",{grove: obniz.grove0});
        
        //Wait for the crash
        var collided = await sensor.isCollidedWait();

        //When a collision is detected,the following procedures are performed
        sensor.onchange = async function(collided){
          
          //Output to the console screen
          console.log("Collision is detected!");
          console.log("");
        };
      }

```

## [await] isCollidedWait()

Check to see if a collision is occurring.

```Javascript
// Javascript Example
var sensor = obniz.wired("Grove_Button", {grove: obniz.grove0});
var collided = await sensor.isCollidedWait();
console.log("Collided = " + colided);
```


## onchange = function(collided){}

When a collision occurs, it calls the callback function and does the behavior of the program written in it.

```Javascript
// Javascript Example
        //Pin Setting
        let sensor=obniz.wired("Grove_Collision_sensor",{grove: obniz.grove0});

        var collided = await sensor.isCollidedWait();

        sensor.onchange = function(collided){
        console.log("Collision is detected!")
        console.log("");
           };

```

