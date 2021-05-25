const $searchBtn = $("#search-btn");
const $searchInput = $("#search-input");
const $searchHistory = $("#search-history");
let city = "";
const $cityName = $("#cityName");
const $tempSpan = $("#tempSpan");
const $windSpan = $("#windSpan");
const $humiditySpan = $("#humiditySpan");
const $indexSpan = $("#indexSpan");

$searchBtn.on("click", function () {
    runSearch(event);
});

function runSearch(event) {
    event.preventDefault();

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
                            displayWeather(data, city);
                        })
                    })
            })
        }) 
    addHistory(city);
    $searchInput.val("");
}

function searchFromHistory(city) {
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
                            displayWeather(data, city);
                        })
                    })
            })
        }) 
}

function displayWeather(data, city) {
    $cityName.text(city + " - " + moment().format("MM/DD/YYYY"));
    $tempSpan.text(data.current.temp);
    $windSpan.text(data.current.wind_speed);
    $humiditySpan.text(data.current.humidity);
    $indexSpan.text(data.current.uvi);
    $indexSpan.attr("class", "");
    if (0 < data.current.uvi < 2) {
        $indexSpan.addClass("favorable");
    } else if (2 < data.current.uvi < 5) {
        $indexSpan.addClass("moderate");
    } else {
        $indexSpan.addClass("severe");
    }
}

function clear() {
    $cityName.text("");
    $tempSpan.text("");
    $windSpan.text("");
    $humiditySpan.text("");
    $indexSpan.text("");
    $indexSpan.attr("class", "");
}

function addHistory(city) {
    let newCity = $("<button>" + city + "</button>")
    $searchHistory.append(newCity);
    clear();
    newCity.on("click", function() {
        searchFromHistory(city);
    });
}