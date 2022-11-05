const title = document.querySelector("#section-4 div.container div.flex-item h3")
const _yyear = new Date().getFullYear()
const url_graphic = "/accounts/dashboard/graphic/"

var returnGraphicData = (response) => {
    
    title.textContent = "GRÁFICO DE GANHOS MENSAIS DE " + _yyear

    const labels = [
        'JAN',
        'FEV',
        'MAR',
        'ABR',
        'MAI',
        'JUN',
        'JUL',
        'AGO',
        'SET',
        'OUT',
        'NOV',
        'DEZ',
    ]

    const datajson = [
        response["jan"],
        response["fev"],
        response["mar"],
        response["abr"],
        response["mai"],
        response["jun"],
        response["jul"],
        response["ago"],
        response["set"],
        response["out"],
        response["nov"],
        response["dez"],
    ]

    const data = {
        labels: labels,
        datasets: [{
            label: 'Receita',
            backgroundColor: 'rgb(132, 0, 255)',
            borderColor: 'rgb(132, 0, 255)',
            data: datajson,
        }]
    }
    
    const config = {
        type: 'line',
        data: data,
        options: {}
    }
    
    const myChart = new Chart(
        document.getElementById('myChart'),
        config
    )
}

var getGraphicData = () => {
    axios.request({
        method: "GET",
        url: url_graphic,
    })
    .then(response => {returnGraphicData(response.data)})
}

getGraphicData()