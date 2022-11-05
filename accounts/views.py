import requests
import os
import random
import base64
import re
from django.shortcuts import render, redirect
from django.http import JsonResponse
from django.contrib.auth import authenticate, login, logout
from django.contrib import messages
from django.contrib.auth.decorators import login_required

from settings.settings import DEFAULT_FROM_EMAIL, PROJECT_NAME

from .models import User, PasswordCodeReset
from wallet.models import Wallet, Transaction
from subscriptions.models import Subscription

from utils import global_variables, mail



RECAPTCHA_REGISTER_KEY = os.environ.get("RECAPTCHA_REGISTER_KEY")
RECAPTCHA_LOGIN_KEY = os.environ.get("RECAPTCHA_LOGIN_KEY")
RECAPTCHA_AD_KEY = os.environ.get("RECAPTCHA_AD_KEY")
RECAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify"

# Create your views here.
def home(request):
    return redirect('dashboard')

def register(request):
    if not request.user.is_authenticated:
        if request.method == "POST":
            username = request.POST["username_register"]
            email = request.POST["email_register"]
            password1 = request.POST["password1_register"]
            password2 = request.POST["password2_register"]
            captcha_key = request.POST["g-recaptcha-response"]
            terms_register = request.POST["terms_register"]
        
            free_subscription = Subscription.objects.filter(name="FREE").first()

            bonus = 5 # Reais

            new_user = User()
            new_user.first_name = ""
            new_user.last_name = ""
            new_user.username = str(username).lower()
            new_user.email = str(email).lower()
            new_user.password = password1
            new_user.subscription = free_subscription

            new_wallet = Wallet()
            new_wallet.value = bonus
            new_wallet.user = new_user

            new_transaction = Transaction()
            new_transaction.value = bonus
            new_transaction.type = "2"
            new_transaction.status = "2"
            new_transaction.method = "3"
            new_transaction.wallet = new_wallet



            captcha_response = requests.post(RECAPTCHA_URL, params={
                "secret": RECAPTCHA_REGISTER_KEY,
                "response": captcha_key,
            }).json()

            if new_user.check_good_user():
                if new_user.check_email():
                    if str(password1) == str(password2):
                        if new_user.check_good_password():
                            if terms_register == "true":
                                if captcha_response["success"]:
                                    if User.objects.filter(username=username).first() is None:
                                        if User.objects.filter(email=email).first() is None:
                                            try:
                                                new_user.set_password(str(password1))
                                                new_user.save()
                                                new_wallet.save()
                                                new_transaction.save()
                                                try:
                                                    mail.send_email(
                                                        "Parabéns, sua conta foi criada com sucesso!",
                                                        'emails/welcome.html',
                                                        {'context': {
                                                            'username': username,
                                                            'domain': os.environ.get('DOMAIN_URL'),
                                                            'project_name': PROJECT_NAME
                                                        }},
                                                        DEFAULT_FROM_EMAIL,
                                                        (email, )
                                                    )
                                                except:
                                                    pass
                                                return JsonResponse({'success': True, 'status': 0})
                                            except:
                                                # Erro ao salvar no banco de dados
                                                return JsonResponse({'success': False, 'status': 1})
                                        else:
                                            # E-mail já existe
                                            return JsonResponse({'success': False, 'status': 9})
                                    else:
                                        # Usuário ja existe
                                        return JsonResponse({'success': False, 'status': 8})
                                else:
                                    # Captcha não é valido
                                    return JsonResponse({'success': False, 'status': 7})
                            else:
                                # Termos de registro não marcado
                                return JsonResponse({'success': False, 'status': 6})
                        else:
                            # Senha fora dos padrões
                            return JsonResponse({'success': False, 'status': 5})
                    else:
                        # Senhas não correspondem
                        return JsonResponse({'success': False, 'status': 4})
                else:
                    # E-mail fora dos padrões
                    return JsonResponse({'success': False, 'status': 3})
            else:
                # Usuário fora dos padrões
                return JsonResponse({'success': False, 'status': 2})
        else:
            return redirect('login')
    else:
        return redirect('dashboard')

