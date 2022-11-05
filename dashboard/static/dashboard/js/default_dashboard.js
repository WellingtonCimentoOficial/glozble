const menus = document.querySelectorAll("#section-1 div.container ul.flex-item-container li")
const button_menu = document.querySelector("div.flex-menu")
const profile_menu = document.getElementById("flex-logout")
const menu_options = document.querySelector("section#flex-logout div.flex-item div.logout-opcoes")
const default_dashboard_section_2 = document.getElementById("section-2")
const default_dashboard_sections = document.querySelectorAll('section')

var click = false

menus.forEach(menu => {
    menu.addEventListener('mouseover', () => {
        menu.children[0].style.color = "var(--roxo-principal)"
        menu.children[1].style.color = "var(--roxo-principal)"
    });
    menu.addEventListener('mouseout', () => {
        menu.children[0].style.color = "white"
        menu.children[1].style.color = "white"
    });
});

function btn_menu(){
    let section_1 = document.getElementById("section-1")
    let text_icons = document.querySelectorAll("#section-1 div.container ul.flex-item-container li a")
    let flex_menu_div = document.querySelector("div.flex-menu")
    let body = document.querySelector("body")
    let html = document.querySelector("html")
    
    let default_dashboard_sections_loop = 1
    accountMenu("mouseout")
    if(click == false){
        flex_menu_div.style.position = "fixed"
        section_1.style.display = "block"
        section_1.style.width = "80%"
        text_icons.forEach(text => {
            text.style.textIndent = "0%";
            text.style.whiteSpace = "normal"
            text.style.overflow = "visible"
        })
        button_menu.children[0].classList.toggle("fa-bars")
        button_menu.children[0].classList.toggle("fa-bars-staggered")
        button_menu.children[0].style.color = "white"
        body.classList.toggle("stop-scrolling")
        html.classList.toggle("stop-scrolling")
        click = true
        while(default_dashboard_sections_loop <= default_dashboard_sections.length){
            default_dashboard_sections[default_dashboard_sections_loop].classList.add("stop-interaction")
            default_dashboard_sections_loop++
        }
    }else{
        flex_menu_div.style.position = "absolute"
        section_1.style.display = "none"
        text_icons.forEach(text => {
            text.style.textIndent = "100%";
            text.style.whiteSpace = "nowrap"
            text.style.overflow = "hidden"
        })
        button_menu.children[0].classList.toggle("fa-bars-staggered")
        button_menu.children[0].classList.toggle("fa-bars")
        button_menu.children[0].style.color = "var(--roxo-principal)"
        body.classList.toggle("stop-scrolling")
        html.classList.toggle("stop-scrolling")
        click = false
        while(default_dashboard_sections_loop <= default_dashboard_sections.length){
            default_dashboard_sections[default_dashboard_sections_loop].classList.remove("stop-interaction")
            default_dashboard_sections_loop++
        }
    }
}

function accountMenu(event_string){
    if(event_string == "click" || event_string == "mouseover"){
        menu_options.style.display = "flex"
    }else{
        menu_options.style.display = "none"
    }
}

//LISTENERS
default_dashboard_sections.forEach(default_dashboard_section => {
    default_dashboard_section.addEventListener("click", () => {
        if(default_dashboard_section.id != "flex-logout"){
            accountMenu("mouseout")
        }
    })
})
document.querySelectorAll("#section-1 div.container ul li").forEach(li => {
    li.addEventListener("click", () => {
        li.childNodes.forEach(child => {
            if(child.href != undefined){
                window.location.href = child.href
            }
        })
    })
})
default_dashboard_section_2.addEventListener("click", () => {accountMenu("mouseout")})
button_menu.addEventListener("click", () => {btn_menu()})
profile_menu.addEventListener("mouseover", () => {accountMenu("mouseover")})
menu_options.addEventListener("mouseover", () => {accountMenu("mouseover")})
menu_options.addEventListener("mouseout", () => {accountMenu("mouseout")})