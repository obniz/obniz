
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
| `ws.obniz.metadata` |  string  | &nbsp; | device metadata user set on cloud&nbsp; |
| `ws.obniz.connected_network.online_at` |  number  | <ul><li>required</li></ul> | Epoch Unix Timestamp (seconds) at device become online on the cloud&nbsp; |
| `ws.obniz.connected_network.net` |  string  | &nbsp; | Current connected network type. Defined in setting json&nbsp; |
| `ws.obniz.connected_network.local_ip` |  string  | &nbsp; | Local IP if exist&nbsp; |
| `ws.obniz.connected_network.global_ip` |  string  | &nbsp; | Global IP if exist&nbsp; |
| `ws.obniz.connected_network.wifi.ssid` |  string  | <ul><li>required</li></ul> | Current connected Accespoint SSID&nbsp; |
| `ws.obniz.connected_network.wifi.mac_address` |  string  | <ul><li>required</li></ul> | Current connected Accespoint MacAddress&nbsp; |
| `ws.obniz.connected_network.wifi.rssi` |  number  | <ul><li>required</li></ul> | Current RSSI for connected Accesspoint. RSSI is mesured only on connection timing&nbsp; |
| `ws.obniz.connected_network.wifimesh.meshid` |  string  | &nbsp; | MESH ID of Currently joined MESH network&nbsp; |
| `ws.obniz.connected_network.wifimesh.parent_obniz_id` |  string  | <ul><li>required</li></ul> | Id of parent node&nbsp; |
| `ws.obniz.connected_network.wifimesh.root_obniz_id` |  string  | <ul><li>required</li></ul> | Id of parent node&nbsp; |
| `ws.obniz.connected_network.wifimesh.layer` |  number  | <ul><li>required</li></ul> | Depth of MESH network. layer=1 is root node of a network.&nbsp; |
| `ws.obniz.connected_network.wifimesh.rssi` |  number  | <ul><li>required</li></ul> | Current RSSI for connected Accesspoint.&nbsp; |



```
//Response Example
[
    {
        "ws": {
            "obniz": {
                "hw": "obnizb1",
                "firmware": "2.0.0",
                "metadata": "{\"description\":\"At My Office\"}",
                "connected_network": {
                    "online_at": 1637685862,
                    "net": "wirelesslan",
                    "local_ip": "192.168.0.100",
                    "global_ip": "201.200.199.198",
                    "wifi": {
                        "ssid": "obniz-wifi",
                        "mac_address": "0123456789AB",
                        "rssi": "-40"
                    },
                    "wifimesh": {
                        "meshid": "012345678901",
                        "parent_obniz_id": "0000-0000",
                        "root_obniz_id": "0000-0000",
                        "layer": 1,
                        "rssi": "-40"
                    }
                }
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









