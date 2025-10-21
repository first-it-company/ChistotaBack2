from django.contrib import admin

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
    ServiceInclusion,
    ServicePhoto,
    Services,
    SocialNetwork,
    VideoMain,
    AdditionalServices
)


class ServiceInclusionInline(admin.TabularInline):
    model = ServiceInclusion
    extra = 1


class ServicesAdmin(admin.ModelAdmin):
    inlines = [ServiceInclusionInline]


admin.site.register(AboutMain)
admin.site.register(ScopeServices)
admin.site.register(Services, ServicesAdmin)
admin.site.register(OrderInfo)
admin.site.register(Order)
admin.site.register(QuestionAnswer)
admin.site.register(Contact)
admin.site.register(Feedback)
admin.site.register(VideoMain)
admin.site.register(Employee)
admin.site.register(ServicePhoto)
admin.site.register(Logo)
admin.site.register(SocialNetwork)
admin.site.register(CompanyDetails)
admin.site.register(AdditionalServices)
