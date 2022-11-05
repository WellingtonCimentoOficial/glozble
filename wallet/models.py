from django.db import models
from settings import settings
from accounts.models import User
from utils import global_variables, mail
import re
import locale
import pytz
from datetime import datetime, timezone
from django.utils import timezone as djangotimezone

# Create your models here.
class Wallet(models.Model):
    value = models.DecimalField(max_digits=100, decimal_places=2, default=0, verbose_name="Valor")
    user = models.OneToOneField(User, on_delete=models.CASCADE, verbose_name="Usuário")
    payment_method_choies = (
        ('0', 'PicPay'),
        ('1', 'PayPal'),
        ('2', 'Pix'),
    )
    payment_method = models.CharField(max_length=255, choices=payment_method_choies, null=True, blank=True, verbose_name="Metódo de pagamento")
    payment_key = models.CharField(max_length=36, null=True, blank=True, verbose_name="Chave de pagamento")

    class Meta:
        verbose_name = "Carteira"
        verbose_name_plural = "Carteiras"

    def __str__(self):
        return self.user.username

    def check_payment_key(self):
        if self.payment_method == "0" or self.payment_method == "1":
            if re.match(global_variables.EMAIL_REGEX, self.payment_key) and re.search(r"\s", self.payment_key) is None: # EMAIL VERDADEIRO
                return True
            else:
                return False
        elif self.payment_method == "2":
            if re.match(global_variables.EMAIL_REGEX, self.payment_key) and re.search(r"\s", self.payment_key) is None: # Email VERDADEIRO
                return True
            elif re.match(global_variables.CPF_REGEX, self.payment_key) and re.search(r"\s", self.payment_key) is None and len(self.payment_key) == 14: # CPF VERDADEIRO
                return True
            elif re.match(global_variables.CNPJ_REGEX, self.payment_key) and re.search(r"\s", self.payment_key) is None and len(self.payment_key) == 18 and len(str(self.payment_key).replace(".", "").replace("-", "").replace("/", "")) == 14: # CNPJ VERDADEIRO
                return True
            elif re.match(global_variables.RANDOM_KEY_REGEX, self.payment_key) and re.search(r"\s", self.payment_key) is None and len(self.payment_key) == 36: # CHAVE ALEATÓRIA VERDADEIRA
                return True
            else:
                return False

class Transaction(models.Model):
    transaction_id = models.IntegerField(unique=False, editable=False, verbose_name="ID da transação")
    value = models.DecimalField(max_digits=100, decimal_places=2, default=0, verbose_name="Valor")
    type_choices = (
        ('0', 'Saque'),
        ('1', 'Depósito'),
        ('2', 'Bônus'),
    )
    type = models.CharField(max_length=255, choices=type_choices, verbose_name="Tipo")
    status_choices = (
        ('0', 'Cancelado'),
        ('1', 'Pendente'),
        ('2', 'Concluído'),
    )
    status = models.CharField(max_length=255, choices=status_choices, verbose_name="Status")
    method_choices = (
        ('0', 'PicPay'),
        ('1', 'PayPal'),
        ('2', 'Pix'),
        ('3', settings.PROJECT_NAME.capitalize()),
    )
    method = models.CharField(max_length=255, choices=method_choices, verbose_name="Método")
    payment_key = models.CharField(max_length=255, verbose_name="Chave de pagamento")
    wallet = models.ForeignKey(Wallet, on_delete=models.CASCADE, verbose_name="Carteira")
    created_at = models.DateTimeField(auto_now_add=True, verbose_name="Data de criação")
    concluded_at = models.DateTimeField(editable=False, verbose_name="Data de conclusão")

    class Meta:
        verbose_name = "Transação"
        verbose_name_plural = "Transações"

    def __str__(self):
        return str(self.transaction_id).zfill(10)

    def generate_transacton_id(self):
        transaction = Transaction.objects.filter().last()
        if transaction is not None:
            return transaction.transaction_id + 1
        return 0

    def transform_id_zfill(self):
        return str(self.transaction_id).zfill(10)


    def check_payment_key(self):
        if self.method == "0" or self.method == "1":
            if re.match(global_variables.EMAIL_REGEX, self.payment_key) and re.search(r"\s", self.payment_key) is None: # EMAIL VERDADEIRO
                return True
            else:
                return False
        elif self.method == "2":
            if re.match(global_variables.EMAIL_REGEX, self.payment_key) and re.search(r"\s", self.payment_key) is None: # Email VERDADEIRO
                return True
            elif re.match(global_variables.CPF_REGEX, self.payment_key) and re.search(r"\s", self.payment_key) is None and len(self.payment_key) == 14: # CPF VERDADEIRO
                return True
            elif re.match(global_variables.CNPJ_REGEX, self.payment_key) and re.search(r"\s", self.payment_key) is None and len(self.payment_key) == 18 and len(str(self.payment_key).replace(".", "").replace("-", "").replace("/", "")) == 14: # CNPJ VERDADEIRO
                return True
            elif re.match(global_variables.RANDOM_KEY_REGEX, self.payment_key) and re.search(r"\s", self.payment_key) is None and len(self.payment_key) == 36: # CHAVE ALEATÓRIA VERDADEIRA
                return True
            else:
                return False

    
    def send_email(self, status, transaction_id):
        locale.setlocale(locale.LC_ALL, 'pt_BR.UTF-8')
        brl_value = locale.currency(self.value, grouping=True, symbol=True)
        mail.send_email(
            "Solicitação de saque",
            'emails/withdraw.html',
            {'context': {
                'user': self.wallet.user,
                'request_date': self.concluded_at.replace(tzinfo=timezone.utc).astimezone(tz=pytz.timezone(settings.TIME_ZONE)).strftime('%d-%m-%Y %H:%M:%S'),
                'transaction_id': str(transaction_id).zfill(10) if self.transaction_id is None else str(self.transaction_id).zfill(10),
                'payment_key': self.payment_key,
                'method': self.method,
                'value': brl_value,
                'status': status,
                'project_name': settings.PROJECT_NAME
            }},
            settings.DEFAULT_FROM_EMAIL,
            (self.wallet.user.email, )
        )

    def setValues(self):
        id = self.generate_transacton_id()
        self.transaction_id = id if self.transaction_id is None else self.transaction_id
        wallet_current_value = self.wallet.value
        wallet_new_value = None
        if self.type == "0": # SAQUE
            if self.status == "0": # CANCELADO
                wallet_new_value = wallet_current_value + self.value
                self.wallet.value = wallet_new_value
                self.wallet.save()
                self.send_email("Cancelado", id)
            elif self.status == "1": # PENDENTE
                wallet_new_value = wallet_current_value - self.value
                self.wallet.value = wallet_new_value
                self.wallet.save()
                self.send_email("Pendente", id)
            elif self.status == "2": # CONCLUÍDO
                self.wallet.value = wallet_current_value
                self.wallet.save()
                self.send_email("Concluído", id)
        elif self.type == "1": # DEPÓSITO
            wallet_new_value = wallet_current_value + self.value
            self.wallet.value = wallet_new_value
            self.method = "3"
            self.wallet.save()
        elif self.type == "2": # BONUS
            self.wallet.value = self.wallet.value
            self.method = "3"
            self.wallet.save()

    def save(self, *args, **kwargs):
        now = djangotimezone.now()
        self.concluded_at = now
        self.setValues()
        super(Transaction, self).save(*args, **kwargs)