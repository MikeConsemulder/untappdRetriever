const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Retriever = require("./assets/classes/Retriever");
const basicAuth = require('express-basic-auth');
const User = require('./assets/classes/User');
const Checkins = require('./assets/classes/Checkins');
let RequestHandler = require("./assets/classes/RequestHandler");
const fs = require('fs');
let retriever;
require('dotenv').config();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//set header.. not sure if smart :)
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "POST,GET,PUT,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Lang");
    next();
});

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

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to my api! Now go away' });
});

router.route('/getbeers').get(function (req, res) {

    //get the parameters from the request
    let parameters = req.query;
    let access_token = parameters.access_token;
    //check if there is a access token provided
    if (typeof access_token === 'undefined') {

        res.json({ message: 'no access token provided' });
        return;
    }

    retriever = new Retriever(access_token);
    getAllInformation(res);
});

router.route('/authenticateUser').get(function (req, res) {

    if (req.headers.hasOwnProperty('code')) {

        let code = req.headers.code;
        getToken(code).then(TokenObject => {

            //send the token back
            if (typeof TokenObject.response.access_token != 'undefined') {

                res.json({ token: TokenObject.response.access_token });
            } else {
                res.json({ message: TokenObject });
            }
        });
    } else {

        res.json({ message: 'no code provided' });
    }
});

function getAllInformation(res) {

    let dataToSend = {};
    //first, get the user information
    const user = new User(retriever);
    user.getUserInformation().then(userInfo => {

        //save the user information
        dataToSend.userInformation = userInfo;
        //second, get the beer information
        getCheckinInfo(userInfo.beerCount).then(beerInfo => {

            //save the beerinformation
            dataToSend.beerInfo = beerInfo;
            //send the beerinformation to the client
            sendDataToClient(res, dataToSend);
        });
    });
}

function getCheckinInfo(beerCount) {

    const checkins = new Checkins(retriever, beerCount);
    return checkins.getBeerInformation().then(beerInfo => {

        return beerInfo;
    });
}

function sendDataToClient(res, dataToSend) {
    let username = dataToSend.userInformation.firstName;
    //send data back to via api
    res.json({
        message: `${username}'s information`,
        data: dataToSend
    });
}

function getToken(code) {

    const url = constructUrl(code);

    const urlObject = {
        method: 'GET',
        url: url
    }
    const requestHandler = new RequestHandler(urlObject);
    return requestHandler.doRequest().then(returnValues => {

        return returnValues;
    })
}

function constructUrl(code) {

    const clientId = process.env.UNTAPPD_CLIENT_ID;
    const clientSecret = process.env.UNTAPPD_CLIENT_SECRET;
    let url = 'https://untappd.com/oauth/authorize/?';
    url += `client_id=${clientId}`;
    url += `&client_secret=${clientSecret}`;
    url += '&response_type=code';
    url += '&redirect_url=http://untappd.kingmike.nl/visualize';
    url += `&code=${code}`;
    return url;
}