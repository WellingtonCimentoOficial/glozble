const pagamento_options = document.querySelectorAll("#section-2 div.container div.flex-item-pagamento div.flex-item")
const btn_picpay = document.getElementById("mpicpay")
const btn_paypal = document.getElementById("mpaypal")
const btn_pix = document.getElementById("mpix")
const radio_picpay = document.getElementById("oppicpay")
const radio_paypal = document.getElementById("oppaypal")
const radio_pix = document.getElementById("oppix")
const qtd_saque = document.getElementById("qtd-saque")
const info_saque = document.getElementById("info-saque")
const submit_form = document.querySelector("#section-2 div.container div.flex-item-sacar form input[type=submit]")
const section_1 = document.getElementById("section-1")
const section_2 = document.getElementById("section-2")
const section_3 = document.getElementById("section-3")
const body = document.querySelector("body")
const html = document.querySelector("html")
const btn_logout = document.querySelector("section#flex-logout")
const whatsapp_share = document.getElementById("whatsapp-share")
const instagram_share = document.getElementById("instagram-share")
const twitter_share = document.getElementById("twitter-share")
const facebook_share = document.getElementById("facebook-share")
var wallet_current_value = parseFloat(document.getElementById("my-money").textContent.toString().replace("R$", "").replace(".", "").replace(",", "."))


var payment_method = "PicPay"
var form_valid_amount = false
var form_valid_payment_info = false

const qtd_saque_message = document.getElementById("qtd-saque-message")
const info_saque_message = document.getElementById("info-saque-message")

//FUNÇÕES
function removeAllChildreen(){
    poup = document.getElementById("message-poup")
    while(poup.lastElementChild){
        poup.removeChild(poup.lastElementChild)
    }
    qtd_saque.disabled = false
    info_saque.disabled = false
    submit_form.disabled = false
    btn_logout.classList.toggle("stop-interaction")
    section_1.classList.toggle("stop-interaction")
    section_2.classList.toggle("stop-interaction")
    section_3.classList.toggle("stop-interaction")
    html.classList.toggle("stop-scrolling")
    body.classList.toggle("stop-scrolling")
}

function validate_methodOnload(){
    if(radio_picpay.checked){
        info_saque.placeholder = "E-mail do PicPay"
    }else if(radio_paypal.checked){
        info_saque.placeholder = "E-mail do PayPal"
    }else{
        info_saque.placeholder = "E-mail, CPF, CNPJ ou Chave Aleatória"
    }
}

