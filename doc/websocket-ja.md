# obniz WebSocket Formats
Javascript以外からも，WebSocketを使うことでobnizを使うことができます．

WebSocketではJSONでデータのやり取りを行います．


-  [ws](#ws)

-  [system](#system)

-  [io](#io)

-  [ioAnimation](#ioAnimation)

-  [ad](#ad)

-  [pwm](#pwm)

-  [uart](#uart)

-  [spi](#spi)

-  [i2c](#i2c)

-  [logicAnalyzer](#logicAnalyzer)

-  [measure](#measure)

-  [display](#display)

-  [switch](#switch)

-  [ble.central](#ble-central)

-  [ble.peripheral](#ble-peripheral)

-  [message](#message)

-  [debug](#debug)




##  <a name="ws">ws</a>




###  request: <a name="-request-ws-reset_obniz_on_ws_disconnection">reset_obniz_on_ws_disconnection</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ws.reset_obniz_on_ws_disconnection` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ws": {
            "reset_obniz_on_ws_disconnection": false
        }
    }
]
```






###  response: <a name="-response-ws-ready">ready</a>
all things ready



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ws.ready` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ws": {
            "ready": true
        }
    }
]
```


###  response: <a name="-response-ws-redirect">redirect</a>
If the server required you to connect other endpoint to communicate with your obniz. This json will be sent.



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ws.redirect` |  string  | <ul><li>required</li></ul> | The url you should redirect to.&nbsp; |



```
//Response Example
[
    {
        "ws": {
            "redirect": "wss://ws1.obniz.io"
        }
    }
]
```




##  <a name="system">system</a>




###  request: <a name="-request-system-wait">wait</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.wait` |  integer  | <ul><li>required</li></ul> | wait time (ms)&nbsp; |



```
// Json Example
[
    {
        "system": {
            "wait": 500
        }
    }
]
```


###  request: <a name="-request-system-reset">reset</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.reset` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "system": {
            "reset": true
        }
    }
]
```


###  request: <a name="-request-system-reboot">reboot</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.reboot` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "system": {
            "reboot": true
        }
    }
]
```


###  request: <a name="-request-system-selfcheck">selfCheck</a>
circuit IO check



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.self_check` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "system": {
            "self_check": true
        }
    }
]
```


###  request: <a name="-request-system-keepworkingatoffline">keepWorkingAtOffline</a>
reset obniz when obniz gone to offline.



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.keep_working_at_offline` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "system": {
            "keep_working_at_offline": true
        }
    }
]
```


###  request: <a name="-request-system-ping">ping</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.ping.key` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "system": {
            "ping": {
                "key": [16, 34, 242]
            }
        }
    }
]
```






###  response: <a name="-response-system-pong">pong</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.pong.key` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "system": {
            "pong": {
                "key": [16, 34, 242]
            }
        }
    }
]
```




##  <a name="io">io</a>


General purpose IO available on each io (io0 to io11).

###  request: <a name="-request-io-input">input</a>



Related item

- [/response/io/get](#-response-io-get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX` |  string  | <ul><li>required</li><li>const `"get"`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io0": "get"
    }
]
```


###  request: <a name="-request-io-input_detail">input_detail</a>



Related item

- [/response/io/get](#-response-io-get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX.direction` |  string  | <ul><li>required</li><li>const `"input"`</li></ul> | &nbsp; |
| `ioX.stream` |  boolean  | &nbsp; | enable stream callback when value change&nbsp; |



```
// Json Example
[
    {
        "io0": {
            "direction": "input",
            "stream": false
        }
    }
]
```


###  request: <a name="-request-io-output">output</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io0": true
    }
]
```


###  request: <a name="-request-io-output_detail">output_detail</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX.direction` |  string  | <ul><li>required</li><li>const `"output"`</li></ul> | &nbsp; |
| `ioX.value` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io0": {
            "direction": "output",
            "value": true
        }
    }
]
```


###  request: <a name="-request-io-output_type">output_type</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX.output_type` |  string  | <ul><li>required</li><li>enum <ul><li>`"push-pull5v"`</li><li>`"push-pull3v"`</li><li>`"open-drain"`</li></ul></li></ul> | drive type&nbsp; |



```
// Json Example
[
    {
        "io0": {
            "output_type": "push-pull5v"
        }
    }
]
```


###  request: <a name="-request-io-pull_type">pull_type</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX.pull_type` |  string  | <ul><li>required</li><li>enum <ul><li>`"pull-up5v"`</li><li>`"pull-up3v"`</li><li>`"pull-down"`</li><li>`"float"`</li></ul></li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io0": {
            "pull_type": "pull-up5v"
        }
    }
]
```


###  request: <a name="-request-io-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io0": null
    }
]
```






