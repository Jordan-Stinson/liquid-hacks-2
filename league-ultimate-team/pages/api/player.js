import { Console } from "console";
import fs from "fs";

const mainDataset = require('../../public/data/mainDataset.json') // Requiring a JSON file reads and parses it. Good for static files that don't change.

function getRandomPlayer(sizeOfArr) {
    return Math.floor(Math.random() * sizeOfArr)
}

export default function getPlayerFromRole (req, res) {
    let top = []
    let jg = []
    let mid = []
    let adc = []
    let sup = []
    mainDataset.forEach(data => {
        switch(data['Position']) {
            case 'TOP':
                top.push(data);
                break;
            case 'JG':
                jg.push(data);
                break;
            case 'MID':
                mid.push(data);
                break;
            case 'ADC':
                adc.push(data);
                break;
            case 'SUP':
                sup.push(data);
        }
    });
    var player = -1;
    if (req.method === 'GET') {
        switch(req.body.role) {
            case 'TOP':
                player = getRandomPlayer(top.length);
                res.statusCode = 200;
                res.json(top[player])
                break;
            case 'JG':
                player = getRandomPlayer(jg.length);
                res.statusCode = 200;
                res.json(jg[player]);
                break;
            case 'MID':
                player = getRandomPlayer(mid.length);
                res.statusCode = 200;
                res.json(mid[player]);
                break;
            case 'ADC':
                player = getRandomPlayer(adc.length);
                res.statusCode = 200;
                res.json(adc[player]);
                break;
            case 'SUP':
                player = getRandomPlayer(sup.length);
                res.statusCode = 200;
                res.json(sup[player]);
                break;
        }
    }
};