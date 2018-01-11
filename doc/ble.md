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


## setAdvData(bytes[])

BLEのAdvertisementで出力するデータバイト列を設定します
BLEの規格に従い，bytesの長さは31以下にする必要があります．

Advertisementで出力するデータバイト列を生成するadvDataBuilderも参照ください



```Javascript
obniz.ble.setAdvData([0x02, 0x01, 0x1A, 0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x02, 0x01, 0x1A  => BLE type for 
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.startAdvertisement();
```


## setScanRespData(data[])

BLEのScanResponseで出力するデータバイト列を設定します
BLEの規格に従い，bytesの長さは31以下にする必要があります．

ScanResponseで出力するデータバイト列を生成するscanRespDataBuilderも参照ください

```Javascript
obniz.ble.setScanRespData([0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65 ]);
//0x07, 0x09, 0x53, 0x61, 0x6D, 0x70, 0x6C, 0x65  => Set name

obniz.ble.startAdvertisement();
```


## advDataBulider()

Advertiseで出力するデータバイト列のビルダーを生成します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setLeGeneralDiscoverableModeFlag();
advBuilder.setBrEdrNotSupportedFlag();
advBuilder.setCompleteLocalName("obniz ble");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```



## advDataBulider build()

設定に従ってデータバイト列を生成します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setLeGeneralDiscoverableModeFlag();
advBuilder.setBrEdrNotSupportedFlag();
advBuilder.setCompleteLocalName("obniz ble");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```


## advDataBulider setFlags()

AdvertiseのFlagを設定します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setFlags(0x06);
advBuilder.setCompleteLocalName("obniz ble");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```

## advDataBulider setLeLimitedDiscoverableModeFlag()



AdvertiseのLE Limited Discoverable Mode Flag(0x01)を設定します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setLeLimitedDiscoverableModeFlag();
advBuilder.setCompleteLocalName("obniz ble");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```


## advDataBulider setLeGeneralDiscoverableModeFlag()



AdvertiseのLE General Discoverable Mode Flag(0x02)を設定します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setLeGeneralDiscoverableModeFlag();
advBuilder.setCompleteLocalName("obniz ble");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```

## advDataBulider setBrEdrNotSupportedFlag()



AdvertiseのBR/EDR Not Supported Flag(0x04)を設定します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setBrEdrNotSupportedFlag();
advBuilder.setCompleteLocalName("obniz ble");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```

## advDataBulider setLeBrEdrControllerFlag()



AdvertiseのSimultaneous LE and BR/ERD to Same Device Capable(Controller)(0x08)を設定します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setLeBrEdrControllerFlag();
advBuilder.setLeBrEdrHostFlag();
advBuilder.setCompleteLocalName("obniz ble");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```

## advDataBulider setLeBrEdrHostFlag()



Advertiseの Simultaneous LE and BR/ERD to Same Device Capable(Host)(0x08)を設定します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setLeBrEdrControllerFlag();
advBuilder.setLeBrEdrHostFlag();
advBuilder.setCompleteLocalName("obniz ble");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```

## advDataBulider setLeLimitedDiscoverableModeFlag()



AdvertiseのLE General Discoverable Mode Flag(0x02)を設定します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setLeLimitedDiscoverableModeFlag();
advBuilder.setCompleteLocalName("obniz ble");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```




## advDataBulider setShortenedLocalName(name)



Advertiseのshortened local nameを設定します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setShortenedLocalName("obniz");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```

## advDataBulider setCompleteLocalName(name)



Advertiseのcomplete local nameを設定します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setCompleteLocalName("obniz");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```




## advDataBulider setManufacturerSpecificData(manifactureCode, data)



AdvertiseのManufacturer Specific Data(企業固有データ)を設定します

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setManufacturerSpecificData(0x004C, [0x00,0x99, ...]);
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```

## advDataBulider setIbeaconData(uuid, major, minor, txPower) 

AdvertiseにiBeacon(Apple社の企業固有データ)を設定します

1. uuid : iBeaconでのUUID(32桁)
2. uuid : iBeaconでのmajor(0~0xFFFF(65536)の数字)
3. uuid : iBeaconでのminor(0~0xFFFF(65536)の数字)
4. uuid : iBeaconでのtxPower(0~0xFF(256)の数字)

```Javascript
var advBuilder = obniz.ble.advDataBulider();
advBuilder.setIbeaconData("c28f0ad5-a7fd-48be-9fd0-eae9ffd3a8bb",0x1000,0x0010,0xFF);
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```




## scanRespDataBuilder()

Advertiseで出力するデータバイト列のビルダーを生成します

```Javascript
var scanRespBuilder = obniz.ble.scanRespDataBuilder();
scanRespBuilder.setCompleteLocalName("obniz ble");
obniz.ble.setAdvData(advBuilder.build());

obniz.ble.startAdvertisement();
```



## setAdvDataAsIbeacon(uuid, major, minor, txPower)

