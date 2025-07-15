from itertools import count

from django.shortcuts import render
import requests
from .models import (AboutMain, Services, ScopeServices, OrderInfo,
                     Order, QuestionAnswer, Contact, Feedback, PriceServices,
                     VideoMain, Employee, Logo, SocialNetwork)
from django.http.response import JsonResponse
import json
from django.core.serializers.json import DjangoJSONEncoder


def get_reviews_data():
    url = 'http://185.104.113.137:8000/api/common/get_reviews/'
    params = {
        'branch_id': 1,
        'only_providers': True
    }
    headers = {
        'accept': 'application/json'
    }
    
    try:
        response = requests.get(url, params=params, headers=headers)
        response.raise_for_status()
        data = response.json()
        
        # Получаем рейтинги из branch
        branch = data['branch']
        ratings = {
            'twogis': '{:.1f}'.format(float(branch['twogis_review_avg'])),
            'vlru': '{:.1f}'.format(float(branch['vlru_review_avg'])),
            'yandex': '{:.1f}'.format(float(branch['yandex_review_avg']))
        }

        counts = {
            'twogis': branch['twogis_review_count'],
            'vlru': branch['vlru_review_count'],
            'yandex': branch['yandex_review_count']
        }
        
        # Преобразуем отзывы в нужный формат
        reviews_for_slider = []
        for review in data['reviews']:
            provider = review['provider']
            provider_info = {
                '2gis': {
                    'url': branch['twogis_map_url'],
                    'text': 'Читать на 2GIS',
                    'icon': 'static/pages/icons/2gis.png'
                },
                'vlru': {
                    'url': branch['vlru_url'],
                    'text': 'Читать на VL.ru',
                    'icon': 'static/pages/icons/VL.png'
                },
                'yandex': {
                    'url': branch['yandex_map_url'],
                    'text': 'Читать на Яндекс',
                    'icon': 'static/pages/icons/Yandex.png'
                }
            }
            
            slider_review = {
                'author_name': review['author'],
                'rating': int(float(review['rating'])),  # Преобразуем в целое число для звезд
                'rating_display': '{:.1f}'.format(float(review['rating'])),  # Для отображения с десятичной частью
                'review_text': review['content'],
                'photo': review['avatar'] if review['avatar'] else '/static/pages/images/reviews/avatar.png',
                'service': 'Уборка',  # Можно добавить определение услуги по контексту отзыва
                'link': {
                    'url': review['review_url'],
                    'text': provider_info[provider]['text'],
                    'icon': provider_info[provider]['icon'],
                    'image': review['photos'].split(',')[0] if review['photos'] else ''
                },
                'provider': provider
            }
            reviews_for_slider.append(slider_review)
        
        # Сортируем отзывы - сначала с фото
        reviews_for_slider.sort(key=lambda x: not bool(x['link']['image']))
        
        return {
            'reviews': reviews_for_slider,
            'ratings': ratings,
            'counts': counts
        }
        
    except requests.exceptions.RequestException as e:
        print(f"Error fetching reviews: {e}")
        return {
            'reviews': [],
            'ratings': {
                'twogis': '5.0',
                'vlru': '5.0',
                'yandex': '5.0'
            },
            'counts': {
                'twogis': '0',
                'vlru': '0',
                'yandex': '0'
            }

        }


def home(request):
    about_main = AboutMain.objects.first()
    services = Services.objects.all().order_by('order')
    scope_services = ScopeServices.objects.all()
    used_orders_scope_ids = Order.objects.values_list('scope', flat=True).distinct()
    scope_services_for_orders = ScopeServices.objects.filter(id__in=used_orders_scope_ids)
    order_info = OrderInfo.objects.first()
    orders = Order.objects.all()
    questions = QuestionAnswer.objects.all()
    contact = Contact.objects.first()
    list_square = PriceServices.objects.values_list('square', flat=True).distinct()
    videos = VideoMain.objects.all()
    employee = Employee.objects.all()
    logo = Logo.objects.all()
    
    # Получаем ссылки на социальные сети
    social_networks = {
        'instagram_url': SocialNetwork.objects.filter(name='instagram').first().url if SocialNetwork.objects.filter(name='instagram').exists() else '',
        'telegram_url': SocialNetwork.objects.filter(name='telegram').first().url if SocialNetwork.objects.filter(name='telegram').exists() else '',
        'vk_url': SocialNetwork.objects.filter(name='vk').first().url if SocialNetwork.objects.filter(name='vk').exists() else '',
        'whatsapp_url': SocialNetwork.objects.filter(name='whatsapp').first().url if SocialNetwork.objects.filter(name='whatsapp').exists() else '',
    }

    # Получаем отзывы и рейтинги
    reviews_data = get_reviews_data()
    reviews_for_slider = reviews_data['reviews']
    ratings = reviews_data['ratings']
    counts = reviews_data['counts']

    gis_reviews_json = json.dumps(reviews_for_slider, cls=DjangoJSONEncoder, ensure_ascii=False)

    return render(request, 'index.html', {
        'about_main': about_main,
        'services': services,
        'scope_services': scope_services,
        'order_info': order_info,
        'orders': orders,
        'gis_reviews_json': gis_reviews_json,
        'questions': questions,
        'contact': contact,
        'list_square': list_square,
        'videos': videos,
        'gis_data': {'average_rating': ratings['twogis'], 'count': counts['twogis']},
        'vl_data': {'average_rating': ratings['vlru'], 'count': counts['vlru']},
        'yandex_data': {'average_rating': ratings['yandex'], 'count': counts['yandex']},
        'employee': employee,
        'scope_services_for_orders': scope_services_for_orders,
        'logo': logo,
        'reviews': reviews_for_slider,
        **social_networks  # Добавляем все ссылки на соцсети в контекст
    })


def post_feedback(request):
    if request.method == 'POST':
        name = request.POST.get('name')
        phone = request.POST.get('phone')
        message = request.POST.get('message')

        Feedback.objects.create(name=name, phone=phone, message=message)

        return JsonResponse({'status': 'success'})


def calculate_price(request):
    if request.method == 'POST':
        body = json.loads(request.body)
        square_int = int(body['square'])
        price_obj = PriceServices.objects.filter(scope__name=body['service'], square=square_int).first()

        if price_obj:
            price = price_obj.price
        else:
            price = 0

        return JsonResponse({'price': price})
