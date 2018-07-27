const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const Retriever = require("./assets/classes/Retriever");
const basicAuth = require('express-basic-auth');
const User = require('./assets/classes/User');
const Checkins = require('./assets/classes/Checkins');
const fs = require('fs');
let retriever;
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

router.get('/', function (req, res) {
    res.json({ message: 'hooray! welcome to my api! Now go away' });
});

router.route('/getbeers').get(function (req, res) {

    let parameters = req.query;
    let username = parameters.username;
    retriever = new Retriever(username);

    if (typeof username === 'undefined') {

        res.json({ message: 'no username defined' });
        return;
    }

    getAllInformation(username, res);
});

function getAllInformation(username, res) {

    let dataToSend = {};
    const user = new User(retriever);
    user.getUserInformation().then(userInfo => {

        dataToSend.userInformation = userInfo;
        getCheckinInfo(userInfo.beerCount);
    });
}

function getCheckinInfo(beerCount) {

    const checkins = new Checkins(retriever, beerCount);
    checkins.getBeerInformation().then(beerInfo => {

        beerInfo;
    });
}

function saveToFile(obj) {

    const content = JSON.stringify(obj);

    fs.writeFile("beers2.json", content, 'utf8', function (err) {
        if (err) {
            return console.log(err);
        }

        console.log("The file was saved!");
    });
}

function sendDataToClient(res, dataToSend, username) {

    //send data back to via api
    res.json({
        message: `${username}'s information`,
        data: dataToSend
    });
}