###  response: <a name="-response-io-get">get</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "io0": true
    }
]
```




##  <a name="ioAnimation">ioAnimation</a>


io animation is hardware acceleration for serial sequence change of io. now 'loop' animation is available. it loop io changes regarding json array.

###  request: <a name="-request-ioanimation-init">init</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `io.animation.animation.name` |  string  | <ul><li>required</li><li>1 &le; length &le; 254</li></ul> | Animation name to use pause/resume&nbsp; |
| `io.animation.animation.status` |  string  | <ul><li>required</li><li>const `"loop"`</li></ul> | &nbsp; |
| `io.animation.animation.states[].duration` |  integer  | <ul><li>required</li><li>0 &le; value &le; 60000</li></ul> | State duration time(ms)&nbsp; |
| `io.animation.animation.states[].state` |  object  | <ul><li>required</li></ul> | io/pwm commands.&nbsp; |



```
// Json Example
[
    {
        "io": {
            "animation": {
                "animation": {
                    "name": "animation-1",
                    "status": "loop",
                    "states": [
                        {
                            "duration": 500,
                            "state": {
                                "io0": true
                            }
                        },
                        {
                            "duration": 500,
                            "state": {
                                "io0": false
                            }
                        }
                    ]
                }
            }
        }
    }
]
```


###  request: <a name="-request-ioanimation-changestate">changeState</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `io.animation.animation.name` |  string  | <ul><li>required</li><li>1 &le; length &le; 254</li></ul> | &nbsp; |
| `io.animation.animation.status` |  string  | <ul><li>required</li><li>enum <ul><li>`"pause"`</li><li>`"resume"`</li></ul></li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io": {
            "animation": {
                "animation": {
                    "name": "animation-1",
                    "status": "pause"
                }
            }
        }
    }
]
```




##  <a name="ad">ad</a>


available ad0~ad11

###  request: <a name="-request-ad-get">get</a>



Related item

- [/response/ad/get](#-response-ad-get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `adX.stream` |  boolean  | <ul><li>required</li></ul> | true to continuous notifying on voltage change.&nbsp; |



```
// Json Example
[
    {
        "ad0": {
            "stream": false
        }
    }
]
```


###  request: <a name="-request-ad-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `adX` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ad0": null
    }
]
```






###  response: <a name="-response-ad-get">get</a>
current value (volt)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `adX` |  number  | <ul><li>required</li><li>0 &le; value &le; 5</li></ul> | current value (volt)&nbsp; |



```
//Response Example
[
    {
        "ad0": 3.3
    }
]
```




##  <a name="pwm">pwm</a>


available 0 to 5

###  request: <a name="-request-pwm-init">init</a>




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


###  request: <a name="-request-pwm-freq">freq</a>




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


###  request: <a name="-request-pwm-pulse">pulse</a>




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


###  request: <a name="-request-pwm-modulate">modulate</a>




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


###  request: <a name="-request-pwm-deinit">deinit</a>




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




##  <a name="uart">uart</a>




###  request: <a name="-request-uart-init">init</a>
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


###  request: <a name="-request-uart-send">send</a>




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


###  request: <a name="-request-uart-deinit">deinit</a>




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






###  response: <a name="-response-uart-receive">receive</a>




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




##  <a name="spi">spi</a>


available spi0, spi1

###  request: <a name="-request-spi-init_master">init_master</a>
clk, miso, mosi are optional, but at least one are required



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `spiX.mode` |  string  | <ul><li>required</li><li>const `"master"`</li></ul> | &nbsp; |
| `spiX.clk` | [pinSetting](#pinsetting)  | &nbsp; | &nbsp; |
| `spiX.mosi` | [pinSetting](#pinsetting)  | &nbsp; | &nbsp; |
| `spiX.miso` | [pinSetting](#pinsetting)  | &nbsp; | &nbsp; |
| `spiX.clock` |  integer  | <ul><li>required</li><li>1 &le; value &le; 26000000</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "spi0": {
            "mode": "master",
            "clk": 0,
            "mosi": 1,
            "miso": 2,
            "clock": 115200
        }
    }
]
```


###  request: <a name="-request-spi-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `spiX` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "spi0": null
    }
]
```


###  request: <a name="-request-spi-write">write</a>



Related item

- [/response/spi/read](#-response-spi-read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `spiX.data` | [dataArray32](#dataarray32)  | <ul><li>required</li></ul> | &nbsp; |
| `spiX.read` |  boolean  | <ul><li>required</li></ul> | If false, write without receive&nbsp; |



```
// Json Example
[
    {
        "spi0": {
            "data": [100, 255, 21, 0, 21],
            "read": true
        }
    }
]
```






###  response: <a name="-response-spi-read">read</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `spiX.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "spi0": {
            "data": [16, 34, 242]
        }
    }
]
```




##  <a name="i2c">i2c</a>


available only i2c0

###  request: <a name="-request-i2c-init_master">init_master</a>
internal pull-up is available. But, We recommend use external pull-up resistor.



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `i2cX.mode` |  string  | <ul><li>required</li><li>const `"master"`</li></ul> | &nbsp; |
| `i2cX.sda` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `i2cX.scl` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `i2cX.clock` |  integer  | <ul><li>required</li><li>1 &le; value &le; 1000000</li></ul> | frequency (Hz)&nbsp; |



```
// Json Example
[
    {
        "i2c0": {
            "mode": "master",
            "sda": 0,
            "scl": 1,
            "clock": 500000
        }
    }
]
```


###  request: <a name="-request-i2c-init_slave">init_slave</a>



Related item

- [/response/i2c/slave](#-response-i2c-slave)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `i2cX.mode` |  string  | <ul><li>required</li><li>enum <ul><li>`"master"`</li><li>`"slave"`</li></ul></li></ul> | &nbsp; |
| `i2cX.sda` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `i2cX.scl` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `i2cX.slave_address` |  integer  | <ul><li>required</li><li>0 &le; value &le; 1023</li></ul> | &nbsp; |
| `i2cX.slave_address_length` |  integer  | <ul><li>default `7`</li><li>const `7`</li></ul> | &nbsp; |
| `i2cX.address` |  integer  | <ul><li>0 &le; value &le; 1023</li></ul> | &nbsp; |
| `i2cX.address_bits` |  integer  | <ul><li>default `7`</li><li>const `7`</li></ul> | &nbsp; |
| `i2cX.data` | [dataArray](#dataarray)  | &nbsp; | &nbsp; |
| `i2cX.read` |  integer  | <ul><li>0 &le; value</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "i2c0": {
            "mode": "master",
            "sda": 0,
            "scl": 1,
            "slave_address": 511,
            "slave_address_length": 7,
            "address": 511,
            "address_bits": 7,
            "data": [16, 34, 242],
            "read": 500
        }
    }
]
```


