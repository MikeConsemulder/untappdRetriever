import fetch from 'node-fetch';

export class RequestHandler {

    constructor(urlObject) {

        this.method = urlObject.method;
        this.url = urlObject.url;
    }

    async request() {

        const fetchObject = { method: this.method };
        const fetchedData = await fetch(this.url, fetchObject);
        return await fetchedData.json();
    }
}