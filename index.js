'use strict';

const Alexa = require('ask-sdk');

// 起動時に呼ばれる
const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
    },
    handle(handlerInput) {
        const date = new Date;
        const year = date.getFullYear();
        const month = date.getMonth() + 1;
        const day = date.getDate();
        const now = new Date(`${year}/${month}/${day}`);
        const omisoka = new Date(`${year}/12/31`);
        const msDiff = omisoka.getTime() - now.getTime();
        // 求めた差分（ミリ秒）を日付へ変換します（経過ミリ秒÷(1000ミリ秒×60秒×60分×24時間)。端数切り捨て）
        const daysDiff = Math.floor(msDiff / (1000 * 60 * 60 * 24));
        const speechText = `大晦日カウントダウンへようこそ！大晦日まであと${daysDiff}日です！`;

        return handlerInput.responseBuilder
            .speak(speechText)
            .getResponse();
    }
};

// 終了時に呼ばれる
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        return handlerInput.responseBuilder.getResponse();
    }
};

const EndHandler = {
    canHandle(handlerInput) {
        console.log(JSON.stringify(handlerInput));
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent' ||
                handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent');
    },
    handle(handlerInput) {
        const speechText = '終了します';

        return handlerInput.responseBuilder
            .speak(speechText) /* repromptが無いので会話は終了する */
            .getResponse();
    }
};

const HelpHandler = {
    canHandle(handlerInput) {
        return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
            handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speechText = '起動すると大晦日までの日数を教えてくれます';
        return handlerInput.responseBuilder
            .speak(speechText) /* repromptが無いので会話は終了する */
            .reprompt(speechText)
            .getResponse();
    }
};

exports.handler = Alexa.SkillBuilders.standard()
    .addRequestHandlers(
        LaunchRequestHandler,
        EndHandler,
        HelpHandler,
        SessionEndedRequestHandler)
    .lambda();
