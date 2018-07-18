const express = require('express');
const app = express();
const util = require('util')
const Retriever = require("./assets/classes/Retriever");
const retriever = new Retriever('onbijtkoek');


app.get('/', (req, res) => res.send('Hello World!'))

app.listen(3000, () => console.log('Example app listening on port 3000!'))

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