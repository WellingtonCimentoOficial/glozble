const year = new Date().getFullYear()
const footer = document.getElementById('footer-text')
const project_name = "EDITAR"

footer.innerHTML = "Copyright © " + year + ` ${project_name.charAt(0).toUpperCase() + project_name.slice(1)}.com Todos os direitos reservados.`