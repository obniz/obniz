obniz.js自体を開発する方法です。

## Clone

[https://github.com/obniz/obniz](https://github.com/obniz/obniz)

からclone

マシンにnodejs 12以上をインストールして下さい。

    npm i

で依存関係をインストールします。

## ブランチ戦略と開発手順

- master ⇒ リリース済みブランチ
- develop ⇒ 開発ブランチ。確認後masterへマージされます
- feature/{各機能} ⇒ 各機能開発ブランチ。マージ後削除されます。

開発時はdevelopブランチから新しいブランチを作成してください。

feature/{やる内容}

でブランチを切り、作業してコミット・PUSHしてください。

コミットの文章は英語でお願いします。

完了後のpull-rqはdevelopブランチへのpull-reqをgithub上で作成してください。

## 内部構成

- src ⇒ obniz.jsを構成するすべてのプログラム
    - src/obniz ⇒ パーツを除く ioやadなどobniz自体の操作に関するプログラム
    - src/parts ⇒ パーツ類。1フォルダ1部品。カテゴリ分けされている
- dist ⇒ トランスパイル後の各jsファイルが格納されます

src以下のts拡張子がついたプログラムがtypescriptで書かれたobniz.jsのプログラムです。

obnizフォルダ以下がobnizのデバイス自体の操作

parts以下がpartsライブラリのそれぞれの部品のプログラムです。

## 開発方法

以下のコマンドでtsをビルドしてjavascriptに変換します。（３０秒とかかかります）

    npm run build

完了するとトップレベルにobniz.jsというファイルが生成されます。

また、以下のコマンドを打つと、

    npm run local

ビルドされると同時に

http://localhost:3100/obniz.js

というURLでビルドしたobniz.jsを開けるようになります。

tsファイルを書き直す→ npm run localでビルドしてアクセスできるようにする→ ブラウザなどで動作確認→また直してrun localでビルドし直す

という手法となります

## パーツについて

パーツはカテゴリごとにフォルダ分けされていて、必須ファイルは以下の通り

・index.ts ⇒メインのプログラム(classとoptionをexportします)

git ・README.md ⇒ 英語の説明

・README-ja.md ⇒ 日本語の説明

・image.jpg ⇒ 画像(きちんと撮影したもの)

パーツのプログラムを新しく作るときは他を参照しながら開発すると容易です。

### パーツを新しく作るときの注意点

また、パーツはフォルダに入れただけでビルド時に一応組み込まれますが、以下のファイルも編集してください。

・src/parts/category.json

どこで買えるかなども含めたパーツ一覧です。これに入れないとサイトにはパーツが表示されません。

・src/obniz/ObnizPartsList.ts

typescriptから見えるparts一覧です。これがないとtypescriptからobnizの部品を使うときに参照がなくなります。

## テストについて

[こちらを参照](./test.md)