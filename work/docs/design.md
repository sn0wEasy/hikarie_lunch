- 名前でplace_id検索
    - input: 名前のリスト
    - output: place_idのリスト
- place_idでdetail検索
    - input: place_idのリスト
    - output: 結果のリスト
- detailから一覧・詳細にmigration
    - input: 結果のリスト
    - output: 一覧のリスト, 詳細のリスト
- 一覧・詳細のリストをテスト
- レスポンスを手入力で作成

# 生データ取得
- 1. 詳細データ
    - 名前でテキスト検索APIを叩いて出てきた一番目を取得
- 2. 写真URLデータ
    - 詳細データに含まれる写真リソース名からURLを取得

# データ加工
- placeId
- displayName
- priceLevel
- rating
- userRatingCount
- reservable
- purposeLunch
- purposeDinner
- purposeCafe
    - typesリスト内に"cafe"を持つこと
- photoUrls
    - photosリスト内のオブジェクト内キーnameを使って写真URLデータを取得する
- description
    - editorialSummaryがあればその中のoverviewを取得する
- websiteUrl
- googleMapUrl
- reviews
    - reviewsリスト内のオブジェクト内キーのうち以下を取得する
        - name: レビューのID
        - publishTime: 投稿日時
        - rating: 星数
        - authorAttribution/displayName: 投稿者名
        - text/text: レビューテキスト
- businessDays
    - regularOpeningHours/periods/open/dayがある日はtrue
- businessHours
    - regularOpeningHours/periods内のオブジェクトを取得
- locationLatitude
- locationLongitude

