
#  <a name="io">io</a>


General purpose IO available on each io (io0 to io11).

##  request: <a name="-request-io-input">input</a>



Related item

- [/response/io/get](#-response-io-get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX` |  string  | <ul><li>required</li><li>const `"get"`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io0": "get"
    }
]
```


##  request: <a name="-request-io-input_detail">input_detail</a>



Related item

- [/response/io/get](#-response-io-get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX.direction` |  string  | <ul><li>required</li><li>const `"input"`</li></ul> | &nbsp; |
| `ioX.stream` |  boolean  | &nbsp; | enable stream callback when value change&nbsp; |



```
// Json Example
[
    {
        "io0": {
            "direction": "input",
            "stream": false
        }
    }
]
```


##  request: <a name="-request-io-output">output</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io0": true
    }
]
```


##  request: <a name="-request-io-output_detail">output_detail</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX.direction` |  string  | <ul><li>required</li><li>const `"output"`</li></ul> | &nbsp; |
| `ioX.value` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io0": {
            "direction": "output",
            "value": true
        }
    }
]
```


##  request: <a name="-request-io-output_type">output_type</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX.output_type` |  string  | <ul><li>required</li><li>enum <ul><li>`"push-pull5v"`</li><li>`"push-pull3v"`</li><li>`"open-drain"`</li></ul></li></ul> | drive type&nbsp; |



```
// Json Example
[
    {
        "io0": {
            "output_type": "push-pull5v"
        }
    }
]
```


##  request: <a name="-request-io-pull_type">pull_type</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX.pull_type` |  string  | <ul><li>required</li><li>enum <ul><li>`"pull-up5v"`</li><li>`"pull-up3v"`</li><li>`"pull-down"`</li><li>`"float"`</li></ul></li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io0": {
            "pull_type": "pull-up5v"
        }
    }
]
```


##  request: <a name="-request-io-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "io0": null
    }
]
```






##  response: <a name="-response-io-get">get</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ioX` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "io0": true
    }
]
```









