from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name="accounts"),
    path('register/', views.register, name="register"),
    path('login/', views.log_in, name="login"),
    path('login/reset/', views.reset_password, name="password-reset"),
    path('logout/', views.log_out, name="logout"),
]