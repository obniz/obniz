
#  <a name="system">system</a>




##  request: <a name="-request-system-wait">wait</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.wait` |  integer  | <ul><li>required</li></ul> | wait time (ms)&nbsp; |



```
// Json Example
[
    {
        "system": {
            "wait": 500
        }
    }
]
```


##  request: <a name="-request-system-reset">reset</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.reset` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "system": {
            "reset": true
        }
    }
]
```


##  request: <a name="-request-system-reboot">reboot</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.reboot` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "system": {
            "reboot": true
        }
    }
]
```


##  request: <a name="-request-system-selfcheck">selfCheck</a>
circuit IO check



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.self_check` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "system": {
            "self_check": true
        }
    }
]
```


##  request: <a name="-request-system-keepworkingatoffline">keepWorkingAtOffline</a>
reset obniz Board when obniz Board gone to offline.



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.keep_working_at_offline` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "system": {
            "keep_working_at_offline": true
        }
    }
]
```


##  request: <a name="-request-system-ping">ping</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.ping.key` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "system": {
            "ping": {
                "key": [16, 34, 242]
            }
        }
    }
]
```


##  request: <a name="-request-system-sleepseconds">sleepSeconds</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.sleep_seconds` |  integer  | <ul><li>required</li></ul> | sleep time (seconds)&nbsp; |



```
// Json Example
[
    {
        "system": {
            "sleep_seconds": 500
        }
    }
]
```


##  request: <a name="-request-system-sleepminute">sleepMinute</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.sleep_minute` |  integer  | <ul><li>required</li></ul> | sleep time (minute)&nbsp; |



```
// Json Example
[
    {
        "system": {
            "sleep_minute": 500
        }
    }
]
```


##  request: <a name="-request-system-sleepiotrigger">sleepIoTrigger</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.sleep_io_trigger` |  boolean  | <ul><li>required</li></ul> | true:Wake up on rising edge false:Wake up on falling edge&nbsp; |



```
// Json Example
[
    {
        "system": {
            "sleep_io_trigger": true
        }
    }
]
```


##  request: <a name="-request-system-set_clock">set_clock</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.clock` |  integer  | <ul><li>required</li></ul> | Set the clock (Unix timestamp in milliseconds). This will be set to device immediately and used as device timestamp&nbsp; |



```
// Json Example
[
    {
        "system": {
            "clock": 1592171234567
        }
    }
]
```


##  request: <a name="-request-system-queue_mode">queue_mode</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.queue_mode.interval` |  integer  | &nbsp; | Set interval of transmission queue of device. Unit is milliseconds. Default is 0ms&nbsp; |
| `system.queue_mode.timestamp` |  string  | <ul><li>enum <ul><li>`"none"`</li><li>`"unix_seconds"`</li><li>`"unix_milliseconds"`</li></ul></li></ul> | Set timestamp mode. In timestamp mode, device add timestamp to every commands. Default is none. sec use 4 bytes and millisec use 8 bytes&nbsp; |



```
// Json Example
[
    {
        "system": {
            "queue_mode": {
                "interval": 1000,
                "timestamp": "none"
            }
        }
    }
]
```






##  response: <a name="-response-system-pong">pong</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.pong.key` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "system": {
            "pong": {
                "key": [16, 34, 242]
            }
        }
    }
]
```


##  response: <a name="-response-system-timestamp">timestamp</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `system.timestamp` |  number  | <ul><li>required</li></ul> | The timestamp in milliseconds since epoch (1970-01-01T00:00:00Z).&nbsp; |



```
//Response Example
[
    {
        "system": {
            "timestamp": 1592171234567
        }
    }
]
```






# type defines



##  <a name="dataarray">dataArray</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[16, 34, 242]`</li><li>`[100, 255, 21, 0, 21]`</li></ul> | Binary data array.&nbsp; |






