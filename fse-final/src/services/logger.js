const fs = require('fs')

const LOG_PATH = '../utils/log.txt'

const obj = {
    id: '1',
    temp: '25',
    humidity: '90'
}

const writeLog = () => {
    fs.appendFile(LOG_PATH, JSON.stringify(obj), (err) => {
        if(err) return console.error(err)
        console.log('objeto salvo em log');
    })
    fs.appendFile(LOG_PATH, '\n', (err) => {if(err) return console.error(err)})
}

writeLog()