function validate_method_payment(){
    info_saque.value = info_saque.value.toLowerCase()
    removespecialchair = info_saque.value.replace(".", "").replace("-", "").replace("/", "")
    noSpecialchar = removespecialchair.replace(".", "").replace("-", "").replace("/", "")
    if(info_saque.value != ""){
        if(radio_picpay.checked === true){
            if(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(info_saque.value) && /\s/.test(info_saque.value) == false){
                //EMAIL VERDADEIRO
                form_valid_payment_info = true
                info_saque.style.borderColor = "#e5e5e5"
                info_saque_message.textContent = ""
            }else{
                form_valid_payment_info = false
                info_saque.style.borderColor = "red"
                info_saque_message.textContent = "E-mail inválido"
            }
        }else if(radio_paypal.checked === true){
            if(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(info_saque.value) && /\s/.test(info_saque.value) == false){
                //EMAIL VERDADEIRO
                form_valid_payment_info = true
                info_saque.style.borderColor = "#e5e5e5"
                info_saque_message.textContent = ""
            }else{
                form_valid_payment_info = false
                info_saque.style.borderColor = "red"
                info_saque_message.textContent = "E-mail inválido"
            }
        }else if(radio_pix.checked === true){
            if(/[0-9]{14,14}/.test(noSpecialchar) === true && /\s/.test(info_saque.value) == false && noSpecialchar.length == 14){
                //FORMATANDO CNPJ
                if(noSpecialchar.length == 14){
                    info_saque.value = noSpecialchar[0] + noSpecialchar[1] + "." + noSpecialchar[2] + noSpecialchar[3] + noSpecialchar[4] + "." + noSpecialchar[5] + noSpecialchar[6] + noSpecialchar[7] + "/" + noSpecialchar[8] + noSpecialchar[9] + noSpecialchar[10] + noSpecialchar[11] + "-" + noSpecialchar[12] + noSpecialchar[13]
                }
                form_valid_payment_info = true
                info_saque.style.borderColor = "#e5e5e5"
                info_saque_message.textContent = ""
            }else if(/[0-9]{11,11}/.test(noSpecialchar) === true && /\s/.test(info_saque.value) == false && noSpecialchar.length == 11){
                //FORMATANDO CPF
                if(noSpecialchar.length == 11) {
                    info_saque.value = noSpecialchar[0] + noSpecialchar[1] + noSpecialchar[2] + "." + noSpecialchar[3] + noSpecialchar[4] + noSpecialchar[5] + "." + noSpecialchar[6] + noSpecialchar[7] + noSpecialchar[8] + "-" + noSpecialchar[9] + noSpecialchar[10]
                }
                form_valid_payment_info = true
                info_saque.style.borderColor = "#e5e5e5"
                info_saque_message.textContent = ""
            }else if(/[a-z\d]{8}[a-z\d]{4}[a-z\d]{4}[a-z\d]{4}[a-z\d]{12}/.test(noSpecialchar) && /\s/.test(info_saque.value) == false && noSpecialchar.length == 32){
                //FORMATANDO CHAVE ALEATÓRIA VERDADEIRA
                if(noSpecialchar.length == 32) {
                    info_saque.value = noSpecialchar.substring(0, 8) + "-" + noSpecialchar.substring(8, 12) + "-" + noSpecialchar.substring(12, 16) + "-" + noSpecialchar.substring(16, 20) + "-" + noSpecialchar.substring(20, 32)
                }
                form_valid_payment_info = true
                info_saque.style.borderColor = "#e5e5e5"
                info_saque_message.textContent = ""
            }else if(/[\d]{2}.[\d]{3}.[\d]{3}\/[\d]{4}-[\d]{2}/.test(info_saque.value) && /\s/.test(info_saque.value) == false){
                //CNPJ VERDADEIRO
                form_valid_payment_info = true
                info_saque.style.borderColor = "#e5e5e5"
                info_saque_message.textContent = ""
            }else if(/[\d]{3}.[\d]{3}.[\d]{3}\-[\d]{2}/.test(info_saque.value) && /\s/.test(info_saque.value) == false){
                //CPF VERDADEIRO
                form_valid_payment_info = true
                info_saque.style.borderColor = "#e5e5e5"
                info_saque_message.textContent = ""
            }else if(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(info_saque.value) && /\s/.test(info_saque.value) == false){
                //EMAIL VERDADEIRO
                form_valid_payment_info = true
                info_saque.style.borderColor = "#e5e5e5"
                info_saque_message.textContent = ""
            }else if(/[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}/.test(info_saque.value) && /\s/.test(info_saque.value) == false){
                //CHAVE ALEATÓRIA VERDADEIRA
                form_valid_payment_info = true
                info_saque.style.borderColor = "#e5e5e5"
                info_saque_message.textContent = ""
            }else{
                //INFORMAÇÃO INCORRETA
                form_valid_payment_info = false
                info_saque.style.borderColor = "red"
                info_saque_message.textContent = "Chave de pagamento inválida"
            }
        }
    }else{
        info_saque.style.borderColor = "red"
        info_saque_message.textContent = "Chave de pagamento inválida"
    }
}

