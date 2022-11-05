scrolled_1 = false
scrolled_2 = true
scrolled_3 = true

function animationOverflow() { //ANIMAÇÃO DAS SEÇÕES COM OVERFLOW SCROLL
    let section_2 = document.querySelector("#section-2 div.container div.flex-item-container")
    let section_5 = document.querySelector("#section-5 div.container div.flex-item-container")
    if (window.screen.width <= 700) {
        if(scrolled_1 == false) {
            section_2.scrollLeft = 1000 //FINAL
            section_5.scrollLeft = 0 //COMEÇO
            scrolled_1 = true
            scrolled_2 = false
        }else if(scrolled_2 == false) {
            section_2.scrollLeft = section_2.scrollLeft / 2 //MEIO
            section_5.scrollLeft = 1000 //FINAL
            scrolled_2 = true
            scrolled_3 = false
        }else if(scrolled_3 == false) {
            section_2.scrollLeft = 0 //COMEÇO
            section_5.scrollLeft = section_5.scrollLeft / 2 //MEIO
            scrolled_1 = false
        }
    }
}


//SEÇÃO DE PERGUNTAS FREQUENTES
let question_box_title = document.querySelectorAll("#section-common-questions div.container div.flex-item-container div.flex-item div.flex-title")

question_box_title.forEach(question => {
    question.addEventListener('click', () => {
        question_box_title.forEach(a => {
            a.parentElement.children[1].style.display = "none"
        })
        question.parentElement.children[1].style.display = "block"
    });
});


animationOverflow()
setInterval(animationOverflow, 10000)