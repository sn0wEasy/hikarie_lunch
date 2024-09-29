import infracstucture


# 一覧・詳細データを生成
def main():
    restaurant_data = infracstucture.fetchLocalRestaurantData()

    restaurant_list = createRestaurantList(restaurant_data)
    restaurant_detail_list = createRestaurantDetail(restaurant_data)

    child_restrant_data = {
        "restaurants": restaurant_list,
        "restaurants_detail": restaurant_detail_list,
    }

    infracstucture.storeLocalChildRestaurantData(child_restrant_data)


def createRestaurantList(data: dict[str, any]) -> list[dict[str, any]]:
    return [
        {
            "id": e["id"],
            "placeId": e["placeId"],
            "displayName": e["displayName"],
            "thumbnailPhotoUrl": e["photoUrls"][0] if len(e["photoUrls"]) > 0 else [],
            "rating": e["rating"],
            "userRatingCount": e["userRatingCount"],
            "purposeLunch": e["purposeLunch"],
            "purposeDinner": e["purposeDinner"],
            "purposeCafe": e["purposeCafe"],
            "openingDays": e["openingDays"],
        }
        for e in data["restaurantData"]
    ]


def createRestaurantDetail(data: dict[str, any]) -> list[dict[str, any]]:
    return [
        {
            "id": e["id"],
            "placeId": e["placeId"],
            "displayName": e["displayName"],
            "priceLevel": e["priceLevel"],
            "rating": e["rating"],
            "userRatingCount": e["userRatingCount"],
            "reservable": e["reservable"],
            "purposeLunch": e["purposeLunch"],
            "purposeDinner": e["purposeDinner"],
            "purposeCafe": e["purposeCafe"],
            "photoUrls": e["photoUrls"],
            "description": e["description"],
            "websiteUrl": e["websiteUrl"],
            "googleMapUrl": e["googleMapUrl"],
            "phoneNumber": e["phoneNumber"],
            "reviews": e["reviews"],
            "openingHours": e["openingHours"],
            "location": {
                "latitude": e["latitude"],
                "longitude": e["longitude"],
            },
        }
        for e in data["restaurantData"]
    ]


if __name__ == "__main__":
    main()
