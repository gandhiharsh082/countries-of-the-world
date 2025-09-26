let debounceTimer; // Declare a variable to store the debounce timer

function search() {
    var search_value = document.getElementById("search").value;
    let length = search_value.length;

    if (length >= 3) {
        clearTimeout(debounceTimer);

        debounceTimer = setTimeout(() => {
            display(search_value);
        }, 500);
    } else if (length < 3) {
        document.getElementById("dataDisplay").innerHTML = "";
    }
}

async function display(search_value) {
    let data = await callAPI(search_value);
    console.log(data);
    let html = "";

    if (data.length > 0) {
        for (let item in data) {
            html += `<div class="col-md-4 mt-2">
                <div class="card" style="width: 18rem;">
                  <div class="card-body">
                    <h5 class="card-title" id="city">${data[item].name}</h5>
                    <p class="card-text">
                      <b>Capital:</b> ${data[item].capital}<br>
                      <b>Region:</b> ${data[item].region}<br>
                      <b>Alpha2 Code:</b> ${data[item].alpha2Code}<br>
                      <b>Calling Code:</b> +${data[item].callingCodes.join(", ")}<br>

                    </p>
                      <div class="weatherDisplay mt-2"></div>
                  </div>
                  <button class="btn btn-primary" onclick="getWeather('${data[item].capital}', this)">Get Weather</button>
                </div>
              </div>`;
        }
    } else {
        html += "<h5>Not found</h5>";
    }

    document.getElementById("dataDisplay").innerHTML = html;
}

async function callAPI(text) {
    const APIKEY = "805ad7757bc0c1ec97a732eb4b231d60";
    let api = await fetch(
        `https://api.countrylayer.com/v2/name/${text}?access_key=${APIKEY}&fulltext=true`);
    let response = await api.json();
    console.log(response);
    
    return response;
}

async function getWeather(city1, button) {
    const WAPIKEY = "3a21e977cfecab39a1df53669e251e60";
    let city = city1.trim();
    let api = await fetch(
        `https://api.weatherstack.com/current?access_key=${WAPIKEY}&query=${city}`);
    let response = await api.json();
    console.log(response);

    // Find the closest weatherDisplay div relative to the clicked button
    let weatherDisplay = button.parentElement.querySelector(".weatherDisplay");
    weatherDisplay.innerHTML = `
    <h4>${response.current.temperature} °C</h4>
    <h4>${response.current.weather_descriptions[0]}</h4>
    <img src=${response.current.weather_icons[0]} alt="Weather Icon">
    `;
}
