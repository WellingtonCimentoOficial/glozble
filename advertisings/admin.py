from django.contrib import admin
from .models import Advertising, AffiliateProduct

# Register your models here.
@admin.register(Advertising)
class AdvertisingAdmin(admin.ModelAdmin):
    list_display = ("token", "user", "viewed", "clicked", "viewed_at")

@admin.register(AffiliateProduct)
class AffiliateProductAdmin(admin.ModelAdmin):
    list_display = ('title', 'font', 'link')