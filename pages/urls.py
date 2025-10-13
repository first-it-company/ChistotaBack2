from django.urls import path

from .apps import PagesConfig
from .views import calculate_price, home, post_feedback

app_name = PagesConfig.name

urlpatterns = [
    path("", home, name="home"),
    path("post_feedback/", post_feedback, name="post_feedback"),  # type: ignore
    path("calculate-price/", calculate_price, name="calculate-price"),  # type: ignore
]
