
#  <a name="measure">measure</a>




##  request: <a name="-request-measure-echo">echo</a>
It measures pulse response.


Related item

- [/response/measure/echo](#-response-measure-echo)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `measure.echo.io_pulse` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `measure.echo.io_echo` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `measure.echo.pulse` |  string  | <ul><li>default `positive`</li><li>enum <ul><li>`"positive"`</li><li>`"negative"`</li></ul></li></ul> | &nbsp; |
| `measure.echo.pulse_width` |  number  | <ul><li>required</li><li>0.001 &le; value &le; 1000</li></ul> | &nbsp; |
| `measure.echo.measure_edges` |  integer  | <ul><li>1 &le; value &le; 4</li></ul> | &nbsp; |
| `measure.echo.timeout` |  number  | <ul><li>default `1000`</li><li>0.001 &le; value &le; 1000</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "measure": {
            "echo": {
                "io_pulse": 0,
                "io_echo": 1,
                "pulse": "positive",
                "pulse_width": 500,
                "measure_edges": 2,
                "timeout": 1000
            }
        }
    }
]
```






##  response: <a name="-response-measure-echo">echo</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `measure.echo[].edge` |  boolean  | <ul><li>required</li></ul> | rising = true&nbsp; |
| `measure.echo[].timing` |  number  | <ul><li>required</li></ul> | milliseconds from end of pulse&nbsp; |



```
//Response Example
[
    {
        "measure": {
            "echo": [
                {
                    "edge": true,
                    "timing": 500
                }
            ]
        }
    }
]
```






# type defines



##  <a name="pinsetting">pinSetting</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| integer | <ul><li>0 &le; value &le; 40</li></ul>  |  <ul><li>`0`</li><li>`1`</li><li>`2`</li><li>`3`</li><li>`4`</li><li>`5`</li><li>`6`</li></ul> | &nbsp; |






