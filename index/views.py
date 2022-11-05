from django.shortcuts import render
from django.http import JsonResponse
from settings.settings import DEFAULT_FROM_EMAIL, PROJECT_NAME
from subscriptions.models import Subscription
from utils import global_variables, mail
import re
import requests
import os


RECAPTCHA_AD_KEY = os.environ.get("RECAPTCHA_AD_KEY")
RECAPTCHA_URL = "https://www.google.com/recaptcha/api/siteverify"

# Create your views here.
def index(request):
    context = {
        'project_name': PROJECT_NAME,
        'free_plan_click_price': Subscription.objects.first()
    }
    return render(request, 'index/index.html', {'context': context})

def subscriptions(request):
    subscriptions = Subscription.objects.all()
    infos = {
        'subscriptions': subscriptions,
        'project_name': PROJECT_NAME
    }
    return render(request, 'index/subscriptions.html', {'infos': infos})

def contact(request):
    if request.method == "POST":
        subject = request.POST.get('name', '')
        message = request.POST.get('message', '')
        to_email = request.POST.get('email', '')
        recaptcha_token = request.POST.get('g-recaptcha-response', '')

        recaptcha_status = requests.post(RECAPTCHA_URL, params={'secret': RECAPTCHA_AD_KEY, 'response': recaptcha_token})

        if recaptcha_status.json()["success"]:
            if re.search(global_variables.EMAIL_REGEX, to_email) is not None and len(to_email) > 0 and len(to_email) < 50:
                if re.search(global_variables.SPECIAL_CHARACTERS_NO_SPACE, subject) is None and len(subject) > 0 and len(subject) < 50:
                    if len(message) > 0 and len(message) < 1686:
                        try:
                            mail.send_email(
                                subject,
                                'emails/contact.html',
                                {'context': {
                                    'message': message,
                                    'to_email': to_email,
                                    'project_name': PROJECT_NAME
                                }},
                                DEFAULT_FROM_EMAIL,
                                ("contato@EDITAR.com", )
                            )
                            return JsonResponse({'success': True, 'status': 0})
                        except:
                            # erro ao enviar o email
                            return JsonResponse({'success': False, 'status': 1})
                    else:
                        # mensagem fora dos padrões
                        return JsonResponse({'success': False, 'status': 2})
                else:
                    # Assunto fora dos padrões
                    return JsonResponse({'success': False, 'status': 3})
            else:
                # Email fora dos padrões
                return JsonResponse({'success': False, 'status': 4})
        else:
            # Recaptcha inválido
            return JsonResponse({'success': False, 'status': 5})
    else:
        return render(request, 'index/contact.html', {'context': {'project_name': PROJECT_NAME}})

def about(request):
    return render(request, 'index/about.html', {'context': {'project_name': PROJECT_NAME}})

def help(request):
    context = {
        'project_name': PROJECT_NAME,
        'free_plan_click_price': Subscription.objects.first()
    }
    return render(request, 'index/help.html', {'context': context})

def terms(request):
    return render(request, 'index/terms-of-use.html', {'context': {'project_name': PROJECT_NAME}})

def privacy_policy(request):
    return render(request, 'index/privacy-policy.html', {'context': {'project_name': PROJECT_NAME}})
