import fs from 'fs';

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

const randomIntFromInterval = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

export default {
    readFile,
    randomIntFromInterval
};
