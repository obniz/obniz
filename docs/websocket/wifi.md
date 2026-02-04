
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
| `wifi.scan[].ssid` |  string  | <ul><li>required</li></ul> | &nbsp; |
| `wifi.scan[].macAddress` |  string  | <ul><li>required</li></ul> | &nbsp; |
| `wifi.scan[].rssi` |  integer  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "wifi": {
            "scan": [
                {
                    "ssid": "obniz-wifi",
                    "macAddress": "001122aabbcc",
                    "rssi": 500
                }
            ]
        }
    }
]
```









