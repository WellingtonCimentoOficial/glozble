const form = document.querySelector("form")
const password1 = document.getElementById("password1")
const password2 = document.getElementById("password2")
const btn_submit = document.querySelector("input[type=submit]")
const password1_message = document.getElementById("password1-message")
const password2_message = document.getElementById("password2-message")

var password1IsValid = false
var password2IsValid = false

//MESSAGES
const msg_password1_invalid = "A senha deve ter de 8 a 64 caracteres, contendo letra maiúscula, letra minúscula, número e caractere especial."
const msg_password2_invalid = "As senhas não correspondem."


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

const handlePassword1 = () => {
    if(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,64}$/.test(password1.value)){
        password1IsValid = true
        password1.style.borderColor = "var(--input-border)"
        password1_message.textContent = "" 
    }else{
        password1IsValid = false
        password1.style.borderColor = "red"
        password1_message.textContent = msg_password1_invalid
    }
}

const handlePassword2 = () => {
    if(password2.value === password1.value){
        password2IsValid = true
        password2.style.borderColor = "var(--input-border)"
        password2_message.textContent = ""
    }else{
        password2IsValid = false
        password2.style.borderColor = "red"
        password2_message.textContent = msg_password2_invalid
    }
}

const handleSubmit = (e) => {
    e.preventDefault()
    if(password1IsValid){
        if(password2IsValid && password1.value === password2.value){
            grecaptcha.execute()
        }else{
            handlePassword2()
            password2.style.borderColor = "red"
            password1.style.borderColor = "red"
        }
    }else{
        handlePassword1()
    }
}

const handleResponse = (response, old_value) => {
    showLoading(false)
    btn_submit.value = old_value
    let data = response.data
    if(data["success"]) {
        document.querySelectorAll("flex-item-container").forEach(item => {
            item.remove()
        })
        document.querySelector("#section-1 div.container").innerHTML = `
            <div class="flex-item-container">
                <div class="flex-message">
                    <h2>Senha alterada com sucesso!</h2>
                    <p>Sua senha foi alterada. Por favor, acesse a página de login clicando <a style="text-decoration:" href="/accounts/login/"><em>aqui</em></a> para entrar em sua conta.</p>
                    <i class="fa-solid fa-check"></i>
                </div>
            </div>
        `
    }else if(data["status"] === 1){
        alert('erro ao salvar no banco')
    }else if(data["status"] === 2){
        alert('informações enviadas invalidas')
    }
}

function resetPassword(token){
    let old_value = btn_submit.value
    let url = window.location.href
    let csrf = document.querySelector("form input[name='csrfmiddlewaretoken']").value

    let urlParams = new URLSearchParams(window.location.search)
    let email = urlParams.get('email')
    let code = urlParams.get('code')

    let data = new FormData()

    data.append("password1", password1.value)
    data.append("password2", password2.value)
    data.append("email", email)
    data.append("code", code)
    data.append("g-recaptcha-response", token)
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
    .then(response => {
        showLoading(false)
        handleResponse(response, old_value)
    })
}


//LISTENERS
password1.addEventListener("keyup", () => {handlePassword1()})
password2.addEventListener("keyup", () => {handlePassword2()})
form.addEventListener("submit", (e) => {handleSubmit(e)})