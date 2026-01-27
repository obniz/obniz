
#  <a name="canbus">canbus</a>


available canbus0

##  request: <a name="-request-canbus-init">init</a>
tx, rx are required for io



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `canbusX.mode` |  string  | <ul><li>required</li><li>enum <ul><li>`"normal"`</li><li>`"noack"`</li><li>`"listen"`</li></ul></li></ul> | &nbsp; |
| `canbusX.tx` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `canbusX.rx` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `canbusX.kbps` |  integer  | <ul><li>required</li><li>1 &le; value &le; 1000</li></ul> | &nbsp; |
| `canbusX.filter_code` |  integer  | <ul><li>required</li><li>0 &le; value &le; 4294967295</li></ul> | &nbsp; |
| `canbusX.filter_mask` |  integer  | <ul><li>required</li><li>0 &le; value &le; 4294967295</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "canbus0": {
            "mode": "normal",
            "tx": 0,
            "rx": 1,
            "kbps": 500,
            "filter_code": 2147483647,
            "filter_mask": 2147483647
        }
    }
]
```


##  request: <a name="-request-canbus-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `canbusX` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "canbus0": null
    }
]
```


##  request: <a name="-request-canbus-send">send</a>



Related item

- [/response/canbus/read](#-response-canbus-read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `canbusX.id` |  integer  | <ul><li>required</li></ul> | &nbsp; |
| `canbusX.data` | [dataArray1024](#dataarray1024)  | <ul><li>required</li></ul> | &nbsp; |
| `canbusX.extended` |  boolean  | &nbsp; | &nbsp; |
| `canbusX.rtr` |  boolean  | &nbsp; | &nbsp; |
| `canbusX.single_shot` |  boolean  | &nbsp; | &nbsp; |
| `canbusX.self_reception` |  boolean  | &nbsp; | &nbsp; |



```
// Json Example
[
    {
        "canbus0": {
            "id": 500,
            "data": [100, 255, 21, 0, 21],
            "extended": false,
            "rtr": false,
            "single_shot": false,
            "self_reception": false
        }
    }
]
```






##  response: <a name="-response-canbus-receive">receive</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `canbusX.id` |  integer  | &nbsp; | &nbsp; |
| `canbusX.data` | [dataArray](#dataarray)  | &nbsp; | &nbsp; |
| `canbusX.extended` |  boolean  | &nbsp; | &nbsp; |
| `canbusX.rtr` |  boolean  | &nbsp; | &nbsp; |



```
//Response Example
[
    {
        "canbus0": {
            "id": 500,
            "data": [16, 34, 242],
            "extended": false,
            "rtr": false
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






