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

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export default {
    readFile,
    randomIntFromInterval,
    getRandomSentenceStart
};