###  request: <a name="-request-i2c-write">write</a>
if address over 0b01111111; then address treated as 10bit address automatically. or specify address_bits: 10 to force 10bit address mode.



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `i2cX.address` |  integer  | <ul><li>required</li><li>0 &le; value &le; 1023</li></ul> | &nbsp; |
| `i2cX.address_bits` |  integer  | <ul><li>default `7`</li><li>const `7`</li></ul> | &nbsp; |
| `i2cX.data` | [dataArray1024](#dataarray1024)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "i2c0": {
            "address": 511,
            "address_bits": 7,
            "data": [100, 255, 21, 0, 21]
        }
    }
]
```


###  request: <a name="-request-i2c-read">read</a>
if address over 0b01111111; then address treated as 10bit address automatically. or specify address_bits: 10 to force 10bit address mode.


Related item

- [/response/i2c/master](#-response-i2c-master)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `i2cX.address` |  integer  | <ul><li>required</li><li>0 &le; value &le; 1023</li></ul> | &nbsp; |
| `i2cX.address_bits` |  integer  | <ul><li>default `7`</li><li>const `7`</li></ul> | &nbsp; |
| `i2cX.read` |  integer  | <ul><li>required</li><li>0 &le; value &le; 1024</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "i2c0": {
            "address": 511,
            "address_bits": 7,
            "read": 512
        }
    }
]
```


###  request: <a name="-request-i2c-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `i2cX` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "i2c0": null
    }
]
```






###  response: <a name="-response-i2c-master">master</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `i2cX.mode` |  string  | <ul><li>required</li><li>const `"master"`</li></ul> | &nbsp; |
| `i2cX.address` |  integer  | <ul><li>required</li><li>0 &le; value &le; 1023</li></ul> | &nbsp; |
| `i2cX.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "i2c0": {
            "mode": "master",
            "address": 511,
            "data": [16, 34, 242]
        }
    }
]
```


###  response: <a name="-response-i2c-slave">slave</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `i2cX.mode` |  string  | <ul><li>required</li><li>const `"slave"`</li></ul> | &nbsp; |
| `i2cX.address` |  integer  | <ul><li>required</li><li>0 &le; value &le; 1023</li></ul> | &nbsp; |
| `i2cX.is_fragmented` |  boolean  | <ul><li>required</li></ul> | &nbsp; |
| `i2cX.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "i2c0": {
            "mode": "slave",
            "address": 511,
            "is_fragmented": true,
            "data": [16, 34, 242]
        }
    }
]
```




##  <a name="logicAnalyzer">logicAnalyzer</a>


Monitor io logic level changes by sampling io.

###  request: <a name="-request-logicanalyzer-init">init</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `logic_analyzer.io[]` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `logic_analyzer.interval` |  number  | <ul><li>required</li><li>0 < value</li></ul> | &nbsp; |
| `logic_analyzer.duration` |  integer  | <ul><li>required</li><li>0 < value</li></ul> | &nbsp; |
| `logic_analyzer.trigger.value` |  boolean  | <ul><li>required</li></ul> | start value&nbsp; |
| `logic_analyzer.trigger.samples` |  integer  | <ul><li>required</li><li>0 &le; value</li></ul> | how that values consists&nbsp; |


With below sample code, you will receive only data which start with &#39;false, false, false&#39; 3bit.
```
// Json Example
[
    {
        "logic_analyzer": {
            "io": [ 0],
            "interval": 500,
            "duration": 500,
            "trigger": {
                "value": false,
                "samples": 3
            }
        }
    }
]
```


###  request: <a name="-request-logicanalyzer-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `logic_analyzer` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "logic_analyzer": null
    }
]
```






###  response: <a name="-response-logicanalyzer-data">data</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `logic_analyzer.data` | [bitArray](#bitarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "logic_analyzer": {
            "data": [0, 1, 1, 0, 0, 1, 1, 0]
        }
    }
]
```




##  <a name="measure">measure</a>




###  request: <a name="-request-measure-echo">echo</a>
It measures pulse response.


Related item

- [/response/measure/echo](#-response-measure-echo)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `measure.echo.io_pulse` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `measure.echo.io_echo` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `measure.echo.pulse` |  string  | <ul><li>default `positive`</li><li>enum <ul><li>`"positive"`</li><li>`"negative"`</li></ul></li></ul> | &nbsp; |
| `measure.echo.pulse_width` |  number  | <ul><li>required</li><li>0.001 &le; value &le; 1000</li></ul> | &nbsp; |
| `measure.echo.measure_edges` |  integer  | <ul><li>1 &le; value &le; 4</li></ul> | &nbsp; |
| `measure.echo.timeout` |  number  | <ul><li>default `1000`</li><li>0.001 &le; value &le; 1000</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "measure": {
            "echo": {
                "io_pulse": 0,
                "io_echo": 1,
                "pulse": "positive",
                "pulse_width": 500,
                "measure_edges": 2,
                "timeout": 1000
            }
        }
    }
]
```






