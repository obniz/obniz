
#  <a name="ble-security">ble.security</a>


set obniz ble security

##  request: <a name="-request-ble-security-indicate_security_level">indicate_security_level</a>
ble indicate security level settings



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.security.security.indicate_security_level` |  integer  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "security": {
                "security": {
                    "indicate_security_level": 500
                }
            }
        }
    }
]
```


##  request: <a name="-request-ble-security-auth">auth</a>
ble auth settings



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.security.security.auth[]` |  string  | <ul><li>enum <ul><li>`"bonding"`</li><li>`"mitm"`</li><li>`"secure_connection"`</li></ul></li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "security": {
                "security": {
                    "auth": [
                        "bonding"
                    ]
                }
            }
        }
    }
]
```


##  request: <a name="-request-ble-security-key_type">key_type</a>
ble encription key type settings



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.security.security.key.type[]` |  string  | <ul><li>enum <ul><li>`"ltk"`</li><li>`"irk"`</li><li>`"csrk"`</li></ul></li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "security": {
                "security": {
                    "key": {
                        "type": [
                            "ltk"
                        ]
                    }
                }
            }
        }
    }
]
```


##  request: <a name="-request-ble-security-key_max_size">key_max_size</a>
ble encryption key max size setting (7~16byte)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.security.security.key.max_size` |  integer  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "security": {
                "security": {
                    "key": {
                        "max_size": 500
                    }
                }
            }
        }
    }
]
```


##  request: <a name="-request-ble-security-devices_clear">devices_clear</a>
Clear bonding devices list



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.security.security.devices.clear` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "security": {
                "security": {
                    "devices": {
                        "clear": true
                    }
                }
            }
        }
    }
]
```









