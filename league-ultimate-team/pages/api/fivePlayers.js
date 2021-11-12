const mainDataset = require("../../public/data/mainDataset.json"); // Requiring a JSON file reads and parses it. Good for static files that don't change.

function getFiveRandomPlayers(sizeOfArr) {
    visited = new Set();
    for (let i=0; i < 5; i++) {
        let idx = Math.floor(Math.random() * sizeOfArr);
        while (visited.has(idx)) {
            idx = Math.floor(Math.random() * sizeOfArr);
        }
        visited.add(idx);
    }
    return visited;
}

export default function getPlayerFromRole(req, res) {
  let top = [];
  let jg = [];
  let mid = [];
  let adc = [];
  let sup = [];
  mainDataset.forEach((data) => {
    switch (data["Position"]) {
      case "TOP":
        top.push(data);
        break;
      case "JG":
        jg.push(data);
        break;
      case "MID":
        mid.push(data);
        break;
      case "ADC":
        adc.push(data);
        break;
      case "SUP":
        sup.push(data);
    }
  });
  let players = [];
  let indices = [];
  if (req.method === "POST") {
    switch (req.body.role) {
      case "TOP":
        indices = Array.from(getFiveRandomPlayers(top.length));
        indices.forEach(idx => {
            players.add(top[idx]);
        });
        res.statusCode = 200;
        res.json(players);
        break;
      case "JG":
        indices = Array.from(getFiveRandomPlayers(jg.length));
        indices.forEach(idx => {
            players.add(jg[idx]);
        });
        res.statusCode = 200;
        res.json(players);
        break;
      case "MID":
        indices = Array.from(getFiveRandomPlayers(mid.length));
        indices.forEach(idx => {
            players.add(mid[idx]);
        });
        res.statusCode = 200;
        res.json(players);
        break;
      case "ADC":
        indices = Array.from(getFiveRandomPlayers(adc.length));
        indices.forEach(idx => {
            players.add(adc[idx]);
        });
        res.statusCode = 200;
        res.json(players);
        break;
      case "SUP":
        indices = Array.from(getFiveRandomPlayers(sup.length));
        indices.forEach(idx => {
            players.add(sup[idx]);
        });
        res.statusCode = 200;
        res.json(players);
    }
  }
}
