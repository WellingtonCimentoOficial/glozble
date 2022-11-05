const btn_recive = document.getElementById("btn-recive")
const message = document.querySelector("#message span")
const btn_recive_old = btn_recive.value
const url_ad = window.location.href
var recaptcha
var has_viewed = false
timer_seconds = 10


const recaptchaRender = function() {
    recaptcha = grecaptcha.render('btn-recive', {
        'sitekey' : '6LdKdjshAAAAAJzYPaHF6SvVhj2BjJsdEtL_CyQ-',
        'hl': 'pt-BR',
        'callback': sendRequestAds
    })
}

function showResponse(data){
    let cont = 5
    let cont_regre = () => {
        if(cont == -1){
            window.location.reload()
        }else{
            message.textContent = "Próximo anúncio em " + cont
            cont--
            setTimeout(cont_regre, 1000)
        }
    }
    let defineBtnConfig = () => {
        btn_recive.style.display = "none"
        btn_recive.disabled = true
    }
    if(data["success"] && data["status"] == 0){
        //Anuncio assistido e clicado
        message.textContent = "Recompensa coletada com sucesso!"
        setTimeout(cont_regre, 5000)
        defineBtnConfig()        
    }else if(data["success"] && data["status"] == 2){
        //anuncio apenas assistido
        //searchAdsLink()
        setAffiliateLink(data["link"])
        btn_recive.value = "R$ " + btn_recive_old
        message.textContent = ""
        btn_recive.style.display = "block"
        btn_recive.style.pointerEvents = "auto"
        btn_recive.disabled = false
        btn_recive.classList.toggle("btn-disabled")
        btn_recive.classList.toggle("btn-enabled")
    }else if(data["success"] == false && data["status"] == 1){
        //erro ao salvar os dados
        message.textContent = "Ocorreu um erro, atualize a página e tente novamente"
        setTimeout(cont_regre, 5000)
        defineBtnConfig()
    }else if(data["success"] == false && data["status"] == 3){
        //verificando se o anuncio não foi assistido nem visualizado ou se as informações enviadas são invalidas
        message.textContent = "Dados inválidos!"
        setTimeout(cont_regre, 5000)
        defineBtnConfig()
    }else if(data["success"] == false && data["status"] == 4){
        //limite de cliques diário atingido
        message.textContent = "Limite que cliques diário atingido!"
        setTimeout(cont_regre, 5000)
        defineBtnConfig()
    }else if(data["success"] == false && data["status"] == 5){
        //captcha inválido
        message.textContent = "Captcha inválido!"
        setTimeout(cont_regre, 5000)
        defineBtnConfig()
    }else if(data["success"] == false && data["status"] == 6){
        //requisição fora dos padrões de tempo
        message.textContent = "Tempo de clique expirado!"
        setTimeout(cont_regre, 5000)
        defineBtnConfig()
    }else if(data["success"] == false && data["status"] == 7){
        //usuário atual não é o mesmo do anuncio do token
        message.textContent = "Usuário não corresponde com o anúncio solicitado. Recompensa recusada!"
        setTimeout(cont_regre, 5000)
        defineBtnConfig()
    }else if(data["success"] == false && data["status"] == 8){
        //anuncio com o token enviado não existe
        message.textContent = "Anúncio solicitado não existe. Recompensa recusada!"
        setTimeout(cont_regre, 5000)
        defineBtnConfig()
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

function setAds(viewed, clicked){
    let csrf = document.getElementsByName("csrfmiddlewaretoken")[0].value
    let ads_token = document.getElementsByName("adstoken")[0].value
    recaptcha_response = grecaptcha.getResponse(recaptcha)

    let data = new FormData()

    data.append("csrfmiddlewaretoken", csrf)
    data.append("g-recaptcha-response", recaptcha_response)
    data.append("adstoken", ads_token)
    data.append("viewed", viewed)
    data.append("clicked", clicked)

    axios.request({
        method: "POST",
        url: url_ad,
        data: data,
        onUploadProgress: () => {
            showLoading(true)
            buttonSetLoadingStyle()
        }
    })
    .then(response => {
        showLoading(false)
        showResponse(response.data)
    })

}


function setTimer(){
    message.textContent = "Aguarde...."
    let timer_number = document.getElementById("timer-number")
    let span_title = document.querySelector("#section-2 div.container div.flex-item-container div.flex-items div.timer-ads-info span")
    if(timer_seconds == -1){
        span_title.textContent = "Recompensa Liberada!"
        //RECEBER A QUANTIA
        grecaptcha.execute(recaptcha)
    }else{
        timer_number.textContent = timer_seconds
        timer_seconds--
        setTimeout(setTimer, 1000)
    }
}

const sendRequestAds = (token) => {
    if(has_viewed){
        setAds(true, true)
    }else{
        setAds(true, false)
        has_viewed = true
    }
}

function buttonSetLoadingStyle(){
    btn_recive.disabled = true
    btn_recive.style.pointerEvents = "none"
    btn_recive.style.display = "none"

    //btn_recive.value = "Carregando..."
    message.textContent = "Carregando..."
}

function collectReward(event){
    event.preventDefault()
    buttonSetLoadingStyle()
    grecaptcha.reset(recaptcha)
    grecaptcha.execute(recaptcha)
}

const setAffiliateLink = (link) => {
    let elementtt = `<a id="affiliate-link" href="${link}"></a>`
    document.querySelector("body").insertAdjacentHTML('afterbegin', elementtt)

    let item = document.getElementById('affiliate-link')
    item.style.position = "Absolute"
    item.style.zIndex = "9999999999"
    item.style.top = "0"
    item.style.left = "0"
    item.style.width = "100vw"
    item.style.height = "100vh"
    item.addEventListener("click", (e) => {
        e.preventDefault()
        window.open(link, '_blank').focus()
        item.style.display = "none"
    })
}

/*
const searchAdsLink = () => {
    let list_links = []
    document.querySelectorAll("a").forEach(item => {
        if(item.href.includes("client=ca-pub") && list_links.includes(item.href) == false){
            item.style.position = "Absolute"
            item.style.zIndex = "9999999999"
            item.style.top = "0"
            item.style.left = "0"
            item.style.width = "100vw"
            item.style.height = "100vh"
            item.addEventListener("click", (e) => {
                e.preventDefault()
                window.open(item.href, '_blank').focus()
                item.style.display = "none"
            })
            list_links.push(item.href)
        }
    })
}
*/

const hideAds = () => {
    let ins = document.querySelectorAll("ins.adsbygoogle")
    let timer_div = document.querySelector("#section-2 div.container div.flex-item-container div.flex-items")
    ins.forEach(n => {
        if(n.classList.length == 1){
            /*
            n.style.transform = "scale(0.0)"
            n.style.transformOrigin = "0 0"*/
            n.style.display = "none"
            timer_div.style.position = "relative"
            timer_div.style.height = "calc(100vh - 113px - 80px)"
        }
    })
}

//LISTENERS
btn_recive.addEventListener("click", (event) => {collectReward(event)})


window.onload = () => {
    setTimer()
    recaptchaRender()
    hideAds()
}