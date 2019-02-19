
#  <a name="ad">ad</a>


available ad0~ad11

##  request: <a name="-request-ad-get">get</a>



Related item

- [/response/ad/get](#-response-ad-get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `adX.stream` |  boolean  | <ul><li>required</li></ul> | true to continuous notifying on voltage change.&nbsp; |



```
// Json Example
[
    {
        "ad0": {
            "stream": false
        }
    }
]
```


##  request: <a name="-request-ad-deinit">deinit</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `adX` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ad0": null
    }
]
```






##  response: <a name="-response-ad-get">get</a>
current value (volt)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `adX` |  number  | <ul><li>required</li><li>0 &le; value &le; 5</li></ul> | current value (volt)&nbsp; |



```
//Response Example
[
    {
        "ad0": 3.3
    }
]
```









