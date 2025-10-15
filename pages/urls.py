from django.urls import path

from .views import calculate_price, home, post_feedback

urlpatterns = [
    path("", home, name="home"),
    path("post_feedback/", post_feedback, name="post_feedback"),  # type: ignore
    path("calculate-price/", calculate_price, name="calculate-price"),  # type: ignore
]
