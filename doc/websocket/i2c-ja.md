
#  <a name="i2c">i2c</a>


available only i2c0

##  request: <a name="-request-i2c-init_master">init_master</a>
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


##  request: <a name="-request-i2c-init_slave">init_slave</a>



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


##  request: <a name="-request-i2c-write">write</a>
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


##  request: <a name="-request-i2c-read">read</a>
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


##  request: <a name="-request-i2c-deinit">deinit</a>




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






##  response: <a name="-response-i2c-master">master</a>




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


##  response: <a name="-response-i2c-slave">slave</a>




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






# type defines



##  <a name="dataarray">dataArray</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[16, 34, 242]`</li><li>`[100, 255, 21, 0, 21]`</li></ul> | Binary data array.&nbsp; |



##  <a name="dataarray1024">dataArray1024</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>length &le; 1024</li><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[100, 255, 21, 0, 21]`</li></ul> | &nbsp; |



##  <a name="pinsetting">pinSetting</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| integer | <ul><li>0 &le; value &le; 40</li></ul>  |  <ul><li>`0`</li><li>`1`</li><li>`2`</li><li>`3`</li><li>`4`</li><li>`5`</li><li>`6`</li></ul> | &nbsp; |






