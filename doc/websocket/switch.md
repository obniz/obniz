
#  <a name="switch">switch</a>


the switch embed on obniz itself. If it's state is changed, notification will be fired.

##  request: <a name="-request-switch-get">get</a>



Related item

- [/response/switch/change](#-response-switch-change)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `switch` |  string  | <ul><li>required</li><li>const `"get"`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "switch": "get"
    }
]
```






##  response: <a name="-response-switch-change">change</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `switch.state` |  string  | <ul><li>required</li><li>enum <ul><li>`"none"`</li><li>`"push"`</li><li>`"left"`</li><li>`"right"`</li></ul></li></ul> | &nbsp; |
| `switch.action` |  string  | <ul><li>const `"get"`</li></ul> | this is optional and added when user request&nbsp; |



```
//Response Example
[
    {
        "switch": {
            "state": "none",
            "action": "get"
        }
    }
]
```









