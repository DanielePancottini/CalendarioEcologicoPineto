const express = require('express');
const Alexa = require('alexa-app');

const PORT = process.env.PORT || 8080;
const app = express();

const alexaApp = new Alexa.app("test");

alexaApp.express({
    expressApp: app,
    checkCert: false,
    debug: true
});

app.set("view engine", "ejs");

alexaApp.launch((req, res) => {
    res.say("Application Started...");
});

alexaApp.intent("MainIntent",  (req, res) => {
    res.say("Welcome to main intent");
});

app.listen(PORT, () => {
    console.log("Express Server is Running...");
})