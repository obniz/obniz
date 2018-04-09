# Messaging
obnizはHTTPリクエストやTwitterでのイベントなど、
インターネット上で何か起きた時にそれをメッセージとして受け取る機能があります。

また、その機能を使ってobnizから他のobnizにメッセージを送ることが出来ます。
メッセージは文字でもデータでもOKです。

## API - obniz messaging
HTTPによりobnizへメッセージを送るエンドポイントはこちらです。

```
GET https://obniz.io/obniz/{obniz_id}/message?data={what you want to send}
```

例えば "move" という文字列をobnizの0000-0000に送りたい場合は
```
GET https://obniz.io/obniz/0000-0000/message?data=move
```

となります。obnizがオンラインならメッセージを受け取れて、そうでなければ404が返ります。

```Javascript
// Example
obniz.onconnect = function() {
  var motor = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});

  motor.angle(0);
  obniz.onmessage = function(message, from) {
    if (message === "move") {
      motor.angle(85);
    }
  };
}
```

複数の宛先に対してはPOSTメソッドで送信できます。
```
POST https://obniz.io/obniz/message
```
Parameters

- to:   "," で分けられた宛先。
- data: message

## obniz - obniz messaging
obniz間のメッセージングです。実際に見てみましょう。
仮にボタンを押すことで世界中にある別々の10台のロボットの右手を同時に上げたい場合です。

まず、ボタンだけが繋がったobnizを用意して、押された時にmessageを送るようにします。
```Javascript
// Example
obniz.onconnect = function(){
    var button = obniz.wired("Button",  {signal:0, gnd:1});

    button.onchange = function(){
      var targets = [
        "1234-1231",
        "1234-1232",
        "1234-1233",
        "1234-1234",
        "1234-1235",
        "1234-1236",
        "1234-1237",
        "1234-1238",
        "1234-1239",
        "1234-1230"];

      obniz.message(targets, "pressed");
    };
 }
```
targetsで書かれているのは送りたい相手のobnizのidです。

そしてこれを受け取りたいobnizではメッセージを受け取ったら右手につながっているサーボモーターを回すようにします。
```Javascript
// Example
obniz.onconnect = function() {
    var motor = obniz.wired("ServoMotor", {gnd:0, vcc:1, signal:2});

    motor.angle(0);
    obniz.onmessage = function(message, from) {
      if (message === "pressed") {
        motor.angle(85);
      }
    };
}
```
これを1234-1234-1231を始めとする１０台で実行しておけば、
ボタンが押された時に"pressed"メッセージが10台に届き、一斉にモーターが回りロボットの右手が上がります。