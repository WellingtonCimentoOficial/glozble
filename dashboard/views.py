import uuid
import os
import requests
from django.shortcuts import redirect, render
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from datetime import datetime
from accounts.models import User
from settings.settings import DEFAULT_FROM_EMAIL, PROJECT_NAME
from wallet.models import Wallet, Transaction
from advertisings.models import Advertising, AffiliateProduct
from decimal import Decimal
from django.utils import timezone
from utils import mail

RECAPTCHA_AD_KEY = os.environ.get("RECAPTCHA_AD_KEY")

# Create your views here.
@login_required(login_url='login')
def dashboard(request):
    if request.user.is_staff == False:
        transaction_deposit_total_value = 0
        transactions_withdraw = request.user.wallet.transaction_set.filter(type="0").order_by("-id")[0:9] # filtrando pelas últimas 10 transações do tipo saque 
        transactions_deposit = request.user.wallet.transaction_set.exclude(type="0").order_by("-id")[0:9] # filtrando pelas últimas 10 transações exceto do tipo saque

        gold_withdraw = 0
        silver_withdraw = 0
        bronze_withdraw = 0

        ads_viewed = len(request.user.advertising_set.filter(viewed=True)) # filtrando por anúncios visualizados e verificando quantos anúncios ja foram visualizados pelo usuario
        ads_clicked = len(request.user.advertising_set.filter(clicked=True)) # filtrando por anúncios clicados e verificando quantos anúncios ja foram clicdos pelo usuario


        withdraw_transactions = []
        withdraw_values = []

        # Pegando todo os saques do usuario e jogando dentro das lista acima(withdraw_transactions)
        for tran in request.user.wallet.transaction_set.filter(type="0").filter(status="2"): # filtrando por todas transações do tipo saque e com status concluido
            withdraw_transactions.append(tran)

        # Pegando todas as transações dentro da lista(withdraw_transactions) e jogando o valor da transação dentro da lista(withdraw_values)
        for transac in withdraw_transactions:
            withdraw_values.append(transac.value)


        # pegando os tres maiores saques do usuario
        if len(withdraw_values) >= 3:
            gold_withdraw = max(withdraw_values)
            withdraw_values.remove(gold_withdraw)
            silver_withdraw = max(withdraw_values)
            withdraw_values.remove(silver_withdraw)
            bronze_withdraw = max(withdraw_values)
        elif len(withdraw_values) == 2:
            gold_withdraw = max(withdraw_values)
            withdraw_values.remove(gold_withdraw)
            silver_withdraw = max(withdraw_values)
        elif len(withdraw_values) == 1:
            gold_withdraw = max(withdraw_values)

        # Somando todos os valores das transações de depósito
        for deposit in request.user.wallet.transaction_set.exclude(type="0"):
            transaction_deposit_total_value += deposit.value


        # Retornando para o templates os valores abaixo
        infos = {
            'transactions_deposit_total_value': transaction_deposit_total_value,
            'transactions_deposit': transactions_deposit,
            'transactions_withdraw': transactions_withdraw,
            'gold_withdraw': gold_withdraw,
            'silver_withdraw': silver_withdraw,
            'bronze_withdraw': bronze_withdraw,
            'ads_viewed': ads_viewed,
            'ads_clicked': ads_clicked,
            'project_name': PROJECT_NAME
        }
        return render(request, 'dashboard/dashboard.html', {'infos': infos})
    else:
        return redirect('/accounts/dashboard/admin/')

