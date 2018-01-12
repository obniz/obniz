# obniz.js
obniz.jsを使えば、APIを意識せずにobnizを操作できます。

## インストール
htmlでは、obniz.jsを読み込むことで利用できます。
```
<script src="//parts.obniz.io/obniz.js"></script>
```
これにより最新のobniz.js取り込まれ、Obnizというオブジェクトがhtml内で使えるようになります。

nodejsの場合はnpmによりinstallが可能です。
```shell
npm install obniz
```
installを行ったらjs内で
```javascript
const Obniz = require('obniz');
```
のようにすればobniz.jsが使えるようになります。

## obnizに接続
インターネット上のobnizに接続するにはobnizのidを指定してインスタンス化します。
そして、接続が完了した時に呼ばれる関数を用意しておきます。
```javascript
obniz = new Obniz("1234-5678");
obniz.onconnect = function() {
  console.log("connected");
}
```
onconnectがなくてもObnizをインスタンス化した段階で常時接続を行います。
また、切断されたら再度呼び出されます。
切断されたときにはoncloseが呼ばれます
```javascript
obniz = new Obniz("1234-5678");
obniz.onconnect = function() {
  console.log("connected");
}
obniz.onclose = function() {
  console.log("closed")
}
```
切断された時にやりたいことはこのoncloseに渡す関数に書きます。
例えば、画面に「切断されました」と出すなどです。

安定していない場所では不意に一瞬だけネットワークが切れることもあります。
そういったときでもoncloseは切れるたびに毎回呼ばれることになります。