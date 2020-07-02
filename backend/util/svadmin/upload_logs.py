'''
Upload server logs to mongo
Runs with a crontab every 12H
'''

from pymongo import MongoClient
from pprint import pprint
import gridfs
import os

credentials = ""

with open('../secrets/credentials', 'r') as f:
    credentials = f.read()

credentials = credentials.split('\n')
usr = credentials[0]
pw = credentials[1]
collection = "logs"
url = "mongodb+srv://" + usr + ":" + pw + "@cluster0-jxu3e.gcp.mongodb.net/" + collection + "?retryWrites=true&w=majority"

#Connect to db
db = MongoClient(url).obras

# Issue the serverStatus command and print the results
serverStatusResult=db.command("serverStatus")
#pprint(serverStatusResult)

#Read File to upload

logs_path = '../secrets/logs'
fs = gridfs.GridFS( db )
with open('../secrets/logs') as f:
    fileID = fs.put(f.read(), encoding='utf-8')
out = fs.get(fileID).read()

os.remove(logs_path)

def touch(fname, mode=0o666, dir_fd=None, **kwargs):
    flags = os.O_CREAT | os.O_APPEND
    with os.fdopen(os.open(fname, flags=flags, mode=mode, dir_fd=dir_fd)) as f:
        os.utime(f.fileno() if os.utime in os.supports_fd else fname,
            dir_fd=None if os.supports_fd else dir_fd, **kwargs)

touch(logs_path)
print(out)