@login_required(login_url='login')
def withdraw(request):
    if request.user.is_staff == False:
        if request.method == "POST":
            payment_method_status = False
            payment_method = str(request.POST["payment-method"]).lower()
            payment_key = str(request.POST["payment-key"])
            withdraw_amount = float(request.POST["withdraw-amount"])

            wallet = Wallet.objects.filter(user=request.user).first() # filtrando pela carteira do usuário atual

            new_transaction = Transaction() # criando uma nova transação
            new_transaction.value = Decimal.from_float(withdraw_amount) # convertendo float para decimal
            new_transaction.type = "0" # tipo(Saque)
            new_transaction.status = "1" # status(pendente)
            new_transaction.wallet = wallet
            new_transaction.payment_key = payment_key

            # verificando qual metódo de pagamento foi selecionado
            if payment_method == "picpay":
                new_transaction.method = "0"
                payment_method_status = True
            elif payment_method == "paypal":
                new_transaction.method = "1"
                payment_method_status = True
            elif payment_method == "pix":
                new_transaction.method = "2"
                payment_method_status = True
            else:
                new_transaction.method = None


            if withdraw_amount <= float(request.user.wallet.value): # verificando se a quantidade que o usuário está tentando sacar é menor ou igual a que ele tem disponível na carteira
                if payment_method_status: # verificando se o método de pagamento é válido
                    if new_transaction.check_payment_key(): # verificando se a chave de pagamento é válida
                        try:
                            # transação salva com sucesso
                            new_transaction.save()
                            return JsonResponse({'success': True, 'status': 0})
                        except:
                            # Erro ao salvar a transação
                            return JsonResponse({'success': False, 'status': 1})
                    else:
                        # Chave de pagamento inválida
                        return JsonResponse({'success': False, 'status': 2})
                else:
                    # Método de pagamento inválido
                    return JsonResponse({'success': False, 'status': 3})
            else:
                # Valor de saque maior que o da carteira
                return JsonResponse({'success': False, 'status': 4})

        else:
            withdraw_transactions = request.user.wallet.transaction_set.filter(type="0").order_by("-id")[0:30] # filtrando pelas últimas 30 solicitações de saque
            infos = {
                'withdraw_transactions': withdraw_transactions,
                'project_name': PROJECT_NAME
            }
            return render(request, 'dashboard/withdraw.html', {'infos': infos})
    else:
        return redirect('/accounts/dashboard/admin/')

@login_required(login_url='login')
def settings(request):
    if request.user.is_staff == False:
        if request.method == "POST":
            user = User.objects.filter(username=request.user.username).first()
            if "form-profile" in request.POST:
                first_name = str(request.POST["first_name"])
                last_name = str(request.POST["last_name"])

                user.first_name = first_name
                user.last_name = last_name

                if user.check_first_name(): # verificando se o primeiro nome está dentro dos padrões
                    if user.check_last_name(): # verficiando se o sobrenome está entro dos padrões
                        try:
                            # nome e sobrenome salvos com sucesso
                            user.save()
                            return JsonResponse({'success': True, 'status': 0}) # Salvo com sucesso
                        except:
                            # erro ao salvar o nome e sobrenome
                            return JsonResponse({'success': False, 'status': 1}) # erro ao salvar no banco de dados
                    else:
                        # sobrenome fora dos padrões
                        return JsonResponse({'success': False, 'status': 2}) # last_name fora dos padrões
                else:
                    # nome fora dos padrões
                    return JsonResponse({'success': False, 'status': 3}) # first_name fora dos padrões

            elif "form-safety" in request.POST:
                current_password = str(request.POST["current-password"])
                password1 = str(request.POST["password1"])
                password2 = str(request.POST["password2"])

                if user.check_password(current_password): # verificando se a senha enviada é a mesma cadastrada
                    user.password = password1
                    if password1 == password2 and user.check_good_password(): # verificando se a senha está dentro dos padrões
                        try:
                            # senha atualizada com sucesso
                            user.set_password(password1)
                            user.save()
                            mail.send_email(
                                "Senha alterada com sucesso!",
                                'emails/reset-password-success.html',
                                {'context': {
                                    'user': request.user,
                                    'domain': os.environ.get('DOMAIN_URL'),
                                    'project_name': PROJECT_NAME
                                }},
                                DEFAULT_FROM_EMAIL,
                                (request.user.email, )
                            )
                            return JsonResponse({'success': True, 'status': 0}) # Salvo com sucesso
                        except:
                            # erro ao atualizar a senha
                            return JsonResponse({'success': False, 'status': 1}) # erro ao salvar no banco de dados
                    else:
                        # senhas não conferem ou senha fora dos padrões
                        return JsonResponse({'success': False, 'status': 2}) # senhas não correspondem ou senha fora dos padrões
                else:
                    # senha não confere com a senha salva no banco de dados
                    return JsonResponse({'success': False, 'status': 3}) # senha enviada não é igual a atual
            elif "form-payment-method" in request.POST:
                pay_method = str(request.POST["pay-method"])
                payment_key = str(request.POST["payment-data"])

                wallet = Wallet.objects.filter(user=user).first() # filtrando pela carteira do usuário logado

                # verificando qual metódo de pagamento foi selecionado e salvando no banco de dados
                if pay_method.lower() == "picpay":
                    wallet.payment_method = "0"
                elif pay_method.lower() == "paypal":
                    wallet.payment_method = "1"
                elif pay_method.lower() == "pix":
                    wallet.payment_method = "2"

                wallet.payment_key = payment_key
                
                if wallet.check_payment_key(): # verificando se a chave de pagamento é válida
                    try:
                        # informações de pagamento salvas com sucesso
                        wallet.save()
                        try:
                            mail.send_email(
                                "Dados de pagamento atualizados com sucesso!",
                                'emails/payment-updated.html',
                                {'context': {
                                    'pay_method': pay_method.capitalize(),
                                    'pay_key': payment_key,
                                    'domain': os.environ.get('DOMAIN_URL'),
                                    'project_name': PROJECT_NAME
                                }},
                                DEFAULT_FROM_EMAIL,
                                (request.user.email, )
                            )
                        except:
                            pass
                        return JsonResponse({'success': True, 'status': 0})
                    except:
                        # erro ao salvar no banco de dados
                        return JsonResponse({'success': False, 'status': 1})
                else:
                    # chave de pagamento inválida
                    return JsonResponse({'success': False, 'status': 2})
        else:
            return render(request, 'dashboard/settings.html', {'context': {'project_name': PROJECT_NAME}})
    else:
        return redirect('/accounts/dashboard/admin/')

@login_required(login_url='login')
def ad(request):
    if request.user.is_staff == False:
        if request.method == "POST":
            ads_token = request.POST["adstoken"]
            recaptcha = request.POST["g-recaptcha-response"]
            viewed = request.POST["viewed"]
            clicked = request.POST["clicked"]

            new_transaction = Transaction() # criando uma nova transação
            new_transaction.value = request.user.subscription.click_price # setando o valor da transação de acordo com o plano assinado pelo usuáro
            new_transaction.type = "1" # transação do tipo depósito
            new_transaction.status = "2" # transação com status concluído
            new_transaction.method = "3" # transação feita pela EDITAR
            new_transaction.wallet = request.user.wallet # adicionando a carteira do usuário na transação

            advertising = Advertising.objects.filter(token=ads_token).first() # filtrando pelo anúncio com o memso token enviado pelo usuário
            advertisings = []

            # verificando o captcha
            response_grecaptcha = requests.post("https://www.google.com/recaptcha/api/siteverify", params={'secret': RECAPTCHA_AD_KEY, 'response': recaptcha}).json() # verificando se o token do recaptcha é válido

            # Verificando se o anuncio foi visto ou clicado
            if advertising is not None:
                if viewed == "true":
                    advertising.viewed = True
                else:
                    advertising.viewed = False

                if clicked == "true":
                    advertising.clicked = True
                else:
                    advertising.clicked = False
            

            # Filtrando todos os anuncios clicados no dia de hoje e jogando na lista
            for ads in request.user.advertising_set.filter(viewed=True, clicked=True):
                if ads.viewed_at.strftime("%d-%m-%Y") == timezone.now().strftime("%d-%m-%Y"):
                    advertisings.append(ads)

            # fazendo todas as verificações antes de computar os dados no banco de dados
            if advertising is not None: # verificando se existe algum anuncio com o token enviado
                if advertising.user == request.user: # verificando se o usuario atual é o mesmo do anuncio do token
                    if advertising.validate_time(): # verificando a requisição esta dentro dos padrões de tempo, se o usuario assistiu o anuncio por pelo menos 10 segundos
                        if response_grecaptcha["success"]: # verificando se o token do captcha é válido
                            if len(advertisings) + 1 <= request.user.subscription.limit_clicks: # verificando se o limite de cliques diário foi atingido
                                if request.user.advertising_set.filter(token=ads_token).first().viewed and clicked == "true": # verificando se o anuncio ja foi assistido e clicado
                                    try: 
                                        # Anuncio assistido e clicado
                                        advertising.save()
                                        new_transaction.save()
                                        return JsonResponse({"success": True, "status": 0})
                                    except: 
                                        # erro ao salvar os dados
                                        return JsonResponse({"success": False, "status": 1})
                                elif viewed == "true" and clicked == "false": # verificando se o anuncio foi apenas assistido
                                    try: 
                                        # anuncio apenas assistido
                                        advertising.save()
                                        return JsonResponse({"success": True, "status": 2, "link": AffiliateProduct.objects.all().order_by("?").first().link})
                                    except: 
                                        # erro ao salvar os dados
                                        return JsonResponse({"success": False, "status": 1})
                                elif viewed == "false" and clicked == "true": # verificando se o anuncio foi apenas clicado
                                    try:  
                                        # anuncio apenas clicado
                                        advertising.save()
                                        return JsonResponse({"success": True, "status": 2})
                                    except: 
                                        # erro ao salvar os dados
                                        return JsonResponse({"success": False, "status": 1})
                                else: # verificando se o anuncio não foi assistido nem visualizado ou se as informações enviadas são invalidas
                                    return JsonResponse({"success": False, "status": 3})
                            else:
                                # limite de cliques diário atingido
                                return JsonResponse({"success": False, "status": 4})
                        else:
                            # captcha inválido
                            return JsonResponse({"success": False, "status": 5})
                    else:
                        # requisição fora dos padrões de tempo
                        return JsonResponse({"success": False, "status": 6})
                else:
                    # usuário atual não é o mesmo do anuncio do token
                    return JsonResponse({"success": False, "status": 7})
            else:
                # anuncio com o token enviado não existe
                return JsonResponse({"success": False, "status": 8})
        else:
            adstoken = uuid.uuid4() # gerando token aleatório sempre que a requisição for get(sempre que a página for acessada)
            new_advertising = Advertising()
            new_advertising.token = adstoken
            new_advertising.user = request.user
            new_advertising.save()
            return render(request, 'dashboard/ad.html', {'context': {'adstoken': adstoken, 'project_name': PROJECT_NAME}})
    else:
        return redirect('/accounts/dashboard/admin/')

