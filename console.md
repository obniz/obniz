コンソールを活用して、obnizの開発をスムーズにするノウハウを紹介いたします。ぜひご覧ください！

# Webコンソールとは？

コンソールとは、エラーや警告、デバッグ情報などメッセージを確認できるほか、JavaScriptを実行できる機能です。

コンソールを使うと変数の中を文字出力できるので簡単にデバッグができます。

複雑な確認をしようとすると、ブレークポイントを使った方法をオススメします。
ブレークポイントを使った方法は、別記事にまとまっているのでご覧ください。

# コンソールを使ってみよう

**本記事はChromeを使用しています。**

obnizのプログラム編集画面に移動しましょう。

コンソールを使えるようにobnizのスイッチを押したらログを出す簡単なプログラムを用意しました。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>console.logをつかってみよう</title>
    <script src="https://unpkg.com/obniz@3.3.0/obniz.js" crossorigin="anonymous"></script>
</head>
<body>
<div id="obniz-debug"></div>
<h2>console.logの使い方 1</h2>
<script>
    var obniz = new Obniz("OBNIZ_ID_HERE");
    obniz.onconnect = async () => {
         obniz.switch.onchange = function(state) {
            console.log("pressed :" + state); // 文字列として表示
        };
    }
</script>
</body>
</html>
```

プログラムが準備できたら、実行してみましょう。

「Show　console log」を開くと、コンソールを確認できます。

スイッチを押すと、次の画像と同じようになります。

![](console/switch.png)

コンソールに出すために`console.log`という関数を使用します。

`console.log("pressed:" + state); // 文字列として表示`

シンプルな方法でわかりやすいですね。
応用ですが、テンプレートリテラルという記法をうまく使うと変数を複数扱いたいときやコメント内で簡単な計算をしたいときに便利なので興味があれば調べてみましょう！

ただ、すべてがうまくいくわけではないので、そういったときにどのようにすればよいか紹介しましょう。

とりあえず下のコードを動かしてみます。

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>console.logをつかってみよう</title>
    <script src="https://unpkg.com/obniz@3.3.0/obniz.js" crossorigin="anonymous"></script>
</head>
<body>
<div id="obniz-debug"></div>
<h2>console.logの使い方 2</h2>
<script>
    var obniz = new Obniz("OBNIZ_ID_HERE");
    obniz.onconnect = async () => {
        let sensor = obniz.wired("SHT31", {scl: 0, sda: 1});
        let data = await sensor.getAllWait();
        console.log("Sensor" + data); // NG [object Object]と出てしまう
        console.log("Sensor", data); // OK センサーのデータを確認できる
    }
</script>
</body>
</html>
```

実行すると、片方は「Sensor [object Object]」と出てしまいました。

![](console/sensor.png)

本当は、センサーのデータが見たいのですが残念ながら``console.log("Sensor" + data);``
この方法では、dataというオブジェクトデータとくっつけて表示されてしまいます。

これを解決して、センサーのデータを見たい場合には、``console.log("Sensor" , data);``
この形に修正すると確認できるようになりました。

コンソールを使うとちゃんとobnizが動いているか見れます。

次に開発に役立つTipsを紹介いたします。

## Tips

2つ便利なコンソールを使った関数を紹介いたします。

これを使うときには次の手順をおこなってください。

実行ボタンの横にある「▼」をクリックし、「新しいタブで実行」を選択します。

![](pic/program_open.png)

新しいタブで開いたら、Chromeの右上から「その他のツール」　- 「デベロッパーツール」の順で開きます。

![](pic/image1.png)

デベロッパーツールを開くと、次のようになります。

右上のElementsやConsoleなど複数の機能がありますが、今回はその中から「Console」を選びます。

### 時間計測

一つ目は時間計測です。

時間を測りたい始めたい場所に、`console.time()`を、終了するときに`console.timeEnd()`をいれましょう。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>console.logをつかってみよう</title>
    <script src="https://unpkg.com/obniz@3.3.0/obniz.js" crossorigin="anonymous"></script>
  </head>
  <body>
    <div id="obniz-debug"></div>
    <h2>console.logの使い方 2</h2>
    <script>
      var obniz = new Obniz("OBNIZ_ID_HERE");
      obniz.onconnect = async () => {

        console.time();
        let sensor = obniz.wired("SHT31", {scl: 0, sda: 1});
        let data = await sensor.getAllWait();
        console.log("Sensor" + data); // NG [object Object]と出てしまう
        console.log("Sensor", data); // OK センサーのデータを確認できる
        console.timeEnd();
      }
    </script>
  </body>
</html>
```

