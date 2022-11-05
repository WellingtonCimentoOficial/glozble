from django.contrib import admin
from .models import Subscription
import locale

# Register your models here.
@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("name", "type", "limit_clicks", "click_price_brl", "price_brl", "daily_earnings_brl", "monthly_earnings_brl", "annual_earnings_brl")

    def click_price_brl(self, subscription):
        locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
        brl = locale.currency(subscription.click_price, grouping=True, symbol=True)
        return brl
    click_price_brl.short_description = "Preço por clique"

    def price_brl(self, subscription):
        locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
        brl = locale.currency(subscription.price, grouping=True, symbol=True)
        return brl
    price_brl.short_description = "Preço do plano"

    def daily_earnings_brl(self, subscription):
        calc = subscription.limit_clicks * subscription.click_price
        locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
        brl = locale.currency(calc, grouping=True, symbol=True)
        return brl
    daily_earnings_brl.short_description = "Ganhos diários"

    def monthly_earnings_brl(self, subscription):
        calc = (subscription.limit_clicks * subscription.click_price) * 30
        locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
        brl = locale.currency(calc, grouping=True, symbol=True)
        return brl
    monthly_earnings_brl.short_description = "Ganhos mensais"

    def annual_earnings_brl(self, subscription):
        calc = (subscription.limit_clicks * subscription.click_price) * 365
        locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
        brl = locale.currency(calc, grouping=True, symbol=True)
        return brl
    annual_earnings_brl.short_description = "Ganhos anuais"