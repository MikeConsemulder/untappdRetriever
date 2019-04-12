import { BeerInfoRetriever } from "./BeerInfoRetriever";

export class Checkins extends BeerInfoRetriever {

	constructor(accessToken, totalAmountOfBeers) {
		super(accessToken);
		this.totalAmountOfBeers = totalAmountOfBeers;
		this.remainingBeers = totalAmountOfBeers;
		this.beers = [];
	}

	async getBeerInformation(max_id = "") {

		const limit = this._beerLimit();
		const beerInfo = await this.get(limit, max_id);

		const checkins = beerInfo.response.checkins;
		const paginationMaxId = beerInfo.response.pagination.max_id;
		this.remainingBeers -= checkins.count;

		const filteredItems = this._stripBeerInformation(checkins.items);
		this.beers = this.beers.concat(filteredItems);

		if (this.remainingBeers > 0) return this.getBeerInformation(paginationMaxId);
		return this.beers;
	}

	_beerLimit() {

		if (this.remainingBeers < 50) return this.remainingBeers
		return 50;
	}

	_stripBeerInformation(beersInfo) {

		const infoArray = [];

		beersInfo.forEach(beerInfo => {

			const checkinData = this._getCheckinData(beerInfo);
			const beerData = this._getBeerData(beerInfo);
			const venueData = this._getVenueData(beerInfo);

			infoArray.push({
				checkinData,
				beerData,
				venueData
			});
		});

		return infoArray;
	}

	_getCheckinData(beerInfo) {

		return {
			created_at: beerInfo.created_at,
			checkin_comment: beerInfo.checkin_comment,
			rating_score: beerInfo.rating_score,
			checkin_id: beerInfo.checkin_id,
			checkin_picture: this._getCheckinImage(beerInfo.media)
		}
	}

	_getCheckinImage(media) {

		if (media.items.length === 0) return null;
		return media.items[0].photo.photo_img_md;
	}

	_getBeerData(beerInfo) {

		return {
			beer_name: beerInfo.beer.beer_name,
			beer_style: beerInfo.beer.beer_style,
			beer_abv: beerInfo.beer.beer_abv
		}
	}

	_getVenueData(beerInfo) {

		if (typeof beerInfo.venue === 'undefined') return null;

		return {
			venue_name: beerInfo.venue.venue_name
		}
	}
}