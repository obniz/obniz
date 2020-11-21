
# BLE Beacons to MQTT server Example

Scan BLE beacons by using all listed obniz devices and reports to API intervary.

BLEのビーコンをを複数のobnizデバイスで継続的にスキャン。
一定間隔でMQTTサーバーに複数obnizデバイスの情報をまとめて送信。

```shell
npm i
node index.js
```

ローカルで起動するシンプルなMQTTサーバー

```shell
npm i
node mqtt_server
```
