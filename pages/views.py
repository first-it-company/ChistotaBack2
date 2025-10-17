import json

from django.core.serializers.json import DjangoJSONEncoder
from django.http.response import JsonResponse
from django.shortcuts import get_object_or_404, render

from .models import (
    AboutMain,
    CompanyDetails,
    Contact,
    Employee,
    Feedback,
    Logo,
    Order,
    OrderInfo,
    QuestionAnswer,
    ScopeServices,
    Services,
    SocialNetwork,
    VideoMain,
)
from .services import fetch_reviews_data


def post_feedback(request):
    if request.method == "POST":
        name = request.POST.get("name")
        phone = request.POST.get("phone")
        message = request.POST.get("message")

        Feedback.objects.create(name=name, phone=phone, message=message)

        return JsonResponse({"status": "success"})


def home(request):
    about_main = AboutMain.objects.first()
    services = Services.objects.all().order_by("order")
    scope_services = ScopeServices.objects.all()
    used_orders_scope_ids = Order.objects.values_list("scope", flat=True).distinct()
    scope_services_for_orders = ScopeServices.objects.filter(
        id__in=used_orders_scope_ids
    )
    order_info = OrderInfo.objects.first()
    orders = Order.objects.all()
    questions = QuestionAnswer.objects.all()
    contact = Contact.objects.first()
    videos = VideoMain.objects.all()
    employee = Employee.objects.all()
    logo = Logo.objects.all()

    # Получаем ссылки на социальные сети
    social_networks = {
        "instagram_url": (
            SocialNetwork.objects.filter(name="instagram").first().url
            if SocialNetwork.objects.filter(name="instagram").exists()
            else ""
        ),
        "telegram_url": (
            SocialNetwork.objects.filter(name="telegram").first().url
            if SocialNetwork.objects.filter(name="telegram").exists()
            else ""
        ),
        "vk_url": (
            SocialNetwork.objects.filter(name="vk").first().url
            if SocialNetwork.objects.filter(name="vk").exists()
            else ""
        ),
        "whatsapp_url": (
            SocialNetwork.objects.filter(name="whatsapp").first().url
            if SocialNetwork.objects.filter(name="whatsapp").exists()
            else ""
        ),
    }

    # Получаем отзывы и рейтинги
    reviews_data = fetch_reviews_data()
    reviews_for_slider = reviews_data["reviews"]
    ratings = reviews_data["ratings"]
    counts = reviews_data["counts"]

    gis_reviews_json = json.dumps(
        reviews_for_slider, cls=DjangoJSONEncoder, ensure_ascii=False
    )

    return render(
        request,
        "home.html",
        {
            "about_main": about_main,
            "services": services,
            "scope_services": scope_services,
            "order_info": order_info,
            "orders": orders,
            "gis_reviews_json": gis_reviews_json,
            "questions": questions,
            "contact": contact,
            "videos": videos,
            "gis_data": {
                "average_rating": ratings["twogis"],
                "count": counts["twogis"],
            },
            "vl_data": {"average_rating": ratings["vlru"], "count": counts["vlru"]},
            "yandex_data": {
                "average_rating": ratings["yandex"],
                "count": counts["yandex"],
            },
            "employee": employee,
            "scope_services_for_orders": scope_services_for_orders,
            "logo": logo,
            "reviews": reviews_for_slider,
            **social_networks,
        },
    )


