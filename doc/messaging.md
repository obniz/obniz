# Messaging
obnizはHTTPリクエストやTwitterでのイベントなど、
インターネット上で何か起きた時にそれをメッセージとして受け取る機能があります。

また、その機能を使ってobnizから他のobnizにメッセージを送ることが出来ます。
メッセージは文字でもデータでもOKです。

## Example
実際に見てみましょう。
仮にボタンを押すことで世界中にある別々の10台のロボットの右手を同時に上げたい場合です。

まず、ボタンだけが繋がったobnizを用意して、押された時にmessageを送るようにします。
```Javascript
// Example
obniz.onconnect = function(){
    var button = Parts("Button");
    button.wired(obniz, 0 , 1);

    button.onChange(function(){
      var targets = [
        "1234-1234-1231",
        "1234-1234-1232",
        "1234-1234-1233",
        "1234-1234-1234",
        "1234-1234-1235",
        "1234-1234-1236",
        "1234-1234-1237",
        "1234-1234-1238",
        "1234-1234-1239",
        "1234-1234-1230"];

      obniz.message(targets, "pressed");
    });
 }
```
targetsで書かれているのは送りたい相手のobnizのidです。

そしてこれを受け取りたいobnizではメッセージを受け取ったら右手につながっているサーボモーターを回すようにします。
```Javascript
// Example
obniz.onconnect = function() {
    var motor = Parts("ServoMotor");
    motor.wired(obniz, 0 , 1, 2);

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

## API
obnizにHTTPリクエストでメッセージを送ることが出来ます。
obnizごとにAPIが用意されています。

```
GET https://obniz.io/obniz/{obniz_id}/message?data={what you want to send}
```

obniz_idのobnizに対してdataのメッセージを送信できます。
この場合fromはnullになります。 
また、送信した時にobnizがオフラインの場合は404となります。

一斉に多くのobnizにメッセージを送る場合はPOSTメソッドを利用できます。
```
POST https://obniz.io/obniz/message
```
Parameters

- to:  宛先を,で分けた文字列
- data: 送りたいmessage

