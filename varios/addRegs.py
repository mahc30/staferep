import os
import collections
import time

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select

print("Agrupacion:")
level = input()

path = "/home/staferep/varios/REPERTORIO ESCUELA SANTA FE/REPERTORIO "
path = path + level.upper() + "/"

obras = {}

#Then search for files in each folder
#In an attempt to find the score i search for the largest file
#As the score is supposed to be a combination of all other files
#It should be larger than them

#This code is from: https://www.geeksforgeeks.org/finding-the-largest-file-in-a-directory-using-python/
size = 0
max_size = 0
max_file = "" 
  
for folder, subfolders, files in os.walk(path): 
    
    # checking the size of each file 
    for file in files: 
        size = os.stat(os.path.join( folder, file  )).st_size 
         
        # updating maximum size 
        if size>max_size: 
            max_size = size 
            max_file = os.path.join( folder, file  ) 
        
    if not subfolders:
        myfolder = folder.rsplit("/", 1)
        myfolder = myfolder[1].title()

        if max_file not in obras:
            if(max_file.find(".pdf") != -1): #Filtrar archivos que no son pdf
                obras[myfolder] = max_file
            else:
                obras[myfolder] = -1

    max_size = 0

obras = collections.OrderedDict(sorted(obras.items()))

browser = webdriver.Firefox(executable_path="/home/staferep/varios/geckodriver")
browser.get("http://localhost:5000/login")

login_input = browser.find_element_by_css_selector("div.row:nth-child(1) > input:nth-child(1)")
login_button = browser.find_element_by_css_selector(".waves-effect")

login_input.send_keys("securepassword")
login_button.click()

open_table_button = WebDriverWait(browser, 20).until(EC.presence_of_element_located((By.ID, "go_table")))
open_table_button.click()


sleep_counter = 0
for name, pdf in obras.items():
    try:
        add_obra_button = WebDriverWait(browser, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "button.svelte-wr7rv1")))
    except err:
        print("Error add obra click, trying again")
        add_obra_button = WebDriverWait(browser, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR, "button.svelte-wr7rv1")))

    try:
        add_obra_button.click()
    except err:
        print("Error add obra click, trying again")
        add_obra_button.click()
    
    time.sleep(0.5) #Because if it goes to fast it fails apparently -_-

    #Have to reassign it every iteration, it breaks otherwise, cuz ObJeCts Ar NOt In DoM anYmoRE

    obra_name_input = WebDriverWait(browser, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR,".pl-4 > input:nth-child(1)")))
    obra_composer_input = WebDriverWait(browser, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR,"td.svelte-wr7rv1:nth-child(2) > input:nth-child(1)")))
    obra_level_select = Select(browser.find_element_by_css_selector('td.svelte-wr7rv1:nth-child(3) > div:nth-child(1) > select:nth-child(1)'))
    obra_file_input = WebDriverWait(browser, 20).until(EC.visibility_of_element_located((By.CSS_SELECTOR,"td.svelte-wr7rv1:nth-child(4) > input:nth-child(1)")))

    #Write stuff
    print("Sending: " + name)
    obra_name_input.send_keys(name)
    obra_composer_input.send_keys("Pendiente")
    obra_level_select.select_by_visible_text(level.title())

    if(pdf != -1): #If file exists
        print("File: " + pdf)
        obra_file_input.send_keys(pdf)
    
    #Only send when everything is done 
    submit_button = WebDriverWait(browser, 20).until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button.svelte-wr7rv1")))
    submit_button.click()

    #so the program will try to upload a ton of files in seconds and bandwidth can't keep up
    #eventually mongo throws a connection timeout and driver fails
    #hopefully a 5 seconds sleep will fix it
    time.sleep(5)
    

browser.quit()