import useCase as uc
import infracstucture
import json


# GoogleMapsAPIからレストランデータを取得し、マスタデータを生成
def main():
    # 店舗名リスト
    # name_list = ["tTure", "とうふ空野", "Suage", "羽富"]
    with open("./restaurant_list.json", "r") as f:
        name_list = json.load(f)

    # 店舗ごとの詳細データリスト
    text_query_data_list: list[dict[str, any]] = [
        uc.extractTargetRestaurantData(name) for name in name_list
    ]

    # 店舗ごとの写真URLリスト
    photo_url_list: list[list[dict[str, any]]] = [
        uc.createPhotoUrlList(data) for data in text_query_data_list
    ]

    restaurant_data_list = [
        {
            "id": idx,
            "placeId": e1["id"],
            "displayName": e1["displayName"]["text"],
            "priceLevel": e1["priceLevel"] if "priceLevel" in e1 else None,
            "rating": e1["rating"] if "rating" in e1 else None,
            "userRatingCount": (
                e1["userRatingCount"] if "userRatingCount" in e1 else None
            ),
            "reservable": e1["reservable"] if "reservable" in e1 else None,
            "purposeLunch": e1["servesLunch"] if "servesLunch" in e1 else None,
            "purposeDinner": e1["servesDinner"] if "servesDinner" in e1 else None,
            "purposeCafe": True if "cafe" in e1["types"] else None,
            "photoUrls": e2,
            "description": (
                e1["editorialSummary"]["text"]
                if "editorialSummary" in e1 and "text" in e1["editorialSummary"]
                else None
            ),
            "websiteUrl": e1["websiteUri"] if "websiteUri" in e1 else None,
            "googleMapUrl": e1["googleMapsUri"],
            "phoneNumber": (
                e1["nationalPhoneNumber"] if "nationalPhoneNumber" in e1 else None
            ),
            "reviews": (
                [
                    {
                        "reviewId": review["name"],
                        "authorName": review["authorAttribution"]["displayName"],
                        "publishTime": review["publishTime"],
                        "rating": review["rating"],
                        "comment": review["text"]["text"],
                    }
                    for review in e1["reviews"]
                ]
                if "reviews" in e1
                else []
            ),
            "openingHours": (
                e1["regularOpeningHours"]["periods"]
                if "regularOpeningHours" in e1
                else None
            ),
            "openingDays": (
                translateOpeningHoursToDays(e1["regularOpeningHours"]["periods"])
                if "regularOpeningHours" in e1
                else None
            ),
            "latitude": e1["location"]["latitude"],
            "longitude": e1["location"]["longitude"],
        }
        for idx, (e1, e2) in enumerate(zip(text_query_data_list, photo_url_list))
    ]

    infracstucture.storeLocalRestaurantData({"restaurantData": restaurant_data_list})


def translateOpeningHoursToDays(opening_hours: dict[str, any]) -> dict[str, any]:
    opening_days = {
        "monday": False,
        "tuesday": False,
        "wednesday": False,
        "thursday": False,
        "friday": False,
        "saturday": False,
        "sunday": False,
    }

    day_mapping = {
        0: "sunday",
        1: "monday",
        2: "tuesday",
        3: "wednesday",
        4: "thursday",
        5: "friday",
        6: "saturday",
    }

    for period in opening_hours:
        day = period["open"]["day"]
        if day in day_mapping:
            opening_days[day_mapping[day]] = True
        else:
            raise Exception(f"Invalid day: {day}")

    return opening_days


if __name__ == "__main__":
    main()
