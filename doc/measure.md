# measure
measure module provide hardware level measrements.

## measure.echo({})

Some electrical parts or circuits accept "pulse" then responds "pulse" after delay.
If you want to measure delay, this module is best choice.

This module generate one shot pulse on a io, then measre response time.

![](./images/measure.png)


### pulse generation
you can choose belows to generate pulse

1. io_pulse: io for output generated pulse
2. pulse: "positve" or "negative"
3. pulse_width: pulse duration in msec. 0.001 to 1000.

![](./images/measure_posneg.png)

### response measurement
you can choose belows to measre response

1. io_echo: io for measure response
2. measure_edges: maximum edges to detect. 1 to 4.
3. timeout: timeout in msec. default is 1000. 0.001 to 1000.
4. callback: callback function after measred ot timeouted

callback function will be called when edges count == measure_edges or timeouted.
It has array of edge informations. For example, If you get a response like a below 

![](./images/measure_response.png)

Then, you will get like this
```javascript
callback: function(edges) {
  edges.length // == 2
  edges[0].edge // == true
  edges[0].timing // == t1
  edges[1].edge // == false
  edges[1].timing // == t2
}
```

Full Example

```javascript
obniz.measure.echo({
  io_pulse: this.triger, // io for generate pulse
  io_echo: this.echo, // io to be measured
  pulse: "positive", // generate pulse pattern
  pulse_width: 0.1,  // generate pulse width
  measure_edges: 3, // 1 to 4. maximum edges to measure
  timeout: 1000, // this is optional. 1000(1sec) is default
  callback: function(edges) {
    // callback function
  }
});
```
