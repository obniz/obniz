# Sleep
Introducing the sleep function that can only be used with obniz Board 1Y.

Sleep is entering low power consumption mode by shutting almost all functions.
It makes available working with batteries for long time by continueing sleep and wake up.

[Sleep function details] (https://obniz.io/en/doc/obniz_board_1y/hw_sleep)

There are notes on using sleep.

When starting at a specified time, there may be an error of up to ± 10% depending on the power supply voltage, ambient temperature, etc.
Please use with care.

## sleep (date)
Action only with obniz Board 1Y.

Obniz Board sleeps for the value specified in Date type.

Sleep for up to 45 days (64800 minutes).
```Javascript
// JavaScript example
let dt = new Date ();
dt.setHours (dt.getHours () + 1,0,0,0); 
obniz.sleep (dt);
```
## sleepSeconds (seconds)
Action only with obniz Board 1Y.

Obniz Board sleeps for the value specified in seconds.

Sleep up to 18 hours (64800 seconds).
```Javascript
// JavaScript example
obniz.sleepSeconds (60); // 60 seconds
```
## sleepMinute (minutes)
Action only with obniz Board 1Y.

Obniz Board sleeps for the value specified in minutes.

Sleep for up to 45 days (64800 minutes).
```Javascript
// JavaScript example
obniz.sleepMinute （60）; // 60 minutes
```
## sleepIoTrigger (Trigger)
Action only with obniz Board 1Y.

It returns from sleep depending on the pin state of IO0.

- true: Rise （LOW -> HIGH）
- false: Falling （HIGH -> LOW）

```Javascript
// JavaScript example
obniz.sleepIoTrigger (true);
```