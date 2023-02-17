const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const { request } = require("express");
const stripe = require("stripe")('sk_test_51MaPQmAWfyUNaO7Hk5oe1dmom4CJGubuRwfX8JJCsFiYPdpuOOJfGIhb4ga5jmTQWptoIDxAhGpZE0GUPJ9dUGzj00iXNvZfhP')

const app = express();

app.use(cors({ origin: true }));
app.use(express.json());


app.get('/', (request, response) => response.status(200).send
('hello world'));

app.post('/payments/create', async (request, response) => {
    const total = request.query.total;

    console.log('Payment >>>', total)

    const paymentIntent = await stripe.paymentIntents.create({
        amount: total,  //subunits of the currency
        currency: "usd",
    });

    response.status(201).send({
        clientSecret: paymentIntent.client_secret,
    })
})

exports.api = functions.https.onRequest(app)

//http://127.0.0.1:5001/challenge-5690a/us-central1/api


//firebase emulators:start
