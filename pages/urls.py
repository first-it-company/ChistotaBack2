from django.urls import path

from .views import catalog, contacts, home, post_feedback, service_detail, about_us

urlpatterns = [
    path("", home, name="home"),
    path("catalog/", catalog, name="catalog"),
    path("post_feedback/", post_feedback, name="post_feedback"),  # type: ignore
    path("contacts/", contacts, name="contacts"),
    path("about/", about_us, name="about_us"),
    path("service/<slug:slug>/", service_detail, name="service_detail"),
]
