
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
reset obniz when obniz gone to offline.



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






# type defines



##  <a name="dataarray">dataArray</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[16, 34, 242]`</li><li>`[100, 255, 21, 0, 21]`</li></ul> | Binary data array.&nbsp; |






