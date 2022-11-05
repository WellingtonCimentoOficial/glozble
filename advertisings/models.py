from django.db import models
from accounts.models import User
from django.utils import timezone

# Create your models here.
class Advertising(models.Model):
    viewed = models.BooleanField(null=True, default=False, verbose_name="Visualizado")
    clicked = models.BooleanField(null=True, default=False, verbose_name="Clicado")
    viewed_at = models.DateTimeField(auto_now_add=True, verbose_name="Visto em")
    token = models.UUIDField(unique=True, verbose_name="Token")
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, verbose_name="Usuário")

    class Meta:
        verbose_name = "Propaganda"
        verbose_name_plural = "Propagandas"

    def validate_time(self):
        now = timezone.now()
        duration = now - self.viewed_at
        duration_seconds = duration.total_seconds()
        if duration_seconds > 10 and duration_seconds < 90:
            return True
        else:
            return False

    def __str__(self):
        return str(self.token)


class AffiliateProduct(models.Model):
    title = models.CharField(max_length=255, verbose_name="Titulo")
    font_choiches = (
        ('0', 'Amazon'),
        ('1', 'Hotmart'),
        ('2', 'AliExpress'),
    )
    font = models.CharField(max_length=255, choices=font_choiches, null=True, verbose_name="Fonte")
    link = models.CharField(max_length=255)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = "Produto Afiliado"
        verbose_name_plural = "Produtos Afiliados"


    