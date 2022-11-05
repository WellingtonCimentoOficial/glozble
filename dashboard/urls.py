from django.urls import path
from . import views

urlpatterns = [
    path('', views.dashboard, name="dashboard"),
    path('withdraw/', views.withdraw, name="withdraw"),
    path('ad/', views.ad, name="ad"),
    path('settings/', views.settings, name="settings"),
    path('graphic/', views.graphic, name="graphic"),
]