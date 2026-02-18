from django.contrib.sitemaps import Sitemap
from django.urls import reverse
from .models import Services

class StaticViewSitemap(Sitemap):
    changefreq = "weekly"

    def items(self):
        return ['home', 'about_us', 'contacts', 'catalog']

    def location(self, item):
        return reverse(item)

    def priority(self, item):
        if item == 'home':
            return 1.0
        return 0.7

class ServiceSitemap(Sitemap):
    changefreq = "weekly"
    priority = 0.8

    def items(self):
        return Services.objects.all()

    def lastmod(self, obj):
        return obj.updated_at
