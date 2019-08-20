
#  <a name="ws">ws</a>




##  request: <a name="-request-ws-reset_obniz_on_ws_disconnection">reset_obniz_on_ws_disconnection</a>




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






##  response: <a name="-response-ws-ready">ready</a>
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


##  response: <a name="-response-ws-obniz">obniz</a>
target device information



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ws.obniz.hw` |  string  | <ul><li>required</li></ul> | Hardware Identifier String of target device&nbsp; |
| `ws.obniz.firmware` |  string  | <ul><li>required</li></ul> | Installed firmware version of target device&nbsp; |



```
//Response Example
[
    {
        "ws": {
            "obniz": {
                "hw": "obnizb1",
                "firmware": "2.0.0"
            }
        }
    }
]
```


##  response: <a name="-response-ws-redirect">redirect</a>
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









