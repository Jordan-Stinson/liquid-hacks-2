import { FC, ReactElement, useEffect, useState } from "react";
import classes from "./play.module.scss";
import Image from "next/image";
import LoLIcon from "../../public/images/lol-icon.png";
import { compileFunction } from "vm";
import { IPlayerData } from "../../constants/player.interfaces";

export interface PickProps {}

const r1po = [2 / 3, 1 / 3];
const r2po = [1 / 5, 1 / 5, 2 / 5, 1 / 5];
const r3po = [4 / 16, 1 / 16, 3 / 16, 2 / 16, 2 / 16, 4 / 16];
const r4po = [5 / 25, 7 / 25, 4 / 25, 8 / 25, 1 / 25];
const r5po = [44 / 100, 35 / 100, 20 / 100, 1 / 100];

const PlayComponent: FC<PickProps> = ({}): ReactElement => {
  const [playersSelected, setPlayersSelected] = useState<boolean>(false);
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [roleSelect, setRoleSelect] = useState<number>(0);
  const [teamPlayers, addTeamPlayers] = useState<IPlayerData[]>([]);
  const [enemyPlayers, setEnemyPlayers] = useState<IPlayerData[]>([]);
  const [gameStage, setGameStage] = useState<number>(0);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [gamePoints, setGamePoints] = useState(0);

  useEffect(() => {
    const background = document.querySelector(
      "div[data-roles]"
    ) as unknown as HTMLDivElement;
    if (playersSelected) {
      background.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
    }
  }, [playersSelected]);

  useEffect(() => {
    const background = document.querySelector(
      "div[data-rift]"
    ) as unknown as HTMLDivElement;
    if (gameFinished) {
      background.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
    }
  }, [gameFinished]);

  async function addToTopText(text: string) {
    let i = 0;
    let speed = 100;
    const words = document.querySelector(
      "div[data-top-text]"
    ) as unknown as HTMLDivElement;
    async function callbackFunction() {
      if (i != text.length) {
        words.innerHTML += text[i++];
        setTimeout(callbackFunction, speed);
      }
    }
    callbackFunction();
  }

  const createEnemyTeam = (): void => {
    let ep = [];
    while (ep.length != 1) {
      let newPlayer: IPlayerData = getPlayerFromAPI("JG");
      let dupe = false;

      if (teamPlayers[0].player == newPlayer.player) dupe = true;

      if (!dupe) ep.push(newPlayer);
    }
    while (ep.length != 2) {
      let newPlayer: IPlayerData = getPlayerFromAPI("TOP");
      let dupe = false;

      if (teamPlayers[1].player == newPlayer.player) dupe = true;

      if (!dupe) ep.push(newPlayer);
    }
    while (ep.length != 3) {
      let newPlayer: IPlayerData = getPlayerFromAPI("MID");
      let dupe = false;

      if (teamPlayers[2].player == newPlayer.player) dupe = true;

      if (!dupe) ep.push(newPlayer);
    }
    while (ep.length != 4) {
      let newPlayer: IPlayerData = getPlayerFromAPI("ADC");
      let dupe = false;

      if (teamPlayers[3].player == newPlayer.player) dupe = true;

      if (!dupe) ep.push(newPlayer);
    }
    while (ep.length != 5) {
      let newPlayer: IPlayerData = getPlayerFromAPI("SUP");
      let dupe = false;

      if (teamPlayers[4].player == newPlayer.player) dupe = true;

      if (!dupe) ep.push(newPlayer);
    }
    setEnemyPlayers(ep);
  };

  async function removeTopText() {
    const words = document.querySelector(
      "div[data-top-text]"
    ) as unknown as HTMLDivElement;

    let speed = 75;
    if (words.innerHTML.length) {
      words.innerHTML = words.innerHTML.slice(0, -1);
      setTimeout(removeTopText, speed);
    }
  }
  const start = (callback: (word: string) => void): void => {
    setTimeout(() => {
      addToTopText("Welcome to League of Legends: Ultimate Team!");
      setTimeout(() => {
        addToTopText(` It's time to build your team.`);
        setTimeout(() => {
          removeTopText();
          setTimeout(() => {
            addToTopText(
              `Choose one player for each role from the following 5 players`
            );
            setTimeout(() => {
              setRoleSelect(roleSelect + 1);
            }, 6500);
          }, 6000);
        }, 6000);
      }, 5500);
    }, 1000);
  };

  async function customMask2(opacity: number) {
    const background = document.querySelector(
      "div[data-mask]"
    ) as unknown as HTMLDivElement;

    if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 0) {
      background.style.background = `linear-gradient(rgba(0, 0, 0, ${
        opacity - 0.05
      }), rgba(0, 0, 0, ${opacity - 0.05}))`;
      setTimeout(() => customMask2(opacity - 0.05), 50);
    }
  }

  async function customMask1(opacity: number) {
    const background = document.querySelector(
      "div[data-mask]"
    ) as unknown as HTMLDivElement;
    if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 1) {
      background.style.background = `linear-gradient(rgba(0, 0, 0, ${
        opacity + 0.05
      }), rgba(0, 0, 0, ${opacity + 0.05}))`;
      setTimeout(() => customMask1(opacity + 0.05), 50);
    } else {
      const oldBackground = document.querySelector(
        "div[data-roles]"
      ) as unknown as HTMLDivElement;
      oldBackground.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
      const teamPlayerCards = document.querySelectorAll(
        "div[data-player-card]"
      );
      //move player cards
      setTimeout(() => customMask2(1), 1000);
    }
  }

  const startGame = (callback: (word: string) => void): void => {
    setTimeout(() => {
      removeTopText();
      setTimeout(() => {
        customMask1(0);
        setTimeout(() => {
          addToTopText(`The A.I. has chosen the following team`);
          setTimeout(() => {
            createEnemyTeam();
            setTimeout(() => {
              addToTopText(` The game will now start. Best of luck!`);
              setTimeout(() => {
                removeTopText();
                setGameStage(1);
              }, 6500);
            }, 6000);
          }, 6000);
        }, 4000);
      }, 8000);
    }, 0);
  };

  const handle1v1 = (stage: number): void => {
    const roleTo1v1 = Math.floor(Math.random() * 5);
    const players: IPlayerData[] = [
      teamPlayers[roleTo1v1],
      enemyPlayers[roleTo1v1],
    ];
    //player1 and player2 come face to face. both are level {5*(stage-1) + 1-5} and trade autos, before {either player} decides
    //to start engaging. {if you are the one engaging, do you continue to engage} {if they engaged, do you take the fight or leave}
    //you win the fight if you roll a higher number, you lose if they roll a higher number, no one wins if you choose to disengage
  };

  const handle2v2 = (stage: number): void => {
    const rolesTo2v2 = [Math.floor(Math.random() * 5)];

    const players: IPlayerData[][] = [
      [teamPlayers[rolesTo2v2[0]], teamPlayers[rolesTo2v2[1]]],
      [enemyPlayers[rolesTo2v2[0]], enemyPlayers[rolesTo2v2[1]]],
    ];
    //player1 and player2 on your team are teaming up when they run into enemy1 and enemy2. player1 and enemy1 are level {5*(stage-1) + 1-5 1-5} and player2 and enemy 2 are leve X.
    // after trading abilities and using a health potion,  {either player} calls out to their teammate that this is the best chance they will get for a double kill
    // should your team go all in to try and get the kills? optional fight
  };

  const handle5v5 = (): void => {
    // {all players meet mid} {one team heads towards baron and gets surrounded} {one team starts drake but then other team appears}.
    // your team calls out that they are ready to fight now, but you have to decide whether its worth the risk. you know that if you lose the teamfight,
    //it will be hard to comeback, but not taking the teamfight means the other team will likely get an objective
    // optional fight
  };

  const handleTopGank = (): void => {
    const rolesTo2v2 = [Math.floor(Math.random() * 5)];
    const isEnemyGank = [Math.floor(Math.random() * 2)];

    while (rolesTo2v2.length != 2) {
      let temp = Math.floor(Math.random() * 5);
      if (temp != rolesTo2v2[0]) rolesTo2v2.push(temp);
    }
    const players: IPlayerData[] = isEnemyGank
      ? [teamPlayers[1], enemyPlayers[1], enemyPlayers[0]]
      : [teamPlayers[1], enemyPlayers[1], teamPlayers[0]];

    // {if your gank} you notice your jungler has been warding his way up through the river, and is now close enough for a gank
    // do you tell him to try and pinsir attack the other top laner from behind, or join you up front for a full assault
    // you gain points if you kill, enemy cant get points
    // {if enemy gank} your teammate pings the map, letting you know the enemy jungler is missing. do you continue to push the wave
    // or do you play it safe.
    //enemy can get points if you die,
  };

  const handleRiftHerald = (): void => {
    /* top+mid of either team goes to fight it
    no interaction. just calc and display which team gets it
    */
  };
  const handleBotGank = (): void => {
    // {if your gank} you notice your jungler has been warding his way down through the river, and is now close enough for a gank
    // do you tell him to try and pinsir attack the bottom laner from behind, or do you lure the enemy up towards the river
    // you gain points if you kill, enemy cant get points
    // {if enemy gank} your teammate pings the map, letting you know the enemy jungler is missing. do you continue to push the wave
    // or do you play it safe.
    //enemy can get points if you die,
  };

  const handleDrake = (): void => {
    /* if enemy team is doing it, you have choice to flash in with jungler to try and steal
    can eitehr steal, fail steal and live, or die, which is win, small loss, or big loss
    if your team is doing it, choice of whether to back for items (small point gain) or look for fights (can trigger any xvx fight)
    */
  };
  const handleSoulDrake = (): void => {
    /* if enemy team is doing it, you have choice to flash in with jungler to try and steal
    can eitehr steal, fail steal and live, or die, which is win, small loss, or big loss
    if your team is doing it, choice of whether to back for items (small point gain) or look for fights (can trigger any xvx fight)
    */
  };

  const handleElderDrake = (): void => {
    /* if enemy team is doing it, you have choice to flash in with jungler to try and steal
    can eitehr steal, fail steal and live, or die, which is win, small loss, or big loss
    if your team is doing it, choice of whether to go destroy the enemy's turrets or look for fights (can trigger any xvx fight)
    */
  };

  const handleBackdoor = (): void => {
    /* one of the players on your team notices the chance for a backdoor play. 
      very risky, but you could win the game off of it, regardless of points difference*/
  };

  const handleBaron = (): void => {
    /*if you are doing baron, do you continue to do it, and then after do you look for fights or try to destroy turrets
      if enemy doing baren, do you try and push them off, steal baron, or leave*/
  };

  const handleEvents = (stage: number, events: number[]): void => {
    if (stage == 1) {
      while (events.length) {
        if (events[0] == 1) {
          events.pop();
          handle1v1(stage);
        } else {
          events.pop();
          handle2v2(stage);
        }
      }
    }
    if (stage == 2) {
      while (events.length) {
        if (events[0] == 1) {
          events.pop();
          handle1v1(stage);
        } else if (events[0] == 2) {
          events.pop();
          handle2v2(stage);
        } else if (events[0] == 3) {
          events.pop();
          handleTopGank();
        } else if (events[0] == 4) {
          events.pop();
          handleRiftHerald();
        }
      }
    }
    if (stage == 3) {
      while (events.length) {
        if (events[0] == 1) {
          events.pop();
          handle2v2(stage);
        } else if (events[0] == 2) {
          events.pop();
          handle5v5();
        } else if (events[0] == 3) {
          events.pop();
          handleTopGank();
        } else if (events[0] == 4) {
          events.pop();
          handleBotGank();
        } else if (events[0] == 5) {
          events.pop();
          handleDrake();
        } else if (events[0] == 6) {
          events.pop();
          handleRiftHerald();
        }
      }
    }
    if (stage == 4) {
      while (events.length) {
        if (events[0] == 1) {
          events.pop();
          handle2v2(stage);
        } else if (events[0] == 2) {
          events.pop();
          handle5v5();
        } else if (events[0] == 3) {
          events.pop();
          handleBaron();
        } else if (events[0] == 4) {
          events.pop();
          handleSoulDrake();
        } else if (events[0] == 5) {
          events.pop();
          handleBotGank();
        }
      }
    }
    if (stage == 5) {
      while (events.length) {
        if (events[0] == 1) {
          events.pop();
          handle5v5();
        } else if (events[0] == 2) {
          events.pop();
          handleBaron();
        } else if (events[0] == 3) {
          events.pop();
          handleElderDrake();
        } else if (events[0] == 4) {
          events.pop();
          handleBackdoor();
        }
      }
    }
  };

  useEffect(() => {
    if (gameStage == 1) {
      const numOfEvents = Math.floor(Math.random() * (3 - 0) + 0);
      const eventArray = [];
      for (let i = 0; i < r1po.length; i++) {
        let odd = r1po[i] * 100;
        for (let j = 0; j < odd; j++) {
          eventArray.push(i + 1);
        }
      }
      let events = [];
      while (events.length != numOfEvents) {
        events.push(eventArray[Math.floor(Math.random() * eventArray.length)]);
      }
      setGamePoints(gamePoints + numOfEvents);
      handleEvents(1, events);
    } else if (gameStage == 2) {
      const numOfEvents = Math.floor(Math.random() * (3 - 1) + 1);
      const eventArray = [];
      for (let i = 0; i < r2po.length; i++) {
        let odd = r2po[i] * 100;
        for (let j = 0; j < odd; j++) {
          eventArray.push(i + 1);
        }
      }
      let events = [];
      while (events.length != numOfEvents) {
        events.push(eventArray[Math.floor(Math.random() * eventArray.length)]);
      }
      setGamePoints(gamePoints + numOfEvents * 2);
      handleEvents(2, events);
    } else if (gameStage == 3) {
      const numOfEvents = Math.floor(Math.random() * (4 - 1) + 1);
      const eventArray = [];
      for (let i = 0; i < r3po.length; i++) {
        let odd = r3po[i] * 100;
        for (let j = 0; j < odd; j++) {
          eventArray.push(i + 1);
        }
      }
      let events = [];
      while (events.length != numOfEvents) {
        events.push(eventArray[Math.floor(Math.random() * eventArray.length)]);
      }
      setGamePoints(gamePoints + numOfEvents * 3);
      handleEvents(3, events);
    } else if (gameStage == 4) {
      const numOfEvents = Math.floor(Math.random() * (4 - 2) + 2);
      const eventArray = [];
      for (let i = 0; i < r4po.length; i++) {
        let odd = r4po[i] * 100;
        for (let j = 0; j < odd; j++) {
          eventArray.push(i + 1);
        }
      }
      let events = [];
      while (events.length != numOfEvents) {
        events.push(eventArray[Math.floor(Math.random() * eventArray.length)]);
      }
      setGamePoints(gamePoints + numOfEvents * 4);
      handleEvents(4, events);
    } else if (gameStage == 5) {
      const numOfEvents = 3;
      const eventArray = [];
      for (let i = 0; i < r5po.length; i++) {
        let odd = r5po[i] * 100;
        for (let j = 0; j < odd; j++) {
          eventArray.push(i + 1);
        }
      }
      let events = [];
      while (events.length != numOfEvents) {
        events.push(eventArray[Math.floor(Math.random() * eventArray.length)]);
      }
      setGamePoints(gamePoints + numOfEvents * 5);
      handleEvents(5, events);
    }
  }, [gameStage]);

  const roleSelector = (role: number): ReactElement => {
    if (!role) return <></>;
    let players: IPlayerData[] = [];

    if (role == 1) {
      while (players.length != 5) {
        let newPlayer: IPlayerData = getPlayerFromAPI("JG");
        let dupe = false;
        for (let i = 0; i < players.length; i++) {
          if (players[i].player == newPlayer.player) dupe = true;
        }
        if (!dupe) players.push(newPlayer);
      }
    } else if (role == 2) {
      while (players.length != 5) {
        let newPlayer: IPlayerData = getPlayerFromAPI("TOP");
        let dupe = false;
        for (let i = 0; i < players.length; i++) {
          if (players[i].player == newPlayer.player) dupe = true;
        }
        if (!dupe) players.push(newPlayer);
      }
    } else if (role == 3) {
      while (players.length != 5) {
        let newPlayer: IPlayerData = getPlayerFromAPI("MID");
        let dupe = false;
        for (let i = 0; i < players.length; i++) {
          if (players[i].player == newPlayer.player) dupe = true;
        }
        if (!dupe) players.push(newPlayer);
      }
    } else if (role == 4) {
      while (players.length != 5) {
        let newPlayer: IPlayerData = getPlayerFromAPI("ADC");
        let dupe = false;
        for (let i = 0; i < players.length; i++) {
          if (players[i].player == newPlayer.player) dupe = true;
        }
        if (!dupe) players.push(newPlayer);
      }
    } else if (role == 5) {
      while (players.length != 5) {
        let newPlayer: IPlayerData = getPlayerFromAPI("SUP");
        let dupe = false;
        for (let i = 0; i < players.length; i++) {
          if (players[i].player == newPlayer.player) dupe = true;
        }
        if (!dupe) players.push(newPlayer);
      }
    } else {
      return <></>;
    }
    return (
      <div className={classes.fivePlayerContainer}>
        {players.map((player: IPlayerData, index: number) => {
          return (
            <div className={classes.playerCard} data-player-card>
              <button
                onClick={() => {
                  let existingPlayers = [...teamPlayers];
                  existingPlayers.push(player);
                  addTeamPlayers(existingPlayers);
                  setRoleSelect(roleSelect + 1);
                }}
                disabled={teamPlayers.length > index}
              >
                <Image
                  src={`../../public/images/playerCards/${player.player}`}
                  width={500}
                  height={300}
                  layout={"fixed"}
                />
              </button>
            </div>
          );
        })}
      </div>
    );
  };

  useEffect(() => {
    // start((text) => console.log(text));
    startGame((text) => console.log(text));
  }, []);

  useEffect(() => {
    if (roleSelect == 6) {
      startGame((text) => console.log(text));
    }
  }, [roleSelect]);
  return (
    <div className={classes.container} data-win>
      <div className={classes.container2} data-loss>
        <div className={classes.container3} data-rift>
          <div className={classes.container4} data-roles>
            <div className={classes.mask} data-mask>
              <div className={classes.topText} data-top-text>
                Choose one player for each role from the following 5 players
              </div>

              <div className={classes.roleSelect}>
                {roleSelector(roleSelect)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayComponent;