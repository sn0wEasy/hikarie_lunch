import json

with open("./db/child_restaurant_data.json", "r") as f:
    details = json.load(f)

for detail in details["restaurants_detail"]:
    id = detail["id"]
    with open(f"./db/details/{id}.json", "w", encoding="utf8") as f:
        json.dump(detail, f, ensure_ascii=False, indent=4)
