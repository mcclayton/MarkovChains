'use strict';
require('babel-register')();
const _ = require('lodash');
const Tokenizer = require('sentence-tokenizer');


const fs = require('fs');

const SPECIAL_VALUES = {
    startWord: "__START__",
    endWord: "__END__",
    noWord: "__NONE__"
};

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

const generateMarkovChain = (text) => {
    const markovChain = {};
    var tokenizer = new Tokenizer();
    tokenizer.setEntry(text);
    const sentences = tokenizer.getSentences();
    //const sentences = text.match(/[^\.!\?]+[\.!\?]+/g) || [];

    sentences.forEach((sentence) => {
        sentence = `${SPECIAL_VALUES.startWord} ${sentence} ${SPECIAL_VALUES.endWord}`;
        const words = sentence.match(/\S+/g) || [];
        for (let i=0; i<words.length; i++) {
            const nextWord = i < words.length - 1 ? words[i+1] : SPECIAL_VALUES.noWord;
            const wordsFollowing = markovChain[words[i]] || [];
            wordsFollowing.push(nextWord);
            markovChain[words[i]] = wordsFollowing;
        }
    });
    return markovChain;
};

const generateTextFromChain = (markovChain, numberOfSentences) => {
    let newSentence = '';
    let currentWord = SPECIAL_VALUES.startWord;
    let nextWord;
    let sentenceNum = 0;
    while (sentenceNum < numberOfSentences) {
        const randomIndex = randomIntFromInterval(0, markovChain[currentWord].length-1);
        nextWord = markovChain[currentWord][randomIndex];
        if (nextWord === SPECIAL_VALUES.endWord || nextWord === SPECIAL_VALUES.noWord) {
            currentWord = SPECIAL_VALUES.startWord;
            newSentence += '\n';
            sentenceNum++;
        } else {
            newSentence += `${nextWord} `;
            currentWord = nextWord;
        }
    }
    return newSentence;
};

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random()*(max-min+1)+min);
};

readFile('./corpus.txt').then((data) => {
    const chain = generateMarkovChain(data);
    console.log(generateTextFromChain(chain, 5));
}, (err) => {
    console.log('Error reading in corpus file.');
});
