const $searchBtn = $("#search-btn");
const $searchInput = $("#search-input");
const $searchHistory = $("#search-history");
let city = "";
const $cityName = $("#cityName");
const $iconMain = $("#iconMain");
const $tempSpan = $("#tempSpan");
const $windSpan = $("#windSpan");
const $humiditySpan = $("#humiditySpan");
const $indexSpan = $("#indexSpan");
const $forecast = $(".forecast");

function initPage() {
    if (localStorage.getItem("cities")) {
        let lastSearched = JSON.parse(localStorage.getItem("cities"));
        runSearch(lastSearched[0]);
    } else {
        runSearch("Denver");
    }
}

initPage();

$searchBtn.on("click", getInput);

function getInput(event) {
    event.preventDefault();
    city = $searchInput.val().trim();
    runSearch(city);
}

function runSearch(city) {
    for (let i = 0; i < $forecast.length; i++) {
        $forecast[i].innerHTML = "";
    }
    const firstRequestURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=56ad829811fedde89e78e8505c048c6f";
    fetch(firstRequestURL)
        .then(function (response) {
            response.json().then(function (data) {
                const latitude = data.coord.lat;
                const longitude = data.coord.lon;
                const secondRequestURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latitude + "&lon=" + longitude + "&units=imperial&appid=56ad829811fedde89e78e8505c048c6f";
                fetch(secondRequestURL)
                    .then(function (response) {
                        response.json().then(function (data) {
                            console.log(data);
                            // storeWeather(data, city);
                            displayWeather(data, city);
                        })
                    })
            })
        }) 
        addHistory(city);
    $searchInput.val("");
}

function displayWeather(data, city) {
    $iconMain.attr("src", "http://openweathermap.org/img/wn/" + data.current.weather[0].icon + "@2x.png");
    $cityName.text(city + " - " + moment().format("MM/DD/YYYY"));
    $tempSpan.text(data.current.temp);
    $windSpan.text(data.current.wind_speed);
    $humiditySpan.text(data.current.humidity);
    $indexSpan.text(data.current.uvi);
    $indexSpan.attr("class", "");
    if (data.current.uvi >= 0 && data.current.uvi <= 2) {
        $indexSpan.addClass("favorable");
    } else if (data.current.uvi > 2 && data.current.uvi <= 5) {
        $indexSpan.addClass("moderate");
    } else {
        $indexSpan.addClass("severe");
    }
    for (let i = 0; i < $forecast.length; i++) {
        let $date = document.createElement("h3");
        $date.textContent = moment().add((i+1), "days").format("MM/DD/YYYY");
        let $icon = document.createElement("img");
        $icon.setAttribute("src", "http://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + "@2x.png");
        let $temp = document.createElement("p");
        $temp.textContent = "Temp: " + data.daily[i].temp.day + "?? F";
        let $wind = document.createElement("p");
        $wind.textContent = "Wind: " + data.daily[i].wind_speed + " mph";
        let $humidity = document.createElement("p");
        $humidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
        $forecast[i].append($date, $icon, $temp, $wind, $humidity);
    }
}

function addHistory(city) {
    let existingData;
    if (localStorage.getItem("cities")) {
        existingData = JSON.parse(localStorage.getItem("cities"));
        if (!existingData.includes(city)) {
            existingData.unshift(city);
        } else {
            let i = existingData.indexOf(city);
            existingData.splice(i, 1);
            existingData.unshift(city);
        }
        localStorage.setItem("cities", JSON.stringify(existingData));
    } else {
        localStorage.setItem("cities", JSON.stringify([city]));
    }
    $searchHistory.text("");
    let searchHistory = JSON.parse(localStorage.getItem("cities"));
    for (let i = 0; i < searchHistory.length; i++) {
        let $searchedCity = $("<p><button>" + searchHistory[i] + "</button></p>");
    $searchHistory.append($searchedCity);
    $searchedCity.on("click", function() {
        runSearch(searchHistory[i]);
    });
    }
}