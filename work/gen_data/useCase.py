import infracstucture


# 検索結果の一番目を取得する
def extractTargetRestaurantData(restaurant_name: str) -> dict[str, any]:

    print("extractTargetRestaurantData - restaurant_name:", restaurant_name)

    res = infracstucture.fetchTextQueryApi(restaurant_name)
    if res["places"].__len__() == 0:
        raise Exception(f"検索結果が存在しません。検索結果: {res}")
    return res["places"][0]


# データに含まれる写真名から写真のURLを取得し、リストを作成する
def createPhotoUrlList(restaurant_data: dict[str, any]) -> list[str]:

    print("createPhotoUrlList - restaurant_name:", restaurant_data["displayName"])

    photos = restaurant_data["photos"] if "photos" in restaurant_data else []
    photo_url_list = [
        infracstucture.fetchPhotoUrl(photo["name"])["photoUri"] for photo in photos
    ]
    return photo_url_list
