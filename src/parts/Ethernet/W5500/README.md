# W5500

The library for TCP and UDP communication using W5500.
One RJ-45 connector can be connected to the W5500, enabling communication at up to 100 Mbps. The memory can be used up to 32KB.

## Usage

First of all, specify the pin assignment of W5500 and pass it to wired.

```javascript
var ethernet = obniz.wired('W5500', { reset: 12, mosi: 23, miso: 19, sclk: 18, cs: 33 });
```

In the case of M5's W5500 stack, the wiring is as follows. (Note that you need to use obnizOS for esp32 instead of obnizOS for M5Stack because the SPI is shared with the display)
```javascript
var ethernet = obniz.wired('W5500', { reset: 13, mosi: 23, miso: 19, sclk: 18, cs: 26 });
```

**The code from here is basically an async function. Please note that not using await will cause an SPI communication error.**

Next, set the network settings of the main unit. This is necessary every time. See [the reference (Japanease)](https://obniz.github.io/obniz/obnizjs/interfaces/parts.w5500.w5500.commonoptions.html) for detailed options.
```javascript
await ethernet.initWait({
  gatewayIP: '192.168.1.1', // IPv4 address of default gateway
  subnetMask: '255.255.255.0', // Subnet mask
  macAddress: '12:34:56:78:90:AB', // MAC address
  localIP: '192.168.1.8', // Local IPv4 address
  forceNoCheckWrite: true, // Do not always check transfer when writing
});
```

Then initialize the socket. Up to 8 sockets can be used at the same time on the W5500. If you use multiple sockets, initialize each one. See [the reference (Japanease)](https://obniz.github.io/obniz/obnizjs/interfaces/parts.w5500.w5500.socket.options.html) for detailed options.

```javascript
var socket = ethernet.getNewSocket();
await socket.initWait({
  protocol: 'TCPClient', // TCPClient、TCPServer又はUDP
  sourcePort: 54321,
  destIP: '93.184.216.34', // example.com
  destPort: 80, // HTTP
  rxBufferSize: 4, // Received data is up to 4KB
  stringMode: true, // Treat received data as string (UTF-8)
});
```

The socket calls the handler when the connection is successful or when something is received, so register the required handler in advance. The types of handlers are:

- SendOK
- Timeout
- ReceiveData (data: number[] | string)
- Disconnect
- ConnectSuccess (clientInfo: W5500.DestInfo)(clientInfo is only TCPServer)

The first argument is an instance of the socket. Only some have a second argument. **Handler registration functions only, not async functions.**

```javascript
socket.setInterruptHandler('ReceiveData', async (socket, data) => {
  console.log(`Socket${socket.id}[Receive]`, data);
});
```

You can also register all handlers at once. What was handled goes into name.

```javascript
socket.setAllInterruptHandler(async (socket, name, data) => {
  if (name === 'ReceiveData')
    console.log(`Socket${socket.id}[Receive]`, data);
});
```

The data that can be sent can be a byte array or a string. The string is decoded from UTF-8. Data reception is done in advance when calling the interrupt handler. When ```stringMode: true``` is set in init, the received data is also encoded in the UTF-8 character string. In both cases, the maximum length can be changed by txBufferSize (send) or rxBufferSize (receive).

```javascript
await socket.sendDataWait(data);
```

If necessary, use a function that can be executed relatively quickly by simply sending data without confirming the transfer.

```javascript
await socket.sendDataFastWait(data);
```

If you want to finish all communication, please finish the process.

```javascript
await ethernet.finalizeWait();
```

If you want to end communication with a specific socket, execute from the socket. However, all settings and states are not changed just by closing the process.

```javascript
await socket.finalizeWait();
```

Be sure to embed this code at the end after completing the settings. checkInterrupt() checks for interrupts each time. This loop will continue unless all sockets are closed.

```javascript
while (await ethernet.checkInterruptWait());
```

You can wait for a connection with the router if needed. The return value is the physical layer status (such as duplex 100Mbps).

```javascript
// { duplex: true, speed: 100, link: true }
await ethernet.waitLinkUpWait();
```

Please refer to [the reference (Japanease)](https://obniz.github.io/obniz/obnizjs/classes/parts.w5500.w5500.html) for other functions.

# Samples

## HTTP with TCP(Client)

```javascript
var ethernet = obniz.wired('W5500', { reset: 12, mosi: 23, miso: 19, sclk: 18, cs: 33 });
console.log('Start');
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
  stringMode: true, // treat received data as a string.
});

socket.setInterruptHandler('ReceiveData', async (socket, data) => {
  console.log(`Socket${socket.id}[Receive]`, data);
  await ethernet.finalizeWait();
  console.log('End');
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
  console.log(`Socket${socket.id}[Send]`, data);
});

while (await ethernet.checkInterruptWait());
```

## NTP with UDP(Only operation check)

```javascript
var ethernet = obniz.wired('W5500', { reset: 12, mosi: 23, miso: 19, sclk: 18, cs: 33 });
console.log('Start');
await ethernet.initWait({
  gatewayIP: '192.168.8.1',
  subnetMask: '255.255.255.0',
  macAddress: 'C8:2B:96:AE:10:63',
  localIP: '192.168.8.200',
});

await ethernet.waitLinkUpWait();

var socket = ethernet.getNewSocketWait();
await socket.initWait({
  protocol: 'UDP',
  sourcePort: 54321,
  destIP: '61.205.120.130', // ntp.nict.jp
  destPort: 123, // NTP
});

socket.setInterruptHandler('ReceiveData', async (socket, data) => {
  console.log(`Socket${socket.id}[Receive]`, data);
  await ethernet.finalizeWait();
  console.log('End');
});

// UDP doesn't have connection establishing, so send immediately
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
console.log(`Socket${socket.id}[Send]`, data);

while (await ethernet.checkInterruptWait());
```
