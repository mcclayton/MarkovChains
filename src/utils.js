import fs from 'fs';
import _ from 'lodash';
import { SPECIAL_DELIMITERS } from './constants';

const readFile = (filePath) => {
    return new Promise(function (fulfill, reject) {
        fs.readFile(filePath, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                fulfill(data);
            }
        });
    });
};

/**
 * Given a markov chain, will return a random start of a sentence.
 */
const getRandomSentenceStart = (markovChain) => {
    const startingKeys = _.filter(_.keys(markovChain), (k) => k.startsWith(SPECIAL_DELIMITERS.startWord));
    const randomIndex = randomIntFromInterval(0, startingKeys.length - 1);
    return startingKeys[randomIndex];
};

/**
 * Takes the serialized current window, removes the first entry in the window
 * and slides the nextWord onto the end of the window.
 */
const slideCurrentWindow = (currWordWindowString = '', nextWord) => {
    // Parse window string into array
    const currWindowArray = currWordWindowString.split(SPECIAL_DELIMITERS.delimiter);
    // Remove first entry of window
    currWindowArray.shift();
    // Add new word to end of window
    currWindowArray.push(nextWord);
    // Re-serialize
    return currWindowArray.join(SPECIAL_DELIMITERS.delimiter);
};

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export default {
    readFile,
    randomIntFromInterval,
    getRandomSentenceStart,
    slideCurrentWindow
};
