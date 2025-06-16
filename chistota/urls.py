from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from pages.views import home, post_feedback, calculate_price

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home, name='home'),
    path('post_feedback/', post_feedback, name='post_feedback'),
    path('calculate-price/', calculate_price, name='calculate-price'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
