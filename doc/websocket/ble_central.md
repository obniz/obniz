
#  <a name="ble-central">ble.central</a>


use obniz as central

##  request: <a name="-request-ble-central-scan_start">scan_start</a>



Related item

- [/response/ble/central/scan](#-response-ble-central-scan)
- [/response/ble/central/scan_finish](#-response-ble-central-scan_finish)




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.scan.duration` |  integer  | <ul><li>default `30`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "scan": {
                "duration": 30
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-scan_stop">scan_stop</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.scan` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "scan": null
        }
    }
]
```


##  request: <a name="-request-ble-central-connect">connect</a>



Related item

- [/response/ble/central/status_update](#-response-ble-central-status_update)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.connect.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "connect": {
                "address": "77e754ab8591"
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-disconnect">disconnect</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.disconnect.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "disconnect": {
                "address": "77e754ab8591"
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-service_get">service_get</a>



Related item

- [/response/ble/central/service_get](#-response-ble-central-service_get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_services.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "get_services": {
                "address": "77e754ab8591"
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-characteristic_get">characteristic_get</a>



Related item

- [/response/ble/central/characteristic_get](#-response-ble-central-characteristic_get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_characteristics.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_characteristics.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "get_characteristics": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-characteristic_read">characteristic_read</a>



Related item

- [/response/ble/central/characteristic_read](#-response-ble-central-characteristic_read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.read_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "read_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-characteristic_write">characteristic_write</a>



Related item

- [/response/ble/central/characteristic_write](#-response-ble-central-characteristic_write)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.write_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic.needResponse` |  boolean  | <ul><li>default `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "write_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "data": [16, 34, 242],
                "needResponse": true
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-characteristic_register_notify">characteristic_register_notify</a>



Related item

- [/response/ble/central/characteristic_register_notify](#-response-ble-central-characteristic_register_notify)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.register_notify_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.register_notify_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.register_notify_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "register_notify_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-characteristic_unregister_notify">characteristic_unregister_notify</a>



Related item

- [/response/ble/central/characteristic_unregister_notify](#-response-ble-central-characteristic_unregister_notify)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.unregister_notify_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.unregister_notify_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.unregister_notify_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "unregister_notify_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-descriptor_get">descriptor_get</a>



Related item

- [/response/ble/central/descriptor_get](#-response-ble-central-descriptor_get)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_descriptors.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptors.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptors.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "get_descriptors": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-descriptor_read">descriptor_read</a>



Related item

- [/response/ble/central/descriptor_read](#-response-ble-central-descriptor_read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.read_descriptor.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "read_descriptor": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c"
            }
        }
    }
]
```


##  request: <a name="-request-ble-central-descriptor_write">descriptor_write</a>



Related item

- [/response/ble/central/descriptor_write](#-response-ble-central-descriptor_write)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.write_descriptor.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor.needResponse` |  boolean  | <ul><li>default `true`</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "write_descriptor": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c",
                "data": [16, 34, 242],
                "needResponse": true
            }
        }
    }
]
```






##  response: <a name="-response-ble-central-scan">scan</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.scan_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.scan_result.ble_event_type` |  string  | <ul><li>required</li><li>enum <ul><li>`"connectable_advertisemnt"`</li><li>`"connectable_directed_advertisemnt"`</li><li>`"scannable_advertising"`</li><li>`"non_connectable_advertising"`</li><li>`"scan_response"`</li></ul></li></ul> | &nbsp; |
| `ble.scan_result.device_type` |  string  | <ul><li>required</li><li>enum <ul><li>`"ble"`</li><li>`"dumo"`</li><li>`"breder"`</li></ul></li></ul> | &nbsp; |
| `ble.scan_result.address_type` |  string  | <ul><li>required</li><li>enum <ul><li>`"public"`</li><li>`"random"`</li><li>`"rpa_public"`</li><li>`"rpa_random"`</li></ul></li></ul> | &nbsp; |
| `ble.scan_result.flag` |  integer  | <ul><li>required</li><li>0 &le; value</li></ul> | &nbsp; |
| `ble.scan_result.rssi` |  integer  | <ul><li>required</li><li>value &le; 0</li></ul> | &nbsp; |
| `ble.scan_result.adv_data` | [bleAdvertiseData](#bleadvertisedata)  | &nbsp; | &nbsp; |
| `ble.scan_result.scan_resp` | [bleAdvertiseData](#bleadvertisedata)  | &nbsp; | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "scan_result": {
                "address": "77e754ab8591",
                "ble_event_type": "connectable_advertisemnt",
                "device_type": "ble",
                "address_type": "public",
                "flag": 500,
                "rssi": 500,
                "adv_data": [2, 1, 26, 7, 9, 83, 97, 109, 112, 108, 101],
                "scan_resp": [7, 9, 83, 97, 109, 112, 108, 101]
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-scan_finish">scan_finish</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.scan_result_finish` |  boolean  | <ul><li>required</li><li>const `true`</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "scan_result_finish": true
        }
    }
]
```


##  response: <a name="-response-ble-central-status_update">status_update</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.status_update.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.status_update.status` |  string  | <ul><li>required</li><li>enum <ul><li>`"connected"`</li><li>`"disconnected"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "status_update": {
                "address": "77e754ab8591",
                "status": "connected"
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-service_get">service_get</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_service_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_service_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_service_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-service_get_finish">service_get_finish</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_service_result_finish.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_service_result_finish": {
                "address": "77e754ab8591"
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-characteristic_get">characteristic_get</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_characteristic_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_characteristic_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_characteristic_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_characteristic_result.properties[]` |  string  | <ul><li>enum <ul><li>`"broadcast"`</li><li>`"read"`</li><li>`"write_without_response"`</li><li>`"write"`</li><li>`"notify"`</li><li>`"indicate"`</li><li>`"auth"`</li><li>`"extended_properties"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_characteristic_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "properties": [
                    "broadcast"
                ]
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-characteristic_get_finish">characteristic_get_finish</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_characteristic_result_finish.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_characteristic_result_finish.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_characteristic_result_finish": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-characteristic_write">characteristic_write</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.write_characteristic_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_characteristic_result.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "write_characteristic_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "result": "success"
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-characteristic_read">characteristic_read</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.read_characteristic_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_characteristic_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_characteristic_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_characteristic_result.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |
| `ble.read_characteristic_result.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "read_characteristic_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "result": "success",
                "data": [16, 34, 242]
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-characteristic_register_notify">characteristic_register_notify</a>



