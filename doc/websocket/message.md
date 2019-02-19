
#  <a name="message">message</a>


send/receive with other obniz or WebHook

##  request: <a name="-request-message-send">send</a>



Related item

- [/response/message/receive](#-response-message-receive)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `message.data` |  anyType  | <ul><li>required</li></ul> | All type of data is pass.&nbsp; |
| `message.to[]` | [obnizId](#obnizid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "message": {
            "data": "button pressed",
            "to": [
                "1234-5678"
            ]
        }
    }
]
```






##  response: <a name="-response-message-receive">receive</a>



Related item

- [/request/message/send](#-request-message-send)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `message.data` |  anyType  | <ul><li>required</li></ul> | All type of data is pass.&nbsp; |
| `message.from` |  string,null  | &nbsp; | From obniz id. Null is used when WebHook message.&nbsp; |



```
//Response Example
[
    {
        "message": {
            "data": "button pressed",
            "from": "1234-5678"
        }
    }
]
```






# type defines



##  <a name="obnizid">obnizId</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| string,integer | <ul><li>0 &le; value &le; 99999999</li></ul>  |  <ul><li>`"1234-5678"`</li><li>`12345678`</li></ul> | Obniz id. It can contain &#39;-&#39; or not.&nbsp; |






