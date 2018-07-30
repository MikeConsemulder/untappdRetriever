module.exports = class Checkins {

    /**
     * @param {object} 
     */
	constructor(retriever, totalAmountOfBeers) {

		this.retriever = retriever;
		this.totalAmountOfBeers = totalAmountOfBeers;
		this.remainingBeers = totalAmountOfBeers;
		this.beers = [];
	}

	getBeerInformation(max_id = "") {

		let limit = 50;

		console.log(`try to collect ${this.totalAmountOfBeers} beers, (${this.remainingBeers} remaining) with max_id: ${max_id}`);
		return this.retriever.getUserBeers(limit, max_id).then(async beerInfo => {

			this.remainingBeers = this.remainingBeers - beerInfo.response.checkins.count;
			this.beers.push(beerInfo.response.checkins.items);

			if (this.remainingBeers > 0) {

				await this.getBeerInformation(beerInfo.response.pagination.max_id);

			}

			//combine the arrays
			return this._combineArray(this.beers);
		});
	}

	_combineArray(objToCombine) {

		let beerArray = [];
		for (let i = 0; i < objToCombine.length; i++) {

			objToCombine[i].forEach(beer => {
				beerArray.push(beer);
			});
		}

		return beerArray;
	}

	_stripBeerInformation(beersinfo) {

		//console.log(beersinfo);
		let infoArray = [];

		beersinfo.forEach(beerInfo => {

			infoArray.push({
				firstHad: beerInfo.first_had,
				beerName: beerInfo.beer.beer_name,
				rating: beerInfo.rating_score,
				style: beerInfo.beer.beer_style,
				abv: beerInfo.beer.beer_abv,
				checkinId: beerInfo.recent_checkin_id
			});
		});

		return infoArray;
	}
}