def catalog(request):
    services = Services.objects.all().order_by("order")
    questions = QuestionAnswer.objects.all()
    contact = Contact.objects.first()

    # Получаем ссылки на социальные сети
    social_networks = {
        "instagram_url": (
            SocialNetwork.objects.filter(name="instagram").first().url
            if SocialNetwork.objects.filter(name="instagram").exists()
            else ""
        ),
        "telegram_url": (
            SocialNetwork.objects.filter(name="telegram").first().url
            if SocialNetwork.objects.filter(name="telegram").exists()
            else ""
        ),
        "vk_url": (
            SocialNetwork.objects.filter(name="vk").first().url
            if SocialNetwork.objects.filter(name="vk").exists()
            else ""
        ),
        "whatsapp_url": (
            SocialNetwork.objects.filter(name="whatsapp").first().url
            if SocialNetwork.objects.filter(name="whatsapp").exists()
            else ""
        ),
    }

    # Получаем отзывы и рейтинги
    reviews_data = fetch_reviews_data()
    reviews_for_slider = reviews_data["reviews"]
    ratings = reviews_data["ratings"]
    counts = reviews_data["counts"]

    gis_reviews_json = json.dumps(
        reviews_for_slider, cls=DjangoJSONEncoder, ensure_ascii=False
    )

    return render(
        request,
        "catalog.html",
        {
            "services": services,
            "gis_reviews_json": gis_reviews_json,
            "questions": questions,
            "contact": contact,
            "gis_data": {
                "average_rating": ratings["twogis"],
                "count": counts["twogis"],
            },
            "vl_data": {"average_rating": ratings["vlru"], "count": counts["vlru"]},
            "yandex_data": {
                "average_rating": ratings["yandex"],
                "count": counts["yandex"],
            },
            "reviews": reviews_for_slider,
            **social_networks,
        },
    )


def service_detail(request, pk: int):
    service = get_object_or_404(Services, pk=pk)
    used_orders_scope_ids = Order.objects.values_list("scope", flat=True).distinct()
    scope_services_for_orders = ScopeServices.objects.filter(
        id__in=used_orders_scope_ids
    )
    order_info = OrderInfo.objects.first()
    orders = Order.objects.all()
    questions = QuestionAnswer.objects.all()

    # Получаем ссылки на социальные сети
    social_networks = {
        "instagram_url": (
            SocialNetwork.objects.filter(name="instagram").first().url
            if SocialNetwork.objects.filter(name="instagram").exists()
            else ""
        ),
        "telegram_url": (
            SocialNetwork.objects.filter(name="telegram").first().url
            if SocialNetwork.objects.filter(name="telegram").exists()
            else ""
        ),
        "vk_url": (
            SocialNetwork.objects.filter(name="vk").first().url
            if SocialNetwork.objects.filter(name="vk").exists()
            else ""
        ),
        "whatsapp_url": (
            SocialNetwork.objects.filter(name="whatsapp").first().url
            if SocialNetwork.objects.filter(name="whatsapp").exists()
            else ""
        ),
    }

    # Получаем отзывы и рейтинги
    reviews_data = fetch_reviews_data()
    reviews_for_slider = reviews_data["reviews"]
    ratings = reviews_data["ratings"]
    counts = reviews_data["counts"]

    gis_reviews_json = json.dumps(
        reviews_for_slider, cls=DjangoJSONEncoder, ensure_ascii=False
    )

    return render(
        request,
        "service_detail.html",
        {
            "service": service,
            "order_info": order_info,
            "orders": orders,
            "gis_reviews_json": gis_reviews_json,
            "questions": questions,
            "gis_data": {
                "average_rating": ratings["twogis"],
                "count": counts["twogis"],
            },
            "vl_data": {"average_rating": ratings["vlru"], "count": counts["vlru"]},
            "yandex_data": {
                "average_rating": ratings["yandex"],
                "count": counts["yandex"],
            },
            "scope_services_for_orders": scope_services_for_orders,
            "reviews": reviews_for_slider,
            **social_networks,
        },
    )


