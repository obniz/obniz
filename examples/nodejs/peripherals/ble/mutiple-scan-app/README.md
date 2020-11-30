

Scan BLE advertisements by using all listed obniz devices and reports to API intervary.

BLEのadvertisementを複数のobnizデバイスで継続的にスキャン。
30秒ごとに全ての検出結果をAPIで報告します。

このExampleはリストされているobnizデバイスがオンラインである限り継続的にスキャンし、オフラインからオンラインになっても自動で再びスキャンを始めます。
また、何らかのエラーが発生した場合に「可能な限り継続動作する」ように設計されています。デバイスのステートが少しでも怪しい場合はデバイスをリブートする方向で作られています。

このアプリでは利用するobnizデバイスの情報をobnizCloudからアプリの機能を利用して取得するように作られています。
起動時にのみ取り込むようになっていますので、実際の稼働時にはinstall発生時などで飛ぶwebhookから動的に構築することが勧められます。


```shell
npm i
node index.js
```

```json
// API format 
{
  "founded": [
    {
      "time": 00000000,
      "address": "00000000",
      "adv_data": [0,0,0,0],
      "rssi": -50
    }
  ]
}
```