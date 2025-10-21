import requests


def fetch_reviews_data():
    url = "http://185.104.113.137:8000/api/common/get_reviews/"
    params = {"branch_id": 1, "only_providers": True}
    headers = {"accept": "application/json"}

    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()

        branch = data["branch"]
        ratings = {
            "twogis": "{:.1f}".format(float(branch["twogis_review_avg"])),
            "vlru": "{:.1f}".format(float(branch["vlru_review_avg"])),
            "yandex": "{:.1f}".format(float(branch["yandex_review_avg"])),
        }

        counts = {
            "twogis": branch["twogis_review_count"],
            "vlru": branch["vlru_review_count"],
            "yandex": branch["yandex_review_count"],
        }

        reviews_for_slider = []
        for review in data["reviews"]:
            rating_value = float(review["rating"])
            if rating_value < 4.7:
                continue

            provider = review["provider"]
            provider_info = {
                "2gis": {
                    "url": branch["twogis_map_url"],
                    "text": "Читать на 2GIS",
                    "icon": "static/pages/icons/2gis.png",
                },
                "vlru": {
                    "url": branch["vlru_url"],
                    "text": "Читать на VL.ru",
                    "icon": "static/pages/icons/VL.png",
                },
                "yandex": {
                    "url": branch["yandex_map_url"],
                    "text": "Читать на Яндекс",
                    "icon": "static/pages/icons/Yandex.png",
                },
            }

            slider_review = {
                "author_name": review["author"],
                "rating": int(rating_value),
                "rating_display": "{:.1f}".format(rating_value),
                "review_text": review["content"],
                "photo": review["avatar"] or "/static/pages/images/reviews/avatar.png",
                "service": "Уборка",
                "link": {
                    "url": review["review_url"],
                    "text": provider_info[provider]["text"],
                    "icon": provider_info[provider]["icon"],
                    "image": review["photos"].split(",")[0] if review["photos"] else "",
                },
                "provider": provider,
            }

            reviews_for_slider.append(slider_review)

        reviews_for_slider.sort(key=lambda x: not bool(x["link"]["image"]))

        return {"reviews": reviews_for_slider, "ratings": ratings, "counts": counts}

    except requests.exceptions.RequestException as e:
        print(f"Error fetching reviews: {e}")
        return {
            "reviews": [],
            "ratings": {"twogis": "5.0", "vlru": "5.0", "yandex": "5.0"},
            "counts": {"twogis": "0", "vlru": "0", "yandex": "0"},
        }
