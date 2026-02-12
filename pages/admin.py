from django.contrib import admin

from .models import (
    AboutMain,
    CompanyDetails,
    Contact,
    Employee,
    Feedback,
    Logo,
    QuestionAnswer,
    ScopeServices,
    ServiceInclusion,
    Services,
    SocialNetwork,
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
admin.site.register(QuestionAnswer)
admin.site.register(Contact)
admin.site.register(Feedback)
admin.site.register(Employee)
admin.site.register(Logo)
admin.site.register(SocialNetwork)
admin.site.register(CompanyDetails)
admin.site.register(AdditionalServices)
