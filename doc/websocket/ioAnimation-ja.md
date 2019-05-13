
#  <a name="ioAnimation">ioAnimation</a>


io animation is hardware acceleration for serial sequence change of io. now 'loop' animation is available. it loop io changes regarding json array.

##  request: <a name="-request-ioanimation-init">init</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `io.animation.name` |  string  | <ul><li>required</li><li>1 &le; length &le; 254</li></ul> | Animation name to use pause/resume&nbsp; |
| `io.animation.repeat` |  integer  | <ul><li>default `undefined`</li><li>1 &le; length &le; 4294967295</li></ul> | The limitation number of transitions of states&nbsp; |
| `io.animation.status` |  string  | <ul><li>required</li><li>enum <ul><li>`"loop"`</li><li>`"registrate"`</li></ul></li></ul> | &nbsp; |
| `io.animation.states[].duration` |  integer  | <ul><li>required</li><li>0 &le; value &le; 60000</li></ul> | State duration time(ms)&nbsp; |
| `io.animation.states[].state` |  object,array  | &nbsp; | io/pwm commands.&nbsp; |



```
// Json Example
[
    {
        "io": {
            "animation": {
                "name": "animation-1",
                "status": "loop",
                "states": [
                    {
                        "duration": 500,
                        "state": {
                            "io0": true
                        }
                    },
                    {
                        "duration": 500,
                        "state": {
                            "io0": false
                        }
                    }
                ]
            }
        }
    }
]
```


##  request: <a name="-request-ioanimation-changestate">changeState</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `io.animation.name` |  string  | <ul><li>required</li><li>1 &le; length &le; 254</li></ul> | &nbsp; |
| `io.animation.status` |  string  | <ul><li>required</li><li>enum <ul><li>`"pause"`</li><li>`"resume"`</li></ul></li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io": {
            "animation": {
                "name": "animation-1",
                "status": "pause"
            }
        }
    }
]
```






##  response: <a name="-response-ioanimation-notify">notify</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `io.animation.name` |  string  | <ul><li>required</li><li>1 &le; length &le; 254</li></ul> | animation name which is finished&nbsp; |
| `io.animation.status` |  string  | <ul><li>required</li><li>const `"finish"`</li></ul> | status of an registrated animation&nbsp; |



```
//Response Example
[
    {
        "io": {
            "animation": {
                "name": "animation-1",
                "status": "finish"
            }
        }
    }
]
```