###  response: <a name="-response-measure-echo">echo</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `measure.echo[].edge` |  boolean  | <ul><li>required</li></ul> | rising = true&nbsp; |
| `measure.echo[].timing` |  number  | <ul><li>required</li></ul> | milliseconds from end of pulse&nbsp; |



```
//Response Example
[
    {
        "measure": {
            "echo": [
                {
                    "edge": true,
                    "timing": 500
                }
            ]
        }
    }
]
```




##  <a name="display">display</a>




###  request: <a name="-request-display-text">text</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `display.text` |  string  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "display": {
            "text": "Hello, obniz!"
        }
    }
]
```


###  request: <a name="-request-display-clear">clear</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `display.clear` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "display": {
            "clear": true
        }
    }
]
```


###  request: <a name="-request-display-qr">qr</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `display.qr.text` |  string  | <ul><li>required</li></ul> | &nbsp; |
| `display.qr.correction` |  string  | <ul><li>default `M`</li><li>enum <ul><li>`"L"`</li><li>`"M"`</li><li>`"Q"`</li><li>`"H"`</li></ul></li></ul> | &nbsp; |



```
// Json Example
[
    {
        "display": {
            "qr": {
                "text": "Hello, obniz!",
                "correction": "M"
            }
        }
    }
]
```


###  request: <a name="-request-display-raw">raw</a>
1 bit represents 1 dot. 1=white, 0=black. 1 byte is part of one line. Order is same like.<br/> {1byte} {2byte} {3byte}...{16byte}<br/> {17byte} {18byte} {19byte}...<br/> .....<br/> .....................{1024byte}



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `display.raw` | [imageData128x64](#imagedata128x64)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "display": {
            "raw": [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 240, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 224, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 255, 192, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 255, 129, 248, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 255, 255, 3, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 255, 254, 7, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 252, 15, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 248, 31, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 255, 240, 63, 255, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 255, 224, 127, 255, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 255, 192, 255, 255, 248, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 129, 255, 255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 255, 255, 3, 255, 255, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 255, 254, 7, 255, 255, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 255, 252, 15, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 248, 31, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 240, 63, 255, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 224, 127, 193, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 15, 252, 64, 255, 128, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 15, 240, 1, 255, 0, 127, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 224, 3, 254, 0, 127, 254, 14, 0, 0, 0, 0, 0, 0, 0, 0, 31, 224, 7, 254, 0, 63, 252, 30, 0, 0, 0, 0, 0, 0, 0, 0, 31, 224, 7, 254, 0, 63, 248, 60, 0, 0, 0, 0, 0, 0, 0, 0, 31, 192, 7, 254, 0, 63, 240, 120, 0, 0, 0, 0, 0, 0, 0, 0, 31, 192, 7, 254, 0, 127, 224, 240, 0, 0, 0, 0, 0, 0, 0, 0, 31, 224, 7, 252, 0, 127, 193, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 224, 15, 248, 0, 255, 131, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 240, 31, 240, 39, 255, 7, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 252, 63, 224, 127, 254, 15, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 255, 192, 255, 252, 31, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 255, 129, 255, 248, 63, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 255, 3, 255, 240, 127, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 254, 7, 255, 224, 255, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 252, 15, 255, 193, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 248, 31, 255, 131, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 240, 63, 255, 7, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 224, 127, 254, 15, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 192, 255, 252, 31, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 129, 255, 0, 63, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 3, 254, 0, 127, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 254, 7, 252, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 252, 15, 252, 0, 255, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 248, 31, 252, 0, 255, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 252, 0, 255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 224, 127, 252, 0, 255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 255, 252, 0, 255, 248, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 255, 254, 1, 255, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 255, 255, 3, 255, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 255, 255, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 255, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 255, 255, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 255, 255, 255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 255, 255, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
    }
]
```


###  request: <a name="-request-display-pin_assign">pin_assign</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `display.pin_assign.X.module_name` |  string  | &nbsp; | &nbsp; |
| `display.pin_assign.X.pin_name` |  string  | &nbsp; | &nbsp; |



```
// Json Example
[
    {
        "display": {
            "pin_assign": {
                "0": {
                    "module_name": "io",
                    "pin_name": "output"
                }
            }
        }
    }
]
```




##  <a name="switch">switch</a>


the switch embed on obniz itself. If it's state is changed, notification will be fired.

###  request: <a name="-request-switch-get">get</a>



Related item

- [/response/switch/change](#-response-switch-change)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `switch` |  string  | <ul><li>required</li><li>const `"get"`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "switch": "get"
    }
]
```






###  response: <a name="-response-switch-change">change</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `switch.state` |  string  | <ul><li>required</li><li>enum <ul><li>`"none"`</li><li>`"push"`</li><li>`"left"`</li><li>`"right"`</li></ul></li></ul> | &nbsp; |
| `switch.action` |  string  | <ul><li>const `"get"`</li></ul> | this is optional and added when user request&nbsp; |



```
//Response Example
[
    {
        "switch": {
            "state": "none",
            "action": "get"
        }
    }
]
```




##  <a name="ble-central">ble.central</a>


use obniz as central

###  request: <a name="-request-ble-central-scan_start">scan_start</a>



Related item

