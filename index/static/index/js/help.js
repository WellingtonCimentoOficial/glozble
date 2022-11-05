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