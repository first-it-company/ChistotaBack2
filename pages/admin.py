from django.contrib import admin
from .models import (AboutMain, ScopeServices, Services, OrderInfo, Order,
                     QuestionAnswer, Contact, Feedback, VideoMain,
                     PriceServices, Employee, ServicePhoto)

admin.site.register(AboutMain)
admin.site.register(ScopeServices)
admin.site.register(Services)
admin.site.register(OrderInfo)
admin.site.register(Order)
admin.site.register(QuestionAnswer)
admin.site.register(Contact)
admin.site.register(Feedback)
admin.site.register(VideoMain)
admin.site.register(PriceServices)
admin.site.register(Employee)
admin.site.register(ServicePhoto)

