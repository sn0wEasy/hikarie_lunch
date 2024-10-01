# Hikarie lunch
渋谷ヒカリエ周辺のオススメ飲食店を寄せ集めたサイト。
自分が勤める会社でオススメされるお店を集約して、いつでもどこでも見れるようにしたかったので作った。

ランチに限らずいろんなお店を掲載している。
掲載されるお店は、基本的に開発者の勤める会社でオススメされているお店か、個人的にオススメのお店。

サイトURL：https://hikarie-lunch.pages.dev/

## ターミナル操作
### アプリ起動
たぶん以下で起動する。
```sh
cd hikarie-lunch
npm i
npm run dev
```

### 環境変数の適用
Cloudflare Pagesでホストしている都合上、環境変数は.dev.varsファイルで管理する。書き方は普通の.envと同様。環境変数を変更した場合は以下のコマンドを実行する。
```sh
npm run typegen
```

参考：https://developers.cloudflare.com/workers/configuration/environment-variables

なお、上記は開発環境の場合の話で、商用はCloudflare Pagesのダッシュボード上で直接入力する形で設定する。

## 技術スタック
### フロントエンド
- [React](https://ja.react.dev/)
- [Remix](https://remix.run/)

### バックエンド
- [Cloudflare Pages](https://www.cloudflare.com/ja-jp/developer-platform/pages/)
    - Remixで作成したアプリをCloudflare Pagesでホスト。

- AWS(S3, API Gateway)
    - アプリのバックエンドAPIはS3とAPI Gatewayでホスト。Google Maps APIから取得したデータを加工し、APIレスポンス用のデータをS3に格納。

## UI
Figmaで作成。

https://www.figma.com/design/BfH2M4z30OBMxeHOnW7Jk6/Hikarie-lunch?m=auto&t=GX4OdPVG0GzdBvJx-6

## ディレクトリ概要
### hikarie-lunch
Remixアプリ用のディレクトリ。アプリに関する諸々はこのディレクトリ内で管理する。

### work/gen_data
アプリで表示するためのデータ取得・加工用のバッチファイル。
データ取得元はGoogle Maps API。
データ取得から加工までの流れは[スライド](https://docs.google.com/presentation/d/1WZC5ehuOyxJe1QNcxaWtFSp0amEsWeBrhjOVYa70DRM/edit?usp=sharing)に概要を記載。

batch_parent.pyで、restaurant_list.jsonから名前のリストを呼び出した上でAPIからデータを取得して店舗ごとにデータを集約する。

集約したデータは、batch_children.pyで一覧API用と詳細API用に加工している。
infrastracture.pyとusecase.pyは、バッチ処理の一部をよくあるレイヤードアーキテクチャっぽい感じで責務分割したもの。

#### work/gen_data/db
batch_parent.pyのアウトプットはparent_restaurant_data.jsonに、
batch_children.pyのアウトプットはchildren_restaurant_data.jsonに出力。

routes.jsonはjson-server用の設定ファイル。
detail_batch.pyは、children_restaurant_data.jsonをの詳細データをバラしてapi/details配下に格納する用。
api/restaurants.jsonは一覧データ用のファイルで、手動作成。

