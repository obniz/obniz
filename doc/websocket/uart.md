
#  <a name="uart">uart</a>




##  request: <a name="-request-uart-init">init</a>
available 0 to 1



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `uartX.rx` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `uartX.tx` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `uartX.baud` |  integer  | <ul><li>default `115200`</li><li>1 &le; value &le; 5000000</li></ul> | baud rate (bps)&nbsp; |
| `uartX.stop` |  number  | <ul><li>default `1`</li><li>enum <ul><li>`1`</li><li>`1.5`</li><li>`2`</li></ul></li></ul> | stop bit width&nbsp; |
| `uartX.bits` |  integer  | <ul><li>default `8`</li><li>enum <ul><li>`5`</li><li>`6`</li><li>`7`</li><li>`8`</li></ul></li></ul> | &nbsp; |
| `uartX.parity` |  string  | <ul><li>default `off`</li><li>enum <ul><li>`"off"`</li><li>`"odd"`</li><li>`"even"`</li></ul></li></ul> | &nbsp; |
| `uartX.flowcontrol` |  string  | <ul><li>default `off`</li><li>enum <ul><li>`"off"`</li><li>`"rts"`</li><li>`"cts"`</li><li>`"rts-cts"`</li></ul></li></ul> | &nbsp; |
| `uartX.rts` | [pinSetting](#pinsetting)  | &nbsp; | &nbsp; |
| `uartX.cts` | [pinSetting](#pinsetting)  | &nbsp; | &nbsp; |



```
// Json Example
[
    {
        "uart0": {
            "rx": 0,
            "tx": 1,
            "baud": 115200,
            "stop": 1,
            "bits": 8,
            "parity": "off",
            "flowcontrol": "off",
            "rts": 2,
            "cts": 3
        }
    }
]
```


##  request: <a name="-request-uart-send">send</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `uartX.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "uart0": {
            "data": [16, 34, 242]
        }
    }
]
```


##  request: <a name="-request-uart-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `uartX` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "uart0": null
    }
]
```






##  response: <a name="-response-uart-receive">receive</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `uartX.data` | [dataArray](#dataarray)  | &nbsp; | &nbsp; |



```
//Response Example
[
    {
        "uart0": {
            "data": [16, 34, 242]
        }
    }
]
```






# type defines



##  <a name="dataarray">dataArray</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[16, 34, 242]`</li><li>`[100, 255, 21, 0, 21]`</li></ul> | Binary data array.&nbsp; |



##  <a name="pinsetting">pinSetting</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| integer | <ul><li>0 &le; value &le; 40</li></ul>  |  <ul><li>`0`</li><li>`1`</li><li>`2`</li><li>`3`</li><li>`4`</li><li>`5`</li><li>`6`</li></ul> | &nbsp; |






