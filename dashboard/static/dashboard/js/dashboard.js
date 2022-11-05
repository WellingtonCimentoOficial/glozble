const value_container_cards = document.querySelectorAll("#section-2 div.container-geral div.container a.flex-item")[0].offsetWidth + 20
var cont = 0

function changeElementScroll(){
    const container_cards = document.querySelector("#section-2 div.container-geral div.container")
    const tables = document.querySelectorAll('.table')
    if(window.screen.width <= 700){
        if(cont == 0) {
            container_cards.scrollLeft = value_container_cards //MEIO
            tables[0].scrollLeft = 1000 //FINAL
            tables[1].scrollLeft = 0 //COMEÇO
            cont ++
        }else if(cont == 1) {
            container_cards.scrollLeft = 0 //COMEÇO
            tables[0].scrollLeft = tables[0].scrollLeft / 2 //MEIO
            tables[1].scrollLeft = 1000 // FINAL
            cont ++
        }else{
            container_cards.scrollLeft = value_container_cards * 2 //FINAL
            tables[0].scrollLeft = 0 //COMEÇO
            tables[1].scrollLeft = tables[1].scrollLeft / 2 //MEIO
            cont = 0
        }
    }
}


function main() {
    setTimeout(changeElementScroll, 1000)
    setInterval(changeElementScroll, 15000)
}

window.onload = main()