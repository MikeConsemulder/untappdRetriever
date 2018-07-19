const express = require('express');
const app = express();
const util = require('util')
const bodyParser = require('body-parser');
const Retriever = require("./assets/classes/Retriever");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

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

    getAllInformation(username, res);
});

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api! Now go away' });
});


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
        message: `${username}'s information.`,
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
    console.log(`try to collect all ${totalAmountOfBeers} beers`);

    return new Promise((resolve, reject) => {
        let limit = 50;
        let offset = 0;
        retriever.getUserBeers(limit, offset).then(beerInfo => {

            resolve(beerInfo);
        });
    });
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