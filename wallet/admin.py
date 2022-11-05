from django.contrib import admin
from .models import Wallet, Transaction
import locale

# Register your models here.
@admin.register(Wallet)
class WalletAdmin(admin.ModelAdmin):
    list_display = ('username', 'value_brl')

    def username(self, wallet):
        return wallet.user.username
        
    def value_brl(self, wallet):
        locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
        brl = locale.currency(wallet.value, grouping=True, symbol=True)
        return brl
    value_brl.short_description = "Valor"

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = ('transaction_id_func', 'wallet', 'value_brl', 'type', 'method', 'status', 'created_at', 'concluded_at')
    list_display_links = ('transaction_id_func', )
    search_fields = ('transaction_id', )
    list_filter = ('status', 'type', 'method')

    def transaction_id_func(self, transaction):
        return str(transaction.transaction_id).zfill(10)
    transaction_id_func.short_description = "ID da transação"

    def wallet(self, transaction):
        return transaction.wallet.user.username

    def value_brl(self, transaction):
        locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
        brl = locale.currency(transaction.value, grouping=True, symbol=True)
        return brl
    value_brl.short_description = "Valor"
