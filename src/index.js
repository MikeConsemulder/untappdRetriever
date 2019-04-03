import express from 'express';
import Retriever from './components/retriever';

const app = express();
const port = 3000;

const retriever = new Retriever();
const untappdData = retriever.get();

app.listen(port, () => {

    console.log(`server started on port ${port}!`)
})

app.get('/getuntappdinformation', (req, res) => {

    res.json({ data: untappdData });
})

