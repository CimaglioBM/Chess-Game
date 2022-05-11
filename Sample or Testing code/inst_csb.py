from distutils.util import execute
import sqlite3, csv

#Connecting to sqlite
conn = sqlite3.connect('C:/Users/Samma/OneDrive/Desktop/Repositories/Chess/Chess-Game/data.db')

#Creating a cursor object using the cursor() method
cursor = conn.cursor()

a_file = open("C:/Users/Samma/OneDrive/Desktop/Repositories/Chess/Chess-Game/openings.csv")
rows = csv.reader(a_file)
cursor.executemany("INSERT INTO opening VALUES (?, ?, ?)", rows)
#Commit your changes in the database
conn.commit()

#Closing the connection
conn.close()