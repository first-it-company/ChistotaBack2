from django.conf import settings
from django.conf.urls.static import static
from django.views.static import serve
from django.contrib import admin
from django.urls import path, include, re_path
from django.contrib.sitemaps.views import sitemap
from pages.sitemaps import StaticViewSitemap, ServiceSitemap

sitemaps_dict = {
    'static': StaticViewSitemap,
    'service': ServiceSitemap,
}

urlpatterns = [
    path("admin/", admin.site.urls),
    path("", include("pages.urls")),

    # path("sitemap.xml", sitemap, {"sitemaps": sitemaps_dict}, name="sitemap"),
    # re_path(r'^robots\.txt$', serve, {
    #     'document_root': settings.BASE_DIR,
    #     'path': 'robots.txt',
    # }),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