実際に動かしてみると、373msかかったよと教えてくれます。

![](console/time.png)

### テーブル


二つ目はテーブル表示です。

標準化されていないのでブラウザによっては動作しない可能性があります。

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="UTF-8">
    <title>console.logをつかってみよう</title>
    <script src="https://unpkg.com/obniz@3.3.0/obniz.js" crossorigin="anonymous"></script>
  </head>
  <body>
    <div id="obniz-debug"></div>
    <h2>console.logの使い方 2</h2>
    <script>
      var obniz = new Obniz("OBNIZ_ID_HERE");
      obniz.onconnect = async () => {
        let sensor = obniz.wired("SHT31", {scl: 0, sda: 1});
        let data = await sensor.getAllWait();
        console.table(data);
      }
    </script>
  </body>
</html>
```

実際に動かしてみると、テーブルにデータがはいります。

![](console/table.png)

# おわりに

コンソールを活用して、スムーズにプログラムの動作を確認できるようになりました。

別記事のブレークポイントも活用して、obnizを使った作品を開発していきましょう！

-------------

ブレークポイントを活用して、obnizの開発をスムーズにするノウハウを紹介いたします。ぜひご覧ください。

# ブレークポイントとは？

ブレークポイントは、プログラム途中で処理を止める機能です。

止めると、その時の変数を確認できたり、順番に実行してどこが悪いかを探りやすくなります。

別の記事で紹介するコンソールの使い方と合わせて学ぶとobnizをさらに活用できると思います！

# ブレークポイントを使ってみよう

**本記事はChromeを使用しています。**

obnizのプログラム編集画面に移動しましょう。

ブレークポイントを使えるようにobnizのスイッチを押したらログを出す簡単なプログラムを用意しました。

```html
<html>
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css">
    <script src="https://obniz.io/js/jquery-3.2.1.min.js"></script>
    <script src="https://unpkg.com/obniz@3.3.0/obniz.js" crossorigin="anonymous"></script>
  </head>
  <body>

    <div id="obniz-debug"></div>
    <h3>スイッチを使ってみよう</h3>

    <script>
      var obniz = new Obniz("OBNIZ_ID_HERE");

      obniz.onconnect = async function () {

        obniz.switch.onchange = function(state) {
          if (state === "push") {
            console.log("Pushing");
          } else {
            console.log(state);
          }
        }
      }

    </script>
  </body>
</html>
```

プログラムを用意できたら、実行しますが注意が必要です。

実行ボタンの横にある「▼」をクリックし、「新しいタブで実行」を選択します。

![](pic/program_open.png)

新しいタブで開いたら、Chromeの右上から「その他のツール」　- 「デベロッパーツール」の順で開きます。

![](pic/image1.png)

デベロッパーツールを開くと、次のようになります。

右上のElementsやConsoleなど複数の機能がありますが、今回はその中から「Sources」を選びます。

![](pic/devtool.png)

そうすると、先ほどプログラム画面に入力したプログラムが確認できます。

今回はスイッチを押したときにどのような変数がはいっているのか見るためにブレークポイントを活用してみます。

ブレークポイントでプログラムを止めたい箇所の数字の部分をクリックします。

スイッチを押したときのstate変数が見たいので「20」をクリックします。そうすると、数字が青くなります。
青くなった状態の箇所にプログラムが来ると、そこでプログラムは動作を停止します。

![](pic/debug_setup.png)

準備ができたら、obnizのスイッチを押してみましょう。
すると、次の画面のようにプログラムが停止し、state変数の中身を確認することができるようになりました。

ブレークポイントで停止させると、順次実行やほかの変数の中身の確認など他にもできることが複数あります。
ぜひ検索してみてください。

![](pic/debug_stop.png)

# おわりに

ブレークポイントを活用して、スムーズにプログラムの動作を確認できるようになりました。

別記事のコンソールも活用して、obnizを使った作品を開発していきましょう！