- [/response/ble/central/scan](#-response-ble-central-scan)
- [/response/ble/central/scan_finish](#-response-ble-central-scan_finish)




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.scan.duration` |  integer  | <ul><li>default `30`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "scan": {
                "duration": 30
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-scan_stop">scan_stop</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.scan` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "scan": null
        }
    }
]
```


###  request: <a name="-request-ble-central-connect">connect</a>



Related item

- [/response/ble/central/status_update](#-response-ble-central-status_update)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.connect.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "connect": {
                "address": "77e754ab8591"
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-disconnect">disconnect</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.disconnect.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "disconnect": {
                "address": "77e754ab8591"
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-service_get">service_get</a>



Related item

- [/response/ble/central/service_get](#-response-ble-central-service_get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_services.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "get_services": {
                "address": "77e754ab8591"
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-characteristic_get">characteristic_get</a>



Related item

- [/response/ble/central/characteristic_get](#-response-ble-central-characteristic_get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_characteristics.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_characteristics.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "get_characteristics": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-characteristic_read">characteristic_read</a>



Related item

- [/response/ble/central/characteristic_read](#-response-ble-central-characteristic_read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.read_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "read_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-characteristic_write">characteristic_write</a>



Related item

- [/response/ble/central/characteristic_write](#-response-ble-central-characteristic_write)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.write_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic.needResponse` |  boolean  | <ul><li>default `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "write_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "data": [16, 34, 242],
                "needResponse": true
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-characteristic_register_notify">characteristic_register_notify</a>



Related item

- [/response/ble/central/characteristic_register_notify](#-response-ble-central-characteristic_register_notify)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.register_notify_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.register_notify_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.register_notify_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "register_notify_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-characteristic_unregister_notify">characteristic_unregister_notify</a>



Related item

- [/response/ble/central/characteristic_unregister_notify](#-response-ble-central-characteristic_unregister_notify)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.unregister_notify_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.unregister_notify_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.unregister_notify_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "unregister_notify_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-descriptor_get">descriptor_get</a>



Related item

- [/response/ble/central/descriptor_get](#-response-ble-central-descriptor_get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_descriptors.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptors.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptors.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "get_descriptors": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-descriptor_read">descriptor_read</a>



Related item

- [/response/ble/central/descriptor_read](#-response-ble-central-descriptor_read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.read_descriptor.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "read_descriptor": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c"
            }
        }
    }
]
```


###  request: <a name="-request-ble-central-descriptor_write">descriptor_write</a>



Related item

- [/response/ble/central/descriptor_write](#-response-ble-central-descriptor_write)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.write_descriptor.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor.needResponse` |  boolean  | <ul><li>default `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "write_descriptor": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c",
                "data": [16, 34, 242],
                "needResponse": true
            }
        }
    }
]
```






###  response: <a name="-response-ble-central-scan">scan</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.scan_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.scan_result.ble_event_type` |  string  | <ul><li>required</li><li>enum <ul><li>`"connectable_advertisemnt"`</li><li>`"connectable_directed_advertisemnt"`</li><li>`"scannable_advertising"`</li><li>`"non_connectable_advertising"`</li><li>`"scan_response"`</li></ul></li></ul> | &nbsp; |
| `ble.scan_result.device_type` |  string  | <ul><li>required</li><li>enum <ul><li>`"ble"`</li><li>`"dumo"`</li><li>`"breder"`</li></ul></li></ul> | &nbsp; |
| `ble.scan_result.address_type` |  string  | <ul><li>required</li><li>enum <ul><li>`"public"`</li><li>`"random"`</li><li>`"rpa_public"`</li><li>`"rpa_random"`</li></ul></li></ul> | &nbsp; |
| `ble.scan_result.flag` |  integer  | <ul><li>required</li><li>0 &le; value</li></ul> | &nbsp; |
| `ble.scan_result.rssi` |  integer  | <ul><li>required</li><li>value &le; 0</li></ul> | &nbsp; |
| `ble.scan_result.adv_data` | [bleAdvertiseData](#bleadvertisedata)  | &nbsp; | &nbsp; |
| `ble.scan_result.scan_resp` | [bleAdvertiseData](#bleadvertisedata)  | &nbsp; | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "scan_result": {
                "address": "77e754ab8591",
                "ble_event_type": "connectable_advertisemnt",
                "device_type": "ble",
                "address_type": "public",
                "flag": 500,
                "rssi": 500,
                "adv_data": [2, 1, 26, 7, 9, 83, 97, 109, 112, 108, 101],
                "scan_resp": [7, 9, 83, 97, 109, 112, 108, 101]
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-scan_finish">scan_finish</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.scan_result_finish` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "scan_result_finish": true
        }
    }
]
```


###  response: <a name="-response-ble-central-status_update">status_update</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.status_update.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.status_update.status` |  string  | <ul><li>required</li><li>enum <ul><li>`"connected"`</li><li>`"disconnected"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "status_update": {
                "address": "77e754ab8591",
                "status": "connected"
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-service_get">service_get</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_service_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_service_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_service_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-service_get_finish">service_get_finish</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_service_result_finish.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_service_result_finish": {
                "address": "77e754ab8591"
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-characteristic_get">characteristic_get</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_characteristic_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_characteristic_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_characteristic_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_characteristic_result.properties[]` |  string  | <ul><li>enum <ul><li>`"broadcast"`</li><li>`"read"`</li><li>`"write_without_response"`</li><li>`"write"`</li><li>`"notify"`</li><li>`"indicate"`</li><li>`"auth"`</li><li>`"extended_properties"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_characteristic_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "properties": [
                    "broadcast"
                ]
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-characteristic_get_finish">characteristic_get_finish</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_characteristic_result_finish.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_characteristic_result_finish.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_characteristic_result_finish": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-characteristic_write">characteristic_write</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.write_characteristic_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic_result.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "write_characteristic_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "result": "success"
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-characteristic_read">characteristic_read</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.read_characteristic_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_characteristic_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_characteristic_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_characteristic_result.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |
| `ble.read_characteristic_result.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "read_characteristic_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "result": "success",
                "data": [16, 34, 242]
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-characteristic_register_notify">characteristic_register_notify</a>



