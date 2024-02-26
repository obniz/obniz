
#  <a name="plugin">plugin</a>


plugin command

##  request: <a name="-request-plugin-send">send</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `plugin.send` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "plugin": {
            "send": [16, 34, 242]
        }
    }
]
```






##  response: <a name="-response-plugin-receive">receive</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `plugin.receive` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "plugin": {
            "receive": [16, 34, 242]
        }
    }
]
```


##  response: <a name="-response-plugin-frame">frame</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `plugin.frame.start.id` |  number  | &nbsp; | Frame Identifer number&nbsp; |
| `plugin.frame.start.length` |  number  | <ul><li>required</li></ul> | Frame Total length&nbsp; |
| `plugin.frame.end.length` |  number  | &nbsp; | &nbsp; |



```
//Response Example
[
    {
        "plugin": {
            "frame": {
                "start": {
                    "id": 100,
                    "length": 10000
                },
                "end": {
                    "length": 500
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






