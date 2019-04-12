import { UrlCreator } from '../infrastructure/UrlCreator'
import { RequestHandler } from '../infrastructure/RequestHandler'
import { endPoints } from '../lib/endpoints'

export class BeerInfoRetriever {

    constructor(access_token) {

        this.access_token = access_token;
    }

    async get(limit, max_id) {

        let params = {
            limit: limit
        }
        if (max_id !== "") params.max_id = max_id;

        let beerUrl = new UrlCreator({
            access_token: this.access_token,
            endpoint: endPoints.userCheckins,
            params: params
        });

        let request = new RequestHandler({
            method: 'POST',
            url: beerUrl.url
        })

        const beerInfo = await request.request();
        return beerInfo;
    }
}