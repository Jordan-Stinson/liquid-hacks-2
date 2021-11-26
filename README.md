# League of Legends: Ultimate Team

![image](/league-ultimate-team/public/images/devpostThumbnail.png)

## Inspiration
Watching Worlds 2021 together reignited our passion for League of Legends e-sports, but between work and school, we don't have much time to watch every game and stay up to date. We wanted to create an e-sports game that both casual watchers and hardcore fans could enjoy.

## What it does
League of Legends: Ultimate Team is an interactive game that combines the team building of a fantasy league with the interactive gameplay of a "choose your own adventure" to create an exhilarating experience for e-sports fans.

First, pick your team of 5 active pro players from across the world to face off against our custom-built AI. Then, use your game knowledge and strategic insight to make interactive decisions and lead your team to victory!

**Player card metrics**
- Laning (LAN): A combination of first blood percentage, gold difference @ 10 minutes, CS difference @ 10 minutes, and XP difference @ 10 minutes. This metric helps determine who wins early game 1v1 and 2v2 skirmishes.
- Carry Score (CAR): Based on XP, gold, and kill share, Carry Score plays a major role in deciding who wins a teamfight
- Vision Score (VIS): A player's Vision Score depends on the number of wards they place and clear every minute. Vision score can help you spot the enemy team trying to sneak objectives 👀.
- Versatility (VER): This indicator measures the breadth and depth of a player's champion pool. A player with a higher versatility score is less likely to receive a "Banned Out" debuff when they load into the game
- Threat (THR): A player's Threat rating depends on how many bans they draw per game on average. It functions in a similar manner to Versatility
- Experience (EXP): This indicator takes a player's entire career into account - number of games played, prestige of tournaments attended, and number of competitions won. This is used to determine whether players will make the correct decision in high-pressure situations.

## How we built it
Frontend: Next.js, CSS

Backend: Node.js, Python

We also used the Liquipedia API.

## Challenges we ran into
Writing clean and efficient code to make sure we didn't exceed the rate limits for API calls.

Creating objective metrics and classifying players in a non-biased manner.

## Accomplishments that we're proud of
Ensuring that every single metric and statistic on each player card makes sense 

## What's next for League of Legends: Ultimate Team
Adding support for other regions (e.g. LMS, CBLOL, CIS, etc.)
