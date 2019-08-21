
#  <a name="pwm">pwm</a>


available 0 to 5

##  request: <a name="-request-pwm-init">init</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `pwmX.io` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "pwm0": {
            "io": 0
        }
    }
]
```


##  request: <a name="-request-pwm-freq">freq</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `pwmX.freq` |  integer  | <ul><li>required</li><li>1 &le; value &le; 80000000</li></ul> | frequency (Hz)&nbsp; |



```
// Json Example
[
    {
        "pwm0": {
            "freq": 40000000
        }
    }
]
```


##  request: <a name="-request-pwm-pulse">pulse</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `pwmX.pulse` |  number  | <ul><li>required</li><li>0 &le; value</li></ul> | pulse width (ms)&nbsp; |



```
// Json Example
[
    {
        "pwm0": {
            "pulse": 500
        }
    }
]
```


##  request: <a name="-request-pwm-modulate">modulate</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `pwmX.modulate.type` |  string  | <ul><li>required</li><li>const `"am"`</li></ul> | &nbsp; |
| `pwmX.modulate.symbol_length` |  number  | <ul><li>required</li><li>0.05 &le; value &le; 1000</li></ul> | symbol width (ms)&nbsp; |
| `pwmX.modulate.data` | [bitArray](#bitarray)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "pwm0": {
            "modulate": {
                "type": "am",
                "symbol_length": 500,
                "data": [0, 1, 1, 0, 0, 1, 1, 0]
            }
        }
    }
]
```


##  request: <a name="-request-pwm-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `pwmX` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "pwm0": null
    }
]
```






# type defines



##  <a name="bitarray">bitArray</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>items<br/><ul><li>0 &le; value &le; 1</li></ul></li></ul>  |  <ul><li>`[0, 1, 1, 0, 0, 1, 1, 0]`</li><li>`[0, 0, 1, 0, 0, 0, 0, 0]`</li></ul> | Binary data array represented in 0 1.&nbsp; |



##  <a name="pinsetting">pinSetting</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| integer | <ul><li>0 &le; value &le; 40</li></ul>  |  <ul><li>`0`</li><li>`1`</li><li>`2`</li><li>`3`</li><li>`4`</li><li>`5`</li><li>`6`</li></ul> | &nbsp; |






