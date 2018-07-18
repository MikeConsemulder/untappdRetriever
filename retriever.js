const express = require('express');
const app = express();
const util = require('util')
const bodyParser = require('body-parser');


//const Retriever = require("./assets/classes/Retriever");
//const retriever = new Retriever('onbijtkoek');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

// ROUTES FOR OUR API
var router = express.Router();

router.route('/getbeers').get(function (req, res) {

    let parameters = req.query;

    if (typeof req.query.username === 'undefined') {

        res.json({ message: 'no username defined' });
        return;
    }

    res.json({ message: 'ok nice nice!' });

});

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// more routes for our API will happen here

// REGISTER OUR ROUTES -------------------------------
// all of our routes will be prefixed with /api
app.use('/api', router);

// START THE SERVER
app.listen(port);
console.log('server started on port: ' + port);

// //initialize the project
// init();
// let userInformation;
// let userBeers = [];
// let limit = 50;
// let offset = 0;

// function init() {

//     //first get the information about the user
//     getUserInformation();
// }

// function getUserInformation() {

//     //get the basic userinformation
//     retriever.getBasicUserInformation().then(userInfo => {

//         userInformation = stripUserInformation(userInfo);
//         //now get the information about the beers
//         getUserBeerInformation(userInformation.beerCount);
//     });
// }

// function getUserBeerInformation(totalAmountOfBeers) {
//     //get the beers by user

//     retriever.getUserBeers(limit, offset).then(beerInfo => {

//         this.beerInfo = beerInfo;
//         console.log(this.beerInfo);
//     });
// }

// function stripUserInformation(userObject) {

//     let user = userObject.response.user;
//     return {
//         firstName: user.first_name,
//         lastName: user.last_name,
//         userAvatar: user.user_avatar_hd,
//         beerCount: user.stats.total_checkins
//     };
// }