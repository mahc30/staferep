import os
from selenium import webdriver

directory = 'D:\DasSache\Bases\Red de Escuelas de Música\REPERTORIO ESCUELA SANTA FE\REPERTORIO ORQUESTA'
dirs = []

dirs = os.listdir(directory)

for i in range(0, len(dirs)):
    dirs[i] = dirs[i].lower().title()

browser = webdriver.Firefox()
print(dirs)