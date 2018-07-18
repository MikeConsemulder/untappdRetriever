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
            userBeers: 'user/beers'
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

    getUserBeers(limit, offset) {

        let beerUrl = new UrlHandler({
            username: this.username,
            endpoint: this.endPoints.userBeers,
            params: {
                limit: limit,
                offset: offset
            }
        });

        let request = new RequestHandler({
            method: 'POST',
            url: beerUrl.url
        })

        return request.doRequest();
    }

}