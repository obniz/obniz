# Speaker

It is a speaker such as piezo. Connect with two wires, and generate sound by current.

## wired(obniz , {signal. gnd} )
Connect to the speaker. If there are plus and minus, please specify minus to gnd.
```Javascript
var speaker = obniz.wired("Speaker", {signal:0, gnd:1});
```
## freq(frequency)
Specify the frequency of the sound from the speaker.

```Javascript
var speaker = obniz.wired("Speaker", {signal:0, gnd:1});
speaker.freq(1000); //1khz
```