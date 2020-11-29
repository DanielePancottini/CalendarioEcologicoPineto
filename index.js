const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const Alexa = require('ask-sdk-core');
const data = require("./assets/calendar.json");

var PORT = process.env.PORT || 5000;

const app = express();
const skillBuilder = Alexa.SkillBuilders.custom();

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const speechText = 'Benvenuto nella skill del Calendario Ecologico della città di Pineto';

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Hello World', speechText)
            .getResponse();
    }
};

const MainRequestHandler = {
    canHandle(handlerInput){
        return handlerInput.requestEnvelope.request.intent.name === "MainIntent";
    },
    handle(handlerInput){

        var dateOfRequest = new Date(handlerInput.requestEnvelope.request.timestamp);
        var dayOfRequest = dateOfRequest.getDay();
        var monthOfRequest = dateOfRequest.getMonth();

        var toThrow = data.months[monthOfRequest].days[dayOfRequest].toThrow;

        var speechText = "Ecco cosa c'è da buttare oggi: ";

        toThrow.forEach((element, index) => {
            speechText += element;
            speechText += ((index == toThrow.length - 1) ? "" : ", ")
        });

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Main Response', speechText)
            .getResponse();
    }
}

skillBuilder.addRequestHandlers(
    LaunchRequestHandler,
    MainRequestHandler
)

const skill = skillBuilder.create();

const adapter = new ExpressAdapter(skill, false, false);

app.post('/', adapter.getRequestHandlers());

app.listen(PORT, () => {
    console.log("Server is Running...");
});