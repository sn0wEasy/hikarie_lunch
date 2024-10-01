import json, os
import requests
from dotenv import load_dotenv


# GoogleMapsAPIを使用して、指定したレストラン名に一致する情報を取得する
def fetchTextQueryApi(restaurant_name: str) -> dict[str, any]:

    # 環境変数読み込み
    load_dotenv()
    API_KEY = os.getenv("API_KEY")
    ENDPOINT = os.getenv("TEXT_QUERY_ENDPOINT")
    LANGUAGE_CODE = os.getenv("LANGUAGE_CODE")
    LATITUDE = os.getenv("LATITUDE")
    LONGITUDE = os.getenv("LONGITUDE")
    RADIUS = os.getenv("RADIUS")

    # リクエストヘッダ定義
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "*",
    }

    # リクエストボディ定義
    body = {
        "textQuery": restaurant_name,
        "languageCode": LANGUAGE_CODE,
        "locationBias": {
            "circle": {
                "center": {"latitude": LATITUDE, "longitude": LONGITUDE},
                "radius": RADIUS,
            }
        },
    }

    # リクエスト送信
    try:
        res = requests.post(ENDPOINT, headers=headers, json=body)
        res.raise_for_status()  # ステータスコードが200番台でない場合に例外を発生させる
    except requests.exceptions.RequestException as e:
        raise e

    # レスポンスデータをJSON形式に変換
    try:
        return json.loads(res.text)
    except json.JSONDecodeError as e:
        raise e


# GoogleMapsAPIを使用して、指定したレストラン名に一致する写真URLを取得する
def fetchPhotoUrl(photo_name: str) -> dict[str, any]:

    # 環境変数読み込み
    load_dotenv()
    API_KEY = os.getenv("API_KEY")
    PHOTO_ENDPOINT_FIRST_HALF = os.getenv("PHOTO_ENDPOINT_FIRST_HALF")
    PHOTO_ENDPOINT_SECOND_HALF = os.getenv("PHOTO_ENDPOINT_SECOND_HALF")
    MAX_HEIGHT_PX = os.getenv("MAX_HEIGHT_PX")
    MAX_WIDTH_PX = os.getenv("MAX_WIDTH_PX")

    # リクエストヘッダ定義
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": API_KEY,
        "X-Goog-FieldMask": "*",
    }

    # リクエストパラメータ定義
    params = {
        "maxHeightPx": MAX_HEIGHT_PX,
        "maxWidthPx": MAX_WIDTH_PX,
        "skipHttpRedirect": True,
    }

    # リクエストエンドポイント定義
    endpoint = f"{PHOTO_ENDPOINT_FIRST_HALF}{photo_name}{PHOTO_ENDPOINT_SECOND_HALF}"

    # リクエスト送信
    try:
        res = requests.get(endpoint, headers=headers, params=params)
        res.raise_for_status()  # ステータスコードが200番台でない場合に例外を発生させる
    except requests.exceptions.RequestException as e:
        print(f"Request failed: {e}")
        raise e

    # レスポンスデータをJSON形式に変換
    try:
        return json.loads(res.text)
    except json.JSONDecodeError as e:
        print(f"JSON decode error: {e}")
        raise e


# JSONファイルからレストランデータを取得する
def fetchLocalRestaurantData() -> dict[str, any]:

    # ローカルのJSONファイルからデータを読み込む
    try:
        with open("./db/parent_restaurant_data.json", "r", encoding="utf8") as f:
            return json.load(f)
    except:
        raise Exception("Failed to read local data")


# JSONファイルにレストランデータを保存する
def storeLocalRestaurantData(restaurant_data: dict[str, any]) -> None:

    # ローカルのJSONファイルにデータを書き込む
    with open("./db/parent_restaurant_data.json", "w", encoding="utf8") as file:
        json.dump(restaurant_data, file, ensure_ascii=False, indent=4)


# JSONファイルにAPIレスポンス用レストランデータを保存する
def storeLocalChildRestaurantData(children_restaurant_data: dict[str, any]) -> None:

    # ローカルのJSONファイルにデータを書き込む
    with open("./db/children_restaurant_data.json", "w", encoding="utf8") as file:
        json.dump(children_restaurant_data, file, ensure_ascii=False, indent=4)
