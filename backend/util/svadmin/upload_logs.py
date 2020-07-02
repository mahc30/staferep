'''
Upload server logs to mongo
Runs with a crontab every 12H
'''

from pymongo import MongoClient
from pprint import pprint
from pathlib import Path
import gridfs
import os

credentials = ""
with open('/home/miguelangel_hincapie15/staferep/backend/util/secrets/credentials', 'r') as f:
    credentials = f.read()

credentials = credentials.split('\n')
usr = credentials[0]
usr = usr.replace('\r', '')
pw = credentials[1]
pw = pw.replace('\r', '')
collection = "logs"
url = "mongodb+srv://" + usr + ":" + pw + "@cluster0-jxu3e.gcp.mongodb.net/" + collection + "?retryWrites=true&w=majority"

#Connect to db
db = MongoClient(url).obras

# Issue the serverStatus command and print the results
serverStatusResult=db.command("serverStatus")
#pprint(serverStatusResult)

#Read File to upload

logs_path = '/home/miguelangel_hincapie15/staferep/backend/util/secrets/logs'
fs = gridfs.GridFS( db )
with open(logs_path) as f:
    fileID = fs.put(f.read(), encoding='utf-8')

os.remove(logs_path)
Path(logs_path).touch()