Related item

- [/request/ble/central/characteristic_register_notify](#-request-ble-central-characteristic_register_notify)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.characteristic_register_notify_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.characteristic_register_notify_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.characteristic_register_notify_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.characteristic_register_notify_result.result` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "characteristic_register_notify_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "result": true
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-characteristic_notify">characteristic_notify</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.nofity_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "nofity_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "data": [16, 34, 242]
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-characteristic_notify">characteristic_notify</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.nofity_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "nofity_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "data": [16, 34, 242]
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-descriptor_get">descriptor_get</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_descriptor_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptor_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptor_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptor_result.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_descriptor_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c"
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-descriptor_get_finish">descriptor_get_finish</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_descriptor_result_finish.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptor_result_finish.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptor_result_finish.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_descriptor_result_finish": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-descriptor_write">descriptor_write</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.write_descriptor_results.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor_results.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor_results.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor_results.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor_results.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "write_descriptor_results": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c",
                "result": "success"
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-descriptor_read">descriptor_read</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.read_descriptor_results.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor_results.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor_results.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor_results.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor_results.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |
| `ble.read_descriptor_results.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "read_descriptor_results": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c",
                "result": "success",
                "data": [16, 34, 242]
            }
        }
    }
]
```


###  response: <a name="-response-ble-central-error">error</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.error.error_code` |  integer  | <ul><li>required</li></ul> | &nbsp; |
| `ble.error.message` |  string  | <ul><li>required</li></ul> | &nbsp; |
| `ble.error.address` | [deviceAddress](#deviceaddress)  | &nbsp; | &nbsp; |
| `ble.error.service_uuid` | [uuidOrNull](#uuidornull)  | &nbsp; | &nbsp; |
| `ble.error.characteristic_uuid` | [uuidOrNull](#uuidornull)  | &nbsp; | &nbsp; |
| `ble.error.descriptor_uuid` | [uuidOrNull](#uuidornull)  | &nbsp; | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "error": {
                "error_code": 0,
                "message": "ERROR MESSAGE",
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c"
            }
        }
    }
]
```




##  <a name="ble-peripheral">ble.peripheral</a>


use obniz as peripheral

###  request: <a name="-request-ble-peripheral-advertisement_start">advertisement_start</a>



Related item

- [/response/ble/peripheral/status](#-response-ble-peripheral-status)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.advertisement.adv_data` | [bleAdvertiseData](#bleadvertisedata)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.advertisement.scan_resp` | [bleAdvertiseData](#bleadvertisedata)  | &nbsp; | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "advertisement": {
                "adv_data": [2, 1, 26, 7, 9, 83, 97, 109, 112, 108, 101],
                "scan_resp": [7, 9, 83, 97, 109, 112, 108, 101]
            }
        }
    }
]
```


###  request: <a name="-request-ble-peripheral-advertisement_stop">advertisement_stop</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.advertisement` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "advertisement": null
        }
    }
]
```


###  request: <a name="-request-ble-peripheral-service_start">service_start</a>
callback of external device connected


Related item

- [/response/ble/peripheral/status](#-response-ble-peripheral-status)
- [/response/ble/peripheral/characteristic_notify_read](#-response-ble-peripheral-characteristic_notify_read)
- [/response/ble/peripheral/characteristic_notify_write](#-response-ble-peripheral-characteristic_notify_write)
- [/response/ble/peripheral/descriptor_notify_read](#-response-ble-peripheral-descriptor_notify_read)
- [/response/ble/peripheral/descriptor_notify_write](#-response-ble-peripheral-descriptor_notify_write)




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.services[].uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.services[].characteristics[].uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.services[].characteristics[].data` | [dataArray](#dataarray)  | &nbsp; | &nbsp; |
| `ble.peripheral.services[].characteristics[].properties[]` |  string  | <ul><li>enum <ul><li>`"broadcast"`</li><li>`"read"`</li><li>`"write_without_response"`</li><li>`"write"`</li><li>`"notify"`</li><li>`"indicate"`</li><li>`"auth"`</li><li>`"extended_properties"`</li></ul></li></ul> | &nbsp; |
| `ble.peripheral.services[].characteristics[].permissions[]` |  string  | <ul><li>default `read,write`</li><li>enum <ul><li>`"read"`</li><li>`"write"`</li></ul></li></ul> | &nbsp; |
| `ble.peripheral.services[].characteristics[].descriptors[].uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.services[].characteristics[].descriptors[].data` | [dataArray](#dataarray)  | &nbsp; | &nbsp; |
| `ble.peripheral.services[].characteristics[].descriptors[].permissions[]` |  string  | <ul><li>default `read,write`</li><li>enum <ul><li>`"read"`</li><li>`"write"`</li></ul></li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "services": [
                    {
                        "uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                        "characteristics": [
                            {
                                "uuid": "8d3591bda71140fd8f9f00535fe57179",
                                "data": [16, 34, 242],
                                "properties": [
                                    "broadcast"
                                ],
                                "permissions": [
                                    [
                                        "read",
                                        "write"
                                    ]
                                ],
                                "descriptors": [
                                    {
                                        "uuid": "d822b53c",
                                        "data": [100, 255, 21, 0, 21],
                                        "permissions": [
                                            [
                                                "read",
                                                "write"
                                            ]
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    }
]
```


###  request: <a name="-request-ble-peripheral-service_stop">service_stop</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.stop_service.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "stop_service": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"
                }
            }
        }
    }
]
```


###  request: <a name="-request-ble-peripheral-service_stop_all">service_stop_all</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": null
        }
    }
]
```


###  request: <a name="-request-ble-peripheral-characteristic_read">characteristic_read</a>
read characteristic on own service


Related item

- [/response/ble/peripheral/characteristic_read](#-response-ble-peripheral-characteristic_read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.read_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "read_characteristic": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
                }
            }
        }
    }
]
```


###  request: <a name="-request-ble-peripheral-characteristic_write">characteristic_write</a>
write characteristic on own service


Related item

- [/response/ble/peripheral/characteristic_write](#-response-ble-peripheral-characteristic_write)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.write_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_characteristic.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "write_characteristic": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "data": [16, 34, 242]
                }
            }
        }
    }
]
```


###  request: <a name="-request-ble-peripheral-descriptor_read">descriptor_read</a>
read descriptor on own service


Related item

- [/response/ble/peripheral/descriptor_read](#-response-ble-peripheral-descriptor_read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.read_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor.descriptor_uuid` | [uuid](#uuid)  | &nbsp; | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "read_descriptor": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c"
                }
            }
        }
    }
]
```


###  request: <a name="-request-ble-peripheral-descriptor_write">descriptor_write</a>
write descriptor on own service


Related item

- [/response/ble/peripheral/descriptor_write](#-response-ble-peripheral-descriptor_write)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.write_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "write_descriptor": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c",
                    "data": [16, 34, 242]
                }
            }
        }
    }
]
```






