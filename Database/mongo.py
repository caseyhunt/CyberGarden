import sys
import numpy as np
import json
import time
from pymongo import MongoClient


#Open CSV file to read the filename
if(len(sys.argv)<2):
    print("please give csv file");
    exit(0)

filename=sys.argv[1]
fd=open(filename);

Lines = fd.readlines()
col=Lines[0].strip().split("\n")[0].split(",")#Get the column names

col1=''+col[0]
col2=''+col[1]
col3=''+col[2]
col4=''+col[3]
col5=''+col[4]
col6=''+col[5]
col7=''+col[6]
col8=''+col[7]
col9=''+col[8]
col10=''+col[9]

#connect to locale data base or remote data base
try:
	conn = MongoClient()
	print("Connected successfully!!!")
except:
	print("Could not connect to MongoDB")

# database name: mydatabase
db = conn.cybergarden #Name of database is cybergarden
collection=db.sensors #Name of the collection is sensors

flag=0#Skip first line
for line in Lines:
    if(flag==0): #Skip first line that has column name
        flag=1
        continue
    values=line.strip().split(",") #get all the fields values 
    #Read the current time in seconds from epoch
    etime=time.time()
    x='{"'+col1+'":'+str(etime)+',"'+col2+'":'+values[1]+',"'+col3+'":'+values[2]+',"'+col4+'":'+values[3]+',"'+col5+'":'+values[4]+',"'+col6+'":'+values[5]+',"'+col7+'":'+values[6]+',"'+col8+'":'+values[7]+',"'+col9+'":'+values[8]+',"'+col10+'":'+values[9]+'}'
    y = json.loads(x)#create json object
    try:
        db.collection.insert(y)#insert into the database
    except:
        print("Could not insert into the data base")

fd.close()#close the CSV file
print ("Data base cybergarden is created and all json objects are inserted!!!");

'''
#Print the database if needed
cursor = db.collection.find()
for record in cursor:
    print(record)

#Querry based on time range
db.collection.find({"time":{$gte:1620154663,$lt:1620154664}}).pretty()
'''


