const express = require('express');
const app = express();
const util = require('util')
const bodyParser = require('body-parser');
const Retriever = require("./assets/classes/Retriever");
const WebsiteScraper = require("./assets/classes/WebsiteScraper");
const basicAuth = require('express-basic-auth');
const cheerio = require('cheerio');
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set basic authentication
app.use(basicAuth({
    authorizer: authorizer,
    authorizeAsync: true
}))

function authorizer(username, password, cb) {
    //get username and password from .env
    let BasicAuthUsername = process.env.BASIC_AUTH_USERNAME;
    let BasicAuthPassword = process.env.BASIC_AUTH_PASSWORD;

    if (username === BasicAuthUsername && password === BasicAuthPassword) {

        return cb(null, true);
    }

    return cb('Unauthorized, biatch', false)
}

//set the port, if there is no env port use 8080 / heroku stuff,, you know
var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
var router = express.Router();
// all of our routes will be prefixed with /api
app.use('/api', router);
// START THE SERVER
app.listen(port);


console.log('server started on port: ' + port);

router.route('/getbeers').get(function (req, res) {

    let parameters = req.query;
    let username = parameters.username;

    if (typeof username === 'undefined') {

        res.json({ message: 'no username defined' });
        return;
    }

    getAdditionalInformation(username, 628512108);
    //getAllInformation(username, res);
});

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api! Now go away' });
});


function getAdditionalInformation(username, checkinId) {

    websiteScraper = new WebsiteScraper(username, checkinId);
    websiteScraper.getWebsiteData().then($ => {

        let image = $('.image-big')[0].attribs['data-image'];
        let location = $('.location').text();
        let comment = $('.comment').text();
        let serving = $('.serving').text();
        let taggedFriends = $('.tagged-friends ul').find('li');
        let friendsInfo = getFriendsInfo($, taggedFriends);

    });
}

function getFriendsInfo($, friendsInfo) {

    let friendsObject = [];
    for (let i = 0; i < friendsInfo.length; i++) {

        let username = $(friendsInfo[0]).find('a')[i].attribs['href'].replace('/user/', '');
        let imageUrl = $(friendsInfo[0]).find('img')[i].attribs['src'];

        friendsObject.push({
            username: username,
            imageUrl: imageUrl
        });

        console.log(username, imageUrl);
    }

    console.log(friendsObject);
}

function getAllInformation(username, res) {

    let dataToSend = {};
    const retriever = new Retriever(username);
    getUserInformation(retriever).then(userInformation => {

        dataToSend.userInformation = userInformation;
        //now get the information about the beers
        getUserBeerInformation(retriever, userInformation.beerCount).then(beerInfo => {

            dataToSend.beerInfo = beerInfo;
            sendDataToClient(res, dataToSend, username);
        });
    });
}

function sendDataToClient(res, dataToSend, username) {

    //send data back to via api
    res.json({
        message: `${username}'s information`,
        data: dataToSend
    });
}

function getUserInformation(retriever) {
    //create promise
    return new Promise((resolve, reject) => {

        //get the basic userinformation
        retriever.getBasicUserInformation().then(userInfo => {

            resolve(stripUserInformation(userInfo));
        });
    })
}

function getUserBeerInformation(retriever, totalAmountOfBeers) {

    //get the beers by user
    let limit = 50;
    let offset = 0;
    let promiseArray = [];

    console.log(`try to collect all ${totalAmountOfBeers} beers`);

    for (offset; offset <= totalAmountOfBeers; offset += limit) {

        promiseArray.push(new Promise((resolve, reject) => {

            retriever.getUserBeers(limit, offset).then(beerInfo => {

                resolve(stripBeerInformation(beerInfo.response.beers.items));
            });
        }));
    }

    return Promise.all(promiseArray);
}

function stripBeerInformation(beersinfo) {

    //  console.log(beersinfo);

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

function stripUserInformation(userObject) {

    let user = userObject.response.user;
    return {
        firstName: user.first_name,
        lastName: user.last_name,
        userAvatar: user.user_avatar_hd,
        beerCount: user.stats.total_checkins
    };
}