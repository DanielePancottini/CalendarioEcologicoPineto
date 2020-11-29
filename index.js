const express = require('express');
const { ExpressAdapter } = require('ask-sdk-express-adapter');
const Alexa = require('ask-sdk-core');
const data = require("./assets/calendar.json");
const fs = require("fs");

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
            .withSimpleCard('Calendario Ecologico Pineto', speechText)
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

        var toThrow = data.days[dayOfRequest].toThrow;

        console.log(toThrow);
        

        var speechText = (toThrow.length > 0) ? "Ecco cosa c'è da buttare oggi: " : "Oggi non c'è nulla da buttare";

        toThrow.forEach((element, index) => {
            speechText += element;
            speechText += ((index == toThrow.length - 1) ? "" : ", ")
        });

        return handlerInput.responseBuilder
            .speak(speechText)
            .reprompt(speechText)
            .withSimpleCard('Calendario Ecologico Pineto', speechText)
            .getResponse();
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Chiedi ad Alexa cosa devi buttare oggi, e lei ti risponderà';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
                || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'A presto, dal Calendario Ecologico Pineto!';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};

/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest'
            && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Ops, non riesco a capire la tua richiesta, riprova';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};

/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = "Ops, ci sono dei problemi nell'eseguire la tua richiesta, riprova";
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

skillBuilder.addRequestHandlers(
    LaunchRequestHandler,
    MainRequestHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    HelpIntentHandler,
    SessionEndedRequestHandler
);

const skill = skillBuilder.create();

const adapter = new ExpressAdapter(skill, false, false);

app.post('/', adapter.getRequestHandlers());

app.listen(PORT, () => {
    console.log("Server is Running...");
});