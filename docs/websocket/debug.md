
#  <a name="debug">debug</a>




##  response: <a name="-response-debug-warning">warning</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `debug.warning.message` |  string  | &nbsp; | readable message&nbsp; |



```
//Response Example
[
    {
        "debug": {
            "warning": {
                "message": "unknown command"
            }
        }
    }
]
```


##  response: <a name="-response-debug-error">error</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `debug.error.message` |  string  | &nbsp; | readable message&nbsp; |



```
//Response Example
[
    {
        "debug": {
            "error": {
                "message": "voltage down"
            }
        }
    }
]
```









