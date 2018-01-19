# BLE
Bluetooth Low Energyでperipheral/centralとして通信ができます

## startAdvertisement()

BLEのAdvertisementを開始します

```Javascript
obniz.ble.startAdvertisement();
obniz.ble.stopAdvertisement();
```



## stopAdvertisement()

BLEのAdvertisementを終了します

```Javascript
obniz.ble.startAdvertisement();
obniz.ble.stopAdvertisement();
```


## setAdvDataRaw(bytes[])

BLEのAdvertisementで出力するデータバイト列を設定します
BLEの規格に従い，bytesの長さは31以下にする必要があります．

Advertisementで出力するデータバイト列を生成するadvDataBuilderも参照ください



```Javascript
obniz.ble.setAdvData([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x02, 0x01, 0x1A  => BLE type for 
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.startAdvertisement();
```

## setAdvData(setting)

settingに渡した引数に従って，BLEのAdvertisementで出力するデータを設定します



```Javascript
obniz.ble.setAdvData({
  flags: ["general_discoverable_mode","br_edr_not_supported"],
  manufacturerData:{
    campanyCode : 0x004C,
    data : [0x02,0x15, 0xC2, 0x8f, 0x0a, 0xd5, 0xa7, 0xfd, 0x48, 0xbe, 0x9f, 0xd0, 0xea, 0xe9, 0xff, 0xd3, 0xa8, 0xbb,0x10,0x00,0x00,0x10,0xFF],
  },
});

obniz.ble.startAdvertisement();
```

設定できるパラメータフォーマットは下記のとおりです．


```Javascript
{
     flags: ["<flag>", ...] // <flag> = "limited_discoverable_mode", "general_discoverable_mode", 
                            //          "br_edr_not_supported", "le_br_edr_controller", "le_br_edr_host"        
     serviceUuids : [ "<service UUID>", ... ],  
     localName : "<name>",
     manufacturerData:{
     	campanyCode : <int>,
        data : [ <int>, ... ],
     },
   
}
```

## setScanRespDataRaw(data[])

BLEのScanResponseで出力するデータバイト列を設定します
BLEの規格に従い，bytesの長さは31以下にする必要があります．

ScanResponseで出力するデータバイト列を生成するscanRespDataBuilderも参照ください

```Javascript
obniz.ble.setScanRespData([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.startAdvertisement();
```



## setScanRespData(setting)

settingに渡した引数に従って，BLEのScan Responseで出力するデータを設定します



```Javascript
obniz.ble.setAdvData({
  localName : "obniz BLE",
});

obniz.ble.startAdvertisement();
```

設定できるパラメータフォーマットは下記のとおりです．


```Javascript
{
     serviceUuids : [ "<service UUID>", ... ],  
     localName : "<name>",
     manufacturerData:{
     	campanyCode : <int>,
        data : [ <int>, ... ],
     },
}
```


