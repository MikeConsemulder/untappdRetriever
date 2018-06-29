let credentials = require("../../credentials/credentials.json");

module.exports = class UrlHandler {

    constructor(urlObject) {

        //private vars
        let requestObject = {
            baseUrl: 'https://api.untappd.com',
            version: 'v4',
            requestCredentials: credentials,
            endpoint: urlObject.endpoint,
            username: urlObject.username,
            params: urlObject.params
        }

        //create the url
        this.url = this.constructRequestUrl(requestObject);
    }

    constructRequestUrl(requestObject) {

        let url = `${requestObject.baseUrl}/${requestObject.version}/${requestObject.endpoint}/${requestObject.username}?`;
        url += `client_id=${requestObject.requestCredentials.client_id}&client_secret=${requestObject.requestCredentials.client_secret}`;

        if (typeof requestObject.params !== 'undefined') {

            let objectKeys = Object.keys(requestObject.params);
            for (let i = 0; i < objectKeys.length; i++) {

                url += `&${objectKeys[i]}=${requestObject.params[objectKeys[i]]}`;
            }
        }

        return url;
    }
}