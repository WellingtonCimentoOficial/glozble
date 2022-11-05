// VARIÁVEIS DO FORMULARIO DE REGISTRO
const make_account = document.getElementById("make-account")
const form_register = document.getElementById("form-register")
const username_register = document.getElementById("username_register")
const email_register = document.getElementById("email_register")
const register_password1 = document.getElementById("password1_register")
const register_password2 = document.getElementById("password2_register")
const terms_register = document.getElementById("terms_register")
const flex_terms = document.querySelector("#section-1 div.container div.flex-item-container form div.flex-terms")

const username_register_message = document.getElementById('username-register-message')
const email_register_message = document.getElementById('email-register-message')
const register_password1_message = document.getElementById('password1-register-message')
const register_password2_message = document.getElementById('password2-register-message')
const captcha_register_div = document.getElementById("captcha-register")

const username_login_message = document.getElementById('username-login-message')
const password_login_message = document.getElementById('password-login-message')


var input_username_status_register = false
var input_email_status_register = false
var input_password1_status_register = false
var input_password2_status_register = false
var terms_status_register = false

var captcha_register

// VARIÁVEIS DO FORMULARIO DE LOGIN
const form_login = document.getElementById("form-login")
const username_login = document.getElementById("username_login")
const password_login = document.getElementById("password_login")
const captcha_login_div = document.getElementById("captcha-login")
var login_attempts = 0

var input_username_status_login = false
var input_password_status_login = false

var captcha_login

//MESSAGES
const msg_username_invalid = "O usuário deve conter entre 5 a 20 caracteres, não podendo conter letras maiúsculas e nem caracteres especiais."
const msg_email_invalid = "O e-mail é inválido."
const msg_password1_invalid = "A senha deve ter de 8 a 64 caracteres, contendo letra maiúscula, letra minúscula, número e caractere especial."
const msg_password2_invalid = "As senhas não correspondem."


//CAPTCHA CONFIG
var createCaptcha = function() {
    captcha_login = grecaptcha.render('captcha-login', {
      'sitekey' : 'YOURKEY',
      'hl': 'pt-BR'
    })
    captcha_register = grecaptcha.render('captcha-register', {
      'sitekey' : 'YOURKEY',
      'hl': 'pt-BR'
    })
}

//CONFIGURAÇÕES DA PÁGINA
function mobileConfig() {
    if(window.screen.width <= 1500) {
        document.querySelectorAll("#section-1 div.container div.flex-item-container")[0].style.display = "none"
    }
}


//REMOVENDO O FORMULÁRIO DE LOGIN E ADICIONANDO O DE REGISTRAR
make_account.addEventListener("click", (event) => {
    event.preventDefault()
    let forms = document.querySelectorAll("#section-1 div.container div.flex-item-container")

    forms[0].style.display = "flex"
    forms[1].style.display = "none"
    document.getElementById('section-1').style.height = "auto"
})


//VALIDANDO INPUT USERNAME(FORMULÁRIO DE REGISTRO)
function ValidateInputUsernameRegister(){
    username_register.value = username_register.value.toLowerCase()
    if(username_register.value.length >= 5 && username_register.value.length <= 20 && /\W/.test(username_register.value) == false && /[A-Z]/.test(username_register.value) == false){
        input_username_status_register = true
        username_register.style.borderColor = "var(--input-border)"
        username_register_message.textContent = ""
    }else{
        input_username_status_register = false
        username_register.style.borderColor = "red"
        username_register_message.textContent = msg_username_invalid
    }
}


//VALIDANDO INPUT EMAIL(FORMULÁRIO DE REGISTRO)
function ValidateInputEmailRegister(){
    email_register.value = email_register.value.toLowerCase()
    if(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email_register.value)){
        input_email_status_register = true
        email_register.style.borderColor = "var(--input-border)"
        email_register_message.textContent = ""
    }else{
        input_email_status_register = false
        email_register.style.borderColor = "red"
        email_register_message.textContent = msg_email_invalid
    }
}