function validade_qtd_saque_input() {// VALIDANDO O INPUT DA QUANTIDADE QUE DESEJA SACAR
    qtd_saque.value = qtd_saque.value.toString().replace(",", ".")
    if(/[\s}{,^?~=+°ºª[\]´`§()&"¬¨%¢$£#³@²!':;\\-_\/*\-+\|a-zA-Z]/.test(qtd_saque.value) === false){
        if(parseFloat(qtd_saque.value) >= 100 && parseFloat(qtd_saque.value) <= wallet_current_value){
            form_valid_amount = true
            qtd_saque.style.borderColor = "#e5e5e5"
            qtd_saque_message.textContent = ""
        }else{
            qtd_saque.style.borderColor = "red"
            qtd_saque_message.textContent = "O valor mínimo para saque é R$ 100,00"
        }
    }else{
        form_valid_amount = false
        qtd_saque.style.borderColor = "red"
        qtd_saque_message.textContent = "Digite apenas números"
    }
}


function buttons_payment() {//VERIFICANDO SE PELO MENOS UMA OPÇÃO DE PAGAMENTO FOI ESCOLHIDA
    if(radio_picpay.checked == true) {
        btn_picpay.style.borderColor = "var(--roxo-principal)"
        btn_paypal.style.borderColor = "transparent"
        btn_pix.style.borderColor = "transparent"
        payment_method = "PicPay"
    }else if(radio_paypal.checked == true){
        btn_paypal.style.borderColor = "var(--roxo-principal)"
        btn_picpay.style.borderColor = "transparent"
        btn_pix.style.borderColor = "transparent"
        payment_method = "PayPal"
    }else if(radio_pix.checked == true){
        radio_pix.style.borderColor = "var(--roxo-principal)"
        btn_picpay.style.borderColor = "transparent"
        btn_paypal.style.borderColor = "transparent"
        payment_method = "Pix"
    }else{
        btn_picpay.style.borderColor = "red"
        btn_paypal.style.borderColor = "red"
        btn_pix.style.borderColor = "red"
    }
}


function valueBRL(value) {
    return parseFloat(value).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})
}


function percentage(value, percentage) {
    a = (parseInt(percentage) * parseInt(value)) / 100
    return a
}

function withdrawShowMessage(message, color) {
    let message_poup = document.querySelector("#div-messages-poup span")
    message_poup.textContent = message
    message_poup.style.color = color
}


function withdrawResponse(data){
    let btn_confirm_withdraw = document.getElementById("btn-confirm-withdraw-poup")
    let btn_cancel_withdraw = document.getElementById("btn-cancel-withdraw-poup")
    let icon_poup = document.querySelector("#div-icon-poup i")
    if(data["success"]){
        icon_poup.classList.remove("fa-money-bill-transfer")
        icon_poup.classList.add("fa-check")
        icon_poup.style.color = "green"

        btn_confirm_withdraw.style.display = "none"
        btn_confirm_withdraw.disabled = true
        btn_cancel_withdraw.remove()

        btn_confirm_withdraw.style.width = "auto"

        withdrawShowMessage("Solicitação de saque concluída com sucesso!", "green")

        let cont = 5
        let regre = () => {
            btn_confirm_withdraw.style.borderColor = "transparent"
            btn_confirm_withdraw.style.display = "block"
            btn_confirm_withdraw.style.pointerEvents = "none"
            if(cont == -1){
                window.location.reload()
            }else{
                btn_confirm_withdraw.textContent = "Redirecionando em " + cont
                cont--
                setTimeout(regre, 1000)
            }
        }

        setTimeout(regre, 1000)
        
    }else{
        icon_poup.style.color = "red"
        icon_poup.classList.remove("fa-money-bill-transfer")
        icon_poup.classList.add("fa-xmark")
        btn_confirm_withdraw.disabled = true
        if(data["status"] == 1){
            //Erro ao salvar a transação
            withdrawShowMessage("Ocorreu um erro, atualize a página e tente novamente", "red")
        }else if(data["status"] == 2){
            //Chave de pagamento inválida
            withdrawShowMessage("Chave de pagamento inválida!", "red")
        }else if(data["status"] == 3){
            //Método de pagamento inválido
            withdrawShowMessage("Método de pagamento inválido!", "red")
        }else if(data["status"] == 4){
            //Valor de saque maior que o da carteira
            withdrawShowMessage("Valor do saque excede a quantidade disponível em carteira!", "red")
        }
    }
}

// SPINNER DE CARREGAMENTO
const showLoading = (show) => {
    let html = document.querySelector("html")
    let body = document.querySelector("body")
    let spinner = document.getElementById("spinner-loading")
    if(show){
        spinner.style.display = "flex"
        body.style.pointerEvents = "none"
        html.style.pointerEvents = "none"
        body.style.overflow = "hidden"
        html.style.overflow = "hidden"
    }else{
        spinner.style.display = "none"
        body.style.pointerEvents = "auto"
        html.style.pointerEvents = "auto"
        body.style.overflowY = "visible"
        html.style.overflowY = "visible"
    }
}


function makeWithdraw(){
    let btn_confirm_withdraw = document.getElementById("btn-confirm-withdraw-poup")
    let btn_confirm_withdraw_old = btn_confirm_withdraw.textContent
    let csrf = document.querySelector("#form-withdraw input[name='csrfmiddlewaretoken']").value
    let url = window.location.href
    let data = new FormData()

    data.append("payment-method", payment_method)
    data.append("payment-key", info_saque.value)
    data.append("withdraw-amount", qtd_saque.value)
    data.append("csrfmiddlewaretoken", csrf)

    axios.request({
        method: "POST",
        url: url,
        data: data,
        onUploadProgress: () => {
            showLoading(true)
            btn_confirm_withdraw.textContent = "Carregando..."
        }
    })
    .then(response => {
        showLoading(false)
        btn_confirm_withdraw.textContent = btn_confirm_withdraw_old
        withdrawResponse(response.data)
    })

}

function check_form(event) {//VALIDANDO FORMULARIO
    event.preventDefault();
    if(form_valid_amount === true){
        if(form_valid_payment_info === true){
            if(radio_picpay.checked === true || radio_paypal.checked === true || radio_pix.checked === true){
                let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
                let localISOTime = (new Date(Date.now() - tzoffset)).toISOString().slice(0, -1);
                document.getElementById("message-poup").innerHTML = `
                    <div id="withdraw_confirmation">
                        <i id="btn-close" class="fa-solid fa-circle-xmark" onclick='removeAllChildreen()'></i>
                        <div class="container">
                            <div class="flex-item">
                                <h3>REVISÃO DE SAQUE</h3>
                            </div>
                            <div class="flex-item-payment-poupup">
                                <div class="payment-info">
                                    <span>Data da Solicitação: <p>${localISOTime.replace("T", " ").replace("Z", "").slice(0, 19)}</p></span>
                                    <span>Forma de Pagamento: <p>${payment_method}</p></span>
                                    <span>Chave: <p>${info_saque.value}</p></span>
                                    <span>Valor bruto: <p>${valueBRL(qtd_saque.value)}</p></span>
                                    <span>Taxa: <p>0%</p></span>
                                    <span>Valor líquido: <p>${valueBRL(qtd_saque.value - percentage(qtd_saque.value, 0))}</p></span>
                                </div>
                                <div id="div-icon-poup" class="flex-item">
                                    <i class="fa-solid fa-money-bill-transfer"></i>
                                </div>
                                <div id="div-messages-poup" class="flex-item"><span></span></div>
                                <div class="flex-buttons">
                                    <button id="btn-confirm-withdraw-poup" onclick='makeWithdraw()'>Confirmar</button>
                                    <button id="btn-cancel-withdraw-poup" onclick='removeAllChildreen()'>Cancelar</button>
                                </div>
                            </div>
                        </div>
                    </div>
                `
                qtd_saque.disabled = true
                info_saque.disabled = true
                submit_form.disabled = true
                btn_logout.classList.toggle("stop-interaction")
                section_1.classList.toggle("stop-interaction")
                section_2.classList.toggle("stop-interaction")
                section_3.classList.toggle("stop-interaction")
                html.classList.toggle("stop-scrolling")
                body.classList.toggle("stop-scrolling")
            }else{
                btn_picpay.style.borderColor = "red"
                btn_paypal.style.borderColor = "red"
                btn_pix.style.borderColor = "red"
            }
        }else{
            info_saque.style.borderColor = "red"
        }
    }else{
        qtd_saque.style.borderColor = "red"
    }
}


//SELECIONANDO A FORMA DE PAGAMENTO
pagamento_options.forEach(pagamento => {
    pagamento.addEventListener("click", () => {
        if(pagamento.id == "mpicpay"){
            radio_picpay.checked = true
            btn_picpay.style.borderColor = "var(--roxo-principal)"
            btn_paypal.style.borderColor = "white"
            btn_pix.style.borderColor = "white"
            info_saque.placeholder = "E-mail do PicPay"
            validate_method_payment()
        }else if(pagamento.id == "mpaypal"){
            radio_paypal.checked = true
            btn_picpay.style.borderColor = "white"
            btn_paypal.style.borderColor = "var(--roxo-principal)"
            btn_pix.style.borderColor = "white"
            info_saque.placeholder = "E-mail do PayPal"
            validate_method_payment()
        }else{
            radio_pix.checked = true
            btn_picpay.style.borderColor = "white"
            btn_paypal.style.borderColor = "white"
            btn_pix.style.borderColor = "var(--roxo-principal)"
            info_saque.placeholder = "E-mail, CPF, CNPJ ou Chave Aleatória"
            validate_method_payment()
        }
    })
})


//Validando o input de chave de pagamento ao carregar a página
function validateMethodPaymentOnload(){
    if(info_saque.value != ""){
        validate_method_payment()
    }
}




//SHARE SOCIAL MIDIA
const whatsappShare = () => {
    let url = "https://web.whatsapp.com/"
    window.open(url, '_blank').focus()
}

const instagramShare = () => {
    let url = "https://www.instagram.com/gozble/"
    window.open(url, '_blank').focus()
}

const facebookShare = () => {
    let url = "https://www.facebook.com/sharer/sharer.php?u=https%3A%2F%2Fwww.facebook.com%2FGlozble-104209759071594&amp;src=sdkpreparse"
    window.open(url, '_blank').focus()
}

const twitterShare = () => {
    let url = "https://twitter.com/glozble"
    window.open(url, '_blank').focus()
}


//LISTENERS
qtd_saque.addEventListener("keyup", validade_qtd_saque_input)
info_saque.addEventListener("keyup", validate_method_payment)
btn_picpay.addEventListener("click", buttons_payment)
btn_paypal.addEventListener("click", buttons_payment)
btn_pix.addEventListener("click", buttons_payment)
submit_form.addEventListener("click", (event) => {check_form(event)})

//SOCIAL MIDIA SHARE
whatsapp_share.addEventListener("click", whatsappShare)
facebook_share.addEventListener("click", facebookShare)
instagram_share.addEventListener("click", instagramShare)
twitter_share.addEventListener("click", twitterShare)

window.onload = () => {
    validateMethodPaymentOnload()
    buttons_payment()
    validate_methodOnload()
}