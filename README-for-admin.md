obnizjsに管理者向けの機能を追加するためのリポジトリ。
otaやstorageなど、一般ユーザの目に触れさせたくない機能をアドイン的な形で実装してく。

本家のobnizjsに更新があったときは、以下の手順で更新を取り込む。

1. obnizjsのローカルリポジトリをターミナルで開く
2. git remote add obnizjs-for-admin git@github.com:obniz/obnizjs-for-admin.git　を実行（２回目以降から省ける）
3. 更新内容が存在するブランチをobnizjs-for-adminにプッシュする
4. obnizjs-for-adminで、3でプッシュされた内容でプルリクを作成
5. プルリクを確認後マージして取り込み完了

本リポジトリ自体の開発フローは「developからブランチを切って作業=>PR=>マージ」と、普通のと同じ。

Nodeバージョンは16.15.0を使う
