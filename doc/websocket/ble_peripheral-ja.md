
#  <a name="ble-peripheral">ble.peripheral</a>


use obniz as peripheral

##  request: <a name="-request-ble-peripheral-advertisement_start">advertisement_start</a>



Related item

- [/response/ble/peripheral/status](#-response-ble-peripheral-status)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.advertisement.adv_data` | [bleAdvertiseData](#bleadvertisedata)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.advertisement.scan_resp` | [bleAdvertiseData](#bleadvertisedata)  | &nbsp; | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "advertisement": {
                "adv_data": [2, 1, 26, 7, 9, 83, 97, 109, 112, 108, 101],
                "scan_resp": [7, 9, 83, 97, 109, 112, 108, 101]
            }
        }
    }
]
```


##  request: <a name="-request-ble-peripheral-advertisement_stop">advertisement_stop</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.advertisement` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "advertisement": null
        }
    }
]
```


##  request: <a name="-request-ble-peripheral-service_start">service_start</a>
callback of external device connected


Related item

- [/response/ble/peripheral/status](#-response-ble-peripheral-status)
- [/response/ble/peripheral/characteristic_notify_read](#-response-ble-peripheral-characteristic_notify_read)
- [/response/ble/peripheral/characteristic_notify_write](#-response-ble-peripheral-characteristic_notify_write)
- [/response/ble/peripheral/descriptor_notify_read](#-response-ble-peripheral-descriptor_notify_read)
- [/response/ble/peripheral/descriptor_notify_write](#-response-ble-peripheral-descriptor_notify_write)




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.services[].uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.services[].characteristics[].uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.services[].characteristics[].data` | [dataArray](#dataarray)  | &nbsp; | &nbsp; |
| `ble.peripheral.services[].characteristics[].properties[]` |  string  | <ul><li>enum <ul><li>`"broadcast"`</li><li>`"read"`</li><li>`"write_without_response"`</li><li>`"write"`</li><li>`"notify"`</li><li>`"indicate"`</li><li>`"auth"`</li><li>`"extended_properties"`</li></ul></li></ul> | &nbsp; |
| `ble.peripheral.services[].characteristics[].permissions[]` |  string  | <ul><li>default `read,write`</li><li>enum <ul><li>`"read"`</li><li>`"read_encrypted"`</li><li>`"read_encrypted_mitm"`</li><li>`"write"`</li><li>`"write_encrypted"`</li><li>`"write_encrypted_mitm"`</li><li>`"write_signed"`</li><li>`"write_signed_mitm"`</li></ul></li></ul> | &nbsp; |
| `ble.peripheral.services[].characteristics[].descriptors[].uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.services[].characteristics[].descriptors[].data` | [dataArray](#dataarray)  | &nbsp; | &nbsp; |
| `ble.peripheral.services[].characteristics[].descriptors[].permissions[]` |  string  | <ul><li>default `read,write`</li><li>enum <ul><li>`"read"`</li><li>`"read_encrypted"`</li><li>`"read_encrypted_mitm"`</li><li>`"write"`</li><li>`"write_encrypted"`</li><li>`"write_encrypted_mitm"`</li><li>`"write_signed"`</li><li>`"write_signed_mitm"`</li></ul></li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "services": [
                    {
                        "uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                        "characteristics": [
                            {
                                "uuid": "8d3591bda71140fd8f9f00535fe57179",
                                "data": [16, 34, 242],
                                "properties": [
                                    "broadcast"
                                ],
                                "permissions": [
                                    [
                                        "read",
                                        "write"
                                    ]
                                ],
                                "descriptors": [
                                    {
                                        "uuid": "d822b53c",
                                        "data": [100, 255, 21, 0, 21],
                                        "permissions": [
                                            [
                                                "read",
                                                "write"
                                            ]
                                        ]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            }
        }
    }
]
```


##  request: <a name="-request-ble-peripheral-service_stop">service_stop</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.stop_service.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "stop_service": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e"
                }
            }
        }
    }
]
```


##  request: <a name="-request-ble-peripheral-service_stop_all">service_stop_all</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral` |  null  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": null
        }
    }
]
```


##  request: <a name="-request-ble-peripheral-characteristic_read">characteristic_read</a>
read characteristic on own service


Related item

- [/response/ble/peripheral/characteristic_read](#-response-ble-peripheral-characteristic_read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.read_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "read_characteristic": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
                }
            }
        }
    }
]
```


##  request: <a name="-request-ble-peripheral-characteristic_write">characteristic_write</a>
write characteristic on own service


Related item

