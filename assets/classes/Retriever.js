let UrlHandler = require("./UrlHandler");
let RequestHandler = require("./RequestHandler");

module.exports = class Retriever {

    constructor() {

        this.endPoints = {
            userInfo: 'user/info',
            userBeers: 'user/beers'
        }

        this.username = 'onbijtkoek'

        this.init();
    }

    init() {
        //get the basic userinformation
        this.getBasicUserInformation().then(userInfo => {

            this.userInfo = userInfo;
            console.log(this.userInfo);
        });

        //get the beers by user
        this.getUserBeers().then(beerInfo => {

            this.beerInfo = beerInfo;
            console.log(this.beerInfo);
        });
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

    getUserBeers() {

        let beerUrl = new UrlHandler({
            username: this.username,
            endpoint: this.endPoints.userBeers,
            params: {
                limit: 50,
                offset: 0
            }
        });

        let request = new RequestHandler({
            method: 'POST',
            url: beerUrl.url
        })

        return request.doRequest();
    }

}