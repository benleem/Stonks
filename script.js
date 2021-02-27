const apiKey = "c0jn4vn48v6tjhjjqlkg";
var input = document.querySelector('.input_text');
const button= document.querySelector('.submit');

var ticker= document.querySelector('.ticker');
var historical_data= document.querySelector('.historical_data');
var news_container=document.querySelector('.news_container');

function financials(){
    fetch('https://finnhub.io/api/v1/stock/metric?symbol='+ input.value +'&metric=all&token='+ apiKey)
    .then(response => response.json())
    .then(data =>{
        ticker.innerHTML=data.symbol;
        historical_data.innerHTML='';
        
        var entries = Object.entries(data.metric);
        var key= Object.keys(data.metric);
        var value = Object.values(data.metric);
        
        for (var i = 0; i < entries.length; i++){
            historical_data.innerHTML += "<p>"+key[i]+": "+value[i]+"</p></br>";
        }
    })
    .catch(err => alert("Enter valid ticker..."));
}

function graph(){
    fetch('https://finnhub.io/api/v1/stock/candle?symbol='+input.value+'&resolution=D&from=1605543327&to=1630551661&token='+apiKey)
    .then(response => response.json())
    .then(info =>{
        var datetime= Object.values(info.t);
        var open=Object.values(info.o);
        
        const ctx = document.getElementById('graph').getContext('2d');
        xlabels=[];
        yvalues=[];
        if(window.chart != undefined){
            window.chart.destroy();
        }
        window.chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: xlabels,
                datasets: [{
                    label: 'Price per share',
                    data: yvalues,
                    backgroundColor: [
                        'rgba(12, 92, 196, 0.3)'
                    ],
                    borderColor: [
                        'rgba(12, 92, 196, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                tooltips:{
                    intersect:'true',
                    mode:'x'
                },
                responsive: true,
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: false
                        }
                    }]
                }
            }
        });
        
        for (var i = 0; i < datetime.length; i++){
            var time= datetime[i];
            time=converter(time);
            xlabels.push(time);
            
            yvalues.push(open[i]);
            chart.update();
        }
    })
}

function news(){
    fetch('https://finnhub.io/api/v1/company-news?symbol='+input.value+'&from=2021-01-01&to=2022-01-01&token='+ apiKey)
    .then(response => response.json())
    .then(data =>{
        var entries=Object.entries(data);
        var values=Object.values(data);
        news_container.innerHTML="";

        for (var i = 0; i < entries.length; i++){
            var headline=document.createElement('a');
            headline.innerHTML+=values[i].headline;
            headline.href+=values[i].url;
            news_container.appendChild(headline);

            var datetime=document.createElement('h3');
            var time = values[i].datetime;
            datetime.innerHTML+=converter(time);
            news_container.appendChild(datetime);

            var summary=document.createElement('p');
            summary.innerHTML+=values[i].summary;
            news_container.appendChild(summary);
        } 
    })
    .catch(err => alert("Enter valid ticker..."));
}

function converter(time){
    var unixtimestamp = time;
    var months_arr = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    var date = new Date(unixtimestamp*1000);
    var year = date.getFullYear();
    var month = months_arr[date.getMonth()];
    var day = date.getDate();
    var hours = date.getHours();
    var minutes = "0" + date.getMinutes();
    var seconds = "0" + date.getSeconds();

    var convdataTime = month+'-'+day+'-'+year+' '+hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
    return convdataTime;
}

button.addEventListener('click', function(){
    financials();
    news();
    graph();
})


// Reference deference:

// button.addEventListener('click', function(){
//     fetch('https://api.openweathermap.org/data/2.5/weather?q='+input.value+'&units=imperial&appid=44e2f0995fca4a8e5234feaa245cdd67')
//     .then(response => response.json())
//     .then(data => {
//         console.log(data);
        
//         image.src = `https://openweathermap.org/img/w/${data.weather[0].icon}.png`;
//         cityName.innerHTML = data.name + ", " + data.sys.country;
//         desc.innerHTML = data.weather[0].description;
//         temp.innerHTML = Math.round(data.main.temp) + "°F";
//     })
//     .catch(err => alert("Please enter valid city name or zip code"));
// })