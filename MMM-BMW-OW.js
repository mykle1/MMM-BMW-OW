/* Magic Mirror
 * Module: MMM-BMW-OW
 * By Mykle1
 * MIT Licensed
 */
Module.register("MMM-BMW-OW", {

    // Module config defaults.
    defaults: {
        api: "", // Get FREE API key from https://openweathermap.org/price
        lat: "", // Latitude
        lon: "", // Longitude
        icons: "1", // 1 or 2. (1 = OpenWeather icons)
        css: "1", // 1=default, 2=Clean, 3=Lord of the Rings, 4=handwriting, 5=Julee, 6=Englebert
        ownTitle: "Current Conditions", // Default = Current Conditions
        playSounds: "yes", // yes = weather sounds, no = no weather sounds
        useHeader: false, // true if you want a header
        header: "Your Header", // Any text you want. useHeader must be true
        maxWidth: "100%",
        animationSpeed: 3000,
        initialLoadDelay: 4250,
        retryDelay: 2500,
        updateInterval: 5 * 60 * 1000,
    },

    // Gets correct css file from config.js
    getStyles: function() {
        if (this.config.icons == "2") {
            return ["modules/MMM-BMW-OW/css/MMM-BMW-OW" + this.config.css + ".css"];
        } else if (this.config.icons == "1") {
            return ["modules/MMM-BMW-OW/css2/MMM-BMW-OW" + this.config.css + ".css"];
        } else {
            return ["modules/MMM-BMW-OW/css/MMM-BMW-OW1.css"]; // default.css
        }
    },


    getScripts: function() {
        return ["moment.js"];
    },

    start: function() {
        Log.info("Starting module: " + this.name);
        this.sendSocketNotification('CONFIG', this.config);
        this.config.lang = this.config.lang || config.language;
        this.config.units = this.config.units || config.units;

        this.forecast = {};
        this.scheduleUpdate();
    },

    getDom: function() {

        var wrapper = document.createElement("div");
        wrapper.className = "wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "OpenWeather data . . .";
            wrapper.classList.add("bright", "light", "small");
            return wrapper;
        }

        if (this.config.useHeader != false) {
            var header = document.createElement("header");
            header.classList.add("xsmall", "bright", "light");
            header.innerHTML = this.config.header;
            wrapper.appendChild(header);
        }


        if (this.config.icons == "2") {


            forecast = this.forecast;

            var current = document.createElement("div");
            current.classList.add("small", "bright", "current");
            current.innerHTML =

                this.config.ownTitle + " &nbsp" +

                "<img class = image src=./modules/MMM-BMW-OW/icons/" + forecast.current.weather[0].main + ".png>" +
                "&nbsp " +

                Math.round(forecast.current.temp) + "°" + " &nbsp &nbsp &nbsp &nbsp " +

                " Feels like " + Math.round(forecast.current.feels_like) + "°" +

                " &nbsp &nbsp &nbsp &nbsp Wind @ " +

                Math.round(forecast.current.wind_speed) +

                " &nbsp &nbsp &nbsp &nbsp " +

                " Humidity @ " + Math.round(forecast.current.humidity) + "%" +

                " &nbsp &nbsp &nbsp &nbsp " +

                "Pressure @ " + forecast.current.pressure + " hPa";


            wrapper.appendChild(current);


            // The next 7 days high/low tempw and icons
            var daily = document.createElement("div");
            daily.classList.add("small", "bright", "daily");
            daily.innerHTML =

                moment.unix(forecast.daily[0].sunrise).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-OW/icons/" + forecast.daily[0].weather[0].main + ".png>" + " &nbsp" + Math.round(forecast.daily[0].temp.max) + "/" + Math.round(forecast.daily[0].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


                moment.unix(forecast.daily[1].sunrise).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-OW/icons/" + forecast.daily[1].weather[0].main + ".png>" + " &nbsp" + Math.round(forecast.daily[1].temp.max) + "/" + Math.round(forecast.daily[1].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


                moment.unix(forecast.daily[2].sunrise).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-OW/icons/" + forecast.daily[2].weather[0].main + ".png>" + " &nbsp" + Math.round(forecast.daily[2].temp.max) + "/" + Math.round(forecast.daily[2].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


                moment.unix(forecast.daily[3].sunrise).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-OW/icons/" + forecast.daily[3].weather[0].main + ".png>" + " &nbsp" + Math.round(forecast.daily[3].temp.max) + "/" + Math.round(forecast.daily[3].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


                moment.unix(forecast.daily[4].sunrise).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-OW/icons/" + forecast.daily[4].weather[0].main + ".png>" + " &nbsp" + Math.round(forecast.daily[4].temp.max) + "/" + Math.round(forecast.daily[4].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


                moment.unix(forecast.daily[5].sunrise).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-OW/icons/" + forecast.daily[5].weather[0].main + ".png>" + " &nbsp" + Math.round(forecast.daily[5].temp.max) + "/" + Math.round(forecast.daily[5].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +


                moment.unix(forecast.daily[6].sunrise).local().format('ddd') + " &nbsp" + "<img class = image src=./modules/MMM-BMW-OW/icons/" + forecast.daily[6].weather[0].main + ".png>" + " &nbsp" + Math.round(forecast.daily[6].temp.max) + "/" + Math.round(forecast.daily[6].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp";

            wrapper.appendChild(daily);


        } else if (this.config.icons == "1") {


            forecast = this.forecast;

            var current = document.createElement("div");
            current.classList.add("small", "bright", "current");
            current.innerHTML =

                this.config.ownTitle + " " + forecast.current.weather[0].description + " &nbsp" +

                "<img class = image src=https://openweathermap.org/img/wn/" + forecast.current.weather[0].icon + ".png>" +
                "&nbsp " +

                Math.round(forecast.current.temp) + "°" + " &nbsp &nbsp &nbsp &nbsp " +

                " Feels like " + Math.round(forecast.current.feels_like) + "°" +

                " &nbsp &nbsp &nbsp &nbsp Wind @ " +

                Math.round(forecast.current.wind_speed) +

                " &nbsp &nbsp &nbsp &nbsp " +

                " Humidity @ " + Math.round(forecast.current.humidity) + "%" +

                " &nbsp &nbsp &nbsp &nbsp " +

                "Pressure @ " + forecast.current.pressure + " hPa";

            wrapper.appendChild(current);


            // 7 days high/low temps and icons
            var daily = document.createElement("div");
            daily.classList.add("small", "bright", "daily");
            daily.innerHTML =
                moment.unix(forecast.daily[0].sunrise).local().format('ddd') + "<img class = image src=https://openweathermap.org/img/wn/" + forecast.daily[0].weather[0].icon + ".png>" + Math.round(forecast.daily[0].temp.max) + "/" + Math.round(forecast.daily[0].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +

                moment.unix(forecast.daily[1].sunrise).local().format('ddd') + "<img class = image src=https://openweathermap.org/img/wn/" + forecast.daily[1].weather[0].icon + ".png>" + Math.round(forecast.daily[1].temp.max) + "/" + Math.round(forecast.daily[1].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +

                moment.unix(forecast.daily[2].sunrise).local().format('ddd') + "<img class = image src=https://openweathermap.org/img/wn/" + forecast.daily[2].weather[0].icon + ".png>" + Math.round(forecast.daily[2].temp.max) + "/" + Math.round(forecast.daily[2].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +

                moment.unix(forecast.daily[3].sunrise).local().format('ddd') + "<img class = image src=https://openweathermap.org/img/wn/" + forecast.daily[3].weather[0].icon + ".png>" + Math.round(forecast.daily[3].temp.max) + "/" + Math.round(forecast.daily[3].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +

                moment.unix(forecast.daily[4].sunrise).local().format('ddd') + "<img class = image src=https://openweathermap.org/img/wn/" + forecast.daily[4].weather[0].icon + ".png>" + Math.round(forecast.daily[4].temp.max) + "/" + Math.round(forecast.daily[4].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +

                moment.unix(forecast.daily[5].sunrise).local().format('ddd') + "<img class = image src=https://openweathermap.org/img/wn/" + forecast.daily[5].weather[0].icon + ".png>" + Math.round(forecast.daily[5].temp.max) + "/" + Math.round(forecast.daily[5].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp" +

                moment.unix(forecast.daily[6].sunrise).local().format('ddd') + "<img class = image src=https://openweathermap.org/img/wn/" + forecast.daily[6].weather[0].icon + ".png>" + Math.round(forecast.daily[6].temp.max) + "/" + Math.round(forecast.daily[6].temp.min) + " &nbsp &nbsp  &nbsp &nbsp &nbsp";

            wrapper.appendChild(daily);

        }

        // Sound for rain, wind, thunder, etc.
        if (forecast.current.weather[0].main == "Rain" && this.config.playSounds == "yes") {
            var sound = new Audio()
            sound.src = 'modules/MMM-BMW-OW/sounds/rain.mp3'
            sound.play()
        } else if (forecast.current.weather[0].main == "Thunder" && this.config.playSounds == "yes") {
            var sound = new Audio();
            sound.src = 'modules/MMM-BMW-OW/sounds/thunder.mp3';
            sound.play();
        } else if (forecast.current.weather[0].main == "Wind" && this.config.playSounds == "yes") {
            var sound = new Audio();
            sound.src = 'modules/MMM-BMW-OW/sounds/wind.mp3';
            sound.play();
        }

        return wrapper;
    },


    processWeather: function(data) {
        this.forecast = data;
        console.log(this.forecast);
        this.loaded = true;
    },


    scheduleUpdate: function() {
        setInterval(() => {
            this.getWeather();
        }, this.config.updateInterval);
        this.getWeather(this.config.initialLoadDelay);
    },

    getWeather: function() {
        this.sendSocketNotification('GET_WEATHER');
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "WEATHER_RESULT") {
            this.processWeather(payload);
        }
        this.updateDom(this.config.initialLoadDelay);
    },
});
