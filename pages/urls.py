from django.urls import path

from .views import calculate_price, catalog, home, post_feedback

urlpatterns = [
    path("", home, name="home"),
    path("catalog/", catalog, name="catalog"),
    path("post_feedback/", post_feedback, name="post_feedback"),  # type: ignore
    path("calculate-price/", calculate_price, name="calculate-price"),  # type: ignore
]
