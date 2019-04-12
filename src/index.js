import express from 'express';
import dotenv from 'dotenv';
import { Checkins } from './domain/Checkins';
dotenv.config();

const accessToken = process.env.ACCESS_TOKEN;
const app = express();
const port = 3000;

app.listen(port, () => {

    console.log(`server started on port ${port}!`)
})

app.get('/getuntappdinformation', async (req, res) => {

    const totalAmountOfBeer = 1;
    const checkins = new Checkins(accessToken, totalAmountOfBeer);
    const checkinData = await checkins.getBeerInformation();
    res.json({ data: checkinData });
})