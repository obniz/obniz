
#  <a name="logicAnalyzer">logicAnalyzer</a>


Monitor io logic level changes by sampling io.

##  request: <a name="-request-logicanalyzer-init">init</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `logic_analyzer.io[]` | [pinSetting](#pinsetting)  | <ul><li>required</li></ul> | &nbsp; |
| `logic_analyzer.interval` |  number  | <ul><li>required</li><li>0 < value</li></ul> | &nbsp; |
| `logic_analyzer.duration` |  integer  | <ul><li>required</li><li>0 < value</li></ul> | &nbsp; |
| `logic_analyzer.trigger.value` |  boolean  | <ul><li>required</li></ul> | start value&nbsp; |
| `logic_analyzer.trigger.samples` |  integer  | <ul><li>required</li><li>0 &le; value</li></ul> | how that values consists&nbsp; |


With below sample code, you will receive only data which start with &#39;false, false, false&#39; 3bit.
```
// Json Example
[
    {
        "logic_analyzer": {
            "io": [ 0],
            "interval": 500,
            "duration": 500,
            "trigger": {
                "value": false,
                "samples": 3
            }
        }
    }
]
```


##  request: <a name="-request-logicanalyzer-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `logic_analyzer` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "logic_analyzer": null
    }
]
```






# type defines



##  <a name="pinsetting">pinSetting</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| integer | <ul><li>0 &le; value &le; 40</li></ul>  |  <ul><li>`0`</li><li>`1`</li><li>`2`</li><li>`3`</li><li>`4`</li><li>`5`</li><li>`6`</li></ul> | &nbsp; |