###  response: <a name="-response-ble-peripheral-status">status</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.connection_status.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.connection_status.status` |  string  | <ul><li>required</li><li>enum <ul><li>`"connected"`</li><li>`"disconnected"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "connection_status": {
                    "address": "77e754ab8591",
                    "status": "connected"
                }
            }
        }
    }
]
```


###  response: <a name="-response-ble-peripheral-characteristic_read">characteristic_read</a>
callback of read characteristic



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.read_characteristic_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_characteristic_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_characteristic_result.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "read_characteristic_result": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "data": [16, 34, 242]
                }
            }
        }
    }
]
```


###  response: <a name="-response-ble-peripheral-characteristic_write">characteristic_write</a>
callback of write characteristic



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.write_characteristic_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_characteristic_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_characteristic_result.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "write_characteristic_result": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "result": "success"
                }
            }
        }
    }
]
```


###  response: <a name="-response-ble-peripheral-characteristic_notify_read">characteristic_notify_read</a>
callback of external device read characteristic



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.notify_read_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_read_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_read_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "notify_read_characteristic": {
                    "address": "77e754ab8591",
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
                }
            }
        }
    }
]
```


###  response: <a name="-response-ble-peripheral-characteristic_notify_write">characteristic_notify_write</a>
callback of external device write characteristic



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.notify_write_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_characteristic.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "notify_write_characteristic": {
                    "address": "77e754ab8591",
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "data": [16, 34, 242]
                }
            }
        }
    }
]
```


###  response: <a name="-response-ble-peripheral-descriptor_read">descriptor_read</a>
callback of read descriptor



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.read_descriptor_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor_result.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor_result.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "read_descriptor_result": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c",
                    "data": [16, 34, 242]
                }
            }
        }
    }
]
```


###  response: <a name="-response-ble-peripheral-descriptor_write">descriptor_write</a>
callback of write descriptor



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.write_descriptor_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor_result.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor_result.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "write_descriptor_result": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c",
                    "result": "success"
                }
            }
        }
    }
]
```


###  response: <a name="-response-ble-peripheral-descriptor_notify_read">descriptor_notify_read</a>
callback of external device read descriptor



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.notify_read_descriptor.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_read_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_read_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_read_descriptor.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "notify_read_descriptor": {
                    "address": "77e754ab8591",
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c"
                }
            }
        }
    }
]
```


###  response: <a name="-response-ble-peripheral-descriptor_notify_write">descriptor_notify_write</a>
callback of external device write descriptor



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.notify_write_descriptor.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_descriptor.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_descriptor.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "notify_write_descriptor": {
                    "address": "77e754ab8591",
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c",
                    "data": [16, 34, 242]
                }
            }
        }
    }
]
```




##  <a name="message">message</a>


send/receive with other obniz or WebHook

###  request: <a name="-request-message-send">send</a>



Related item

- [/response/message/receive](#-response-message-receive)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `message.data` |  anyType  | <ul><li>required</li></ul> | All type of data is pass.&nbsp; |
| `message.to[]` | [obnizId](#obnizid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "message": {
            "data": "button pressed",
            "to": [
                "1234-5678"
            ]
        }
    }
]
```






###  response: <a name="-response-message-receive">receive</a>



Related item

