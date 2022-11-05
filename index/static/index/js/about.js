function moveImg() {
    const elemento = document.querySelector("#section-1 div.container")
    const url_img = elemento.children[1].children[0].src
    if(window.screen.width <= 1315 && elemento.children[1].classList.contains("img")){
        elemento.children[1].remove()
        elemento.insertAdjacentHTML('afterbegin', `
            <div class="flex-item img">
                <img src="${url_img}" alt="">
            </div>
        `)
    }
}

window.onload = moveImg()