
# コンセプト
- 渋谷ヒカリエ周辺の飲食店で、ARISE社員のオススメする店舗が探せる
- ランチでもディナーでも可
- 行きたい店リストのメモを誰にでも見れるようにしたようなアプリ

# 要求
- ファーストビューで店舗一覧がカード形式で表示されている
    - 名前での検索が可能
    - 新着・人気でタブを分ける
        - 新着には登録日時が最新のものから降順で表示
        - 人気には行きたい・お気に入り人数が多いものから降順で表示
    - カードには以下の情報が表示される
        - 店名(GoogleMap)
        - 写真(GoogleMap)
        - 星(GoogleMap)
        - 口コミ件数(GoogleMap)
        - 気になる数(サイト内)
        - お気に入り数(サイト内)
- カードをクリックすると、店舗の詳細情報が表示される
    - 詳細情報の全量は以下
        - 店名
        - お気に入り（サイト独自）
        - 代表写真
        - 星
        - 概要
        - 予約可否
        - 電話番号
        - タグ（自動生成）
        - 目的
            - ランチ
            - ディナー
            - 二次会（主観）
            - カフェ（コーヒー & デザート）
        - 口コミ（5件）
        - 関連写真（10件）
        - 営業時間
        - 住所
        - ウェブサイト
        - マップ

# メモ
- GoogleMapAPIで取得できる情報について
    - 記事：https://gaaaon.jp/blog/google_map_api#60f75271a847f926050173b7-1627022052515
    - ドキュメント：https://developers.google.com/maps/documentation/places/web-service/place-details?hl=ja&_gl=1*eqlpxp*_up*MQ..*_ga*MTIxOTUyOTM2LjE3MjM3Njk3NjQ.*_ga_NRWSTWS78N*MTcyMzc2OTc2My4xLjAuMTcyMzc2OTc2My4wLjAuMA..

- GoogleMapAPIで取得できる情報例
    - 名前
    - 場所の概要（editorialSummary）
    - 住所
    - 電話番号
    - 星
    - 口コミ（最大5件）
    - 口コミ合計数
    - 場所の写真
    - 関連する写真（最大10件）
    - ウェブサイト
    - 通常の営業時間
    - 今後7日間の営業時間（今日含む）
    - ランチがあるか
    - ディナーがあるか
    - 予約可否

# 機能要件
## 店舗一覧
- 店名
- 星数
- 口コミ件数
- ジャンル（MVP2）
    - ジャンル1
    - ジャンル2
    - ジャンル3
- 目的
    - ランチ
    - ディナー
    - 二次会（MVP2）
    - カフェ
- 営業日フラグ
    - 月
    - 火
    - 水
    - 木
    - 金
    - 土
    - 日
- 保存済みフラグ(MVP2)
- place_id

## 店舗詳細
- 店名
- 価格帯
    - PRICE_LEVEL_UNSPECIFIED	場所の価格レベルが指定されていないか不明です。
    - PRICE_LEVEL_FREE	無料サービスを提供。
    - PRICE_LEVEL_INEXPENSIVE	安価なサービスを提供している。
    - PRICE_LEVEL_MODERATE	手頃な料金のサービスを提供。
    - PRICE_LEVEL_EXPENSIVE	高額なサービスを提供している。
    - PRICE_LEVEL_VERY_EXPENSIVE
- 保存済みフラグ(MVP2)
- 星数
- 口コミ件数
- 予約可否
- 目的
    - ランチ
    - ディナー
    - 二次会(MVP2)
    - カフェ
- 写真URL
    - 写真1
    - 写真2
    - 写真3
- 概要
- ジャンル(MVP2)
    - ジャンル1
    - ジャンル2
    - ジャンル3
- 店舗URL
- GoogleマップURL
- 電話番号
- 口コミ
    - 口コミ1
    - 口コミ2
    - 口コミ3
    - 口コミ4
    - 口コミ5
- 営業時間
    - 月
    - 火
    - 水
    - 木
    - 金
    - 土
    - 日
- マップ
