var input = document.querySelector('.input_text');
const button= document.querySelector('.submit');
var ticker= document.querySelector('.ticker');
var historical_data= document.querySelector('.historical_data');
var apiKey = "c0jn4vn48v6tjhjjqlkg";


function newy(){
    fetch('https://finnhub.io/api/v1/search?q='+input.value+'&token='+ apiKey)
    .then(response => response.json())
    .then(data =>{
        console.log(data);
    })
}

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

button.addEventListener('click', function(){
    newy();
    financials();
})