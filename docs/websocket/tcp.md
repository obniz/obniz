
#  <a name="tcp">tcp</a>


tcp command

##  request: <a name="-request-tcp-connect">connect</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `tcpX.connect.port` |  integer  | <ul><li>required</li><li>0 &le; value &le; 65535</li></ul> | TCP port&nbsp; |
| `tcpX.connect.domain` |  string  | <ul><li>required</li><li>length &le; 30</li></ul> | Server Domain&nbsp; |



```
// Json Example
[
    {
        "tcp0": {
            "connect": {
                "port": 32767,
                "domain": "obniz.io"
            }
        }
    }
]
```


##  request: <a name="-request-tcp-disconnect">disconnect</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `tcpX.disconnect` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "tcp0": {
            "disconnect": true
        }
    }
]
```


##  request: <a name="-request-tcp-write">write</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `tcpX.write.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | TCP data&nbsp; |



```
// Json Example
[
    {
        "tcp0": {
            "write": {
                "data": [16, 34, 242]
            }
        }
    }
]
```






##  response: <a name="-response-tcp-read">read</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `tcpX.read.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | TCP data&nbsp; |



```
//Response Example
[
    {
        "tcp0": {
            "read": {
                "data": [16, 34, 242]
            }
        }
    }
]
```


##  response: <a name="-response-tcp-connect">connect</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `tcpX.connect.message` |  string  | <ul><li>required</li><li>enum <ul><li>`"ok"`</li><li>`"Port Used"`</li><li>`"Port Area Error"`</li><li>`"Lookup Error"`</li><li>`"Error"`</li></ul></li></ul> | &nbsp; |
| `tcpX.connect.code` |  number  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "tcp0": {
            "connect": {
                "message": "ok",
                "code": 500
            }
        }
    }
]
```


##  response: <a name="-response-tcp-connection">connection</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `tcpX.connection.connected` |  boolean  | &nbsp; | &nbsp; |



```
//Response Example
[
    {
        "tcp0": {
            "connection": {
                "connected": true
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






