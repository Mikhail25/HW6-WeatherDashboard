var searchText = document.querySelector('#search');
var searchButton = document.querySelector('#search-button');
var weatherResults = document.querySelector('#weather-results');
var pastResults = document.querySelector('#past-results');



var API_KEY = "59522776659ba117cd7e6a6ffa40c063"
var limit = '1';

function findLocation(city){
    var baseUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=${limit}&appid=${API_KEY}`
    //var baseUrl = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${API_KEY}`;

    fetch(baseUrl)
        .then((response) => {
            
            //console.log(response);
            return response.json();
        })
        .then((data) =>{
            //console.log(data);
            //console.log(data.length);

            if(data.length <= 0){
                console.log("No Valid Result");
            }else{
                storeSearchedData(city);
                findWeather(data[0].lat, data[0].lon);
            }
            //console.log(data[0].lat);
            //console.log(data[0].lon);


    });
}

function findWeather(lat, lon) {
    var baseUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=hourly,minutely&appid=${API_KEY}`;

    fetch(baseUrl)
    .then((response) => {

        return response.json();
    })
    .then((data) =>{

        //console.log(data);
        getDailyWeather(lat, lon, data.current.uvi);
    });
}

//Gets weather by days
function getDailyWeather(lat, lon, uvi) {
    var baseUrl = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${API_KEY}`

    fetch(baseUrl)
    .then((response) => {
        
        //console.log(response);
        return response.json();
    })
    .then((data) =>{
        console.log(data);
        var day1 = data.list[0];

        var day2 = data.list[8];
        var day3 = data.list[16];
        var day4 = data.list[24];
        var day5 = data.list[32];
        var day6 = data.list[39];

        console.log(day1);

        //console.log(timeFormat(day1.dt_txt));

        weatherResults.innerHTML =
        `
        <div id="weather-stats">
            <div class="d-flex flex-row">
                <h1>${data.city.name}</h1>
                &nbsp
                <h1> ${timeFormat(day1.dt_txt)}</h1>
                &nbsp
                <img src="https://openweathermap.org/img/wn/${day1.weather[0].icon}.png"/>
            </div>
            <div class="d-flex flex-row">
                <label>Temp: ${day1.main.temp} °F</label>
            </div>
            <div class="d-flex flex-row">
                <label>Wind: ${day1.wind.speed} MPH</label>

            </div>
            <div class="d-flex flex-row">
                <label>Humidity:${day1.main.humidity} %</label>
            </div>
            <div class="d-flex flex-row">
                <label>UV Index: ${uvi}</label>
            </div>
        </div>

        <div id="day-container">
            <h1>5 Day Forecast: </h1>
            <div class="row">
                <div class="col-2 d-flex flex-column">
                    <h2>${timeFormat(day2.dt_txt)}</h2>
                    <img class="small-image" src="https://openweathermap.org/img/wn/${day2.weather[0].icon}.png"/>
                    <label>Temp: ${day2.main.temp} °F</label>
                    <label>Wind: ${day2.wind.speed} MPH</label>
                    <label>Humidity: ${day2.main.humidity} %</label>
                </div>

                <div class="col-2 d-flex flex-column">
                    <h2>${timeFormat(day3.dt_txt)}</h2>
                    <img class="small-image" src="https://openweathermap.org/img/wn/${day3.weather[0].icon}.png"/>
                    <label>Temp: ${day3.main.temp} °F</label>
                    <label>Wind: ${day3.wind.speed} MPH</label>
                    <label>Humidity: ${day3.main.humidity} %</label>
                </div>

                <div class="col-2 d-flex flex-column">
                    <h2>${timeFormat(day4.dt_txt)}</h2>
                    <img class="small-image" src="https://openweathermap.org/img/wn/${day4.weather[0].icon}.png"/>
                    <label>Temp: ${day4.main.temp} °F</label>
                    <label>Wind: ${day4.wind.speed} MPH</label>
                    <label>Humidity: ${day4.main.humidity} %</label>
                </div>

                <div class="col-2 d-flex flex-column">
                    <h2>${timeFormat(day5.dt_txt)}</h2>
                    <img class="small-image" src="https://openweathermap.org/img/wn/${day5.weather[0].icon}.png"/>
                    <label>Temp: ${day5.main.temp} °F</label>
                    <label>Wind: ${day5.wind.speed} MPH</label>
                    <label>Humidity: ${day5.main.humidity} %</label>
                </div>

                <div class="col-2 d-flex flex-column">
                    <h2>${timeFormat(day6.dt_txt)}</h2>
                    <img class="small-image" src="https://openweathermap.org/img/wn/${day6.weather[0].icon}.png"/>
                    <label>Temp: ${day6.main.temp} °F</label>
                    <label>Wind: ${day6.wind.speed} MPH</label>
                    <label>Humidity: ${day6.main.humidity} %</label>
                </div>
            </div>
        </div>
        `


    });
}

function storeSearchedData(results){

    var storedSearches;
    var repeated = false;

    if(localStorage.getItem('searchedItems') == null){
        storedSearches = [];
    }else{
        storedSearches = JSON.parse(localStorage.getItem('searchedItems'));
    }

    storedSearches.forEach(item => {

        if(item == results.toLowerCase()){
            console.log('repeated result');
            repeated = true;
        }
    });

    if(!repeated){
        storedSearches.push(results.toLowerCase());
        localStorage.setItem('searchedItems', JSON.stringify(storedSearches));

        showPastSearches();
    }
}

function showPastSearches(){

    var seachedList = JSON.parse(localStorage.getItem('searchedItems'));

    pastResults.innerHTML = "";

    if(seachedList !== null){
        seachedList.forEach(result =>{
            var btnResult = document.createElement('button');

            btnResult.classList.add("button");
            btnResult.classList.add("search-item");

            btnResult.textContent = result.toString();
            pastResults.appendChild(btnResult);
        });
    }
}

function timeFormat(date){
    return moment(date).format('L');
}

searchButton.addEventListener('click', function (event){

    console.log(searchText.value);
    findLocation(searchText.value);
});

pastResults.addEventListener('click', function (event){
    //event.preventDefault();

    //console.log("Button clicked");
    //console.log(event.target.textContent);
    findLocation(event.target.textContent);
});

showPastSearches();

//console.log("Testing");