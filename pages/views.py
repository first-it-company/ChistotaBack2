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
    OrderInfo,
    QuestionAnswer,
    ScopeServices,
    Services,
    SocialNetwork,
    VideoMain,
    AdditionalServices
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
    order_info = OrderInfo.objects.first()
    questions = QuestionAnswer.objects.all()
    contact = Contact.objects.first()
    videos = VideoMain.objects.all().order_by('order')
    employee = Employee.objects.all().order_by('order')
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
            "logo": logo,
            "reviews": reviews_for_slider,
            **social_networks,
        },
    )


def catalog(request):
    services = Services.objects.all().order_by("order")
    questions = QuestionAnswer.objects.all()
    contact = Contact.objects.first()
    additional_services = AdditionalServices.objects.all()

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
            "additional_services": additional_services,
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


def service_detail(request, slug: str):
    service = get_object_or_404(Services, slug=slug)
    contact = Contact.objects.first()
    order_info = OrderInfo.objects.first()
    questions = QuestionAnswer.objects.all()

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
            "contact": contact,
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
            "reviews": reviews_for_slider,
            **social_networks,
        },
    )


def contacts(request):
    questions = QuestionAnswer.objects.all()
    contact = Contact.objects.first()
    company_details = CompanyDetails.objects.first()

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


def about_us(request):
    about_main = AboutMain.objects.first()
    questions = QuestionAnswer.objects.all()
    contact = Contact.objects.first()
    company_details = CompanyDetails.objects.first()
    employee = Employee.objects.all().order_by('order')
    logo = Logo.objects.all()

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
        "about.html",
        {
            "about_main": about_main,
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
            "employee": employee,
            "logo": logo,
            **social_networks,
        },
    )