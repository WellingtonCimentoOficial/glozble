from django.db import models

# Create your models here.
class Subscription(models.Model):
    name = models.CharField(max_length=255, verbose_name="Nome")
    description = models.TextField(max_length=255, verbose_name="Descrição", null=True)
    type_choices = (
        ("0", "Vitalício"),
    )
    type = models.CharField(max_length=255, choices=type_choices, verbose_name="Tipo")
    limit_clicks = models.IntegerField(verbose_name="Limite de Cliques")
    click_price = models.DecimalField(max_digits=255, decimal_places=2, verbose_name="Retorno p/clique")
    price = models.DecimalField(max_digits=255, decimal_places=2, verbose_name="Preço")

    class Meta:
        verbose_name = "Plano"
        verbose_name_plural = "Planos"

    def daily_earnings(self):
        return self.limit_clicks * self.click_price

    def monthly_earnings(self):
        return (self.limit_clicks * self.click_price) * 30

    def annual_earnings(self):
        return (self.limit_clicks * self.click_price) * 365

    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        self.name = str(self.name).upper()
        super(Subscription, self).save(*args, **kwargs)