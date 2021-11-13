import { FC, ReactElement, useEffect, useState } from "react";
import classes from "./play.module.scss";
import Image from "next/image";
import LoLIcon from "../../public/images/lol-icon.png";
import { compileFunction } from "vm";
import { IPlayerData } from "../../constants/player.interfaces";
import { useRouter } from "next/router";
import { callbackify } from "util";
import getPlayerFromRole from "../../pages/api/player";
import useSWR from "swr";
import { getRedirectStatus } from "next/dist/lib/load-custom-routes";

export interface PickProps {}

const r1po = [2 / 3, 1 / 3];
const r2po = [1 / 5, 1 / 5, 2 / 5, 1 / 5];
const r3po = [4 / 16, 1 / 16, 3 / 16, 2 / 16, 2 / 16, 4 / 16];
const r4po = [5 / 25, 7 / 25, 4 / 25, 8 / 25, 1 / 25];
const r5po = [44 / 100, 35 / 100, 20 / 100, 1 / 100];

async function postData(url = "", data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: "POST", // *GET, POST, PUT, DELETE, etc.
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json",
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}

const PlayComponent: FC<PickProps> = ({}): ReactElement => {
  const router = useRouter();
  const [gameFinished, setGameFinished] = useState<boolean>(false);
  const [roleSelect, setRoleSelect] = useState<number>(0);
  const [teamPlayers, addTeamPlayers] = useState<IPlayerData[]>([]);
  const [enemyPlayers, setEnemyPlayers] = useState<IPlayerData[]>([]);
  const [gameStage, setGameStage] = useState<number>(0);
  const [playerPoints, setPlayerPoints] = useState(0);
  const [enemyPoints, setEnemyPoints] = useState(0);
  const [showButtons, setShowButtons] = useState<string[]>([]);
  const [eventPlayers, setEventPlayers] = useState<IPlayerData[][]>([]);
  const [gameChoice, setGameChoice] = useState<number>(-1);
  const [eventNumber, setEventNumber] = useState<number>(-1);
  const [isEnemyEvent, setIsEnemyEvent] = useState<boolean>(false);
  const [players, setPlayers] = useState<IPlayerData[]>([]);

  async function addToTopText(text: string) {
    let i = 0;
    let speed = 40;
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

  async function removeTopText() {
    const words = document.querySelector(
      "div[data-top-text]"
    ) as unknown as HTMLDivElement;

    let speed = 10;
    if (words && words.innerHTML.length) {
      words.innerHTML = words.innerHTML.slice(0, -1);
      setTimeout(removeTopText, speed);
    }
  }

  const removeAllText = () => {
    const words = document.querySelector(
      "div[data-top-text]"
    ) as unknown as HTMLDivElement;
    words.innerHTML = "";
  };

  async function playerSelect2() {
    async function callbackFunction() {
      const players: IPlayerData[] = [];
      postData("/api/player", { role: "TOP" }).then((data) => {
        players[0] = data;
      });
      postData("/api/player", { role: "JG" }).then((data) => {
        players[1] = data;
      });
      postData("/api/player", { role: "MID" }).then((data) => {
        players[2] = data;
      });
      postData("/api/player", { role: "ADC" }).then((data) => {
        players[3] = data;
      });
      postData("/api/player", { role: "SUP" }).then((data) => {
        players[4] = data;
      });
      setEnemyPlayers(players);
    }
    callbackFunction();
  }

  const createEnemyTeam = async () => {
    playerSelect2();
  };

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
            }, 3000);
          }, 3000);
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
          createEnemyTeam();

          setTimeout(() => {
            addToTopText(`The A.I. is currently choosing their team.`);
            setTimeout(() => {
              addToTopText(` The game will now start. Best of luck!`);
              setTimeout(() => {
                removeAllText();
                setGameStage(1);
              }, 6500);
            }, 4000);
          }, 3000);
        }, 4000);
      }, 3000);
    }, 0);
  };

  const handle1v1 = (stage: number): void => {
    setEventNumber(1);
    setIsEnemyEvent(!!Math.floor(Math.random() * 2));
    const roleTo1v1 = Math.floor(Math.random() * 5);
    const players: IPlayerData[] = [
      teamPlayers[roleTo1v1],
      enemyPlayers[roleTo1v1],
    ];
    setEventPlayers([[players[0]], [players[1]]]);

    if (isEnemyEvent) {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Back Off", "Engage"]);
          addToTopText(`${players[0].Player} and ${
            players[1].Player
          } come face to face in a 1v1. Both champions are level ${Math.floor(
            Math.random() * 3 + stage * 2 + 1
          )} and trade auto 
          attacks. Then, ${
            players[1].Player
          } starts to engage. Do you back off, or stand your ground?`);
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    } else {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Back Off", "Engage"]);
          addToTopText(`${players[0].Player} and ${
            players[1].Player
          } come face to face in a 1v1. Both champions are level ${Math.floor(
            Math.random() * 3 + stage * 2 + 1
          )} and trade auto 
          attacks. Then, ${
            players[0].Player
          } starts to engage. Do you continue engaging?`);
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    }
    //player1 and player2 come face to face. both are level {5*(stage-1) + 1-5} and trade autos, before {either player} decides
    //to start engaging. {if you are the one engaging, do you continue to engage} {if they engaged, do you take the fight or leave}
    //you win the fight if you roll a higher number, you lose if they roll a higher number, no one wins if you choose to disengage
  };

  const handle2v2 = (stage: number): void => {
    setEventNumber(2);
    const rolesTo2v2 = [
      Math.floor(Math.random() * 2),
      Math.floor(Math.random() * 2) + 2,
    ];

    const players: IPlayerData[][] = [
      [teamPlayers[rolesTo2v2[0]], teamPlayers[rolesTo2v2[1]]],
      [enemyPlayers[rolesTo2v2[0]], enemyPlayers[rolesTo2v2[1]]],
    ];
    setEventPlayers([
      [players[0][0], players[0][1]],
      [players[1][1], players[1][1]],
    ]);

    const isEnemyEngage = [Math.floor(Math.random() * 2)];
    if (isEnemyEngage) {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Back Off", "Engage"]);
          addToTopText(
            `${players[0][0].Player} and ${
              players[0][1].Player
            } on your team are teaming up to clear vision when they run into 
            ${players[1][0].Player} and ${players[1][1].Player}. 
            Both ${players[0][0].Player} and ${players[1][0].Player} 
            are level ${Math.floor(Math.random() * 3 + stage * 2 + 1)}, 
            while ${players[0][1].Player} and ${players[1][1].Player} 
            are level ${Math.floor(Math.random() * 3 + stage * 2 + 1)}. 
            After a short trade, ${players[0][0].Player} is brought down 
            to 40% HP. However, you know that neither enemy player has any 
            summoner spells off cooldown, while both of your players have all 
            summoner spells available. Should your team play it safe and back off, 
            or try and go for the outplay?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    } else {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Back Off", "Engage"]);
          addToTopText(
            `${players[0][0].Player} and ${players[0][1].Player} 
            on your team are teaming up to clear vision when they run into 
            ${players[1][0].Player} and ${players[1][1].Player}. 
            Both ${players[0][0].Player} and ${players[1][0].Player} 
            are level ${Math.floor(Math.random() * 3 + stage * 2 + 1)}, 
            while ${players[0][1].Player} and ${players[1][1].Player} 
            are level ${Math.floor(Math.random() * 3 + stage * 2 + 1)}. 
            After landing some poke and bringing ${players[1][0].Player} down 
            to 40% HP, ${players[0][0].Player} sees the angle for a free 
            double kill and calls to engage. Should your team 
            go all in to try and secure these kills?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    }

    //player1 and player2 on your team are teaming up when they run into enemy1 and enemy2. player1 and enemy1 are level {5*(stage-1) + 1-5 1-5} and player2 and enemy 2 are leve X.
    // after trading abilities and using a health potion,  {either player} calls out to their teammate that this is the best chance they will get for a double kill
    // should your team go all in to try and get the kills? optional fight
  };

  const handle5v5 = (): void => {
    setEventNumber(3);
    setShowButtons(["Back Off", "Engage"]);
    setIsEnemyEvent(!!Math.floor(Math.random() * 2));

    const players: IPlayerData[] = [
      teamPlayers[0],
      teamPlayers[1],
      teamPlayers[2],
      teamPlayers[3],
      teamPlayers[4],
      enemyPlayers[0],
      enemyPlayers[1],
      enemyPlayers[2],
      enemyPlayers[3],
      enemyPlayers[4],
    ];
    setEventPlayers([
      [players[0], players[1], players[2], players[3], players[4]],
      [players[5], players[6], players[7], players[8], players[9]],
    ]);

    if (isEnemyEvent) {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Back off", "Engage"]);
          addToTopText(
            `Both teams are posturing around mid lane, trying to gain lane priority before
            the next objective spawns. As a result of your previous skirmishes, ${players[3].Player}
            has 1 minute left on his Flash cooldown. Suddenly, ${players[4].Player} spots a Teleport 
            channelling on a flank ward in the Wolf pit behind your team. Do you run back towards your
            mid lane tower, or engage on the enemy team before they can engage on you?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
        startEvent();
      };
    } else {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Back off", "Engage"]);
          addToTopText(
            `Both teams are posturing around mid lane, trying to gain lane priority before
            the next objective spawns. From your previous skirmishes, you know that ${players[8].Player}
            has 30 seconds left on his Flash cooldown, but ${players[4].Player} has 25 seconds left
            on his R cooldown. There are two flank wards in the enemy jungle, 
            and both ${players[0].Player} and ${players[2].Player} have Teleport available. Do you 
            set up a TP flank and force the engage? Or do you play it slow and wait for all ultimates 
            to be available?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
        startEvent();
      };
    }

    // {all players meet mid} {one team heads towards baron and gets surrounded} {one team starts drake but then other team appears}.
    // your team calls out that they are ready to fight now, but you have to decide whether its worth the risk. you know that if you lose the teamfight,
    //it will be hard to comeback, but not taking the teamfight means the other team will likely get an objective
    // optional fight
  };

  const handleTopGank = (): void => {
    setEventNumber(4);

    setIsEnemyEvent(!!Math.floor(Math.random() * 2));

    const players: IPlayerData[] = isEnemyEvent
      ? [teamPlayers[0], enemyPlayers[0], enemyPlayers[1]]
      : [
          teamPlayers[0],
          teamPlayers[1],
          enemyPlayers[0],
          enemyPlayers[1],
          enemyPlayers[2],
        ];

    if (isEnemyEvent) {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Clear the wave", "Back off"]);
          addToTopText(
            `${players[0].Player} is playing forward, trying to push out his lane
            in order to get a better reset. Suddenly, he spots ${players[2].Player}
            clearing a ward in the top river brush. Should ${players[0].Player} finish
            clearing the minion wave, or back off immediately?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
        startEvent();
      };
    } else {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Gank top lane", "Clear camps"]);
          addToTopText(
            `After some heavy trading, both ${players[0].Player} and ${players[2].Player} 
            are 30% HP. ${players[1].Player} is currently in the top river, and begins 
            pathing towards top lane. However, both ${players[3].Player} and ${players[4].Player} 
            are missing, and haven't been spotted on any wards in quite some time. Should 
            ${players[1].Player} gank top lane, or go back to clearing his camps?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
        startEvent();
      };
    }
    // {if your gank} you notice your jungler has been warding his way up through the river, and is now close enough for a gank
    // do you tell him to try and pinsir attack the other top laner from behind, or join you up front for a full assault
    // you gain points if you kill, enemy cant get points
    // {if enemy gank} your teammate pings the map, letting you know the enemy jungler is missing. do you continue to push the wave
    // or do you play it safe.
    //enemy can get points if you die,
  };

  const handleRiftHerald = (): void => {
    setEventNumber(5);
    setIsEnemyEvent(!!Math.floor(Math.random() * 2));

    const players: IPlayerData[] = [
      teamPlayers[0],
      teamPlayers[1],
      teamPlayers[2],
      teamPlayers[3],
      teamPlayers[4],
      enemyPlayers[0],
      enemyPlayers[1],
      enemyPlayers[2],
      enemyPlayers[3],
      enemyPlayers[4],
    ];
    setEventPlayers([
      [players[0]],
      [players[1]],
      [players[2]],
      [players[3]],
      [players[4]],
      [players[5]],
      [players[6]],
      [players[7]],
      [players[8]],
      [players[9]],
    ]);

    if (isEnemyEvent) {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons([
            "Look for a fight",
            "Back off and leave your players to farm",
          ]);
          addToTopText(
            `The enemy team is positioned to take down the Rift Herald! They've rotated their laners around and
            seem to be committed to this objective. In the right hands, the Rift Herald can help break down a lane.
            Will you risk handing this over to them, or face them head-on in the topside river?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    } else {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons([
            "Defend your position",
            "Leave your jungler to take the objective",
          ]);
          addToTopText(
            `The Rift Herald is an important early and mid game objective. Your team recognizes this, and through temporary
            laning priority gains, you see the opportunity to secure this objective. You start it off, and notice that the
            enemy team may be making a move to contest this! Do you commit resources to helping your jungler, or do you call
            your enemies' bluff, returning your laners to maximize their profits by collecting farm in their lanes?
            `
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
      /* top+mid of either team goes to fight it
    no interaction. just calc and display which team gets it
    */
    }
  };

  const handleBotGank = (): void => {
    setEventNumber(6);
    setIsEnemyEvent(!!Math.floor(Math.random() * 2));

    const players: IPlayerData[] = isEnemyEvent
      ? [
          teamPlayers[3],
          teamPlayers[4],
          enemyPlayers[3],
          enemyPlayers[4],
          enemyPlayers[2],
        ]
      : [
          teamPlayers[2],
          teamPlayers[3],
          teamPlayers[4],
          enemyPlayers[3],
          enemyPlayers[4],
        ];

    if (isEnemyEvent) {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Clear the wave", "Back off"]);
          addToTopText(
            `${players[0].Player} and ${players[1].Player} are playing forward, trying to
              push their lane out in order to get a better reset. Suddenly, they spot
              ${players[4].Player} clearing a ward in the bottom river brush. Should
              ${players[0].Player} and ${players[1].Player} finish clearing the minion wave,
              or back off immediately?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
        startEvent();
      };
    } else {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Gank top lane", "Clear camps"]);
          addToTopText(
            `After some heavy trading, both botlanes are 40% HP. ${players[0].Player} is currently
              in the bottom river, and begins pathing towards bot lane. However, both ${players[3].Player}
              and ${players[4].Player} are missing, and haven't been spotted on any wards in quite
              some time. Should ${players[0].Player} gank bottom lane, or go back to clearing his camps?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
        startEvent();
      };
    }
  };

  // {if your gank} you notice your jungler has been warding his way down through the river, and is now close enough for a gank
  // do you tell him to try and pinsir attack the bottom laner from behind, or do you lure the enemy up towards the river
  // you gain points if you kill, enemy cant get points
  // {if enemy gank} your teammate pings the map, letting you know the enemy jungler is missing. do you continue to push the wave
  // or do you play it safe.
  //enemy can get points if you die,

  const handleDrake = (): void => {
    setEventNumber(7);
    setIsEnemyEvent(!!Math.floor(Math.random() * 2));
    const players: IPlayerData[] = [
      teamPlayers[0],
      teamPlayers[1],
      teamPlayers[2],
      teamPlayers[3],
      teamPlayers[4],
      enemyPlayers[0],
      enemyPlayers[1],
      enemyPlayers[2],
      enemyPlayers[3],
      enemyPlayers[4],
    ];
    setEventPlayers([
      [players[0], players[1], players[2], players[3], players[4]],
      [players[5], players[6], players[7], players[8], players[9]],
    ]);
    if (isEnemyEvent) {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons([
            "Force teamfight",
            "Back off and attempt to steal drake",
          ]);
          addToTopText(
            `The enemy team has secured control of the river, and has begun
            burning down the Infernal Drake. Your team spots ${players[5].Player} on a ward
            preparing for a flank! Your decision must be quick and absolute. Do you force a 
            5v5 teamfight before the drake goes down, or send ${players[1].Player}
            to attempt a Smite steal while trying to deal with the incoming flank?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    } else {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons([
            "Attempt to burst down the dragon",
            "Force teamfight with enemy",
          ]);
          addToTopText(
            `Through superior macro play, you've gained control of the bottom-side river and started
            whittling down the elemental drake. ${players[5].Player} is clearing a minion wave in the top lane,
            but they have teleport. You burn down the drake to 2500 HP when you spot ${players[6].Player}
            waiting over the wall, posturing for a Smite steal. The rest of the enemy team appear rushing down
            the river. Do you finish off the drake, confident in ${players[1].Player}'s Smiting abilities, and look to
            disengage? Or do you play it slow and look for a teamfight instead?
            `
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    }
    /* if enemy team is doing it, you have choice to flash in with jungler to try and steal
    can either steal, fail steal and live, or die, which is win, small loss, or big loss
    if your team is doing it, choice of whether to back for items (small point gain) or look for fights (can trigger any xvx fight)
    */
  };
  const handleSoulDrake = (): void => {
    setEventNumber(8);
    setIsEnemyEvent(!!Math.floor(Math.random() * 2));
    const players: IPlayerData[] = [
      teamPlayers[0],
      teamPlayers[1],
      teamPlayers[2],
      teamPlayers[3],
      teamPlayers[4],
      enemyPlayers[0],
      enemyPlayers[1],
      enemyPlayers[2],
      enemyPlayers[3],
      enemyPlayers[4],
    ];
    setEventPlayers([
      [players[0], players[1], players[2], players[3], players[4]],
      [players[5], players[6], players[7], players[8], players[9]],
    ]);
    if (isEnemyEvent) {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons([
            "Force teamfight",
            "Back off and attempt to steal the soul drake",
          ]);
          addToTopText(
            `The enemy team has has begun taking down the Elemental soul Drake! 
            This could be disastrous if it falls into their hands. Will you rely on your team's
            cohesion in an all-out 5v5 brawl? Or will you entrust the fate of the game to ${players[1].Player}
            by attempting a Smite steal?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    } else {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons([
            "Attempt to burst down the dragon",
            "Force teamfight with enemy",
          ]);
          addToTopText(
            `You find yourselves with control over the bottom river as the Elemental soul dragon spawns!
            However, you know that the enemy team will not give this one up. Your suspicions are confirmed as
            ${eventPlayers[1][1].Player} is spotted preparing for a flash-smite steal. The rest of the enemy team show up behind
            them baring fangs. What will you do here? This decision could turn the game on its head!
            `
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    }
    /* if enemy team is doing it, you have choice to flash in with jungler to try and steal
    can eitehr steal, fail steal and live, or die, which is win, small loss, or big loss
    if your team is doing it, choice of whether to back for items (small point gain) or look for fights (can trigger any xvx fight)
    */
  };

  const handleElderDrake = (): void => {
    setEventNumber(9);
    const isEnemyElder = [Math.floor(Math.random() * 2)];
    const players: IPlayerData[] = [
      teamPlayers[0],
      teamPlayers[1],
      teamPlayers[2],
      teamPlayers[3],
      teamPlayers[4],
      enemyPlayers[0],
      enemyPlayers[1],
      enemyPlayers[2],
      enemyPlayers[3],
      enemyPlayers[4],
    ];
    setEventPlayers([
      [players[0], players[1], players[2], players[3], players[4]],
      [players[5], players[6], players[7], players[8], players[9]],
    ]);
    if (isEnemyElder) {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Force a fight", "Go for the steal"]);
          addToTopText(
            `The enemy team has secured control of the river, and has begun
            burning down the Elder Dragon. You notice that ${players[5].Player}, 
            ${players[7].Player}, and ${players[8].Player} have Stopwatches,
            so it's going to be pretty hard to win a teamfight, but it'll
            be almost impossible to win if they secure the Elder Buff. Do you force a 
            5v5 teamfight before the Elder Dragon goes down, or send ${players[1].Player}
            to attempt a Smite steal?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    } else {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Finish the Elder", "Look for a fight"]);
          addToTopText(
            `You've secured vision in the enemy jungle, and cleared all enemy wards 
            within the bottom river and Dragon pit. After spotting ${eventPlayers[1][3].Player}
            clearing minion waves in the top lane, you decide to start hitting the Elder 
            Dragon. You burn it down to 2500 HP when you spot ${eventPlayers[1][1].Player} waiting
            over the wall, posturing for a Smite steal. Do you finish off the Elder Dragon, 
            confident in ${eventPlayers[0][1].Player}'s Smiting abilities? Or do you play it slow
            and look for a teamfight instead?
            `
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    }
    /* if enemy team is doing it, you have choice to flash in with jungler to try and steal
    can either steal, fail steal and live, or die, which is win, small loss, or big loss
    if your team is doing it, choice of whether to go destroy the enemy's turrets or look for fights (can trigger any xvx fight)
    */
  };

  const handleBackdoor = (): void => {
    setEventNumber(10);
    const players: IPlayerData[] = [teamPlayers[0], teamPlayers[2]]; // Always top laner and mid laner
    setEventPlayers([[players[0]], [players[1]]]);

    const startEvent = (): void => {
      setTimeout(() => {
        setShowButtons(["Keep Scaling", "Go for the Backdoor"]);
        addToTopText(
          `All of the enemy inhibs are down, and the enemy has an open Nexus. 
          However, you lost the last teamfight pretty badly, and the enemy team 
          is poised to take both Baron Nashor and the Elder Dragon. Your team is 
          busy discussing a base defense strategy when 
          ${
            players[Math.floor(Math.random() * 2)].Player
          } notices a hidden ward 
          in the enemy base and calls for a backdoor. Both 
          ${players[0].Player} and ${players[1].Player} have Teleport available
          and respawn in 5 seconds. Do you play it safe and continue scaling, 
          or go for the backdoor win?`
        );
        setTimeout(() => {}, 8000);
      }, 2000);
    };
    startEvent();

    /* one of the players on your team notices the chance for a backdoor play. 
      very risky, but you could win the game off of it, regardless of points difference*/
  };

  const handleBaron = (): void => {
    setEventNumber(11);
    const isEnemyBaron = [Math.floor(Math.random() * 2)];
    const players: IPlayerData[] = [
      teamPlayers[0],
      teamPlayers[1],
      teamPlayers[2],
      teamPlayers[3],
      teamPlayers[4],
      enemyPlayers[0],
      enemyPlayers[1],
      enemyPlayers[2],
      enemyPlayers[3],
      enemyPlayers[4],
    ];
    setEventPlayers([
      [players[0], players[1], players[2], players[3], players[4]],
      [players[5], players[6], players[7], players[8], players[9]],
    ]);

    if (isEnemyBaron) {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Play it Safe", "Contest Baron"]);
          addToTopText(
            `You discover that the enemy team is attempting to sneak Baron, 
            and they've already gotten it down to 6000 HP. Luckily, your entire
            team is in mid lane so you can rotate quickly, but you don't see 
            ${players[9].Player} anywhere on the map and suspect they might be 
            looking for a flank. Do you contest the baron and force a teamfight,
            or play it safe and shove out mid lane instead?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    } else {
      const startEvent = (): void => {
        setTimeout(() => {
          setShowButtons(["Finish Baron", "Force a Teamfight"]);
          addToTopText(
            `Your team has started doing Baron, and has already gotten it down 
            to 4000 HP. Suddenly, a enemy TP begins to channel on a ward in the pit, 
            and you see the remaining 4 players charge towards you from the mid lane.
            Do you attempt to finish Baron as quickly as you can, or instantly turn on
            the enemy team and force a 5v4?`
          );
          setTimeout(() => {}, 8000);
        }, 2000);
      };
      startEvent();
    }
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

  const handleEndofGame = () => {
    const playerHasWon = playerPoints >= enemyPoints;
    if (playerHasWon) {
      fadeToVictory();
    } else {
      fadeToLoss();
    }
  };

  const fadeToVictory = () => {
    async function customMaskIn(opacity: number) {
      const background = document.querySelector(
        "div[data-mask]"
      ) as unknown as HTMLDivElement;
      if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 1) {
        background.style.background = `linear-gradient(rgba(0, 0, 0, ${
          opacity + 0.05
        }), rgba(0, 0, 0, ${opacity + 0.05}))`;
        setTimeout(() => customMaskIn(opacity + 0.05), 50);
      } else {
        const oldBackground = document.querySelector(
          "div[data-rift]"
        ) as unknown as HTMLDivElement;
        oldBackground.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
        const oldLossScreen = document.querySelector(
          "div[data-loss]"
        ) as unknown as HTMLDivElement;
        oldLossScreen.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
        const teamPlayerCards = document.querySelectorAll(
          "div[data-player-card]"
        );
        const oldBackground2 = document.querySelector(
          "div[data-roles]"
        ) as unknown as HTMLDivElement;
        oldBackground2.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
        //move player cards
        setGameFinished(true);

        setTimeout(() => customMaskOut(1), 1000);
      }
    }
    async function customMaskOut(opacity: number) {
      const background = document.querySelector(
        "div[data-mask]"
      ) as unknown as HTMLDivElement;

      if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 0) {
        background.style.background = `linear-gradient(rgba(0, 0, 0, ${
          opacity - 0.05
        }), rgba(0, 0, 0, ${opacity - 0.05}))`;
        setTimeout(() => customMaskOut(opacity - 0.05), 50);
      } else {
        /*text about game being won*/
      }
    }
    customMaskIn(0);
  };
  const fadeToLoss = () => {
    async function customMaskIn(opacity: number) {
      const background = document.querySelector(
        "div[data-mask]"
      ) as unknown as HTMLDivElement;
      if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 1) {
        background.style.background = `linear-gradient(rgba(0, 0, 0, ${
          opacity + 0.05
        }), rgba(0, 0, 0, ${opacity + 0.05}))`;
        setTimeout(() => customMaskIn(opacity + 0.05), 50);
      } else {
        const oldBackground = document.querySelector(
          "div[data-rift]"
        ) as unknown as HTMLDivElement;
        oldBackground.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
        const teamPlayerCards = document.querySelectorAll(
          "div[data-player-card]"
        );
        const oldBackground2 = document.querySelector(
          "div[data-roles]"
        ) as unknown as HTMLDivElement;
        oldBackground2.style.background = `linear-gradient(rgba(255, 255, 255, 0), rgba(255, 255, 255, 0))`;
        //move player cards
        setGameFinished(true);
        setTimeout(() => customMaskOut(1), 1000);
      }
    }
    async function customMaskOut(opacity: number) {
      const background = document.querySelector(
        "div[data-mask]"
      ) as unknown as HTMLDivElement;

      if (Math.round((opacity + Number.EPSILON) * 100) / 100 != 0) {
        background.style.background = `linear-gradient(rgba(0, 0, 0, ${
          opacity - 0.05
        }), rgba(0, 0, 0, ${opacity - 0.05}))`;
        setTimeout(() => customMaskOut(opacity - 0.05), 50);
      } else {
        /* add text about loss*/
      }
    }
    customMaskIn(0);
  };

  useEffect(() => {
    console.log(gameStage, "starting gmae stage");
    if (gameStage == 1) {
      const numOfEvents = 1;
      let events = [];
      while (events.length != numOfEvents) {
        events.push(Math.floor(Math.random() * r1po.length + 1));
      }
      if (events.length) handleEvents(1, events);
      else setGameStage(gameStage + 1);
    } else if (gameStage == 2) {
      const numOfEvents = 1;
      let events = [];
      while (events.length != numOfEvents) {
        events.push(Math.floor(Math.random() * r2po.length + 1));
      }
      handleEvents(2, events);
    } else if (gameStage == 3) {
      const numOfEvents = 1;
      let events = [];
      while (events.length != numOfEvents) {
        events.push(Math.floor(Math.random() * r3po.length + 1));
      }
      handleEvents(3, events);
      //setGameStage(gameStage + 1);
    } else if (gameStage == 4) {
      const numOfEvents = 1;
      let events = [];
      while (events.length != numOfEvents) {
        events.push(Math.floor(Math.random() * r4po.length + 1));
      }
      handleEvents(4, events);
    } else if (gameStage == 5) {
      const numOfEvents = 1;
      let events = [];
      while (events.length != numOfEvents) {
        events.push(Math.floor(Math.random() * r5po.length + 1));
      }
      handleEvents(5, events);
      //  setGameStage(gameStage + 1);
    } else if (gameStage > 5) {
      handleEndofGame();
      setShowButtons([]);
      addTeamPlayers([]);
      setEnemyPlayers([]);
    }
  }, [gameStage]);

  async function playerSelect(role: string) {
    let tPlayers: IPlayerData[] = [];

    async function callbackFunction() {
      postData("/api/fivePlayers", { role: role }).then((data) => {
        if (players.length != 5) setPlayers(data);
      });
    }
    if (players.length != 5) callbackFunction();
  }

  const roleSelector = (): ReactElement => {
    if (!roleSelect) return <></>;
    if (roleSelect == 1) {
      playerSelect("TOP");
    } else if (roleSelect == 2) {
      playerSelect("JG");
    } else if (roleSelect == 3) {
      playerSelect("MID");
    } else if (roleSelect == 4) {
      playerSelect("ADC");
    } else if (roleSelect == 5) {
      playerSelect("SUP");
    } else {
      return <></>;
    }
    return (
      <div className={classes.fivePlayerContainer}>
        {players.map((player: IPlayerData, index: number) => {
          const playerCard = require(`../../public/images/playerCards/${player.Player.split(
            " "
          ).join("_")}.png`);

          return (
            <div className={classes.PlayerCard} data-player-card>
              <button
                onClick={() => {
                  let existingPlayers = [...teamPlayers];
                  existingPlayers.push(player);
                  addTeamPlayers(existingPlayers);
                  setRoleSelect(roleSelect + 1);

                  setPlayers([]);
                }}
                style={{ background: "none", border: "none" }}
              >
                <Image
                  src={playerCard}
                  width={200}
                  height={300}
                  layout={"fixed"}
                />
              </button>
            </div>
          );
        })}
        <div></div>
      </div>
    );
  };

  const smallRisk = () => {
    const teamOdds = eventPlayers[0].reduce((x, y) => x + y.Overall, 0);
    const enemyOdds = eventPlayers[1].reduce((x, y) => x + y.Overall, 0);
    const playerIsWinner =
      Math.floor(Math.random() * (teamOdds + enemyOdds)) <= teamOdds;
    if (playerIsWinner) {
      setPlayerPoints(playerPoints + gameStage);
    } else {
      setEnemyPoints(enemyPoints + gameStage);
    }
    // handleEventEnd(playerIsWinner);
  };

  const midRisk = () => {
    const teamOdds = eventPlayers[0].reduce((x, y) => x + y.Overall, 0);
    const enemyOdds = eventPlayers[1].reduce((x, y) => x + y.Overall, 0);
    const playerIsWinner =
      Math.floor(Math.random() * (teamOdds + enemyOdds)) <= teamOdds;
    if (playerIsWinner) {
      setPlayerPoints(playerPoints + 2 * gameStage);
    } else {
      setEnemyPoints(enemyPoints + 2 * gameStage);
    }
    //handleEventEnd(playerIsWinner);
  };

  const bigRisk = () => {
    const teamOdds = eventPlayers[0].reduce((x, y) => x + y.Overall, 0);
    const enemyOdds = eventPlayers[1].reduce((x, y) => x + y.Overall, 0);
    const playerIsWinner =
      Math.floor(Math.random() * (teamOdds + enemyOdds)) <= teamOdds;
    if (playerIsWinner) {
      setPlayerPoints(playerPoints + 3 * gameStage);
    } else {
      setEnemyPoints(enemyPoints + 3 * gameStage);
    }
    // handleEventEnd(playerIsWinner);
  };

  const handleEventEnd = (playerWon: boolean) => {
    const startEvent = (text: string): void => {
      setTimeout(() => {
        addToTopText(text);
        setTimeout(() => {}, 8000);
      }, 1000);
    };

    console.log(eventPlayers);
    if (playerWon) {
      switch (eventNumber) {
        case 1:
          /*you won*/

          startEvent(`After gracefully dodging a skillshot ${eventPlayers[0][0].Player} engages! Although ${eventPlayers[1][0].Player} puts
          up a fight, they ultimately die, giving  ${eventPlayers[0][0].Player} the advantage.`);

          break;
        case 2:
          /*you won*/

          startEvent(`Using their superb teamwork ${eventPlayers[0][0].Player} and ${eventPlayers[0][1].Player} trap ${eventPlayers[1][0].Player}! ${eventPlayers[1][1].Player} tries
          to help, but is too late. Your team secures the kill and gets out alive`);

          break;
        case 3:
          /*you won*/
          startEvent(`After some skirmishing,  ${
            eventPlayers[0][Math.floor(Math.random() * 5)].Player
          } hits a huge ultimate, decimating the other team. Then,  ${
            eventPlayers[0][Math.floor(Math.random() * 5)].Player
          }
          cleans up the rest of the enemy team. ACE!`);
          break;
        case 4:
          /*you won*/
          if (isEnemyEvent) {
            startEvent(
              `${eventPlayers[1][1].Player} walks up behind you, but ${eventPlayers[0][0].Player} flashes out at the last second, staying alive to see another fight.`
            );
          } else {
            startEvent(
              `${eventPlayers[0][1].Player} gets the jump on ${eventPlayers[1][0].Player}, and with the support of ${eventPlayers[0][0].Player} your team gets the shutdown on ${eventPlayers[1][0].Player}`
            );
          }
          break;
        case 5:
          if (isEnemyEvent) {
            startEvent(
              `After the other team starts rift herald, your top, mid, and jungle team up to push them off, allowing you to secure the eye of the herald`
            );
          } else {
            startEvent(
              `You kill the rift herald, letting you gain the upper hand in gold and pressure`
            );
          }
          break;
        case 6:
          if (isEnemyEvent) {
            startEvent(
              `${eventPlayers[1][1].Player} walks up behind you, but ${eventPlayers[0][0].Player} flashes out at the last second, staying alive to see another fight.`
            );
          } else {
            startEvent(
              `${eventPlayers[0][1].Player} gets the jump on ${eventPlayers[1][0].Player}, and with the support of ${eventPlayers[0][0].Player} your team gets the shutdown on ${eventPlayers[1][0].Player}`
            );
          }
          break;
        case 7:
          if (isEnemyEvent) {
            startEvent(
              `${eventPlayers[0][0].Player} steals the first drake and makes it out alive!`
            );
          } else {
            startEvent(
              `Your team gets the first drake of the game, a huge boost to your confidence and extending your lead`
            );
          }
          break;
        case 8:
          if (isEnemyEvent) {
            startEvent(
              `${eventPlayers[0][0].Player} steals the soul drake and makes it out alive!`
            );
          } else {
            startEvent(
              `Your team gets the soul drake, a huge boost to your stats and extending your lead`
            );
          }
          break;
        case 9:
          if (isEnemyEvent) {
            startEvent(
              `${eventPlayers[0][0].Player} steals the elder drake and makes it out alive!`
            );
          } else {
            startEvent(
              `Your team gets the elder drake, a huge boost to your team power and extending your lead`
            );
          }
          break;
        case 10:
          startEvent(
            `${eventPlayers[0][0].Player} backdoors the other team! You win!`
          );
          break;
        case 11:
          if (isEnemyEvent) {
            startEvent(
              `${eventPlayers[0][0].Player} steals baron in exchange for their life!`
            );
          } else {
            startEvent(
              `Your team slays baron. With a 3 minute Baron powerplay, your team pulls ahead in the game!`
            );
          }
          break;
      }
    } else {
      switch (eventNumber) {
        case 1:
          /*you won*/
          `After gracefully dodging a skillshot ${eventPlayers[1][0].Player} engages! Although ${eventPlayers[0][0].Player} puts
          up a fight, they ultimately die, giving  ${eventPlayers[1][0].Player} the advantage.`;
          break;
        case 2:
          /*you won*/
          `Using their superb teamwork ${eventPlayers[1][0].Player} and ${eventPlayers[1][1].Player} trap ${eventPlayers[0][0].Player}! ${eventPlayers[0][1].Player} tries
         to help, but is too late. The opponent's team secures the kill and gets out alive`;
          break;
        case 3:
          /*you won*/
          `After some skirmishing,  ${
            eventPlayers[1][Math.floor(Math.random() * 5)].Player
          } hits a huge ultimate, decimating the other team. Then,  ${
            eventPlayers[1][Math.floor(Math.random() * 5)].Player
          }
          cleans up the rest of your team. ACE!`;
          break;
        case 4:
          /*you won*/
          if (isEnemyEvent) {
            `${eventPlayers[0][1].Player} walks up behind the opponent, but ${eventPlayers[1][0].Player} flashes out at the last second, staying alive to see another fight.`;
          } else {
            `${eventPlayers[1][1].Player} gets the jump on ${eventPlayers[0][0].Player}, and with the support of ${eventPlayers[1][0].Player} their team gets the shutdown on ${eventPlayers[0][0].Player}`;
          }
          break;
        case 5:
          if (isEnemyEvent) {
            `After your team starts rift herald, the other team's top, mid, and jungle team up to push you off, allowing them to secure the eye of the herald`;
          } else {
            `The other team kill the rift herald, letting them gain the upper hand in gold and pressure`;
          }
          break;
        case 6:
          if (isEnemyEvent) {
            `${eventPlayers[0][1].Player} walks up behind the opponent, but ${eventPlayers[1][0].Player} flashes out at the last second, staying alive to see another fight.`;
          } else {
            `${eventPlayers[1][1].Player} gets the jump on ${eventPlayers[0][0].Player}, and with the support of ${eventPlayers[1][0].Player} their team gets the shutdown on ${eventPlayers[0][0].Player}`;
          }
          break;
        case 7:
          if (isEnemyEvent) {
            `${eventPlayers[1][0].Player} steals the first drake and makes it out alive!`;
          } else {
            `The other team team gets the first drake of the game, a huge boost to their confidence and extending their lead`;
          }
          break;
        case 8:
          if (isEnemyEvent) {
            `${eventPlayers[1][0].Player} steals the soul drake and makes it out alive!`;
          } else {
            `The other team gets the soul drake, a huge boost to their stats and extending their lead`;
          }
          break;
        case 9:
          if (isEnemyEvent) {
            `${eventPlayers[1][0].Player} steals the elder drake and makes it out alive!`;
          } else {
            `The other team gets the elder drake, a huge boost to their team power and extending their lead`;
          }
          break;
        case 10:
          `${eventPlayers[0][0].Player} fails to backdoor the other team. Your team falls even further behind`;
          break;
        case 11:
          if (isEnemyEvent) {
            `${eventPlayers[1][0].Player} steals baron in exchange for their life!`;
          } else {
            `The other team slays baron. With a 3 minute Baron powerplay, the other team pulls ahead in the game!`;
          }
          break;
      }
    }
  };

  useEffect(() => {
    if (gameChoice == -1) return;
    if (gameChoice == 5) {
      midRisk();
    }
    if (gameChoice == 0) {
      if (
        (eventNumber > -1 && eventNumber < 3) ||
        eventNumber == 4 ||
        eventNumber == 6 ||
        eventNumber == 10
      ) {
        return;
      } else if (
        eventNumber == 3 ||
        eventNumber == 7 ||
        eventNumber == 8 ||
        eventNumber == 9 ||
        eventNumber == 11
      ) {
        smallRisk();
      }
    }
    if (gameChoice == 1) {
      if (
        eventNumber == 1 ||
        eventNumber == 2 ||
        eventNumber == 4 ||
        eventNumber == 6 ||
        eventNumber == 7 ||
        eventNumber == 8
      ) {
        midRisk();
      } else {
        bigRisk();
      }
    }
  }, [gameChoice]);

  const grid = (): ReactElement => {
    const teamPlayerCards = teamPlayers.map((player) =>
      require(`../../public/images/playerCards/${player.Player.split(" ").join(
        "_"
      )}.png`)
    );
    const enemyPlayerCards = enemyPlayers.map((player) =>
      require(`../../public/images/playerCards/${player.Player.split(" ").join(
        "_"
      )}.png`)
    );
    return (
      <div className={classes.wrapper}>
        <div className={classes.row}>
          <div className={classes.column}>
            {" "}
            <div style={{ width: 1, height: 1 }}> </div>
          </div>
          <div className={classes.column}>
            {" "}
            <div style={{ width: 1, height: 1 }}> </div>
          </div>
          <div className={classes.column}>
            {" "}
            <div style={{ width: 1, height: 1 }}> </div>
          </div>
          <div className={classes.column}>
            {" "}
            <div style={{ width: 1, height: 1 }}> </div>
          </div>
          <div className={classes.column}>
            {" "}
            <div style={{ width: 1, height: 1 }}> </div>
          </div>
          <div className={classes.column}>
            <Image
              src={teamPlayerCards[3]}
              width={140}
              height={210}
              layout={"fixed"}
            />
          </div>
          <div className={classes.column}>
            <Image
              src={teamPlayerCards[4]}
              width={140}
              height={210}
              layout={"fixed"}
            />
          </div>
          <div className={classes.column}> </div>
          <div className={classes.column}> </div>
          <div className={classes.column}> </div>
        </div>
        <div className={classes.row}>
          <div className={classes.column}>
            <div style={{ width: 1, height: 1 }}> </div>
          </div>
          <div className={classes.column}>
            <div style={{ width: 1, height: 1 }}> </div>
          </div>
          <div className={classes.column}>
            <div style={{ width: 1, height: 1 }}> </div>
          </div>
          <div className={classes.column}>
            {" "}
            <div> </div>
          </div>
          <div className={classes.column}>
            {" "}
            <div> </div>
          </div>
          <div className={classes.column}>
            <div> </div>{" "}
          </div>
          <div className={classes.column}>
            {" "}
            <div> </div>
          </div>
          <div className={classes.column}>
            <div> </div>{" "}
          </div>
          <div className={classes.column}>
            {" "}
            <div> </div>
          </div>
          <div className={classes.column}>
            <div> </div>
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}>
            {" "}
            <Image
              src={enemyPlayerCards[4]}
              width={140}
              height={210}
              layout={"fixed"}
            />
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}>
            {" "}
            <Image
              src={teamPlayerCards[2]}
              width={140}
              height={210}
              layout={"fixed"}
            />
          </div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}> </div>
        </div>
        <div className={classes.row}>
          <div className={classes.column}></div>
          <div className={classes.column}>
            {" "}
            <Image
              src={teamPlayerCards[1]}
              width={140}
              height={210}
              layout={"fixed"}
            />
          </div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}>
            {" "}
            <Image
              src={enemyPlayerCards[2]}
              width={140}
              height={210}
              layout={"fixed"}
            />
          </div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}>
            {" "}
            <Image
              src={enemyPlayerCards[3]}
              width={140}
              height={210}
              layout={"fixed"}
            />
          </div>
        </div>
        <div className={classes.row}>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
        </div>
        <div className={classes.row}>
          <div className={classes.column}>
            {" "}
            <Image
              src={teamPlayerCards[0]}
              width={140}
              height={210}
              layout={"fixed"}
            />
          </div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}>
            {" "}
            <Image
              src={enemyPlayerCards[1]}
              width={140}
              height={210}
              layout={"fixed"}
            />
          </div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
        </div>
        <div className={classes.row}>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}>
            {" "}
            <Image
              src={enemyPlayerCards[0]}
              width={140}
              height={210}
              layout={"fixed"}
            />
          </div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
          <div className={classes.column}></div>
        </div>
      </div>
    );
  };

  useEffect(() => {
    start((text) => console.log(text));
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
              <div className={classes.textWrapper}>
                <div className={classes.topText} data-top-text></div>
              </div>

              {roleSelect != 6 && (
                <div className={classes.roleSelect}>{roleSelector()}</div>
              )}

              {showButtons.length && (
                <div className={classes.buttonOptions}>
                  {showButtons.map((text, index) => {
                    return (
                      <button
                        onClick={() => {
                          setGameChoice(index);
                          setGameStage(gameStage + 1);
                          removeAllText();
                        }}
                        className={classes.buttonop}
                      >
                        <div>
                          <span>{text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {teamPlayers.length == 5 && enemyPlayers.length == 5 && (
                <div className={classes.playersOnRift}>{grid()}</div>
              )}
              {gameFinished && (
                <div>
                  <button
                    onClick={() => router.push("/")}
                    className={classes.endbutton}
                  >
                    <div>
                      <span>Home Page</span>
                    </div>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayComponent;