Related item

- [/request/ble/central/characteristic_register_notify](#-request-ble-central-characteristic_register_notify)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.characteristic_register_notify_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.characteristic_register_notify_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.characteristic_register_notify_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.characteristic_register_notify_result.result` |  boolean  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "characteristic_register_notify_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "result": true
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-characteristic_notify">characteristic_notify</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.nofity_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "nofity_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "data": [16, 34, 242]
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-characteristic_notify">characteristic_notify</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.nofity_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.nofity_characteristic.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "nofity_characteristic": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "data": [16, 34, 242]
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-descriptor_get">descriptor_get</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_descriptor_result.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptor_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptor_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptor_result.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_descriptor_result": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c"
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-descriptor_get_finish">descriptor_get_finish</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.get_descriptor_result_finish.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptor_result_finish.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.get_descriptor_result_finish.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "get_descriptor_result_finish": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-descriptor_write">descriptor_write</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.write_descriptor_results.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor_results.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor_results.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor_results.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.write_descriptor_results.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "write_descriptor_results": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c",
                "result": "success"
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-descriptor_read">descriptor_read</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.read_descriptor_results.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor_results.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor_results.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor_results.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.read_descriptor_results.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |
| `ble.read_descriptor_results.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "read_descriptor_results": {
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c",
                "result": "success",
                "data": [16, 34, 242]
            }
        }
    }
]
```


##  response: <a name="-response-ble-central-error">error</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.error.error_code` |  integer  | <ul><li>required</li></ul> | &nbsp; |
| `ble.error.module_error_code` |  integer  | &nbsp; | &nbsp; |
| `ble.error.function_code` |  integer  | &nbsp; | &nbsp; |
| `ble.error.message` |  string  | <ul><li>required</li></ul> | &nbsp; |
| `ble.error.address` | [deviceAddress](#deviceaddress)  | &nbsp; | &nbsp; |
| `ble.error.service_uuid` | [uuidOrNull](#uuidornull)  | &nbsp; | &nbsp; |
| `ble.error.characteristic_uuid` | [uuidOrNull](#uuidornull)  | &nbsp; | &nbsp; |
| `ble.error.descriptor_uuid` | [uuidOrNull](#uuidornull)  | &nbsp; | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "error": {
                "error_code": 0,
                "module_error_code": 0,
                "function_code": 0,
                "message": "ERROR MESSAGE",
                "address": "77e754ab8591",
                "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                "descriptor_uuid": "d822b53c"
            }
        }
    }
]
```






# type defines



##  <a name="bleadvertisedata">bleAdvertiseData</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>length &le; 31</li><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[2, 1, 26, 7, 9, 83, 97, 109, 112, 108, 101]`</li><li>`[7, 9, 83, 97, 109, 112, 108, 101]`</li></ul> | &nbsp; |



##  <a name="dataarray">dataArray</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| array | <ul><li>items<br/><ul><li>0 &le; value &le; 255</li></ul></li></ul>  |  <ul><li>`[16, 34, 242]`</li><li>`[100, 255, 21, 0, 21]`</li></ul> | Binary data array.&nbsp; |



##  <a name="deviceaddress">deviceAddress</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| string | <ul><li>length = 12</li></ul>  |  <ul><li>`"77e754ab8591"`</li></ul> | Bluetooth device id. It&#39;s hexString cannot contain &#39;0x&#39; or &#39;-&#39;.&nbsp; |



##  <a name="uuid">uuid</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| string | <ul><li>4 &le; length &le; 36</li></ul>  |  <ul><li>`"e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"`</li><li>`"8d3591bda71140fd8f9f00535fe57179"`</li><li>`"d822b53c"`</li><li>`"de44"`</li></ul> | Bluetooth uuid. If it contain &#39;-&#39;, it ignored.&nbsp; |



##  <a name="uuidornull">uuidOrNull</a>
| type | conditions | examples | description |
|:----|:----|:----|:----|
| string,null | <ul><li>4 &le; length &le; 36</li></ul>  |  <ul><li>`"e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"`</li><li>`"8d3591bda71140fd8f9f00535fe57179"`</li><li>`"d822b53c"`</li><li>`"de44"`</li><li>`null`</li></ul> | Bluetooth uuid. If it contain &#39;-&#39;, it ignored.&nbsp; |






