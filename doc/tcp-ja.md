# Protocol TCP
TCPのコネクションを作成します。
TCPは8本利用可能です。
tcp0からtcp7までが利用できます。

## obniz.getFreeTcp()
obniz Boardが利用していないTCPモジュールを取得します。
TCPはtcp0〜tcp7の8つが利用できますが、
この関数を呼ぶことで利用中でないTCPを取得することが出来ます。

```Javascript
// Example
var tcp = obniz.getFreeTcp();
```
もし利用できるTCPがない場合は例外が発生しプログラムは停止します。
```Javascript
// Example
var tcp0 = obniz.getFreeTcp();
var tcp1 = obniz.getFreeTcp();
var tcp2 = obniz.getFreeTcp();
var tcp3 = obniz.getFreeTcp();
var tcp4 = obniz.getFreeTcp();
var tcp5 = obniz.getFreeTcp();
var tcp6 = obniz.getFreeTcp();
var tcp7 = obniz.getFreeTcp();
var tcp8 = obniz.getFreeTcp(); // Error
```

## connectWait(port, domain)

TCPを指定したポートとドメインでコネクションを開始します。

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.connectWait(80,"obniz.io");
```

## write(data)

引数のデータをTCPで送信します。

文字列かArray型の引数を渡すとデータを送信します。

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.connectWait(80,"obniz.io");

// Array
tcp.write([0,1,2,3,4]);

// Text
tcp.write('hello');
```

## readWait

TCPの受信を待ちます。

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.connectWait(80,"obniz.io");

let data = await tcp.readWait();
console.log(data);
```

## onreceive

TCPの受信があったらコールバック関数を呼び出します。

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.connectWait(80,"obniz.io");

tcp.onreceive = data => {
    console.log(data);
};
```

## onconnection

TCPの接続状況に変化があるとコールバック関数を呼び出します。

- true : 接続
- false : 切断

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();

tcp.onconnection = data => {
    console.log(data);
};
tcp.connectWait(80,"obniz.io");
```

## onerror

接続の時に発生したエラーのメッセージを取得することができます。

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.connectWait(80,"obniz.io");

tcp.onerror = state => {
    console.log(state);
};
```

## end();

TCPのセッションを終了します。

```Javascript
// Javascript Example
var tcp = obniz.getFreeTcp();
tcp.end();
```