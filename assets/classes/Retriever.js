let UrlHandler = require("./UrlHandler");
let RequestHandler = require("./RequestHandler");

module.exports = class Retriever {

    /**
     * 
     * @param {string} username 
     */
    constructor(username) {

        this.endPoints = {
            userInfo: 'user/info',
            userBeers: 'user/beers',
            userCheckins: 'user/checkins'
        }

        this.username = username;
        this.getBasicUserInformation = this.getBasicUserInformation;
        this.getUserBeers = this.getUserBeers;
    }

    getBasicUserInformation() {
        //construct the url for the request
        let userUrl = new UrlHandler({
            username: this.username,
            endpoint: this.endPoints.userInfo
        });

        let request = new RequestHandler({
            method: 'POST',
            url: userUrl.url
        });

        return request.doRequest();
    }

    getUserBeers(limit, max_id) {

        let params = {
            limit: limit
        }
        if (max_id !== "") params.max_id = max_id;

        let beerUrl = new UrlHandler({
            username: this.username,
            endpoint: this.endPoints.userCheckins,
            params: params
        });

        let request = new RequestHandler({
            method: 'POST',
            url: beerUrl.url
        })

        return request.doRequest();
    }

}