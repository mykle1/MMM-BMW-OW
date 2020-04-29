/* Magic Mirror
 * Module: MMM-BMW-OW
 *
 * By Mykle1
 *
 * MIT Licensed
 */
const NodeHelper = require('node_helper');
const request = require('request');



module.exports = NodeHelper.create({

    start: function() {
        console.log("Starting node_helper for: " + this.name);
    },

    getWeather: function(url) {
        request({
            url: 'https://api.openweathermap.org/data/2.5/onecall?lat=' + this.config.lat + '&lon=' + this.config.lon + '&units=' + this.config.units + '&lang=' + this.config.language + '&appid=' + this.config.api,
            method: 'GET'
        }, (error, response, body) => {
            if (!error && response.statusCode == 200) {
                var result = JSON.parse(body);
                //	console.log(body); // for checking
                this.sendSocketNotification('WEATHER_RESULT', result);
            }
        });
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === 'GET_WEATHER') {
            this.getWeather(payload);
        }
        if (notification === 'CONFIG') {
            this.config = payload;
        }
    }
});
