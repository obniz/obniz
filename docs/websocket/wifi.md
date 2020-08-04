
#  <a name="wifi">wifi</a>


wifi command

##  request: <a name="-request-wifi-scan">scan</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `wifi.scan` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "wifi": {
            "scan": true
        }
    }
]
```






##  response: <a name="-response-wifi-scan">scan</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `wifi.scan.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | wifi scan data&nbsp; |



```
//Response Example
[
    {
        "wifi": {
            "scan": {
                "data": [16, 34, 242]
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






