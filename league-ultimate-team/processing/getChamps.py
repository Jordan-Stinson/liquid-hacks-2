import pandas as pd
import csv
import os

def getChampionPositions(region):
    top, jg, mid, adc, sup = [], [], [], [], []
    for i in range(len(region)):
        if region['Pos'][i] == 'Top':
            top.append(region['Champion'][i])
        elif region['Pos'][i] == 'Jungle':
            jg.append(region['Champion'][i])
        elif region['Pos'][i] == 'Middle':
            mid.append(region['Champion'][i])
        elif region['Pos'][i] == 'ADC':
            adc.append(region['Champion'][i])
        elif region['Pos'][i] == 'Support':
            sup.append(region['Champion'][i])
    table = [top, jg, mid, adc, sup]
    return table


def printDict(d):
    for key in d:
        print(key + ":", d[key])


def getThreat(df, champDict):
    threatDict = {}
    for i in range(len(df)):
        player = df['player'][i]
        pool = champDict[df['leaguePosition'][i]]

        if player not in threatDict:
            threatDict[player] = {}
            threatDict[player]["gamesPlayed"] = 1
            threatDict[player]["bannedAgainst"] = 0
        else:
            threatDict[player]["gamesPlayed"] += 1
        
        for j in range(1, 5):
            bannedChamp = df['ban' + str(j)][i]
            if bannedChamp in pool:
                threatDict[player]["bannedAgainst"] += 1
    return threatDict


if __name__ == "__main__":
    # Get champs
    leagues = ['lck', 'lec', 'lcs']
    positions = ['TOP', 'JG', 'MID', 'ADC', 'SUP']
    champDict = {}
    for league in leagues:
        path = os.path.join(os.path.dirname(__file__), '..\\data\\' + league + 'Champs.csv')
        champions = pd.read_csv(path)
        table = getChampionPositions(champions)
        for i in range(len(positions)):
            champDict[league + positions[i]] = table[i]
    
    # Get threat
    datasetPath = os.path.join(os.path.dirname(__file__), '..\\data\\threatDataset.csv')
    threatDataset = pd.read_csv(datasetPath)
    threatScores = getThreat(threatDataset, champDict)
    printDict(threatScores)

    # Write threat to CSV
    output = []
    for player in threatScores:
        games = threatScores[player]["gamesPlayed"]
        banned = threatScores[player]["bannedAgainst"]
        entry = [player, games, banned]
        output.append(entry)
    with open('playerThreats.csv', 'w', newline="") as csvfile:
        writer = csv.writer(csvfile)
        header = ['Player', 'gamesPlayed', 'bannedAgainst', 'rawBanScore']
        writer.writerow(header)
        writer.writerows(output)
    