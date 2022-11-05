const form = document.querySelector("form")
const email = document.getElementById("email")
const btn_submit = document.querySelector("input[type=submit]")
const captcha_reset_password_div = document.getElementById("captcha-reset-password")
const email_message = document.getElementById('email-message')

var captcha_reset_password
var input_email_status_register = false


//CAPTCHA CONFIG
var createCaptcha = function() {
    captcha_reset_password = grecaptcha.render('captcha-reset-password', {
      'sitekey' : '6LfWczshAAAAAMUTCpe2Vt-w0_tcjki67iM1z69H',
      'hl': 'pt-BR'
    })
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

const handleEmail = () => {
    email.value = email.value.toLowerCase()
    if(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(email.value)){
        input_email_status_register = true
        email.style.borderColor = "var(--input-border)"
        email_message.textContent = ""
    }else{
        input_email_status_register = false
        email.style.borderColor = "red"
        email_message.textContent = "E-mail inválido"
    }
}

const handleResponse = (response, json, old_value) => {
    btn_submit.value = old_value
    showLoading(false)
    btn_submit.disabled = false
    if(response.status === 200) {
        document.querySelectorAll("flex-item-container").forEach(item => {
            item.remove()
        })
        document.querySelector("#section-1 div.container").innerHTML = `
            <div class="flex-item-container">
                <div class="flex-message">
                    <h2>Esqueci a senha</h2>
                    <p>Você deverá receber em breve um e-mail permitindo a redefinição de sua senha. Por favor, certifique-se de verificar seus spams e lixo se você não encontrar o e-mail.</p>
                    <i class="fa-solid fa-check"></i>
                </div>
            </div>
        `
    }
}

const resetPassword = async () => {
    let old_value = btn_submit.value
    let url = window.location.href
    let csrf = document.querySelector("form input[name='csrfmiddlewaretoken']").value
    let captcha_response = grecaptcha.getResponse(captcha_reset_password)
    let data = new FormData()

    data.append("email", email.value)
    data.append("g-recaptcha-response", captcha_response)
    data.append("csrfmiddlewaretoken", csrf)

    let response = await axios.request({
        method: "POST",
        url: url,
        data: data,
        onUploadProgress: () => {
            btn_submit.value = "Carregando..."
            showLoading(true)
        }
    })
    handleResponse(response, old_value)
}


const handleSubmit = (e) => {
    e.preventDefault()
    if(input_email_status_register){
        if(grecaptcha.getResponse(captcha_reset_password) != ""){
            captcha_reset_password_div.style.borderColor = "transparent"
            btn_submit.disabled = true
            resetPassword()
        }else{
            captcha_reset_password_div.style.borderColor = "red"
        }
    }else{
        input_email_status_register = false
        handleEmail()
    }
}

form.addEventListener("submit", (e) => {handleSubmit(e)})
email.addEventListener("keyup", () => {handleEmail()})