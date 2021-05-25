const $searchBtn = $("#search-btn");
const $searchInput = $("#search-input");
const $searchHistory = $("#search-history");
let city = "";
const $cityName = $("#cityName");
const $tempSpan = $("#tempSpan");
const $windSpan = $("#windSpan");
const $humiditySpan = $("#humiditySpan");
const $indexSpan = $("#indexSpan");
const $forecast = $(".forecast");

$searchBtn.on("click", runSearch);

function runSearch(event) {
    event.preventDefault();
    for (let i = 0; i < $forecast.length; i++) {
        $forecast[i].text("");
    }
    city = $searchInput.val();
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
                            storeWeather(data, city);
                            displayWeather(data, city);
                        })
                    })
            })
        }) 
        addHistory(city);
    $searchInput.val("");
}

function displayWeather(data, city) {
    $cityName.text(city + " - " + moment().format("MM/DD/YYYY"));
    $tempSpan.text(data.current.temp);
    $windSpan.text(data.current.wind_speed);
    $humiditySpan.text(data.current.humidity);
    $indexSpan.text(data.current.uvi);
    $indexSpan.attr("class", "");
    if (data.current.uvi > 0 && data.current.uvi < 2) {
        $indexSpan.addClass("favorable");
    } else if (data.current.uvi > 2 && data.current.uvi < 5) {
        $indexSpan.addClass("moderate");
    } else {
        $indexSpan.addClass("severe");
    }
    for (let i = 0; i < $forecast.length; i++) {
        let $date = document.createElement("h3");
        $date.textContent = moment().add((i+1), "days").format("MM/DD/YYYY");
        let $icon = document.createElement("img");
        if (data.daily[i].weather[0].icon === "01d") {
            $icon.setAttribute("src", "http://openweathermap.org/img/wn/01d@2x.png");
        } else if (data.daily[i].weather[0].icon === "02d") {
            $icon.setAttribute("src", "http://openweathermap.org/img/wn/02d@2x.png");
        } else if (data.daily[i].weather[0].icon === "03d") {
            $icon.setAttribute("src", "http://openweathermap.org/img/wn/03d@2x.png");
        } else if (data.daily[i].weather[0].icon === "04d") {
            $icon.setAttribute("src", "http://openweathermap.org/img/wn/04d@2x.png");
        }
        let $temp = document.createElement("p");
        $temp.textContent = "Temp: " + data.daily[i].temp.day + "° F";
        let $wind = document.createElement("p");
        $wind.textContent = "Wind: " + data.daily[i].wind_speed + " mph";
        let $humidity = document.createElement("p");
        $humidity.textContent = "Humidity: " + data.daily[i].humidity + "%";
        $forecast[i].append($date, $icon, $temp, $wind, $humidity);
    }
}

function addHistory(city) {
    let $oldCity = $("<button class='btn'>" + city + "</button>");
    $searchHistory.append($oldCity);
    $oldCity.on("click", function() {
        loadStoredData(city);
    });
}

function storeWeather(data, city) {
    localStorage.setItem(city, JSON.stringify(data));
}

function loadStoredData(city) {
    let data = JSON.parse(localStorage.getItem(city));
    displayWeather(data);
}