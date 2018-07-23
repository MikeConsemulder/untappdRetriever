const cheerio = require('cheerio');
let request = require("request");

module.exports = class WebsiteScraper {

    constructor(username, checkinId) {

        this.checkinId = checkinId;
        this.username = username;
    }


    //TODO: grab all data from the checkin url
    //https://untappd.com/user/{{username}}/checkin/{{checkinID}}
    //https://untappd.com/user/onbijtkoek/checkin/628512108
    /**
    * Do the request
    */
    getWebsiteData() {

        let url = `https://untappd.com/user/${this.username}/checkin/${this.checkinId}`;

        return new Promise((resolve, reject) => {
            request({
                method: 'GET',
                uri: url,
            }, function (error, response, body) {

                if (!error) {
                    //return the parsed body
                    const $ = cheerio.load(body)
                    resolve($);
                }

                reject(error);
            });
        });
    }

    //TODO: parse the data to targetable HTML

    //TODO: grab the desired data

    //TODO: return the desired data


}