//VALIDANDO INPUT SENHA(FORMULÁRIO DE REGISTRO)
function ValidateInputPassword1Register(){
    if(register_password1.value.length >= 8 && register_password1.value.length <= 64){
        if(/[a-z]/.test(register_password1.value) && /[A-Z]/.test(register_password1.value) && /\W/.test(register_password1.value) && /\d/.test(register_password1.value)){
            register_password1.style.borderColor = "var(--input-border)"
            input_password1_status_register = true
            register_password1_message.textContent = ""
        }else{
            register_password1.style.borderColor = "red"
            input_password1_status_register = false
            register_password1_message.textContent = msg_password1_invalid
        }
    }else{
        register_password1.style.borderColor = "red"
        input_password1_status_register = false
        register_password1_message.textContent = msg_password1_invalid
    }
}

//VALIDANDO INPUT CONFIRMAR SENHA(FORMULÁRIO DE REGISTRO)
function ValidateInputPassword2Register(){
    if(register_password2.value === register_password1.value) {
        register_password2.style.borderColor = "var(--input-border)"
        input_password2_status_register = true
        register_password2_message.textContent = ""
    }else{
        input_password2_status_register = false
        register_password2.style.borderColor = "red"
        register_password2_message.textContent = msg_password2_invalid
    }
}


//VALIDANDO OS TERMOS DE CADASTRO(FORMULÁRIO DE REGISTRO)
function ValidateTerms(){
    if(terms_register.checked){
        flex_terms.style.borderColor = "transparent"
        terms_status_register = true
    }else{
        flex_terms.style.borderColor = "red"
        terms_status_register = false
    }
}


