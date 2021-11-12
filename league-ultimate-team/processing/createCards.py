import pandas as pd
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
import os
import time

def createCards(df, driver, start=0, end=165):

    # Webpage elements
    cardListButton = driver.find_element(By.ID, 'card_selector_btn')
    downloadButton = driver.find_element(By.XPATH, '//*[@id="createCard"]/div[1]/div/div/button[1]')
    bronzeCard = driver.find_element(By.XPATH, '//*[@id="card_selector_modal_22"]/div/div/div[2]/div/div[4]/a')
    silverCard = driver.find_element(By.XPATH, '//*[@id="card_selector_modal_22"]/div/div/div[2]/div/div[5]/a')
    goldCard = driver.find_element(By.XPATH, '//*[@id="card_selector_modal_22"]/div/div/div[2]/div/div[6]/a')
    legendCard = driver.find_element(By.XPATH, '//*[@id="card_selector_modal_22"]/div/div/div[2]/div/div[17]/a')
    name = driver.find_element(By.ID, 'form-card-name')
    overall = driver.find_element(By.ID, 'form-card-rating')
    position = driver.find_element(By.ID, 'form-card-position')
    headshot = driver.find_element(By.ID, 'form-card-custom-image')
    team = driver.find_element(By.ID, 'form-card-club-text')
    nation = driver.find_element(By.ID, 'form-card-nation-text')

    for i in range(start, end):

        # Change card type
        cardListButton.click()
        driver.implicitly_wait(10)
        cardType = df['Card Type'][i]
        if cardType == 'Bronze':
            bronzeCard.click()
        elif cardType == "Silver":
            silverCard.click()
        elif cardType == "Gold":
            goldCard.click()
        elif cardType == "Legend":
            legendCard.click()
        else:
            print("ERROR")

        # Change card text
        name.clear()
        name.send_keys(df['Player'][i])
        overall.clear()
        overall.send_keys(str(int(df['Overall'][i])))
        position.clear()
        position.send_keys(df['Position'][i])

        stats = [df['Laning'][i], df['Carry'][i], df['Vision'][i], df['Versatility'][i], df['Threat'][i], df['Experience'][i]]

        for j in range(len(stats)):
            textBox = driver.find_element(By.ID, 'form-card-attr' + str(j+1))
            textBox.clear()
            textBox.send_keys(str(int(stats[j])))

        # Change images
        headshot.clear()
        headshot.send_keys(df['Headshot Link'][i])
        team.clear()
        team.send_keys(df['Team Logo Link'][i])
        nation.clear()
        nation.send_keys(df['Flag Link'][i])

        # Does the card look good enough?
        while(True):
            closeDriver = input("Go to next card (Y/N): ")
            if closeDriver == "Y":
                downloadButton.click()
                print("Downloaded", df['Player'][i] + ".png")
                break


if __name__ == "__main__":
    # Initialization
    opt = webdriver.ChromeOptions()
    opt.add_experimental_option('excludeSwitches', ['enable-logging'])
    driver = webdriver.Chrome(executable_path=ChromeDriverManager().install(), options=opt)
    link = 'https://www.fifarosters.com/create-card'
    datasetPath = os.path.join(os.path.dirname(__file__), '../data/mainDataset.csv')
    cardStats = pd.read_csv(datasetPath)

    # Set up website
    driver.get(link)
    expandOptions = driver.find_element(By.XPATH, '//*[@id="createCardForm"]/div[3]/div[1]/h4/a')
    expandOptions.click()
    driver.implicitly_wait(10)
    customImageButton = driver.find_element(By.XPATH, '//*[@id="form-image-type-custom"]')
    customImageButton.click()
    driver.implicitly_wait(10)
    blankBottomButton = driver.find_element(By.XPATH, '//*[@id="form-card-bottom-blank"]')
    blankBottomButton.click()

    # Change stat titles
    statTitles = ['LAN', 'CAR', 'VIS', 'VER', 'THR', 'EXP']
    for i in range(len(statTitles)):
        textBox = driver.find_element(By.ID, 'form-card-attr' + str(i+1) + '-text')
        driver.implicitly_wait(10)
        textBox.clear()
        textBox.send_keys(statTitles[i])

    # Create cards
    createCards(cardStats, driver)
    time.sleep(3)
    driver.quit()
