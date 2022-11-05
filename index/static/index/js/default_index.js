const register_page_btn_menu = document.querySelector('div.flex-menu')
var register_page_btn_menu_click = false


//ESTILIZAÇÃO E FUNCIONALIDADES DO MENU
function menuFunctions(event){
    let html = document.querySelector('html')
    let body = document.querySelector('body')
    let menu_screen = document.querySelector("header div.container nav.flex-item ul")
    let sections = document.querySelectorAll("section")
    if(register_page_btn_menu_click == false){
        menu_screen.style.display = "flex"
        html.classList.toggle("stop-scrolling")
        body.classList.toggle("stop-scrolling")
        sections.forEach(section => {
            section.classList.toggle("stop-interaction")
        })
        event.target.classList.toggle("fa-bars")
        event.target.classList.toggle("fa-bars-staggered")
        register_page_btn_menu_click = true
    }else{
        menu_screen.style.display = "none"
        html.classList.toggle("stop-scrolling")
        body.classList.toggle("stop-scrolling")
        sections.forEach(section => {
            section.classList.toggle("stop-interaction")
        })
        event.target.classList.toggle("fa-bars-staggered")
        event.target.classList.toggle("fa-bars")
        register_page_btn_menu_click = false
    }
}

//LISTENERS
register_page_btn_menu.addEventListener("click", (event) => {menuFunctions(event)})