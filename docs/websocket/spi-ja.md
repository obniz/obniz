
#  <a name="spi">spi</a>


available spi0, spi1

##  request: <a name="-request-spi-init_master">init_master</a>
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


##  request: <a name="-request-spi-deinit">deinit</a>




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


##  request: <a name="-request-spi-write">write</a>



Related item

- [/response/spi/read](#-response-spi-read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `spiX.data` | [dataArray1024](#dataarray1024)  | <ul><li>required</li></ul> | &nbsp; |
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






##  response: <a name="-response-spi-read">read</a>




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






