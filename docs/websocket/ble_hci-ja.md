
#  <a name="ble-hci">ble.hci</a>




##  request: <a name="-request-ble-hci-init">init</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.hci.initialize` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "hci": {
                "initialize": true
            }
        }
    }
]
```


##  request: <a name="-request-ble-hci-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.hci` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "hci": null
        }
    }
]
```


##  request: <a name="-request-ble-hci-write">write</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.hci.write` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "hci": {
                "write": [16, 34, 242]
            }
        }
    }
]
```


##  request: <a name="-request-ble-hci-advertisement_filter">advertisement_filter</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.hci.advertisement_filter[].range.index` |  integer  | <ul><li>required</li><li>0 &le; value &le; 255</li></ul> | &nbsp; |
| `ble.hci.advertisement_filter[].range.length` |  integer  | <ul><li>required</li><li>0 &le; value &le; 255</li></ul> | &nbsp; |
| `ble.hci.advertisement_filter[].value` | [dataArray](#dataarray)  | &nbsp; | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "hci": {
                "advertisement_filter": [
                    {
                        "range": {
                            "index": 127,
                            "length": 127
                        },
                        "value": [16, 34, 242]
                    }
                ]
            }
        }
    }
]
```






##  response: <a name="-response-ble-hci-read">read</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.hci.read.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | HCI data&nbsp; |



```
//Response Example
[
    {
        "ble": {
            "hci": {
                "read": {
                    "data": [16, 34, 242]
                }
            }
        }
    }
]
```






# type defines



##  <a name="dataarray">dataArray</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[16, 34, 242]`</li><li>`[100, 255, 21, 0, 21]`</li></ul> | Binary data array.&nbsp; |






