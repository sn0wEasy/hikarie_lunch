import json

with open("./children_restaurant_data.json", "r") as f:
    details = json.load(f)

for detail in details["restaurants_detail"]:
    id = detail["id"]
    with open(f"./api/details/{id}.json", "w", encoding="utf8") as f:
        json.dump(detail, f, ensure_ascii=False, indent=4)