- [/response/ble/peripheral/characteristic_write](#-response-ble-peripheral-characteristic_write)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.write_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_characteristic.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "write_characteristic": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "data": [16, 34, 242]
                }
            }
        }
    }
]
```


##  request: <a name="-request-ble-peripheral-descriptor_read">descriptor_read</a>
read descriptor on own service


Related item

- [/response/ble/peripheral/descriptor_read](#-response-ble-peripheral-descriptor_read)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.read_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor.descriptor_uuid` | [uuid](#uuid)  | &nbsp; | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "read_descriptor": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c"
                }
            }
        }
    }
]
```


##  request: <a name="-request-ble-peripheral-descriptor_write">descriptor_write</a>
write descriptor on own service


Related item

- [/response/ble/peripheral/descriptor_write](#-response-ble-peripheral-descriptor_write)



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.write_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
// Json Example
[
    {
        "ble": {
            "peripheral": {
                "write_descriptor": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c",
                    "data": [16, 34, 242]
                }
            }
        }
    }
]
```






##  response: <a name="-response-ble-peripheral-status">status</a>




| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.connection_status.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.connection_status.status` |  string  | <ul><li>required</li><li>enum <ul><li>`"connected"`</li><li>`"disconnected"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "connection_status": {
                    "address": "77e754ab8591",
                    "status": "connected"
                }
            }
        }
    }
]
```


##  response: <a name="-response-ble-peripheral-characteristic_read">characteristic_read</a>
callback of read characteristic



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.read_characteristic_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_characteristic_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_characteristic_result.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_characteristic_result.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "read_characteristic_result": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "data": [16, 34, 242],
                    "result": "success"
                }
            }
        }
    }
]
```


##  response: <a name="-response-ble-peripheral-characteristic_write">characteristic_write</a>
callback of write characteristic



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.write_characteristic_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_characteristic_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_characteristic_result.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "write_characteristic_result": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "result": "success"
                }
            }
        }
    }
]
```


##  response: <a name="-response-ble-peripheral-characteristic_notify_read">characteristic_notify_read</a>
callback of external device read characteristic



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.notify_read_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_read_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_read_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "notify_read_characteristic": {
                    "address": "77e754ab8591",
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179"
                }
            }
        }
    }
]
```


##  response: <a name="-response-ble-peripheral-characteristic_notify_write">characteristic_notify_write</a>
callback of external device write characteristic



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.notify_write_characteristic.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_characteristic.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_characteristic.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_characteristic.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "notify_write_characteristic": {
                    "address": "77e754ab8591",
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "data": [16, 34, 242]
                }
            }
        }
    }
]
```


##  response: <a name="-response-ble-peripheral-descriptor_read">descriptor_read</a>
callback of read descriptor



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.read_descriptor_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor_result.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor_result.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.read_descriptor_result.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "read_descriptor_result": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c",
                    "data": [16, 34, 242],
                    "result": "success"
                }
            }
        }
    }
]
```


##  response: <a name="-response-ble-peripheral-descriptor_write">descriptor_write</a>
callback of write descriptor



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.write_descriptor_result.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor_result.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor_result.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.write_descriptor_result.result` |  string  | <ul><li>required</li><li>enum <ul><li>`"success"`</li><li>`"failed"`</li></ul></li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "write_descriptor_result": {
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c",
                    "result": "success"
                }
            }
        }
    }
]
```


##  response: <a name="-response-ble-peripheral-descriptor_notify_read">descriptor_notify_read</a>
callback of external device read descriptor



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.notify_read_descriptor.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_read_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_read_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_read_descriptor.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "notify_read_descriptor": {
                    "address": "77e754ab8591",
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c"
                }
            }
        }
    }
]
```


##  response: <a name="-response-ble-peripheral-descriptor_notify_write">descriptor_notify_write</a>
callback of external device write descriptor



| path | type | conditions  | description |
|:---- |:---- |:---- |:---- |
| `ble.peripheral.notify_write_descriptor.address` | [deviceAddress](#deviceaddress)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_descriptor.service_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_descriptor.characteristic_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_descriptor.descriptor_uuid` | [uuid](#uuid)  | <ul><li>required</li></ul> | &nbsp; |
| `ble.peripheral.notify_write_descriptor.data` | [dataArray](#dataarray)  | <ul><li>required</li></ul> | &nbsp; |



```
//Response Example
[
    {
        "ble": {
            "peripheral": {
                "notify_write_descriptor": {
                    "address": "77e754ab8591",
                    "service_uuid": "e1cfb0d1-ae63-4d6f-b3b6-de2054f87e5e",
                    "characteristic_uuid": "8d3591bda71140fd8f9f00535fe57179",
                    "descriptor_uuid": "d822b53c",
                    "data": [16, 34, 242]
                }
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