@login_required(login_url='login')
def graphic(request):
    if request.method == "GET":
        # Soma dos valores mensais para o gráfico da pagina dashboard
        deposit_transactions = []
        graphic_values = {
            'jan': 0,
            'fev': 0,
            'mar': 0,
            'abr': 0,
            'mai': 0,
            'jun': 0,
            'jul': 0,
            'ago': 0,
            'set': 0,
            'out': 0,
            'nov': 0,
            'dez': 0,
        }
        for trans in request.user.wallet.transaction_set.exclude(type="0"): # filtrando por todas transações exeto do tipo saque
            deposit_transactions.append(trans)

        # percorrendo todas as transações e adicionando no dicionario apenas aquelas com o ano = ano atual e mes correspondente
        for transac in deposit_transactions:
            date_time_month = timezone.localdate(transac.created_at).month
            date_time_year = timezone.localdate(transac.created_at).year
            if date_time_month == 1 and date_time_year == datetime.now().year:
                graphic_values["jan"] += float(transac.value)
            elif date_time_month == 2 and date_time_year == datetime.now().year:
                graphic_values["fev"] += float(transac.value)
            elif date_time_month == 3 and date_time_year == datetime.now().year:
                graphic_values["mar"] += float(transac.value)
            elif date_time_month == 4 and date_time_year == datetime.now().year:
                graphic_values["abr"] += float(transac.value)
            elif date_time_month == 5 and date_time_year == datetime.now().year:
                graphic_values["mai"] += float(transac.value)
            elif date_time_month == 6 and date_time_year == datetime.now().year:
                graphic_values["jun"] += float(transac.value)
            elif date_time_month == 7 and date_time_year == datetime.now().year:
                graphic_values["jul"] += float(transac.value)
            elif date_time_month == 8 and date_time_year == datetime.now().year:
                graphic_values["ago"] += float(transac.value)
            elif date_time_month == 9 and date_time_year == datetime.now().year:
                graphic_values["set"] += float(transac.value)
            elif date_time_month == 10 and date_time_year == datetime.now().year:
                graphic_values["out"] += float(transac.value)
            elif date_time_month == 11 and date_time_year == datetime.now().year:
                graphic_values["nov"] += float(transac.value)
            elif date_time_month == 12 and date_time_year == datetime.now().year:
                graphic_values["dez"] += float(transac.value)
        return JsonResponse(graphic_values)
    else:
        return redirect('dashboard')