
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


##  request: <a name="-request-plugin-exec_lua">exec_lua</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `plugin.exec_lua` |  string  | <ul><li>required</li></ul> | Lua script to be run on target device&nbsp; |



```
// Json Example
[
    {
        "plugin": {
            "exec_lua": "duration = 3"
        }
    }
]
```


##  request: <a name="-request-plugin-reload_lua">reload_lua</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `plugin.reload` |  boolean  | <ul><li>required</li></ul> | Indicate load Lua from storage. This is reloading. It will lose state.&nbsp; |



```
// Json Example
[
    {
        "plugin": {
            "reload": true
        }
    }
]
```


##  request: <a name="-request-plugin-call_request">call_request</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `plugin.call_request.id` |  integer  | <ul><li>required</li><li>0 &le; value &le; 4294967295</li></ul> | transaction id which response will carry back&nbsp; |
| `plugin.call_request.lua` |  string  | <ul><li>required</li></ul> | Lua script to be run on target device&nbsp; |



```
// Json Example
[
    {
        "plugin": {
            "call_request": {
                "id": 2147483647,
                "lua": "return 'hello'"
            }
        }
    }
]
```


##  request: <a name="-request-plugin-cloud_transaction_response">cloud_transaction_response</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `plugin.cloud_transaction_response.id` |  integer  | <ul><li>required</li><li>0 &le; value &le; 4294967295</li></ul> | transaction id which Lua is waiting on&nbsp; |
| `plugin.cloud_transaction_response.success` |  boolean  | <ul><li>required</li></ul> | whether the transaction succeeded&nbsp; |
| `plugin.cloud_transaction_response.result` |  string  | &nbsp; | result string passed back to Lua&nbsp; |



```
// Json Example
[
    {
        "plugin": {
            "cloud_transaction_response": {
                "id": 2147483647,
                "success": true,
                "result": ""
            }
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


##  response: <a name="-response-plugin-error">error</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `plugin.error.message` |  string  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "plugin": {
            "error": {
                "message": "[string \"e\"]:1: syntax error near 'FAILED'"
            }
        }
    }
]
```


##  response: <a name="-response-plugin-call_response">call_response</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `plugin.call_response.id` |  integer  | <ul><li>required</li></ul> | transaction id of the matching callWait request&nbsp; |
| `plugin.call_response.status` |  integer  | <ul><li>required</li></ul> | 0 when Lua finished successfully, 1 on error&nbsp; |
| `plugin.call_response.result` |  string  | &nbsp; | value returned by the Lua script (or error message)&nbsp; |



```
//Response Example
[
    {
        "plugin": {
            "call_response": {
                "id": 500,
                "status": 0,
                "result": "hello from lua"
            }
        }
    }
]
```


##  response: <a name="-response-plugin-cloud_transaction_request">cloud_transaction_request</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `plugin.cloud_transaction_request.id` |  integer  | <ul><li>required</li></ul> | transaction id that the response must carry back&nbsp; |
| `plugin.cloud_transaction_request.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "plugin": {
            "cloud_transaction_request": {
                "id": 500,
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