def contacts(request):
    questions = QuestionAnswer.objects.all()
    contact = Contact.objects.first()
    company_details = CompanyDetails.objects.first()

    # Получаем ссылки на социальные сети
    social_networks = {
        "instagram_url": (
            SocialNetwork.objects.filter(name="instagram").first().url
            if SocialNetwork.objects.filter(name="instagram").exists()
            else ""
        ),
        "telegram_url": (
            SocialNetwork.objects.filter(name="telegram").first().url
            if SocialNetwork.objects.filter(name="telegram").exists()
            else ""
        ),
        "vk_url": (
            SocialNetwork.objects.filter(name="vk").first().url
            if SocialNetwork.objects.filter(name="vk").exists()
            else ""
        ),
        "whatsapp_url": (
            SocialNetwork.objects.filter(name="whatsapp").first().url
            if SocialNetwork.objects.filter(name="whatsapp").exists()
            else ""
        ),
    }

    # Получаем отзывы и рейтинги
    reviews_data = fetch_reviews_data()
    reviews_for_slider = reviews_data["reviews"]
    ratings = reviews_data["ratings"]
    counts = reviews_data["counts"]

    gis_reviews_json = json.dumps(
        reviews_for_slider, cls=DjangoJSONEncoder, ensure_ascii=False
    )

    return render(
        request,
        "contacts.html",
        {
            "gis_reviews_json": gis_reviews_json,
            "questions": questions,
            "contact": contact,
            "company_details": company_details,
            "gis_data": {
                "average_rating": ratings["twogis"],
                "count": counts["twogis"],
            },
            "vl_data": {"average_rating": ratings["vlru"], "count": counts["vlru"]},
            "yandex_data": {
                "average_rating": ratings["yandex"],
                "count": counts["yandex"],
            },
            "reviews": reviews_for_slider,
            **social_networks,
        },
    )


# def about_us(request, pk: int):
#     about_main = AboutMain.objects.first()
#     service = get_object_or_404(Services, pk=pk)
#     scope_services = ScopeServices.objects.all()
#     used_orders_scope_ids = Order.objects.values_list("scope", flat=True).distinct()
#     scope_services_for_orders = ScopeServices.objects.filter(
#         id__in=used_orders_scope_ids
#     )
#     order_info = OrderInfo.objects.first()
#     orders = Order.objects.all()
#     questions = QuestionAnswer.objects.all()
#     contact = Contact.objects.first()
#     videos = VideoMain.objects.all()
#     employee = Employee.objects.all()
#     logo = Logo.objects.all()
#
#     # Получаем ссылки на социальные сети
#     social_networks = {
#         "instagram_url": (
#             SocialNetwork.objects.filter(name="instagram").first().url
#             if SocialNetwork.objects.filter(name="instagram").exists()
#             else ""
#         ),
#         "telegram_url": (
#             SocialNetwork.objects.filter(name="telegram").first().url
#             if SocialNetwork.objects.filter(name="telegram").exists()
#             else ""
#         ),
#         "vk_url": (
#             SocialNetwork.objects.filter(name="vk").first().url
#             if SocialNetwork.objects.filter(name="vk").exists()
#             else ""
#         ),
#         "whatsapp_url": (
#             SocialNetwork.objects.filter(name="whatsapp").first().url
#             if SocialNetwork.objects.filter(name="whatsapp").exists()
#             else ""
#         ),
#     }
#
#     # Получаем отзывы и рейтинги
#     reviews_data = fetch_reviews_data()
#     reviews_for_slider = reviews_data["reviews"]
#     ratings = reviews_data["ratings"]
#     counts = reviews_data["counts"]
#
#     gis_reviews_json = json.dumps(
#         reviews_for_slider, cls=DjangoJSONEncoder, ensure_ascii=False
#     )
#
#     return render(
#         request,
#         "service_detail.html",
#         {
#             "about_main": about_main,
#             "service": service,
#             "scope_services": scope_services,
#             "order_info": order_info,
#             "orders": orders,
#             "gis_reviews_json": gis_reviews_json,
#             "questions": questions,
#             "contact": contact,
#             "videos": videos,
#             "gis_data": {
#                 "average_rating": ratings["twogis"],
#                 "count": counts["twogis"],
#             },
#             "vl_data": {"average_rating": ratings["vlru"], "count": counts["vlru"]},
#             "yandex_data": {
#                 "average_rating": ratings["yandex"],
#                 "count": counts["yandex"],
#             },
#             "employee": employee,
#             "scope_services_for_orders": scope_services_for_orders,
#             "logo": logo,
#             "reviews": reviews_for_slider,
#             **social_networks,
#         },
#     )
