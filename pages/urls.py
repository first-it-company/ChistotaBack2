from django.urls import path

from .views import catalog, home, post_feedback, service_detail

urlpatterns = [
    path("", home, name="home"),
    path("catalog/", catalog, name="catalog"),
    path("post_feedback/", post_feedback, name="post_feedback"),  # type: ignore
    path("service/<int:pk>/", service_detail, name="service_detail"),
]
