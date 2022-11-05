const form_profile = document.getElementById("form-profile")
const form_safety = document.getElementById("form-safety")
const form_payment_method = document.getElementById("form-payment-method")

const first_name = document.getElementById("first_name")
const last_name = document.getElementById("last_name")
const current_password = document.getElementById("current_password")
const password1 = document.getElementById("password1")
const password2 = document.getElementById("password2")
const pay_method = document.getElementById("pay-method")
const payment_data = document.getElementById("payment-data")

const first_name_message = document.getElementById("first-name-message")
const last_name_message = document.getElementById("last-name-message")
const current_password_message = document.getElementById("current-password_message")
const password1_message = document.getElementById("password1-message")
const password2_message = document.getElementById("password2-message")
const payment_data_message = document.getElementById("payment-data-message")

var input_first_name_status = false
var input_last_name_status = false
var input_current_password_status = false
var input_password1_status = false
var input_password2_status = false
var input_payment_data_status = false


const url_request = "/accounts/dashboard/settings/"


//MESSAGES
const msg_first_name_invalid = "Nome incorreto"
const msg_last_name_invalid = "Sobrenome incorreto"
const msg_current_password_invalid = "Senha incorreta"
const msg_password1_invalid = "A senha deve ter de 8 a 64 caracteres, contendo letra maiúscula, letra minúscula, número e caractere especial."
const msg_password2_invalid = "As senhas não correspondem."
const msg_payment_data_invalid = "Dados inválidos."

//VALIDANDO INPUT NOME
function ValidateInputFirstName(){
    if(first_name.value.length > 0 && first_name.value.length < 20){
        first_name.classList.remove('input-incorrect')
        if(/\d/.test(first_name.value) === false && /\W/.test(first_name.value) === false){
            first_name.classList.remove('input-incorrect')
            first_name_message.textContent = ""
            input_first_name_status = true
        }else{
            input_first_name_status = false
            first_name.classList.add('input-incorrect')
            first_name_message.textContent = msg_first_name_invalid
        }
    }else{
        input_first_name_status = false
        first_name.classList.add('input-incorrect')
        first_name_message.textContent = msg_first_name_invalid
    }
}