//MOSTRANDO ERROS PARA O USUÁRIO(FORMULÁRIO DE REGISTRO)
function serverResponseRegister(data, btn_submit){
    if(data["success"] == true){
        // Usuário criado com sucesso
        btn_submit.value = "Redirecionando..."
        window.location.href = window.location.href.replace('?msg=success', '').replace('?msg=error', '').replace(window.location.href.toString().split("?")[1], '').replace("?", '') + "?msg=success"
    }else{
        if(data["status"] == 1){
            //Erro ao salvar no banco de dados
            window.location.href = window.location.href.replace('?msg=success', '').replace('?msg=error', '').replace(window.location.href.toString().split("?")[1], '').replace("?", '') + "?msg=error"
        }else if(data["status"] == 2){
            //Usuário fora dos padrões
            input_username_status_register = false
            username_register.style.borderColor = "red"
            username_register_message.textContent = msg_username_invalid
            grecaptcha.reset(captcha_register)
        }else if(data["status"] == 3){
            //E-mail fora dos padrões
            input_email_status_register = false
            email_register.style.borderColor = "red"
            email_register_message.textContent = msg_email_invalid
            grecaptcha.reset(captcha_register)
        }else if(data["status"] == 4){
            //Senhas não correspondem
            input_password1_status_register = false
            input_password2_status_register = false
            register_password1.style.borderColor = "red"
            register_password2.style.borderColor = "red"
            register_password1_message.textContent = msg_password2_invalid
            register_password2_message.textContent = msg_password2_invalid
            grecaptcha.reset(captcha_register)
        }else if(data["status"] == 5){
            //Senha fora dos padrões
            input_password1_status_register = false
            input_password2_status_register = false
            register_password1.style.borderColor = "red"
            register_password2.style.borderColor = "red"
            register_password1_message.textContent = msg_password1_invalid
            grecaptcha.reset(captcha_register)
        }else if(data["status"] == 6){
            //Termos de registro não marcado
            flex_terms.style.borderColor = "red"
            grecaptcha.reset(captcha_register)
            terms_register.checked = false
        }else if(data["status"] == 7){
            //captcha não é valido
            captcha_register_div.style.borderColor = "red"
            grecaptcha.reset(captcha_register)
        }else if(data["status"] == 8){
            //Usuário ja existe
            input_username_status_register = false
            username_register.style.borderColor = "red"
            username_register_message.textContent = "O usuário ja existe"
            grecaptcha.reset(captcha_register)
        }else if(data["status"] == 9){
            //E-mail já existe
            input_email_status_register = false
            email_register.style.borderColor = "red"
            email_register_message.textContent = "O e-mail ja existe"
            grecaptcha.reset(captcha_register)
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


//CRIANDO CONTA(FORMULÁRIO DE REGISTRO)
function register(){
    let url = "/accounts/register/"
    let csrf = document.querySelector("#form-register input[name='csrfmiddlewaretoken']").value

    let username_register = document.getElementById("username_register").value
    let email_register = document.getElementById("email_register").value
    let password1_register = document.getElementById("password1_register").value
    let password2_register = document.getElementById("password2_register").value
    let terms_register_value = terms_register.checked
    let captcha_response = grecaptcha.getResponse(captcha_register)
    let btn_submit = document.querySelector("#form-register input[type=submit]")
    let old_value = btn_submit.value

    let data = new FormData()

    data.append("username_register", username_register)
    data.append("email_register", email_register)
    data.append("password1_register", password1_register)
    data.append("password2_register", password2_register)
    data.append("g-recaptcha-response", captcha_response)
    data.append("terms_register", terms_register_value)
    data.append("csrfmiddlewaretoken", csrf)

    axios.request({
        method: "POST",
        url: url,
        data: data,
        onUploadProgress: () => {
            btn_submit.value = "Carregando..."
            showLoading(true)
        }
    })
    .then((response) => {
        btn_submit.value = old_value
        showLoading(false)
        serverResponseRegister(response.data, btn_submit)
    })
    
}

//VALIDANDO O FORMULARIO DE REGISTRO(FORMULÁRIO DE REGISTRO)
function formRegister(event){
    event.preventDefault()
    if(input_username_status_register){
        username_register.style.borderColor = "var(--input-border)"
        if(input_email_status_register){
            email_register.style.borderColor = "var(--input-border)"
            if(input_password1_status_register){
                register_password1.style.borderColor = "var(--input-border)"
                if(input_password2_status_register){
                    register_password2.style.borderColor = "var(--input-border)"
                    if(register_password1.value === register_password2.value){
                        if(terms_status_register){
                            flex_terms.style.borderColor = "transparent"
                            terms_status_register = true
                            if(grecaptcha.getResponse(captcha_register) != ""){
                                captcha_register_div.style.borderColor = "transparent"
                                register()
                            }else{
                                captcha_register_div.style.borderColor = "red"
                            }
                        }else{
                            flex_terms.style.borderColor = "red"
                            terms_status_register = false
                            grecaptcha.reset(captcha_register)
                        }
                    }else{
                        input_password1_status_register = false
                        register_password1.style.borderColor = "red"
                        grecaptcha.reset(captcha_register)
                    }
                }else{
                    input_password2_status_register = false
                    register_password2.style.borderColor = "red"
                    grecaptcha.reset(captcha_register)
                }
            }else{
                input_password1_status_register = false
                register_password1.style.borderColor = "red"
                grecaptcha.reset(captcha_register)
            }
        }else{
            input_email_status_register = false
            email_register.style.borderColor = "red"
            grecaptcha.reset(captcha_register)
        }
    }else{
        input_username_status_register = false
        username_register.style.borderColor = "red"
        grecaptcha.reset(captcha_register)
    }
}

//VALIDANDO INPUT USERNAME(FORMULÁRIO DE LOGIN)
function ValidateInputUsernameLogin(){
    username_login.value = username_login.value.toLowerCase()
    username_login.style.borderColor = "var(--input-border)"
    username_login_message.textContent = ""
    input_username_status_login = true
    /*
    if(username_login.value.length >= 5 && username_login.value.length <= 20 && /\W/.test(username_login.value) == false && /[A-Z]/.test(username_login.value) == false){
        input_username_status_login = true
        username_login.style.borderColor = "var(--input-border)"
    }else{
        input_username_status_login = false
        username_login.style.borderColor = "red"
        username_login_message.textContent = "Usuário ou"
    }
    */
}


//VALIDANDO INPUT SENHA(FORMULÁRIO DE LOGIN)
function ValidateInputPasswordLogin(){
    password_login.style.borderColor = "var(--input-border)"
    password_login_message.textContent = ""
    input_password_status_login = true
    /*
    if(password_login.value.length >= 8 && password_login.value.length <= 64){
        if(/[a-z]/.test(password_login.value) && /[A-Z]/.test(password_login.value) && /\W/.test(password_login.value) && /\d/.test(password_login.value)){
            password_login.style.borderColor = "var(--input-border)"
            input_password_status_login = true
        }else{
            password_login.style.borderColor = "red"
            input_password_status_login = false
        }
    }else{
        password_login.style.borderColor = "red"
        input_password_status_login = false
    }
    */
}

//MOSTRANDO ERROS PARA O USUÁRIO(FORMULÁRIO DE LOGIN)
function serverResponseLogin(data, btn_submit, old_value){
    if(data["success"] == true){
        // Usuário logado com sucesso
        let urlParams = new URLSearchParams(window.location.search)
        let next = urlParams.get('next')
        if(next){
            window.location.href = next
        }else{
            window.location.href = "/accounts/dashboard/"
        }
        btn_submit.value = "Redirecionando..."
    }else{
        // Usuário ou senha incorreto
        btn_submit.value = old_value
        username_login.style.borderColor = "red"
        password_login.style.borderColor = "red"
        username_login_message.textContent = "Usuário ou senha incorretos"
        password_login_message.textContent = "Usuário ou senha incorretos"
        grecaptcha.reset(captcha_login)
        login_attempts += 1
        if(login_attempts >= 3)
            window.location.href = "/accounts/login/reset/"
    }
}

//FAZENDO LOGIN
function login(){
    let url = "/accounts/login/"
    let csrf = document.querySelector("#form-login input[name='csrfmiddlewaretoken']").value
    let captcha_response = grecaptcha.getResponse(captcha_login)
    let btn_submit = document.querySelector("#form-login input[type=submit]")
    let old_value = btn_submit.value

    data = new FormData()

    data.append('username_login', username_login.value)
    data.append('password_login', password_login.value)
    data.append('g-recaptcha-response', captcha_response)
    data.append('csrfmiddlewaretoken', csrf)

    axios.request({
        method: "POST",
        url: url,
        data: data,
        onUploadProgress: () => {
            btn_submit.value = "Carregando..."
            showLoading(true)
        }
    })
    .then((response) => {
        btn_submit.value = old_value
        showLoading(false)
        serverResponseLogin(response.data, btn_submit, old_value)
    })
}

//VALIDANDO O FORMULARIO DE LOGIN
function formLogin(event){
    event.preventDefault()
    if(input_username_status_login){
        username_login.style.borderColor = "var(--input-border)"
        if(input_password_status_login){
            password_login.style.borderColor = "var(--input-border)"
            if(grecaptcha.getResponse(captcha_login) != ""){
                captcha_login_div.style.borderColor = "transparent"
                login()
            }else{
                captcha_login_div.style.borderColor = "red"
            }
        }else{
            input_password_status_login = false
            password_login.style.borderColor = "red"
            grecaptcha.reset(captcha_login)
        }
    }else{
        input_username_status_login = false
        username_login.style.borderColor = "red"
        grecaptcha.reset(captcha_login)
    }
}


//LISTENERS
username_register.addEventListener("keyup", () => {ValidateInputUsernameRegister()})
email_register.addEventListener("keyup", () => {ValidateInputEmailRegister()})
register_password1.addEventListener("keyup", () => {ValidateInputPassword1Register()})
register_password2.addEventListener("keyup", () => {ValidateInputPassword2Register()})
terms_register.addEventListener("click", () => {ValidateTerms()})
form_register.addEventListener("submit", (event) => {formRegister(event)})

username_login.addEventListener("keyup", () => {ValidateInputUsernameLogin()})
password_login.addEventListener("keyup", () => {ValidateInputPasswordLogin()})
form_login.addEventListener("submit", (event) => {formLogin(event)})


mobileConfig()