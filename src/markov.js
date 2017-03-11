import _ from 'lodash';
import Tokenizer from 'sentence-tokenizer';
import Utils from './utils';
import { SPECIAL_DELIMITERS } from './constants';

const generateMarkovChain = (text, windowSize = 1) => {
    const markovChain = {};
    const tokenizer = new Tokenizer();
    tokenizer.setEntry(text);
    const sentences = tokenizer.getSentences();

    // Groom the corpus by adding special delimiters for the start and end of sentences
    const groomedCorpus = _.reduce(sentences, (result, sentence) => {
        // Add special delimeters to denote start and end of each sentence
        return `${result} ${SPECIAL_DELIMITERS.startSentence} ${sentence} ${SPECIAL_DELIMITERS.endSentence}`;
    }, '');

    const words = groomedCorpus.match(/\S+/g) || [];

    // For each window of words, map the window to the word that follows it
    _.forEach(words, (word, idx) => {
        // Get the window of words based on the windowSize at the current idx
        const window = [];
        for (let i=0; (idx + i < words.length) && (i < windowSize); i++) {
            window.push(words[idx + i]);
        }

        // Join all the words in the window to use as an id
        const windowId = window.join(SPECIAL_DELIMITERS.delimiter);

        // Get the word that comes after this window or SPECIAL_DELIMITERS.noWord if none
        const nextWord = idx + windowSize < words.length - 1 ? words[idx + windowSize] : SPECIAL_DELIMITERS.noWord;

        // Map the window of words to the words that follow it
        const wordsFollowing = markovChain[windowId] || [];
        wordsFollowing.push(nextWord);
        markovChain[windowId] = wordsFollowing;
    });

    return markovChain;
};

const generateTextFromChain = (markovChain, numberOfSentences = 1) => {
    let currentWordWindow = Utils.getRandomSentenceStart(markovChain);

    // TODO: Make this cleaner
    // Get the start of the sentence
    let startOfSentence = currentWordWindow.split(SPECIAL_DELIMITERS.delimiter);
    startOfSentence.shift();    // Remove start of sentence delimiter
    let newSentence = startOfSentence.join(' ') + ' ';

    let nextWord;
    let sentenceNum = 0;
    while (sentenceNum < numberOfSentences) {
        const randomIndex = Utils.randomIntFromInterval(0, markovChain[currentWordWindow].length - 1);
        nextWord = markovChain[currentWordWindow][randomIndex];
        if (nextWord === SPECIAL_DELIMITERS.endSentence || nextWord === SPECIAL_DELIMITERS.noWord) {
            // Finished a sentence.
            sentenceNum++;
            newSentence += '\n';

            // Choose a new window at the start of a sentence to begin generation
            currentWordWindow = Utils.getRandomSentenceStart(markovChain);

            // TODO: Make this cleaner
            // If we are not finishing up the last sentence generation, then
            // add the start of the next sentence to our generation
            if (sentenceNum < numberOfSentences) {
                let startOfSentence = currentWordWindow.split(SPECIAL_DELIMITERS.delimiter);
                startOfSentence.shift();    // Remove start of sentence delimiter
                newSentence += startOfSentence.join(' ') + ' ';
            }
        } else {
            newSentence += `${nextWord} `;
            // Update the currentWordWindow
            currentWordWindow = Utils.slideCurrentWindow(currentWordWindow, nextWord);
        }
    }
    return newSentence;
};

Utils.readFile('./corpus.txt').then((data) => {
    const chain = generateMarkovChain(data, 2);
    console.log(generateTextFromChain(chain, 5));
}, (err) => {
    console.log('Error reading in corpus file.');
});
