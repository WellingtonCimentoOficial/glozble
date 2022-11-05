from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name="index"),
    path('subscriptions/', views.subscriptions, name="subscriptions"),
    path('contact/', views.contact, name="contact"),
    path('about/', views.about, name="about"),
    path('help/', views.help, name="help"),
    path('terms/', views.terms, name="terms"),
    path('privacy-policy/', views.privacy_policy, name="privacy-policy"),
]