def log_in(request):
    if not request.user.is_authenticated:
        if request.method == "POST":
            username = request.POST["username_login"]
            password = request.POST["password_login"]
            captcha_key = request.POST["g-recaptcha-response"]

            captcha_response = requests.post(RECAPTCHA_URL, params={
                "secret": RECAPTCHA_LOGIN_KEY,
                "response": captcha_key,
            }).json()

            user = authenticate(username=username, password=password)
            is_staff = User.objects.filter(username=username).first()

            if captcha_response["success"] and user is not None and not is_staff.is_staff:
                login(request, user)
                return JsonResponse({'success': True})
            else:
                return JsonResponse({'success': False})
        else:
            message = request.GET.get("msg", "").strip()

            if message == "success":
                messages.success(request, "Conta criada com sucesso!")
            elif message == "error":
                messages.error(request, "Erro ao criar a conta!")

            return render(request, 'accounts/register.html', {'context': {'project_name': PROJECT_NAME}})
    else:
        return redirect('dashboard')

def reset_password(request):
    if request.method == "POST":
        email = request.POST.get('email', '')
        code = request.POST.get('code', '')
        if code != "":
            password1 = request.POST.get('password1', '')
            password2 = request.POST.get('password2', '')
            captcha_key = request.POST.get('g-recaptcha-response', '')
            captcha_response = requests.post(RECAPTCHA_URL, params={"secret": RECAPTCHA_AD_KEY, "response": captcha_key}).json()
            email_decoded = base64.b64decode(str(email).encode('ascii')).decode('ascii')
            code_reset_decoded = base64.b64decode(str(code).encode('ascii')).decode('ascii')

            user = User.objects.get(email=email_decoded)
            user.password = password1

            if captcha_response["success"] and user.check_good_password() and password1 == password2:
                try:
                    user.set_password(password1)
                    user.save()
                    user.passwordcodereset.delete()
                    mail.send_email(
                        "Senha alterada com sucesso!",
                        'emails/reset-password-success.html',
                        {'context': {
                            'user': user,
                            'domain': os.environ.get('DOMAIN_URL'),
                            'project_name': PROJECT_NAME
                        }},
                        DEFAULT_FROM_EMAIL,
                        (email_decoded, )
                    )
                    return JsonResponse({'success': True, 'status': 0})
                except:
                    return JsonResponse({'success': False, 'status': 1})
            else:
                return JsonResponse({'success': False, 'status': 2})

        else:
            email_encoded = base64.b64encode(str(email).encode('ascii')).decode('ascii')
            code_reset = random.randint(10000, 99999)
            code_reset_encoded = base64.b64encode(str(code_reset).encode('ascii')).decode('ascii')

            captcha_key = request.POST.get('g-recaptcha-response', '')
            captcha_response = requests.post(RECAPTCHA_URL, params={"secret": RECAPTCHA_LOGIN_KEY, "response": captcha_key}).json()
            
            user = User.objects.filter(email=email if re.match(global_variables.EMAIL_REGEX, email) is not None else None).first()

            if user and captcha_response["success"]:
                try:
                    if user.passwordcodereset:
                        user.passwordcodereset.delete()
                except:
                    pass

                code = PasswordCodeReset()
                code.code = code_reset
                code.user = user
                try:
                    code.save()
                    mail.send_email(
                        "Redefinir senha",
                        'emails/reset-password.html',
                        {'context': {
                            'user': user,
                            'domain': os.environ.get('DOMAIN_URL'),
                            'link': os.environ.get('DOMAIN_URL') + "/accounts/login/reset/?email=" + email_encoded + "&code=" + code_reset_encoded,
                            'project_name': PROJECT_NAME
                        }},
                        DEFAULT_FROM_EMAIL,
                        (email, )
                    )
                    return JsonResponse({'success': True, 'status': 0})
                except:
                    return JsonResponse({'success': False, 'status': 1}, status=500)
            else:
                return JsonResponse({'success': False, 'status': 2})
    else:
        email_encoded = request.GET.get('email', '')
        code_reset_encoded = request.GET.get('code', '')
        
        if email_encoded != "" and code_reset_encoded != "":
            email_decoded = base64.b64decode(str(email_encoded).encode('ascii')).decode('ascii')
            code_reset_decoded = base64.b64decode(str(code_reset_encoded).encode('ascii')).decode('ascii')

            query_code = PasswordCodeReset.objects.filter(code=int(code_reset_decoded)).first()

            if query_code is not None and query_code.is_expired() == False and query_code.user.email == email_decoded:
                return render(request, 'accounts/reset-password-final.html', {'context': {'project_name': PROJECT_NAME}})
            return redirect("password-reset")
        return render(request, 'accounts/reset-password.html', {'context': {'project_name': PROJECT_NAME}})

@login_required(login_url='login')
def log_out(request):
    logout(request)
    return redirect('login')