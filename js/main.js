const apiKey = "ae98edb920564d1c58b52917178a5d33";
const url = `http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=${apiKey}`;
const existCityInDisplay=[];

/**
 * 
 */
function confirmedPermission() {
    getHtmlElement('.userPermission').style.display = 'none';
    showLocationData();
}
/**
 * 
 */
function showLocationData() {
    if (!navigator.geolocation) {
    } else {
        navigator.geolocation.getCurrentPosition(success, error);
    }
}
function error() {
}
/**
 * 
 * @param {*} position 
 */
function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    showWeatherWithLotAndLon(latitude, longitude);

}
/**
 * 
 * @param {*} latitude 
 * @param {*} longitude 
 */
async function showWeatherWithLotAndLon(latitude, longitude) {
    try {
        const urlWithLatitudeAndLongitude = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=metric&appid=${apiKey}
        `;
        const weather = await (await fetch(urlWithLatitudeAndLongitude)).json();
        showUserHisData(weather);
    } catch (e) {
        console.error(e);
        showToTheUserErrorMessage();
    }
}
/**
 * 
 * @param {*} event 
 */
function serchHandler(event) {
    showWeatherViaCityName(getHtmlElement('#serchText').value);
}

function enterTextHandler(event) {
    if (event.key == 'Enter') {
        getHtmlElement('#serchBtn').click();
        getHtmlElement('#serchText').value="";
    }
}

/**
 * 
 * @param {*} cityName 
 */
async function showWeatherViaCityName(cityName) {
    try {
        if(existCityInDisplay.includes(cityName)) {
            getHtmlElement('#message').textContent= "this city exists on the screen!!";
        }else{
            existCityInDisplay.push(); 
            const urlWithCityName = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=metric&appid=${apiKey}`;
            const weather = await (await fetch(urlWithCityName)).json();
            showCityData(weather);
        }

    } catch (e) {
        console.error(e);
        showToTheUserErrorMessage();
    }
}
/**
 * 
 */
function showToTheUserErrorMessage() {
    let message = getHtmlElement('#message');
    message.innerHTML = "location does not exist";
    message.style.color = 'red';
}
/**
 * 
 */
function hideErrorMessageFromUser() {
    getHtmlElement('#message').innerHTML = "";
}
/**
 * 
 */
function declinedPermission() {
    getHtmlElement(".userPermission").style.display = "none";
}
/**
 * 
 * @param {*} usersWeatherData 
 */
function showUserHisData(usersWeatherData) {
    usersWeatherData = filterData(usersWeatherData);
    getHtmlElement('.usersLocationWeather').innerHTML = buildHtmlElement(usersWeatherData, 'user');
    addEventListenerToElement(getHtmlElement(".hide"), 'click', hideParentHandler);
}
/**
 * 
 * @param {*} cityWeatherData 
 */
function showCityData(cityWeatherData) {
    cityWeatherData = filterData(cityWeatherData);
    getHtmlElement('.serchedWeather').innerHTML += buildHtmlElement(cityWeatherData, 'city');
    getHtmlAllElement('.delete').forEach(btn => {
        addEventListenerToElement(btn, 'click', deleteParentHandler);
    })
    hideErrorMessageFromUser()
}
/**
 * 
 * @param {*} event 
 */
function hideParentHandler(event) {
    event.target.parentElement.style.display = 'none';
}
/**
 * 
 * @param {*} event 
 */
function deleteParentHandler(event) {
    event.target.parentElement.remove();
}
/**
 * 
 * @param {*} e 
 */
function serchTextHandler(e) {
    e.target.value = "";
}
/**
 * 
 * @param {*} data 
 * @param {*} type 
 * @returns 
 */
function buildHtmlElement(data, type) {
    let btnType = "";
    let str = '';
    if (type === 'user') {
        btnType = "Hide"
    } else if (type === 'city') {
        btnType = "Delete"
    }
    str += `<div class =" ${type.toLowerCase()}"><div class="name">location name: ${data.name}</div><div class="country ${type.toLowerCase()}item">Country: ${data.country}</div><div class="sunset ${type.toLowerCase()}item">Sunrise: ${new Date(data.sunrise).toString().split(' ')[4]}</div><div class="sunset1 ${type.toLowerCase()}item">Sunset: ${new Date(data.sunset).toString().split(' ')[4]}</div><div class="temperature ${type.toLowerCase()}item">Temperature: ${data.temperature}</div><div class=""></div><input type="button" class="${btnType.toLocaleLowerCase()} ${type.toLowerCase()}item" value="${btnType}"></div>`
    return str;
}
/**
 * 
 * @param {*} response 
 * @returns 
 */
function filterData(response) {
    return {
        name: response.name,
        country: response.sys.country,
        sunset: response.sys.sunset * 1000,
        sunrise: response.sys.sunrise * 1000,
        windSpeed: response.wind.speed,
        minTemperature: response.main.temp_min,
        maxTemperature: response.main.temp_max,
        temperature: response.main.temp,
        feelsLike: response.main.feels_like,
        humidity: response.main.humidity,
        description: response.weather[0].main,
        descriptionExtended: response.weather[0].description
    }
}
/**
 * 
 * @param {*} selector 
 * @returns 
 */
function getHtmlElement(selector) {
    return document.querySelector(selector);
}
/**
 * 
 * @param {*} selector 
 * @returns 
 */
function getHtmlAllElement(selector) {
    return document.querySelectorAll(selector);
}
/**
 * 
 * @param {*} element 
 * @param {*} eventName 
 * @param {*} callback 
 */
function addEventListenerToElement(element, eventName, callback) {
    element.addEventListener(eventName, callback);
}
/**
 * 
 * @param {*} name 
 * @param {*} data 
 */
function updateLocalStorage(name, data) {
    if (getDataFromLocalStorage(name)) {
        localStorage.remove(name);
    }
    localStorage.setItem(name, data)
}
/**
 * 
 * @param {*} name 
 */
function getDataFromLocalStorage(name) {
    localStorage.getItem(name)
}
/**
 * 
 */
function addEventListeners() {
    addEventListenerToElement(getHtmlElement('#confirmd'), 'click', confirmedPermission);
    addEventListenerToElement(getHtmlElement('#declined'), 'click', declinedPermission);
    addEventListenerToElement(getHtmlElement('#serchBtn'), 'click', serchHandler);
    addEventListenerToElement(getHtmlElement('#serchText'), 'focus', serchTextHandler);
    addEventListenerToElement(getHtmlElement('#serchText'), 'keypress', enterTextHandler);
}
window.onload = function () {
    addEventListeners();
}