- [/request/message/send](#-request-message-send)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `message.data` |  anyType  | <ul><li>required</li></ul> | All type of data is pass.&nbsp; |
| `message.from` |  string,null  | &nbsp; | From obniz id. Null is used when WebHook message.&nbsp; |



```
//Response Example
[
    {
        "message": {
            "data": "button pressed",
            "from": "1234-5678"
        }
    }
]
```




##  <a name="debug">debug</a>




###  response: <a name="-response-debug-warning">warning</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `debug.warning.message` |  string  | &nbsp; | readable message&nbsp; |



```
//Response Example
[
    {
        "debug": {
            "warning": {
                "message": "unknown command"
            }
        }
    }
]
```


###  response: <a name="-response-debug-error">error</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `debug.error.message` |  string  | &nbsp; | readable message&nbsp; |



```
//Response Example
[
    {
        "debug": {
            "error": {
                "message": "voltage down"
            }
        }
    }
]
```







## type defines



###  <a name="bitarray">bitArray</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>items<br/><ul><li>0 &le; value &le; 1</li></ul></li></ul>  |  <ul><li>`[0, 1, 1, 0, 0, 1, 1, 0]`</li><li>`[0, 0, 1, 0, 0, 0, 0, 0]`</li></ul> | Binary data array represented in 0 1.&nbsp; |



###  <a name="bleadvertisedata">bleAdvertiseData</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>length &le; 31</li><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[2, 1, 26, 7, 9, 83, 97, 109, 112, 108, 101]`</li><li>`[7, 9, 83, 97, 109, 112, 108, 101]`</li></ul> | &nbsp; |



###  <a name="dataarray">dataArray</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[16, 34, 242]`</li><li>`[100, 255, 21, 0, 21]`</li></ul> | Binary data array.&nbsp; |



###  <a name="dataarray1024">dataArray1024</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>length &le; 1024</li><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[100, 255, 21, 0, 21]`</li></ul> | &nbsp; |



###  <a name="dataarray32">dataArray32</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>length &le; 32</li><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[100, 255, 21, 0, 21]`</li></ul> | &nbsp; |



###  <a name="deviceaddress">deviceAddress</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| string | <ul><li>length = 12</li></ul>  |  <ul><li>`"77e754ab8591"`</li></ul> | Bluetooth device id. It&#39;s hexString cannot contain &#39;0x&#39; or &#39;-&#39;.&nbsp; |



###  <a name="imagedata128x64">imageData128x64</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>length = 1024</li><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 16, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 240, 56, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 224, 120, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 255, 192, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 255, 129, 248, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 255, 255, 3, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 255, 254, 7, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 252, 15, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 248, 31, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 255, 240, 63, 255, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 255, 224, 127, 255, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 127, 255, 192, 255, 255, 248, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 255, 255, 129, 255, 255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 255, 255, 3, 255, 255, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 255, 254, 7, 255, 255, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 255, 252, 15, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 248, 31, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 240, 63, 255, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 224, 127, 193, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 15, 252, 64, 255, 128, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 15, 240, 1, 255, 0, 127, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 224, 3, 254, 0, 127, 254, 14, 0, 0, 0, 0, 0, 0, 0, 0, 31, 224, 7, 254, 0, 63, 252, 30, 0, 0, 0, 0, 0, 0, 0, 0, 31, 224, 7, 254, 0, 63, 248, 60, 0, 0, 0, 0, 0, 0, 0, 0, 31, 192, 7, 254, 0, 63, 240, 120, 0, 0, 0, 0, 0, 0, 0, 0, 31, 192, 7, 254, 0, 127, 224, 240, 0, 0, 0, 0, 0, 0, 0, 0, 31, 224, 7, 252, 0, 127, 193, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 224, 15, 248, 0, 255, 131, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 240, 31, 240, 39, 255, 7, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 252, 63, 224, 127, 254, 15, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 255, 192, 255, 252, 31, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 255, 129, 255, 248, 63, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 255, 3, 255, 240, 127, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 254, 7, 255, 224, 255, 224, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 252, 15, 255, 193, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 248, 31, 255, 131, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 240, 63, 255, 7, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 224, 127, 254, 15, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 192, 255, 252, 31, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 129, 255, 0, 63, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 3, 254, 0, 127, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 254, 7, 252, 0, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 252, 15, 252, 0, 255, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 248, 31, 252, 0, 255, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 240, 63, 252, 0, 255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 224, 127, 252, 0, 255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 64, 255, 252, 0, 255, 248, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 255, 254, 1, 255, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 255, 255, 3, 255, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 7, 255, 255, 255, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 255, 255, 255, 128, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 31, 255, 255, 255, 254, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 12, 255, 255, 255, 252, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 255, 255, 240, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 15, 255, 255, 192, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 3, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 63, 224, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]`</li></ul> | Image data bit array.&nbsp; |



###  <a name="obnizid">obnizId</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| string,integer | <ul><li>0 &le; value &le; 99999999</li></ul>  |  <ul><li>`"1234-5678"`</li><li>`12345678`</li></ul> | Obniz id. It can contain &#39;-&#39; or not.&nbsp; |



###  <a name="pinsetting">pinSetting</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| integer | <ul><li>0 &le; value &le; 11</li></ul>  |  <ul><li>`0`</li><li>`1`</li><li>`2`</li><li>`3`</li><li>`4`</li><li>`5`</li><li>`6`</li></ul> | &nbsp; |



###  <a name="uuid">uuid</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| string | <ul><li>4 &le; length &le; 36</li></ul>  |  <ul><li>`"e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"`</li><li>`"8d3591bda71140fd8f9f00535fe57179"`</li><li>`"d822b53c"`</li><li>`"de44"`</li></ul> | Bluetooth uuid. If it contain &#39;-&#39;, it ignored.&nbsp; |



###  <a name="uuidornull">uuidOrNull</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| string,null | <ul><li>4 &le; length &le; 36</li></ul>  |  <ul><li>`"e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"`</li><li>`"8d3591bda71140fd8f9f00535fe57179"`</li><li>`"d822b53c"`</li><li>`"de44"`</li><li>`null`</li></ul> | Bluetooth uuid. If it contain &#39;-&#39;, it ignored.&nbsp; |





