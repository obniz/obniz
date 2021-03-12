# W5500

W5500を使ってTCPやUDP通信するためのライブラリです。
W5500には1つのRJ-45コネクタを接続でき、最大100Mbpsでの通信を可能にします。メモリは32KBまで使用可能です。

## 使い方

まず始めにW5500のピンアサインを指定して、wiredメソッドに渡してください。

```javascript
var ethernet = obniz.wired('W5500', { reset: 12, mosi: 23, miso: 19, sclk: 18, cs: 33 });
```

M5社の出しているW5500スタックの場合は以下の配線となります。(なおSPIがディスプレイと共有のため、obnizOS for M5Stackでなく obnizOS for esp32を利用する必要があります)
```javascript
var ethernet = obniz.wired('W5500', { reset: 13, mosi: 23, miso: 19, sclk: 18, cs: 26 });
```


**ここからのコードは基本的に非同期(async)関数です。awaitを使用しないとSPI通信エラーが起きる原因となりますので、ご注意ください。**

次に、本体のネットワーク設定をしてください。これは毎回必要です。細かいオプションは[リファレンス](https://obniz.github.io/obniz/obnizjs/interfaces/parts.w5500.w5500.commonoptions.html)をご覧ください。
```javascript
await ethernet.initWait({
  gatewayIP: '192.168.1.1', // デフォルトゲートウェイのIPv4アドレス
  subnetMask: '255.255.255.0', // サブネットマスク
  macAddress: '12:34:56:78:90:AB', // MACアドレス
  localIP: '192.168.1.8', // LAN側のIPv4アドレス
  forceNoCheckWrite: true, // 常に書き込み時に転送チェックを行わない
});
```

そして、ソケットを初期化してください。W5500では8つまでソケットを同時に使用できます。複数のソケットを使う場合は、それぞれ初期化してください。細かいオプションは[リファレンス](https://obniz.github.io/obniz/obnizjs/interfaces/parts.w5500.w5500.socket.options.html)をご覧ください。

```javascript
var socket = ethernet.getNewSocket();
await socket.initWait({
  protocol: 'TCPClient', // TCPClient、TCPServer又はUDP
  sourcePort: 54321,
  destIP: '93.184.216.34', // example.com
  destPort: 80, // HTTP
  rxBufferSize: 4, // 受信データは最大4KB
  stringMode: true, // 受信データを文字列(UTF-8)として扱う
});
```

ソケットは接続成功したり、何かを受信したりした時にハンドラーを呼ぶので事前に必要なハンドラーを登録してください。ハンドラーの種類は以下の通りです。

- SendOK
- Timeout
- ReceiveData (data: number[] | string)
- Disconnect
- ConnectSuccess (clientInfo: W5500.DestInfo)(引数はTCPServerのみ)

第1引数はソケットのインスタンスです。一部のみ第2引数があります。**ハンドラー登録関数のみ、非同期(async)関数ではありません。**

```javascript
socket.setInterruptHandler('ReceiveData', async (socket, data) => {
  console.log(`ソケット${socket.id}[受信]`, data);
});
```

なお、全てのハンドラーをまとめて登録することもできます。何がハンドルされたかはnameに入ります。

```javascript
socket.setAllInterruptHandler(async (socket, name, data) => {
  if (name === 'ReceiveData')
    console.log(`ソケット${socket.id}[受信]`, data);
});
```

送信できるデータはバイト列か文字列になります。文字列はUTF-8からデコードされます。データ受信は割り込みのハンドラーを呼ぶ際に事前に行われます。initにて```stringMode: true```の時に受信データもUTF-8の文字列にエンコードされます。どちらも最大長はtxBufferSize(送信)やrxBufferSize(受信)によって変更できます。

```javascript
await socket.sendDataWait(data);
```

必要に応じてデータ送信のみ転送チェックなしにすることで比較的、高速に行える関数を利用してください。

```javascript
await socket.sendDataFastWait(data);
```

全ての通信を終える場合は終了処理をしてください。

```javascript
await ethernet.finalizeWait();
```

特定のソケットで通信を終える場合はソケットから実行してください。ただし、クローズ処理をするだけで全ての設定や状態は保持されます。

```javascript
await socket.finalizeWait();
```

一通り設定を終えたら最後に必ずこのコードを埋め込んでください。checkInterrupt()が都度割り込みがあるかをチェックします。このループは全てのソケットが閉じられていない限り続きます。

```javascript
while (await ethernet.checkInterruptWait());
```

必要に応じてルーターとの接続を待つことができます。返り値は物理層のステータス(全二重100Mbpsなど)です。

```javascript
// { duplex: true, speed: 100, link: true }
await ethernet.waitLinkUpWait();
```

そのほかの関数などについては[リファレンス](https://obniz.github.io/obniz/obnizjs/classes/parts.w5500.w5500.html)を参照してください。

# サンプル

## TCP(クライアント)でHTTP通信

```javascript
var ethernet = obniz.wired('W5500', { reset: 12, mosi: 23, miso: 19, sclk: 18, cs: 33 });
console.log('開始');
await ethernet.initWait({
  gatewayIP: '192.168.8.1',
  subnetMask: '255.255.255.0',
  macAddress: 'C8:2B:96:AE:10:63',
  localIP: '192.168.8.200',
});

await ethernet.waitLinkUpWait();

var socket = ethernet.getNewSocket();
await socket.initWait({
  protocol: 'TCPClient',
  sourcePort: 54321,
  destIP: '93.184.216.34', // example.com
  destPort: 80, // HTTP
  rxBufferSize: 4, // 4KB
  stringMode: true, // 受信データを文字列として扱う
});

socket.setInterruptHandler('ReceiveData', async (socket, data) => {
  console.log(`ソケット${socket.id}[受信]`, data);
  await ethernet.finalizeWait();
  console.log('終了');
});

socket.setInterruptHandler('ConnectSuccess', async (socket) => {
  var data = 'GET / HTTP/1.1\n' +
             'Host: example.com\n' +
             'Connection: keep-alive\n' +
             'Pragma: no-cache\n' +
             'Cache-Control: no-cache\n' +
             'Accept: text/html\n' +
             'Accept-Language: ja,en-US;q=0.9,en;q=0.8\n\n'
  await socket.sendDataWait(data);
  console.log(`ソケット${socket.id}[送信]`, data);
});

while (await ethernet.checkInterruptWait());
```

## UDPでNTP通信(あくまで動作確認のみ)

```javascript
var ethernet = obniz.wired('W5500', { reset: 12, mosi: 23, miso: 19, sclk: 18, cs: 33 });
console.log('開始');
await ethernet.initWait({
  gatewayIP: '192.168.8.1',
  subnetMask: '255.255.255.0',
  macAddress: 'C8:2B:96:AE:10:63',
  localIP: '192.168.8.200',
});

await ethernet.waitLinkUpWait();

var socket = ethernet.getNewSocket();
await socket.initWait({
  protocol: 'UDP',
  sourcePort: 54321,
  destIP: '61.205.120.130', // ntp.nict.jp
  destPort: 123, // NTP
});

socket.setInterruptHandler('ReceiveData', async (socket, data) => {
  console.log(`ソケット${socket.id}[受信]`, data);
  await ethernet.finalizeWait();
  console.log('終了');
});

// UDPは接続確立がないため、すぐに送信
var unix = new Date().getTime() / 1000;
var data = [
  0b00011011, 0, 6, 32, 0, 0, 0, 0,
  0, 0, 0, 0,
  61, 205, 120, 130,
  (unix & 0xFF000000) >> (8*3), (unix & 0xFF0000) >> (8*2), (unix & 0xFF00) >> (8*1), unix & 0xFF,
  0, 0, 0, 0,
  (unix & 0xFF000000) >> (8*3), (unix & 0xFF0000) >> (8*2), (unix & 0xFF00) >> (8*1), unix & 0xFF,
  0, 0, 0, 0,
  (unix & 0xFF000000) >> (8*3), (unix & 0xFF0000) >> (8*2), (unix & 0xFF00) >> (8*1), unix & 0xFF,
  0, 0, 0, 0,
  (unix & 0xFF000000) >> (8*3), (unix & 0xFF0000) >> (8*2), (unix & 0xFF00) >> (8*1), unix & 0xFF,
  0, 0, 0, 0,
];
await socket.sendDataWait(data);
console.log(`ソケット${socket.id}[送信]`, data);

while (await ethernet.checkInterruptWait());
```
