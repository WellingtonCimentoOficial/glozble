const form = document.querySelector("form")
const inputName = document.getElementById("name")
const inputEmail = document.getElementById("email")
const inputMessage = document.getElementById("message")
const csrf_token = document.querySelector("form input[name='csrfmiddlewaretoken']").value
const btn_submit = document.querySelector("input[type=submit]")

var input_name_status = false
var input_email_status = false
var input_message_status = false


const inputNameValidation = () => {
    if(inputName.value.length > 0 && inputName.value.length < 50){
        inputName.style.borderColor = "var(--input-border)"
        if(/\d/.test(inputName.value) === false && /['"!@#$%¨&*()\-_+=£¢¬§´`{}[\]ªº|\\,.:;?/°]/.test(inputName.value) === false){
            inputName.style.borderColor = "var(--input-border)"
            input_name_status = true
        }else{
            input_name_status = false
            inputName.style.borderColor = "red"
        }
    }else{
        input_inputName_status = false
        inputName.style.borderColor = "red"
    }
}

const inputEmailValidation = () => {
    if(inputEmail.value.length > 0 && inputEmail.value.length < 50){
        inputEmail.style.borderColor = "var(--input-border)"
        if(/\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/.test(inputEmail.value)){
            inputEmail.style.borderColor = "var(--input-border)"
            input_email_status = true
        }else{
            input_email_status = false
            inputEmail.style.borderColor = "red"
        }
    }else{
        input_email_status = false
        inputEmail.style.borderColor = "red"
    }
}

const inputMessageValidation = () => {
    if(inputMessage.value.length > 0 && inputMessage.value.length < 1686){
        inputMessage.classList.remove("input-incorrect")
        input_message_status = true
    }else{
        input_message_status = false
        inputMessage.classList.add("input-incorrect")
    }
}

const showResponse = (data) => {
    if(data["success"]){
        document.querySelectorAll("#section-2 div.container div.flex-item-container div.flex-item").forEach(flex_item => {
            flex_item.remove()
        })
        document.querySelector("#section-2 div.container div.flex-item-container").innerHTML = `
            <div class="flex-message">
                <h2>Mensagem enviada!</h2>
                <p>Sua mensagem foi enviada e terá um prazo de até 7 dias uteis para ser respondida.</p>
                <i class="fa-solid fa-check"></i>
            </div>
        `
    }else{
        if(data["status"] == 1){
            // Erro ao enviar o email
            document.querySelectorAll("#section-2 div.container div.flex-item-container div.flex-item").forEach(flex_item => {
                flex_item.remove()
            })
            document.querySelector("#section-2 div.container div.flex-item-container").innerHTML = `
                <div class="flex-message">
                    <h2>Mensagem cancelada!</h2>
                    <p>Sua mensagem foi cancelada, pois houve um erro ao tentar enviá-la ao destinatário.</p>
                    <i class="fa-solid fa-xmark"></i>
                </div>
            `
        }else if(data["status"] == 2){
            // Mensagem fora dos padrões
            inputMessage.style.borderColor = "red"
        }else if(data["status"] == 3){
            // Assunto fora dos padrões
            inputName.style.borderColor = "red"
        }else if(data["status"] == 4){
            // E-mail fora dos padrões
            inputEmail.style.borderColor = "red"
        }else{
            // recaptcha inválido
            document.querySelectorAll("#section-2 div.container div.flex-item-container div.flex-item").forEach(flex_item => {
                flex_item.remove()
            })
            document.querySelector("#section-2 div.container div.flex-item-container").innerHTML = `
                <div class="flex-message">
                    <h2>Mensagem cancelada!</h2>
                    <p>Sua mensagem foi cancelada, pois houve o recaptcha enviado é inválido.</p>
                    <i class="fa-solid fa-xmark"></i>
                </div>
            `
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

function sendEmail(token){
    let url = window.location.href
    let data = new FormData()
    let btn_submit_old_value = btn_submit.value

    data.append("name", inputName.value)
    data.append("email", inputEmail.value)
    data.append("message", inputMessage.value)
    data.append("csrfmiddlewaretoken", csrf_token)
    data.append("g-recaptcha-response", token)

    axios.request({
        method: "POST",
        url: url,
        data: data,
        onUploadProgress: () => {
            btn_submit.value = "Enviando..."
            showLoading(true)
        }
    })
    .then(response => {
        showResponse(response.data, btn_submit_old_value)
        showLoading(false)
    })
}

const formValidation = (e) => {
    e.preventDefault()
    if(input_name_status && input_email_status && input_message_status){
        grecaptcha.execute()
    }else{
        grecaptcha.reset()
        inputNameValidation()
        inputEmailValidation()
        inputMessageValidation()
    }
}


inputName.addEventListener("keyup", inputNameValidation)
inputEmail.addEventListener("keyup", inputEmailValidation)
inputMessage.addEventListener("keyup", inputMessageValidation)
form.addEventListener("submit", (event) => {formValidation(event)})