//VALIDANDO INPUT SOBRENOME
function ValidateInputLastName(){
    if(last_name.value.length > 0 && last_name.value.length < 50){
        last_name.classList.remove('input-incorrect')
        if(/\d/.test(last_name.value) === false && /['"!@#$%¨&*()\-_+=£¢¬§´`{}[\]ªº|\\,.:;?/°]/.test(last_name.value) === false){
            last_name.classList.remove('input-incorrect')
            last_name_message.textContent = ""
            input_last_name_status = true
        }else{
            last_name.classList.add('input-incorrect')
            last_name_message.textContent = msg_last_name_invalid
            input_last_name_status = false
        }
    }else{
        last_name.classList.add('input-incorrect')
        last_name_message.textContent = msg_last_name_invalid
        input_last_name_status = false
    }
}

//VALIDANDO INPUT SENHA ATUAL
function ValidateInputCurrentPassword(){
    input_current_password_status = true
    current_password.classList.remove('input-incorrect')
    current_password_message.textContent = ""
    /*
    if(current_password.value.length >= 8){ 
        current_password.classList.remove('input-incorrect')
        current_password_message.textContent = ""
        input_current_password_status = true
    }else{
        current_password.classList.add('input-incorrect')
        current_password_message.textContent = "Digite pelo menos 8 caracteres"
        input_current_password_status = false
    }
    */
}

//VALIDANDO INPUT NOVA SENHA
function ValidateInputPassword1(){
    if(password1.value.length >= 8 && password1.value.length <= 20){
        password1.classList.remove('input-incorrect')
        if(/[a-z]/.test(password1.value) && /[A-Z]/.test(password1.value) && /\W/.test(password1.value) && /\d/.test(password1.value)){
            password1.classList.remove('input-incorrect')
            password1_message.textContent = ""
            input_password1_status = true
        }else{
            input_password1_status = false
            password1.classList.add('input-incorrect')
            password1_message.textContent = msg_password1_invalid
        }
    }else{
        input_password1_status = false
        password1.classList.add('input-incorrect')
        password1_message.textContent = msg_password1_invalid
    }
}

//VALIDANDO INPUT CONFIRMAR SENHA
function ValidateInputPassword2(){
    if(password2.value === password1.value) {
        password2.classList.remove('input-incorrect')
        password2_message.textContent = ""
        input_password2_status = true
    }else{
        input_password2_status = false
        password2.classList.add('input-incorrect')
        password2_message.textContent = msg_password2_invalid
    }
}

//VALIDANDO INPUT DO METÓDO DE PAGAMENTO
function ValidateInputPaymentData(){
    payment_data.value = payment_data.value.toLowerCase()
    removespecialchair = payment_data.value.replace(".", "").replace("-", "").replace("/", "")
    noSpecialchar = removespecialchair.replace(".", "").replace("-", "").replace("/", "")
    if(payment_data.value != ""){
        if(pay_method.value.toLowerCase() === "picpay"){
            if(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(payment_data.value) && /\s/.test(payment_data.value) == false){
                //EMAIL VERDADEIRO
                input_payment_data_status = true
                payment_data.style.borderColor = "#e5e5e5"
                payment_data_message.textContent = ""
            }else{
                input_payment_data_status = false
                payment_data.style.borderColor = "red"
                payment_data_message.textContent = "E-mail inválido"
            }
        }else if(pay_method.value.toLowerCase() === "paypal"){
            if(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(payment_data.value) && /\s/.test(payment_data.value) == false){
                //EMAIL VERDADEIRO
                input_payment_data_status = true
                payment_data.style.borderColor = "#e5e5e5"
                payment_data_message.textContent = ""
            }else{
                input_payment_data_status = false
                payment_data.style.borderColor = "red"
                payment_data_message.textContent = "E-mail inválido"
            }
        }else if(pay_method.value.toLowerCase() === "pix"){
            if(/[0-9]{14,14}/.test(noSpecialchar) === true && /\s/.test(payment_data.value) == false && noSpecialchar.length == 14){
                //FORMATANDO CNPJ
                if(noSpecialchar.length == 14){
                    payment_data.value = noSpecialchar[0] + noSpecialchar[1] + "." + noSpecialchar[2] + noSpecialchar[3] + noSpecialchar[4] + "." + noSpecialchar[5] + noSpecialchar[6] + noSpecialchar[7] + "/" + noSpecialchar[8] + noSpecialchar[9] + noSpecialchar[10] + noSpecialchar[11] + "-" + noSpecialchar[12] + noSpecialchar[13]
                }
                input_payment_data_status = true
                payment_data.style.borderColor = "#e5e5e5"
                payment_data_message.textContent = ""

            }else if(/[0-9]{11,11}/.test(noSpecialchar) === true && /\s/.test(payment_data.value) == false && noSpecialchar.length == 11){
                //FORMATANDO CPF
                if(noSpecialchar.length == 11) {
                    payment_data.value = noSpecialchar[0] + noSpecialchar[1] + noSpecialchar[2] + "." + noSpecialchar[3] + noSpecialchar[4] + noSpecialchar[5] + "." + noSpecialchar[6] + noSpecialchar[7] + noSpecialchar[8] + "-" + noSpecialchar[9] + noSpecialchar[10]
                }
                input_payment_data_status = true
                payment_data.style.borderColor = "#e5e5e5"
                payment_data_message.textContent = ""

            }else if(/[a-z\d]{8}[a-z\d]{4}[a-z\d]{4}[a-z\d]{4}[a-z\d]{12}/.test(noSpecialchar) && /\s/.test(payment_data.value) == false && noSpecialchar.length == 32){
                //FORMATANDO CHAVE ALEATÓRIA VERDADEIRA
                if(noSpecialchar.length == 32) {
                    payment_data.value = noSpecialchar.substring(0, 8) + "-" + noSpecialchar.substring(8, 12) + "-" + noSpecialchar.substring(12, 16) + "-" + noSpecialchar.substring(16, 20) + "-" + noSpecialchar.substring(20, 32)
                }
                input_payment_data_status = true
                payment_data.style.borderColor = "#e5e5e5"
                payment_data_message.textContent = ""

            }else if(/[\d]{2}.[\d]{3}.[\d]{3}\/[\d]{4}-[\d]{2}/.test(payment_data.value) && /\s/.test(payment_data.value) == false){
                //CNPJ VERDADEIRO
                input_payment_data_status = true
                payment_data.style.borderColor = "#e5e5e5"
                payment_data_message.textContent = ""

            }else if(/[\d]{3}.[\d]{3}.[\d]{3}\-[\d]{2}/.test(payment_data.value) && /\s/.test(payment_data.value) == false){
                //CPF VERDADEIRO
                input_payment_data_status = true
                payment_data.style.borderColor = "#e5e5e5"
                payment_data_message.textContent = ""

            }else if(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(payment_data.value) && /\s/.test(payment_data.value) == false){
                //EMAIL VERDADEIRO
                input_payment_data_status = true
                payment_data.style.borderColor = "#e5e5e5"
                payment_data_message.textContent = ""

            }else if(/[a-z\d]{8}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{4}-[a-z\d]{12}/.test(payment_data.value) && /\s/.test(payment_data.value) == false){
                //CHAVE ALEATÓRIA VERDADEIRA
                input_payment_data_status = true
                payment_data.style.borderColor = "#e5e5e5"
                payment_data_message.textContent = ""
            }else{
                //INFORMAÇÃO INCORRETA
                input_payment_data_status = false
                payment_data.style.borderColor = "red"
                payment_data_message.textContent = "Chave de pagamento inválida"
            }
        }
    }else{
        payment_data.style.borderColor = "red"
        payment_data_message.textContent = "Chave de pagamento inválida"
    }
}

function ValidateSelect(option){
    if(option.toLowerCase() === "validate") {
        if(pay_method.value.toLowerCase() == "picpay"){
            payment_data.placeholder = "E-mail do PicPay"
            ValidateInputPaymentData()
        }else if(pay_method.value.toLowerCase() == "paypal"){
            payment_data.placeholder = "E-mail do PayPal"
            ValidateInputPaymentData()
        }else if(pay_method.value.toLowerCase() == "pix"){
            payment_data.placeholder = "E-mail, CPF, CNPJ ou Chave Aleatória"
            ValidateInputPaymentData()
        }
    }else{
        if(pay_method.value.toLowerCase() == "picpay"){
            payment_data.placeholder = "E-mail do PicPay"
        }else if(pay_method.value.toLowerCase() == "paypal"){
            payment_data.placeholder = "E-mail do PayPal"
        }else if(pay_method.value.toLowerCase() == "pix"){
            payment_data.placeholder = "E-mail, CPF, CNPJ ou Chave Aleatória"
        }
    }
    
}

//VALIDANDO FORMULARIO DO PERFIL
function ValidadeFormProfile(){
    if(input_first_name_status && input_last_name_status){
        return true
    }else{
        return false
    }
}

//VALIDANDO FORMULÁRIO DE SEGURANÇA
function ValidateFormSafety(){
    if(input_current_password_status && input_password1_status && input_password2_status && password1.value === password2.value){
        current_password.classList.remove("input-incorrect")
        password1.classList.remove("input-incorrect")
        password2.classList.remove("input-incorrect")
        return true
    }else{
        current_password.classList.add("input-incorrect")
        password1.classList.add("input-incorrect")
        password2.classList.add("input-incorrect")
        return false
    }
}

//VALIDANDO FORMULÁRIO DO MÉTODO DE PAGAMENTO
function ValidateFormPaymentMethod(){
    if(input_payment_data_status){
        return true
    }else{
        return false
    }
}


// RETORNANDO PARA O USÁRIO SE ALGUM CAMPO ESTÁ FORA DOS PADRÕES
function serverResponseUpdateProfile(data){
    if(data["success"]){
        // Informações atualizadas com sucesso
        window.location.reload()
    }else{
        if(data["status"] == 1){
            //Erro ao salvar no banco de dados
            alert("Ocorreu um erro")
        }else if(data["status"] == 2){
            //first_name fora dos padrões
            first_name.classList.add('input-incorrect')
            first_name_message.textContent = msg_first_name_invalid
            input_first_name_status = false
        }else if(data["status"] == 3){
            //last_name fora dos padrões
            last_name.classList.add('input-incorrect')
            last_name_message.textContent = msg_last_name_invalid
            input_last_name_status = false
        }
    }
}


// RETORNANDO PARA O USÁRIO SE ALGUM CAMPO ESTÁ FORA DOS PADRÕES
function serverResponseUpdateSafety(data){
    if(data["success"]){
        // Informações atualizadas com sucesso
        window.location.reload()
    }else{
        if(data["status"] == 1){
            //Erro ao salvar no banco de dados
            alert("Ocorreu um erro")
        }else if(data["status"] == 2){
            //senhas não correspondem ou senha fora dos padrões
            password1.classList.add('input-incorrect')
            input_password1_status = false
            password2.classList.add('input-incorrect')
            input_password2_status = false
            password1_message.textContent = msg_password2_invalid
            password2_message.textContent = msg_password2_invalid
        }else if(data["status"] == 3){
            //senha enviada não é igual a atual
            current_password.classList.add('input-incorrect')
            current_password_message.textContent = msg_current_password_invalid
            input_current_password_status = false
        }
    }
}


// RETORNANDO PARA O USÁRIO SE ALGUM CAMPO ESTÁ FORA DOS PADRÕES
function serverResponseUpdatePaymentMethod(data){
    if(data["success"]){
        // Informações atualizadas com sucesso
        window.location.reload()
    }else{
        if(data["status"] == 1){
            // Erro ao salvar os dados
            alert("Ocorreu um erro")
        }else if(data["status"] == 2){ // Informações incorretas
            payment_data.style.borderColor = "red"
            payment_data_message.textContent = msg_payment_data_invalid
            input_payment_data_status = false
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


//FAZENDO O POST DAS CONFIGURAÇÕES DO PERFIL
function updateProfile(){
    let csrf = document.querySelector("#form-profile input[name='csrfmiddlewaretoken']").value
    let btn_submit = document.querySelector("#form-profile input[type=submit]")
    let btn_submit_old_value = btn_submit.value

    let data = new FormData()

    data.append("first_name", first_name.value)
    data.append("last_name", last_name.value)
    data.append("form-profile", true)
    data.append("csrfmiddlewaretoken", csrf)

    axios.request({
        method: "POST",
        url: url_request,
        data: data,
        onUploadProgress: () => {
            showLoading(true)
            btn_submit.value = "Carregando..."
        }
    })
    .then(response => {
        showLoading(false)
        btn_submit.value = btn_submit_old_value
        serverResponseUpdateProfile(response.data)
    })
}


//FAZENDO O POST DAS CONFIGURAÇÕES DE SEGURANÇA
function updateSafety(){
    let csrf = document.querySelector("#form-safety input[name='csrfmiddlewaretoken']").value
    let btn_submit = document.querySelector("#form-safety input[type=submit]")
    let btn_submit_old_value = btn_submit.value

    let data = new FormData()

    data.append("current-password", current_password.value)
    data.append("password1", password1.value)
    data.append("password2", password2.value)
    data.append("form-safety", true)
    data.append("csrfmiddlewaretoken", csrf)

    axios.request({
        method: "POST",
        url: url_request,
        data: data,
        onUploadProgress: () => {
            showLoading(true)
            btn_submit.value = "Carregando..."
        }
    })
    .then(response => {
        showLoading(false)
        btn_submit.value = btn_submit_old_value
        serverResponseUpdateSafety(response.data)
    })
}


//FAZENDO O POST DAS CONFIGURAÇÕES DE SEGURANÇA
function updatePaymentMethod(){
    let csrf = document.querySelector("#form-payment-method input[name='csrfmiddlewaretoken']").value
    let btn_submit = document.querySelector("#form-payment-method input[type=submit]")
    let btn_submit_old_value = btn_submit.value

    let data = new FormData()

    data.append("pay-method", pay_method.value)
    data.append("payment-data", payment_data.value)
    data.append("form-payment-method", true)
    data.append("csrfmiddlewaretoken", csrf)

    axios.request({
        method: "POST",
        url: url_request,
        data: data,
        onUploadProgress: () => {
            btn_submit.value = "Carregando..."
            showLoading(true)
        }
    })
    .then(response => {
        btn_submit.value = btn_submit_old_value
        showLoading(false)
        serverResponseUpdatePaymentMethod(response.data)
    })
}


//FORMULÁRIO DAS CONFIGURAÇÕES DO PERFIL
function formProfile(event){
    event.preventDefault()
    ValidateInputFirstName()
    ValidateInputLastName()
    if(ValidadeFormProfile()){
        updateProfile()
    }else{
        first_name.classList.add('input-incorrect')
        input_first_name_status = false
        last_name.classList.add('input-incorrect')
        input_last_name_status = false
    }
}


//FORMULÁRIO DAS CONFIGURAÇÕES DE SEGURANÇA
function formSafety(event){
    event.preventDefault()
    ValidateInputCurrentPassword()
    ValidateInputPassword1()
    ValidateInputPassword2()
    if(ValidateFormSafety()){
        updateSafety()
    }else{
        current_password.classList.add('input-incorrect')
        input_current_password_status = false
        password1.classList.add('input-incorrect')
        input_password1_status = false
        password2.classList.add('input-incorrect')
        input_password2_status = false
    }
    
}


//FORMULÁRIO DAS CONFIGURAÇÕES DE PAGAMENTO
function formPaymentMethod(event){
    event.preventDefault()
    ValidateSelect("validate")
    if(ValidateFormPaymentMethod()){
        updatePaymentMethod()
    }else{
        input_payment_data_status = false
        payment_data.classList.add('input-incorrect')
    }
}


//LISTENERS
first_name.addEventListener("keyup", () => {ValidateInputFirstName()})
last_name.addEventListener("keyup", () => {ValidateInputLastName()})
form_profile.addEventListener("submit", (event) => {formProfile(event)})


current_password.addEventListener("keyup", () => {ValidateInputCurrentPassword()})
password1.addEventListener("keyup", () => {ValidateInputPassword1()})
password2.addEventListener("keyup", () => {ValidateInputPassword2()})
form_safety.addEventListener("submit", (event) => {formSafety(event)})

pay_method.addEventListener("change", () => {ValidateSelect("validate")})
payment_data.addEventListener("keyup", () => {ValidateInputPaymentData()})
form_payment_method.addEventListener("submit", (event) => {formPaymentMethod(event)})

window.onload = () => {
    ValidateSelect("setplaceholder")
}